/* ==========================================================================
   WORKNEST - CALCULATOR.JS
   Real-Time Dynamic Workspace Pricing Calculator
   ========================================================================== */

(function () {
  "use strict";

  const teamSlider = document.getElementById("calcTeamSlider");
  const teamValDisplay = document.getElementById("calcTeamVal");
  const planButtons = document.querySelectorAll(".calc-plan-btn");
  const billingMonthlyBtn = document.getElementById("calcBillingMonthly");
  const billingYearlyBtn = document.getElementById("calcBillingYearly");
  const addonItems = document.querySelectorAll(".calc-addon-item");

  const totalDisplay = document.getElementById("calcTotalPrice");
  const savingsBadge = document.getElementById("calcSavingsBadge");
  const breakdownSeats = document.getElementById("calcBreakdownSeats");
  const breakdownPlan = document.getElementById("calcBreakdownPlan");
  const breakdownAddons = document.getElementById("calcBreakdownAddons");
  const breakdownTerm = document.getElementById("calcBreakdownTerm");

  let currentTeamSize = 4;
  let currentPlan = "private"; // hotdesk, dedicated, private
  let isAnnual = true;
  let selectedAddons = new Set(["coffee"]);

  const planRates = {
    hotdesk: { name: "Hot Desk", baseRate: 199 },
    dedicated: { name: "Dedicated Desk", baseRate: 349 },
    private: { name: "Private Office", baseRate: 599 }
  };

  const addonRates = {
    keycard: { name: "24/7 Smart Access", perPerson: true, rate: 30 },
    ip: { name: "Dedicated Gigabit IP", perPerson: false, rate: 80 },
    coffee: { name: "Artisan Coffee Pass", perPerson: true, rate: 25 },
    mail: { name: "Mail & Business Address", perPerson: false, rate: 45 }
  };

  function recalculate() {
    const plan = planRates[currentPlan];
    let baseTotal = currentTeamSize * plan.baseRate;

    // Addons calculation
    let addonsTotal = 0;
    selectedAddons.forEach((addonKey) => {
      const addon = addonRates[addonKey];
      if (addon) {
        if (addon.perPerson) {
          addonsTotal += addon.rate * currentTeamSize;
        } else {
          addonsTotal += addon.rate;
        }
      }
    });

    let subtotal = baseTotal + addonsTotal;
    let finalMonthly = subtotal;
    let annualSavings = 0;

    if (isAnnual) {
      finalMonthly = Math.round(subtotal * 0.8); // 20% discount
      annualSavings = (subtotal - finalMonthly) * 12;
    }

    // Update DOM outputs
    if (teamValDisplay) {
      teamValDisplay.textContent = `${currentTeamSize} ${currentTeamSize === 1 ? "Member" : "Members"}`;
    }

    if (totalDisplay) {
      totalDisplay.innerHTML = `$${finalMonthly.toLocaleString()} <span>/mo</span>`;
    }

    if (savingsBadge) {
      if (isAnnual && annualSavings > 0) {
        savingsBadge.style.display = "inline-flex";
        savingsBadge.innerHTML = `<i class="bi bi-tag-fill"></i> Save $${annualSavings.toLocaleString()}/yr with annual billing`;
      } else {
        savingsBadge.style.display = "none";
      }
    }

    if (breakdownSeats) breakdownSeats.textContent = `${currentTeamSize} desks`;
    if (breakdownPlan) breakdownPlan.textContent = `${plan.name} ($${plan.baseRate}/mo/desk)`;
    if (breakdownAddons) breakdownAddons.textContent = `$${addonsTotal}/mo`;
    if (breakdownTerm) breakdownTerm.textContent = isAnnual ? "Annual (20% Off applied)" : "Monthly (Flexible)";
  }

  // Event Listeners
  if (teamSlider) {
    teamSlider.addEventListener("input", (e) => {
      currentTeamSize = parseInt(e.target.value, 10);
      recalculate();
    });
  }

  planButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      planButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentPlan = btn.getAttribute("data-plan");
      recalculate();
    });
  });

  if (billingMonthlyBtn && billingYearlyBtn) {
    billingMonthlyBtn.addEventListener("click", () => {
      billingMonthlyBtn.classList.add("active");
      billingYearlyBtn.classList.remove("active");
      isAnnual = false;
      recalculate();
    });

    billingYearlyBtn.addEventListener("click", () => {
      billingYearlyBtn.classList.add("active");
      billingMonthlyBtn.classList.remove("active");
      isAnnual = true;
      recalculate();
    });
  }

  addonItems.forEach((item) => {
    item.addEventListener("click", () => {
      const key = item.getAttribute("data-addon");
      if (selectedAddons.has(key)) {
        selectedAddons.delete(key);
        item.classList.remove("selected");
      } else {
        selectedAddons.add(key);
        item.classList.add("selected");
      }
      recalculate();
    });
  });

  // Initial calculation
  recalculate();
})();
