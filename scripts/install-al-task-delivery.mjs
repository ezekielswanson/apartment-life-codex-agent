import { readFile, writeFile, mkdir, symlink, lstat, readlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { apps } = JSON.parse(await readFile(resolve(root, 'plugins/al-task-delivery/.app.json'), 'utf8'));
const config = '# AL Task Delivery: native registered MCP connections are in the plugin .app.json.\n' +
  '# Authentication remains user/environment-level. Verify identity at runtime.\n' +
  '[features]\napps = true\n\n' +
  '[plugins."al-task-delivery@apartment-life-local"]\nenabled = true\n\n' +
  Object.values(apps).map(({id}) => `[apps.${id}]\nenabled = true\ndefault_tools_approval_mode = "writes"\ndestructive_enabled = false\n`).join('\n');
const catalog = JSON.stringify({name:'apartment-life-local',interface:{displayName:'Apartment Life Local'},plugins:[{
  name:'al-task-delivery',source:{source:'local',path:'./plugins/al-task-delivery'},
  policy:{installation:'AVAILABLE',authentication:'ON_INSTALL'},category:'Productivity'
}]}, null, 2) + '\n';
const files = [ ['.codex/config.toml',config], ['.agents/plugins/marketplace.json',catalog] ];
const skill = resolve(root,'.agents/skills/al-task-delivery');
const link = '../../plugins/al-task-delivery/skills/al-task-delivery';
// Relative to .agents/skills: ../../ reaches the repository root.
for (const [path,content] of files) {
  try { if(await readFile(resolve(root,path),'utf8') !== content) throw new Error(`Conflicting ${path}; review rather than overwrite.`); }
  catch(e) { if(e.code !== 'ENOENT') throw e; }
}
try {
  const st=await lstat(skill);
  if(!st.isSymbolicLink() || await readlink(skill)!==link) throw new Error('Conflicting skill location; review rather than overwrite.');
} catch(e) { if(e.code!=='ENOENT') throw e; }
for (const [path,content] of files) {
  await mkdir(dirname(resolve(root,path)),{recursive:true});
  try { await writeFile(resolve(root,path),content,{flag:'wx'}); }
  catch(e) { if(e.code!=='EEXIST') throw e; }
}
await mkdir(dirname(skill),{recursive:true});
try { await symlink(link,skill); } catch(e) { if(e.code!=='EEXIST') throw e; }
await readFile(resolve(skill,'SKILL.md'),'utf8');
console.log('PASS: repo skill, marketplace, and Codex project configuration installed. OAuth/live checks remain independent.');
