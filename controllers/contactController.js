const ContactInfo = require("../models/ContactInfo");
const ContactMessage = require("../models/ContactMessage");
const { sendContactNotification } = require("../services/mailService");

/**
 * Render Public Contact Us Page
 */
exports.getContactPage = async (req, res) => {
  try {
    const contact = await ContactInfo.getOrSeed();

    res.render("contact", {
      title: "संपर्क करें | पल्लवी पाल - जनसेवा कार्यालय",
      currentUrl: "/contact",
      contact,
      message: req.query.msg || null,
      error: req.query.err || null,
    });
  } catch (error) {
    console.error("Error loading contact page:", error);
    res.status(500).render("contact", {
      title: "संपर्क करें | पल्लवी पाल - जनसेवा कार्यालय",
      currentUrl: "/contact",
      contact: ContactInfo.defaultData,
      message: null,
      error: "पेज लोड करने में अस्थायी समस्या आई। कृपया पुनः प्रयास करें।",
    });
  }
};

/**
 * Handle Contact Form Submission (Supports both AJAX and Traditional POST)
 */
exports.submitContactForm = async (req, res) => {
  const isAjax =
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes("json")) ||
    (req.headers["content-type"] && req.headers["content-type"].includes("json"));

  try {
    const { name, phone, email, district, message } = req.body;

    // 1. Validation: Name
    if (!name || !name.trim()) {
      const errMsg = "कृपया अपना पूरा नाम दर्ज करें।";
      if (isAjax) return res.status(400).json({ success: false, message: errMsg });
      return res.redirect(`/contact?err=${encodeURIComponent(errMsg)}`);
    }

    // 2. Validation: Phone (10 digits)
    const cleanedPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!cleanedPhone || cleanedPhone.length !== 10) {
      const errMsg = "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।";
      if (isAjax) return res.status(400).json({ success: false, message: errMsg });
      return res.redirect(`/contact?err=${encodeURIComponent(errMsg)}`);
    }

    // 3. Validation: Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      const errMsg = "कृपया एक वैध ईमेल आईडी दर्ज करें।";
      if (isAjax) return res.status(400).json({ success: false, message: errMsg });
      return res.redirect(`/contact?err=${encodeURIComponent(errMsg)}`);
    }

    // 4. Validation: Message
    if (!message || message.trim().length < 5) {
      const errMsg = "कृपया अपना संदेश विस्तार से लिखें (कम से कम 5 अक्षर)।";
      if (isAjax) return res.status(400).json({ success: false, message: errMsg });
      return res.redirect(`/contact?err=${encodeURIComponent(errMsg)}`);
    }

    // Client IP Address
    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.ip ||
      "";

    // Create & Save
    const newMessage = await ContactMessage.create({
      name: name.trim(),
      phone: cleanedPhone,
      email: email.trim().toLowerCase(),
      district: (district || "").trim(),
      message: message.trim(),
      status: "new",
      ipAddress,
    });

    // Send email notification to official email asynchronously
    sendContactNotification({
      name: newMessage.name,
      phone: newMessage.phone,
      email: newMessage.email,
      district: newMessage.district,
      message: newMessage.message,
      ipAddress: newMessage.ipAddress,
      createdAt: newMessage.createdAt,
    }).catch((mailErr) => {
      console.error("Contact Form Email Notification Error:", mailErr);
    });

    const successMsg = "आपका संदेश सफलतापूर्वक प्राप्त हो गया है। हमारी टीम शीघ्र आपसे संपर्क करेगी।";

    if (isAjax) {
      return res.status(201).json({
        success: true,
        message: successMsg,
        data: {
          id: newMessage._id,
        },
      });
    }

    return res.redirect(`/contact?msg=${encodeURIComponent(successMsg)}`);
  } catch (error) {
    console.error("Contact Form Submission Error:", error);
    const errMsg = "संदेश भेजने में कोई त्रुटि हुई। कृपया कुछ समय बाद पुनः प्रयास करें।";

    if (isAjax) {
      return res.status(500).json({ success: false, message: errMsg });
    }

    return res.redirect(`/contact?err=${encodeURIComponent(errMsg)}`);
  }
};
