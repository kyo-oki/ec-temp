# E-commerce Site Template

A modern, responsive e-commerce template built with React, TypeScript, and Tailwind CSS. This template provides a complete foundation for building online stores with a professional design and full functionality.

## Features

### Core E-commerce Features

- **Shopping Cart** - Full cart functionality with persistent storage
- **Product Catalog** - Browse and filter products by category and price
- **Product Detail Pages** - Comprehensive product information with image galleries
- **Checkout Process** - Complete order form with customer information
- **Responsive Design** - Mobile-first design that works on all devices
- **Search & Filtering** - Advanced product search and filtering capabilities

### Technical Features

- **Modern React** - Built with React 18 and TypeScript
- **State Management** - Context API for cart and global state
- **Routing** - React Router for navigation
- **UI Components** - Radix UI components with custom styling
- **Styling** - Tailwind CSS for utility-first styling
- **Image Handling** - Optimized image loading with fallbacks
- **Local Storage** - Cart persistence across sessions

### Template Features

- **Easy Customization** - Centralized configuration system
- **Brand Customization** - Easy logo, colors, and content updates
- **SEO Ready** - Meta tags and structured data
- **Performance Optimized** - Fast loading and smooth animations
- **Accessibility** - WCAG compliant components

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── ImageWithFallback.tsx # Image component with error handling
│   ├── Header.tsx      # Site header with navigation
│   ├── Footer.tsx      # Site footer
│   ├── ProductCard.tsx # Product display component
│   └── ShoppingCart.tsx # Cart sidebar component
├── contexts/           # React contexts for state management
│   └── CartContext.tsx # Shopping cart state management
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── ShopPage.tsx    # Product catalog
│   ├── ProductDetailPage.tsx # Individual product page
│   ├── OrderFormPage.tsx # Checkout page
│   └── ...             # Other pages
├── config/             # Configuration files
│   └── site.ts         # Site configuration and settings
└── styles/             # Global styles
    └── globals.css     # Global CSS styles
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone or download the template**

   ```bash
   git clone <your-repo-url>
   cd e-commerce-template
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Customization

### 1. Site Configuration

Edit `src/config/site.ts` to customize:

- **Site Information**: Name, description, contact details
- **Branding**: Logo, colors, social media links
- **Currency**: Symbol, code, locale settings
- **Shipping**: Rates and thresholds
- **Features**: Enable/disable specific functionality

```typescript
export const siteConfig = {
  name: "Your Store Name",
  description: "Your store description",
  url: "https://yourstore.com",
  // ... more configuration options
};
```

### 2. Styling and Branding

#### Colors

Update the color scheme in `tailwind.config.js` or use CSS custom properties:

```css
:root {
  --primary: #3b82f6;
  --secondary: #1e40af;
  --accent: #f59e0b;
}
```

#### Logo

Replace the logo component in `src/components/Logo.tsx` or update the configuration:

```typescript
logo: {
  text: "Your Store",
  icon: "🏪", // or use an actual logo component
}
```

### 3. Product Data

#### Adding Products

Update the product data in your pages or create a data service:

```typescript
const products = [
  {
    id: "1",
    name: "Product Name",
    price: 29.99,
    category: "Category",
    image: "https://example.com/image.jpg",
    // ... more product properties
  },
];
```

#### Product Categories

Update categories in `src/config/site.ts`:

```typescript
export const productCategories = [
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "clothing", name: "Clothing", icon: "👕" },
  // ... more categories
];
```

### 4. Pages and Content

#### Homepage

Customize `src/pages/HomePage.tsx`:

- Hero section content
- Featured products
- Promotional banners
- Customer testimonials

#### Shop Page

Modify `src/pages/ShopPage.tsx`:

- Product grid layout
- Filter options
- Search functionality
- Pagination

#### Product Detail Page

Update `src/pages/ProductDetailPage.tsx`:

- Product information layout
- Image gallery
- Specifications
- Reviews and ratings

## Advanced Configuration

### Adding New Features

#### 1. User Authentication

Add authentication context and components:

```typescript
// src/contexts/AuthContext.tsx
export function AuthProvider({ children }) {
  // Authentication logic
}
```

#### 2. Payment Integration

Integrate with payment providers:

```typescript
// src/services/payment.ts
export const processPayment = async (orderData) => {
  // Payment processing logic
};
```

#### 3. Admin Panel

Create admin components for product management:

```typescript
// src/pages/AdminPage.tsx
export function AdminPage() {
  // Admin interface
}
```

### Database Integration

#### 1. API Integration

Create API service files:

```typescript
// src/services/api.ts
export const api = {
  getProducts: () => fetch("/api/products"),
  createOrder: (order) =>
    fetch("/api/orders", { method: "POST", body: JSON.stringify(order) }),
};
```

#### 2. State Management

For complex state, consider Redux or Zustand:

```typescript
// src/store/store.ts
import { create } from "zustand";

export const useStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));
```

## Responsive Design

The template is built mobile-first and includes:

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: Responsive product grids
- **Navigation**: Mobile hamburger menu
- **Touch Interactions**: Optimized for mobile devices

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Other Hosting

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure your server to serve the `index.html` for all routes

## SEO Optimization

### Meta Tags

Update meta tags in `index.html`:

```html
<meta name="description" content="Your store description" />
<meta name="keywords" content="your, keywords, here" />
```

### Structured Data

Add JSON-LD structured data for products:

```typescript
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  price: product.price,
  // ... more structured data
};
```

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## Performance

### Optimization Tips

1. **Image Optimization**: Use WebP format and lazy loading
2. **Code Splitting**: Implement route-based code splitting
3. **Caching**: Set up proper caching headers
4. **CDN**: Use a CDN for static assets

### Monitoring

- Google Analytics
- Core Web Vitals
- Error tracking (Sentry)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This template is available under the MIT License.

## Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Contact the development team

## Updates

To keep your template updated:

1. Check for new releases
2. Review changelog
3. Update dependencies
4. Test thoroughly before deploying

---

**Happy Building!**

This template provides a solid foundation for your e-commerce site. Customize it to match your brand and add the specific features your business needs.
