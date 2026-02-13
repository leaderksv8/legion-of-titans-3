export type Locale = "uk" | "en";

export const nav = {
  uk: [
    // Absolute hash links so navigation works correctly from sub-routes (e.g., /thanks, /stories).
    { label: "Діяльність", href: "/#activity" },
    { label: "Наша команда", href: "/#team" },
    { label: "У центрі подій", href: "/#events" },
    { label: "Звʼязок з нами", href: "/#contact" },
  ],
  en: [
    { label: "Activities", href: "/#activity" },
    { label: "Team", href: "/#team" },
    { label: "In focus", href: "/#events" },
    { label: "Contacts", href: "/#contact" },
  ],
};

export const hero = {
  uk: {
    org: "ГРОМАДСЬКА ОРГАНІЗАЦІЯ «ЛЕГІОН ТИТАНІВ»",
    suborg: "ВЕТЕРАНИ ВІЙНИ З ОБМЕЖЕНИМИ МОЖЛИВОСТЯМИ БУЧАНСЬКОГО РАЙОНУ",
    mission:
      "Ми об'єднуємо тих, хто захищав країну, для взаємодопомоги та адаптації до мирного життя.",
    statementTop: "Ми не реагуємо на реальність.",
    statementBottom: "Ми її формуємо.",
    ctaPrimary: "Отримати допомогу",
    ctaSecondary: "→ Наша діяльність",
    proof: "Працюємо для результату, не для шуму.",
  },
  en: {
    org: "CIVIC ORGANIZATION “LEGION OF TITANS”",
    suborg: "WAR VETERANS WITH DISABILITIES — BUCHA DISTRICT",
    mission:
      "We unite those who defended the country to support each other and adapt to civilian life.",
    statementTop: "We don’t react to reality.",
    statementBottom: "We shape it.",
    ctaPrimary: "Request support",
    ctaSecondary: "→ Our activities",
    proof: "Built on outcomes, not noise.",
  },
};

export const activity = {
  uk: {
    title: "Наша діяльність",
    subtitle: "6 напрямів підтримки ветеранів",
    cards: [
      {
        title: "Допомога з документами",
        desc:
          "Координаційна допомога в роботі з документами. Направляємо ветеранів до профільних спеціалістів і партнерських організацій для розв'язання питань соціального захисту.",
      },
      {
        title: "Юридична допомога",
        desc:
          "Юридична навігація. Забезпечуємо зв'язок із фаховими юристами та партнерськими мережами для отримання безоплатних консультацій та правового захисту ветеранів.",
      },
      {
        title: "Медична реабілітація",
        desc:
          "Координація оздоровлення. Виступаємо ланкою між ветеранами та спеціалізованими фондами чи реабілітаційними центрами для організації ефективного відновлення.",
      },
      {
        title: "Проведення дозвілля",
        desc:
          "Ветеранська єдність. Створюємо простір для спілкування побратимів, координуючи спільні заходи, культурні проєкти та зустрічі для зміцнення бойового духу.",
      },
      {
        title: "Навчальні програми",
        desc:
          "Доступ до нових навичок. Направляємо ветеранів до сертифікованих інструкторів для освоєння сучасних технологій, керування БпЛА та програм перекваліфікації.",
      },
      {
        title: "Міжнародні проєкти",
        desc:
          "Міжнародне представництво. Співпрацюємо із закордонними компаніями та дипломатичними місіями, залучаючи світову підтримку для реалізації спільних ініціатив.",
      },
    ],
  },
  en: {
    title: "Our activities",
    subtitle: "Six directions of veteran support",
    cards: [
      { title: "Document support", desc: "Coordination help with documents. We route veterans to specialists and partner organizations for social protection matters." },
      { title: "Legal support", desc: "Legal navigation. We connect veterans to qualified lawyers and partner networks for free consultations and protection." },
      { title: "Medical rehabilitation", desc: "Recovery coordination. We bridge veterans with funds and rehab centers to organize effective restoration." },
      { title: "Community & leisure", desc: "Veteran unity. We create space for communication and coordinate events to strengthen morale." },
      { title: "Training programs", desc: "Access to skills. We route veterans to certified instructors for tech, UAV operation, and reskilling programs." },
      { title: "International projects", desc: "International representation. We cooperate with foreign companies and missions to attract support for joint initiatives." },
    ],
  },
};

export const achievements = {
  uk: { title: "Наші досягнення", subtitle: "Факти і цифри", stats: [
    { k: "73", v: "ветеранів отримали допомогу" },
    { k: "23", v: "заходів проведено" },
    { k: "115", v: "консультацій" },
    { k: "13", v: "відправлено на реабілітації" },
    { k: "97", v: "інша допомога" },
  ]},
  en: { title: "Achievements", subtitle: "Facts & numbers", stats: [
    { k: "73", v: "veterans supported" },
    { k: "23", v: "events held" },
    { k: "115", v: "consultations" },
    { k: "13", v: "sent to rehabilitation" },
    { k: "97", v: "other support actions" },
  ]},
};

