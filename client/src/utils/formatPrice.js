export function formatPrice(price) {
  if (price == null || isNaN(price)) return '';
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}