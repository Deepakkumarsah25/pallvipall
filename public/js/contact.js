/**
 * Pallavi Pal Official - Contact Page Client JavaScript
 */
document.addEventListener("DOMContentLoaded", function () {
  // 1. Textarea Character Counter
  const messageInput = document.getElementById("contactMessage");
  const charCountSpan = document.getElementById("charCount");

  if (messageInput && charCountSpan) {
    const updateCount = () => {
      charCountSpan.textContent = messageInput.value.length;
    };
    messageInput.addEventListener("input", updateCount);
    updateCount();
  }

  // 2. Click to Copy Functionality
  const copyButtons = document.querySelectorAll(".contact-copy-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      e.preventDefault();
      const textToCopy = this.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for non-https/older browsers
          const textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }

        const originalHTML = this.innerHTML;
        this.classList.add("copied");
        this.innerHTML = `
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#16a34a" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `;

        setTimeout(() => {
          this.classList.remove("copied");
          this.innerHTML = originalHTML;
        }, 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    });
  });

  // 3. Contact Form AJAX Submission
  const form = document.getElementById("publicContactForm");
  const alertBox = document.getElementById("contactFormAlert");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const submitSpinner = document.getElementById("contactSubmitSpinner");
  const submitText = document.getElementById("contactSubmitText");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Basic client-side validation
      const name = (form.name.value || "").trim();
      const phone = (form.phone.value || "").trim();
      const email = (form.email.value || "").trim();
      const district = (form.district.value || "").trim();
      const message = (form.message.value || "").trim();

      if (!name) {
        showAlert("कृपया अपना पूरा नाम दर्ज करें।", "error");
        form.name.focus();
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      const cleanedPhone = phone.replace(/[^0-9]/g, "");
      if (!cleanedPhone || cleanedPhone.length !== 10) {
        showAlert("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।", "error");
        form.phone.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showAlert("कृपया वैध ईमेल आईडी दर्ज करें।", "error");
        form.email.focus();
        return;
      }

      if (!message || message.length < 5) {
        showAlert("कृपया अपना संदेश अथवा प्रश्न विस्तार से लिखें (कम से कम 5 अक्षर)।", "error");
        form.message.focus();
        return;
      }

      // UI Loading State
      setLoading(true);
      hideAlert();

      try {
        const response = await fetch("/contact/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            name,
            phone: cleanedPhone,
            email,
            district,
            message,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert(data.message || "आपका संदेश सफलतापूर्वक भेज दिया गया है। हमारी टीम शीघ्र आपसे संपर्क करेगी।", "success");
          form.reset();
          if (charCountSpan) charCountSpan.textContent = "0";

          // Smooth scroll to alert
          alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          showAlert(data.message || "संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।", "error");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        showAlert("नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।", "error");
      } finally {
        setLoading(false);
      }
    });
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    if (submitSpinner) submitSpinner.style.display = isLoading ? "inline-block" : "none";
    if (submitText) submitText.textContent = isLoading ? "संदेश भेजा जा रहा है..." : "संदेश भेजें";
  }

  function showAlert(msg, type) {
    if (!alertBox) return;
    alertBox.className = type === "success" ? "contact-alert contact-alert-success" : "contact-alert contact-alert-error";
    
    const icon = type === "success" 
      ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
      : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    alertBox.innerHTML = `${icon}<div>${msg}</div>`;
    alertBox.style.display = "flex";
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.style.display = "none";
    alertBox.innerHTML = "";
  }
});
