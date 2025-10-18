// Site configuration - customize these values for your e-commerce site
export const siteConfig = {
  // Basic site information
  name: "ProGear Hub",
  description:
    "Your trusted source for premium sports equipment. Quality gear for athletes of all levels.",
  url: "https://progearhub.com",

  // Branding
  logo: {
    text: "ProGear Hub",
    icon: "🏃", // You can replace with actual logo component
  },

  // Contact information
  contact: {
    email: "support@progearhub.com",
    phone: "+1 (555) 123-4567",
    address: "123 Sports Street, Athletic City, AC 12345",
  },

  // Social media links
  social: {
    facebook: "https://facebook.com/progearhub",
    twitter: "https://twitter.com/progearhub",
    instagram: "https://instagram.com/progearhub",
    youtube: "https://youtube.com/progearhub",
  },

  // Currency and pricing
  currency: {
    symbol: "$",
    code: "USD",
    locale: "en-US",
  },

  // Shipping and taxes
  shipping: {
    freeShippingThreshold: 75, // Free shipping above this amount
    standardRate: 9.99,
    expressRate: 19.99,
  },

  tax: {
    rate: 0.1, // 10% tax rate
    name: "GST",
  },

  // Features to enable/disable
  features: {
    userRegistration: true,
    wishlist: true,
    productReviews: true,
    productComparison: true,
    newsletterSignup: true,
    liveChat: false,
    multiLanguage: false,
  },

  // SEO
  seo: {
    title: "ProGear Hub - Premium Sports Equipment",
    description:
      "Shop the best sports equipment and gear for athletes of all levels. Quality products, fast shipping, and excellent customer service.",
    keywords: [
      "sports equipment",
      "athletic gear",
      "sports gear",
      "fitness equipment",
    ],
  },
};

// Product categories configuration
export const productCategories = [
  {
    id: "soccer",
    name: "Soccer",
    icon: "⚽",
    description: "Soccer balls, cleats, and accessories",
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "🎾",
    description: "Tennis rackets, balls, and court equipment",
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "🏊",
    description: "Swimwear, goggles, and pool accessories",
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: "🏏",
    description: "Cricket bats, balls, and protective gear",
  },
  {
    id: "apparel",
    name: "Apparel",
    icon: "👕",
    description: "Sports jerseys, shorts, and athletic wear",
  },
  {
    id: "gear",
    name: "Training Gear",
    icon: "🏋️",
    description: "Training equipment and fitness gear",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: "🎒",
    description: "Sports bags, water bottles, and accessories",
  },
];

// Navigation menu configuration
export const navigationConfig = [
  { name: "Home", href: "/", showInMobile: true },
  {
    name: "Products",
    href: "/shop",
    showInMobile: true,
    submenu: productCategories.map((cat) => ({
      name: cat.name,
      href: `/shop?category=${cat.id}`,
      icon: cat.icon,
    })),
  },
  { name: "About", href: "/about", showInMobile: true },
  { name: "Blog", href: "/blog", showInMobile: true },
  { name: "Contact", href: "/contact", showInMobile: true },
  { name: "FAQ", href: "/faq", showInMobile: false },
];
