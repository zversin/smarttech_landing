import supplier from './intant.mjs';
import { residentialPrice, accessScenario, cameraPrice, PRICE_DATE } from './config.mjs';

const numbers = {
    ...Object.fromEntries(Object.entries(supplier.items).map(([key, item]) => [`EQUIP_${key.toUpperCase()}`, item.price])),
    DOOR_EQUIPMENT: residentialPrice(1).equipment,
    INTERCOM_EQUIPMENT: residentialPrice(2, 20).equipment,
    DOOR_TOTAL: residentialPrice(1).total,
    INTERCOM_TOTAL: residentialPrice(2, 20).total,
    ACCESS_TOTAL: accessScenario(1, 2).quote.total,
    ACCESS_ENTRY: accessScenario(1, 1).quote.total,
    FLOOR_TOTAL: cameraPrice(2, 2).total
};

export const priceValues = {
    PRICE_DATE,
    PRICE_DATE_EN: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${supplier.priceListDate}T12:00:00Z`)),
    ...Object.fromEntries(Object.entries(numbers).flatMap(([key, value]) => [
        [key, new Intl.NumberFormat('ru-RU').format(value).replaceAll('\u00a0', ' ')],
        [`${key}_EN`, new Intl.NumberFormat('en-US').format(value)]
    ]))
};
