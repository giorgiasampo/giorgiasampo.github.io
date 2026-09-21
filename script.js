/* ================================================================
   TWO OPTIONAL SETTINGS — edit these when your files are ready.

   1. Upload your portrait to assets/portrait.jpg, then use:
      portraitFile: "assets/portrait.jpg",

   2. Upload your public CV to assets/cv.pdf, then use:
      cvFile: "assets/cv.pdf",

   Leave the quotes empty until the corresponding file exists.
   Everything else (bio, papers, teaching, email) is in index.html.
   ================================================================ */
const SITE_SETTINGS = {
  portraitFile: "assets/portrait.jpg",
  portraitAlt: "Portrait of Giorgia Sampó",
  cvFile: "assets/cv.pdf"
};

(() => {
  "use strict";
  const documentRoot = document.documentElement;
  const navigation = document.querySelector("#main-navigation");
  const menuButton = document.querySelector(".menu-toggle");
  const header = document.querySelector(".site-header");

  // Progressive enhancement: navigation and every section remain readable
  // without JavaScript. Only hide the small-screen menu after setup succeeds.
  if (navigation && menuButton) {
    const menuLabel = menuButton.querySelector(".menu-label");
    const mobileQuery = window.matchMedia("(max-width: 850px)");
    const closeMenu = (returnFocus = false) => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      if (menuLabel) menuLabel.textContent = "Menu";
      if (returnFocus) menuButton.focus();
    };
    menuButton.hidden = false;
    menuButton.addEventListener("click", () => {
      const shouldOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(shouldOpen));
      navigation.classList.toggle("is-open", shouldOpen);
      if (menuLabel) menuLabel.textContent = shouldOpen ? "Close" : "Menu";
    });
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (!mobileQuery.matches) return;
        closeMenu();
        // Focus the destination rather than leaving focus inside a hidden menu.
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        }
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") closeMenu(true);
    });
    document.addEventListener("click", (event) => {
      if (header && !header.contains(event.target)) closeMenu();
    });
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", () => closeMenu());
    }
    documentRoot.classList.add("js-ready");
  }

  if (header) {
    const markScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", markScroll, { passive: true });
    markScroll();
  }

  // Filtering applies to the entries you add in index.html.
  const filterGroup = document.querySelector(".publication-filters");
  const publications = Array.from(document.querySelectorAll(".publication"));
  const filterStatus = document.querySelector("#filter-status");
  const noResults = document.querySelector(".no-results");
  if (filterGroup && publications.length) {
    const buttons = Array.from(filterGroup.querySelectorAll("button[data-filter]"));
    filterGroup.hidden = false;
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.filter;
        let visibleCount = 0;
        publications.forEach((publication) => {
          const visible = category === "all" || publication.dataset.category === category;
          publication.hidden = !visible;
          if (visible) visibleCount += 1;
        });
        buttons.forEach((otherButton) => otherButton.setAttribute("aria-pressed", String(otherButton === button)));
        if (filterStatus) filterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? "entry" : "entries"} shown.`;
        if (noResults) noResults.hidden = visibleCount !== 0;
      });
    });
  }

  // Only replace the placeholder after a real image has successfully loaded.
  // A typo in your file path leaves the attractive fallback in place.
  if (SITE_SETTINGS.portraitFile.trim()) {
    const portrait = document.querySelector("#portrait-image");
    const label = document.querySelector("#portrait-placeholder-label");
    const candidate = new Image();
    candidate.onload = () => {
      if (portrait) {
        portrait.src = SITE_SETTINGS.portraitFile;
        portrait.alt = SITE_SETTINGS.portraitAlt;
        if (label) label.hidden = true;
      }
    };
    candidate.onerror = () => console.warn("Portrait not found. Check portraitFile and the uploaded filename; keeping the botanical placeholder.");
    candidate.src = SITE_SETTINGS.portraitFile;
  }

  // No fake or broken PDF download in the starter: until you supply a CV,
  // the working button opens an email request instead.
  if (SITE_SETTINGS.cvFile.trim()) {
    const link = document.querySelector("#cv-link");
    const label = document.querySelector("#cv-label");
    const arrow = document.querySelector("#cv-arrow");
    const description = document.querySelector("#cv-description");
    if (link) {
      link.href = SITE_SETTINGS.cvFile;
      link.setAttribute("download", "Giorgia-Sampo-CV.pdf");
    }
    if (label) label.textContent = "Download my CV";
    if (arrow) arrow.textContent = "↓";
    if (description) description.textContent = "Download my curriculum vitae for my academic background and experience.";
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
