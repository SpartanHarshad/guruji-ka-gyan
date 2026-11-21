/* Sukhalaya interactions — no framework required. */
document.addEventListener("DOMContentLoaded", () => {
  // Activate Lucide icons when the library is available.
  if (window.lucide) window.lucide.createIcons();

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.querySelector("#back-to-top");

  // Sticky header and back-to-top visibility.
  const updateScrollUI = () => {
    const scrolled = window.scrollY > 30;
    header?.classList.toggle("scrolled", scrolled);
    backToTop?.classList.toggle("visible", window.scrollY > 550);
  };
  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  // Accessible mobile navigation.
  const closeMenu = () => {
    nav?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    if (menuToggle && window.lucide) {
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      window.lucide.createIcons();
    }
  };
  menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });
  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  // Back-to-top action.
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("in-view"));
  }

  // Filter program cards by category.
  const filterButtons = document.querySelectorAll(".tab-button");
  const journeyCards = document.querySelectorAll(".journey-card");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      journeyCards.forEach(card => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  // Frontend-only contact form validation.
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const fields = {
    name: document.querySelector("#name"),
    email: document.querySelector("#email"),
    message: document.querySelector("#message")
  };
  const errors = {
    name: document.querySelector("#name-error"),
    email: document.querySelector("#email-error"),
    message: document.querySelector("#message-error")
  };

  const setError = (key, message) => {
    errors[key].textContent = message;
    fields[key].classList.toggle("invalid", Boolean(message));
    fields[key].setAttribute("aria-invalid", String(Boolean(message)));
  };
  const validate = () => {
    let valid = true;
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    setError("name", name.length < 2 ? "Please enter at least 2 characters." : "");
    setError("email", !emailPattern.test(email) ? "Please enter a valid email address." : "");
    setError("message", message.length < 10 ? "Please enter at least 10 characters." : "");
    valid = Object.values(errors).every(error => !error.textContent);
    return valid;
  };

  Object.entries(fields).forEach(([key, field]) => {
    field.addEventListener("input", () => {
      // Clear a field's error as the user corrects it.
      if (field.classList.contains("invalid")) {
        const value = field.value.trim();
        if (key === "name" && value.length >= 2) setError(key, "");
        if (key === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) setError(key, "");
        if (key === "message" && value.length >= 10) setError(key, "");
      }
    });
  });

  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!validate()) {
      status.textContent = "Please review the highlighted fields and try again.";
      status.classList.add("error");
      const firstInvalid = form.querySelector(".invalid");
      firstInvalid?.focus();
      return;
    }
    status.textContent = "Thank you! Your details passed validation. This demo form is not connected to an email service yet, so no message has been sent.";
    status.classList.remove("error");
    status.classList.add("success");
    form.reset();
  });


  // English / Hindi language switcher. Add data-i18n keys in HTML as content grows.
  const translations = {
    en: {
      navHome: "Home", navStory: "Our Story", navOfferings: "Offerings", navJourneys: "Journeys",
      navContact: "Contact", navCta: "Explore programs",
      heroEyebrow: "WISDOM · DEVOTION · INNER GROWTH",
      heroTitle: "Awaken the wisdom<br>within <em>you.</em>",
      heroCopy: "Explore timeless spiritual wisdom, meditation and Sadhana — one insight, one practice, one step at a time.",
      heroCta: "Explore the wisdom", heroSecondary: "Get to know us",
      aboutTitle: "Wisdom is more than knowledge.<br><em>It is a way of living.</em>",
      aboutLead: "In a world full of noise, return to timeless teachings that inspire clarity, devotion and a more conscious way of living.",
      aboutBody: "Through spiritual reflections, guided practices and learning experiences, we hope to make ancient wisdom meaningful and approachable in everyday life.",
      templeImageLabel: "KASHI · VARANASI", templeEyebrow: "A SACRED PLACE OF DEVOTION",
      templeTitle: "The eternal spirit of <em>Kashi.</em>",
      templeLead: "Discover the spiritual heritage of Shri Kashi Vishwanath Temple, one of the most revered shrines dedicated to Lord Shiva.",
      templeBody: "Let the timeless atmosphere of Kashi inspire reflection, devotion and a deeper connection with India's spiritual traditions.",
      templeLink: "Explore the temple",
      offerTitle: "Discover your <em>inner path.</em>",
      journeyTitle: "Wisdom for your <em>journey.</em>",
      philosophyTitle: "Rooted in simplicity.<br><em>Open to possibility.</em>",
      closingTitle: "Take a breath.<br><em>Take the first step.</em>",
      closingCta: "Connect with Guruji Ka Gyan",
      contactTitle: "Start with a <em>hello.</em>",
      contactLead: "Have a question about a practice or program? Send us a note and we'll be happy to connect.",
      aboutKicker: "A little more presence. A little more you.", aboutLink: "Begin a conversation",
      offerDesc: "Explore different ways to deepen understanding, strengthen your practice and bring timeless wisdom into daily life.",
      offerLabel1: "MOVE WITH AWARENESS", offerCard1Title: "Yoga & mindful living",
      offerCard1Body: "Discover the foundations of mindful living through movement, breath and awareness.",
      offerLabel2: "CULTIVATE INNER QUIET", offerCard2Title: "Meditation & Sadhana",
      offerCard2Body: "Explore guided practices that support inner stillness, focus and a consistent spiritual routine.",
      offerLabel3: "LEARN AT YOUR PACE", offerCard3Title: "Spiritual wisdom",
      offerCard3Body: "Reflect on timeless teachings and practical insights for your personal journey.",
      quoteText: "The quieter you become,<br>the more you can <em>hear.</em>", quoteLabel: "A MOMENT TO TURN INWARD",
      journeyDesc: "Explore live gatherings and self-paced learning. Replace these sample cards with your actual sessions and courses.",
      tabAll: "All experiences", tabLive: "Live workshops", tabSelf: "Self-paced",
      journeyCard1Title: "Guided Satsang", journeyCard1Body: "A shared space to reflect on spiritual ideas, ask questions and learn together.",
      journeyCard2Title: "Foundations of Sadhana", journeyCard2Body: "Explore foundational practices and reflections at a pace that feels right for you.",
      journeyCard3Title: "Wisdom in daily life", journeyCard3Body: "Discover ways to bring spiritual principles into everyday choices and relationships.",
      contentNote: "Program names and descriptions are sample content. Update them with your actual sessions and courses.",
      closingEyebrow: "YOUR JOURNEY CAN BEGIN HERE", closingBody: "Explore a practice, ask a question or simply say hello. We'd love to hear from you.",
      contactEyebrow: "LET'S CONNECT", formName: "Your name", formEmail: "Email address",
      formInterest: "I'm interested in", formMessage: "Your message", formSubmit: "Send your message",
      namePlaceholder: "Enter your name", emailPlaceholder: "you@example.com",
      messagePlaceholder: "Tell us a little about what you're looking for..."
    },
    hi: {
      navHome: "मुखपृष्ठ", navStory: "हमारी कहानी", navOfferings: "हमारी सेवाएँ", navJourneys: "आध्यात्मिक यात्राएँ",
      navContact: "संपर्क", navCta: "कार्यक्रम देखें",
      heroEyebrow: "ज्ञान · भक्ति · आत्म-विकास",
      heroTitle: "अपने भीतर के<br><em>ज्ञान को जगाएँ।</em>",
      heroCopy: "सनातन आध्यात्मिक ज्ञान, ध्यान और साधना को जानें — एक विचार, एक अभ्यास और एक कदम के साथ।",
      heroCta: "ज्ञान की यात्रा शुरू करें", heroSecondary: "हमारे बारे में जानें",
      aboutTitle: "ज्ञान केवल जानकारी नहीं है।<br><em>यह जीवन जीने की कला है।</em>",
      aboutLead: "शोर से भरी इस दुनिया में उन शाश्वत शिक्षाओं की ओर लौटें, जो जीवन में स्पष्टता, भक्ति और जागरूकता लाती हैं।",
      aboutBody: "आध्यात्मिक चिंतन, मार्गदर्शित अभ्यास और सीखने के अनुभवों के माध्यम से हमारा उद्देश्य प्राचीन ज्ञान को दैनिक जीवन से जोड़ना है।",
      templeImageLabel: "काशी · वाराणसी", templeEyebrow: "आस्था और भक्ति का पावन धाम",
      templeTitle: "<em>काशी</em> की शाश्वत आध्यात्मिक चेतना।",
      templeLead: "भगवान शिव को समर्पित अत्यंत पूजनीय श्री काशी विश्वनाथ मंदिर की आध्यात्मिक विरासत को जानें।",
      templeBody: "काशी की शाश्वत आध्यात्मिक ऊर्जा आपको चिंतन, भक्ति और भारत की सनातन परंपराओं से गहरा जुड़ाव प्रदान करे।",
      templeLink: "मंदिर के बारे में जानें",
      offerTitle: "अपनी <em>आंतरिक यात्रा</em> खोजें।",
      journeyTitle: "आपकी <em>आध्यात्मिक यात्रा</em> के लिए ज्ञान।",
      philosophyTitle: "सरलता में निहित।<br><em>नई संभावनाओं के लिए खुला।</em>",
      closingTitle: "एक गहरी साँस लें।<br><em>पहला कदम बढ़ाएँ।</em>",
      closingCta: "गुरुजी का ज्ञान से जुड़ें",
      contactTitle: "आइए, <em>बात शुरू करें।</em>",
      contactLead: "किसी साधना या कार्यक्रम के बारे में प्रश्न है? हमें संदेश भेजें, हमें आपसे जुड़कर खुशी होगी।",
      aboutKicker: "थोड़ी अधिक सजगता। थोड़ा अधिक आत्म-संबंध।", aboutLink: "बातचीत शुरू करें",
      offerDesc: "अपनी समझ को गहरा करने, साधना को मजबूत बनाने और शाश्वत ज्ञान को दैनिक जीवन में अपनाने के विभिन्न मार्ग खोजें।",
      offerLabel1: "सजगता के साथ अभ्यास", offerCard1Title: "योग और सजग जीवन",
      offerCard1Body: "शरीर की गति, श्वास और जागरूकता के माध्यम से सजग जीवन की नींव को समझें।",
      offerLabel2: "आंतरिक शांति विकसित करें", offerCard2Title: "ध्यान और साधना",
      offerCard2Body: "मन की स्थिरता, एकाग्रता और नियमित आध्यात्मिक अभ्यास में सहायक मार्गदर्शित साधनाएँ जानें।",
      offerLabel3: "अपनी गति से सीखें", offerCard3Title: "आध्यात्मिक ज्ञान",
      offerCard3Body: "अपनी व्यक्तिगत आध्यात्मिक यात्रा के लिए शाश्वत शिक्षाओं और उपयोगी विचारों पर चिंतन करें।",
      quoteText: "जब आप शांत होते जाते हैं,<br>तब आप अधिक <em>सुन पाते हैं।</em>", quoteLabel: "अंतर्मन की ओर लौटने का एक क्षण",
      journeyDesc: "लाइव सत्संग और अपनी गति से सीखने के अनुभवों से जुड़ें। यहाँ अपने वास्तविक कार्यक्रम और पाठ्यक्रम जोड़ें।",
      tabAll: "सभी अनुभव", tabLive: "लाइव कार्यशालाएँ", tabSelf: "स्वयं सीखें",
      journeyCard1Title: "मार्गदर्शित सत्संग", journeyCard1Body: "आध्यात्मिक विचारों पर चिंतन, प्रश्न पूछने और साथ मिलकर सीखने का साझा अवसर।",
      journeyCard2Title: "साधना की शुरुआत", journeyCard2Body: "अपनी सुविधा और गति के अनुसार मूलभूत साधनाओं और चिंतन का अभ्यास करें।",
      journeyCard3Title: "दैनिक जीवन में ज्ञान", journeyCard3Body: "आध्यात्मिक सिद्धांतों को दैनिक निर्णयों और संबंधों में अपनाने के तरीके जानें।",
      contentNote: "कार्यक्रमों के नाम और विवरण उदाहरण के लिए हैं। इन्हें अपने वास्तविक सत्रों और पाठ्यक्रमों से बदलें।",
      closingEyebrow: "आपकी यात्रा यहीं से शुरू हो सकती है", closingBody: "किसी साधना को जानें, प्रश्न पूछें या बस नमस्कार कहें। हमें आपसे जुड़कर खुशी होगी।",
      contactEyebrow: "आइए, जुड़ें", formName: "आपका नाम", formEmail: "ईमेल पता",
      formInterest: "आपकी रुचि किसमें है", formMessage: "आपका संदेश", formSubmit: "संदेश भेजें",
      namePlaceholder: "अपना नाम लिखें", emailPlaceholder: "you@example.com",
      messagePlaceholder: "बताएँ कि आप क्या जानना चाहते हैं..."
    }
  };

  const languageButtons = document.querySelectorAll(".language-button");
  const applyLanguage = (language) => {
    const selected = translations[language] ? language : "en";
    document.documentElement.lang = selected === "hi" ? "hi" : "en";
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const value = translations[selected][element.dataset.i18n];
      if (value) element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(element => {
      const value = translations[selected][element.dataset.i18nHtml];
      if (value) element.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const value = translations[selected][element.dataset.i18nPlaceholder];
      if (value) element.setAttribute("placeholder", value);
    });

    languageButtons.forEach(button => {
      const active = button.dataset.lang === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    try { localStorage.setItem("gkg-language", selected); } catch (_) {}
  };
  languageButtons.forEach(button => button.addEventListener("click", () => applyLanguage(button.dataset.lang)));
  let savedLanguage = "en";
  try { savedLanguage = localStorage.getItem("gkg-language") || "en"; } catch (_) {}
  applyLanguage(savedLanguage);


  // Current year in footer.
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
