import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { exact,prepare,markSent,reconcile,failureState } from '../plugins/al-task-delivery/skills/al-task-delivery/scripts/receipt.mjs';
import { createClient,recordEndpoint,associationEndpoint } from '../scripts/al-hubspot-read.mjs';
const plan={task_id:'123',system:'asana',target_id:'123',action:'notes-update',before:{notes:'Original',completed:false},intended:{notes:'Original\nAcceptance marker',completed:false}};
async function sandbox(t) {const p=await mkdtemp(join(tmpdir(),'al-delivery-test-'));t.after(()=>rm(p,{recursive:true,force:true}));return p;}
test('second execution recognizes readback and produces no second write',async t=>{
  const dir=await sandbox(t);let current=plan.before,writes=0;
  for(let attempt=0;attempt<2;attempt++) {
    const prepared=await prepare(dir,plan,current);
    if(prepared.decision==='SKIP')continue;
    const sent=await markSent(dir,prepared.key,prepared.approval_digest,current);
    assert.equal(sent.decision,'WRITE_ONCE');writes++;current=plan.intended;
    assert.equal((await reconcile(dir,prepared.key,current)).state,'PASS');
  }
  assert.equal(writes,1);
});
test('ambiguous timeout that changed target reconciles without another write',async t=>{
  const dir=await sandbox(t),p=await prepare(dir,plan,plan.before);
  await markSent(dir,p.key,p.approval_digest,plan.before);
  assert.equal((await prepare(dir,plan,plan.before)).decision,'RECONCILE');
  assert.equal((await reconcile(dir,p.key,plan.intended)).state,'PASS');
  assert.equal((await prepare(dir,plan,plan.intended)).decision,'SKIP');
});
test('ambiguous timeout with unchanged target blocks automatic retry',async t=>{
  const dir=await sandbox(t),p=await prepare(dir,plan,plan.before);
  await markSent(dir,p.key,p.approval_digest,plan.before);
  assert.equal((await reconcile(dir,p.key,plan.before)).decision,'DO_NOT_RETRY');
  assert.equal((await prepare(dir,plan,plan.before)).decision,'RECONCILE');
});
test('wrong payload approval and concurrent drift prevent write',async t=>{
  const dir=await sandbox(t),p=await prepare(dir,plan,plan.before);
  assert.equal((await markSent(dir,p.key,'wrong',plan.before)).state,'BLOCKED');
  assert.equal((await markSent(dir,p.key,p.approval_digest,{notes:'Other',completed:false})).state,'BLOCKED');
});
test('verified external state drift cannot silently replay a historical action',async t=>{
  const dir=await sandbox(t);await prepare(dir,plan,plan.intended);
  assert.equal((await prepare(dir,plan,plan.before)).decision,'CONFLICT');
});
test('null, empty, missing, whitespace, and case remain distinct',()=>{
  for(const pair of [[{x:null},{x:''}],[{}, {x:null}],[{x:'A'},{x:'a'}],[{x:'a'},{x:' a'}]]) assert.equal(exact(...pair),false);
  assert.equal(exact({a:1,b:2},{b:2,a:1}),true);
});
test('permission, unavailable record and timeout preserve uncertainty',()=>{
  assert.equal(failureState({code:403}),'BLOCKED');assert.equal(failureState({code:404}),'BLOCKED');
  assert.equal(failureState({code:'MISSING_SCOPES'}),'BLOCKED');assert.equal(failureState({code:'TIMEOUT'}),'UNKNOWN');
});
test('API helper stops before CRM read on portal mismatch',async()=>{
  let calls=0;await assert.rejects(createClient(async()=>{calls++;return {stdout:'Account ID: 44020082\n'};}),/portal mismatch/);assert.equal(calls,1);
});
test('API helper uses explicit account and GET, never shell interpretation',async()=>{
  const calls=[];const c=await createClient(async(command,args)=>{calls.push([command,args]);return {stdout:calls.length===1?'Account ID: 5627913\n':JSON.stringify({id:'9',properties:{dealname:'Test'}})};});
  const r=await c.get(recordEndpoint('deals','9','dealname','contacts'));assert.equal(r.state,'PASS');
  assert.ok(calls.every(([command,args])=>command==='hs'&&args.includes('apartment_life_prod')));
  assert.ok(calls[1][1].includes('GET'));assert.ok(!calls[1][1].includes('--data'));
  assert.throws(()=>recordEndpoint('deals','9;rm','dealname'));assert.throws(()=>recordEndpoint('deals','9','x&archived=true'));
});
test('API permission errors yield BLOCKED with no fabricated record',async()=>{
  let count=0;const c=await createClient(async()=>{if(++count===1)return {stdout:'Account ID: 5627913\n'};const e=new Error('error');e.stdout=JSON.stringify({category:'MISSING_SCOPES'});throw e;});
  const r=await c.get(recordEndpoint('tickets','9'));assert.equal(r.state,'BLOCKED');assert.equal(r.data,null);
});
test('association cursor is explicit and a paginated result stays partial',async()=>{
  assert.ok(associationEndpoint('deals','9','contacts','2').endsWith('&after=2'));
  let count=0;const c=await createClient(async()=>({stdout:++count===1?'Account ID: 5627913\n':JSON.stringify({results:[],paging:{next:{after:'2'}}})}));
  assert.equal((await c.get(associationEndpoint('deals','9','contacts'))).coverage,'PARTIAL');
});
test('inline association pagination cannot look like complete coverage',async()=>{
  let count=0;const c=await createClient(async()=>({stdout:++count===1?'Account ID: 5627913\n':JSON.stringify({id:'9',associations:{contacts:{results:[],paging:{next:{after:'100'}}}}})}));
  assert.equal((await c.get(recordEndpoint('deals','9','dealname','contacts'))).coverage,'PARTIAL');
});
