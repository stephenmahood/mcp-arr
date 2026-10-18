import assert from 'node:assert/strict';
import test from 'node:test';
import {RadarrClient, SonarrClient} from '../dist/arr-client.js';
function fixture(Client = RadarrClient) {
  const client = new Client({url:'http://example.invalid',apiKey:'test'});
  let definition = {id:8,quality:{id:18,name:'WEBDL-2160p'},minSize:0,maxSize:null,preferredSize:null,weight:19,title:'WEB'};
  const calls=[];
  client.request = async (path,options) => {calls.push({path,options}); if(options?.method==='PUT') {definition=JSON.parse(options.body);return definition;} return [definition];};
  return {client,calls,input:{definitionId:8,expectedQuality:'WEBDL-2160p',minSize:34.5,preferredSize:null,maxSize:null}};
}
for(const Client of [RadarrClient,SonarrClient]) {
  test(`${Client.name}: preview does not write; apply preserves metadata and verifies`, async()=>{
    const {client,calls,input}=fixture(Client);
    const p=await client.patchQualityDefinition(input);assert.equal(p.applied,false);assert.equal(calls.length,1);
    const r=await client.patchQualityDefinition({...input,apply:true});assert.equal(r.verified,true);assert.equal(r.original.minSize,0);
    const put=calls.find(c=>c.options?.method==='PUT');assert.equal(put.path,'/qualitydefinition/8');assert.equal(JSON.parse(put.options.body).weight,19);
  });
}
test('invalid numbers, missing fields and inverted limits never write',async()=>{
 for(const patch of [{minSize:-1},{minSize:NaN},{maxSize:10,preferredSize:20},{maxSize:10,preferredSize:null},{preferredSize:undefined},{maxSize:undefined},{apply:'true'}]) {
  const {client,calls,input}=fixture();await assert.rejects(client.patchQualityDefinition({...input,...patch}));assert.equal(calls.length,0);
 }
});
test('identity mismatch blocks write',async()=>{const {client,calls,input}=fixture();await assert.rejects(client.patchQualityDefinition({...input,expectedQuality:'Other',apply:true}));assert.equal(calls.length,1);});
test('uncertain PUT does not retry or expose raw server response',async()=>{const {client,input}=fixture();const old=client.request;client.request=async(p,o)=>{if(o)throw Error('secret');return old(p,o);};await assert.rejects(client.patchQualityDefinition({...input,apply:true}),/outcome uncertain/);});
test('read-back mismatch is reported',async()=>{const {client,input}=fixture();client.request=async(p,o)=>o?{}:[{id:8,quality:{name:'WEBDL-2160p'},minSize:0}];const r=await client.patchQualityDefinition({...input,apply:true});assert.equal(r.verified,false);});
