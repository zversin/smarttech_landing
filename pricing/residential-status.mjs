import supplier from './intant.mjs';
// A later complete supplier sync clears this dated audit warning automatically.
export const modularPriceNeedsRecheck = Date.parse(supplier.checkedAt) <= Date.parse('2026-11-04T16:25:00Z');
export const residentialStatus = {
 ru: {
  single: 'Совместимость DS-K1T341CM с выбранными мониторами требует проверки: вызов квартиры, видео, звук и открытие двери. Итоговая цена по запросу.',
  modular: 'Отдельная модульная панель для вызовов + Face ID для прохода. Оценка по последнему полному снимку INTANT; ревизии и прошивки проверяются до заказа.',
  recheck: 'Повторная сверка 04.11.2026 не подтвердила DS-3E0526P-E/M(B) в XLSX. Цена коммутатора сохранена из последнего полного снимка; стоимость и наличие требуют уточнения.'
 },
 kz: {
  single: 'DS-K1T341CM және таңдалған мониторлардың үйлесімділігін тексеру қажет: пәтерге қоңырау, бейне, дыбыс және есікті ашу. Соңғы баға сұраныс бойынша.',
  modular: 'Қоңырауға бөлек модульдік панель + кіруге Face ID. INTANT соңғы толық деректері бойынша бағдар; нұсқалар мен микробағдарлама тапсырысқа дейін тексеріледі.',
  recheck: '04.11.2026 қайта тексеруінде DS-3E0526P-E/M(B) XLSX ішінде расталмады. Коммутатор бағасы соңғы толық деректерден сақталды; баға мен қолжетімділік нақтыланады.'
 },
 en: {
  single: 'DS-K1T341CM compatibility with the selected monitors requires checks: apartment calls, video, audio and door release. Final price on request.',
  modular: 'Separate modular panel for calls + Face ID for access. Estimate from the last complete INTANT snapshot; revisions and firmware checked before ordering.',
  recheck: 'The 4 November 2026 recheck could not confirm DS-3E0526P-E/M(B) in the XLSX. The switch price is retained from the last complete snapshot; price and availability require confirmation.'
 }
};
