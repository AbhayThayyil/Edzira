// Edzira site script: progressive enhancement only. Everything works without it.

// Header: solid background once the page scrolls. A 1px sentinel watched by
// IntersectionObserver avoids running any code on every scroll event.
const header = document.querySelector(".site-header");
if (header && "IntersectionObserver" in window) {
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:8px;left:0;width:1px;height:1px;pointer-events:none";
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => header.classList.toggle("is-scrolled", !e.isIntersecting)).observe(sentinel);
}

// Mobile navigation drawer.
const toggle = document.querySelector(".nav-toggle");
toggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", String(open));
});
const drawer = document.getElementById("site-nav");
document.addEventListener("keydown", (e) => {
  const drawerOpen = document.body.classList.contains("nav-open");
  if (e.key === "Escape") {
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
    closeMenus();
    if (drawerOpen) toggle?.focus(); // return focus to the menu button
    return;
  }
  // While the mobile drawer is open, Tab cycles through the menu button and the drawer's links only.
  if (e.key !== "Tab" || !drawerOpen || !toggle || !drawer) return;
  const items = [toggle, ...drawer.querySelectorAll("a[href], button")].filter((el) => el.getClientRects().length);
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  else if (!items.includes(document.activeElement)) { e.preventDefault(); first.focus(); }
});

// Solutions dropdown: click/tap to toggle, hover on pointer devices.
const menus = document.querySelectorAll(".nav__item--menu");
function closeMenus(except) {
  menus.forEach((m) => {
    if (m === except) return;
    m.dataset.open = "false";
    m.querySelector("button")?.setAttribute("aria-expanded", "false");
  });
}
menus.forEach((item) => {
  const btn = item.querySelector("button");
  const set = (open) => {
    item.dataset.open = String(open);
    btn.setAttribute("aria-expanded", String(open));
  };
  btn.addEventListener("click", () => {
    const open = item.dataset.open !== "true";
    closeMenus(item);
    set(open);
  });
  if (window.matchMedia("(hover: hover) and (min-width: 1021px)").matches) {
    let t;
    item.addEventListener("mouseenter", () => { clearTimeout(t); set(true); });
    item.addEventListener("mouseleave", () => { t = setTimeout(() => set(false), 150); });
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav__item--menu")) closeMenus();
});

// Scroll reveal. Children of [data-reveal-group] are staggered.
document.querySelectorAll("[data-reveal-group]").forEach((group) => {
  [...group.querySelectorAll("[data-reveal]")].forEach((el, i) => el.style.setProperty("--reveal-i", i));
});
const revealables = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("is-visible"));
}
// Tells the inline fallback in base.njk that reveal is working, so content stays managed by it.
window.edziraReady = true;

// Pause looping animations in sections that are off screen.
const loopers = document.querySelectorAll(".hero");
if ("IntersectionObserver" in window) {
  const po = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("is-paused", !e.isIntersecting)));
  loopers.forEach((el) => po.observe(el));
}

// Insights topic filter.
document.querySelectorAll("[data-filter]").forEach((group) => {
  const cards = document.querySelectorAll(".insight[data-topic]");
  group.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-topic]");
    if (!btn) return;
    group.querySelectorAll("[data-topic]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const t = btn.dataset.topic;
    cards.forEach((c) => { c.hidden = t !== "all" && c.dataset.topic !== t; });
  });
});

// Contact form: prefill interest from ?interest=, submit without leaving the page.
const form = document.querySelector("[data-form]");
if (form) {
  const interest = new URLSearchParams(location.search).get("interest");
  if (interest && form.interest) form.interest.value = interest;
  const status = form.querySelector(".form__status");
  const show = (state, msg) => { status.hidden = false; status.dataset.state = state; status.textContent = msg; };

  // Validation. Each checker gets the trimmed value and returns an error message, or "" when the value is fine.
  // `noValidate` is set here, not in the markup, so the browser's own checks still work if JavaScript fails.
  form.noValidate = true;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const checkers = {
    name: (v) => (v.length < 2 ? "Please enter your full name." : ""),
    email: (v) => (!v ? "Please enter your work email." : !emailRe.test(v) ? "Please enter a valid email address." : ""),
    institution: (v) => (v.length < 2 ? "Please enter your institution or organisation." : ""),
    phone: (v) => {
      if (!v) return ""; // optional
      const digits = v.replace(/\D/g, "").length;
      return /^[+\d\s().-]+$/.test(v) && digits >= 7 && digits <= 15 ? "" : "Please enter a valid phone number.";
    },
    message: (v) => (!v ? "Please tell us how we can help." : v.length < 10 ? "Please enter at least 10 characters." : ""),
  };
  const fields = Object.keys(checkers).map((n) => form.elements[n]);
  const setError = (el, msg) => {
    let err = el.parentElement.querySelector(".field__error");
    if (!err) {
      err = document.createElement("p");
      err.className = "field__error";
      err.id = `${el.id}-error`;
      el.insertAdjacentElement("afterend", err);
    }
    err.textContent = msg;
    err.hidden = !msg;
    if (msg) { el.setAttribute("aria-invalid", "true"); el.setAttribute("aria-describedby", err.id); }
    else { el.removeAttribute("aria-invalid"); el.removeAttribute("aria-describedby"); }
  };
  const check = (el, trim) => {
    if (trim) el.value = el.value.trim();
    const msg = checkers[el.name](el.value.trim());
    setError(el, msg);
    return !msg;
  };
  fields.forEach((el) => {
    // Check when leaving a field that has been filled in or already flagged; re-check as the person fixes it.
    el.addEventListener("blur", () => { if (el.value.trim() || el.hasAttribute("aria-invalid")) check(el, true); });
    el.addEventListener("input", () => { if (el.hasAttribute("aria-invalid")) check(el, false); });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form._gotcha.value) return;
    const invalid = fields.filter((el) => !check(el, true));
    if (invalid.length) {
      show("error", "Please correct the highlighted fields and try again.");
      invalid[0].focus();
      return;
    }
    if (form.action.includes("YOUR_FORM_ID")) {
      show("error", "The form isn't connected yet. Please email us directly in the meantime.");
      return;
    }
    const btn = form.querySelector("[type=submit]");
    const label = btn.querySelector(".btn__label");
    const idleLabel = label.textContent;
    // Loading state: spinner, "Sending…" label and a disabled button until Formspree answers.
    status.hidden = true;
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.setAttribute("aria-busy", "true");
    label.textContent = "Sending…";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      form.reset();
      show("ok", "Thank you. Your message has been sent and our team will be in touch shortly.");
    } catch {
      show("error", "Sorry, something went wrong. Please try again or email us directly.");
    } finally {
      btn.disabled = false;
      btn.classList.remove("is-loading");
      btn.removeAttribute("aria-busy");
      label.textContent = idleLabel;
    }
  });
}