export const heroes = {
  uk: { 
    title: "Подяки", 
    subtitle: "Слова, які мають значення", 
    archiveLabel: "Архів подяк →",
    noItems: "Поки що немає опублікованих матеріалів. Ви можете надіслати подяку — після модерації вона з'явиться тут.",
    loading: "Завантаження…",
    modal: {
      title: "Надіслати подяку",
      label: "Надсилання",
      nameLabel: "Ім'я / позивний (необов'язково)",
      namePlaceholder: "Наприклад: Андрій, Титан…",
      emailLabel: "Email (необов'язково)",
      messageLabel: "Текст (обов'язково)",
      messagePlaceholder: "Напишіть вашу подяку…",
      consentText: "Я надаю згоду ГО «ЛЕГІОН ТИТАНІВ» на обробку персональних даних з метою розгляду мого звернення та (за потреби) публікації відгуку/подяки на сайті відповідно до Політики конфіденційності. Ми не збираємо прихованих даних — ви передаєте лише те, що вводите у форму. Просимо не вказувати надлишкові персональні дані (паспорт, ІПН, банківські реквізити тощо). Згоду можна відкликати, звернувшись на ngo@legion-of-titans.org.",
      footerNote: "Публікація відбувається лише після модерації.",
      sending: "Надсилаємо…",
      send: "Надіслати",
      cancel: "Скасувати",
      sent: "Дякуємо. Повідомлення надіслано на модерацію.",
      noConsent: "Потрібно підтвердити згоду на обробку даних.",
      tooShort: "Текст занадто короткий.",
      rateLimit: "Занадто багато спроб. Спробуйте пізніше.",
      error: "Не вдалося надіслати. Спробуйте ще раз.",
      anonymous: "Анонімна подяка",
    },
    items: [
      { name: "Ветеран (анонімно)", place: "Бучанський район", text: "Дякую команді за навігацію по документах та підтримку. Все стало зрозуміло, а процес — реальним." },
      { name: "Ветеран (анонімно)", place: "Київщина", text: "Допомогли швидко знайти потрібних спеціалістів і закрити питання з юридичними документами." },
      { name: "Ветеран (анонімно)", place: "Буча", text: "Організували контакт з реабілітаційним центром. Це повернуло мені віру в нормальне життя." },
    ],
  },
  en: { 
    title: "Thanks", 
    subtitle: "Words that matter", 
    archiveLabel: "Thanks archive →",
    noItems: "No published materials yet. You can send thanks — after moderation it will appear here.",
    loading: "Loading…",
    modal: {
      title: "Send thanks",
      label: "Submission",
      nameLabel: "Name / callsign (optional)",
      namePlaceholder: "E.g.: Andrew, Titan…",
      emailLabel: "Email (optional)",
      messageLabel: "Message (required)",
      messagePlaceholder: "Write your thanks…",
      consentText: "I consent to the processing of my personal data by NGO Legion of Titans for review and (if needed) publication on the website in accordance with the Privacy Policy. We do not collect hidden data — you only share what you enter in the form. Please do not provide excessive personal data (passport, ID, bank details, etc.). You can withdraw consent by contacting ngo@legion-of-titans.org.",
      footerNote: "Publication only happens after moderation.",
      sending: "Sending…",
      send: "Send",
      cancel: "Cancel",
      sent: "Thank you. Message sent for moderation.",
      noConsent: "You must confirm consent to process data.",
      tooShort: "Text is too short.",
      rateLimit: "Too many attempts. Try later.",
      error: "Failed to send. Try again.",
      anonymous: "Anonymous thanks",
    },
    items: [
      { name: "Veteran (anonymous)", place: "Bucha district", text: "Thank you for guidance with documents and support. The process became clear and realistic." },
      { name: "Veteran (anonymous)", place: "Kyiv region", text: "They connected me to the right specialists and helped with legal matters." },
      { name: "Veteran (anonymous)", place: "Bucha", text: "They organized a rehab contact. It brought back hope for normal life." },
    ],
  },
};

