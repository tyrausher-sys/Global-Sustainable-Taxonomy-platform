/* Global Sustainable Taxonomies — shared nav/footer components: global search
   and a site-wide language selector for interface chrome.

   SCOPE NOTE: this translates interface labels, headings and buttons across
   every page (nav, footer, homepage widgets, Media Hub, Subscribe, About,
   Preferences, and the country page's own section headings). It does NOT
   translate researched content itself — country descriptions, activity
   lists, official document titles, media items and chat answers all stay in
   English, since reliably translating that material is a separate, larger
   task (flagged to Tyra as a follow-up). */

const GST_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sv", label: "Svenska" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" }
];

const GST_I18N = {
  en: {
    "nav.map": "Interactive Global Map", "nav.advisor": "AI Advisor", "nav.media": "Media Hub",
    "nav.subscribe": "Subscribe", "nav.resources": "Resources", "nav.about": "About",
    "nav.comingSoon": "Coming soon", "nav.toggleTheme": "Toggle theme", "nav.search": "Search",
    "footer.developedBy": "Developed by", "footer.supervisedBy": "Supervised by", "footer.headOfAI": "Head of AI Centre",
    "search.placeholder": "Search by country, taxonomy or regulator…", "search.noMatches": "No matches",
    "search.title": "Search", "search.close": "Close",
    "translate.button": "Translate", "translate.modalTitle": "Translated Document",
    "translate.loading": "Translating this document\u2026",
    "translate.disclaimer": "Machine translation of an official document, for reference only \u2014 always refer to the original for legal or compliance purposes.",
    "translate.viewOriginal": "View Original PDF \u2197", "translate.close": "Close",
    "translate.errorGeneric": "Couldn't translate this document right now.",
    "translate.errorNotDeployed": "Translate needs the live site backend, which isn't connected here — this only works once the site is deployed to Vercel with an API key (see DEPLOY_INSTRUCTIONS.md). You can still open the original PDF below.",
    "translate.truncatedNote": "This document is long \u2014 showing a translation of the first portion only.",
    "home.heroTitle": "Explore Sustainable Finance Taxonomies Worldwide",
    "home.heroSub": "Select a country on the map, or use the search bar below.",
    "home.chipAllRegions": "All Regions", "home.chipEurope": "Europe", "home.chipAsiaPacific": "Asia-Pacific",
    "home.chipAmericas": "Americas", "home.chipAfrica": "Africa", "home.chipMiddleEast": "Middle East",
    "home.chipAllStatuses": "All Statuses", "home.chipDeveloped": "Developed",
    "home.chipUnderDevelopment": "Under Development", "home.chipNoTaxonomy": "No Taxonomy",
    "home.globalStats": "Global Stats", "home.totalCountriesTracked": "Total Countries Tracked",
    "home.recentlyUpdated": "Recently Updated", "home.askAi": "Ask AI",
    "about.missionHeading": "About the Platform",
    "about.missionText": "Sustainable finance taxonomies — the rulebooks that define which economic activities count as \"green\" or \"sustainable\" — are multiplying fast, but they're scattered across dozens of government websites, PDFs and languages. Anyone trying to compare the EU Taxonomy with Korea's K-Taxonomy, or check whether a given activity is covered anywhere, has to piece it together by hand. This platform brings that information into one interactive place: a map of where taxonomies stand today, side-by-side comparisons, direct links to the original official documents, and an AI advisor to answer specific questions — so regulators, investors and companies can navigate the landscape faster and with fewer blind spots.",
    "about.featurePill1": "Interactive Global Map", "about.featurePill2": "AI Taxonomy Advisor",
    "about.featurePill3": "Media & Trend Hub", "about.featurePill4": "Side-by-Side Comparison",
    "about.featurePill5": "Official Source Documents",
    "about.teamHeading": "Platform Team", "about.coreDeveloper": "Core Developer",
    "about.supervisorRole": "Supervisor · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "About BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS is a Seoul-based \"Beyond Net Zero\" business group working across advisory, policy think-tank and climate-tech investment. The firm has been directly involved in designing major Korean climate policy, including the K-ETS (Emission Trading Scheme) and the K-Taxonomy itself, and advises financial institutions, industry and government on net-zero strategy, sustainability disclosure and green finance. This platform is part of BNZ PARTNERS' newer AI Centre initiative — applying AI to make sustainable finance taxonomies easier to navigate, compare and act on, building on the firm's existing K-Taxonomy policy work.",
    "about.contactHeading": "Questions, feedback, or want to collaborate?",
    "about.contactSub": "Get in touch, or subscribe for updates as this platform grows.",
    "about.contactUs": "Contact Us",
    "subscribe.heading": "Subscribe to the Weekly Digest",
    "subscribe.lede": "Get a weekly summary of taxonomy news, reports and AI trend insights, delivered to your inbox. Only your email address is required — everything else is optional.",
    "subscribe.sampleBanner": "This form adds subscribers to a real Brevo mailing list once the site is deployed with a Brevo API key (see DEPLOY_INSTRUCTIONS.md). Sending the weekly digest itself is still done manually from the Brevo dashboard — this form only handles sign-ups.",
    "subscribe.emailLabel": "Email Address", "subscribe.nameLabel": "Name", "subscribe.optional": "(optional)",
    "subscribe.interestLabel": "Area of Interest", "subscribe.interestEu": "EU Taxonomy Updates",
    "subscribe.interestApac": "Asia-Pacific Taxonomies", "subscribe.interestGreenBonds": "Green Bonds & Finance",
    "subscribe.interestCompliance": "Compliance & Assurance", "subscribe.langLabel": "Language Preference",
    "subscribe.consentComms": "I agree to receive the weekly digest and occasional platform updates from Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "I have read and accept the Privacy Policy, and consent to my data being processed in line with GDPR (EU) and PIPA (South Korea) requirements.",
    "subscribe.submitBtn": "Subscribe for Free",
    "subscribe.privacyNote": "We only use your email to send the digest you've signed up for — it is stored in our Brevo mailing list and is not sold or shared. You can \"unsubscribe\" at any time via the (non-functional) preferences link below.",
    "subscribe.managePrefs": "Manage your preferences", "subscribe.backToMedia": "Back to Media Hub",
    "subscribe.benefit1Title": "Weekly Digest", "subscribe.benefit1Text": "A concise Monday-morning summary of the week's taxonomy news, reports and regulatory updates.",
    "subscribe.benefit2Title": "Platform Alerts", "subscribe.benefit2Text": "Be first to know when a country's taxonomy status changes, or a new official document is published.",
    "subscribe.benefit3Title": "BNZ PARTNERS Insights", "subscribe.benefit3Text": "Occasional analysis pieces from the BNZ Partners AI Centre on emerging taxonomy and compliance themes.",
    "subscribe.benefit4Title": "Event Invitations", "subscribe.benefit4Text": "Invites to webinars, panel discussions and briefings on sustainable finance taxonomies worldwide.",
    "prefs.heading": "Subscriber Preferences", "prefs.lede": "Manage your digest topics, language and communication settings.",
    "prefs.sampleBanner": "Demo preference centre — for illustration only. There is no real subscriber account behind this page, so nothing here is saved, and the fields are shown pre-filled with sample data. In the live product, existing subscribers would land here after clicking a link in their digest email.",
    "prefs.saveBtn": "Save Preferences (demo — disabled)",
    "prefs.privacyNote": "This screen is a non-functional placeholder. To actually change your interests or language in the future, you'd use a page like this one, but it isn't wired up to a real subscriber database yet.",
    "prefs.unsubscribeLink": "Unsubscribe (demo — disabled)", "prefs.backToSubscribe": "Back to Subscribe",
    "media.heading": "Global Media & Trend Hub", "media.lede": "Taxonomy-related media and AI-generated trend insights, in one place.",
    "media.sampleBanner": "Sample content for demonstration purposes only — no live media feed is connected. The taxonomy-development timeline chart below is built from real data; everything else on this page is illustrative placeholder content.",
    "media.filterAll": "All", "media.filterNews": "News", "media.filterReports": "Reports",
    "media.filterVideos": "Videos", "media.filterPapers": "Papers", "media.filterPodcasts": "Podcasts",
    "media.searchPlaceholder": "Search media…", "media.trendLabel": "AI Trend Insights (sample)",
    "media.timelineHeading": "Taxonomy Development Timeline",
    "media.timelineNote": "Real data — number of taxonomies published per year, from the compiled dataset.",
    "media.thematicHeading": "Thematic Policy Trends",
    "media.thematicNote": "Illustrative weighting for demonstration only — not measured from real media volume.",
    "media.ctaHeading": "Get the Weekly Taxonomy Digest",
    "media.ctaText": "A weekly summary of taxonomy news, reports and trend insights — free.",
    "media.ctaBtn": "Subscribe Free",
    "country.backToMap": "Back to map"
  },
  sv: {
    "nav.map": "Interaktiv global karta", "nav.advisor": "AI-rådgivare", "nav.media": "Mediehubb",
    "nav.subscribe": "Prenumerera", "nav.resources": "Resurser", "nav.about": "Om oss",
    "nav.comingSoon": "Kommer snart", "nav.toggleTheme": "Växla tema", "nav.search": "Sök",
    "footer.developedBy": "Utvecklad av", "footer.supervisedBy": "Handledd av", "footer.headOfAI": "Head of AI Centre",
    "search.placeholder": "Sök på land, taxonomi eller tillsynsmyndighet…", "search.noMatches": "Inga träffar",
    "search.title": "Sök", "search.close": "Stäng",
    "translate.button": "Översätt", "translate.modalTitle": "Översatt dokument",
    "translate.loading": "Översätter dokumentet\u2026",
    "translate.disclaimer": "Maskinöversättning av ett officiellt dokument, endast som referens \u2014 se alltid originalet för juridiska eller regelefterlevnadssyften.",
    "translate.viewOriginal": "Visa original-PDF \u2197", "translate.close": "Stäng",
    "translate.errorGeneric": "Det gick inte att översätta dokumentet just nu.",
    "translate.errorNotDeployed": "Översätt kräver den live serverdelen, som inte är ansluten här — detta fungerar först när webbplatsen är driftsatt på Vercel med en API-nyckel (se DEPLOY_INSTRUCTIONS.md). Du kan fortfarande öppna original-PDF:en nedan.",
    "translate.truncatedNote": "Dokumentet är långt \u2014 endast en översättning av den första delen visas.",
    "home.heroTitle": "Utforska hållbara finanstaxonomier världen över",
    "home.heroSub": "Välj ett land på kartan, eller använd sökfältet nedan.",
    "home.chipAllRegions": "Alla regioner", "home.chipEurope": "Europa", "home.chipAsiaPacific": "Asien-Stillahavsregionen",
    "home.chipAmericas": "Amerika", "home.chipAfrica": "Afrika", "home.chipMiddleEast": "Mellanöstern",
    "home.chipAllStatuses": "Alla statusar", "home.chipDeveloped": "Utvecklad",
    "home.chipUnderDevelopment": "Under utveckling", "home.chipNoTaxonomy": "Ingen taxonomi",
    "home.globalStats": "Global statistik", "home.totalCountriesTracked": "Totalt antal länder som bevakas",
    "home.recentlyUpdated": "Senast uppdaterat", "home.askAi": "Fråga AI",
    "about.missionHeading": "Om plattformen",
    "about.missionText": "Taxonomier för hållbar finansiering — regelverken som definierar vilka ekonomiska aktiviteter som räknas som \"gröna\" eller \"hållbara\" — växer snabbt i antal, men är utspridda över dussintals myndighetswebbplatser, PDF:er och språk. Den som vill jämföra EU-taxonomin med Koreas K-Taxonomy, eller kontrollera om en viss aktivitet omfattas någonstans, måste pussla ihop det för hand. Den här plattformen samlar informationen på ett interaktivt ställe: en karta över var taxonomier står idag, sida-vid-sida-jämförelser, direkta länkar till de officiella originaldokumenten, och en AI-rådgivare som svarar på specifika frågor — så att tillsynsmyndigheter, investerare och företag kan navigera snabbare och med färre blinda fläckar.",
    "about.featurePill1": "Interaktiv global karta", "about.featurePill2": "AI-taxonomirådgivare",
    "about.featurePill3": "Medie- och trendhubb", "about.featurePill4": "Jämförelse sida vid sida",
    "about.featurePill5": "Officiella källdokument",
    "about.teamHeading": "Plattformens team", "about.coreDeveloper": "Kärnutvecklare",
    "about.supervisorRole": "Handledare · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "Om BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS är en Seoulbaserad \"Beyond Net Zero\"-affärsgrupp verksam inom rådgivning, policy-tankesmedja och klimattekniska investeringar. Företaget har varit direkt involverat i utformningen av Sydkoreas viktigaste klimatpolitik, inklusive K-ETS (utsläppshandelssystemet) och själva K-Taxonomy, och rådger finansiella institutioner, industri och myndigheter om nollutsläppsstrategi, hållbarhetsrapportering och grön finansiering. Den här plattformen är en del av BNZ PARTNERS nyare AI Centre-satsning — att använda AI för att göra taxonomier för hållbar finansiering enklare att navigera, jämföra och agera på, med utgångspunkt i företagets befintliga K-Taxonomy-policyarbete.",
    "about.contactHeading": "Frågor, feedback, eller vill samarbeta?",
    "about.contactSub": "Hör av dig, eller prenumerera på uppdateringar när plattformen växer.",
    "about.contactUs": "Kontakta oss",
    "subscribe.heading": "Prenumerera på veckobrevet",
    "subscribe.lede": "Få en veckovis sammanfattning av taxonominyheter, rapporter och AI-trendinsikter, direkt till din inkorg. Bara din e-postadress krävs — allt annat är valfritt.",
    "subscribe.sampleBanner": "Detta formulär lägger till prenumeranter i en riktig Brevo-e-postlista när sajten driftsätts med en Brevo API-nyckel (se DEPLOY_INSTRUCTIONS.md). Att faktiskt skicka veckobrevet görs fortfarande manuellt från Brevo-panelen — det här formuläret hanterar bara anmälningar.",
    "subscribe.emailLabel": "E-postadress", "subscribe.nameLabel": "Namn", "subscribe.optional": "(valfritt)",
    "subscribe.interestLabel": "Intresseområde", "subscribe.interestEu": "EU-taxonomiuppdateringar",
    "subscribe.interestApac": "Asien-Stillahavstaxonomier", "subscribe.interestGreenBonds": "Gröna obligationer & finans",
    "subscribe.interestCompliance": "Regelefterlevnad & granskning", "subscribe.langLabel": "Språkinställning",
    "subscribe.consentComms": "Jag samtycker till att få veckobrevet och enstaka plattformsuppdateringar från Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "Jag har läst och godkänner integritetspolicyn, och samtycker till att mina uppgifter behandlas i enlighet med GDPR (EU) och PIPA (Sydkorea).",
    "subscribe.submitBtn": "Prenumerera gratis",
    "subscribe.privacyNote": "Vi använder bara din e-post för att skicka veckobrevet du anmält dig till — den sparas i vår Brevo-e-postlista och säljs eller delas inte. Du kan \"avsluta prenumerationen\" när som helst via inställningslänken (icke-funktionell) nedan.",
    "subscribe.managePrefs": "Hantera dina inställningar", "subscribe.backToMedia": "Tillbaka till Mediehubben",
    "subscribe.benefit1Title": "Veckobrev", "subscribe.benefit1Text": "En kortfattad måndagsmorgon-sammanfattning av veckans taxonominyheter, rapporter och regeluppdateringar.",
    "subscribe.benefit2Title": "Plattformsaviseringar", "subscribe.benefit2Text": "Få veta först när ett lands taxonomistatus ändras, eller ett nytt officiellt dokument publiceras.",
    "subscribe.benefit3Title": "BNZ PARTNERS-insikter", "subscribe.benefit3Text": "Enstaka analyser från BNZ Partners AI Centre om nya taxonomi- och regelefterlevnadsteman.",
    "subscribe.benefit4Title": "Eventinbjudningar", "subscribe.benefit4Text": "Inbjudningar till webbinarier, paneldiskussioner och genomgångar om taxonomier för hållbar finansiering världen över.",
    "prefs.heading": "Prenumerantinställningar", "prefs.lede": "Hantera dina ämnen för veckobrevet, språk och kommunikationsinställningar.",
    "prefs.sampleBanner": "Demo-inställningscenter — endast för illustration. Det finns inget riktigt prenumerantkonto bakom den här sidan, så inget här sparas, och fälten visas förifyllda med exempeldata. I den riktiga produkten skulle befintliga prenumeranter hamna här efter att ha klickat på en länk i sitt veckobrev.",
    "prefs.saveBtn": "Spara inställningar (demo — inaktiverad)",
    "prefs.privacyNote": "Den här skärmen är en icke-funktionell platshållare. För att faktiskt ändra dina intressen eller språk i framtiden skulle du använda en sida som denna, men den är inte kopplad till en riktig prenumerantdatabas ännu.",
    "prefs.unsubscribeLink": "Avsluta prenumeration (demo — inaktiverad)", "prefs.backToSubscribe": "Tillbaka till Prenumerera",
    "media.heading": "Global medie- och trendhubb", "media.lede": "Taxonomirelaterade medier och AI-genererade trendinsikter, på ett ställe.",
    "media.sampleBanner": "Exempelinnehåll endast för demonstration — inget live-medieflöde är anslutet. Tidslinjediagrammet för taxonomiutveckling nedan bygger på riktig data; allt annat på den här sidan är illustrativt platshållarinnehåll.",
    "media.filterAll": "Alla", "media.filterNews": "Nyheter", "media.filterReports": "Rapporter",
    "media.filterVideos": "Videor", "media.filterPapers": "Papper", "media.filterPodcasts": "Poddar",
    "media.searchPlaceholder": "Sök medier…", "media.trendLabel": "AI-trendinsikter (exempel)",
    "media.timelineHeading": "Tidslinje för taxonomiutveckling",
    "media.timelineNote": "Riktig data — antal publicerade taxonomier per år, från det sammanställda datasetet.",
    "media.thematicHeading": "Tematiska policytrender",
    "media.thematicNote": "Illustrativ viktning endast för demonstration — inte uppmätt från riktig medievolym.",
    "media.ctaHeading": "Få veckans taxonomibrev",
    "media.ctaText": "En veckovis sammanfattning av taxonominyheter, rapporter och trendinsikter — gratis.",
    "media.ctaBtn": "Prenumerera gratis",
    "country.backToMap": "Tillbaka till kartan"
  },
  ko: {
    "nav.map": "인터랙티브 글로벌 지도", "nav.advisor": "AI 어드바이저", "nav.media": "미디어 허브",
    "nav.subscribe": "구독", "nav.resources": "자료", "nav.about": "소개",
    "nav.comingSoon": "출시 예정", "nav.toggleTheme": "테마 전환", "nav.search": "검색",
    "footer.developedBy": "개발", "footer.supervisedBy": "감수", "footer.headOfAI": "Head of AI Centre",
    "search.placeholder": "국가, 택소노미 또는 규제 기관으로 검색…", "search.noMatches": "검색 결과 없음",
    "search.title": "검색", "search.close": "닫기",
    "translate.button": "번역", "translate.modalTitle": "번역된 문서",
    "translate.loading": "문서를 번역하는 중\u2026",
    "translate.disclaimer": "공식 문서의 기계 번역이며 참고용입니다 \u2014 법적 또는 규정 준수 목적으로는 항상 원본을 참조하십시오.",
    "translate.viewOriginal": "원본 PDF 보기 \u2197", "translate.close": "닫기",
    "translate.errorGeneric": "지금은 이 문서를 번역할 수 없습니다.",
    "translate.errorNotDeployed": "번역 기능은 실제 서버 백엔드가 필요하지만 현재 연결되어 있지 않습니다 — 이 기능은 사이트가 API 키와 함께 Vercel에 배포된 후에만 작동합니다(DEPLOY_INSTRUCTIONS.md 참고). 아래에서 원본 PDF는 계속 열어볼 수 있습니다.",
    "translate.truncatedNote": "문서가 길어서 처음 일부만 번역하여 표시합니다.",
    "home.heroTitle": "전 세계 지속가능금융 택소노미 살펴보기",
    "home.heroSub": "지도에서 국가를 선택하거나 아래 검색창을 이용하세요.",
    "home.chipAllRegions": "전체 지역", "home.chipEurope": "유럽", "home.chipAsiaPacific": "아시아·태평양",
    "home.chipAmericas": "아메리카", "home.chipAfrica": "아프리카", "home.chipMiddleEast": "중동",
    "home.chipAllStatuses": "전체 상태", "home.chipDeveloped": "구축 완료",
    "home.chipUnderDevelopment": "개발 중", "home.chipNoTaxonomy": "택소노미 없음",
    "home.globalStats": "글로벌 통계", "home.totalCountriesTracked": "추적 중인 총 국가 수",
    "home.recentlyUpdated": "최근 업데이트", "home.askAi": "AI에게 질문",
    "about.missionHeading": "플랫폼 소개",
    "about.missionText": "어떤 경제 활동이 \"녹색\" 또는 \"지속가능\"한지 정의하는 규칙집인 지속가능금융 택소노미는 빠르게 늘어나고 있지만, 수십 개의 정부 웹사이트와 PDF, 언어에 흩어져 있습니다. EU 택소노미와 한국의 K-택소노미를 비교하거나 특정 활동이 어딘가에서 다뤄지는지 확인하려는 사람은 이를 직접 손으로 짜맞춰야 합니다. 이 플랫폼은 그 정보를 하나의 인터랙티브한 공간으로 모읍니다: 오늘날 택소노미의 현황을 보여주는 지도, 나란히 비교, 공식 원문 문서로의 직접 링크, 그리고 구체적인 질문에 답하는 AI 어드바이저까지 — 규제 기관, 투자자, 기업이 더 빠르고 사각지대 없이 이 지형을 탐색할 수 있도록 돕습니다.",
    "about.featurePill1": "인터랙티브 글로벌 지도", "about.featurePill2": "AI 택소노미 어드바이저",
    "about.featurePill3": "미디어 및 트렌드 허브", "about.featurePill4": "나란히 비교",
    "about.featurePill5": "공식 출처 문서",
    "about.teamHeading": "플랫폼 팀", "about.coreDeveloper": "핵심 개발자",
    "about.supervisorRole": "감수 · BNZ PARTNERS Head of AI Centre",
    "about.bnzHeading": "BNZ PARTNERS 소개",
    "about.bnzText": "BNZ PARTNERS는 자문, 정책 싱크탱크, 클라이밋테크 투자를 아우르는 서울 소재 \"Beyond Net Zero\" 비즈니스 그룹입니다. 이 회사는 K-ETS(배출권거래제)와 K-Taxonomy 자체를 포함한 한국의 주요 기후 정책 설계에 직접 참여해 왔으며, 금융기관·산업·정부에 넷제로 전략, 지속가능성 공시, 녹색금융에 대해 자문하고 있습니다. 이 플랫폼은 BNZ PARTNERS의 새로운 AI Centre 이니셔티브의 일환으로, 회사의 기존 K-Taxonomy 정책 업무를 바탕으로 AI를 활용해 지속가능금융 택소노미를 더 쉽게 탐색·비교·활용할 수 있도록 합니다.",
    "about.contactHeading": "질문, 피드백 또는 협업을 원하시나요?",
    "about.contactSub": "연락하시거나, 플랫폼이 성장함에 따라 업데이트를 받아보세요.",
    "about.contactUs": "문의하기",
    "subscribe.heading": "주간 다이제스트 구독하기",
    "subscribe.lede": "택소노미 뉴스, 보고서, AI 트렌드 인사이트를 주간 요약으로 받은편지함에서 받아보세요. 이메일 주소만 필수이며 나머지는 모두 선택 사항입니다.",
    "subscribe.sampleBanner": "이 양식은 Brevo API 키로 사이트가 배포되면 실제 Brevo 메일링 리스트에 구독자를 추가합니다(DEPLOY_INSTRUCTIONS.md 참조). 실제로 주간 다이제스트를 발송하는 것은 여전히 Brevo 대시보드에서 수동으로 해야 합니다 — 이 양식은 가입만 처리합니다.",
    "subscribe.emailLabel": "이메일 주소", "subscribe.nameLabel": "이름", "subscribe.optional": "(선택 사항)",
    "subscribe.interestLabel": "관심 분야", "subscribe.interestEu": "EU 택소노미 업데이트",
    "subscribe.interestApac": "아시아·태평양 택소노미", "subscribe.interestGreenBonds": "녹색채권 및 금융",
    "subscribe.interestCompliance": "컴플라이언스 및 검증", "subscribe.langLabel": "언어 설정",
    "subscribe.consentComms": "Global Sustainable Taxonomies / BNZ Partners로부터 주간 다이제스트와 간헐적인 플랫폼 업데이트를 받는 것에 동의합니다.",
    "subscribe.consentPrivacy": "개인정보처리방침을 읽고 동의하며, GDPR(EU) 및 PIPA(대한민국)에 따라 제 데이터가 처리되는 것에 동의합니다.",
    "subscribe.submitBtn": "무료로 구독하기",
    "subscribe.privacyNote": "귀하의 이메일은 신청하신 다이제스트 발송에만 사용됩니다 — Brevo 메일링 리스트에 저장되며 판매되거나 공유되지 않습니다. 아래의 (작동하지 않는) 환경설정 링크를 통해 언제든지 \"구독 취소\"할 수 있습니다.",
    "subscribe.managePrefs": "환경설정 관리", "subscribe.backToMedia": "미디어 허브로 돌아가기",
    "subscribe.benefit1Title": "주간 다이제스트", "subscribe.benefit1Text": "이번 주 택소노미 뉴스, 보고서, 규제 업데이트를 월요일 아침에 간결하게 요약해 드립니다.",
    "subscribe.benefit2Title": "플랫폼 알림", "subscribe.benefit2Text": "국가의 택소노미 상태가 변경되거나 새 공식 문서가 게시되면 가장 먼저 알려드립니다.",
    "subscribe.benefit3Title": "BNZ PARTNERS 인사이트", "subscribe.benefit3Text": "BNZ Partners AI Centre가 전하는 새로운 택소노미 및 컴플라이언스 주제에 대한 분석 콘텐츠입니다.",
    "subscribe.benefit4Title": "이벤트 초대", "subscribe.benefit4Text": "전 세계 지속가능금융 택소노미에 관한 웨비나, 패널 토론, 브리핑 초대장을 받아보세요.",
    "prefs.heading": "구독자 환경설정", "prefs.lede": "다이제스트 주제, 언어 및 커뮤니케이션 설정을 관리하세요.",
    "prefs.sampleBanner": "데모 환경설정 센터 — 예시 목적으로만 제공됩니다. 이 페이지 뒤에는 실제 구독자 계정이 없으므로 여기서는 아무것도 저장되지 않으며, 필드에는 예시 데이터가 미리 채워져 있습니다. 실제 제품에서는 기존 구독자가 다이제스트 이메일의 링크를 클릭한 후 이곳으로 이동하게 됩니다.",
    "prefs.saveBtn": "환경설정 저장 (데모 — 비활성화됨)",
    "prefs.privacyNote": "이 화면은 작동하지 않는 자리표시자입니다. 앞으로 관심사나 언어를 실제로 변경하려면 이와 같은 페이지를 사용하겠지만, 아직 실제 구독자 데이터베이스에 연결되어 있지 않습니다.",
    "prefs.unsubscribeLink": "구독 취소 (데모 — 비활성화됨)", "prefs.backToSubscribe": "구독 페이지로 돌아가기",
    "media.heading": "글로벌 미디어 및 트렌드 허브", "media.lede": "택소노미 관련 미디어와 AI 생성 트렌드 인사이트를 한곳에서 만나보세요.",
    "media.sampleBanner": "시연 목적의 예시 콘텐츠입니다 — 실시간 미디어 피드는 연결되어 있지 않습니다. 아래 택소노미 개발 타임라인 차트는 실제 데이터로 만들어졌으며, 이 페이지의 나머지 내용은 모두 예시용 플레이스홀더 콘텐츠입니다.",
    "media.filterAll": "전체", "media.filterNews": "뉴스", "media.filterReports": "보고서",
    "media.filterVideos": "동영상", "media.filterPapers": "논문", "media.filterPodcasts": "팟캐스트",
    "media.searchPlaceholder": "미디어 검색…", "media.trendLabel": "AI 트렌드 인사이트 (예시)",
    "media.timelineHeading": "택소노미 발전 타임라인",
    "media.timelineNote": "실제 데이터 — 편집된 데이터셋 기준 연도별 발표된 택소노미 수.",
    "media.thematicHeading": "주제별 정책 트렌드",
    "media.thematicNote": "시연을 위한 예시 가중치입니다 — 실제 미디어 볼륨으로 측정된 것이 아닙니다.",
    "media.ctaHeading": "주간 택소노미 다이제스트 받기",
    "media.ctaText": "택소노미 뉴스, 보고서, 트렌드 인사이트를 담은 주간 요약 — 무료입니다.",
    "media.ctaBtn": "무료로 구독하기",
    "country.backToMap": "지도로 돌아가기"
  },
  es: {
    "nav.map": "Mapa Global Interactivo", "nav.advisor": "Asesor de IA", "nav.media": "Centro de Medios",
    "nav.subscribe": "Suscribirse", "nav.resources": "Recursos", "nav.about": "Acerca de",
    "nav.comingSoon": "Próximamente", "nav.toggleTheme": "Cambiar tema", "nav.search": "Buscar",
    "footer.developedBy": "Desarrollado por", "footer.supervisedBy": "Supervisado por", "footer.headOfAI": "Head of AI Centre",
    "search.placeholder": "Buscar por país, taxonomía o regulador…", "search.noMatches": "Sin resultados",
    "search.title": "Buscar", "search.close": "Cerrar",
    "translate.button": "Traducir", "translate.modalTitle": "Documento traducido",
    "translate.loading": "Traduciendo este documento\u2026",
    "translate.disclaimer": "Traducción automática de un documento oficial, solo como referencia \u2014 consulte siempre el original para fines legales o de cumplimiento.",
    "translate.viewOriginal": "Ver PDF original \u2197", "translate.close": "Cerrar",
    "translate.errorGeneric": "No se pudo traducir este documento en este momento.",
    "translate.errorNotDeployed": "Traducir requiere el backend en vivo del sitio, que no está conectado aquí — esto solo funciona una vez que el sitio esté desplegado en Vercel con una clave de API (consulte DEPLOY_INSTRUCTIONS.md). Aún puede abrir el PDF original a continuación.",
    "translate.truncatedNote": "Este documento es extenso \u2014 se muestra la traducción solo de la primera parte.",
    "home.heroTitle": "Explore las taxonomías de finanzas sostenibles en todo el mundo",
    "home.heroSub": "Seleccione un país en el mapa, o use la barra de búsqueda a continuación.",
    "home.chipAllRegions": "Todas las regiones", "home.chipEurope": "Europa", "home.chipAsiaPacific": "Asia-Pacífico",
    "home.chipAmericas": "América", "home.chipAfrica": "África", "home.chipMiddleEast": "Oriente Medio",
    "home.chipAllStatuses": "Todos los estados", "home.chipDeveloped": "Desarrollada",
    "home.chipUnderDevelopment": "En desarrollo", "home.chipNoTaxonomy": "Sin taxonomía",
    "home.globalStats": "Estadísticas globales", "home.totalCountriesTracked": "Total de países monitoreados",
    "home.recentlyUpdated": "Actualizado recientemente", "home.askAi": "Preguntar a la IA",
    "about.missionHeading": "Sobre la plataforma",
    "about.missionText": "Las taxonomías de finanzas sostenibles — los reglamentos que definen qué actividades económicas cuentan como \"verdes\" o \"sostenibles\" — se multiplican rápidamente, pero están dispersas en docenas de sitios web gubernamentales, PDFs e idiomas. Cualquiera que intente comparar la Taxonomía de la UE con la K-Taxonomy de Corea, o verificar si una actividad determinada está cubierta en algún lugar, tiene que armarlo a mano. Esta plataforma reúne esa información en un solo lugar interactivo: un mapa de dónde se encuentran hoy las taxonomías, comparaciones lado a lado, enlaces directos a los documentos oficiales originales, y un asesor de IA para responder preguntas específicas — para que reguladores, inversores y empresas puedan navegar el panorama más rápido y con menos puntos ciegos.",
    "about.featurePill1": "Mapa Global Interactivo", "about.featurePill2": "Asesor de Taxonomías IA",
    "about.featurePill3": "Centro de Medios y Tendencias", "about.featurePill4": "Comparación lado a lado",
    "about.featurePill5": "Documentos fuente oficiales",
    "about.teamHeading": "Equipo de la plataforma", "about.coreDeveloper": "Desarrolladora principal",
    "about.supervisorRole": "Supervisora · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "Acerca de BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS es un grupo empresarial \"Beyond Net Zero\" con sede en Seúl que trabaja en asesoría, think tank de políticas e inversión en tecnología climática. La firma ha participado directamente en el diseño de las principales políticas climáticas de Corea, incluido el K-ETS (sistema de comercio de emisiones) y la propia K-Taxonomy, y asesora a instituciones financieras, la industria y el gobierno en estrategia net-zero, divulgación de sostenibilidad y finanzas verdes. Esta plataforma forma parte de la nueva iniciativa AI Centre de BNZ PARTNERS — aplicando IA para facilitar la navegación, comparación y acción sobre las taxonomías de finanzas sostenibles, sobre la base del trabajo existente de la firma en políticas de K-Taxonomy.",
    "about.contactHeading": "¿Preguntas, comentarios o quieres colaborar?",
    "about.contactSub": "Ponte en contacto, o suscríbete para recibir actualizaciones a medida que esta plataforma crece.",
    "about.contactUs": "Contáctenos",
    "subscribe.heading": "Suscríbase al boletín semanal",
    "subscribe.lede": "Reciba un resumen semanal de noticias de taxonomías, informes e ideas de tendencias de IA, directamente en su bandeja de entrada. Solo se requiere su dirección de correo electrónico — todo lo demás es opcional.",
    "subscribe.sampleBanner": "Este formulario añade suscriptores a una lista de correo real de Brevo una vez que el sitio se despliegue con una clave API de Brevo (ver DEPLOY_INSTRUCTIONS.md). El envío del boletín semanal en sí todavía se hace manualmente desde el panel de Brevo — este formulario solo gestiona las inscripciones.",
    "subscribe.emailLabel": "Correo electrónico", "subscribe.nameLabel": "Nombre", "subscribe.optional": "(opcional)",
    "subscribe.interestLabel": "Área de interés", "subscribe.interestEu": "Actualizaciones de la Taxonomía de la UE",
    "subscribe.interestApac": "Taxonomías de Asia-Pacífico", "subscribe.interestGreenBonds": "Bonos verdes y finanzas",
    "subscribe.interestCompliance": "Cumplimiento y aseguramiento", "subscribe.langLabel": "Preferencia de idioma",
    "subscribe.consentComms": "Acepto recibir el boletín semanal y actualizaciones ocasionales de la plataforma de Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "He leído y acepto la Política de Privacidad, y consiento que mis datos sean procesados conforme al RGPD (UE) y la PIPA (Corea del Sur).",
    "subscribe.submitBtn": "Suscribirse gratis",
    "subscribe.privacyNote": "Solo usamos su correo para enviarle el boletín al que se ha suscrito — se almacena en nuestra lista de correo de Brevo y no se vende ni comparte. Puede \"darse de baja\" en cualquier momento a través del enlace de preferencias (no funcional) a continuación.",
    "subscribe.managePrefs": "Administrar sus preferencias", "subscribe.backToMedia": "Volver al Centro de Medios",
    "subscribe.benefit1Title": "Boletín semanal", "subscribe.benefit1Text": "Un resumen conciso de los lunes por la mañana con las noticias, informes y actualizaciones regulatorias de taxonomías de la semana.",
    "subscribe.benefit2Title": "Alertas de la plataforma", "subscribe.benefit2Text": "Entérese primero cuando cambie el estado de la taxonomía de un país, o se publique un nuevo documento oficial.",
    "subscribe.benefit3Title": "Perspectivas de BNZ PARTNERS", "subscribe.benefit3Text": "Piezas de análisis ocasionales del AI Centre de BNZ Partners sobre temas emergentes de taxonomía y cumplimiento.",
    "subscribe.benefit4Title": "Invitaciones a eventos", "subscribe.benefit4Text": "Invitaciones a webinars, mesas redondas y sesiones informativas sobre taxonomías de finanzas sostenibles en todo el mundo.",
    "prefs.heading": "Preferencias del suscriptor", "prefs.lede": "Administre los temas de su boletín, idioma y configuración de comunicación.",
    "prefs.sampleBanner": "Centro de preferencias de demostración — solo con fines ilustrativos. No hay una cuenta de suscriptor real detrás de esta página, por lo que nada aquí se guarda, y los campos se muestran precargados con datos de ejemplo. En el producto real, los suscriptores existentes llegarían aquí después de hacer clic en un enlace de su correo del boletín.",
    "prefs.saveBtn": "Guardar preferencias (demo — deshabilitado)",
    "prefs.privacyNote": "Esta pantalla es un marcador de posición no funcional. Para cambiar realmente sus intereses o idioma en el futuro, usaría una página como esta, pero aún no está conectada a una base de datos de suscriptores real.",
    "prefs.unsubscribeLink": "Cancelar suscripción (demo — deshabilitado)", "prefs.backToSubscribe": "Volver a Suscribirse",
    "media.heading": "Centro Global de Medios y Tendencias", "media.lede": "Medios relacionados con taxonomías e ideas de tendencias generadas por IA, en un solo lugar.",
    "media.sampleBanner": "Contenido de ejemplo solo con fines de demostración — no hay ningún feed de medios en vivo conectado. El gráfico de la cronología de desarrollo de taxonomías a continuación se construye con datos reales; todo lo demás en esta página es contenido de marcador de posición ilustrativo.",
    "media.filterAll": "Todo", "media.filterNews": "Noticias", "media.filterReports": "Informes",
    "media.filterVideos": "Videos", "media.filterPapers": "Documentos", "media.filterPodcasts": "Pódcasts",
    "media.searchPlaceholder": "Buscar medios…", "media.trendLabel": "Perspectivas de tendencias de IA (ejemplo)",
    "media.timelineHeading": "Cronología del desarrollo de taxonomías",
    "media.timelineNote": "Datos reales — número de taxonomías publicadas por año, del conjunto de datos compilado.",
    "media.thematicHeading": "Tendencias temáticas de políticas",
    "media.thematicNote": "Ponderación ilustrativa solo para demostración — no medida a partir del volumen real de medios.",
    "media.ctaHeading": "Reciba el boletín semanal de taxonomías",
    "media.ctaText": "Un resumen semanal de noticias, informes e ideas de tendencias sobre taxonomías — gratis.",
    "media.ctaBtn": "Suscribirse gratis",
    "country.backToMap": "Volver al mapa"
  },
  fr: {
    "nav.map": "Carte mondiale interactive", "nav.advisor": "Conseiller IA", "nav.media": "Centre de médias",
    "nav.subscribe": "S'abonner", "nav.resources": "Ressources", "nav.about": "À propos",
    "nav.comingSoon": "Bientôt disponible", "nav.toggleTheme": "Changer de thème", "nav.search": "Rechercher",
    "footer.developedBy": "Développé par", "footer.supervisedBy": "Supervisé par", "footer.headOfAI": "Head of AI Centre",
    "search.placeholder": "Rechercher par pays, taxonomie ou régulateur…", "search.noMatches": "Aucun résultat",
    "search.title": "Rechercher", "search.close": "Fermer",
    "translate.button": "Traduire", "translate.modalTitle": "Document traduit",
    "translate.loading": "Traduction du document en cours\u2026",
    "translate.disclaimer": "Traduction automatique d'un document officiel, à titre indicatif uniquement \u2014 consultez toujours l'original à des fins juridiques ou de conformité.",
    "translate.viewOriginal": "Voir le PDF original \u2197", "translate.close": "Fermer",
    "translate.errorGeneric": "Impossible de traduire ce document pour le moment.",
    "translate.errorNotDeployed": "La traduction nécessite le backend en direct du site, qui n'est pas connecté ici — cela ne fonctionne qu'une fois le site déployé sur Vercel avec une clé API (voir DEPLOY_INSTRUCTIONS.md). Vous pouvez toujours ouvrir le PDF original ci-dessous.",
    "translate.truncatedNote": "Ce document est long \u2014 seule la traduction de la première partie est affichée.",
    "home.heroTitle": "Explorez les taxonomies de la finance durable dans le monde",
    "home.heroSub": "Sélectionnez un pays sur la carte, ou utilisez la barre de recherche ci-dessous.",
    "home.chipAllRegions": "Toutes les régions", "home.chipEurope": "Europe", "home.chipAsiaPacific": "Asie-Pacifique",
    "home.chipAmericas": "Amériques", "home.chipAfrica": "Afrique", "home.chipMiddleEast": "Moyen-Orient",
    "home.chipAllStatuses": "Tous les statuts", "home.chipDeveloped": "Développée",
    "home.chipUnderDevelopment": "En développement", "home.chipNoTaxonomy": "Aucune taxonomie",
    "home.globalStats": "Statistiques globales", "home.totalCountriesTracked": "Total des pays suivis",
    "home.recentlyUpdated": "Récemment mis à jour", "home.askAi": "Demander à l'IA",
    "about.missionHeading": "À propos de la plateforme",
    "about.missionText": "Les taxonomies de finance durable — les règlements qui définissent quelles activités économiques comptent comme \"vertes\" ou \"durables\" — se multiplient rapidement, mais sont dispersées sur des dizaines de sites web gouvernementaux, de PDF et de langues. Quiconque essaie de comparer la taxonomie de l'UE avec la K-Taxonomy coréenne, ou de vérifier si une activité donnée est couverte quelque part, doit reconstituer cela à la main. Cette plateforme rassemble ces informations en un seul endroit interactif : une carte de l'état actuel des taxonomies, des comparaisons côte à côte, des liens directs vers les documents officiels originaux, et un conseiller IA pour répondre à des questions précises — afin que les régulateurs, les investisseurs et les entreprises puissent naviguer plus rapidement dans ce paysage, avec moins d'angles morts.",
    "about.featurePill1": "Carte mondiale interactive", "about.featurePill2": "Conseiller en taxonomies IA",
    "about.featurePill3": "Centre de médias et tendances", "about.featurePill4": "Comparaison côte à côte",
    "about.featurePill5": "Documents sources officiels",
    "about.teamHeading": "Équipe de la plateforme", "about.coreDeveloper": "Développeuse principale",
    "about.supervisorRole": "Superviseure · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "À propos de BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS est un groupe d'affaires \"Beyond Net Zero\" basé à Séoul, actif dans le conseil, les think tanks politiques et l'investissement en technologies climatiques. L'entreprise a été directement impliquée dans la conception des principales politiques climatiques coréennes, y compris le K-ETS (système d'échange de quotas d'émission) et la K-Taxonomy elle-même, et conseille les institutions financières, l'industrie et le gouvernement sur la stratégie net zéro, la publication d'informations en matière de durabilité et la finance verte. Cette plateforme fait partie de la nouvelle initiative AI Centre de BNZ PARTNERS — appliquer l'IA pour faciliter la navigation, la comparaison et l'action sur les taxonomies de finance durable, en s'appuyant sur le travail politique existant de l'entreprise sur la K-Taxonomy.",
    "about.contactHeading": "Des questions, des retours, ou envie de collaborer ?",
    "about.contactSub": "Contactez-nous, ou abonnez-vous pour recevoir des mises à jour à mesure que cette plateforme évolue.",
    "about.contactUs": "Nous contacter",
    "subscribe.heading": "Abonnez-vous à la newsletter hebdomadaire",
    "subscribe.lede": "Recevez un résumé hebdomadaire des actualités, rapports et analyses de tendances IA sur les taxonomies, directement dans votre boîte de réception. Seule votre adresse e-mail est requise — tout le reste est facultatif.",
    "subscribe.sampleBanner": "Ce formulaire ajoute les abonnés à une véritable liste de diffusion Brevo une fois le site déployé avec une clé API Brevo (voir DEPLOY_INSTRUCTIONS.md). L'envoi effectif de la newsletter hebdomadaire se fait encore manuellement depuis le tableau de bord Brevo — ce formulaire ne gère que les inscriptions.",
    "subscribe.emailLabel": "Adresse e-mail", "subscribe.nameLabel": "Nom", "subscribe.optional": "(facultatif)",
    "subscribe.interestLabel": "Centre d'intérêt", "subscribe.interestEu": "Mises à jour de la taxonomie de l'UE",
    "subscribe.interestApac": "Taxonomies Asie-Pacifique", "subscribe.interestGreenBonds": "Obligations vertes et finance",
    "subscribe.interestCompliance": "Conformité et assurance", "subscribe.langLabel": "Préférence linguistique",
    "subscribe.consentComms": "J'accepte de recevoir la newsletter hebdomadaire et des mises à jour occasionnelles de la plateforme de la part de Global Sustainable Taxonomies / BNZ Partners.",
    "subscribe.consentPrivacy": "J'ai lu et j'accepte la politique de confidentialité, et je consens à ce que mes données soient traitées conformément au RGPD (UE) et à la PIPA (Corée du Sud).",
    "subscribe.submitBtn": "S'abonner gratuitement",
    "subscribe.privacyNote": "Nous utilisons votre e-mail uniquement pour vous envoyer la newsletter à laquelle vous vous êtes inscrit — il est stocké dans notre liste de diffusion Brevo et n'est ni vendu ni partagé. Vous pouvez vous \"désabonner\" à tout moment via le lien de préférences (non fonctionnel) ci-dessous.",
    "subscribe.managePrefs": "Gérer vos préférences", "subscribe.backToMedia": "Retour au Centre de médias",
    "subscribe.benefit1Title": "Newsletter hebdomadaire", "subscribe.benefit1Text": "Un résumé concis du lundi matin des actualités, rapports et mises à jour réglementaires de la semaine sur les taxonomies.",
    "subscribe.benefit2Title": "Alertes de la plateforme", "subscribe.benefit2Text": "Soyez informé en premier lorsque le statut de la taxonomie d'un pays change, ou qu'un nouveau document officiel est publié.",
    "subscribe.benefit3Title": "Perspectives BNZ PARTNERS", "subscribe.benefit3Text": "Analyses occasionnelles de l'AI Centre de BNZ Partners sur les thèmes émergents de taxonomie et de conformité.",
    "subscribe.benefit4Title": "Invitations aux événements", "subscribe.benefit4Text": "Invitations à des webinaires, tables rondes et briefings sur les taxonomies de finance durable dans le monde.",
    "prefs.heading": "Préférences de l'abonné", "prefs.lede": "Gérez les sujets de votre newsletter, la langue et les paramètres de communication.",
    "prefs.sampleBanner": "Centre de préférences de démonstration — à titre illustratif uniquement. Il n'y a pas de véritable compte d'abonné derrière cette page, donc rien n'est enregistré ici, et les champs sont pré-remplis avec des données d'exemple. Dans le produit réel, les abonnés existants arriveraient ici après avoir cliqué sur un lien dans leur e-mail de newsletter.",
    "prefs.saveBtn": "Enregistrer les préférences (démo — désactivé)",
    "prefs.privacyNote": "Cet écran est un espace réservé non fonctionnel. Pour réellement modifier vos centres d'intérêt ou votre langue à l'avenir, vous utiliseriez une page comme celle-ci, mais elle n'est pas encore connectée à une véritable base de données d'abonnés.",
    "prefs.unsubscribeLink": "Se désabonner (démo — désactivé)", "prefs.backToSubscribe": "Retour à Abonnement",
    "media.heading": "Centre mondial de médias et tendances", "media.lede": "Médias liés aux taxonomies et analyses de tendances générées par IA, en un seul endroit.",
    "media.sampleBanner": "Contenu d'exemple à des fins de démonstration uniquement — aucun flux média en direct n'est connecté. Le graphique de la chronologie de développement des taxonomies ci-dessous est construit à partir de données réelles ; tout le reste sur cette page est un contenu d'exemple illustratif.",
    "media.filterAll": "Tout", "media.filterNews": "Actualités", "media.filterReports": "Rapports",
    "media.filterVideos": "Vidéos", "media.filterPapers": "Articles", "media.filterPodcasts": "Podcasts",
    "media.searchPlaceholder": "Rechercher des médias…", "media.trendLabel": "Analyses de tendances IA (exemple)",
    "media.timelineHeading": "Chronologie du développement des taxonomies",
    "media.timelineNote": "Données réelles — nombre de taxonomies publiées par an, à partir du jeu de données compilé.",
    "media.thematicHeading": "Tendances politiques thématiques",
    "media.thematicNote": "Pondération illustrative à des fins de démonstration uniquement — non mesurée à partir du volume réel des médias.",
    "media.ctaHeading": "Recevez la newsletter hebdomadaire sur les taxonomies",
    "media.ctaText": "Un résumé hebdomadaire des actualités, rapports et analyses de tendances sur les taxonomies — gratuit.",
    "media.ctaBtn": "S'abonner gratuitement",
    "country.backToMap": "Retour à la carte"
  },
  de: {
    "nav.map": "Interaktive Weltkarte", "nav.advisor": "KI-Berater", "nav.media": "Medien-Hub",
    "nav.subscribe": "Abonnieren", "nav.resources": "Ressourcen", "nav.about": "Über uns",
    "nav.comingSoon": "Demnächst", "nav.toggleTheme": "Design wechseln", "nav.search": "Suche",
    "footer.developedBy": "Entwickelt von", "footer.supervisedBy": "Betreut von", "footer.headOfAI": "Head of AI Centre",
    "search.placeholder": "Nach Land, Taxonomie oder Aufsichtsbehörde suchen…", "search.noMatches": "Keine Treffer",
    "search.title": "Suche", "search.close": "Schließen",
    "translate.button": "Übersetzen", "translate.modalTitle": "Übersetztes Dokument",
    "translate.loading": "Dokument wird übersetzt\u2026",
    "translate.disclaimer": "Maschinelle Übersetzung eines offiziellen Dokuments, nur zur Information \u2014 für rechtliche oder Compliance-Zwecke stets das Original heranziehen.",
    "translate.viewOriginal": "Original-PDF ansehen \u2197", "translate.close": "Schließen",
    "translate.errorGeneric": "Dieses Dokument konnte gerade nicht übersetzt werden.",
    "translate.errorNotDeployed": "Übersetzen benötigt das Live-Backend der Website, das hier nicht verbunden ist — dies funktioniert erst, wenn die Website mit einem API-Schlüssel auf Vercel bereitgestellt wurde (siehe DEPLOY_INSTRUCTIONS.md). Sie können unten weiterhin das Original-PDF öffnen.",
    "translate.truncatedNote": "Dieses Dokument ist lang \u2014 es wird nur eine Übersetzung des ersten Abschnitts angezeigt.",
    "home.heroTitle": "Nachhaltige Finanztaxonomien weltweit entdecken",
    "home.heroSub": "Wählen Sie ein Land auf der Karte, oder nutzen Sie die Suchleiste unten.",
    "home.chipAllRegions": "Alle Regionen", "home.chipEurope": "Europa", "home.chipAsiaPacific": "Asien-Pazifik",
    "home.chipAmericas": "Amerika", "home.chipAfrica": "Afrika", "home.chipMiddleEast": "Naher Osten",
    "home.chipAllStatuses": "Alle Status", "home.chipDeveloped": "Etabliert",
    "home.chipUnderDevelopment": "In Entwicklung", "home.chipNoTaxonomy": "Keine Taxonomie",
    "home.globalStats": "Globale Statistiken", "home.totalCountriesTracked": "Erfasste Länder insgesamt",
    "home.recentlyUpdated": "Kürzlich aktualisiert", "home.askAi": "KI fragen",
    "about.missionHeading": "Über die Plattform",
    "about.missionText": "Taxonomien für nachhaltige Finanzen — die Regelwerke, die festlegen, welche Wirtschaftstätigkeiten als \"grün\" oder \"nachhaltig\" gelten — vermehren sich rasant, sind aber über Dutzende Regierungswebsites, PDFs und Sprachen verstreut. Wer die EU-Taxonomie mit Koreas K-Taxonomy vergleichen oder prüfen möchte, ob eine bestimmte Aktivität irgendwo abgedeckt ist, muss dies mühsam von Hand zusammensetzen. Diese Plattform bringt diese Informationen an einem interaktiven Ort zusammen: eine Karte des aktuellen Stands der Taxonomien, Vergleiche nebeneinander, direkte Links zu den offiziellen Originaldokumenten und einen KI-Berater für konkrete Fragen — damit Aufsichtsbehörden, Investoren und Unternehmen sich schneller und mit weniger blinden Flecken zurechtfinden.",
    "about.featurePill1": "Interaktive Weltkarte", "about.featurePill2": "KI-Taxonomie-Berater",
    "about.featurePill3": "Medien- und Trend-Hub", "about.featurePill4": "Direktvergleich",
    "about.featurePill5": "Offizielle Quelldokumente",
    "about.teamHeading": "Plattform-Team", "about.coreDeveloper": "Kernentwicklerin",
    "about.supervisorRole": "Betreuerin · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "Über BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS ist eine in Seoul ansässige \"Beyond Net Zero\"-Unternehmensgruppe, die in Beratung, politischem Think-Tank und Klimatech-Investitionen tätig ist. Das Unternehmen war direkt an der Gestaltung wichtiger koreanischer Klimapolitik beteiligt, einschließlich des K-ETS (Emissionshandelssystem) und der K-Taxonomy selbst, und berät Finanzinstitute, Industrie und Regierung zu Net-Zero-Strategie, Nachhaltigkeitsberichterstattung und grüner Finanzierung. Diese Plattform ist Teil der neueren AI-Centre-Initiative von BNZ PARTNERS — der Einsatz von KI, um Taxonomien für nachhaltige Finanzen leichter navigierbar, vergleichbar und umsetzbar zu machen, aufbauend auf der bestehenden K-Taxonomy-Politikarbeit des Unternehmens.",
    "about.contactHeading": "Fragen, Feedback oder Interesse an einer Zusammenarbeit?",
    "about.contactSub": "Nehmen Sie Kontakt auf, oder abonnieren Sie Updates, während diese Plattform wächst.",
    "about.contactUs": "Kontaktieren Sie uns",
    "subscribe.heading": "Den wöchentlichen Newsletter abonnieren",
    "subscribe.lede": "Erhalten Sie eine wöchentliche Zusammenfassung von Taxonomie-Neuigkeiten, Berichten und KI-Trendeinblicken direkt in Ihr Postfach. Nur Ihre E-Mail-Adresse ist erforderlich — alles andere ist optional.",
    "subscribe.sampleBanner": "Dieses Formular fügt Abonnenten zu einer echten Brevo-Mailingliste hinzu, sobald die Website mit einem Brevo-API-Schlüssel bereitgestellt wird (siehe DEPLOY_INSTRUCTIONS.md). Der tatsächliche Versand des wöchentlichen Newsletters erfolgt weiterhin manuell über das Brevo-Dashboard — dieses Formular übernimmt nur die Anmeldungen.",
    "subscribe.emailLabel": "E-Mail-Adresse", "subscribe.nameLabel": "Name", "subscribe.optional": "(optional)",
    "subscribe.interestLabel": "Interessengebiet", "subscribe.interestEu": "EU-Taxonomie-Updates",
    "subscribe.interestApac": "Asien-Pazifik-Taxonomien", "subscribe.interestGreenBonds": "Grüne Anleihen & Finanzen",
    "subscribe.interestCompliance": "Compliance & Prüfung", "subscribe.langLabel": "Sprachpräferenz",
    "subscribe.consentComms": "Ich stimme zu, den wöchentlichen Newsletter und gelegentliche Plattform-Updates von Global Sustainable Taxonomies / BNZ Partners zu erhalten.",
    "subscribe.consentPrivacy": "Ich habe die Datenschutzerklärung gelesen und akzeptiere sie und stimme zu, dass meine Daten gemäß DSGVO (EU) und PIPA (Südkorea) verarbeitet werden.",
    "subscribe.submitBtn": "Kostenlos abonnieren",
    "subscribe.privacyNote": "Wir verwenden Ihre E-Mail nur, um den von Ihnen abonnierten Newsletter zu versenden — sie wird in unserer Brevo-Mailingliste gespeichert und weder verkauft noch weitergegeben. Sie können sich jederzeit über den (nicht funktionsfähigen) Einstellungslink unten \"abmelden\".",
    "subscribe.managePrefs": "Ihre Einstellungen verwalten", "subscribe.backToMedia": "Zurück zum Medien-Hub",
    "subscribe.benefit1Title": "Wöchentlicher Newsletter", "subscribe.benefit1Text": "Eine prägnante Montagmorgen-Zusammenfassung der Taxonomie-Neuigkeiten, Berichte und regulatorischen Updates der Woche.",
    "subscribe.benefit2Title": "Plattform-Benachrichtigungen", "subscribe.benefit2Text": "Erfahren Sie als Erste(r), wenn sich der Taxonomie-Status eines Landes ändert oder ein neues offizielles Dokument veröffentlicht wird.",
    "subscribe.benefit3Title": "BNZ PARTNERS Einblicke", "subscribe.benefit3Text": "Gelegentliche Analysebeiträge des BNZ Partners AI Centre zu neu aufkommenden Taxonomie- und Compliance-Themen.",
    "subscribe.benefit4Title": "Veranstaltungseinladungen", "subscribe.benefit4Text": "Einladungen zu Webinaren, Podiumsdiskussionen und Briefings zu Taxonomien für nachhaltige Finanzen weltweit.",
    "prefs.heading": "Abonnenteneinstellungen", "prefs.lede": "Verwalten Sie Ihre Newsletter-Themen, Sprache und Kommunikationseinstellungen.",
    "prefs.sampleBanner": "Demo-Einstellungszentrale — nur zur Veranschaulichung. Hinter dieser Seite steht kein echtes Abonnentenkonto, daher wird hier nichts gespeichert, und die Felder werden mit Beispieldaten vorausgefüllt angezeigt. Im echten Produkt würden bestehende Abonnenten hier landen, nachdem sie auf einen Link in ihrer Newsletter-E-Mail geklickt haben.",
    "prefs.saveBtn": "Einstellungen speichern (Demo — deaktiviert)",
    "prefs.privacyNote": "Dieser Bildschirm ist ein nicht funktionsfähiger Platzhalter. Um Ihre Interessen oder Ihre Sprache künftig tatsächlich zu ändern, würden Sie eine Seite wie diese verwenden, aber sie ist noch nicht mit einer echten Abonnentendatenbank verbunden.",
    "prefs.unsubscribeLink": "Abmelden (Demo — deaktiviert)", "prefs.backToSubscribe": "Zurück zu Abonnieren",
    "media.heading": "Globaler Medien- und Trend-Hub", "media.lede": "Taxonomiebezogene Medien und KI-generierte Trendeinblicke an einem Ort.",
    "media.sampleBanner": "Beispielinhalt nur zu Demonstrationszwecken — es ist kein Live-Medienfeed verbunden. Das Taxonomie-Entwicklungs-Zeitachsen-Diagramm unten basiert auf echten Daten; alles andere auf dieser Seite ist illustrativer Platzhalterinhalt.",
    "media.filterAll": "Alle", "media.filterNews": "Nachrichten", "media.filterReports": "Berichte",
    "media.filterVideos": "Videos", "media.filterPapers": "Fachartikel", "media.filterPodcasts": "Podcasts",
    "media.searchPlaceholder": "Medien durchsuchen…", "media.trendLabel": "KI-Trendeinblicke (Beispiel)",
    "media.timelineHeading": "Zeitachse der Taxonomieentwicklung",
    "media.timelineNote": "Echte Daten — Anzahl der pro Jahr veröffentlichten Taxonomien, aus dem zusammengestellten Datensatz.",
    "media.thematicHeading": "Thematische Politiktrends",
    "media.thematicNote": "Illustrative Gewichtung nur zu Demonstrationszwecken — nicht anhand des tatsächlichen Medienvolumens gemessen.",
    "media.ctaHeading": "Den wöchentlichen Taxonomie-Newsletter erhalten",
    "media.ctaText": "Eine wöchentliche Zusammenfassung von Taxonomie-Neuigkeiten, Berichten und Trendeinblicken — kostenlos.",
    "media.ctaBtn": "Kostenlos abonnieren",
    "country.backToMap": "Zurück zur Karte"
  },
  ja: {
    "nav.map": "インタラクティブ・グローバルマップ", "nav.advisor": "AIアドバイザー", "nav.media": "メディアハブ",
    "nav.subscribe": "登録", "nav.resources": "リソース", "nav.about": "サイトについて",
    "nav.comingSoon": "近日公開", "nav.toggleTheme": "テーマ切替", "nav.search": "検索",
    "footer.developedBy": "開発", "footer.supervisedBy": "監修", "footer.headOfAI": "Head of AI Centre",
    "search.placeholder": "国、タクソノミー、規制当局で検索…", "search.noMatches": "該当なし",
    "search.title": "検索", "search.close": "閉じる",
    "translate.button": "翻訳", "translate.modalTitle": "翻訳された文書",
    "translate.loading": "文書を翻訳中\u2026",
    "translate.disclaimer": "公式文書の機械翻訳であり、参考情報です \u2014 法的または規制遵守の目的では常に原文をご確認ください。",
    "translate.viewOriginal": "元のPDFを見る \u2197", "translate.close": "閉じる",
    "translate.errorGeneric": "現在この文書を翻訳できませんでした。",
    "translate.errorNotDeployed": "翻訳機能にはライブのサイトバックエンドが必要ですが、ここでは接続されていません — この機能はサイトがAPIキー付きでVercelにデプロイされた後にのみ動作します（DEPLOY_INSTRUCTIONS.mdを参照）。下の元のPDFは引き続き開くことができます。",
    "translate.truncatedNote": "この文書は長いため、最初の部分のみの翻訳を表示しています。",
    "home.heroTitle": "世界のサステナブルファイナンス・タクソノミーを探る",
    "home.heroSub": "地図から国を選択するか、下の検索バーをご利用ください。",
    "home.chipAllRegions": "すべての地域", "home.chipEurope": "ヨーロッパ", "home.chipAsiaPacific": "アジア太平洋",
    "home.chipAmericas": "南北アメリカ", "home.chipAfrica": "アフリカ", "home.chipMiddleEast": "中東",
    "home.chipAllStatuses": "すべてのステータス", "home.chipDeveloped": "整備済み",
    "home.chipUnderDevelopment": "開発中", "home.chipNoTaxonomy": "タクソノミーなし",
    "home.globalStats": "グローバル統計", "home.totalCountriesTracked": "追跡対象の総国数",
    "home.recentlyUpdated": "最近の更新", "home.askAi": "AIに質問",
    "about.missionHeading": "プラットフォームについて",
    "about.missionText": "どの経済活動が「グリーン」または「サステナブル」と見なされるかを定義するルールブックであるサステナブルファイナンス・タクソノミーは急速に増加していますが、数十もの政府ウェブサイト、PDF、言語に分散しています。EUタクソノミーと韓国のK-Taxonomyを比較したい人や、ある活動がどこかで対象となっているか確認したい人は、それを手作業でつなぎ合わせなければなりません。このプラットフォームは、その情報を一つのインタラクティブな場所に集約します。今日のタクソノミーの状況を示す地図、並列比較、公式原本文書への直接リンク、そして具体的な質問に答えるAIアドバイザーです。これにより、規制当局、投資家、企業がより速く、死角の少ない形でこの分野を進むことができます。",
    "about.featurePill1": "インタラクティブ・グローバルマップ", "about.featurePill2": "AIタクソノミー・アドバイザー",
    "about.featurePill3": "メディア・トレンドハブ", "about.featurePill4": "並列比較",
    "about.featurePill5": "公式ソース文書",
    "about.teamHeading": "プラットフォームチーム", "about.coreDeveloper": "コア開発者",
    "about.supervisorRole": "監修 · Head of AI Centre, BNZ PARTNERS",
    "about.bnzHeading": "BNZ PARTNERSについて",
    "about.bnzText": "BNZ PARTNERSは、アドバイザリー、政策シンクタンク、クライメートテック投資にまたがるソウル拠点の「Beyond Net Zero」ビジネスグループです。同社はK-ETS(排出量取引制度)やK-Taxonomy自体を含む韓国の主要な気候政策の設計に直接関与しており、金融機関、産業界、政府にネットゼロ戦略、サステナビリティ開示、グリーンファイナンスについて助言しています。このプラットフォームはBNZ PARTNERSの新しいAI Centreの取り組みの一環であり、同社の既存のK-Taxonomy政策業務を基盤として、AIを活用してサステナブルファイナンス・タクソノミーをより簡単に閲覧・比較・活用できるようにするものです。",
    "about.contactHeading": "ご質問、フィードバック、協業のご希望はありますか?",
    "about.contactSub": "お問い合わせいただくか、プラットフォームの成長に合わせた更新情報をご登録ください。",
    "about.contactUs": "お問い合わせ",
    "subscribe.heading": "週刊ダイジェストに登録する",
    "subscribe.lede": "タクソノミーに関するニュース、レポート、AIトレンドインサイトの週刊まとめを受信箱にお届けします。必要なのはメールアドレスのみで、他はすべて任意です。",
    "subscribe.sampleBanner": "このフォームは、サイトがBrevo APIキーでデプロイされると、実際のBrevoメーリングリストに購読者を追加します(DEPLOY_INSTRUCTIONS.md参照)。週刊ダイジェストの実際の送信は引き続きBrevoダッシュボードから手動で行う必要があります — このフォームは登録のみを処理します。",
    "subscribe.emailLabel": "メールアドレス", "subscribe.nameLabel": "お名前", "subscribe.optional": "(任意)",
    "subscribe.interestLabel": "関心分野", "subscribe.interestEu": "EUタクソノミーの更新情報",
    "subscribe.interestApac": "アジア太平洋のタクソノミー", "subscribe.interestGreenBonds": "グリーンボンド・金融",
    "subscribe.interestCompliance": "コンプライアンス・保証", "subscribe.langLabel": "言語設定",
    "subscribe.consentComms": "Global Sustainable Taxonomies / BNZ Partnersから週刊ダイジェストと随時のプラットフォーム更新情報を受け取ることに同意します。",
    "subscribe.consentPrivacy": "プライバシーポリシーを読み、同意します。また、GDPR(EU)およびPIPA(韓国)に従って自分のデータが処理されることに同意します。",
    "subscribe.submitBtn": "無料で登録する",
    "subscribe.privacyNote": "お客様のメールアドレスは、登録いただいたダイジェストの送信にのみ使用されます — Brevoメーリングリストに保存され、販売または共有されることはありません。以下の(機能しない)設定リンクからいつでも「登録解除」できます。",
    "subscribe.managePrefs": "設定を管理する", "subscribe.backToMedia": "メディアハブに戻る",
    "subscribe.benefit1Title": "週刊ダイジェスト", "subscribe.benefit1Text": "その週のタクソノミーに関するニュース、レポート、規制の更新情報を月曜朝に簡潔にまとめてお届けします。",
    "subscribe.benefit2Title": "プラットフォームアラート", "subscribe.benefit2Text": "国のタクソノミーのステータスが変わったとき、または新しい公式文書が公開されたときにいち早くお知らせします。",
    "subscribe.benefit3Title": "BNZ PARTNERSインサイト", "subscribe.benefit3Text": "BNZ Partners AI Centreによる、新たなタクソノミーおよびコンプライアンステーマに関する分析コンテンツを不定期にお届けします。",
    "subscribe.benefit4Title": "イベント招待", "subscribe.benefit4Text": "世界のサステナブルファイナンス・タクソノミーに関するウェビナー、パネルディスカッション、ブリーフィングへの招待。",
    "prefs.heading": "購読者設定", "prefs.lede": "ダイジェストのトピック、言語、コミュニケーション設定を管理します。",
    "prefs.sampleBanner": "デモ設定センター — あくまで例示目的です。このページの背後には実際の購読者アカウントは存在しないため、ここでの内容は保存されず、フィールドにはサンプルデータがあらかじめ入力されています。実際の製品では、既存の購読者はダイジェストメール内のリンクをクリックした後にここに到達します。",
    "prefs.saveBtn": "設定を保存 (デモ — 無効)",
    "prefs.privacyNote": "この画面は機能しないプレースホルダーです。今後、関心事項や言語を実際に変更するにはこのようなページを使用しますが、まだ実際の購読者データベースには接続されていません。",
    "prefs.unsubscribeLink": "登録解除 (デモ — 無効)", "prefs.backToSubscribe": "登録ページに戻る",
    "media.heading": "グローバル・メディア&トレンドハブ", "media.lede": "タクソノミー関連のメディアとAI生成のトレンドインサイトを一箇所で。",
    "media.sampleBanner": "デモンストレーション目的のみのサンプルコンテンツです — ライブメディアフィードは接続されていません。以下のタクソノミー開発タイムラインのグラフは実データに基づいて作成されていますが、このページの他の内容はすべて例示的なプレースホルダーコンテンツです。",
    "media.filterAll": "すべて", "media.filterNews": "ニュース", "media.filterReports": "レポート",
    "media.filterVideos": "動画", "media.filterPapers": "論文", "media.filterPodcasts": "ポッドキャスト",
    "media.searchPlaceholder": "メディアを検索…", "media.trendLabel": "AIトレンドインサイト(サンプル)",
    "media.timelineHeading": "タクソノミー発展のタイムライン",
    "media.timelineNote": "実データ — 編集されたデータセットに基づく年間発表タクソノミー数。",
    "media.thematicHeading": "テーマ別政策トレンド",
    "media.thematicNote": "デモンストレーション用の例示的な重み付けです — 実際のメディア量に基づいて測定されたものではありません。",
    "media.ctaHeading": "週刊タクソノミーダイジェストを受け取る",
    "media.ctaText": "タクソノミーニュース、レポート、トレンドインサイトの週刊まとめ — 無料。",
    "media.ctaBtn": "無料で登録する",
    "country.backToMap": "地図に戻る"
  },
  zh: {
    "nav.map": "全球互动地图", "nav.advisor": "AI 顾问", "nav.media": "媒体中心",
    "nav.subscribe": "订阅", "nav.resources": "资源", "nav.about": "关于我们",
    "nav.comingSoon": "即将推出", "nav.toggleTheme": "切换主题", "nav.search": "搜索",
    "footer.developedBy": "开发者", "footer.supervisedBy": "指导", "footer.headOfAI": "Head of AI Centre",
    "search.placeholder": "按国家、分类标准或监管机构搜索…", "search.noMatches": "无匹配结果",
    "search.title": "搜索", "search.close": "关闭",
    "translate.button": "翻译", "translate.modalTitle": "翻译文档",
    "translate.loading": "正在翻译此文档\u2026",
    "translate.disclaimer": "官方文档的机器翻译，仅供参考——法律或合规目的请始终参阅原文。",
    "translate.viewOriginal": "查看原始PDF \u2197", "translate.close": "关闭",
    "translate.errorGeneric": "目前无法翻译此文档。",
    "translate.errorNotDeployed": "翻译功能需要网站的实时后端支持，但此处尚未连接——只有在网站部署到 Vercel 并配置 API 密钥后才能使用（请参阅 DEPLOY_INSTRUCTIONS.md）。您仍然可以打开下方的原始 PDF。",
    "translate.truncatedNote": "此文档较长——仅显示前半部分的翻译。",
    "home.heroTitle": "探索全球可持续金融分类标准",
    "home.heroSub": "在地图上选择一个国家，或使用下方的搜索栏。",
    "home.chipAllRegions": "所有地区", "home.chipEurope": "欧洲", "home.chipAsiaPacific": "亚太地区",
    "home.chipAmericas": "美洲", "home.chipAfrica": "非洲", "home.chipMiddleEast": "中东",
    "home.chipAllStatuses": "所有状态", "home.chipDeveloped": "已建立",
    "home.chipUnderDevelopment": "开发中", "home.chipNoTaxonomy": "无分类标准",
    "home.globalStats": "全球统计", "home.totalCountriesTracked": "追踪国家总数",
    "home.recentlyUpdated": "最近更新", "home.askAi": "咨询 AI",
    "about.missionHeading": "关于本平台",
    "about.missionText": "可持续金融分类标准——定义哪些经济活动可被视为\"绿色\"或\"可持续\"的规则手册——正在迅速增加，但分散在数十个政府网站、PDF文件和不同语言中。任何想要比较欧盟分类标准与韩国K-Taxonomy，或想确认某项活动是否在任何地方被涵盖的人，都必须手动拼凑信息。本平台将这些信息汇集到一个互动空间中：一张展示当前各分类标准现状的地图、并排比较、指向官方原始文件的直接链接，以及一个可回答具体问题的AI顾问——让监管机构、投资者和企业能够更快、更少盲点地了解这一领域。",
    "about.featurePill1": "全球互动地图", "about.featurePill2": "AI 分类标准顾问",
    "about.featurePill3": "媒体与趋势中心", "about.featurePill4": "并排比较",
    "about.featurePill5": "官方原始文件",
    "about.teamHeading": "平台团队", "about.coreDeveloper": "核心开发者",
    "about.supervisorRole": "指导 · BNZ PARTNERS AI 中心负责人",
    "about.bnzHeading": "关于 BNZ PARTNERS",
    "about.bnzText": "BNZ PARTNERS是一家总部位于首尔的\"超越净零\"业务集团，业务涵盖咨询、政策智库和气候科技投资。该公司直接参与设计了韩国的主要气候政策，包括K-ETS(排放交易体系)和K-Taxonomy本身，并就净零战略、可持续性披露和绿色金融为金融机构、产业界和政府提供咨询。本平台是BNZ PARTNERS新成立的AI中心计划的一部分——运用AI技术，在公司现有K-Taxonomy政策工作的基础上，让可持续金融分类标准更易于浏览、比较和应用。",
    "about.contactHeading": "有疑问、反馈，或想合作？",
    "about.contactSub": "欢迎联系我们，或订阅以随平台发展获取更新。",
    "about.contactUs": "联系我们",
    "subscribe.heading": "订阅每周简报",
    "subscribe.lede": "将分类标准新闻、报告和AI趋势洞察的每周摘要直接发送到您的收件箱。只需提供电子邮箱地址——其他均为可选项。",
    "subscribe.sampleBanner": "一旦网站部署了Brevo API密钥（参见DEPLOY_INSTRUCTIONS.md），此表单将把订阅者添加到真实的Brevo邮件列表中。每周简报的实际发送仍需从Brevo仪表板手动完成——此表单仅处理注册。",
    "subscribe.emailLabel": "电子邮箱", "subscribe.nameLabel": "姓名", "subscribe.optional": "（可选）",
    "subscribe.interestLabel": "兴趣领域", "subscribe.interestEu": "欧盟分类标准更新",
    "subscribe.interestApac": "亚太分类标准", "subscribe.interestGreenBonds": "绿色债券与金融",
    "subscribe.interestCompliance": "合规与鉴证", "subscribe.langLabel": "语言偏好",
    "subscribe.consentComms": "我同意接收来自Global Sustainable Taxonomies / BNZ Partners的每周简报和偶尔的平台更新。",
    "subscribe.consentPrivacy": "我已阅读并接受隐私政策，并同意我的数据按照GDPR（欧盟）和PIPA（韩国）的要求进行处理。",
    "subscribe.submitBtn": "免费订阅",
    "subscribe.privacyNote": "我们仅使用您的电子邮箱发送您注册的简报——它存储在我们的Brevo邮件列表中，不会被出售或分享。您可以随时通过下方（暂未启用的）偏好设置链接\"取消订阅\"。",
    "subscribe.managePrefs": "管理您的偏好设置", "subscribe.backToMedia": "返回媒体中心",
    "subscribe.benefit1Title": "每周简报", "subscribe.benefit1Text": "在每周一早晨简洁汇总本周的分类标准新闻、报告和监管更新。",
    "subscribe.benefit2Title": "平台提醒", "subscribe.benefit2Text": "当某国的分类标准状态发生变化，或发布新的官方文件时，第一时间通知您。",
    "subscribe.benefit3Title": "BNZ PARTNERS 洞察", "subscribe.benefit3Text": "来自BNZ Partners AI中心关于新兴分类标准和合规主题的不定期分析文章。",
    "subscribe.benefit4Title": "活动邀请", "subscribe.benefit4Text": "邀请您参加关于全球可持续金融分类标准的网络研讨会、小组讨论和简报会。",
    "prefs.heading": "订阅者偏好设置", "prefs.lede": "管理您的简报主题、语言和沟通设置。",
    "prefs.sampleBanner": "演示用偏好设置中心——仅供说明之用。此页面背后没有真实的订阅者账户，因此这里的任何内容都不会被保存，各字段显示的是预填的示例数据。在实际产品中，现有订阅者点击简报邮件中的链接后会进入此页面。",
    "prefs.saveBtn": "保存偏好设置（演示——已禁用）",
    "prefs.privacyNote": "此屏幕是一个不起作用的占位符。将来要真正更改您的兴趣或语言，您会使用类似这样的页面，但目前尚未连接到真实的订阅者数据库。",
    "prefs.unsubscribeLink": "取消订阅（演示——已禁用）", "prefs.backToSubscribe": "返回订阅页面",
    "media.heading": "全球媒体与趋势中心", "media.lede": "分类标准相关媒体与AI生成的趋势洞察，尽在一处。",
    "media.sampleBanner": "仅供演示的示例内容——未连接实时媒体源。下方的分类标准发展时间线图表基于真实数据构建；本页面其他内容均为示例性占位内容。",
    "media.filterAll": "全部", "media.filterNews": "新闻", "media.filterReports": "报告",
    "media.filterVideos": "视频", "media.filterPapers": "论文", "media.filterPodcasts": "播客",
    "media.searchPlaceholder": "搜索媒体…", "media.trendLabel": "AI 趋势洞察（示例）",
    "media.timelineHeading": "分类标准发展时间线",
    "media.timelineNote": "真实数据——根据汇编数据集，按年份统计已发布的分类标准数量。",
    "media.thematicHeading": "主题政策趋势",
    "media.thematicNote": "仅供演示的示例性权重——并非根据真实媒体量测算。",
    "media.ctaHeading": "获取每周分类标准简报",
    "media.ctaText": "分类标准新闻、报告和趋势洞察的每周摘要——免费。",
    "media.ctaBtn": "免费订阅",
    "country.backToMap": "返回地图"
  }
};

