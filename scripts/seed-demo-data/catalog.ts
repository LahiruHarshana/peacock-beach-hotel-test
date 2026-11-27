/** Demo content for local development — Unawatuna beach hotel (EN/RU). */

export const SEED_MARKER = "demo" as const;

export const DEMO_MEDIA = [
  { publicId: "peacock/dev/general/seed-hero", file: "public/images/home-hero.jpg", usage: "general" },
  { publicId: "peacock/dev/general/seed-story", file: "public/images/home-story.jpg", usage: "general" },
  { publicId: "peacock/dev/restaurant/seed-dining", file: "public/images/home-restaurant.jpg", usage: "restaurant" },
  { publicId: "peacock/dev/general/seed-interior", file: "public/images/section-interior.jpg", usage: "general" },
  { publicId: "peacock/dev/general/seed-terrace", file: "public/images/section-terrace.jpg", usage: "general" },
  { publicId: "peacock/dev/rooms/seed-cliff", file: "public/images/place-cliff.jpg", usage: "rooms" },
  { publicId: "peacock/dev/rooms/seed-alpine", file: "public/images/place-alpine.jpg", usage: "rooms" },
  { publicId: "peacock/dev/rooms/seed-courtyard", file: "public/images/place-courtyard.jpg", usage: "rooms" },
  { publicId: "peacock/dev/rooms/seed-ocean-suite", file: "public/images/gallery-1.jpg", usage: "rooms" },
  { publicId: "peacock/dev/rooms/seed-garden-deluxe", file: "public/images/gallery-2.jpg", usage: "rooms" },
  { publicId: "peacock/dev/events/seed-monsoon", file: "public/images/gallery-3.jpg", usage: "events" },
  { publicId: "peacock/dev/events/seed-celebration", file: "public/images/gallery-4.jpg", usage: "events" },
  { publicId: "peacock/dev/general/seed-closer", file: "public/images/closer-house.png", usage: "general" },
] as const;

export const DEMO_SITE_SETTINGS = {
  brandName: {
    en: "Peacock Beach Hotel",
    ru: "Peacock Beach Hotel",
  },
  metaDescription: {
    en: "Beachfront rooms and dining in Unawatuna. Enquire directly for availability — no instant booking on this website.",
    ru: "Номера и ресторан у пляжа в Унаватуне. Уточняйте наличие напрямую — мгновенное бронирование на сайте недоступно.",
  },
  whatsappE164: "+94771234567",
  telegramUrl: "https://t.me/peacockbeachhotel",
  address: {
    en: "Peacock Beach Hotel, Matara Road, Unawatuna, Galle 80600, Sri Lanka",
    ru: "Peacock Beach Hotel, Matara Road, Unawatuna, Galle 80600, Шри-Ланка",
  },
  mapUrl: "https://maps.google.com/?q=Unawatuna+Beach+Sri+Lanka",
  aboutBody: {
    en: "Peacock Beach Hotel sits on the Unawatuna shoreline — a small family-run address where mornings begin with sea air and evenings slow down on the terrace. We welcome direct enquiries for rooms and dining; our team confirms availability personally.",
    ru: "Peacock Beach Hotel на берегу Унаватуны — небольшой семейный отель, где утро начинается с морского бreeze, а вечер не спешит уйти с террасы. Мы принимаем прямые запросы о номерах и ресторане; команда подтверждает наличие лично.",
  },
  restaurantIntro: {
    en: "The beachfront restaurant serves Sri Lankan coastal dishes and seasonal seafood at lunch and dinner. Reserve a table or order from the menu on this site. The bill is paid at the restaurant.",
    ru: "Ресторан у пляжа подаёт прибрежные блюда Шри-Ланки и сезонные морепродукты на обед и ужин. Столик можно забронировать, а блюда заказать на сайте. Счёт оплачивается в ресторане.",
  },
  heroImagePublicId: "peacock/dev/general/seed-hero",
  homeHeroTheme: "dark" as const,
  storyImagePublicId: "peacock/dev/general/seed-story",
  socialImagePublicId: "peacock/dev/general/seed-hero",
  restaurantImagePublicId: "peacock/dev/restaurant/seed-dining",
  galleryRoomsImagePublicId: "peacock/dev/rooms/seed-ocean-suite",
  galleryRestaurantImagePublicId: "peacock/dev/restaurant/seed-dining",
  galleryEventsImagePublicId: "peacock/dev/events/seed-monsoon",
  galleryAboutImagePublicId: "peacock/dev/general/seed-story",
  reviewsImagePublicId: "peacock/dev/general/seed-interior",
  closerImagePublicId: "peacock/dev/general/seed-closer",
} as const;