export const news = {
  uk: {
    title: "Останні новини",
    subtitle: "Україна — коротко і по суті",
    topLabel: "ТОП 4 — Україна",
    editorLabel: "Редакційний добір",
    top: [
      {
        id: 1,
        title: "Офіційні зведення: ключові події доби",
        summary: "Стислий огляд найважливішого з підтверджених джерел.",
        source: "Офіційні канали",
        time: "сьогодні",
        url: "https://www.president.gov.ua/",
      },
      {
        id: 2,
        title: "Підтримка ветеранів: нові програми та ініціативи",
        summary: "Оновлення державних та партнерських програм підтримки.",
        source: "Мінветеранів",
        time: "сьогодні",
        url: "https://mva.gov.ua/",
      },
      {
        id: 3,
        title: "Безпековий блок: заяви та підтверджені дані",
        summary: "Тільки перевірена інформація без чуток і шуму.",
        source: "МО України",
        time: "вчора",
        url: "https://www.mil.gov.ua/",
      },
      {
        id: 4,
        title: "Гуманітарні новини: допомога та відновлення",
        summary: "Коротка хроніка ключових гуманітарних подій.",
        source: "Укрінформ",
        time: "вчора",
        url: "https://www.ukrinform.ua/",
      },
    ],
    manual: [
      {
        id: 1,
        title: "Новина ГО: важлива ініціатива тижня",
        summary: "Короткий опис нашої діяльності, який оновлюється вручну.",
        source: "ГО «Легіон Титанів»",
        time: "сьогодні",
        url: "/#news",
      },
      {
        id: 2,
        title: "Партнерський проєкт: спільна програма підтримки",
        summary: "Опис колаборації з партнерами або фондами.",
        source: "Партнери",
        time: "цього тижня",
        url: "/#news",
      },
      {
        id: 3,
        title: "Анонс події: зустріч або тренінг",
        summary: "Коротке повідомлення про найближчу подію.",
        source: "ГО «Легіон Титанів»",
        time: "цього місяця",
        url: "/#news",
      },
    ],
  },
  en: {
    title: "Latest news",
    subtitle: "Ukraine — short and to the point",
    topLabel: "Top 4 — Ukraine",
    editorLabel: "Editorial picks",
    top: [
      {
        id: 1,
        title: "Official briefings: key events of the day",
        summary: "Concise highlights from verified sources.",
        source: "Official channels",
        time: "today",
        url: "https://www.president.gov.ua/en",
      },
      {
        id: 2,
        title: "Veteran support: new programs and initiatives",
        summary: "Updates on public and partner support programs.",
        source: "Ministry for Veterans",
        time: "today",
        url: "https://mva.gov.ua/",
      },
      {
        id: 3,
        title: "Security updates: statements and verified facts",
        summary: "Verified information without noise.",
        source: "Ministry of Defence",
        time: "yesterday",
        url: "https://www.mil.gov.ua/en",
      },
      {
        id: 4,
        title: "Humanitarian updates: aid and recovery",
        summary: "A brief chronicle of key humanitarian events.",
        source: "Ukrinform",
        time: "yesterday",
        url: "https://www.ukrinform.net/",
      },
    ],
    manual: [
      {
        id: 1,
        title: "Organization news: initiative of the week",
        summary: "Short note about our activity, updated manually.",
        source: "Legion of Titans",
        time: "today",
        url: "/#news",
      },
      {
        id: 2,
        title: "Partner project: joint support program",
        summary: "A brief note about collaboration with partners.",
        source: "Partners",
        time: "this week",
        url: "/#news",
      },
      {
        id: 3,
        title: "Event announcement: meeting or training",
        summary: "Short announcement for the upcoming event.",
        source: "Legion of Titans",
        time: "this month",
        url: "/#news",
      },
    ],
  },
};

