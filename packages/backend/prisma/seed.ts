import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create sample store
  const store = await prisma.store.upsert({
    where: { slug: 'demo-store' },
    update: {},
    create: {
      name: 'Demo Store',
      slug: 'demo-store',
      subdomain: 'demo',
      ownerId: user.id,
      settings: {
        theme: 'modern',
        currency: 'USD',
        timezone: 'UTC',
      },
    },
  });

  console.log('✅ Created store:', store.name);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        category: 'Electronics',
        images: ['/uploads/headphones-1.jpg', '/uploads/headphones-2.jpg'],
        availableSizes: ['One Size'],
        availableColors: ['Black', 'White', 'Blue'],
        stockQuantity: 50,
        isActive: true,
        storeId: store.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 299.99,
        category: 'Electronics',
        images: ['/uploads/smartwatch-1.jpg'],
        availableSizes: ['Small', 'Medium', 'Large'],
        availableColors: ['Black', 'Silver', 'Gold'],
        stockQuantity: 30,
        isActive: true,
        storeId: store.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug with custom design',
        price: 15.99,
        category: 'Home & Kitchen',
        images: ['/uploads/mug-1.jpg'],
        availableSizes: ['One Size'],
        availableColors: ['White', 'Black', 'Blue'],
        stockQuantity: 100,
        isActive: true,
        storeId: store.id,
      },
    }),
  ]);

  console.log('✅ Created products:', products.length);

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        productId: products[0].id,
        customerName: 'John Doe',
        rating: 5,
        comment: 'Excellent sound quality and comfortable fit!',
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: products[0].id,
        customerName: 'Jane Smith',
        rating: 4,
        comment: 'Great headphones, battery life could be better.',
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: products[1].id,
        customerName: 'Mike Johnson',
        rating: 5,
        comment: 'Perfect smartwatch with all the features I need.',
        isApproved: true,
      },
    }),
  ]);

  console.log('✅ Created reviews:', reviews.length);

  // Create sample blog posts
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'The Future of E-commerce',
        description: 'Exploring trends and innovations in online retail',
        content: 'E-commerce is rapidly evolving with new technologies...',
        category: 'Technology',
        thumbnailUrl: '/uploads/blog-1.jpg',
        isPublished: true,
        storeId: store.id,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Sustainable Shopping Tips',
        description: 'How to make eco-friendly purchasing decisions',
        content: 'Making sustainable choices when shopping online...',
        category: 'Lifestyle',
        thumbnailUrl: '/uploads/blog-2.jpg',
        isPublished: true,
        storeId: store.id,
      },
    }),
  ]);

  console.log('✅ Created blog posts:', blogPosts.length);

  // Create sample FAQs
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all items in original condition.',
        displayOrder: 1,
        storeId: store.id,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days, express shipping takes 1-2 business days.',
        displayOrder: 2,
        storeId: store.id,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you offer international shipping?',
        answer: 'Yes, we ship to most countries worldwide. Shipping costs vary by destination.',
        displayOrder: 3,
        storeId: store.id,
      },
    }),
  ]);

  console.log('✅ Created FAQs:', faqs.length);

  // Create sample about page
  const about = await prisma.about.create({
    data: {
      storeId: store.id,
      philosophy: 'We believe in providing high-quality products that enhance our customers\' lives while maintaining sustainable business practices.',
      vision: 'To become the leading destination for innovative and sustainable consumer products.',
      offerings: {
        categories: ['Electronics', 'Home & Kitchen', 'Fashion'],
        features: ['Free Shipping', '30-Day Returns', '24/7 Support'],
        values: ['Quality', 'Sustainability', 'Customer Service'],
      },
    },
  });

  console.log('✅ Created about page');

  // Create sample promotions
  const promotions = await Promise.all([
    prisma.promotion.create({
      data: {
        title: 'Black Friday Sale',
        description: 'Get up to 50% off on all electronics',
        discountPercentage: 50.00,
        startDate: new Date('2024-11-29'),
        endDate: new Date('2024-12-02'),
        isActive: true,
        storeId: store.id,
      },
    }),
    prisma.promotion.create({
      data: {
        title: 'Summer Collection',
        description: '20% off on all summer items',
        discountPercentage: 20.00,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        isActive: true,
        storeId: store.id,
      },
    }),
  ]);

  console.log('✅ Created promotions:', promotions.length);

  // Create sample contact
  const contact = await prisma.contact.create({
    data: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      subject: 'Product Inquiry',
      message: 'I would like to know more about your wireless headphones. Do you have them in different colors?',
      isRead: false,
      storeId: store.id,
    },
  });

  console.log('✅ Created contact:', contact.id);

  console.log('🎉 Database seeding completed successfully!');
  console.log('📧 Login with: admin@example.com / password123');
  console.log('🏪 Store URL: http://demo.localhost:3000');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
