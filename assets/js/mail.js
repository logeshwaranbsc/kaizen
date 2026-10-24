/**
 * ============================================================================
 * Kaizen Built-On Systems - Direct Gmail Navigation
 * File: assets/js/mail.js
 * ============================================================================
 *
 * When the user fills out the form and clicks "Request a Discovery Call":
 * 1. Validates all required fields in Step 1 and Step 2.
 * 2. Compiles the entered details into a formatted email subject and body.
 * 3. Directly navigates to Gmail Compose with all details pre-filled so the
 *    user can immediately click Send.
 */

// Recipient email address
const RECIPIENT_EMAIL = "kaizenbuiltonsystems@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const discoveryForm = document.getElementById("discoveryForm");
  const notificationBox = document.getElementById("mailStatusNotice");

  // Keep any notice box hidden
  if (notificationBox) {
    notificationBox.style.display = "none";
    notificationBox.innerHTML = "";
  }

  if (!discoveryForm) return;

  discoveryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Validate Step 1 first if multi-step form is active
    if (typeof window.validateFormStep1 === "function" && !window.validateFormStep1()) {
      if (typeof window.goToFormStep === "function") {
        window.goToFormStep(1);
      }
      return;
    }

    // 2. Validate Step 2 fields
    const formStep2 = document.getElementById("formStep2");
    if (formStep2) {
      const step2Inputs = formStep2.querySelectorAll("input[required], select[required], textarea[required]");
      for (let input of step2Inputs) {
        if (!input.checkValidity()) {
          input.reportValidity();
          input.focus();
          return;
        }
      }
    }

    // 3. Extract form field values
    const fullName = (document.getElementById("fullName")?.value || "").trim();
    const workEmail = (document.getElementById("workEmail")?.value || "").trim();
    const phone = (document.getElementById("phone")?.value || "").trim();
    const company = (document.getElementById("company")?.value || "").trim();
    const industry = document.getElementById("industry")?.value || "";
    const companySize = document.getElementById("companySize")?.value || "";
    const challenge = (document.getElementById("challenge")?.value || "").trim();
    const lookingToImprove = (document.getElementById("lookingToImprove")?.value || "").trim();
    const prefDate = document.getElementById("prefDate")?.value || "";
    const prefTime = document.getElementById("prefTime")?.value || "";

    // 4. Construct email subject & body
    const subject = `Discovery Call Request: ${fullName} (${company || "Business Inquirer"})`;

    const body = 
`Hello Kaizen Built-On Systems Team,

I would like to request a Discovery Call to discuss operations and systems transformation for my business.

Here are the details from my submission:

==================================================
CLIENT & COMPANY INFORMATION
==================================================
• Full Name:      ${fullName}
• Work Email:     ${workEmail}
• Phone:          ${phone}
• Company Name:   ${company}
• Industry:       ${industry}
• Company Size:   ${companySize}

==================================================
CURRENT CHALLENGE & FOCUS
==================================================
• Current Business Challenge:
${challenge}

• What We Want to Improve:
${lookingToImprove ? lookingToImprove : "Operations streamlining & systems architecture"}

==================================================
PREFERRED SCHEDULE
==================================================
• Preferred Date: ${prefDate}
• Preferred Time: ${prefTime}

==================================================
Submitted via Kaizen Built-On Systems Website Form
`;

    // 5. Build direct Gmail compose URL
    const encodedRecipient = encodeURIComponent(RECIPIENT_EMAIL);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedRecipient}&su=${encodedSubject}&body=${encodedBody}`;

    // 6. Update submit button feedback
    const submitBtn = discoveryForm.querySelector(".submit-btn");
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "Request a Discovery Call &rarr;";

    if (submitBtn) {
      submitBtn.innerHTML = `<span>Opening Gmail...</span>`;
      submitBtn.disabled = true;
    }

    // 7. Direct navigation to Gmail
    // Attempt opening in a new tab first; if popup blocked, navigate current window
    const newTab = window.open(gmailUrl, "_blank");
    if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
      window.location.href = gmailUrl;
    }

    // Restore button state after a brief moment
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = `<span>Opened in Gmail &bull; Click to Re-open &rarr;</span>`;
        submitBtn.disabled = false;
      }
    }, 1500);
  });
});
