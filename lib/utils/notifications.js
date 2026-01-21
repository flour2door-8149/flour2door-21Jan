export async function sendOrderNotification(storeId, order) {
  // This will be implemented with WebSocket later
  console.log(`New order ${order.orderNumber} for store ${storeId}`)
}

export async function sendSMS(phone, message) {
  // Implement SMS sending (Twilio, etc.)
  console.log(`SMS to ${phone}: ${message}`)
}

export async function sendEmail(email, subject, body) {
  // Implement email sending
  console.log(`Email to ${email}: ${subject}`)
}