export const DEMO_ROOMS = [
  {
    slug: "ocean-view-suite",
    sortOrder: 1,
    capacity: 2,
    priceDisplay: 185,
    currency: "USD",
    name: {
      en: "Ocean view suite",
      ru: "Люкс с видом на океан",
    },
    description: {
      en: "A corner suite with floor-to-ceiling windows toward the bay, king bed, and a shaded balcony for late-afternoon tea.",
      ru: "Угловой люкс с панорамными окнами на залив, кровать king size и тенистый балкон для послеобеденного чая.",
    },
    amenities: ["Sea view", "Air conditioning", "Balcony", "Breakfast available"],
    imagePublicId: "peacock/dev/rooms/seed-ocean-suite",
  },
  {
    slug: "garden-deluxe",
    sortOrder: 2,
    capacity: 3,
    priceDisplay: 142,
    currency: "USD",
    name: {
      en: "Garden deluxe",
      ru: "Делюкс с видом на сад",
    },
    description: {
      en: "Ground-floor room opening to the courtyard garden — quiet after dusk, with space for a rollaway bed on request.",
      ru: "Номер на первом этаже с выходом во внутренний сад — тихо после заката, по запросу возможна дополнительная кровать.",
    },
    amenities: ["Garden view", "Air conditioning", "Shower", "Desk"],
    imagePublicId: "peacock/dev/rooms/seed-garden-deluxe",
  },
  {
    slug: "family-beach-room",
    sortOrder: 3,
    capacity: 4,
    priceDisplay: 168,
    currency: "USD",
    name: {
      en: "Family beach room",
      ru: "Семейный номер у пляжа",
    },
    description: {
      en: "Two connecting zones for families — one queen and twin beds, short walk to the sand, and room for beach gear by the door.",
      ru: "Две смежные зоны для семьи — одна queen и две односпальные кровати, короткая дорога к пляжу, место для пляжных вещей у двери.",
    },
    amenities: ["Beach access", "Air conditioning", "Mini fridge", "Safe"],
    imagePublicId: "peacock/dev/rooms/seed-courtyard",
  },
] as const;

export function demoEvents(now: Date) {
  const upcomingStart = new Date(now);
  upcomingStart.setDate(upcomingStart.getDate() + 21);
  const upcomingEnd = new Date(upcomingStart);
  upcomingEnd.setDate(upcomingEnd.getDate() + 14);

  const pastEnd = new Date(now);
  pastEnd.setDate(pastEnd.getDate() - 7);
  const pastStart = new Date(pastEnd);
  pastStart.setDate(pastStart.getDate() - 10);

  return [
    {
      slug: "monsoon-wellness-week",
      status: "PUBLISHED" as const,
      startAt: upcomingStart,
      endAt: upcomingEnd,
      heroPublicId: "peacock/dev/events/seed-monsoon",
      title: {
        en: "Monsoon wellness week",
        ru: "Неделя wellness в муссон",
      },
      description: {
        en: "Morning yoga on the terrace, herbal teas at sunset, and a reduced menu focused on light coastal dishes.",
        ru: "Утренняя йога на террасе, травяной чай на закате и облегчённое меню с прибрежными блюдами.",
      },
    },
    {
      slug: "full-moon-dinner",
      status: "PUBLISHED" as const,
      startAt: pastStart,
      endAt: pastEnd,
      heroPublicId: "peacock/dev/events/seed-celebration",
      title: {
        en: "Full moon terrace dinner",
        ru: "Ужин на террасе в полнолуние",
      },
      description: {
        en: "A candlelit set menu with live acoustic music — past guests can ask our team for the next date.",
        ru: "Ужин при свечах с акустической музыкой — гости могут уточнить у команды дату следующего вечера.",
      },
    },
    {
      slug: "winter-escape-draft",
      status: "DRAFT" as const,
      startAt: upcomingEnd,
      endAt: new Date(upcomingEnd.getTime() + 7 * 86400000),
      heroPublicId: "peacock/dev/events/seed-celebration",
      title: {
        en: "Winter escape package",
        ru: "Зимний пакет отдыха",
      },
      description: {
        en: "Draft copy for a longer-stay offer — publish after rates are confirmed with management.",
        ru: "Черновик предложения для длительного проживания — опубликовать после согласования тарифов.",
      },
    },
  ];
}

