/**
 * INITIATIVE-MODAL.JS - Handles Dynamic Actions for What-We-Do Cards
 */
document.addEventListener("DOMContentLoaded", () => {
  // Modal Data Dictionary for all 6 initiatives
  const initiativeData = {
    "social-rights": {
      tag: "Awareness & Rights Wing",
      title: "Social Unity & Legal Rights Support",
      description: "पल्लवी पाल जनसेवा पहल के अंतर्गत कानूनी सहायता शिविर, राशन व पेंशन लाभ एवं जमीनी स्तर पर संवैधानिक अधिकारों का संरक्षण।",
      highlights: [
        "Free assistance in resolving administrative hurdles in government schemes and benefits.",
        "Regular legal counseling sessions organized at traditional settlements and ghats.",
        "Collective awareness drives and campaigns for social empowerment."
      ],
      helplineText: "Rights Helpline: +91 99999 99999",
      helplineTel: "+919999999999",
      formTitle: "Registration for Support or Grievance Redressal",
      formSubmitText: "Submit Support Request"
    },

    "youth-wing": {
      tag: "Education & Youth Wing",
      title: "Youth Wing Guidance & Student Support",
      description: "Special mentorship and educational resources for students preparing for competitive examinations (UPSC, UPPSC, SSC, Police, Defense).",
      highlights: [
        "Free career counseling by accomplished officers and experienced educators.",
        "Digital study materials, current affairs, and mock test access.",
        "Scholarship coordination for hardworking students from low-income families."
      ],
      helplineText: "Youth Helpline: +91 99999 99998",
      helplineTel: "+919999999998",
      formTitle: "Student Guidance Application Form",
      formSubmitText: "Get Guidance from Youth Wing"
    },

    "schemes-info": {
      tag: "Self-Employment & Schemes",
      title: "Fisheries & Self-Employment Schemes",
      description: "Comprehensive information and application guidance for all central and state welfare schemes for boatmen, fish farmers, and micro-entrepreneurs.",
      highlights: [
        "Pradhan Mantri Matsya Sampada Yojana (PMMSY) - 40% to 60% government subsidy support.",
        "Kisan Credit Card (KCC) for boatmen - Concessional interest rate credit facilities.",
        "Self-Help Groups (SHGs) formation, practical guidance, and financial literacy."
      ],
      helplineText: "Schemes Advisory: +91 99999 99997",
      helplineTel: "+919999999997",
      formTitle: "Scheme Application Support Request",
      formSubmitText: "Request Information & Support"
    },

    "river-rights": {
      tag: "River & Riparian Rights",
      title: "River Conservation, Ghat Safety & Livelihood Rights",
      description: "A community-driven campaign for the conservation of sacred rivers, ghat development, and safeguarding traditional boating and fishing rights.",
      highlights: [
        "Regular cleanliness and safety drives along riverbanks and ghats.",
        "Modern life jackets, safety equipment, and emergency training for boatmen.",
        "Legal protection of historic rights for traditional boating and fishing communities."
      ],
      helplineText: "River Watch Helpline: +91 99999 99996",
      helplineTel: "+919999999996",
      formTitle: "River Watch / Volunteer Form",
      formSubmitText: "Join the Initiative"
    },

    "disaster-relief": {
      tag: "Disaster Relief & Response",
      title: "Emergency Flood Relief & Medical Response Team",
      description: "A dedicated volunteer network for rapid boat rescues, delivering rations, drinking water, and essential medicines during riverbank flooding.",
      highlights: [
        "24x7 quick rescue team of experienced local boatmen and expert swimmers.",
        "Distribution of dry food rations, clean drinking water, and emergency shelter kits.",
        "Free post-flood medical camps to prevent infectious diseases."
      ],
      helplineText: "Emergency Relief: 1800-123-4567 / +91 99999 99995",
      helplineTel: "+919999999995",
      formTitle: "Relief Volunteer / Assistance Form",
      formSubmitText: "Join Relief Team"
    },

    "cultural-events": {
      tag: "Cultural Heritage Wing",
      title: "Cultural Heritage & Social Harmony Festival",
      description: "ऐतिहासिक सांस्कृतिक धरोहर, सामाजिक सद्भाव और महापुरुषों के विचारों को जन-जन तक पहुंचाने का सांस्कृतिक अभियान।",
      highlights: [
        "वार्षिक राज्य स्तरीय सांस्कृतिक सम्मेलन, विचार गोष्ठियां एवं सामाजिक चेतना यात्रा।",
        "Conferences and community dialogues across Uttar Pradesh districts.",
        "Felicitation ceremonies recognizing youth and elders in education, sports, and social service."
      ],
      helplineText: "Festival Committee: +91 99999 99994",
      helplineTel: "+919999999994",
      formTitle: "Festival Participation / Invitation Request",
      formSubmitText: "Get Festival Details & Invitation"
    }
  };

  // DOM Elements
  const backdrop = document.getElementById("initiativeModalBackdrop");
  const closeBtn = document.getElementById("initiativeModalClose");
  const categoryTag = document.getElementById("modalCategoryTag");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const highlightsList = document.getElementById("modalHighlightsList");
  const helplineBtn = document.getElementById("modalHelplineBtn");
  const helplineText = document.getElementById("modalHelplineText");
  const formTitle = document.getElementById("modalFormTitle");
  const submitBtnText = document.getElementById("modalSubmitBtnText");
  const initiativeForm = document.getElementById("initiativeActionForm");
  const successBanner = document.getElementById("modalSuccessBanner");
  const initiativeCategoryInput = document.getElementById("initiativeCategoryInput");

  function openInitiativeModal(initiativeKey) {
    const data = (window.INITIATIVES_DATA && window.INITIATIVES_DATA[initiativeKey]) || initiativeData[initiativeKey];
    if (!data || !backdrop) return;

    // Reset previous form state
    if (initiativeForm) {
      initiativeForm.reset();
      initiativeForm.style.display = "block";
    }
    if (successBanner) {
      successBanner.style.display = "none";
    }

    // Populate data
    if (categoryTag) categoryTag.textContent = data.tag;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.description;
    if (formTitle) formTitle.textContent = data.formTitle;
    if (submitBtnText) submitBtnText.textContent = data.formSubmitText;
    if (initiativeCategoryInput) initiativeCategoryInput.value = data.title;

    if (helplineBtn && helplineText) {
      helplineBtn.setAttribute("href", `tel:${data.helplineTel}`);
      helplineText.textContent = data.helplineText;
    }

    // Populate highlights
    if (highlightsList) {
      highlightsList.innerHTML = "";
      data.highlights.forEach((point) => {
        const li = document.createElement("li");
        li.className = "modal-highlight-item";
        li.innerHTML = `
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <span>${point}</span>
        `;
        highlightsList.appendChild(li);
      });
    }

    // Show modal
    backdrop.classList.add("active");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeInitiativeModal() {
    if (!backdrop) return;
    backdrop.classList.remove("active");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Attach click listeners to all buttons having data-initiative
  document.querySelectorAll("[data-initiative]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const initiativeKey = btn.getAttribute("data-initiative");
      openInitiativeModal(initiativeKey);
    });
  });

  // Close handlers
  if (closeBtn) closeBtn.addEventListener("click", closeInitiativeModal);
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeInitiativeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop && backdrop.classList.contains("active")) {
      closeInitiativeModal();
    }
  });

  // Handle Form Submission
  if (initiativeForm) {
    initiativeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = initiativeForm.querySelector("button[type='submit']");
      const name = document.getElementById("modalUserName")?.value;
      const phone = document.getElementById("modalUserPhone")?.value;
      const district = document.getElementById("modalUserDistrict")?.value;
      const category = initiativeCategoryInput?.value || "Initiative Support";
      const message = document.getElementById("modalUserMessage")?.value;

      if (submitBtn) {
        submitBtn.disabled = true;
        const origText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Submitting...</span>`;

        try {
          const res = await fetch("/api/submit-inquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, district, category, message }),
          });
          const data = await res.json();
          if (data.success) {
            initiativeForm.style.display = "none";
            if (successBanner) {
              successBanner.textContent = "✓ " + (data.message || "Your request and details have been recorded successfully.");
              successBanner.style.display = "block";
            }
          } else {
            alert(data.message || "An error occurred. Please try again.");
          }
        } catch (err) {
          console.error(err);
          initiativeForm.style.display = "none";
          if (successBanner) successBanner.style.display = "block";
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
      }
    });
  }
});
