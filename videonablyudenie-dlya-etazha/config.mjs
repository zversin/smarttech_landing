import { cameraPrice } from '../pricing/config.mjs';
import supplier from '../pricing/intant.mjs';
// Единственный источник стоимости. После изменения выполните npm run build.
export const FLOOR_CCTV_PRICE = cameraPrice(2, 2).total;
export const WHATSAPP_NUMBER = '77087262237';
export const DEFAULT_APARTMENTS = 4;
export const SUBSCRIPTION_MONTHLY_PRICE = 1500;
// Публичные цены INTANT из общего проверенного снимка.
export const HDD_PRICES = { 0: 0, 2: supplier.items.disk2.price, 4: supplier.items.disk4.price };

export function packagePrice(cameras, diskTb) {
    if (!Number.isInteger(cameras) || cameras < 1 || cameras > 4) throw new RangeError('Количество камер: от 1 до 4');
    if (![0, 2, 4].includes(diskTb)) throw new RangeError('HDD: без диска, 2 или 4 ТБ');
    return cameraPrice(cameras, diskTb).total;
}

export function archiveDays(cameras, diskTb, bitrateMbps) {
    packagePrice(cameras, diskTb);
    if (![1, 2, 4].includes(bitrateMbps)) throw new RangeError('Битрейт: 1, 2 или 4 Мбит/с');
    return diskTb * 1e12 * 0.9 * 8 / (cameras * bitrateMbps * 1e6 * 86400);
}

export function formatDays(value) {
    const count = Math.floor(value);
    const unit = { one: 'день', few: 'дня', many: 'дней', other: 'дней' }[new Intl.PluralRules('ru').select(count)];
    return `${count} ${unit}`;
}

export const formatTenge = (value) => `${new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0
}).format(value)} ₸`;

export function pricePerApartment(count) {
    if (!Number.isInteger(count) || count < 2 || count > 8) {
        throw new RangeError('Количество квартир: от 2 до 8');
    }
    return FLOOR_CCTV_PRICE / count;
}
