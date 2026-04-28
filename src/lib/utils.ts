/**
 * Truncates a Stellar address to a readable format (e.g., G...ABCD)
 * @param address The full Stellar address
 * @param chars Number of characters to show at the start and end
 * @returns Formatted address string
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Formats a number as a currency string
 * @param amount The amount to format
 * @param currency The currency symbol (default: XLM)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string, currency = "XLM"): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

/**
 * Delays execution for a specified amount of time
 * @param ms Milliseconds to delay
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
