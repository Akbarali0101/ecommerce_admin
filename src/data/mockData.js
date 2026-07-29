/**
 * BU FAYL FAQAT UI NI CHIROYLI KO'RSATISH UCHUN MOCK (statik) MA'LUMOTLAR.
 * Talabalar bu ma'lumotlarni RTK Query orqali backend'dan kelayotgan
 * haqiqiy ma'lumotlar bilan almashtirishlari kerak.
 */

export const mockCategories = [
  { _id: "c1", name: "Elektronika", slug: "elektronika", image: "" },
  { _id: "c2", name: "Kiyim-kechak", slug: "kiyim-kechak", image: "" },
  { _id: "c3", name: "Uy jihozlari", slug: "uy-jihozlari", image: "" },
  { _id: "c4", name: "Sport", slug: "sport", image: "" },
  { _id: "c5", name: "Go'zallik", slug: "gozallik", image: "" },
  { _id: "c6", name: "Bolalar dunyosi", slug: "bolalar", image: "" },
];

export const mockProducts = [
  {
    _id: "p1",
    title: "iPhone 15 Pro 128GB Titanium",
    price: 13500000,
    discount: 5,
    brand: "Apple",
    rating: 4.8,
    numReviews: 124,
    stock: 15,
    images: [],
    category: "c1",
  },
  {
    _id: "p2",
    title: "Samsung Galaxy S24 Ultra 256GB",
    price: 12800000,
    discount: 0,
    brand: "Samsung",
    rating: 4.6,
    numReviews: 89,
    stock: 20,
    images: [],
    category: "c1",
  },
  {
    _id: "p3",
    title: "Erkaklar sport krossovkasi Air Max",
    price: 450000,
    discount: 15,
    brand: "Nike",
    rating: 4.4,
    numReviews: 56,
    stock: 50,
    images: [],
    category: "c2",
  },
  {
    _id: "p4",
    title: "Robot changyutgich aqlli xaritalash",
    price: 2200000,
    discount: 10,
    brand: "Xiaomi",
    rating: 4.5,
    numReviews: 34,
    stock: 12,
    images: [],
    category: "c3",
  },
  {
    _id: "p5",
    title: "Yoga gilamchasi anti-sirpanuvchi",
    price: 180000,
    discount: 0,
    brand: "Decathlon",
    rating: 4.2,
    numReviews: 21,
    stock: 40,
    images: [],
    category: "c4",
  },
  {
    _id: "p6",
    title: "Simsiz quloqchin Bluetooth 5.3",
    price: 320000,
    discount: 20,
    brand: "JBL",
    rating: 4.7,
    numReviews: 210,
    stock: 60,
    images: [],
    category: "c1",
  },
  {
    _id: "p7",
    title: "Ayollar yozgi ko'ylagi",
    price: 220000,
    discount: 0,
    brand: "Zara",
    rating: 4.1,
    numReviews: 18,
    stock: 30,
    images: [],
    category: "c2",
  },
  {
    _id: "p8",
    title: "Aqlli soat fitnes trekeri",
    price: 690000,
    discount: 12,
    brand: "Amazfit",
    rating: 4.3,
    numReviews: 77,
    stock: 25,
    images: [],
    category: "c1",
  },
];

export const mockBanners = [
  { _id: "b1", title: "Yozgi chegirmalar -50% gacha", image: "", link: "#" },
  { _id: "b2", title: "Yangi iPhone 15 seriyasi", image: "", link: "#" },
  { _id: "b3", title: "Sport tovarlariga maxsus narxlar", image: "", link: "#" },
];

export const mockOrders = [
  {
    _id: "o1",
    items: [{ title: "iPhone 15 Pro", quantity: 1, price: 12825000 }],
    totalPrice: 12825000,
    status: "delivered",
    createdAt: "2026-07-10T10:00:00Z",
  },
  {
    _id: "o2",
    items: [
      { title: "Simsiz quloqchin", quantity: 2, price: 256000 },
      { title: "Yoga gilamchasi", quantity: 1, price: 180000 },
    ],
    totalPrice: 692000,
    status: "processing",
    createdAt: "2026-07-18T14:30:00Z",
  },
  {
    _id: "o3",
    items: [{ title: "Robot changyutgich", quantity: 1, price: 1980000 }],
    totalPrice: 1980000,
    status: "pending",
    createdAt: "2026-07-22T09:15:00Z",
  },
];

export const mockUsers = [
  { _id: "u1", name: "Aziz Karimov", email: "aziz@mail.uz", role: "user", createdAt: "2026-05-01" },
  { _id: "u2", name: "Malika Yusupova", email: "malika@mail.uz", role: "user", createdAt: "2026-05-14" },
  { _id: "u3", name: "Bosh Admin", email: "admin@shop.uz", role: "admin", createdAt: "2026-01-01" },
];

export const orderStatusLabels = {
  pending: { label: "Kutilmoqda", variant: "outline" },
  processing: { label: "Tayyorlanmoqda", variant: "secondary" },
  shipped: { label: "Jo'natildi", variant: "default" },
  delivered: { label: "Yetkazildi", variant: "success" },
  cancelled: { label: "Bekor qilindi", variant: "destructive" },
};
