// Единственный источник стоимости. После изменения выполните npm run build.
export const FLOOR_CCTV_PRICE = 160000;
export const WHATSAPP_NUMBER = '77087262237';
export const DEFAULT_APARTMENTS = 4;
export const SUBSCRIPTION_MONTHLY_PRICE = 1500;

export const formatTenge = (value) => `${new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0
}).format(value)} ₸`;

export function pricePerApartment(count) {
    if (!Number.isInteger(count) || count < 2 || count > 8) {
        throw new RangeError('Количество квартир: от 2 до 8');
    }
    return FLOOR_CCTV_PRICE / count;
}
