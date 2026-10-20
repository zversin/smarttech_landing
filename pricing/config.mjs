import supplier from './intant.mjs';
const price = key => supplier.items[key].price;
export const PRICE_SOURCE = supplier.source;
export const PRICE_DATE = supplier.priceListDate.split('-').reverse().join('.');
export const roundPrice = n => Math.ceil(n / 5000) * 5000;
const integer = (n, min, max) => { if (!Number.isInteger(n) || n < min || n > max) throw new RangeError('Quantity outside supported configuration'); };
export const total = x => ({...x, total: roundPrice(x.equipment + x.install + x.setup + x.materials)});
export function residentialPrice(tier, apartments = 20) {
 integer(tier, 1, 3); integer(apartments, 1, 20);
 if (tier === 3) return null; // ANPR full scope and price require confirmation.
 const x = {equipment:price('terminal341')+price('power')+price('raincover'), install:40000, setup:40000, materials:5000};
 if (tier >= 2) { x.equipment += price('panel')+price('keypad')+price('frame')+price('blank')+price('switch') + apartments * price('monitor'); x.install += 40000 + apartments * 15000; x.setup += 20000; x.materials += 10000 + apartments * 5000; }
 return total(x);
}
export function accessPrice(turnstiles, terminals, brackets, model = '341', bracketModel = 'ZU2') {
 for (const n of [turnstiles, terminals, brackets]) integer(n,0,10);
 if (!['341','670QR','673DX'].includes(model) || !['ZU2','ZU3'].includes(bracketModel)) throw new RangeError('Unknown model');
 if (terminals && model !== '341') return null;
 return total({equipment:turnstiles*price('turnstile')+terminals*price('terminal341')+brackets*(bracketModel==='ZU2'?price('bracket2'):price('bracket3')),install:turnstiles*80000+terminals*40000,materials:turnstiles*20000+terminals*5000,setup:turnstiles?40000+10000*(turnstiles-1):terminals?40000:0});
}
export function cameraPrice(n, disk) {
 integer(n,1,4); if (![0,2,4].includes(disk)) throw new RangeError('Unsupported disk');
 const x = total({equipment:n*price('camera')+price('recorder')+({0:0,2:price('disk2'),4:price('disk4')})[disk],install:Math.max(15000*n,25000),materials:5000*n,setup:30000});
 return {...x,total:Math.max(115000,x.total)};
}

// Buyer-facing scenario: new lanes, face recognition on one or both sides.
export function accessScenario(lanes, directions, model = '341') {
 integer(lanes,1,5); integer(directions,1,2);
 const terminals = lanes * directions;
 return {turnstiles:lanes, terminals, brackets:terminals, quote:accessPrice(lanes,terminals,terminals,model)};
}