export const DEMO_REVIEWS = {
  approved: [
    {
      authorDisplayName: "Anna K.",
      rating: 5,
      locale: "en" as const,
      text: "Quiet room, friendly staff, and the terrace restaurant at sunset was the highlight of our trip.",
    },
    {
      authorDisplayName: "Dmitry V.",
      rating: 4,
      locale: "ru" as const,
      text: "Спокойный отель у пляжа. Номер чистый, завтраки простые, но свежие. Запрос о бронировании ответили быстро в WhatsApp.",
    },
    {
      authorDisplayName: "James & Priya",
      rating: 5,
      locale: "en" as const,
      text: "We liked the direct enquiry process — no pressure to book online, and the team helped us choose dates that worked.",
    },
  ],
  pending: [
    {
      authorDisplayName: "Elena M.",
      rating: 5,
      locale: "ru" as const,
      text: "Очень понравился вид с балкона и атмосфера у бассейна. Хотела бы вернуться осенью.",
    },
    {
      authorDisplayName: "Tom H.",
      locale: "en" as const,
      text: "Great location for Unawatuna walks. Room was ready early when we arrived from the airport.",
    },
  ],
};

export const DEMO_STAFF = [
  { email: "editor@peacockbeach.local", name: "Content Editor", role: "EDITOR" as const },
  { email: "moderator@peacockbeach.local", name: "Review Moderator", role: "REVIEW_MODERATOR" as const },
];

const spice = {
  id: "spice",
  name: { en: "Spice", ru: "Острота" },
  required: true,
  choices: [
    { id: "mild", name: { en: "Mild", ru: "Мягко" }, priceDelta: 0 },
    { id: "medium", name: { en: "Medium", ru: "Средне" }, priceDelta: 0 },
    { id: "hot", name: { en: "Hot", ru: "Остро" }, priceDelta: 0 },
  ],
};

export const DEMO_DINING_CONFIG = {
  _id: "default" as const,
  timezone: "Asia/Colombo" as const,
  openTime: "12:00",
  closeTime: "22:00",
  slotMinutes: 30,
  durationMinutes: 90,
  maxPartySize: 12,
};

export const DEMO_TABLES = [
  { key: "terrace-1", name: "Terrace 1", seats: 2, sortOrder: 1 },
  { key: "terrace-2", name: "Terrace 2", seats: 2, sortOrder: 2 },
  { key: "beach-1", name: "Beach 1", seats: 4, sortOrder: 3 },
  { key: "beach-2", name: "Beach 2", seats: 4, sortOrder: 4 },
  { key: "garden", name: "Garden", seats: 4, sortOrder: 5 },
  { key: "family", name: "Family", seats: 8, sortOrder: 6 },
  { key: "bar", name: "Bar counter", seats: 2, sortOrder: 7, active: false },
] as const;

