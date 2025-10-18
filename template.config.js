// Template Configuration
// This file contains all the customizable settings for the e-commerce template

module.exports = {
  // Basic site information
  site: {
    name: "ProGear Hub",
    description:
      "Your trusted source for premium sports equipment. Quality gear for athletes of all levels.",
    url: "https://progearhub.com",
    version: "1.0.0",
  },

  // Branding and appearance
  branding: {
    primaryColor: "#3b82f6", // Blue
    secondaryColor: "#1e40af", // Dark blue
    accentColor: "#f59e0b", // Amber
    logo: {
      text: "ProGear Hub",
      icon: "🏃‍♂️",
      type: "text", // "text", "image", or "svg"
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
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
    darkMode: false,
    search: true,
    filters: true,
    sorting: true,
  },

  // E-commerce settings
  ecommerce: {
    currency: {
      symbol: "$",
      code: "USD",
      locale: "en-US",
    },
    shipping: {
      freeShippingThreshold: 75,
      standardRate: 9.99,
      expressRate: 19.99,
      internationalRate: 29.99,
    },
    tax: {
      rate: 0.1,
      name: "GST",
      included: false,
    },
    inventory: {
      trackStock: true,
      lowStockThreshold: 10,
      outOfStockMessage: "Out of Stock",
    },
  },

  // Product categories
  categories: [
    {
      id: "soccer",
      name: "Soccer",
      icon: "⚽",
      description: "Soccer balls, cleats, and accessories",
      featured: true,
    },
    {
      id: "tennis",
      name: "Tennis",
      icon: "🎾",
      description: "Tennis rackets, balls, and court equipment",
      featured: true,
    },
    {
      id: "swimming",
      name: "Swimming",
      icon: "🏊‍♂️",
      description: "Swimwear, goggles, and pool accessories",
      featured: true,
    },
    {
      id: "cricket",
      name: "Cricket",
      icon: "🏏",
      description: "Cricket bats, balls, and protective gear",
      featured: false,
    },
    {
      id: "apparel",
      name: "Apparel",
      icon: "👕",
      description: "Sports jerseys, shorts, and athletic wear",
      featured: true,
    },
    {
      id: "gear",
      name: "Training Gear",
      icon: "🏋️‍♂️",
      description: "Training equipment and fitness gear",
      featured: true,
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: "🎒",
      description: "Sports bags, water bottles, and accessories",
      featured: false,
    },
  ],

  // Navigation menu
  navigation: [
    { name: "Home", href: "/", showInMobile: true, order: 1 },
    {
      name: "Products",
      href: "/shop",
      showInMobile: true,
      order: 2,
      submenu: true, // Will be populated from categories
    },
    { name: "About", href: "/about", showInMobile: true, order: 3 },
    { name: "Blog", href: "/blog", showInMobile: true, order: 4 },
    { name: "Contact", href: "/contact", showInMobile: true, order: 5 },
    { name: "FAQ", href: "/faq", showInMobile: false, order: 6 },
  ],

  // Contact information
  contact: {
    email: "support@progearhub.com",
    phone: "+1 (555) 123-4567",
    address: "123 Sports Street, Athletic City, AC 12345",
    hours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed",
  },

  // Social media links
  social: {
    facebook: "https://facebook.com/progearhub",
    twitter: "https://twitter.com/progearhub",
    instagram: "https://instagram.com/progearhub",
    youtube: "https://youtube.com/progearhub",
    linkedin: "https://linkedin.com/company/progearhub",
  },

  // SEO settings
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
    ogImage: "/og-image.jpg",
    twitterCard: "summary_large_image",
  },

  // Analytics and tracking
  analytics: {
    googleAnalytics: "", // GA4 tracking ID
    googleTagManager: "", // GTM container ID
    facebookPixel: "", // Facebook pixel ID
  },

  // Payment providers
  payments: {
    stripe: {
      enabled: false,
      publishableKey: "",
      webhookSecret: "",
    },
    paypal: {
      enabled: false,
      clientId: "",
    },
    square: {
      enabled: false,
      applicationId: "",
    },
  },

  // Email service
  email: {
    provider: "sendgrid", // "sendgrid", "mailgun", "ses", "smtp"
    apiKey: "",
    fromEmail: "noreply@progearhub.com",
    fromName: "ProGear Hub",
  },

  // Database
  database: {
    type: "local", // "local", "firebase", "supabase", "mongodb", "postgresql"
    url: "",
    apiKey: "",
  },

  // Development settings
  development: {
    hotReload: true,
    sourceMaps: true,
    debugMode: true,
  },

  // Build settings
  build: {
    outputDir: "dist",
    publicPath: "/",
    generateSourceMap: true,
    minify: true,
  },

  // Deployment
  deployment: {
    platform: "vercel", // "vercel", "netlify", "aws", "custom"
    domain: "progearhub.com",
    ssl: true,
    cdn: true,
  },
};
