import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraPrice, accessPrice, residentialPrice, accessScenario} from './config.mjs';
for (const [tier,equipment,install,setup,materials,value] of [[1,180606,40000,40000,5000,270000],[2,1658722,380000,60000,115000,2215000]]) {
 test(`Residential ${tier} audited bill of materials`,()=>assert.deepEqual(residentialPrice(tier),{equipment,install,setup,materials,total:value}));
}
for(const n of [0,21,1.5,NaN])test(`Reject unsupported apartments ${n}`,()=>assert.throws(()=>residentialPrice(2,n),RangeError));
for(const [n,d,value] of [[2,2,230000],[3,2,265000],[4,2,305000],[1,0,115000],[2,0,135000],[4,4,340000]])test(`CCTV ${n}/${d}`,()=>assert.equal(cameraPrice(n,d).total,value));
test('Turnstile package recalculated',()=>assert.equal(accessPrice(1,2,2).total,1140000));
for(const model of ['670QR','673DX'])test(`Unknown terminal price ${model}`,()=>{assert.equal(accessPrice(1,1,2,model),null);assert.equal(accessPrice(1,0,0,model).total,685000);});
test('Independent quantities and setup',()=>{assert.equal(accessPrice(0,0,0).total,0);assert.equal(accessPrice(0,1,0).total,245000);assert.equal(accessPrice(2,0,0).setup,50000);assert.equal(accessPrice(0,0,1,'341','ZU3').total,45000);});
test('Rounded totals never undercut costs',()=>{for(let n=1;n<=20;n++){for(const tier of [1,2]){const q=residentialPrice(tier,n);const sum=q.equipment+q.install+q.setup+q.materials;assert(q.total>=sum&&q.total-sum<5000);assert.equal(q.total%5000,0);}}});
for(const args of [[-1,0,0],[0,NaN,0],[0,1.5,0],[11,0,0]])test(`Reject invalid access quantity ${args}`,()=>assert.throws(()=>accessPrice(...args),RangeError));
test('Reject unknown components',()=>{assert.throws(()=>cameraPrice(2,8),RangeError);assert.throws(()=>accessPrice(1,1,1,'341','unknown'),RangeError);});

test('Buyer scenario maps entry/exit to terminals and automatic mounts',()=>{
 assert.deepEqual(accessScenario(1,2),{turnstiles:1,terminals:2,brackets:2,quote:accessPrice(1,2,2)});
 assert.equal(accessScenario(1,1).quote.total,915000);
 assert.equal(accessScenario(5,2).terminals,10);
 assert.equal(accessScenario(2,1).brackets,2);
});
test('Buyer scenario rejects unsupported lanes and sides',()=>{for(const args of [[0,1],[6,2],[1.5,1],[1,0],[1,3]])assert.throws(()=>accessScenario(...args),RangeError);});
test('Buyer scenario keeps unpriced models on request',()=>{for(const model of ['670QR','673DX'])assert.equal(accessScenario(1,2,model).quote,null);});

test("ANPR never inherits the former card package price",()=>{for(let n=1;n<=20;n++)assert.equal(residentialPrice(3,n),null);});
