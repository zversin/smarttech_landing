// INTANT retail snapshot 2026-10-14. Availability and procurement price require confirmation.
export const PRICE_SOURCE = 'https://bitrix.intant.kz/api/import/files/%D0%9F%D1%80%D0%B0%D0%B9%D1%81-%D0%BB%D0%B8%D1%81%D1%82%20INTANT.xlsx';
export const roundPrice = n => Math.ceil(n / 5000) * 5000;
const integer = (n, min, max) => { if (!Number.isInteger(n) || n < min || n > max) throw new RangeError('Quantity outside supported configuration'); };
export const total = x => ({...x, total: roundPrice(x.equipment + x.install + x.setup + x.materials)});
export function residentialPrice(tier, apartments = 20) {
 integer(tier, 1, 3); integer(apartments, 1, 20);
 if (tier === 3) return null; // ANPR full scope and price require confirmation.
 const x = {equipment:180606, install:40000, setup:40000, materials:5000};
 if (tier >= 2) { x.equipment += 331416 + apartments * 57335; x.install += 40000 + apartments * 15000; x.setup += 20000; x.materials += 10000 + apartments * 5000; }
 return total(x);
}
export function accessPrice(turnstiles, terminals, brackets, model = '341', bracketModel = 'ZU2') {
 for (const n of [turnstiles, terminals, brackets]) integer(n,0,10);
 if (!['341','670QR','673DX'].includes(model) || !['ZU2','ZU3'].includes(bracketModel)) throw new RangeError('Unknown model');
 if (terminals && model !== '341') return null;
 return total({equipment:turnstiles*543456+terminals*157878+brackets*(bracketModel==='ZU2'?25055:43847),install:turnstiles*80000+terminals*40000,materials:turnstiles*20000+terminals*5000,setup:turnstiles?40000+10000*(turnstiles-1):terminals?40000:0});
}
export function cameraPrice(n, disk) {
 integer(n,1,4); if (![0,2,4].includes(disk)) throw new RangeError('Unsupported disk');
 const x = total({equipment:n*16158+32091+({0:0,2:94338,4:129202})[disk],install:Math.max(15000*n,25000),materials:5000*n,setup:30000});
 return {...x,total:Math.max(115000,x.total)};
}

// Buyer-facing scenario: new lanes, face recognition on one or both sides.
export function accessScenario(lanes, directions, model = '341') {
 integer(lanes,1,5); integer(directions,1,2);
 const terminals = lanes * directions;
 return {turnstiles:lanes, terminals, brackets:terminals, quote:accessPrice(lanes,terminals,terminals,model)};
}
