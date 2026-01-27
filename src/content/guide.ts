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
    subtitle: "Короткі маршрути та повна бібліотека дій для ветеранів і сімей.",
    quickStartTitle: "З чого почати",
    quickStart: [
      {
        id: "ubd",
        title: "Статус УБД",
        steps: ["1) Підготувати базові документи", "2) Подати пакет", "3) Отримати рішення"],
        docs: ["Паспорт", "ІПН", "Довідка про участь", "Заява (заглушка)"],
        tags: ["УБД"],
      },
      {
        id: "payments",
        title: "Виплати / компенсації",
        steps: ["1) Визначити тип виплати", "2) Зібрати пакет", "3) Подати заяву"],
        docs: ["Паспорт", "ІПН", "Реквізити", "Підтверджуючі довідки"],
        tags: ["Виплати"],
      },
      {
        id: "disability",
        title: "Поранення / інвалідність",
        steps: ["1) Медичні документи", "2) Направлення", "3) Рішення комісії"],
        docs: ["Виписки", "Медкарта", "Направлення (заглушка)"],
        tags: ["Інвалідність"],
      },
      {
        id: "vlk",
        title: "ВЛК",
        steps: ["1) Підготовка", "2) Проходження", "3) Фіксація результату"],
        docs: ["Медичні документи", "Заяви", "Направлення"],
        tags: ["ВЛК"],
      },
      {
        id: "msek",
        title: "МСЕК / експертні команди",
        steps: ["1) Пакет документів", "2) Розгляд", "3) Оскарження (за потреби)"],
        docs: ["Виписки", "Направлення", "Заява (заглушка)"],
        tags: ["МСЕК"],
      },
    ],
    updates: ["Оновлення сум та строків — заглушка", "Шаблони документів — у підготовці"],
    categories: [
      {
        id: "benefits",
        title: "Пільги та гарантії для УБД",
        items: [
          {
            id: "benefits-med",
            title: "Медицина / реабілітація",
            description: "Хто має право, що потрібно, куди звертатися.",
            tags: ["УБД", "Медицина"],
            brief: "Короткий опис доступних пільг (заглушка).",
            steps: ["1) Підготувати документи", "2) Подати заяву", "3) Отримати рішення"],
            docs: ["Паспорт", "ІПН", "Підтвердження УБД"],
            contacts: ["ЦНАП (заглушка)", "Соцзахист (заглушка)"],
            sources: ["Офіційне джерело (заглушка)"],
            mistakes: ["Неповний пакет документів", "Невірна адреса подачі"],
          },
        ],
      },
      {
        id: "payments",
        title: "Виплати (УБД / сім’ям / інші)",
        items: [
          {
            id: "payment-once",
            title: "Разові виплати",
            description: "Умови, пакет документів, строки розгляду.",
            tags: ["Виплати"],
            brief: "Опис разових виплат (заглушка).",
            steps: ["1) Визначити підставу", "2) Підготувати пакет", "3) Подати заяву"],
            docs: ["Паспорт", "ІПН", "Підтвердження"],
            contacts: ["Соцзахист (заглушка)"],
            sources: ["Офіційне джерело (заглушка)"],
          },
        ],
      },
      {
        id: "disability",
        title: "Інвалідність внаслідок війни",
        items: [
          {
            id: "disability-status",
            title: "Статус та пільги",
            description: "Що дає статус та як його отримати.",
            tags: ["Інвалідність"],
            brief: "Пояснення статусу (заглушка).",
            steps: ["1) Підготувати документи", "2) Розгляд комісії", "3) Отримати рішення"],
            docs: ["Виписки", "Направлення", "Довідки"],
            contacts: ["МСЕК/експертна команда (заглушка)"],
            sources: ["Офіційне джерело (заглушка)"],
            mistakes: ["Відсутні медичні підтвердження", "Пропущені строки"],
          },
        ],
      },
      {
        id: "vlk",
        title: "ВЛК — інструкції",
        items: [
          {
            id: "vlk-prep",
            title: "Підготовка та права на ВЛК",
            description: "Що вимагати та що фіксувати.",
            tags: ["ВЛК"],
            brief: "Юридичний маршрут (заглушка).",
            steps: ["1) Чеклист підготовки", "2) Проходження", "3) Фіксація результату"],
            docs: ["Медичні документи", "Заяви", "Направлення"],
            contacts: ["ВЛК (заглушка)"],
            sources: ["Офіційне джерело (заглушка)"],
          },
        ],
      },
      {
        id: "msek",
        title: "МСЕК / експертні команди",
        items: [
          {
            id: "msek-process",
            title: "Як проходить розгляд",
            description: "Пакет документів та оскарження.",
            tags: ["МСЕК"],
            brief: "Пояснення простими словами (заглушка).",
            steps: ["1) Підготовка пакету", "2) Розгляд", "3) Оскарження (за потреби)"],
            docs: ["Виписки", "Направлення", "Заяви"],
            contacts: ["Експертні команди (заглушка)"],
            sources: ["Офіційне джерело (заглушка)"],
            mistakes: ["Неповний пакет", "Відсутні підтвердження"],
          },
        ],
      },
      {
        id: "contacts",
        title: "Контакти та ресурси",
        items: [
          {
            id: "contacts-main",
            title: "Держструктури та гарячі лінії",
            description: "Коли і куди звертатися.",
            tags: ["Контакти"],
            brief: "Коротка навігація (заглушка).",
            steps: ["1) Визначити питання", "2) Зателефонувати", "3) Зафіксувати звернення"],
            docs: ["Паспорт", "ІПН"],
            contacts: ["Мінветеранів (заглушка)", "ЦНАП (заглушка)", "Соцзахист (заглушка)"],
            sources: ["Офіційні ресурси (заглушка)"],
          },
        ],
      },
      {
        id: "templates",
        title: "Шаблони документів (бібліотека)",
        items: [
          {
            id: "templates-main",
            title: "Заяви та звернення",
            description: "Шаблони заяв, скарг і супровідних листів.",
            tags: ["Шаблони"],
            brief: "Файли будуть доступні у PDF/DOC (заглушка).",
            steps: ["1) Обрати шаблон", "2) Заповнити", "3) Подати"],
            docs: ["Шаблон документа (заглушка)"],
            contacts: ["Канцелярія/ЦНАП (заглушка)"],
            sources: ["Офіційні зразки (заглушка)"],
          },
        ],
      },
    ],
  },
  en: {
    title: "Guide",
    subtitle: "Quick routes and a complete library for veterans and families.",
    quickStartTitle: "Quick start",
    quickStart: [
      {
        id: "ubd",
        title: "Veteran status",
        steps: ["1) Prepare documents", "2) Submit package", "3) Receive decision"],
        docs: ["Passport", "Tax ID", "Proof of service", "Application (placeholder)"],
        tags: ["Status"],
      },
    ],
    updates: ["Updates — placeholder"],
    categories: [],
  },
};
