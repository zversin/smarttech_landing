import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraPrice, accessPrice, residentialPrice, accessScenario} from './config.mjs';
import supplier from './intant.mjs';
const p = Object.fromEntries(Object.entries(supplier.items).map(([key, item]) => [key, item.price]));
const up = n => Math.ceil(n / 5000) * 5000;
const door = p.terminal341 + p.power + p.raincover;
const intercom = door + p.panel + p.keypad + p.frame + p.blank + p.switch + 20 * p.monitor;
for (const [tier,equipment,install,setup,materials,value] of [[1,door,40000,40000,5000,up(door+85000)],[2,intercom,380000,60000,115000,up(intercom+555000)]]) {
 test(`Residential ${tier} audited bill of materials`,()=>assert.deepEqual(residentialPrice(tier),{equipment,install,setup,materials,total:value}));
}
for(const n of [0,21,1.5,NaN])test(`Reject unsupported apartments ${n}`,()=>assert.throws(()=>residentialPrice(2,n),RangeError));
for(const [n,d,value] of [[2,2,Math.max(115000,up(2*p.camera+p.recorder+p.disk2+70000))],[3,2,Math.max(115000,up(3*p.camera+p.recorder+p.disk2+90000))],[4,2,Math.max(115000,up(4*p.camera+p.recorder+p.disk2+110000))],[1,0,Math.max(115000,up(p.camera+p.recorder+60000))],[2,0,Math.max(115000,up(2*p.camera+p.recorder+70000))],[4,4,Math.max(115000,up(4*p.camera+p.recorder+p.disk4+110000))]])test(`CCTV ${n}/${d}`,()=>assert.equal(cameraPrice(n,d).total,value));
test('Turnstile package recalculated',()=>assert.equal(accessPrice(1,2,2).total,up(p.turnstile+2*p.terminal341+2*p.bracket2+230000)));
for(const model of ['670QR','673DX'])test(`Unknown terminal price ${model}`,()=>{assert.equal(accessPrice(1,1,2,model),null);assert.equal(accessPrice(1,0,0,model).total,up(p.turnstile+140000));});
test('Independent quantities and setup',()=>{assert.equal(accessPrice(0,0,0).total,0);assert.equal(accessPrice(0,1,0).total,up(p.terminal341+85000));assert.equal(accessPrice(2,0,0).setup,50000);assert.equal(accessPrice(0,0,1,'341','ZU3').total,up(p.bracket3));});
test('Rounded totals never undercut costs',()=>{for(let n=1;n<=20;n++){for(const tier of [1,2]){const q=residentialPrice(tier,n);const sum=q.equipment+q.install+q.setup+q.materials;assert(q.total>=sum&&q.total-sum<5000);assert.equal(q.total%5000,0);}}});
for(const args of [[-1,0,0],[0,NaN,0],[0,1.5,0],[11,0,0]])test(`Reject invalid access quantity ${args}`,()=>assert.throws(()=>accessPrice(...args),RangeError));
test('Reject unknown components',()=>{assert.throws(()=>cameraPrice(2,8),RangeError);assert.throws(()=>accessPrice(1,1,1,'341','unknown'),RangeError);});

test('Buyer scenario maps entry/exit to terminals and automatic mounts',()=>{
 assert.deepEqual(accessScenario(1,2),{turnstiles:1,terminals:2,brackets:2,quote:accessPrice(1,2,2)});
 assert.equal(accessScenario(1,1).quote.total,up(p.turnstile+p.terminal341+p.bracket2+185000));
 assert.equal(accessScenario(5,2).terminals,10);
 assert.equal(accessScenario(2,1).brackets,2);
});
test('Buyer scenario rejects unsupported lanes and sides',()=>{for(const args of [[0,1],[6,2],[1.5,1],[1,0],[1,3]])assert.throws(()=>accessScenario(...args),RangeError);});
test('Buyer scenario keeps unpriced models on request',()=>{for(const model of ['670QR','673DX'])assert.equal(accessScenario(1,2,model).quote,null);});

test("ANPR never inherits the former card package price",()=>{for(let n=1;n<=20;n++)assert.equal(residentialPrice(3,n),null);});