let gstCurrentLang = "en";

function gstT(key) {
  return (GST_I18N[gstCurrentLang] && GST_I18N[gstCurrentLang][key] !== undefined)
    ? GST_I18N[gstCurrentLang][key]
    : (GST_I18N.en[key] !== undefined ? GST_I18N.en[key] : key);
}

function gstApplyI18n() {
  document.documentElement.lang = gstCurrentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = gstT(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = gstT(el.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const val = gstT(el.dataset.i18nTitle);
    el.title = val;
    if (el.hasAttribute("aria-label")) el.setAttribute("aria-label", val);
  });
}

function gstSetupLangSelector() {
  const sel = document.getElementById("globalLangSelect");
  if (!sel) return;
  sel.innerHTML = GST_LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join("");
  const saved = localStorage.getItem("gst-lang");
  if (saved && GST_I18N[saved]) gstCurrentLang = saved;
  sel.value = gstCurrentLang;
  sel.addEventListener("change", () => {
    gstCurrentLang = sel.value;
    localStorage.setItem("gst-lang", gstCurrentLang);
    gstApplyI18n();
  });
}

/* ---------- Global search (available from every page) ---------- */

function gstGetCountries() {
  if (!window.TAXONOMY_DATA) return [];
  return Object.keys(window.TAXONOMY_DATA).map(iso => ({ iso, entry: window.TAXONOMY_DATA[iso] }));
}