export const events = {
  uk: {
    title: "У центрі подій",
    subtitle: "Там, де присутність має значення",
    note: "Показуємо ключові події та партнерські ініціативи за участі ГО «Легіон Титанів».",
    items: [
      {
        id: 1,
        title: "БІЗНЕС-ФЕСТИВАЛЬ 4.5.0",
        date: "Жовтень 2025",
        folder: "4.5.0",
        cover: "/events/4.5.0/cover.webp",
        photos: 8,
        description: "Участь у бізнес-фестивалі для підтримки ветеранських ініціатив та розвитку партнерств.",
        details:
          "Представники ГО «Легіон Титанів» відвідали бізнес-фестиваль 4.5.0\n" +
          "11 жовтня представники громадської організації «Легіон Титанів» відвідали бізнес-фестивал «4.5.0», який об’єднав підприємців, локальних майстрів і представників ветеранських бізнесів громади Київщини.\n" +
          "Участь у заході стала можливістю для неформального спілкування, обміну досвідом та знайомства з проєктами, що працюють на перетині бізнесу, спільнот і відновлення. Для ГО «Легіон Титанів» такі запрошення є важливою частиною розвитку партнерств і присутності ветеранського голосу в економічних та суспільних процесах.",
      },
      {
        id: 2,
        title: "ТУРНІР З БОКСУ",
        date: "Грудень 2025",
        folder: "boxing",
        cover: "/events/boxing/cover.webp",
        photos: 4,
        description: "Спортивні змагання серед ветеранів для зміцнення духу та фізичної реабілітації.",
        details:
          "Представників ГО «Легіон Титанів» запросили як гостей на Всеукраїнський турнір з боксу серед ветеранів\n" +
          "Представники громадської організації «Легіон Титанів» відвідали як почесні гості перший в Україні Всеукраїнський турнір з боксу серед ветеранів війни, що відбувся у місті-герої Буча.\n" +
          "Турнір став знаковою подією для ветеранського спорту та об’єднав учасників з різних регіонів України — Києва, Київської області, Харківщини, Дніпропетровщини, Черкащини та прифронтових громад. Захід засвідчив високий рівень організації та активну роль Київщини у підтримці ветеранів і розвитку адаптивного спорту.",
      },
      {
        id: 3,
        title: "СХОДЖЕННЯ НА ГОВЕРЛУ",
        date: "Серпень 2025",
        folder: "hoverla",
        cover: "/events/hoverla/cover.webp",
        photos: 9,
        description: "Колективне сходження на найвищу вершину України разом із побратимами.",
        details:
          "Сходження на Говерлу разом із побратимами\n" +
          "Представники громадської організації «Легіон Титанів» долучилися до колективного сходження (50 чоловік) ветеранів громад Київщини на Говерлу 1 листопада 2025 року.\n" +
          "Подорож, спільнота і гори розкрили учасників. Саме в таких моментах народжується справжня команда та повертається відчуття життя. Для учасників це був спільний непростий шлях сходження, що об’єднав ветеранів Київщини, дав краще познайомитись, обмінятись досвідом і відчути себе «серед своїх».\n" +
          "Сходження проведено за підтримки Київської обласної військової адміністрації, Закарпатської обласної військової адміністрації, Богданської громади Закарпаття. Подяка ДСНС Закарпаття та Укрзалізниці, що супроводжували подію. Вона стала знаковим прикладом спільної міжрегіональної взаємодії, підтримки й командної роботи органів влади по реабілітації ветеранів.",
      },
      {
        id: 4,
        title: "ВСТАНОВЛЕННЯ РЕКОРДІВ",
        date: "Вересень 2025",
        folder: "records",
        cover: "/events/records/cover.webp",
        photos: 1,
        description: "Демонстрація сили та витривалості ветеранів через встановлення національних рекордів.",
        details:
          "Представники ГО «Легіон Титанів» стали учасниками колективного рекорду України після підйому на Говерлу\n" +
          "Представники громадської організації Легіон Титанів стали учасниками колективного рекорду України, встановленого під час сходження на Говерлу разом із ветеранською спільнотою Київщини.\n" +
          "1 листопада підйом на найвищу вершину України відбувся як символ підтримки, єдності та взаємної опори між ветеранами. Згодом ця ініціатива була офіційно зафіксована як рекорд України — сходження на Говерлу найбільшої групи ветеранів війни (50 учасників) з пораненнями та втратою кінцівок.\n" +
          "Учасники сходження, серед яких були й представники ГО «Легіон Титанів», були внесені до Книги рекордів України як частина спільної історичної події.",
      },
      {
        id: 5,
        title: "Пліч-о-пліч з ветеранами",
        date: "Жовтень 2025",
        folder: "Sidebyside",
        cover: "/events/Sidebyside/cover.webp",
        photos: 5,
        description: "Проєкт співпраці та підтримки побратимів у адаптації до цивільного життя.",
        details:
          "ГО «Легіон Титанів» долучилася до ветеранського форуму в Київській області\n" +
          "Громадська організація «Легіон Титанів» взяла участь у ветеранському форумі «Пліч-о-пліч з ветеранами», який відбувся 20 вересня у Київській області.\n" +
          "Форум став майданчиком для відкритого діалогу між ветеранами, представниками держави, місцевого самоврядування та громадянського суспільства. Захід об’єднав представників Уряду, Верховної Ради, державних і муніципальних структур, громадських та ветеранських організацій, бізнесу, медичної й реабілітаційної спільноти, а також самих ветеранів і членів їхніх родин.\n" +
          "У межах форуму відбулися три панельні дискусії, присвячені:\n" +
          "• державній політиці у сфері ветеранської підтримки;\n" +
          "• партнерству між ветеранами, громадами та бізнесом, зокрема питанням працевлаштування;\n" +
          "• ролі громадських ініціатив і волонтерів у формуванні системи допомоги ветеранам.\n" +
          "Участь у таких заходах є важливою складовою роботи ГО «Легіон Титанів», спрямованої на посилення ветеранської спільноти в громадах Київщини, розвиток міжсекторальної взаємодії та впровадження дієвих рішень для підтримки ветеранів і їхніх сімей.",
      },
      {
        id: 6,
        title: "ВІЗИТ ВЕТЕРАНІВ США НА КИЇВЩИНУ",
        date: "Листопад 2025",
        folder: "veteranUSA",
        cover: "/events/veteranUSA/cover.webp",
        photos: 7,
        description: "Міжнародна місія для обміну досвідом реабілітації та соціального захисту.",
        details:
          "11 листопада, в День Ветерана США — Київщина приймала американських ветеранів організацій TAPS International та Troops First Foundation, які прибули в Україну в межах візиту, організованого спільно з Міністерством у справах ветеранів України, Київською обласною військовою адміністрацією. В межах програми відбулася зустріч із міністеркою Наталією Калмиковою та головою КОДА Миколою Калашником, а також спілкування з українськими ветеранами Київщини, зокрема за участі представників ГО «Легіон Титанів».\n" +
          "Під час візиту сторони обговорили питання реабілітації, соціальної адаптації, ветеранських ініціатив і розвитку спільнот. Гості відвідали меморіал Янголи Перемоги у Мощуні та переглянули фільм «In Thanks We Trust» платформи Культурні сили. Зустріч стала прикладом живого діалогу й взаєморозуміння між ветеранами України та США, яких об’єднують спільні цінності — гідність, побратимство й підтримка.",
      },
    ],
  },
  en: {
    title: "In focus",
    subtitle: "Where presence matters",
    note: "Key events and partner initiatives with the Legion of Titans.",
    items: [
      {
        id: 1,
        title: "Business Festival 4.5.0",
        date: "October 2025",
        folder: "4.5.0",
        cover: "/events/4.5.0/cover.webp",
        photos: 8,
        description: "Participation in a business festival to support veteran initiatives and partnerships.",
        details: "Full details available in Ukrainian version.",
      },
      {
        id: 2,
        title: "Veterans Boxing Tournament",
        date: "December 2025",
        folder: "boxing",
        cover: "/events/boxing/cover.webp",
        photos: 4,
        description: "Veteran sports competition for resilience and rehabilitation.",
        details: "Full details available in Ukrainian version.",
      },
      {
        id: 3,
        title: "Hoverla Ascent",
        date: "August 2025",
        folder: "hoverla",
        cover: "/events/hoverla/cover.webp",
        photos: 9,
        description: "Collective ascent to Ukraine’s highest peak with fellow veterans.",
        details: "Full details available in Ukrainian version.",
      },
      {
        id: 4,
        title: "National Records",
        date: "September 2025",
        folder: "records",
        cover: "/events/records/cover.webp",
        photos: 1,
        description: "Demonstrating strength and resilience through record‑setting.",
        details: "Full details available in Ukrainian version.",
      },
      {
        id: 5,
        title: "Side by Side with Veterans",
        date: "October 2025",
        folder: "Sidebyside",
        cover: "/events/Sidebyside/cover.webp",
        photos: 5,
        description: "Community forum and dialogue on veteran support.",
        details: "Full details available in Ukrainian version.",
      },
      {
        id: 6,
        title: "US Veterans Visit Kyiv Region",
        date: "November 2025",
        folder: "veteranUSA",
        cover: "/events/veteranUSA/cover.webp",
        photos: 7,
        description: "International mission to share rehabilitation experience.",
        details: "Full details available in Ukrainian version.",
      },
    ],
  },
};

