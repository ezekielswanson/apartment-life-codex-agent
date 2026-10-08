import { readFile, realpath, lstat } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const plugin=resolve(root,'plugins/al-task-delivery'),skill=resolve(plugin,'skills/al-task-delivery');
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const sha=data=>createHash('sha256').update(data).digest('hex');
const manifest=await json(resolve(plugin,'plugin.json'));
assert.equal(manifest.name,'al-task-delivery');assert.equal(manifest.version,'0.1.0');
assert.equal(manifest.extensions['com.openai'].apps,'./.app.json');
const apps=(await json(resolve(plugin,'.app.json'))).apps;
assert.equal(apps.hubspot.required,true);assert.equal(apps.asana.required,true);
for(const entry of Object.values(apps)) assert.match(entry.id,/^(asdk_app_|connector_|templated_apps_)[A-Za-z0-9][A-Za-z0-9_-]*$/);
const source=await json(resolve(root,'docs/al-task-delivery/SOURCE_MANIFEST.json'));
assert.equal(source.original_skill_zip.status,'PASS');
for(const file of source.files) assert.equal(sha(await readFile(resolve(skill,'references/source',file.packaged_filename))),file.sha256);
for(const entry of source.original_skill_zip.members) {
  let path=entry.path.replace(/^al-task-delivery\//,'');
  if(path==='SKILL.md')path='references/source/al-task-delivery-original-SKILL.md';
  if(path==='agents/openai.yaml')path='references/source/al-task-delivery-original-openai.yaml';
  assert.equal(sha(await readFile(resolve(skill,path))),entry.sha256);
}
// Historical sources remain hash-checked above; the active skill can evolve independently.
const text=await readFile(resolve(skill,'SKILL.md'),'utf8');
for(const match of text.matchAll(/\]\((references\/[^)]+)\)/g))await readFile(resolve(skill,match[1]));
const installed=resolve(root,'.agents/skills/al-task-delivery');assert.ok((await lstat(installed)).isSymbolicLink());assert.equal(await realpath(installed),await realpath(skill));
for(const doc of ['OPERATING_RULES.md','CONNECTIONS.md']) {
  const p=await realpath(resolve(root,'docs/al-task-delivery',doc));assert.ok(!relative(root,p).startsWith('..'));await readFile(p);
}
const marketplace=await json(resolve(root,'.agents/plugins/marketplace.json'));
assert.equal(marketplace.name,'apartment-life-local');assert.equal(marketplace.plugins[0].source.path,'./plugins/al-task-delivery');
const config=await readFile(resolve(root,'.codex/config.toml'),'utf8');
for(const {id} of Object.values(apps))assert.ok(config.includes(`[apps.${id}]`));
console.log('PASS: packaged skill source integrity, reference links, registered MCP mappings, installed skill, and repo configuration.');
console.log('Live connectivity and actual plugin installation are separate acceptance checks.');