function gstOpenSearch() {
  const overlay = document.getElementById("globalSearchOverlay");
  if (!overlay) return;
  overlay.classList.add("open");
  const input = document.getElementById("globalSearchInput");
  input.value = "";
  document.getElementById("globalSearchResults").innerHTML = "";
  setTimeout(() => input.focus(), 10);
}

function gstCloseSearch() {
  const overlay = document.getElementById("globalSearchOverlay");
  if (overlay) overlay.classList.remove("open");
}

function gstRunSearch(query) {
  const resultsEl = document.getElementById("globalSearchResults");
  const q = query.trim().toLowerCase();
  if (!q) { resultsEl.innerHTML = ""; return; }

  const matches = gstGetCountries().filter(({ entry, iso }) => {
    return (entry.name && entry.name.toLowerCase().includes(q)) ||
      (entry.taxonomy && entry.taxonomy.toLowerCase().includes(q)) ||
      (entry.regulator && entry.regulator.toLowerCase().includes(q)) ||
      iso.toLowerCase().includes(q);
  }).slice(0, 8);

  if (!matches.length) {
    resultsEl.innerHTML = `<div class="search-empty">${gstT("search.noMatches")}</div>`;
    return;
  }

  resultsEl.innerHTML = matches.map(({ iso, entry }) => `
    <a class="search-result-item" href="country.html?iso=${iso}">
      <span class="sr-name">${entry.name}</span>
      <span class="sr-sub">${entry.taxonomy || ""}</span>
    </a>
  `).join("");
}

function gstSetupGlobalSearch() {
  const btn = document.getElementById("globalSearchBtn");
  const overlay = document.getElementById("globalSearchOverlay");
  if (!btn || !overlay) return;

  btn.addEventListener("click", gstOpenSearch);
  overlay.addEventListener("click", e => { if (e.target === overlay) gstCloseSearch(); });
  document.getElementById("globalSearchCloseBtn").addEventListener("click", gstCloseSearch);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("open")) gstCloseSearch();
  });
  document.getElementById("globalSearchInput").addEventListener("input", e => gstRunSearch(e.target.value));
}

function gstInit() {
  const saved = localStorage.getItem("gst-lang");
  if (saved && GST_I18N[saved]) gstCurrentLang = saved;
  gstSetupLangSelector();
  gstApplyI18n();
  gstSetupGlobalSearch();
}

document.addEventListener("DOMContentLoaded", gstInit);