export const team = {
  uk: {
    title: "Наша команда",
    subtitle: "Фахівці поруч",
    people: [
      {
        id: 1,
        name: "Пархоменко Павло",
        role: "Бізнес тренер",
        photo: "/images/team/specialist_1.webp",
        bio: "Сертифікований бізнес тренер Міжнародної організації праці. Експерт Українського ветеранського фонду. Експерт з грантування.",
      },
      {
        id: 2,
        name: "Пархоменко Вікторія",
        role: "Психологиня, бізнес-коуч.",
        photo: "/images/team/specialist_2.webp",
        bio: "Експерт з кризової психології. Проводить групові та індивідуальні сесії для ветеранів та їхніх родин, допомагаючи адаптуватися до мирного життя.",
      },
      {
        id: 3,
        name: "Кандиба Сергій Володимирович",
        role: "Юрист - правознавець.",
        photo: "/images/team/specialist_3.webp",
        bio: "Доктор філософії в галузі права. Член Національної асамблеї осіб з інвалідністю в Ураїні. Академік Академії адміністративно правових наук України",
      },
      {
        id: 4,
        name: "Буєвич Андрій Олександрович",
        role: "Фахівець в галузі національної безпеки.",
        photo: "/images/team/specialist_4.webp",
        bio: "Ветеран війни з 2014 року, особа з інвалідністю внаслідок війни. Фахівець у сфері стратегічного менеджменту в галузі національної безпеки. Має дві вищі освіти за спеціальностями «Право» та «Стратегічний менеджмент у галузі національної безпеки». Закінчив Національний університет оборони України. У січні 2023 року зазнав тяжкого поранення. Після проходження реабілітації повернувся до служби в структурі оборони та продовжує активну професійну й суспільно важливу діяльність.",
      },
    ],
  },
  en: {
    title: "Our team",
    subtitle: "Specialists alongside",
    people: [
      {
        id: 1,
        name: "Pavlo Parkhomenko",
        role: "Business trainer",
        photo: "/images/team/specialist_1.webp",
        bio: "Certified business trainer of the International Labour Organization. Expert of the Ukrainian Veterans Fund. Grants expert.",
      },
      {
        id: 2,
        name: "Viktoriia Parkhomenko",
        role: "Psychologist, business coach.",
        photo: "/images/team/specialist_2.webp",
        bio: "Expert in crisis psychology. Leads group and individual sessions for veterans and their families to support adaptation to civilian life.",
      },
      {
        id: 3,
        name: "Serhii Kandyba",
        role: "Legal expert.",
        photo: "/images/team/specialist_3.webp",
        bio: "PhD in Law. Member of the National Assembly of Persons with Disabilities in Ukraine. Academician of the Academy of Administrative and Legal Sciences of Ukraine.",
      },
      {
        id: 4,
        name: "Andrii Buievych",
        role: "National security specialist.",
        photo: "/images/team/specialist_4.webp",
        bio: "War veteran since 2014. Specialist in strategic management in national security. Holds two degrees in Law and Strategic Management in National Security. Graduated from the National Defence University of Ukraine. Seriously wounded in January 2023, completed rehabilitation and returned to service.",
      },
    ],
  },
};

