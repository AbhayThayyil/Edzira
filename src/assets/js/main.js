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
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.body.classList.remove("nav-open");
  toggle?.setAttribute("aria-expanded", "false");
  closeMenus();
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

// Count-up for stats when they scroll into view.
const counters = document.querySelectorAll("[data-count]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
  const co = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    co.unobserve(entry.target);
    const el = entry.target, end = Number(el.dataset.count), start = performance.now(), dur = 1400;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  counters.forEach((el) => co.observe(el));
}

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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form._gotcha.value) return;
    if (form.action.includes("YOUR_FORM_ID")) {
      show("error", "The form isn't connected yet. Please email us directly in the meantime.");
      return;
    }
    const btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      form.reset();
      show("ok", "Thank you. Your message has been sent and our team will be in touch shortly.");
    } catch {
      show("error", "Sorry, something went wrong. Please try again or email us directly.");
    } finally {
      btn.disabled = false;
    }
  });
}
