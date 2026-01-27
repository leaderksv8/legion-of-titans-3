import { type Locale } from "@/content/site";

export type GuideQuickStart = {
  id: string;
  title: string;
  steps: string[];
  docs: string[];
  tags: string[];
};

export type GuideItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  brief: string;
  steps: string[];
  docs: string[];
  contacts: string[];
  sources: string[];
  mistakes?: string[];
};

export type GuideCategory = {
  id: string;
  title: string;
  items: GuideItem[];
};

export type GuideContent = {
  title: string;
  subtitle: string;
  quickStartTitle: string;
  quickStart: GuideQuickStart[];
  updates: string[];
  categories: GuideCategory[];
};

export const guide: Record<Locale, GuideContent> = {
  uk: {
    title: "Довідник",
    subtitle: "Короткі маршрути та повна бібліотека дій для ветеранів, постраждалих і сімей.",
    quickStartTitle: "З чого почати",
    quickStart: [
      {
        id: "ubd",
        title: "Отримання статусу УБД",
        steps: ["1) Зібрати базові документи про участь в операціях", "2) Подати пакет до органу, який видав довідку", "3) Отримати рішення про надання статусу"],
        docs: ["Паспорт або посвідчення", "ІПН", "Наказ про призначення / контракт", "Довідка про участь в АТО/ООС", "Заява про надання статусу"],
        tags: ["УБД", "Статус"],
      },
      {
        id: "payments",
        title: "Подача заяви на виплати",
        steps: ["1) Визначити вид виплати (разова, місячна, компенсація)", "2) Зібрати пакет документів", "3) Подати заяву до Соцзахисту"],
        docs: ["Паспорт", "ІПН", "Рішення про надання статусу", "Реквізити для переводу", "Копія виписки з媒体/договору (за потреби)"],
        tags: ["Виплати", "Компенсація"],
      },
      {
        id: "disability",
        title: "Оформлення групи інвалідності",
        steps: ["1) Зібрати медичні документи та виписки", "2) Отримати направлення від лікаря", "3) Пройти засідання МСЕК/експертної команди"],
        docs: ["Виписки з лікувально-профілактичних установ", "Медична карта", "Направлення від лікаря", "Паспорт", "Довідка про участь в операціях"],
        tags: ["Інвалідність", "МСЕК"],
      },
      {
        id: "vlk",
        title: "Військово-лікарська комісія (ВЛК)",
        steps: ["1) Подати заяву та документи до військомату", "2) Проходити обстеження у військових лікарів", "3) Отримати висновок про придатність"],
        docs: ["Медичні документи", "Направлення від командира", "Паспорт", "Військовий квиток"],
        tags: ["ВЛК", "Медична експертиза"],
      },
      {
        id: "msek",
        title: "МСЕК / Експертні команди",
        steps: ["1) Зібрати документи та спеціалізовані висновки", "2) Записатись на прием до МСЕК", "3) Пройти засідання та отримати рішення"],
        docs: ["Виписки, звіти медичного закладу", "Направлення від лікаря", "Паспорт", "Доповідь про ступінь порушення функцій"],
        tags: ["МСЕК", "Інвалідність"],
      },
    ],
    updates: [
      "Поточна ставка одноразової виплати УБД — 200 000 грн (2024)",
      "Розмір місячної допомоги інвалідам війни — від 3 000 до 5 000 грн в залежності від групи",
      "Шаблони заяв доступні в розділі 'Шаблони документів'",
    ],
    categories: [
      {
        id: "status",
        title: "Статус УБД та ветерана",
        items: [
          {
            id: "status-ubd",
            title: "Як отримати статус учасника бойових дій (УБД)",
            description: "Детальна інструкція з отримання офіційного статусу УБД та всіх пов'язаних прав.",
            tags: ["УБД", "Статус"],
            brief: "Статус УБД дає право на виплати, медичне обслуговування, пенсійні гарантії та пільги. Його отримують на основі документів про участь у військових операціях АТО/ООС.",
            steps: [
              "1) Зібрати документи: паспорт, ІПН, військовий квиток, наказ про призначення",
              "2) Отримати довідку про участь в операціях (у військовій частині або архіві)",
              "3) Подати заяву та пакет документів до Соцзахисту або ЦНАП",
              "4) Дочекатися рішення комісії (зазвичай 10-20 днів)",
              "5) Отримати посвідчення УБД",
            ],
            docs: [
              "Паспорт (оригінал і копія)",
              "ІПН",
              "Військовий квиток",
              "Наказ про призначення на посаду",
              "Довідка про участь в АТО/ООС",
              "Заява про надання статусу (можна взяти у Соцзахисту)",
            ],
            contacts: [
              "Український державний центр соціального захисту (Соцзахист) — місцевого відділення",
              "Центр надання адміністративних послуг (ЦНАП) — близький до місця реєстрації",
              "Територіальне управління Мінветеранів",
            ],
            sources: [
              "Закон України 'Про статус ветеранів, їх соціальний захист' (№ 3551-VI)",
              "Постанова КМУ про визначення статусу УБД",
              "Офіційний сайт Мінветеранів https://mvs.gov.ua/",
            ],
            mistakes: [
              "Неповний пакет документів — приносять дублікати замість оригіналів",
              "Некоректне заповнення заяви — невизначена причина участі",
              "Обранення не в місцю реєстрації — потрібно йти саме туди",
              "Затримування через помилку в архівних документах — часто вирішується через військовий відділ",
            ],
          },
          {
            id: "status-disabled",
            title: "Статус особи з інвалідністю внаслідок війни",
            description: "Умови і процедура признання повнолітньої особи інвалідом внаслідок військових дій.",
            tags: ["Інвалідність", "МСЕК"],
            brief: "Статус інваліда внаслідок війни надає права на пенсію, медичне обслуговування, допоміжні засоби та пільги. Його встановлює спеціалізована медична комісія (МСЕК або експертна команда).",
            steps: [
              "1) Зібрати всі медичні документи та діагнози",
              "2) Отримати направлення від лікаря на засідання МСЕК",
              "3) Записатись на прием до МСЕК/експертної команди",
              "4) Пройти обстеження лікарів (різних спеціальностей)",
              "5) Отримати висновок про визнання інвалідом та групу",
              "6) Зареєструвати висновок в органах соцзахисту",
            ],
            docs: [
              "Паспорт",
              "ІПН",
              "Посвідчення УБД (або документи про участь)",
              "Виписки з лікувально-профілактичних установ (не старше 3 місяців)",
              "Амбулаторна карта або витяг з медичної карти",
              "Результати обстежень (УЗД, рентген, МРТ тощо)",
              "Направлення на МСЕК від лікуючого лікаря",
            ],
            contacts: [
              "Медико-соціальна експертиза (МСЕК) — місцевого відділення",
              "Експертні команди при Мінветеранів (для ветеранів)",
              "Лікувально-профілактичні установи для отримання направлення",
            ],
            sources: [
              "Закон України 'Про основи соціальної захищеності інвалідів в Україні' (№ 2571-XII)",
              "Постанова КМУ про порядок освідування осіб на інвалідність",
              "Наказ МОЗ про критерії встановлення груп інвалідності",
            ],
            mistakes: [
              "Застаріли документи — потрібні висновки не старше 3 місяців",
              "Відсутні спеціалізовані висновки — потрібні у невролога, хірурга тощо",
              "Неправильно оформлене направлення — лікар має конкретно вказати причину",
              "Пропущені засідання — потрібно повторно записуватись",
            ],
          },
        ],
      },
      {
        id: "benefits",
        title: "Пільги та гарантії для УБД",
        items: [
          {
            id: "benefits-medical",
            title: "Безкоштовне медичне обслуговування та реабілітація",
            description: "Медичні послуги, які мають право отримувати ветерани без оплати.",
            tags: ["УБД", "Медицина"],
            brief: "УБД мають право на безкоштовне лікування в державних закладах охорони здоров'я, психологічну реабілітацію, протезування та допоміжні засоби. Лікування проводиться за поточним місцем проживання ветерана.",
            steps: [
              "1) Отримати полис медичного страхування (ОМС)",
              "2) Обрати закупівлю сімейного лікаря",
              "3) Подати декларацію про вибір лікаря",
              "4) Отримати направлення від лікаря на лікування або реабілітацію",
              "5) Пройти лікування в державній установі",
            ],
            docs: [
              "Паспорт",
              "ІПН",
              "Посвідчення УБД",
              "Полис ОМС (видається автоматично)",
              "Рецепти від лікаря",
            ],
            contacts: [
              "Заклади первинної медико-санітарної допомоги (ПМСД) — по місцю проживання",
              "Реабілітаційні центри при Мінветеранів",
              "Психологічні центри підтримки ветеранів",
            ],
            sources: [
              "Закон України про медичне страхування",
              "Накази МОЗ про реабілітацію ветеранів",
              "Програми психологічної реабілітації",
            ],
            mistakes: [
              "Невибір сімейного лікаря — це потрібне для доступу до лікування",
              "Звернення в приватні установи (крім договірних з ОМС) — не будуть оплачені",
              "Недостатність документів при звернені — мати при собі все перелічене",
            ],
          },
          {
            id: "benefits-transport",
            title: "Пільги на транспорт",
            description: "Безкоштовний або пільговий проїзд для ветеранів АТО/ООС.",
            tags: ["УБД", "Пільги"],
            brief: "УБД мають право на безкоштовний проїзд у міськими видами транспорту (автобус, трамвай, метро, тролейбус), пільги на залізниці та авіації, компенсацію за паливо та ремонт транспорту. Пільги залежать від групи інвалідності та типу операцій.",
            steps: [
              "1) Отримати посвідчення УБД",
              "2) Оформити пільговий квиток у Соцзахисту",
              "3) Користуватися безкоштовно або частково на оплату",
              "4) Для автотранспорту — подати документи на компенсацію паливу",
            ],
            docs: [
              "Паспорт",
              "Посвідчення УБД",
              "Посвідчення інваліда (якщо вже встановлена група)",
              "СНВС (для авто-транспорту)",
            ],
            contacts: [
              "Соцзахист — місцевого відділення",
              "Управління ЖЗТ (для міського транспорту)",
              "Укразалізниця, автомобільні перевізники",
            ],
            sources: [
              "Закон України 'Про статус ветеранів'",
              "Постанови місцевих рад про пільги",
            ],
          },
        ],
      },
      {
        id: "payments",
        title: "Виплати ветеранам та членам сімей",
        items: [
          {
            id: "payment-lump-sum",
            title: "Одноразова виплата УБД",
            description: "Одноразова грошова допомога при отриманні статусу УБД.",
            tags: ["Виплати"],
            brief: "УБД мають право на одноразову виплату в розмірі 200 000 гривень (станом на 2024 р.). Виплачується один раз при отриманні статусу. Члени сім'ї загиблого ветерана отримують цю суму розділену поділом на кількість спадкоємців.",
            steps: [
              "1) Отримати посвідчення УБД",
              "2) Подати заяву на виплату до Соцзахисту разом з документами",
              "3) Вказати реквізити для перекладу грошей",
              "4) Дочекатися переводу (зазвичай 10-15 днів)",
            ],
            docs: [
              "Паспорт",
              "ІПН",
              "Посвідчення УБД",
              "Реквізити рахунку в банку або довідка про регуляцію в ЦКЭ",
            ],
            contacts: ["Соцзахист — місцевого відділення"],
            sources: ["Постанова КМУ про розмір виплат"],
            mistakes: [
              "Невідправлення реквізитів — виплата не буде здійснена",
              "Затримання з подачею документів — виплати за день з дати подання",
            ],
          },
          {
            id: "payment-monthly",
            title: "Місячна допомога та пенсія",
            description: "Постійні місячні виплати для ветеранів та членів сімей.",
            tags: ["Виплати", "Пенсія"],
            brief: "Розмір місячної допомоги залежить від групи інвалідності, доходу сім'ї та статусу. Інваліди I групи отримують більше (від 3000-5000 гривень), ніж інваліди III групи. Члени сімей отримують пенсію, якщо утримувались загиблим ветераном.",
            steps: [
              "1) Встановити групу інвалідності (якщо застосовується)",
              "2) Подати документи на пенсію до органу соцзахисту",
              "3) Довести статус малозабезпеченості (якщо потрібно)",
              "4) Отримати рішення та видатки банківської карти",
            ],
            docs: [
              "Паспорт",
              "ІПН",
              "Посвідчення УБД",
              "Посвідчення інваліда (для інвалідів)",
              "Свідоцтво про смерть (для членів сім'ї)",
              "Документи про доходи (при потребі)",
            ],
            contacts: ["Соцзахист", "Пенсійний фонд (ПФУ)"],
            sources: ["Закон України про пенсійне забезпечення"],
          },
        ],
      },
      {
        id: "medical",
        title: "Медична експертиза та комісії",
        items: [
          {
            id: "medical-vlk",
            title: "Військово-лікарська комісія (ВЛК)",
            description: "Процедура перевірки придатності до військової служби та встановлення основ для виплат.",
            tags: ["ВЛК", "Медицина"],
            brief: "ВЛК визначає придатність люди до військової служби на основі медичного обстеження. Для ветеранів ВЛК встановлює наявність або відсутність внаслідків поранень/захворювань, які отримані під час служби. Рішення ВЛК є підставою для подальшої МСЕК.",
            steps: [
              "1) Зібрати медичні документи за останній рік",
              "2) Отримати направлення від командира (для військовослужбовців) або лікаря",
              "3) Записатись на засідання ВЛК у військовому госпіталі",
              "4) Пройти обстеження у военних лікарів (хірург, невролог, психіатр тощо)",
              "5) Отримати висновок ВЛК про придатність",
            ],
            docs: [
              "Паспорт",
              "Військовий квиток",
              "Виписки з лікування (від операцій до звільнення)",
              "Амбулаторна карта",
              "Рецепти та результати обстежень",
            ],
            contacts: [
              "Військовий госпіталь місцевого гарнізону",
              "Медичні комісії при ЦВК (Центральна військова комісія)",
            ],
            sources: ["Наказ Мінветеранів про порядок ВЛК"],
          },
          {
            id: "medical-msek",
            title: "МСЕК / Експертні команди для встановлення групи інвалідності",
            description: "Офіційна процедура визнання людини інвалідом та встановлення групи інвалідності.",
            tags: ["МСЕК", "Інвалідність"],
            brief: "МСЕК (медико-соціальна експертна комісія) це спеціалізована медична комісія, яка встановлює групу інвалідності на основі медичних документів та обстеження. Для ветеранів часто використовуються експертні команди при Мінветеранів, які можуть прискорити процес.",
            steps: [
              "1) Отримати направлення від лікуючого лікаря",
              "2) Зібрати всі медичні витяги та результати обстежень",
              "3) Записатись на засідання МСЕК",
              "4) Прийти на обстеження з документами",
              "5) Отримати протокол засідання та висновок про групу",
              "6) Подати висновок до органів соцзахисту для реєстрації",
            ],
            docs: [
              "Паспорт",
              "ІПН",
              "Посвідчення УБД",
              "Виписки з лікування (останні 3 місяці)",
              "Результати обстежень (УЗД, рентген, МРТ, ЕКГ тощо)",
              "Направлення від лікаря",
            ],
            contacts: [
              "МСЕК місцевого обласного управління",
              "Експертні команди при Мінветеранів",
              "Основні лікувально-профілактичні установи",
            ],
            sources: ["Наказ МОЗ про встановлення груп інвалідності"],
            mistakes: [
              "Застаріли дані — потрібні документи не старше 3 місяців",
              "Недостатньо спеціалізованих висновків — потрібні консультації у вузьких спеціалістів",
              "Неправильне направлення — в ньому повинна бути описана проблема",
              "Без медичних доказів — необхідні результати всіх обстежень",
            ],
          },
        ],
      },
      {
        id: "documents",
        title: "Шаблони документів та форми",
        items: [
          {
            id: "doc-application",
            title: "Заява про надання статусу УБД",
            description: "Шаблон основної заяви для отримання статусу учасника бойових дій.",
            tags: ["Шаблони"],
            brief: "Заява повинна мати дані заявника, причину участі в операціях та період участі. Шаблон формату А4 з базовими полями для заповнення. Подається до органів Соцзахисту або ЦНАП.",
            steps: [
              "1) Завантажити шаблон",
              "2) Заповнити вручну або надрукованим текстом",
              "3) Поставити дату та підпис",
              "4) Подати разом з документами до Соцзахисту",
            ],
            docs: ["PDF або DOC файл з шаблоном"],
            contacts: ["Соцзахист для отримання паперового шаблону"],
            sources: ["Офіційна форма від Мінветеранів"],
          },
          {
            id: "doc-complaint",
            title: "Скарга на рішення МСЕК (оскарження)",
            description: "Форма для оскарження рішення МСЕК, якщо воно несправедливе.",
            tags: ["Шаблони", "Оскарження"],
            brief: "Скарга подається в органи вищої медико-соціальної експертної комісії (комісія II ступеня). У скарзі необхідно викласти причину, чому вважаєте рішення неправильним, і надати додаткові медичні докази.",
            steps: [
              "1) Отримати копію протоколу засідання МСЕК",
              "2) Зібрати додаткові медичні довідки",
              "3) Заповнити форму скарги",
              "4) Подати до органів МСЕК II ступеня в встановлений термін (1 місяць)",
            ],
            docs: ["Форма скарги", "Додаткові медичні документи"],
            contacts: ["МСЕК II ступеня (обласна)"],
            sources: ["Наказ МОЗ про оскарження"],
          },
        ],
      },
      {
        id: "resources",
        title: "Контакти та офіційні ресурси",
        items: [
          {
            id: "res-ministries",
            title: "Державні установи та міністерства",
            description: "Контакти основних установ, що надають послуги ветеранам.",
            tags: ["Контакти"],
            brief: "Основні установи для ветеранів: Міністерство ветеранів України, Соцзахист, ЦНАП, Пенсійний фонд. Також цінні місцеві соціальні служби та центри реабілітації.",
            steps: [
              "1) Визначити своє питання (статус, виплати, медицина)",
              "2) Обрати відповідну установу",
              "3) Дозвонитись або прийти особисто",
              "4) Узаконити звернення письмово (на ЦНАП/Соцзахисту)",
            ],
            docs: ["Паспорт", "ІПН", "Посвідчення УБД"],
            contacts: [
              "Міністерство ветеранів України: +38 (44) 496-48-62, https://mvs.gov.ua",
              "Соцзахист: місцеві відділення, https://www.kyivsotsyalniy.gov.ua",
              "ЦНАП: по місцю проживання",
              "Гарячу лінію для ветеранів: 1497 (безкоштовно)",
            ],
            sources: ["Офіційні сайти установ"],
          },
          {
            id: "res-ngo",
            title: "Громадські організації та гарячі лінії",
            description: "Благодійні організації та спеціалізовані центри підтримки ветеранів.",
            tags: ["Контакти", "Допомога"],
            brief: "Крім державних установ, існує мережа громадських організацій, які надають психологічну підтримку, юридичну допомогу, реабілітацію. Вони часто швидше реагують на проблеми та розуміють особливості ветеранів.",
            steps: [
              "1) Обрати організацію за профілем проблеми",
              "2) Дозвонитись на гарячу лінію",
              "3) Записатись на консультацію",
              "4) Отримати допомогу та рекомендації",
            ],
            docs: ["Посвідчення УБД (зазвичай)"],
            contacts: [
              "Легіон Титанів: https://legion-of-titans.org, контакти на сайті",
              "Гарячу лінію для ветеранів: 1497",
              "ПХМЦ АУУМ: психолого-медичний центр для ветеранів",
              "Військово-медичні центри при лікарнях",
            ],
            sources: ["Інтернет-ресурси ветеранських організацій"],
          },
        ],
      },
    ],
  },
  en: {
    title: "Guide",
    subtitle: "Quick routes and a complete reference library for veterans, affected persons and families.",
    quickStartTitle: "Quick start",
    quickStart: [
      {
        id: "ubd",
        title: "Getting Veteran Status",
        steps: ["1) Gather basic documents about participation in operations", "2) Submit package to the issuing authority", "3) Receive status decision"],
        docs: ["Passport or ID", "Tax ID", "Appointment order / contract", "Certificate of participation in ATO/JFO", "Application for veteran status"],
        tags: ["Status", "Veteran"],
      },
      {
        id: "payments",
        title: "Applying for Payments",
        steps: ["1) Determine payment type (lump-sum, monthly, compensation)", "2) Gather required documents", "3) Submit application to Social Protection office"],
        docs: ["Passport", "Tax ID", "Veteran status decision", "Bank details", "Supporting documents as needed"],
        tags: ["Payments", "Compensation"],
      },
      {
        id: "disability",
        title: "Registering as a Person with Disability",
        steps: ["1) Gather all medical documents and records", "2) Get medical referral from doctor", "3) Attend MSEK/expert team meeting"],
        docs: ["Medical reports from healthcare facilities", "Medical card", "Doctor's referral", "Passport", "Certificate of participation"],
        tags: ["Disability", "MSEK"],
      },
      {
        id: "vlk",
        title: "Military Medical Commission (VLK)",
        steps: ["1) Submit application and documents to military office", "2) Undergo examination by military doctors", "3) Receive fitness assessment"],
        docs: ["Medical documents", "Referral from commander", "Passport", "Military ID"],
        tags: ["VLK", "Medical examination"],
      },
      {
        id: "msek",
        title: "MSEK / Expert Teams",
        steps: ["1) Gather documents and specialized reports", "2) Register for MSEK appointment", "3) Attend meeting and receive decision"],
        docs: ["Medical reports from healthcare facilities", "Doctor's referral", "Passport", "Report on degree of functional impairment"],
        tags: ["MSEK", "Disability"],
      },
    ],
    updates: [
      "Current lump-sum payment for veterans — 200,000 UAH (2024)",
      "Monthly disability allowance — from 3,000 to 5,000 UAH depending on disability group",
      "Document templates available in 'Document Templates' section",
    ],
    categories: [
      {
        id: "status",
        title: "Veteran Status",
        items: [
          {
            id: "status-ubd",
            title: "How to Get Combat Participant Status",
            description: "Detailed instructions for obtaining official combat veteran status and all associated rights.",
            tags: ["Status", "Veteran"],
            brief: "Combat participant status provides rights to payments, medical care, pension guarantees and social benefits. It is granted based on documented participation in military operations (ATO/JFO).",
            steps: [
              "1) Gather documents: passport, tax ID, military ID, appointment order",
              "2) Obtain certificate of participation from military unit or archive",
              "3) Submit application and documents to Social Protection office or CNAP",
              "4) Wait for commission decision (usually 10-20 days)",
              "5) Receive combat participant certificate",
            ],
            docs: [
              "Passport (original and copy)",
              "Tax ID (TIN)",
              "Military ID",
              "Appointment order",
              "Certificate of participation in ATO/JFO",
              "Application for veteran status (available at Social Protection office)",
            ],
            contacts: [
              "Ukrainian State Center for Social Protection (local branch)",
              "Center for Administrative Services (CNAP) — near your registered address",
              "Regional Ministry of Veterans office",
            ],
            sources: [
              "Law of Ukraine 'On the Status of Veterans and Their Social Protection' (No. 3551-VI)",
              "Cabinet Resolution on determining combat participant status",
              "Official Ministry of Veterans website https://mvs.gov.ua/",
            ],
            mistakes: [
              "Incomplete document package — bring originals, not just copies",
              "Improperly filled application — clearly state reason for participation",
              "Applying in wrong location — must apply where registered",
              "Delays due to archive errors — often resolved through military unit",
            ],
          },
          {
            id: "status-disabled",
            title: "Status as Person with War-Related Disability",
            description: "Terms and procedures for recognizing a person as disabled due to military operations.",
            tags: ["Disability", "MSEK"],
            brief: "War-related disability status provides rights to pension, medical care, assistive devices and social benefits. It is established by specialized medical commission (MSEK or expert team).",
            steps: [
              "1) Gather all medical documents and diagnoses",
              "2) Get referral from doctor to MSEK meeting",
              "3) Register for MSEK/expert team appointment",
              "4) Undergo examination by various specialists",
              "5) Receive MSEK conclusion establishing disability group",
              "6) Register conclusion with social protection authorities",
            ],
            docs: [
              "Passport",
              "Tax ID",
              "Combat participant certificate (or documents of participation)",
              "Medical reports from healthcare facilities (not older than 3 months)",
              "Medical card or extract from medical record",
              "Results of examinations (ultrasound, X-ray, MRI, etc.)",
              "Medical referral to MSEK",
            ],
            contacts: [
              "Medical-Social Expert Commission (MSEK) — local office",
              "Expert teams at Ministry of Veterans (for veterans)",
              "Healthcare facilities for obtaining referral",
            ],
            sources: [
              "Law of Ukraine 'On Fundamentals of Social Protection of Persons with Disabilities' (No. 2571-XII)",
              "Cabinet Resolution on examination procedures for disability",
              "Ministry of Health Order on criteria for disability group assignment",
            ],
            mistakes: [
              "Outdated documents — need reports not older than 3 months",
              "Missing specialized reports — need consultations from narrow specialists",
              "Incorrectly completed referral — must clearly state the problem",
              "Missed appointments — need to re-register",
            ],
          },
        ],
      },
      {
        id: "benefits",
        title: "Benefits and Guarantees for Veterans",
        items: [
          {
            id: "benefits-medical",
            title: "Free Medical Care and Rehabilitation",
            description: "Medical services available to veterans at no cost.",
            tags: ["Veteran", "Medical"],
            brief: "Veterans have the right to free treatment in state healthcare facilities, psychological rehabilitation, prosthetics and assistive devices. Treatment is provided at the veteran's place of residence.",
            steps: [
              "1) Obtain health insurance policy (OMS)",
              "2) Choose a family doctor",
              "3) Submit declaration of doctor choice",
              "4) Get referral from doctor for treatment or rehabilitation",
              "5) Receive treatment at state facility",
            ],
            docs: [
              "Passport",
              "Tax ID",
              "Combat participant certificate",
              "Health insurance policy (OMS) — issued automatically",
              "Doctor's prescriptions",
            ],
            contacts: [
              "Primary healthcare facilities (PMSD) — at your place of residence",
              "Rehabilitation centers at Ministry of Veterans",
              "Psychological support centers for veterans",
            ],
            sources: [
              "Law of Ukraine on Health Insurance",
              "Ministry of Health Orders on veteran rehabilitation",
              "Psychological rehabilitation programs",
            ],
            mistakes: [
              "No family doctor selected — needed for treatment access",
              "Seeking private healthcare (not contracted with OMS) — won't be covered",
              "Missing documents — bring all required documents",
            ],
          },
          {
            id: "benefits-transport",
            title: "Public Transport Benefits",
            description: "Free or discounted public transport for combat veterans.",
            tags: ["Veteran", "Benefits"],
            brief: "Veterans have right to free public transport (bus, tram, subway, trolley), discounts on rail and air travel, and compensation for fuel and vehicle repair. Benefits depend on disability group and type of service.",
            steps: [
              "1) Obtain combat participant certificate",
              "2) Get benefits ticket from Social Protection office",
              "3) Use free or partially subsidized transport",
              "4) For vehicles — submit documents for fuel compensation",
            ],
            docs: [
              "Passport",
              "Combat participant certificate",
              "Disability certificate (if disability group established)",
              "Vehicle registration (for auto compensation)",
            ],
            contacts: [
              "Social Protection office — local branch",
              "Public Transport Authority (for city transport)",
              "Ukrzaliznytsia, passenger transport companies",
            ],
            sources: [
              "Law of Ukraine 'On the Status of Veterans'",
              "Local council resolutions on benefits",
            ],
          },
        ],
      },
      {
        id: "payments",
        title: "Payments to Veterans and Family Members",
        items: [
          {
            id: "payment-lump-sum",
            title: "Lump-Sum Payment for Combat Veterans",
            description: "One-time monetary assistance upon obtaining combat participant status.",
            tags: ["Payments"],
            brief: "Combat participants receive a one-time payment of 200,000 UAH (as of 2024). Paid once upon obtaining status. Family members of deceased veterans receive this sum divided by number of heirs.",
            steps: [
              "1) Obtain combat participant certificate",
              "2) Submit payment application to Social Protection office with documents",
              "3) Provide bank account details for transfer",
              "4) Wait for transfer (usually 10-15 days)",
            ],
            docs: [
              "Passport",
              "Tax ID",
              "Combat participant certificate",
              "Bank account details or CEC registration certificate",
            ],
            contacts: ["Social Protection office — local branch"],
            sources: ["Cabinet Resolution on payment amounts"],
            mistakes: [
              "Not submitting account details — payment won't be processed",
              "Delayed submission — payments count from submission date",
            ],
          },
          {
            id: "payment-monthly",
            title: "Monthly Allowance and Pensions",
            description: "Regular monthly payments to veterans and family members.",
            tags: ["Payments", "Pension"],
            brief: "Monthly allowance depends on disability group, family income and status. Group I invalids receive more (3,000-5,000 UAH) than Group III invalids. Family members receive pension if supported by deceased veteran.",
            steps: [
              "1) Establish disability group (if applicable)",
              "2) Submit pension documents to social protection office",
              "3) Prove low-income status (if required)",
              "4) Receive decision and bank card",
            ],
            docs: [
              "Passport",
              "Tax ID",
              "Combat participant certificate",
              "Disability certificate (for disabled persons)",
              "Death certificate (for family members)",
              "Income documents (if needed)",
            ],
            contacts: ["Social Protection office", "Pension Fund (PFU)"],
            sources: ["Law of Ukraine on Pension Provision"],
          },
        ],
      },
      {
        id: "medical",
        title: "Medical Examinations and Commissions",
        items: [
          {
            id: "medical-vlk",
            title: "Military Medical Commission (VLK)",
            description: "Procedure for determining fitness for military service and establishing basis for payments.",
            tags: ["VLK", "Medical"],
            brief: "VLK determines fitness for military service based on medical examination. For veterans, VLK establishes presence or absence of consequences from wounds/diseases acquired during service. VLK decision is basis for further MSEK examination.",
            steps: [
              "1) Gather medical documents from past year",
              "2) Get referral from commander (for servicepersons) or doctor",
              "3) Register for VLK meeting at military hospital",
              "4) Undergo examination by military doctors (surgeon, neurologist, psychiatrist, etc.)",
              "5) Receive VLK conclusion on fitness",
            ],
            docs: [
              "Passport",
              "Military ID",
              "Treatment records (from operations to discharge)",
              "Outpatient card",
              "Prescriptions and test results",
            ],
            contacts: [
              "Military hospital of local garrison",
              "Medical commissions at CVC (Central Military Commission)",
            ],
            sources: ["Ministry of Veterans Order on VLK procedures"],
          },
          {
            id: "medical-msek",
            title: "MSEK / Expert Teams for Establishing Disability Group",
            description: "Official procedure for recognizing person as disabled and determining disability group.",
            tags: ["MSEK", "Disability"],
            brief: "MSEK (Medical-Social Expert Commission) is specialized medical commission that establishes disability group based on medical documents and examination. For veterans, expert teams at Ministry of Veterans often used and can accelerate process.",
            steps: [
              "1) Get referral from treating doctor",
              "2) Gather all medical reports and test results",
              "3) Register for MSEK meeting",
              "4) Attend examination with documents",
              "5) Receive meeting protocol and disability group conclusion",
              "6) Submit conclusion to social protection for registration",
            ],
            docs: [
              "Passport",
              "Tax ID",
              "Combat participant certificate",
              "Medical reports (from past 3 months)",
              "Test results (ultrasound, X-ray, MRI, ECG, etc.)",
              "Doctor's referral",
            ],
            contacts: [
              "MSEK of regional office",
              "Expert teams at Ministry of Veterans",
              "Primary healthcare facilities",
            ],
            sources: ["Ministry of Health Order on disability group assignment"],
            mistakes: [
              "Outdated data — need documents not older than 3 months",
              "Insufficient specialist reports — need consultations from narrow specialists",
              "Improperly completed referral — must describe the problem",
              "No medical evidence — need results of all examinations",
            ],
          },
        ],
      },
      {
        id: "documents",
        title: "Document Templates and Forms",
        items: [
          {
            id: "doc-application",
            title: "Application for Combat Participant Status",
            description: "Template for main application to obtain combat participant status.",
            tags: ["Templates"],
            brief: "Application should contain applicant's data, reason for participation in operations and period of participation. A4 format template with basic fields for completion. Submitted to Social Protection office or CNAP.",
            steps: [
              "1) Download template",
              "2) Fill in by hand or type",
              "3) Add date and signature",
              "4) Submit with documents to Social Protection office",
            ],
            docs: ["PDF or DOC file with template"],
            contacts: ["Social Protection office for paper template"],
            sources: ["Official form from Ministry of Veterans"],
          },
          {
            id: "doc-complaint",
            title: "Complaint Against MSEK Decision (Appeal)",
            description: "Form for appealing MSEK decision if you believe it's unfair.",
            tags: ["Templates", "Appeal"],
            brief: "Complaint submitted to higher Medical-Social Expert Commission (second-level commission). In complaint, state why you believe decision is wrong and provide additional medical evidence.",
            steps: [
              "1) Get copy of MSEK meeting protocol",
              "2) Gather additional medical certificates",
              "3) Fill out complaint form",
              "4) Submit to second-level MSEK within deadline (1 month)",
            ],
            docs: ["Complaint form", "Additional medical documents"],
            contacts: ["Second-level MSEK (regional)"],
            sources: ["Ministry of Health Order on appeals"],
          },
        ],
      },
      {
        id: "resources",
        title: "Contacts and Official Resources",
        items: [
          {
            id: "res-ministries",
            title: "Government Agencies and Ministries",
            description: "Contacts of main agencies providing services to veterans.",
            tags: ["Contacts"],
            brief: "Main agencies for veterans: Ministry of Veterans of Ukraine, Social Protection, CNAP, Pension Fund. Also valuable are local social services and rehabilitation centers.",
            steps: [
              "1) Determine your question (status, payments, medical)",
              "2) Choose appropriate agency",
              "3) Call or visit in person",
              "4) Formalize appeal in writing (at CNAP/Social Protection)",
            ],
            docs: ["Passport", "Tax ID", "Combat participant certificate"],
            contacts: [
              "Ministry of Veterans of Ukraine: +38 (44) 496-48-62, https://mvs.gov.ua",
              "Social Protection: local offices, https://www.kyivsotsyalniy.gov.ua",
              "CNAP: at your place of residence",
              "Veterans helpline: 1497 (free)",
            ],
            sources: ["Official agency websites"],
          },
          {
            id: "res-ngo",
            title: "NGOs and Helplines",
            description: "Charitable organizations and specialized veteran support centers.",
            tags: ["Contacts", "Support"],
            brief: "Besides state agencies, there are NGOs providing psychological support, legal aid, rehabilitation. They often respond faster and understand veteran issues better.",
            steps: [
              "1) Choose organization by problem area",
              "2) Call helpline",
              "3) Register for consultation",
              "4) Receive assistance and recommendations",
            ],
            docs: ["Combat participant certificate (usually)"],
            contacts: [
              "Legion of Titans: https://legion-of-titans.org, contacts on website",
              "Veterans helpline: 1497",
              "Psychological-Medical Center for Veterans",
              "Military-Medical Centers at hospitals",
            ],
            sources: ["Veterans organization websites"],
          },
        ],
      },
    ],
  },
};