export const partners = {
  uk: { title: "Наші партнери", subtitle: "Разом ми сильніші", items: [
    { name: "Rozetka", logo: "images/partners/rozetka.png", url: "https://rozetka.com.ua" },
    { name: "Allo", logo: "images/partners/allo.png", url: "https://allo.ua" },
    { name: "ATB", logo: "images/partners/atb.png", url: "https://atbmarket.com" },
    { name: "Comfy", logo: "images/partners/comfi.png", url: "https://comfy.ua" },
    { name: "Digital", logo: "images/partners/digital.png", url: "#" },
    { name: "Hotline", logo: "images/partners/hotline.png", url: "https://hotline.ua" },
    { name: "Kyivstar", logo: "images/partners/kyivstar.png", url: "https://kyivstar.ua" },
    { name: "Lanet", logo: "images/partners/lanet.png", url: "https://lanet.ua" },
    { name: "MV", logo: "images/partners/mv.png", url: "#" },
    { name: "RNBO", logo: "images/partners/rnbo.png", url: "https://rnbo.gov.ua" },
  ]},
  en: { title: "Partners", subtitle: "Stronger together", items: [
    { name: "Rozetka", logo: "images/partners/rozetka.png", url: "https://rozetka.com.ua" },
    { name: "Allo", logo: "images/partners/allo.png", url: "https://allo.ua" },
    { name: "ATB", logo: "images/partners/atb.png", url: "https://atbmarket.com" },
    { name: "Comfy", logo: "images/partners/comfi.png", url: "https://comfy.ua" },
    { name: "Digital", logo: "images/partners/digital.png", url: "#" },
    { name: "Hotline", logo: "images/partners/hotline.png", url: "https://hotline.ua" },
    { name: "Kyivstar", logo: "images/partners/kyivstar.png", url: "https://kyivstar.ua" },
    { name: "Lanet", logo: "images/partners/lanet.png", url: "https://lanet.ua" },
    { name: "MV", logo: "images/partners/mv.png", url: "#" },
    { name: "RNBO", logo: "images/partners/rnbo.png", url: "https://rnbo.gov.ua" },
  ]},
};

