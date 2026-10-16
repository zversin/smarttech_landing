import { residentialPrice, accessScenario } from './config.mjs';
let language = document.documentElement.lang === 'kk' ? 'kz' : document.documentElement.lang;
const copy = {
 ru: {request:'По запросу',from:'от ',invalid:'Проверьте количество: ЖК — 1–20 квартир; турникеты — 1–5 проходов.',greeting:'Здравствуйте! Прошу проверить совместимость и рассчитать: ',estimate:'Ориентир',empty:'Выберите оборудование'},
 kz: {request:'Сұраныс бойынша',from:'бастап: ',invalid:'Санын тексеріңіз: 1–20 пәтер; турникеттер — 1–5 өту жолы.',greeting:'Сәлеметсіз бе! Үйлесімділігін тексеріп, есептеп беріңіз: ',estimate:'Бағдар',empty:'Жабдықты таңдаңыз'},
 en: {request:'On request',from:'from ',invalid:'Check quantities: 1–20 apartments; turnstiles 1–5 lanes.',greeting:'Hello! Please check compatibility and quote: ',estimate:'Estimate',empty:'Select equipment'}
};
const money = n => new Intl.NumberFormat(language==='kz'?'kk-KZ':language==='en'?'en-US':'ru-RU').format(n)+' ₸';
function update(form) {
 const c = copy[language] || copy.ru;
 const n = name => Number(form.elements[name].value);
 const residential = form.dataset.calculator === 'residential';
 if (residential) form.elements.apartments.disabled = n('tier')===1;
 const output = form.querySelector('[data-total]');
 const quote = form.querySelector('[data-quote]');
 let result, selection;
 try {
  if (!form.checkValidity()) throw new Error('invalid');
  if (residential) {
   result = residentialPrice(n('tier'),n('tier')===1?20:n('apartments'));
   selection = form.elements.tier.selectedOptions[0].textContent + (n('tier')>1?' / '+n('apartments'): '');
  } else {
   const scenario = accessScenario(n('lanes'),n('directions'),form.elements.model.value);
   result = scenario.quote;
   selection = `${form.elements.directions.selectedOptions[0].textContent}; DS-K3G411 ×${scenario.turnstiles}; ${form.elements.model.selectedOptions[0].textContent} ×${scenario.terminals}; ZU2 ×${scenario.brackets}`;
  }
 } catch {
  output.textContent=c.invalid;
  form.querySelectorAll('[data-cost]').forEach(el=>el.textContent='—');
  quote.removeAttribute('href'); quote.setAttribute('aria-disabled','true'); form.querySelector('[data-message-preview]').textContent=''; return;
 }
 form.querySelectorAll('[data-cost]').forEach(el=>el.textContent=result?money(result[el.dataset.cost]):c.request);
 output.textContent=result?(result.total?c.from+money(result.total):c.empty):c.request;
 const site = form.elements.site.value.trim();
 const message = c.greeting+selection+'\n'+c.estimate+': '+(result?money(result.total):c.request)+'. INTANT 14.10.2026.'+(site?'\n'+site:'');
 form.querySelector('[data-message-preview]').textContent=message;
 if(result && result.total===0){quote.removeAttribute('href');quote.setAttribute('aria-disabled','true');return;}
 quote.removeAttribute('aria-disabled');
 quote.href='https://wa.me/77087262237?text='+encodeURIComponent(message);
}
const forms = [...document.querySelectorAll('[data-calculator]')];
const selectedModel = new URLSearchParams(location.search).get('model');
if (['341','670QR','673DX'].includes(selectedModel)) {
 const select = document.querySelector('[name="model"]');
 if (select) { select.value=selectedModel; if(selectedModel!=='341') select.closest('details').open=true; }
}
forms.forEach(form=>{form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',()=>update(form));form.addEventListener('change',()=>update(form));update(form);});
document.addEventListener('smarttech-language',e=>{language=e.detail;forms.forEach(update);});
