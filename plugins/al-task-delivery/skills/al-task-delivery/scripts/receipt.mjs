import { readFile, writeFile, mkdir, rename, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export function canonical(value) {
  if(value === null || typeof value !== 'object') return JSON.stringify(value);
  if(Array.isArray(value)) return '['+value.map(canonical).join(',')+']';
  return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
}
export const exact = (a,b) => canonical(a) === canonical(b);
export function failureState(error) {
  const code=error?.code ?? error?.category ?? error?.status;
  return [401,403,404,'MISSING_SCOPES','NOT_FOUND','PORTAL_MISMATCH','PERMISSION_DENIED','TOOL_UNAVAILABLE'].includes(code) ? 'BLOCKED' : 'UNKNOWN';
}
export function actionKey(plan) {
  return createHash('sha256').update(canonical({task_id:plan.task_id,system:plan.system,target_id:plan.target_id,action:plan.action,intended:plan.intended})).digest('hex');
}
function validate(plan) {
  if(!/^\d+$/.test(plan.task_id??'') || !/^[A-Za-z0-9_-]+$/.test(plan.target_id??'')) throw new Error('Stable task_id and target_id required.');
  if(!['asana','hubspot','notion','sharepoint'].includes(plan.system) || typeof plan.action!=='string' || !plan.action) throw new Error('System/action required.');
  if(!Object.hasOwn(plan,'before') || !Object.hasOwn(plan,'intended')) throw new Error('Exact before and intended projections required.');
}
async function load(path) { try {return JSON.parse(await readFile(path,'utf8'));} catch(e){if(e.code==='ENOENT')return null;throw e;} }
async function save(path, receipt) {
  const tmp=path+'.'+randomUUID()+'.tmp';
  await writeFile(tmp,JSON.stringify(receipt,null,2)+'\n',{mode:0o600,flag:'wx'});
  await rename(tmp,path);
}
async function locked(directory,key,fn) {
  await mkdir(directory,{recursive:true,mode:0o700});
  const path=resolve(directory,key+'.json'), lock=path+'.lock';
  try {await writeFile(lock,String(process.pid),{flag:'wx',mode:0o600});}
  catch(e) {if(e.code==='EEXIST') return {state:'BLOCKED',reason:'Receipt locked; reconcile the previous operation before removing a stale lock.'};throw e;}
  try {return await fn(path);} finally {await unlink(lock);}
}
export async function prepare(directory,plan,current) {
  validate(plan); const key=actionKey(plan);
  return locked(directory,key,async path=>{
    const old=await load(path);
    if(exact(current,plan.intended)) {
      const receipt={...(old??{}),...plan,key,state:'verified',verification:'PASS',verified_at:new Date().toISOString(),reason:'Desired state independently observed; no write.'};
      await save(path,receipt);return {state:'PASS',decision:'SKIP',key,receipt};
    }
    if(old?.state==='sent' || old?.state==='unknown') return {state:'UNKNOWN',decision:'RECONCILE',key,reason:'Prior write may have happened; never automatically replay.'};
    if(old?.state==='verified') return {state:'BLOCKED',decision:'CONFLICT',key,reason:'Verified target has drifted; fresh change approval required.'};
    if(!exact(current,plan.before)) return {state:'BLOCKED',decision:'CONFLICT',key,reason:'Current target differs from approved before projection.'};
    const receipt={...plan,key,state:'prepared',verification:'UNKNOWN',prepared_at:new Date().toISOString()};
    receipt.approval_digest=createHash('sha256').update(canonical(plan)).digest('hex');
    await save(path,receipt);
    return {state:'UNKNOWN',decision:'AWAIT_APPROVAL',key,approval_digest:receipt.approval_digest,receipt};
  });
}
export async function markSent(directory,key,digest,current) {
  if(!/^[a-f0-9]{64}$/.test(key)) throw new Error('Invalid receipt key.');
  return locked(directory,key,async path=>{
    const receipt=await load(path);
    if(receipt?.state!=='prepared') return {state:'BLOCKED',reason:'Only a prepared receipt may be sent; reconcile existing state.'};
    if(digest!==receipt.approval_digest || !exact(current,receipt.before)) return {state:'BLOCKED',reason:'Approval digest or live before state differs.'};
    receipt.state='sent';receipt.sent_at=new Date().toISOString();
    await save(path,receipt);return {state:'UNKNOWN',decision:'WRITE_ONCE',receipt};
  });
}
export async function reconcile(directory,key,current) {
  if(!/^[a-f0-9]{64}$/.test(key)) throw new Error('Invalid receipt key.');
  return locked(directory,key,async path=>{
    const receipt=await load(path);
    if(!receipt) return {state:'BLOCKED',reason:'Receipt unavailable.'};
    if(exact(current,receipt.intended)) {
      receipt.state='verified';receipt.verification='PASS';receipt.verified_at=new Date().toISOString();
      await save(path,receipt);return {state:'PASS',decision:'SKIP',receipt};
    }
    if(receipt.state==='verified') return {state:'BLOCKED',decision:'CONFLICT',reason:'Verified target drifted; do not replay.'};
    receipt.state='unknown';receipt.verification='UNKNOWN';
    await save(path,receipt);return {state:'UNKNOWN',decision:'DO_NOT_RETRY',receipt};
  });
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [command,inputPath,receiptDir='.al-task-delivery/receipts']=process.argv.slice(2);
    const input=JSON.parse(await readFile(inputPath,'utf8'));
    const methods={prepare:()=>prepare(receiptDir,input.plan,input.current),sent:()=>markSent(receiptDir,input.key,input.approval_digest,input.current),verify:()=>reconcile(receiptDir,input.key,input.current)};
    if(!methods[command])throw new Error('Usage: receipt.mjs prepare|sent|verify ignored-input.json [receipt-dir]');
    const result=await methods[command]();console.log(JSON.stringify(result,null,2));
    if(result.state==='BLOCKED')process.exitCode=2;
  } catch(e) {console.error(e.message);process.exitCode=1;}
}
