import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import 'dotenv/config';

// Models
import { User } from '../src/modules/users/models/User.model';
import { Category } from '../src/modules/categories/models/Category.model';
import { Product } from '../src/modules/products/models/Product.model';
import { ProductVariant } from '../src/modules/products/models/ProductVariant.model';
import { Inventory } from '../src/modules/inventory/models/Inventory.model';
import { Order } from '../src/modules/orders/models/Order.model';
import { Coupon } from '../src/modules/coupons/models/Coupon.model';
import { Review } from '../src/modules/reviews/models/Review.model';
import { Role } from '../src/modules/auth/models/Role.model';
import { Media } from '../src/modules/media/models/Media.model';

// Seed Configuration
faker.seed(123); // Deterministic seed
const NUM_PRODUCTS = 100;
const NUM_ORDERS = 50;

async function seedUsers() {
  console.log('Seeding Roles...');
  const rolesList = ['super_admin', 'admin', 'manager', 'staff', 'customer'];
  const roleDocs: Record<string, any> = {};
  for (const roleName of rolesList) {
    const role = await Role.findOneAndUpdate(
      { name: roleName },
      { name: roleName, description: `System ${roleName} role` },
      { upsert: true, new: true }
    );
    roleDocs[roleName] = role?._id;
  }

  console.log('Seeding Users...');
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  const users = [
    { firstName: 'Super', lastName: 'Admin', email: 'superadmin@shobhoday.com', password, roles: [roleDocs['super_admin']] },
    { firstName: 'Admin', lastName: 'One', email: 'admin@shobhoday.com', password, roles: [roleDocs['admin']] },
    { firstName: 'Manager', lastName: 'One', email: 'manager@shobhoday.com', password, roles: [roleDocs['manager']] },
    { firstName: 'Staff', lastName: 'One', email: 'staff@shobhoday.com', password, roles: [roleDocs['staff']] }
  ];

  for (const u of users) {
    await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
  }

  // Generate 20 regular customers
  for (let i = 0; i < 20; i++) {
    await User.findOneAndUpdate(
      { email: `customer${i}@example.com` },
      {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `customer${i}@example.com`,
        password,
        roles: [roleDocs['customer']],
        phone: faker.phone.number()
      },
      { upsert: true }
    );
  }
}

async function seedRealCatalog() {
  console.log('Clearing old catalog...');
  await Product.deleteMany({});
  await ProductVariant.deleteMany({});
  await Inventory.deleteMany({});
  await Category.deleteMany({});
  await Media.deleteMany({});
  await Review.deleteMany({});
  await Coupon.deleteMany({});

  const adminUser = await User.findOne({ email: 'superadmin@shobhoday.com' });

  // 1. Seed Categories with specific images
  const categoriesData = [
    { name: 'Casual Wear', slug: 'casual-wear', description: 'Everyday casual wear', img: '/images/category-casual.jpg' },
    { name: 'Formal Wear', slug: 'formal-wear', description: 'Elegant formal attire', img: '/images/category-formal.jpg' },
    { name: 'Kurta Sets', slug: 'kurta-sets', description: 'Traditional kurta collections', img: '/images/category-kurta.jpg' },
    { name: 'Sherwani', slug: 'sherwani', description: 'Premium sherwanis for special occasions', img: '/images/category-sherwani.jpg' },
    { name: 'Wedding Collection', slug: 'wedding-collection', description: 'Exclusive wedding wear', img: '/images/category-wedding.jpg' }
  ];

  console.log('Seeding Categories...');
  const savedCategories: any[] = [];
  for (let i = 0; i < categoriesData.length; i++) {
    const c = categoriesData[i];
    // Create media for category
    const media = await Media.create({
      publicId: `cat-img-${i}`,
      url: c.img,
      secureUrl: c.img,
      folder: 'categories',
      mediaType: 'image/jpeg',
      size: 102400,
      uploadedBy: adminUser?._id
    });

    const cat = await Category.create({
      name: c.name,
      slug: c.slug,
      description: c.description,
      thumbnailMedia: media._id
    });
    savedCategories.push(cat);
  }

  // 2. Seed Products using ALL images
  console.log('Seeding Products...');
  const allImages = [
    'brand-store-interior.jpg',
    'category-casual.jpg',
    'category-formal.jpg',
    'category-kurta.jpg',
    'category-sherwani.jpg',
    'category-wedding.jpg',
    'hero-carousel-1.jpg',
    'hero-carousel-2.jpg',
    'hero-carousel-3.jpg',
    'hero-carousel-4.jpg',
    'hero-carousel-5.jpg',
    'hero-carousel-6.jpg',
    'hero-carousel-7.jpg',
    'hero-carousel-8.jpg',
    'instagram-1.jpg',
    'instagram-2.jpg',
    'instagram-3.jpg',
    'instagram-4.jpg',
    'instagram-5.jpg',
    'instagram-6.jpg',
    'lookbook-1.jpg',
    'lookbook-2.jpg',
    'lookbook-3.jpg'
  ];

  for (let i = 0; i < allImages.length; i++) {
    const category = savedCategories[i % savedCategories.length];
    const imgName = allImages[i];
    
    // Use absolute URL to the Storefront so Admin Dashboard can load them too!
    const absoluteUrl = `http://localhost:5174/images/${imgName}`;

    const media = await Media.create({
      publicId: `prod-img-${i}`,
      url: absoluteUrl,
      secureUrl: absoluteUrl,
      folder: 'products',
      mediaType: 'image/jpeg',
      size: 150000,
      uploadedBy: adminUser?._id
    });

    const title = imgName.replace('.jpg', '').replace(/-/g, ' ').toUpperCase();
    const slug = imgName.replace('.jpg', '');

    const product = await Product.create({
      title,
      slug,
      longDescription: `This is the ${title} piece. Perfect for your wardrobe. High quality fabric and premium stitching.`,
      shortDescription: `Premium ${title}.`,
      category: category._id,
      brand: 'Shobhoday',
      tags: ['premium', 'new-arrival'],
      media: [media._id],
      isActive: true
    });

    const sku = `SKU-${slug.toUpperCase().substring(0, 8)}-${i}`;
    const variant = await ProductVariant.create({
      product: product._id,
      sku,
      compareAtPrice: 5000 + (i * 100),
      price: 3500 + (i * 50),
      size: 'M',
      media: [media._id]
    });

    await Inventory.create({
      variant: variant._id,
      warehouseLocation: 'Mumbai',
      availableStock: 50,
      reservedStock: 0
    });
  }
}

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to DB');

    await seedUsers();
    await seedRealCatalog();
    
    console.log('Database seeded with REAL images and categories!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

runSeed();
