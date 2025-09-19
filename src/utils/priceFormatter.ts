/**
 * Price formatting utilities for consistent price display throughout the app
 * Removes unnecessary .00 decimals from whole numbers while preserving pence when needed
 */

/**
 * Formats a price amount removing unnecessary .00 decimals
 * @param amount - The price amount as a number
 * @param currency - The currency symbol (default: '£')
 * @returns Formatted price string
 *
 * Examples:
 * formatPrice(50) → "£50"
 * formatPrice(50.00) → "£50"
 * formatPrice(52.50) → "£52.50"
 * formatPrice(124.75) → "£124.75"
 */
export function formatPrice(amount: number, currency: string = '£'): string {
  // Check if the number is a whole number (no meaningful decimal places)
  if (amount % 1 === 0) {
    return `${currency}${amount.toFixed(0)}`;
  }

  // Has decimal places, format with appropriate precision
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * Formats a price string by removing .00 decimals
 * @param priceString - Price string like "£50.00/hour" or "From £100.00"
 * @returns Cleaned price string
 *
 * Examples:
 * cleanPriceString("£50.00/hour") → "£50/hour"
 * cleanPriceString("From £100.00") → "From £100"
 * cleanPriceString("£52.50/hour") → "£52.50/hour" (unchanged)
 */
export function cleanPriceString(priceString: string): string {
  // Replace .00 with empty string, but only when followed by non-digit or end of string
  return priceString.replace(/\.00(?!\d)/g, '');
}

/**
 * Formats price with suffix (like "/hour", "/mile", etc.)
 * @param amount - The price amount as a number
 * @param suffix - The suffix to append (e.g., "/hour", "/mile")
 * @param currency - The currency symbol (default: '£')
 * @returns Formatted price string with suffix
 */
export function formatPriceWithSuffix(amount: number, suffix: string, currency: string = '£'): string {
  return `${formatPrice(amount, currency)}${suffix}`;
}

/**
 * Formats a price range
 * @param fromAmount - Starting price amount
 * @param toAmount - Ending price amount (optional)
 * @param suffix - Suffix like "/hour" (optional)
 * @param currency - Currency symbol (default: '£')
 * @returns Formatted price range string
 */
export function formatPriceRange(
  fromAmount: number,
  toAmount?: number,
  suffix: string = '',
  currency: string = '£'
): string {
  const fromPrice = formatPrice(fromAmount, currency);

  if (toAmount) {
    const toPrice = formatPrice(toAmount, currency);
    return `${fromPrice} - ${toPrice}${suffix}`;
  }

  return `From ${fromPrice}${suffix}`;
}

/**
 * Formats price breakdown components
 * @param components - Array of price components {label: string, amount: number}
 * @param currency - Currency symbol (default: '£')
 * @returns Array of formatted price components
 */
export function formatPriceBreakdown(
  components: Array<{label: string; amount: number}>,
  currency: string = '£'
): Array<{label: string; formattedAmount: string}> {
  return components.map(component => ({
    label: component.label,
    formattedAmount: formatPrice(component.amount, currency)
  }));
}