import assert from 'node:assert/strict';
import test from 'node:test';
import {RadarrClient,SonarrClient} from '../dist/arr-client.js';
function fixture(Client=RadarrClient) {
 const client=new Client({url:'http://example.invalid',apiKey:'test'}), writes=[];
 let profile={id:1,name:'HD',cutoff:1000,upgradeAllowed:true,minFormatScore:100,cutoffFormatScore:100,formatItems:[{format:7,name:'Audio',score:100}],language:{id:1,name:'English'},items:[{quality:{id:0,name:'Unknown'},allowed:false,items:[]},{id:1000,name:'WEB',allowed:true,items:[{quality:{id:3,name:'WEB-DL'},allowed:true},{quality:{id:15,name:'WEBRip'},allowed:true}]},{quality:{id:31,name:'Remux'},allowed:true,items:[]}]};
 let formats=[];
 client.request=async(path,options)=>{
  if(options){writes.push({path,...options});const v=JSON.parse(options.body);if(path.startsWith('/qualityprofile')){profile=v;return structuredClone(v);}const out={...v,id:v.id??8};formats=[out];return structuredClone(out);}
  if(path==='/qualityprofile')return [structuredClone(profile)];
  if(path.startsWith('/qualityprofile/'))return structuredClone(profile);
  if(path==='/customformat')return structuredClone(formats);
  throw Error(path);
 };
 const layout={profileId:1,expectedName:'HD',allowedQualityIds:[3,15],orderedItemIds:[0,31,1000],cutoff:1000};
 const spec={name:'Test',implementation:'ReleaseTitleSpecification',negate:false,required:false,fields:[{name:'value',value:'test'}]};
 return {client,writes,layout,spec,change:()=>{profile.name='Changed';}};
}
for(const Client of [SonarrClient,RadarrClient])test(`${Client.name} layout previews and applies preserving unrelated settings`,async()=>{
 const {client,writes,layout}=fixture(Client),p=await client.setQualityProfileLayout(layout);
 assert.equal(writes.length,0);assert.equal(p.proposed.items[1].allowed,false);assert.equal(p.proposed.items[2].allowed,true);
 const r=await client.setQualityProfileLayout({...layout,apply:true,expectedRevision:p.revision});assert.equal(r.verified,true);assert.equal(r.updated.language.name,'English');assert.equal(r.updated.formatItems[0].score,100);
});
test('layout rejects missing/duplicate/unknown order, unknown quality and disabled cutoff',async()=>{
 for(const patch of [{orderedItemIds:[0,1000]},{orderedItemIds:[0,1000,1000]},{orderedItemIds:[0,1000,999]},{allowedQualityIds:[999]},{cutoff:31}]){const {client,writes,layout}=fixture();await assert.rejects(client.setQualityProfileLayout({...layout,...patch}));assert.equal(writes.length,0);}
});
test('layout stale/missing revision blocks writes',async()=>{
 const {client,writes,layout,change}=fixture(),p=await client.setQualityProfileLayout(layout);await assert.rejects(client.setQualityProfileLayout({...layout,apply:true}));change();await assert.rejects(client.setQualityProfileLayout({...layout,expectedRevision:p.revision,apply:true}));assert.equal(writes.length,0);
});
test('full 101-rule format previews, creates and updates without duplicate creation',async()=>{
 const {client,writes,spec}=fixture();const input={name:'LQ',specifications:Array.from({length:101},(_,i)=>({...spec,name:`Rule ${i}`}))};
 const p=await client.upsertCustomFormat(input);assert.equal(writes.length,0);
 const r=await client.upsertCustomFormat({...input,expectedRevision:p.revision,apply:true});assert.equal(r.verified,true);assert.equal(writes[0].method,'POST');
 await assert.rejects(client.upsertCustomFormat(input),/already exists/);
 const u={...input,formatId:r.updated.id,specifications:[spec]};const preview=await client.upsertCustomFormat(u);
 const result=await client.upsertCustomFormat({...u,expectedRevision:preview.revision,apply:true});assert.equal(result.verified,true);assert.equal(writes[1].method,'PUT');assert.equal(result.original.specifications.length,101);
});
test('custom format invalid inputs and missing revision do not write',async()=>{
 for(const patch of [{specifications:[]},{specifications:Array(251).fill({})},{specifications:[{}]},{apply:'true'}]){const {client,writes,spec}=fixture();await assert.rejects(client.upsertCustomFormat({name:'X',specifications:[spec],...patch}));assert.equal(writes.length,0);}
 const {client,writes,spec}=fixture();await assert.rejects(client.upsertCustomFormat({name:'X',specifications:[spec],apply:true}));assert.equal(writes.length,0);
});
