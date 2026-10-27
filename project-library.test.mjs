import test from 'node:test';
import assert from 'node:assert/strict';
import { readState, selectProjects, libraryURL, projectURL } from './assets/project-library.mjs';
const groups=[{id:'consumer'},{id:'tools'}];
const projects=Array.from({length:307},(_,i)=>({id:`project-${i}`,group:i%2?'tools':'consumer',searchText:`Project ${i} ${i===306?'Café ownership calculator':'workflow'}`}));
test('hundreds of projects remain reachable in curated order through bounded pages',()=>{
  const found=[];
  for(let page=1;page<=52;page++){
    const result=selectProjects(projects,{category:'all',query:'',page});
    assert(result.items.length<=6);found.push(...result.items.map(p=>p.id));
  }
  assert.deepEqual(found,projects.map(p=>p.id));
});
test('search and category apply before pagination, including accent normalization',()=>{
  const result=selectProjects(projects,{category:'consumer',query:'cafe calculator',page:25});
  assert.deepEqual(result.items.map(p=>p.id),['project-306']);assert.equal(result.page,1);
  assert.equal(selectProjects(projects,{category:'tools',query:'cafe',page:1}).total,0);
});
test('invalid state, oversized pages and no matches have safe useful fallbacks',()=>{
  for(const page of ['-1','0','NaN','1.5','Infinity','999999999999999999'])assert.equal(readState(new URL(`https://example.org/projects/?page=${page}`),groups).page,1);
  assert.equal(readState(new URL('https://example.org/projects/?category=missing'),groups).category,'all');
  const last=selectProjects(projects,{category:'all',query:'',page:999});assert.equal(last.page,52);assert.equal(last.items.length,1);
  const empty=selectProjects([],{category:'all',query:'',page:2});assert.deepEqual(empty,{items:[],total:0,page:1,pages:1,start:0,end:0});
});
test('navigation preserves unrelated parameters and safely encodes collection context',()=>{
  const state={category:'consumer',query:'cost & value',page:3};
  const url=libraryURL(state,'https://example.org/projects/page/2/?utm_source=resume&collection=1#old');
  assert.equal(url.pathname,'/projects/');assert.equal(url.searchParams.get('q'),'cost & value');assert.equal(url.searchParams.get('utm_source'),'resume');assert.equal(url.hash,'');
  const detail=projectURL('car-tco-compare',url);assert.equal(detail.origin,url.origin);assert.equal(detail.searchParams.get('collection'),'1');assert.equal(detail.searchParams.get('page'),'3');
});
