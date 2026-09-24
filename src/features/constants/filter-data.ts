import type { Language } from "@/shared/i18n";

export const getCountriesData = (language: Language) => {
  const countries = [
    { value: "Uzbekistan", flag: "🇺🇿", uz: "O'zbekiston", ru: "Узбекистан" },
    { value: "Kazakhstan", flag: "🇰🇿", uz: "Qozog'iston", ru: "Казахстан" },
    { value: "Tajikistan", flag: "🇹🇯", uz: "Tojikiston", ru: "Таджикистан" },
    { value: "Russia", flag: "🇷🇺", uz: "Rossiya", ru: "Россия" },
    { value: "Turkey", flag: "🇹🇷", uz: "Turkiya", ru: "Турция" },
    { value: "Kyrgyzstan", flag: "🇰🇬", uz: "Qirg'iziston", ru: "Кыргызстан" },
  ];

  return countries.map(({ value, flag, uz, ru }) => ({
    value,
    label: `${flag} ${language === "ru" ? ru : uz}`,
  }));
};

export const getPhoneCodesData = (language: Language) => [
  {
    group: language === "ru" ? "Мобильные коды" : "Mobil kodlar",
    items: ["90", "91", "93", "94", "95", "97", "98", "99", "33", "88"].map(
      (value) => ({ value, label: value }),
    ),
  },
  {
    group:
      language === "ru"
        ? "Городские коды (регионы)"
        : "Shahar kodlari (hududlar)",
    items: [
      { value: "71", uz: "Toshkent", ru: "Ташкент" },
      { value: "55", uz: "IP telefoniya", ru: "IP-телефония" },
      { value: "66", uz: "Samarqand", ru: "Самарканд" },
      { value: "65", uz: "Buxoro", ru: "Бухара" },
      { value: "69", uz: "Namangan", ru: "Наманган" },
      { value: "73", uz: "Farg'ona", ru: "Фергана" },
      { value: "74", uz: "Andijon", ru: "Андижан" },
      { value: "62", uz: "Xorazm", ru: "Хорезм" },
      { value: "61", uz: "Qoraqalpog'iston", ru: "Каракалпакстан" },
    ].map(({ value, uz, ru }) => ({
      value,
      label: `${value} — ${language === "ru" ? ru : uz}`,
    })),
  },
];
