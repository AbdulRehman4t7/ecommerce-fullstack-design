export function formatPrice(
  price: number,
  options?: { currency?: string; locale?: string }
): string {
  const { currency = "USD", locale = "en-US" } = options ?? {};
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(price);
}