export const founders = {
  uk: { title: "Ті, хто почав цей шлях", subtitle: "Співзасновники", people: [
    {
      id: 1,
      name: "Дмитро Паустовський",
      role: "Голова ГО",
      photo: "images/founders/founder_1.webp",
      bio:
        "Паустовський Дмитро Леонідович, 08.07.1979 р.н. — ветеран АТО/ООС та учасник повномасштабного вторгнення, має інвалідність, отриману внаслідок захисту Батьківщини. У 2022 році брав безпосередню участь у визволенні Київської області, зокрема міста Буча, яке стало одним із ключових символів спротиву російській агресії.\n\nГолова громадської організації «Легіон Титанів». Відповідає за стратегічний розвиток організації, формування її бачення та розбудову партнерств. Має досвід лідерства, стратегічного планування та ухвалення рішень у кризових умовах, спрямованих на розвиток ветеранських ініціатив, посилення інституційної спроможності організації та реалізацію суспільно важливих проєктів.",
    },
    {
      id: 2,
      name: "Сергій Саліхов",
      role: "Секретар / Керуючий справами ГО",
      photo: "images/founders/founder_2.webp",
      bio:
        "Саліхов Сергій Ігорович, 19.10.1979 р.н. — ветеран АТО/ООС та учасник повномасштабного вторгнення, підполковник запасу. Отримав інвалідність унаслідок виконання бойових завдань із захисту територіальної цілісності України. У 2022 році брав участь у визволенні Київщини, зокрема Ірпеня, Бучі та Бородянки.\n\nСпівзасновник громадської організації «Легіон Титанів». Як секретар та координатор забезпечує стратегічне планування, внутрішню комунікацію та координацію команд і проєктів. Має досвід лідерства в умовах підвищеної відповідальності, ухвалення рішень у кризових ситуаціях та організації роботи колективів, спрямованих на захист прав ветеранів.",
    },
    {
      id: 3,
      name: "Анатолій Грицьків",
      role: "Член правління ГО",
      photo: "images/founders/founder_3.webp",
      bio:
        "Грицьків Анатолій Васильович, 30.05.1978 р.н. — Ветеран АТО/ООС та повномасштабного вторгнення, інвалід війни, сержант. В організації координує розвиток ветеранської інфраструктури, ветеранських спільнот, співпрацю з громадськими організаціями.",
    },
    {
      id: 4,
      name: "Олександр Ларін",
      role: "Член правління ГО",
      photo: "images/founders/founder_4.webp",
      bio:
        "Ларін Олександр Сергійович, 26.05.1991 р.н. — Ветеран АТО/ООС, інвалід війни, солдат. В організації координує культурно-просвітницькою діяльністю, програми адаптації, групи взаємодопомоги та медичну підтримку ветеранів та їх родин.",
    },
    {
      id: 5,
      name: "Олексій Мельниченко",
      role: "Член правління ГО",
      photo: "images/founders/founder_5.webp",
      bio:
        "Мельниченко Олексій Валерійович, 04.11.1999 р.н. — Ветеран війни, учасник бойових дій, інвалід війни, солдат. Має 8 років досвіду в медіа, маркетингу та управлінні командами. Працював із громадськими та соціальними проєктами. В організації координує інформаційну підтримку, комунікаційний та стратегічний напрям.",
    },
  ]},
  en: { title: "Those who started the path", subtitle: "Co-founders", people: [
    {
      id: 1,
      name: "Dmytro Paustovskyi",
      role: "Head of NGO",
      photo: "images/founders/founder_1.webp",
      bio:
        "Dmytro Leonidovych Paustovskyi, born 08.07.1979 — ATO/JFO veteran and participant in the full-scale invasion, with a disability acquired while protecting the Motherland. In 2022, he directly participated in the liberation of Kyiv region, particularly the city of Bucha, which became one of the key symbols of resistance to Russian aggression.\n\nHead of the public organization \"Legion of Titans\". He is responsible for strategic development of the organization, forming its vision and building partnerships. He has experience in leadership, strategic planning, and decision-making in crisis conditions, aimed at developing veterans' initiatives, strengthening the institutional capacity of the organization, and implementing important public projects.",
    },
    {
      id: 2,
      name: "Serhii Salikhov",
      role: "Secretary / Operations Manager",
      photo: "images/founders/founder_2.webp",
      bio:
        "Serhii Ihorovych Salikhov, born 19.10.1979 — ATO/JFO veteran and participant in the full-scale invasion, reserve lieutenant colonel. He acquired a disability while performing combat missions to defend Ukraine's territorial integrity. In 2022, he participated in the liberation of Kyiv region, including Irpin, Bucha, and Borodianka.\n\nCo-founder of the public organization \"Legion of Titans\". As secretary and coordinator, he ensures strategic planning, internal communication, and coordination of teams and projects. He has experience in leadership under high responsibility, decision-making in crisis situations, and organizing team work aimed at protecting the rights of veterans.",
    },
    {
      id: 3,
      name: "Anatolii Hrytskiv",
      role: "Board Member",
      photo: "images/founders/founder_3.webp",
      bio:
        "Anatolii Vasylovych Hrytskiv, born 30.05.1978 — ATO/JFO veteran and full-scale invasion participant, war invalid, sergeant. In the organization, he coordinates the development of veterans' infrastructure, veterans' communities, and cooperation with public organizations.",
    },
    {
      id: 4,
      name: "Oleksandr Larin",
      role: "Board Member",
      photo: "images/founders/founder_4.webp",
      bio:
        "Oleksandr Serhiyovych Larin, born 26.05.1991 — ATO/JFO veteran, war invalid, soldier. In the organization, he coordinates cultural and educational activities, adaptation programs, mutual aid groups, and medical support for veterans and their families.",
    },
    {
      id: 5,
      name: "Oleksii Melnychenko",
      role: "Board Member",
      photo: "images/founders/founder_5.webp",
      bio:
        "Oleksii Valeriyovych Melnychenko, born 04.11.1999 — War veteran, combat participant, war invalid, soldier. He has 8 years of experience in media, marketing, and team management. He has worked with public and social projects. In the organization, he coordinates information support, communications, and strategic direction.",
    },
  ]},
};