export const DEMO_MENU = [
  {
    key: "hoppers",
    name: { en: "Egg hoppers", ru: "Хопперы с яйцом" },
    description: { en: "Crisp rice-flour bowls with a soft egg, served with pol sambol.", ru: "Хрустящие рисовые чаши с яйцом и кокосовым самболом." },
    price: 8,
    category: "food" as const,
    sortOrder: 1,
    optionGroups: [spice],
  },
  {
    key: "ambul-thiyal",
    name: { en: "Fish ambul thiyal", ru: "Рыба амбул тиял" },
    description: { en: "Sour fish curry with goraka, black pepper, and curry leaves.", ru: "Кислая рыбная карри с горакой, чёрным перцем и карри-листьями." },
    price: 18,
    category: "food" as const,
    sortOrder: 2,
    optionGroups: [spice],
  },
  {
    key: "prawn",
    name: { en: "Prawn curry", ru: "Карри из креветок" },
    description: { en: "Coastal prawns in coconut milk, roasted chilli, and lime.", ru: "Креветки в кокосовом молоке, жареном чили и лайме." },
    price: 22,
    category: "food" as const,
    sortOrder: 3,
    optionGroups: [spice],
  },
  {
    key: "catch",
    name: { en: "Grilled catch", ru: "Рыба на гриле" },
    description: { en: "Whole fish from the morning boats, grilled with lime and salt.", ru: "Целая рыба утреннего улова, на гриле с лаймом и солью." },
    price: 26,
    category: "food" as const,
    sortOrder: 4,
    optionGroups: [
      {
        id: "size",
        name: { en: "Size", ru: "Размер" },
        required: true,
        choices: [
          { id: "regular", name: { en: "Regular", ru: "Обычная" }, priceDelta: 0 },
          { id: "large", name: { en: "Large", ru: "Большая" }, priceDelta: 8 },
        ],
      },
    ],
  },
  {
    key: "kottu",
    name: { en: "Vegetable kottu", ru: "Овощной котту" },
    description: { en: "Chopped godamba roti with vegetables, egg, and curry gravy.", ru: "Рубленая роти годамба с овощами, яйцом и подливой карри." },
    price: 12,
    category: "food" as const,
    sortOrder: 5,
    optionGroups: [spice],
  },
  {
    key: "rice",
    name: { en: "Rice and three curries", ru: "Рис и три карри" },
    description: { en: "Red rice with dhal, a vegetable curry, and mallung.", ru: "Красный рис с далом, овощным карри и маллунгом." },
    price: 14,
    category: "food" as const,
    sortOrder: 6,
    optionGroups: [],
  },
  {
    key: "salad",
    name: { en: "Green mango salad", ru: "Салат из зелёного манго" },
    description: { en: "Shredded mango, chilli, shallot, and lime.", ru: "Тёртая манго, чили, лук-шалот и лайм." },
    price: 9,
    category: "food" as const,
    sortOrder: 7,
    optionGroups: [],
  },
  {
    key: "coconut",
    name: { en: "King coconut", ru: "Королевский кокос" },
    description: { en: "Chilled thambili, opened to order.", ru: "Охлаждённый тамбили, открывают при заказе." },
    price: 4,
    category: "drink" as const,
    sortOrder: 1,
    optionGroups: [],
  },
  {
    key: "lime",
    name: { en: "Lime soda", ru: "Лаймовый содовый" },
    description: { en: "Fresh lime, soda, and a pinch of salt.", ru: "Свежий лайм, содовая и щепотка соли." },
    price: 5,
    category: "drink" as const,
    sortOrder: 2,
    optionGroups: [
      {
        id: "sweet",
        name: { en: "Style", ru: "Вариант" },
        required: false,
        choices: [
          { id: "plain", name: { en: "Plain", ru: "Без сахара" }, priceDelta: 0 },
          { id: "sweet", name: { en: "Sweet", ru: "Сладкий" }, priceDelta: 0 },
        ],
      },
    ],
  },
  {
    key: "tea",
    name: { en: "Ceylon iced tea", ru: "Цейлонский холодный чай" },
    description: { en: "Brewed black tea over ice with lemon.", ru: "Чёрный чай со льдом и лимоном." },
    price: 4,
    category: "drink" as const,
    sortOrder: 3,
    optionGroups: [],
  },
  {
    key: "ginger",
    name: { en: "Ginger beer", ru: "Имбирный эль" },
    description: { en: "House ginger beer, sharp and cold.", ru: "Домашний имбирный напиток, острый и холодный." },
    price: 5,
    category: "drink" as const,
    sortOrder: 4,
    optionGroups: [],
  },
  {
    key: "papaya",
    name: { en: "Papaya juice", ru: "Сок папайи" },
    description: { en: "Pressed ripe papaya, no added sugar.", ru: "Спелая папайя, без добавленного сахара." },
    price: 6,
    category: "drink" as const,
    sortOrder: 5,
    optionGroups: [],
  },
  {
    key: "tasting",
    name: { en: "Chef's tasting plate", ru: "Дегустационное блюдо шефа" },
    description: { en: "A short menu that changes with the boats. Not on the public menu yet.", ru: "Короткое меню, которое меняется с уловом. Пока не на сайте." },
    price: 32,
    category: "food" as const,
    sortOrder: 20,
    published: false,
    optionGroups: [],
  },
] as const;
