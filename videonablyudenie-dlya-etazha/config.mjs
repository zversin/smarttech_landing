// Единственный источник стоимости. После изменения выполните npm run build.
export const FLOOR_CCTV_PRICE = 230000;
export const WHATSAPP_NUMBER = '77087262237';
export const DEFAULT_APARTMENTS = 4;
export const SUBSCRIPTION_MONTHLY_PRICE = 1500;
export const ADDITIONAL_CAMERA_PRICE = 25000;
// Публичные цены INTANT, проверено 03.10.2026.
export const HDD_PRICES = { 2: 94338, 4: 129202 };

export function packagePrice(cameras, diskTb) {
    if (!Number.isInteger(cameras) || cameras < 1 || cameras > 4) throw new RangeError('Количество камер: от 1 до 4');
    if (![2, 4].includes(diskTb)) throw new RangeError('HDD: 2 или 4 ТБ');
    return FLOOR_CCTV_PRICE + (cameras - 2) * ADDITIONAL_CAMERA_PRICE + HDD_PRICES[diskTb] - HDD_PRICES[2];
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
