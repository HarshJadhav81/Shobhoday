import mongoose from 'mongoose';
import { Role } from '../modules/auth/models/Role.model';
import { Permission } from '../modules/auth/models/Permission.model';
import { User } from '../modules/users/models/User.model';
import { config } from 'dotenv';
config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shobhoday';
const DEFAULT_SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'admin@shobhoday.com';
const DEFAULT_SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'SuperSecret123!';

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    // 1. Create Permissions
    const baseModules = ['products', 'orders', 'inventory', 'customers', 'analytics', 'settings', 'categories', 'coupons', 'reviews', 'blogs'];
    
    for (const mod of baseModules) {
      await Permission.updateOne({ name: `${mod}.*` }, { name: `${mod}.*`, description: `Full access to ${mod}` }, { upsert: true });
    }
    
    // Additional granular permissions
    const granular = ['products.view', 'products.create', 'products.edit', 'products.delete', 'orders.view', 'orders.update', 'orders.refund'];
    for (const g of granular) {
      await Permission.updateOne({ name: g }, { name: g, description: `Specific access: ${g}` }, { upsert: true });
    }

    // 2. Create Roles
    const allPerms = await Permission.find();
    
    const superAdminRole = await Role.findOneAndUpdate(
      { name: 'SuperAdmin' },
      { name: 'SuperAdmin', description: 'Complete system control', permissions: allPerms.map(p => p._id) },
      { upsert: true, new: true }
    );

    await Role.findOneAndUpdate({ name: 'Admin' }, { name: 'Admin', description: 'Full operational access' }, { upsert: true });
    await Role.findOneAndUpdate({ name: 'Manager' }, { name: 'Manager', description: 'Department access' }, { upsert: true });
    await Role.findOneAndUpdate({ name: 'Staff' }, { name: 'Staff', description: 'View-only operations' }, { upsert: true });

    // 3. Create SuperAdmin User
    let superAdmin = await User.findOne({ email: DEFAULT_SUPERADMIN_EMAIL });
    if (!superAdmin) {
      superAdmin = new User({
        firstName: 'System',
        lastName: 'Admin',
        email: DEFAULT_SUPERADMIN_EMAIL,
        password: DEFAULT_SUPERADMIN_PASSWORD,
        roles: [superAdminRole._id],
        accountStatus: 'active',
        isEmailVerified: true,
        isPhoneVerified: true
      });
      await superAdmin.save();
      console.log(`Created SuperAdmin account: ${DEFAULT_SUPERADMIN_EMAIL}`);
    } else {
      console.log(`SuperAdmin account already exists: ${DEFAULT_SUPERADMIN_EMAIL}`);
      // Ensure role is assigned
      if (!superAdmin.roles.includes(superAdminRole._id as any)) {
        superAdmin.roles.push(superAdminRole._id as any);
        await superAdmin.save();
      }
    }

    console.log('Auth Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
