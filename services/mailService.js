const nodemailer = require("nodemailer");

/**
 * Escape HTML to prevent injection in email templates
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Create Nodemailer Transporter using environment variables
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    console.warn("MailService: SMTP credentials not fully configured.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Send email notification when contact form is submitted
 * Destination: pallvipal.official@gmail.com
 *
 * @param {Object} messageData
 * @param {string} messageData.name
 * @param {string} messageData.phone
 * @param {string} messageData.email
 * @param {string} [messageData.district]
 * @param {string} messageData.message
 * @param {string} [messageData.ipAddress]
 * @param {Date}   [messageData.createdAt]
 */
async function sendContactNotification(messageData) {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn("MailService: Transporter unavailable. Skipping email send.");
      return { success: false, error: "SMTP not configured" };
    }

    const receiverEmail =
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "pallvipal.official@gmail.com";

    const senderEmail =
      process.env.SMTP_FROM_EMAIL ||
      process.env.SMTP_USERNAME ||
      "deepak232a@gmail.com";

    const senderName = "पल्लवी पाल - आधिकारिक पोर्टल";
    const dateStr = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const safeName = escapeHtml(messageData.name);
    const safePhone = escapeHtml(messageData.phone);
    const safeEmail = escapeHtml(messageData.email);
    const safeDistrict = escapeHtml(messageData.district || "उल्लेखित नहीं");
    const safeMessage = escapeHtml(messageData.message);
    const safeIp = escapeHtml(messageData.ipAddress || "N/A");

    const subject = `🚨 नया जनसंपर्क संदेश: ${messageData.name} (${messageData.district || "जनसेवा केंद्र"})`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .email-header { background: #8c1a1a; color: #ffffff; padding: 24px 20px; text-align: center; }
    .email-header h1 { margin: 0; font-size: 21px; font-weight: 800; }
    .email-header p { margin: 6px 0 0; font-size: 13px; opacity: 0.95; color: #ffe4e6; }
    .email-body { padding: 26px 24px; }
    .info-card { background: #fdfaf8; border: 1px solid #fed7aa; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
    .info-row { display: flex; margin-bottom: 12px; font-size: 14px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-label { width: 130px; font-weight: 700; color: #64748b; flex-shrink: 0; }
    .info-value { font-weight: 600; color: #0f172a; flex: 1; }
    .info-value a { color: #8c1a1a; text-decoration: none; font-weight: 700; }
    .message-header { font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .message-box { background: #ffffff; border: 1.5px solid #e2e8f0; border-left: 4px solid #8c1a1a; border-radius: 8px; padding: 16px; font-size: 14.5px; line-height: 1.6; color: #334155; white-space: pre-wrap; word-break: break-word; }
    .action-buttons { margin-top: 24px; text-align: center; }
    .action-btn { display: inline-block; padding: 11px 22px; border-radius: 8px; font-size: 13.5px; font-weight: 700; text-decoration: none; margin: 4px 6px; }
    .btn-reply { background: #8c1a1a; color: #ffffff !important; }
    .btn-call { background: #f1f5f9; color: #1e293b !important; border: 1px solid #cbd5e1; }
    .email-footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 20px; font-size: 11.5px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>पल्लवी पाल - जनसेवा कार्यालय</h1>
      <p>वेबसाइट संपर्क फ़ॉर्म (Contact Form) से नया संदेश प्राप्त हुआ</p>
    </div>
    <div class="email-body">
      <div class="info-card">
        <div class="info-row">
          <div class="info-label">नाम:</div>
          <div class="info-value"><strong>${safeName}</strong></div>
        </div>
        <div class="info-row">
          <div class="info-label">फ़ोन नंबर:</div>
          <div class="info-value"><a href="tel:${safePhone}">📞 ${safePhone}</a></div>
        </div>
        <div class="info-row">
          <div class="info-label">ईमेल:</div>
          <div class="info-value"><a href="mailto:${safeEmail}">✉️ ${safeEmail}</a></div>
        </div>
        <div class="info-row">
          <div class="info-label">ज़िला / क्षेत्र:</div>
          <div class="info-value">${safeDistrict}</div>
        </div>
      </div>

      <div class="message-header">प्रेषक का संदेश:</div>
      <div class="message-box">${safeMessage}</div>

      <div class="action-buttons">
        <a href="mailto:${safeEmail}?subject=Re:%20पल्लवी%20पाल%20जनसेवा%20कार्यालय%20-%20आपके%20संदेश%20का%20जवाब" class="action-btn btn-reply">ईमेल का जवाब दें ↗</a>
        <a href="tel:${safePhone}" class="action-btn btn-call">सीधे कॉल करें 📞</a>
      </div>
    </div>
    <div class="email-footer">
      प्राप्त समय: ${dateStr} (IST) &bull; IP: ${safeIp} &bull; पल्लवी पाल - आधिकारिक पोर्टल
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
पल्लवी पाल - नया संपर्क संदेश
---------------------------------------------
नाम: ${messageData.name}
फ़ोन: ${messageData.phone}
ईमेल: ${messageData.email}
ज़िला: ${messageData.district || "उल्लेखित नहीं"}
दिनांक: ${dateStr}

संदेश:
${messageData.message}

IP Address: ${messageData.ipAddress || "N/A"}
---------------------------------------------
    `;

    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: receiverEmail,
      replyTo: `${messageData.name} <${messageData.email}>`,
      subject,
      text: textContent.trim(),
      html: htmlContent.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MailService] Contact notification sent successfully to ${receiverEmail}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[MailService] Error sending contact notification email:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendContactNotification,
  getTransporter,
};
