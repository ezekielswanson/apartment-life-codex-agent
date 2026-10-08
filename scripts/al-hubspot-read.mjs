import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { failureState } from '../plugins/al-task-delivery/skills/al-task-delivery/scripts/receipt.mjs';

const exec=promisify(execFile);
export const ACCOUNT='apartment_life_prod', PORTAL='5627913';
const types=new Set(['contacts','companies','deals','tickets','tasks','notes','calls','emails','meetings','products','line_items']);
function objectType(type) { if(!types.has(type)&&!/^2-\d+$/.test(type??''))throw new Error('Unsupported CRM object type; discover exact custom IDs first.');return type; }
function id(value) {if(!/^[1-9]\d*$/.test(value??''))throw new Error('Positive record ID required.');return value;}
function names(value) {const fields=(value??'').split(',').filter(Boolean);if(fields.length>30||fields.some(x=>!/^\w+$/.test(x)))throw new Error('Invalid property names.');return fields;}
export function recordEndpoint(type,recordId,properties='',associations='') {
  objectType(type);id(recordId);const params=new URLSearchParams();
  const fields=names(properties);if(fields.length)params.set('properties',fields.join(','));
  const rel=(associations??'').split(',').filter(Boolean);rel.forEach(objectType);
  if(rel.length)params.set('associations',rel.join(','));
  return `/crm/v3/objects/${type}/${recordId}`+(params.size?'?'+params:'');
}
export function associationEndpoint(type,recordId,toType,after='') {
  objectType(type);objectType(toType);id(recordId);
  if(after&&!/^\d+$/.test(after))throw new Error('Invalid association cursor.');
  return `/crm/v4/objects/${type}/${recordId}/associations/${toType}?limit=100`+(after?'&after='+after:'');
}
export async function createClient(run=exec) {
  const opts={timeout:45000,maxBuffer:4*1024*1024,encoding:'utf8'};
  const account=await run('hs',['account','info','--account',ACCOUNT],opts);
  if(!new RegExp(`Account ID: ${PORTAL}(?:\\s|$)`).test(account.stdout)) {
    const e=new Error('HubSpot portal mismatch; no CRM read attempted.');e.code='PORTAL_MISMATCH';throw e;
  }
  return {portal_id:PORTAL,async get(endpoint) {
    // Callers cannot inject an arbitrary endpoint or a mutating method.
    if(!/^\/crm\/v[34]\/objects\//.test(endpoint)||endpoint.includes('..'))throw new Error('CRM GET endpoint required.');
    try {
      const {stdout}=await run('hs',['api',endpoint,'--method','GET','--account',ACCOUNT,'--json'],opts);
      const data=JSON.parse(stdout);
      if(data.status==='error'||data.category) {const e=new Error('HubSpot read failed.');e.category=data.category;throw e;}
      const partial=data.paging?.next || Object.values(data.associations??{}).some(relation=>relation.paging?.next);
      return {state:'PASS',portal_id:PORTAL,data,coverage:partial?'PARTIAL':'RETURNED_PAGE'};
    } catch(e) {
      let category=e.category;
      try {category??=JSON.parse(e.stdout).category;} catch { /* stdout may be unavailable; never interpret as empty data. */ }
      const code=category??(e.killed?'TIMEOUT':e.code);
      return {state:failureState({code}),portal_id:PORTAL,error:category??(e.killed?'TIMEOUT':'CLI_ERROR'),data:null};
    }
  }};
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [mode,type,recordId,fieldsOrTo='',associationsOrAfter='']=process.argv.slice(2);
    if(!['identity','record','associations'].includes(mode))throw new Error('Usage: al-hubspot-read.mjs identity|record TYPE ID [PROPERTIES] [ASSOCIATIONS] | associations TYPE ID TO_TYPE [AFTER]');
    // Validate input before touching authentication/CRM.
    const endpoint=mode==='record'?recordEndpoint(type,recordId,fieldsOrTo,associationsOrAfter):mode==='associations'?associationEndpoint(type,recordId,fieldsOrTo,associationsOrAfter):null;
    const client=await createClient();
    const result=endpoint?await client.get(endpoint):{state:'PASS',portal_id:client.portal_id,account:ACCOUNT};
    console.log(JSON.stringify(result,null,2));if(result.state!=='PASS')process.exitCode=2;
  } catch(e) {console.log(JSON.stringify({state:failureState(e),error:e.code??'INPUT_OR_IDENTITY_ERROR',message:e.code==='PORTAL_MISMATCH'?e.message:undefined}));process.exitCode=1;}
}
