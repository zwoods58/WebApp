// wa.me Link Utilities
// Generates WhatsApp Click-to-Chat links with pre-filled messages

// For testing: Allow any number or use default
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || null;

/**
 * Create a wa.me link with pre-filled message
 * @param {string} message - The message to pre-fill
 * @param {string} phoneNumber - Optional phone number (defaults to business number or user chooses)
 * @returns {string} wa.me URL
 */
export function createWaMeLink(message, phoneNumber = WHATSAPP_NUMBER) {
  // If no phone number, create share link (user chooses recipient)
  if (!phoneNumber) {
    return createShareLink(message);
  }
  
  // Remove + from phone number if present
  const cleanNumber = phoneNumber.replace(/\+/g, "").replace(/\s/g, "");
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Create a wa.me link for sharing content (user chooses recipient)
 * @param {string} message - The message to share
 * @returns {string} wa.me URL (no phone number)
 */
export function createShareLink(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/?text=${encodedMessage}`;
}

/**
 * Open WhatsApp in new tab
 * @param {string} message - The message to pre-fill
 * @param {string} phoneNumber - Optional phone number (if not provided, user chooses recipient)
 */
export function openWhatsApp(message, phoneNumber = WHATSAPP_NUMBER) {
  const link = createWaMeLink(message, phoneNumber);
  window.open(link, "_blank", "noopener,noreferrer");
}

/**
 * Create support message with user context
 * @param {string} context - What the user needs help with
 * @param {string} userId - User ID
 * @returns {string} Formatted support message
 */
export function createSupportMessage(context, userId) {
  return `Hi, I need help with: ${context}\nUser ID: ${userId || "Not logged in"}`;
}

/**
 * Create referral message
 * @param {string} referralCode - User's referral code
 * @param {string} appUrl - App URL
 * @returns {string} Formatted referral message
 */
export function createReferralMessage(referralCode, appUrl) {
  return `I'm tracking my business with this simple app. Use my code ${referralCode} to get your first month free!\n\n${appUrl}/signup?ref=${referralCode}`;
}

/**
 * Create report share message
 * @param {Object} reportData - Report data
 * @param {string} period - Time period
 * @returns {string} Formatted share message
 */
export function createReportShareMessage(reportData, period) {
  const profit = reportData.metrics?.netProfit || 0;
  const income = reportData.metrics?.totalIncome || 0;
  const expenses = reportData.metrics?.totalExpenses || 0;
  const isProfit = profit >= 0;
  
  return `Check out my business report for ${period}!\n\n💰 Money In: R${income.toFixed(2)}\n💸 Money Out: R${expenses.toFixed(2)}\n${isProfit ? "✅" : "⚠️"} ${isProfit ? "Profit" : "Loss"}: R${Math.abs(profit).toFixed(2)}\n\nGenerated with BeeZee Finance 🐝`;
}

export default {
  createWaMeLink,
  createShareLink,
  openWhatsApp,
  createSupportMessage,
  createReferralMessage,
  createReportShareMessage,
};