export const contact = {
  uk: {
    title: "Контакти",
    subtitle: "Звʼязок з нами",
    quick: ["Головна","Діяльність","У центрі подій","Наша команда","Контакти"],
    note: "Ми відповідаємо на звернення через цю форму або по email.",
    emailTo: "ngo@legion-of-titans.org",
    form: {
      name: "Імʼя",
      namePlaceholder: "Ваше імʼя",
      email: "Email",
      emailPlaceholder: "name@example.com",
      subject: "Тема",
      subjectPlaceholder: "Тема повідомлення",
      message: "Повідомлення",
      messagePlaceholder: "Напишіть ваше повідомлення...",
      consent: "Надсилаючи це повідомлення, ви надаєте згоду на обробку персональних даних, зазначених у повідомленні, виключно з метою зворотного звʼязку.",
      submit: "Надіслати",
      sending: "Відправляємо…",
      sent: "Повідомлення надіслано. Дякуємо!",
      error: "Не вдалося надіслати. Спробуйте ще раз трохи пізніше.",
      validation: {
        nameRequired: "Імʼя обов'язкове",
        emailRequired: "Email обов'язковий",
        emailInvalid: "Введіть коректну email адресу",
        messageRequired: "Повідомлення обов'язкове",
        messageTooShort: "Повідомлення занадто коротке (мінімум 10 символів)",
        consentRequired: "Потрібно підтвердити згоду на обробку даних",
      }
    }
  },
  en: {
    title: "Contacts",
    subtitle: "Get in touch",
    quick: ["Home","Activities","In focus","Team","Contacts"],
    note: "We reply via this form or by email.",
    emailTo: "ngo@legion-of-titans.org",
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "name@example.com",
      subject: "Subject",
      subjectPlaceholder: "Message subject",
      message: "Message",
      messagePlaceholder: "Write your message...",
      consent: "By sending this message, you consent to the processing of personal data provided in the message solely for the purpose of responding.",
      submit: "Send",
      sending: "Sending…",
      sent: "Message sent. Thank you!",
      error: "Failed to send. Please try again later.",
      validation: {
        nameRequired: "Name is required",
        emailRequired: "Email is required",
        emailInvalid: "Please enter a valid email address",
        messageRequired: "Message is required",
        messageTooShort: "Message is too short (minimum 10 characters)",
        consentRequired: "You must consent to data processing",
      }
    }
  },
};

export const branding = {
  uk: {
    headerOrg: "ГО",
    headerName: "«Легіон Титанів»",
    footerTestMode: "Сайт працює у тестовому режимі. Зауваження та пропозиції просимо надсилати на e-mail: ngo@legion-of-titans.org",
    footerCopyright: "© 2026 ГО «ЛЕГІОН ТИТАНІВ». ВСІ ПРАВА ЗАХИЩЕНІ.",
    footerContactsTitle: "Контакти",
    footerNavTitle: "Швидка навігація",
    footerNavHome: "Головна",
    footerNavActivity: "Діяльність",
    footerNavEvents: "У центрі подій",
    footerNavTeam: "Наша команда",
    footerNavAdmin: "Адмін-панель",
    footerAddressLine1: "08292, Київська обл., м. Буча,",
    footerAddressLine2: "вул. Нове Шосе, 8б",
  },
  en: {
    headerOrg: "NGO",
    headerName: "«Legion of Titans»",
    footerTestMode: "Website is in test mode. Please send feedback and suggestions to: ngo@legion-of-titans.org",
    footerCopyright: "© 2026 NGO «LEGION OF TITANS». ALL RIGHTS RESERVED.",
    footerContactsTitle: "Contacts",
    footerNavTitle: "Quick navigation",
    footerNavHome: "Home",
    footerNavActivity: "Activity",
    footerNavEvents: "In focus",
    footerNavTeam: "Our team",
    footerNavAdmin: "Admin panel",
    footerAddressLine1: "08292, Kyiv region, Bucha,",
    footerAddressLine2: "Nove Shose St., 8b",
  },
};

export const infocus = {
  uk: {
    title: "У центрі подій",
    subtitle: "Там, де присутність має значення",
    note: "Показуємо ключові події та партнерські ініціативи за участі ГО «Легіон Титанів».",
    archiveLabel: "Архів подій",
    hideArchiveLabel: "Приховати архів",
  },
  en: {
    title: "In focus",
    subtitle: "Where presence matters",
    note: "Key events and partner initiatives with the Legion of Titans.",
    archiveLabel: "Events archive",
    hideArchiveLabel: "Hide archive",
  },
};
