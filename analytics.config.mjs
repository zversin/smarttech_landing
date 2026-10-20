// Public Yandex Metrika counter number owned by SmartTech.
export const METRIKA_COUNTER_ID = 113700627;

export function metrikaMarkup(counterId = METRIKA_COUNTER_ID) {
    if (counterId === null) return '';
    if (!Number.isSafeInteger(counterId) || counterId <= 0) throw new Error('Invalid Metrika counter number');
    return `<script defer src="/analytics.js?v=1" data-counter="${counterId}"></script>`;
}
