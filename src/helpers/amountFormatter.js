const DEFAULT_LOCALE = "en-NG";
const DEFAULT_CURRENCY = "NGN";

const amountFormatter = (
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
};

const defaultFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: "currency",
  currency: DEFAULT_CURRENCY,
  minimumFractionDigits: 2,
});

amountFormatter.format = defaultFormatter.format;

export { amountFormatter };
