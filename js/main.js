/* Sukhalaya interactions — no framework required. */
document.addEventListener("DOMContentLoaded", () => {
  // Activate Lucide icons when the library is available.
  if (window.lucide) window.lucide.createIcons();

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.querySelector("#back-to-top");

  // Back-to-top visibility only. The Sukhalaya-style header scrolls away
  // naturally with the document and does not become sticky on scroll.
  const updateScrollUI = () => {
    header?.classList.remove("scrolled");
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
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) closeMenu();
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

    const messages = translations[currentLanguage] || translations.en;
    setError("name", name.length < 2 ? messages.errorName : "");
    setError("email", !emailPattern.test(email) ? messages.errorEmail : "");
    setError("message", message.length < 10 ? messages.errorMessage : "");
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
      status.textContent = (translations[currentLanguage] || translations.en).formError;
      status.classList.add("error");
      const firstInvalid = form.querySelector(".invalid");
      firstInvalid?.focus();
      return;
    }
    status.textContent = (translations[currentLanguage] || translations.en).formSuccess;
    status.classList.remove("error");
    status.classList.add("success");
    form.reset();
  });


  // Trilingual content: English (en), Hindi (hi), Telugu (te).
  const translations = {"en":{"navStory":"Our Story","navOfferings":"Offerings","navJourneys":"Journeys","navContact":"Contact","navCta":"Explore programs","heroEyebrow":"WISDOM · DEVOTION · INNER GROWTH","heroTitle":"Guruji Ka Gyan","heroSubtitle":"Wisdom for a meaningful life","heroCopy":"Ancient wisdom, spiritual practices and timeless teachings — made meaningful for everyday life.","heroCta":"Explore the wisdom","heroSecondary":"Discover our purpose","aboutKicker":"A little more presence. A little more you.","aboutTitle":"Wisdom is more than knowledge.<br><em>It is a way of living.</em>","aboutBody":"Through spiritual reflections, guided practices and learning experiences, we hope to make ancient wisdom meaningful and approachable in everyday life.","aboutLink":"Begin a conversation","templeImageLabel":"KASHI · VARANASI","templeEyebrow":"A SACRED PLACE OF DEVOTION","templeTitle":"The eternal spirit of <em>Kashi.</em>","templeLead":"Discover the spiritual heritage of Shri Kashi Vishwanath Temple, one of the most revered shrines dedicated to Lord Shiva.","templeBody":"Let the timeless atmosphere of Kashi inspire reflection, devotion and a deeper connection with India's spiritual traditions.","templeLink":"Explore the temple","offerTitle":"Discover your <em>inner path.</em>","offerDesc":"Explore different ways to deepen understanding, strengthen your practice and bring timeless wisdom into daily life.","offerLabel1":"MOVE WITH AWARENESS","offerCard1Title":"Yoga & mindful living","offerCard1Body":"Discover the foundations of mindful living through movement, breath and awareness.","offerLabel2":"CULTIVATE INNER QUIET","offerCard2Title":"Meditation & Sadhana","offerCard2Body":"Explore guided practices that support inner stillness, focus and a consistent spiritual routine.","offerLabel3":"LEARN AT YOUR PACE","offerCard3Title":"Spiritual wisdom","offerCard3Body":"Reflect on timeless teachings and practical insights for your personal journey.","quoteText":"The quieter you become,<br>the more you can <em>hear.</em>","quoteLabel":"A MOMENT TO TURN INWARD","journeyTitle":"Wisdom for your <em>journey.</em>","journeyDesc":"Explore live gatherings and self-paced learning. Replace these sample cards with your actual sessions and courses.","tabAll":"All experiences","tabLive":"Live workshops","tabSelf":"Self-paced","journeyCard1Title":"Guided Satsang","journeyCard1Body":"A shared space to reflect on spiritual ideas, ask questions and learn together.","journeyCard2Title":"Foundations of Sadhana","journeyCard2Body":"Explore foundational practices and reflections at a pace that feels right for you.","journeyCard3Title":"Wisdom in daily life","journeyCard3Body":"Discover ways to bring spiritual principles into everyday choices and relationships.","contentNote":"Program names and descriptions above are starter examples. Update them with your actual offerings before publishing.","philosophyTitle":"Rooted in simplicity.<br><em>Open to possibility.</em>","closingEyebrow":"YOUR JOURNEY CAN BEGIN HERE","closingTitle":"Take a breath.<br><em>Take the first step.</em>","closingBody":"Explore a practice, ask a question or simply say hello. We'd love to hear from you.","closingCta":"Connect with Guruji Ka Gyan","contactEyebrow":"LET'S CONNECT","contactTitle":"Start with a <em>hello.</em>","contactLead":"Have a question about a practice or program? Send us a note and we'll be happy to connect.","formName":"Your name *","namePlaceholder":"Enter your name","formEmail":"Email address *","emailPlaceholder":"you@example.com","formInterest":"I'm interested in","formMessage":"Your message *","messagePlaceholder":"Tell us a little about what you're looking for...","formSubmit":"Send your message"},"hi":{"navStory":"हमारी कहानी","navOfferings":"हमारी सेवाएँ","navJourneys":"आध्यात्मिक यात्राएँ","navContact":"संपर्क करें","navCta":"कार्यक्रम देखें","heroEyebrow":"ज्ञान · भक्ति · आत्म-विकास","heroTitle":"गुरुजी का ज्ञान","heroSubtitle":"अर्थपूर्ण जीवन के लिए ज्ञान","heroCopy":"प्राचीन ज्ञान, आध्यात्मिक अभ्यास और शाश्वत शिक्षाएँ — जिन्हें हम दैनिक जीवन में सार्थक बनाते हैं।","heroCta":"ज्ञान की यात्रा शुरू करें","heroSecondary":"हमारा उद्देश्य जानें","aboutKicker":"थोड़ी और सजगता। थोड़ा और स्वयं से जुड़ाव।","aboutTitle":"ज्ञान केवल जानकारी नहीं है।<br><em>यह जीवन जीने की एक कला है।</em>","aboutBody":"आध्यात्मिक चिंतन, मार्गदर्शित अभ्यास और सीखने के अनुभवों के माध्यम से हमारा प्रयास है कि प्राचीन ज्ञान को दैनिक जीवन में सरल और उपयोगी बनाया जाए।","aboutLink":"बातचीत शुरू करें","templeImageLabel":"काशी · वाराणसी","templeEyebrow":"भक्ति का पवित्र धाम","templeTitle":"<em>काशी</em> की शाश्वत आध्यात्मिक चेतना।","templeLead":"भगवान शिव को समर्पित अत्यंत पूजनीय श्री काशी विश्वनाथ मंदिर की आध्यात्मिक विरासत को जानें।","templeBody":"काशी का शाश्वत वातावरण आपको चिंतन, भक्ति और भारत की आध्यात्मिक परंपराओं से गहरा जुड़ाव महसूस करने की प्रेरणा दे।","templeLink":"मंदिर के बारे में जानें","offerTitle":"अपनी <em>आंतरिक यात्रा</em> खोजें।","offerDesc":"समझ को गहरा करने, अपने अभ्यास को मजबूत बनाने और शाश्वत ज्ञान को दैनिक जीवन में अपनाने के विभिन्न मार्ग जानें।","offerLabel1":"सजगता के साथ आगे बढ़ें","offerCard1Title":"योग और सजग जीवन","offerCard1Body":"शरीर की गति, श्वास और जागरूकता के माध्यम से सजग जीवन की बुनियाद समझें।","offerLabel2":"मन की शांति विकसित करें","offerCard2Title":"ध्यान और साधना","offerCard2Body":"आंतरिक शांति, एकाग्रता और नियमित आध्यात्मिक दिनचर्या को सहारा देने वाले मार्गदर्शित अभ्यास अपनाएँ।","offerLabel3":"अपनी गति से सीखें","offerCard3Title":"आध्यात्मिक ज्ञान","offerCard3Body":"अपनी व्यक्तिगत यात्रा के लिए शाश्वत शिक्षाओं और व्यावहारिक विचारों पर मनन करें।","quoteText":"जब आप शांत होते जाते हैं,<br>तो आप और अधिक <em>सुन पाते हैं।</em>","quoteLabel":"अंतर्मन की ओर लौटने का एक क्षण","journeyTitle":"आपकी <em>आध्यात्मिक यात्रा</em> के लिए ज्ञान।","journeyDesc":"लाइव सत्संग और अपनी गति से सीखने के अवसरों से जुड़ें। प्रकाशित करने से पहले इन उदाहरणों को अपने वास्तविक कार्यक्रमों से बदलें।","tabAll":"सभी अनुभव","tabLive":"लाइव कार्यशालाएँ","tabSelf":"अपनी गति से सीखें","journeyCard1Title":"मार्गदर्शित सत्संग","journeyCard1Body":"आध्यात्मिक विचारों पर चिंतन करने, प्रश्न पूछने और साथ मिलकर सीखने का साझा अवसर।","journeyCard2Title":"साधना की शुरुआत","journeyCard2Body":"अपनी सुविधा के अनुसार साधना के मूल अभ्यासों और चिंतन को जानें।","journeyCard3Title":"दैनिक जीवन में ज्ञान","journeyCard3Body":"दैनिक निर्णयों और संबंधों में आध्यात्मिक सिद्धांतों को अपनाने के तरीके जानें।","contentNote":"ऊपर दिए गए कार्यक्रमों के नाम और विवरण उदाहरण हैं। प्रकाशित करने से पहले इन्हें अपनी वास्तविक सेवाओं से बदलें।","philosophyTitle":"सरलता में निहित।<br><em>नई संभावनाओं के लिए खुला।</em>","closingEyebrow":"आपकी यात्रा यहीं से शुरू हो सकती है","closingTitle":"एक गहरी साँस लें।<br><em>पहला कदम बढ़ाएँ।</em>","closingBody":"किसी अभ्यास को जानें, प्रश्न पूछें या बस नमस्कार कहें। हम आपसे जुड़कर प्रसन्न होंगे।","closingCta":"गुरुजी का ज्ञान से जुड़ें","contactEyebrow":"आइए, जुड़ें","contactTitle":"एक <em>नमस्कार</em> से शुरुआत करें।","contactLead":"किसी अभ्यास या कार्यक्रम के बारे में प्रश्न है? हमें संदेश भेजें, हमें आपसे जुड़कर खुशी होगी।","formName":"आपका नाम *","namePlaceholder":"अपना नाम लिखें","formEmail":"ईमेल पता *","emailPlaceholder":"you@example.com","formInterest":"आपकी रुचि किसमें है?","formMessage":"आपका संदेश *","messagePlaceholder":"आप क्या जानना चाहते हैं, संक्षेप में लिखें...","formSubmit":"संदेश भेजें"},"te":{"navStory":"మా కథ","navOfferings":"మా కార్యక్రమాలు","navJourneys":"ఆధ్యాత్మిక ప్రయాణాలు","navContact":"సంప్రదించండి","navCta":"కార్యక్రమాలను చూడండి","heroEyebrow":"జ్ఞానం · భక్తి · అంతర్గత వికాసం","heroTitle":"గురూజీ కా జ్ఞాన్","heroSubtitle":"అర్థవంతమైన జీవితం కోసం జ్ఞానం","heroCopy":"ప్రాచీన జ్ఞానం, ఆధ్యాత్మిక సాధనలు, శాశ్వత బోధనలు — నిత్య జీవితానికి అర్థవంతంగా.","heroCta":"జ్ఞానాన్ని అన్వేషించండి","heroSecondary":"మా లక్ష్యాన్ని తెలుసుకోండి","aboutKicker":"మరింత అవగాహన. మీ అంతరంగంతో మరింత అనుబంధం.","aboutTitle":"జ్ఞానం అనేది కేవలం సమాచారం కాదు.<br><em>అది జీవించే ఒక విధానం.</em>","aboutBody":"ఆధ్యాత్మిక ఆలోచనలు, మార్గదర్శక సాధనలు, అభ్యాస అనుభవాల ద్వారా ప్రాచీన జ్ఞానాన్ని రోజువారీ జీవితానికి సులభంగా, అర్థవంతంగా చేరవేయాలని మా ఆశయం.","aboutLink":"సంభాషణను ప్రారంభించండి","templeImageLabel":"కాశీ · వారణాసి","templeEyebrow":"భక్తికి పవిత్ర క్షేత్రం","templeTitle":"<em>కాశీ</em> యొక్క శాశ్వత ఆధ్యాత్మిక స్ఫూర్తి.","templeLead":"శివునికి అంకితమైన అత్యంత పవిత్ర క్షేత్రాలలో ఒకటైన శ్రీ కాశీ విశ్వనాథ ఆలయ ఆధ్యాత్మిక వారసత్వాన్ని తెలుసుకోండి.","templeBody":"కాశీ యొక్క శాశ్వత ఆధ్యాత్మిక వాతావరణం మీలో ఆత్మపరిశీలన, భక్తి, భారతీయ ఆధ్యాత్మిక సంప్రదాయాలతో మరింత అనుబంధాన్ని ప్రేరేపించాలి.","templeLink":"ఆలయాన్ని తెలుసుకోండి","offerTitle":"మీ <em>అంతరంగ మార్గాన్ని</em> కనుగొనండి.","offerDesc":"అవగాహనను పెంపొందించుకోవడానికి, సాధనను బలోపేతం చేసుకోవడానికి, శాశ్వత జ్ఞానాన్ని రోజువారీ జీవితంలో ఆచరించడానికి మార్గాలను అన్వేషించండి.","offerLabel1":"అవగాహనతో కదలండి","offerCard1Title":"యోగం & అవగాహనతో జీవనం","offerCard1Body":"కదలిక, శ్వాస, చైతన్యం ద్వారా అవగాహనతో జీవించే పునాదులను తెలుసుకోండి.","offerLabel2":"అంతరంగ ప్రశాంతతను పెంపొందించండి","offerCard2Title":"ధ్యానం & సాధన","offerCard2Body":"అంతరంగ నిశ్శబ్దం, ఏకాగ్రత, క్రమమైన ఆధ్యాత్మిక దినచర్యకు తోడ్పడే మార్గదర్శక సాధనలను అనుభవించండి.","offerLabel3":"మీ వేగంతో నేర్చుకోండి","offerCard3Title":"ఆధ్యాత్మిక జ్ఞానం","offerCard3Body":"మీ వ్యక్తిగత ప్రయాణానికి ఉపయోగపడే శాశ్వత బోధనలు, ఆచరణాత్మక ఆలోచనలపై మననం చేయండి.","quoteText":"మీరు ఎంత నిశ్శబ్దంగా మారితే,<br>అంత ఎక్కువగా <em>వినగలుగుతారు.</em>","quoteLabel":"అంతరంగం వైపు మళ్లే ఒక క్షణం","journeyTitle":"మీ <em>ప్రయాణానికి</em> జ్ఞానం.","journeyDesc":"ప్రత్యక్ష సమావేశాలు, మీ స్వంత వేగంతో నేర్చుకునే అవకాశాలను అన్వేషించండి. ప్రచురించే ముందు ఈ నమూనా వివరాలను మీ నిజమైన కార్యక్రమాలతో మార్చండి.","tabAll":"అన్ని అనుభవాలు","tabLive":"ప్రత్యక్ష వర్క్‌షాప్‌లు","tabSelf":"మీ స్వంత వేగంతో","journeyCard1Title":"మార్గదర్శక సత్సంగం","journeyCard1Body":"ఆధ్యాత్మిక విషయాలపై ఆలోచించడానికి, ప్రశ్నలు అడగడానికి, కలిసి నేర్చుకోవడానికి ఒక వేదిక.","journeyCard2Title":"సాధనకు పునాదులు","journeyCard2Body":"మీకు అనుకూలమైన వేగంతో ప్రాథమిక సాధనలు, ఆత్మపరిశీలనలను తెలుసుకోండి.","journeyCard3Title":"రోజువారీ జీవితంలో జ్ఞానం","journeyCard3Body":"రోజువారీ నిర్ణయాలు, సంబంధాలలో ఆధ్యాత్మిక సూత్రాలను ఆచరించే మార్గాలను తెలుసుకోండి.","contentNote":"పైన ఉన్న కార్యక్రమాల పేర్లు, వివరణలు నమూనా మాత్రమే. ప్రచురించే ముందు మీ నిజమైన కార్యక్రమాలతో మార్చండి.","philosophyTitle":"సరళతలో పాతుకుపోయి.<br><em>కొత్త అవకాశాలకు తెరిచి.</em>","closingEyebrow":"మీ ప్రయాణం ఇక్కడ ప్రారంభం కావచ్చు","closingTitle":"ఒక లోతైన శ్వాస తీసుకోండి.<br><em>మొదటి అడుగు వేయండి.</em>","closingBody":"ఒక సాధన గురించి తెలుసుకోండి, ప్రశ్న అడగండి లేదా పలకరించండి. మీతో అనుసంధానం కావడం మాకు ఆనందం.","closingCta":"గురూజీ కా జ్ఞాన్‌తో అనుసంధానం అవ్వండి","contactEyebrow":"మనము కలుద్దాం","contactTitle":"ఒక <em>నమస్కారం</em>తో ప్రారంభించండి.","contactLead":"ఏదైనా సాధన లేదా కార్యక్రమం గురించి ప్రశ్న ఉందా? మాకు సందేశం పంపండి. మీతో మాట్లాడటం మాకు సంతోషం.","formName":"మీ పేరు *","namePlaceholder":"మీ పేరును నమోదు చేయండి","formEmail":"ఇమెయిల్ చిరునామా *","emailPlaceholder":"you@example.com","formInterest":"మీ ఆసక్తి ఏ అంశంలో ఉంది?","formMessage":"మీ సందేశం *","messagePlaceholder":"మీరు తెలుసుకోవాలనుకుంటున్నది కొద్దిగా వివరించండి...","formSubmit":"సందేశం పంపండి"}};

  Object.keys(translations).forEach(language => Object.assign(translations[language], {"en":{"skipContent":"Skip to content","introEyebrow":"THE GURUJI KA GYAN WAY","introVertical":"MINDFULNESS · BALANCE · WELLBEING","introLead":"Life moves quickly. Guruji Ka Gyan invites you to slow down, listen inward and make room for a more conscious, balanced life.","artCaption":"RETURN TO STILLNESS","offeringEyebrow":"EXPLORE WHAT RESONATES","pillLive":"LIVE WORKSHOP","pillSelf":"SELF-PACED","metaLive":"LIVE EXPERIENCE","metaRecorded":"RECORDED COURSE","metaGuided":"GUIDED PRACTICE","journeyLink1":"Enquire about this","journeyLink2":"Register your interest","journeyLink3":"Know more","aboutEyebrow":"A SPACE WITH INTENTION","aboutLeadStatic":"Guruji Ka Gyan is built around a simple thought: wellbeing can begin with small, meaningful moments.","aboutBodyStatic":"We believe that every person's journey is different. Our intention is to create welcoming experiences that encourage curiosity, consistency and a deeper connection with yourself.","valuePresence":"Presence","valuePresenceDesc":"Make room for the moment you're in.","valueBalance":"Balance","valueBalanceDesc":"Find a rhythm that feels sustainable.","valueConnection":"Connection","valueConnectionDesc":"Learn, share and grow together.","emailLabel":"EMAIL","locationLabel":"LOCATION","locationPlaceholder":"Add your city or studio address","contactNote":"Remember to replace the sample email and location with your business details.","optionPrompt":"Choose an area (optional)","optionYoga":"Yoga","optionMeditation":"Meditation","optionLive":"Live workshops","optionRecorded":"Recorded courses","optionOther":"Something else","formDemoStatus":"Demo form: messages are validated in your browser and are not sent yet.","footerDesc":"Timeless spiritual wisdom for a more conscious and meaningful life.","footerExplore":"EXPLORE","footerStory":"Our story","footerOfferings":"Offerings","footerPrograms":"Programs","footerConnect":"CONNECT","footerContact":"Contact us","footerAsk":"Ask a question","footerBack":"Back to top ↑","footerFollow":"FOLLOW THE JOURNEY","footerSocialNote":"Add your social media links before publishing.","footerMade":"Made with intention","errorName":"Please enter at least 2 characters.","errorEmail":"Please enter a valid email address.","errorMessage":"Please enter at least 10 characters.","formError":"Please review the highlighted fields and try again.","formSuccess":"Thank you! Your details passed validation. This demo form is not connected to an email service yet, so no message has been sent."},"hi":{"skipContent":"मुख्य सामग्री पर जाएँ","introEyebrow":"गुरुजी का ज्ञान — जीवन की राह","introVertical":"सजगता · संतुलन · कल्याण","introLead":"जीवन तेज़ी से आगे बढ़ता है। गुरुजी का ज्ञान आपको ठहरने, अपने भीतर सुनने और अधिक सजग तथा संतुलित जीवन के लिए स्थान बनाने का निमंत्रण देता है।","artCaption":"आंतरिक शांति की ओर लौटें","offeringEyebrow":"अपनी रुचि का मार्ग चुनें","pillLive":"लाइव कार्यशाला","pillSelf":"स्वयं सीखें","metaLive":"लाइव अनुभव","metaRecorded":"रिकॉर्डेड कोर्स","metaGuided":"मार्गदर्शित अभ्यास","journeyLink1":"इसके बारे में पूछें","journeyLink2":"अपनी रुचि दर्ज करें","journeyLink3":"और जानें","aboutEyebrow":"एक उद्देश्यपूर्ण स्थान","aboutLeadStatic":"गुरुजी का ज्ञान एक सरल विचार पर आधारित है: छोटे और अर्थपूर्ण क्षणों से भी जीवन में कल्याण की शुरुआत हो सकती है।","aboutBodyStatic":"हम मानते हैं कि हर व्यक्ति की यात्रा अलग होती है। हमारा उद्देश्य ऐसे आत्मीय अनुभव बनाना है जो जिज्ञासा, निरंतरता और स्वयं से गहरे जुड़ाव को प्रोत्साहित करें।","valuePresence":"सजगता","valuePresenceDesc":"वर्तमान क्षण के लिए स्थान बनाएँ।","valueBalance":"संतुलन","valueBalanceDesc":"ऐसी लय खोजें जिसे आप निरंतर अपना सकें।","valueConnection":"जुड़ाव","valueConnectionDesc":"साथ सीखें, साझा करें और आगे बढ़ें।","emailLabel":"ईमेल","locationLabel":"स्थान","locationPlaceholder":"अपना शहर या केंद्र का पता जोड़ें","contactNote":"प्रकाशित करने से पहले नमूना ईमेल और स्थान की जगह अपने व्यवसाय का विवरण दें।","optionPrompt":"एक विषय चुनें (वैकल्पिक)","optionYoga":"योग","optionMeditation":"ध्यान","optionLive":"लाइव कार्यशालाएँ","optionRecorded":"रिकॉर्डेड कोर्स","optionOther":"कुछ और","formDemoStatus":"यह डेमो फ़ॉर्म है: संदेश आपके ब्राउज़र में जाँचे जाते हैं, भेजे नहीं जाते।","footerDesc":"अधिक सजग और अर्थपूर्ण जीवन के लिए शाश्वत आध्यात्मिक ज्ञान।","footerExplore":"जानें","footerStory":"हमारी कहानी","footerOfferings":"हमारी सेवाएँ","footerPrograms":"कार्यक्रम","footerConnect":"जुड़ें","footerContact":"संपर्क करें","footerAsk":"प्रश्न पूछें","footerBack":"ऊपर जाएँ ↑","footerFollow":"इस यात्रा से जुड़ें","footerSocialNote":"प्रकाशित करने से पहले अपने सोशल मीडिया लिंक जोड़ें।","footerMade":"सार्थक भावना के साथ बनाया गया","errorName":"कृपया कम से कम 2 अक्षर दर्ज करें।","errorEmail":"कृपया मान्य ईमेल पता दर्ज करें।","errorMessage":"कृपया कम से कम 10 अक्षर लिखें।","formError":"कृपया चिह्नित फ़ील्ड जाँचें और फिर से प्रयास करें।","formSuccess":"धन्यवाद! आपकी जानकारी जाँच में सही पाई गई। यह डेमो फ़ॉर्म अभी ईमेल सेवा से जुड़ा नहीं है, इसलिए संदेश भेजा नहीं गया है।"},"te":{"skipContent":"ప్రధాన విషయానికి వెళ్లండి","introEyebrow":"గురూజీ కా జ్ఞాన్ మార్గం","introVertical":"అవగాహన · సమతుల్యత · శ్రేయస్సు","introLead":"జీవితం వేగంగా సాగుతుంది. కాసేపు ఆగి, అంతరంగాన్ని ఆలకించి, మరింత చైతన్యవంతమైన సమతుల్య జీవనానికి స్థలం కల్పించమని గురూజీ కా జ్ఞాన్ మిమ్మల్ని ఆహ్వానిస్తుంది.","artCaption":"నిశ్శబ్దానికి తిరిగి చేరండి","offeringEyebrow":"మీకు నచ్చిన మార్గాన్ని అన్వేషించండి","pillLive":"ప్రత్యక్ష వర్క్‌షాప్","pillSelf":"స్వయంగా నేర్చుకోండి","metaLive":"ప్రత్యక్ష అనుభవం","metaRecorded":"రికార్డ్ చేసిన కోర్సు","metaGuided":"మార్గదర్శక సాధన","journeyLink1":"దీని గురించి అడగండి","journeyLink2":"మీ ఆసక్తిని నమోదు చేయండి","journeyLink3":"మరింత తెలుసుకోండి","aboutEyebrow":"ఉద్దేశ్యంతో కూడిన స్థలం","aboutLeadStatic":"ఒక సరళమైన ఆలోచనతో గురూజీ కా జ్ఞాన్ రూపొందించబడింది: చిన్న అర్థవంతమైన క్షణాల నుంచే శ్రేయస్సు ప్రారంభమవుతుంది.","aboutBodyStatic":"ప్రతి ఒక్కరి ప్రయాణం భిన్నమని మేము నమ్ముతున్నాము. ఆసక్తి, నిరంతర సాధన, మీతో మీకు మరింత లోతైన అనుబంధాన్ని ప్రోత్సహించే ఆహ్వానపూర్వక అనుభవాలను సృష్టించడం మా ఉద్దేశ్యం.","valuePresence":"ప్రస్తుత క్షణం","valuePresenceDesc":"మీరు ఉన్న ఈ క్షణానికి స్థలం ఇవ్వండి.","valueBalance":"సమతుల్యత","valueBalanceDesc":"కొనసాగించగలిగే జీవన లయను కనుగొనండి.","valueConnection":"అనుబంధం","valueConnectionDesc":"కలిసి నేర్చుకోండి, పంచుకోండి, ఎదగండి.","emailLabel":"ఇమెయిల్","locationLabel":"ప్రదేశం","locationPlaceholder":"మీ నగరం లేదా కేంద్రం చిరునామాను జోడించండి","contactNote":"ప్రచురించే ముందు నమూనా ఇమెయిల్, ప్రదేశం స్థానంలో మీ వ్యాపార వివరాలను చేర్చండి.","optionPrompt":"ఒక అంశాన్ని ఎంచుకోండి (ఐచ్ఛికం)","optionYoga":"యోగం","optionMeditation":"ధ్యానం","optionLive":"ప్రత్యక్ష వర్క్‌షాప్‌లు","optionRecorded":"రికార్డ్ చేసిన కోర్సులు","optionOther":"ఇతర అంశం","formDemoStatus":"ఇది డెమో ఫారమ్: సందేశాలు మీ బ్రౌజర్‌లో మాత్రమే ధృవీకరించబడతాయి; పంపబడవు.","footerDesc":"మరింత చైతన్యవంతమైన, అర్థవంతమైన జీవితం కోసం శాశ్వత ఆధ్యాత్మిక జ్ఞానం.","footerExplore":"అన్వేషించండి","footerStory":"మా కథ","footerOfferings":"కార్యక్రమాలు","footerPrograms":"ప్రోగ్రామ్‌లు","footerConnect":"సంప్రదింపులు","footerContact":"సంప్రదించండి","footerAsk":"ప్రశ్న అడగండి","footerBack":"పైకి వెళ్లండి ↑","footerFollow":"ఈ ప్రయాణాన్ని అనుసరించండి","footerSocialNote":"ప్రచురించే ముందు మీ సోషల్ మీడియా లింక్‌లను జోడించండి.","footerMade":"సంకల్పంతో రూపొందించబడింది","errorName":"దయచేసి కనీసం 2 అక్షరాలు నమోదు చేయండి.","errorEmail":"దయచేసి సరైన ఇమెయిల్ చిరునామాను నమోదు చేయండి.","errorMessage":"దయచేసి కనీసం 10 అక్షరాలు నమోదు చేయండి.","formError":"దయచేసి హైలైట్ చేసిన వివరాలను సరిచేసి మళ్లీ ప్రయత్నించండి.","formSuccess":"ధన్యవాదాలు! మీ వివరాలు ధృవీకరించబడ్డాయి. ఈ డెమో ఫారమ్ ఇంకా ఇమెయిల్ సేవకు అనుసంధానించబడలేదు, కాబట్టి సందేశం పంపబడలేదు."}}[language]));

  const languageButtons = document.querySelectorAll(".language-button");
  let currentLanguage = "en";
  const applyLanguage = (language) => {
    const selected = translations[language] ? language : "en";
    const dictionary = translations[selected];
    currentLanguage = selected;

    document.documentElement.lang = selected;

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (!(key in dictionary)) return;

      // Preserve decorative Lucide icons while replacing the translated label.
      const icon = element.querySelector("i[data-lucide], svg");
      const iconClone = icon ? icon.cloneNode(true) : null;
      element.textContent = dictionary[key];
      if (iconClone) element.appendChild(iconClone);
    });

    document.querySelectorAll("[data-i18n-html]").forEach(element => {
      const key = element.dataset.i18nHtml;
      if (key in dictionary) element.innerHTML = dictionary[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const key = element.dataset.i18nPlaceholder;
      if (key in dictionary) element.placeholder = dictionary[key];
    });

    languageButtons.forEach(button => {
      const active = button.dataset.lang === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    // Update accessible labels and document language.
    const menuLabel = selected === "hi" ? "नेविगेशन खोलें" :
                      selected === "te" ? "నావిగేషన్ తెరవండి" :
                      "Open navigation";
    if (menuToggle && menuToggle.getAttribute("aria-expanded") !== "true") {
      menuToggle.setAttribute("aria-label", menuLabel);
    }

    try { localStorage.setItem("gkg-language", selected); } catch (_) {}
    if (window.lucide) window.lucide.createIcons();
  };

  languageButtons.forEach(button => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  let savedLanguage = "en";
  try {
    const storedLanguage = localStorage.getItem("gkg-language");
    if (storedLanguage && translations[storedLanguage]) savedLanguage = storedLanguage;
  } catch (_) {}
  applyLanguage(savedLanguage);


  // Current year in footer.
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
