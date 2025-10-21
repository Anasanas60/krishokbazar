const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  const models = require('../models');
  try {
    console.log('🌱 Starting database seeding...');

    // Seed Categories
    const categories = [
      { name: 'Vegetables', description: 'Fresh seasonal vegetables', icon: '🥕' },
      { name: 'Fruits', description: 'Juicy and nutritious fruits', icon: '🍎' },
      { name: 'Dairy', description: 'Milk, cheese, and dairy products', icon: '🥛' },
      { name: 'Grains', description: 'Rice, wheat, and other grains', icon: '🌾' },
      { name: 'Herbs', description: 'Fresh herbs and spices', icon: '🌿' },
    ];

    const createdCategories = [];
    for (const cat of categories) {
      try {
        const created = await models.Category.create(cat);
        createdCategories.push(created);
      } catch (error) {
        console.log(`Category ${cat.name} already exists, skipping...`);
        // Find existing category
        const existing = await models.Category.findOne({ where: { name: cat.name } });
        if (existing) createdCategories.push(existing);
      }
    }
    console.log(`✅ Created/found ${createdCategories.length} categories`);

  // Seed Farmers (Users with role 'farmer' and FarmerProfiles)
    const farmersData = [
      {
        user: { name: 'Abdul Karim', email: 'abdul@example.com', password: 'password123', role: 'farmer', phone: '8801712345678', city: 'Dhaka', state: 'Dhaka' },
        profile: { farmName: 'Green Valley Farm', farmDescription: 'Organic farming since 2010', farmLocation: 'Dhaka, Bangladesh', yearsFarming: 15, certification: 'Organic Certified', deliveryOptions: ['Pickup', 'Delivery'], paymentOptions: ['Cash', 'Online'], isVerified: true, rating: 4.5, totalRatings: 20 }
      },
      {
        user: { name: 'Fatima Begum', email: 'fatima@example.com', password: 'password123', role: 'farmer', phone: '8801812345678', city: 'Chittagong', state: 'Chittagong' },
        profile: { farmName: 'Sunrise Orchards', farmDescription: 'Specializing in tropical fruits', farmLocation: 'Chittagong, Bangladesh', yearsFarming: 10, certification: 'GAP Certified', deliveryOptions: ['Delivery'], paymentOptions: ['Online'], isVerified: true, rating: 4.8, totalRatings: 35 }
      },
      {
        user: { name: 'Rahman Hossain', email: 'rahman@example.com', password: 'password123', role: 'farmer', phone: '8801912345678', city: 'Rajshahi', state: 'Rajshahi' },
        profile: { farmName: 'Golden Fields', farmDescription: 'Rice and grain specialists', farmLocation: 'Rajshahi, Bangladesh', yearsFarming: 20, certification: 'ISO Certified', deliveryOptions: ['Pickup'], paymentOptions: ['Cash'], isVerified: true, rating: 4.2, totalRatings: 15 }
      },
      {
        user: { name: 'Ayesha Akter', email: 'ayesha@example.com', password: 'password123', role: 'farmer', phone: '8801612345678', city: 'Khulna', state: 'Khulna' },
        profile: { farmName: 'Herbal Haven', farmDescription: 'Medicinal herbs and spices', farmLocation: 'Khulna, Bangladesh', yearsFarming: 12, certification: 'Organic Certified', deliveryOptions: ['Pickup', 'Delivery'], paymentOptions: ['Cash', 'Online'], isVerified: true, rating: 4.7, totalRatings: 28 }
      },
      {
        user: { name: 'Mohammed Ali', email: 'mohammed@example.com', password: 'password123', role: 'farmer', phone: '8801512345678', city: 'Sylhet', state: 'Sylhet' },
        profile: { farmName: 'Dairy Delight', farmDescription: 'Fresh dairy products from local cows', farmLocation: 'Sylhet, Bangladesh', yearsFarming: 8, certification: 'HACCP Certified', deliveryOptions: ['Delivery'], paymentOptions: ['Online'], isVerified: true, rating: 4.3, totalRatings: 22 }
      },
    ];

  const profilePlaceholder = 'https://picsum.photos/256/256?random=farmer';
  const productPlaceholder = 'https://picsum.photos/512/512?random=product';

    const createdFarmers = [];
    for (const farmerData of farmersData) {
      try {
        const hashedPassword = await bcrypt.hash(farmerData.user.password, 10);
        const userPayload = { ...farmerData.user, password: hashedPassword };
        // Add profile picture if not provided
        if (!userPayload.profilePicture) userPayload.profilePicture = profilePlaceholder;
        const user = await models.User.create(userPayload);
        const profile = await models.FarmerProfile.create({ ...farmerData.profile, userId: user.id });
        createdFarmers.push({ user, profile });
      } catch (error) {
        console.log(`User ${farmerData.user.email} already exists, skipping...`);
        // Find existing user and profile
        const existingUser = await models.User.findOne({ where: { email: farmerData.user.email } });
        if (existingUser) {
          const existingProfile = await models.FarmerProfile.findOne({ where: { userId: existingUser.id } });
          createdFarmers.push({ user: existingUser, profile: existingProfile });
        }
      }
    }
    console.log(`✅ Created/found ${createdFarmers.length} farmers with profiles`);

  // Seed Products
  const productsData = [
      // Abdul Karim (Vegetables)
  { farmerId: createdFarmers[0].user.id, name: 'Organic Tomatoes', description: 'Fresh red tomatoes grown organically', categoryId: createdCategories[0].id, price: 50.00, unit: 'kg', quantityAvailable: 100, images: [productPlaceholder], isOrganic: true, isFeatured: true, harvestDate: new Date(), availableUntil: new Date(Date.now() + 7*24*60*60*1000) },
  { farmerId: createdFarmers[0].user.id, name: 'Fresh Spinach', description: 'Nutrient-rich green spinach', categoryId: createdCategories[0].id, price: 30.00, unit: 'bunch', quantityAvailable: 50, images: [productPlaceholder], isOrganic: true, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 5*24*60*60*1000) },
      { farmerId: createdFarmers[0].user.id, name: 'Carrots', description: 'Crunchy orange carrots', categoryId: createdCategories[0].id, price: 40.00, unit: 'kg', quantityAvailable: 80, images: [productPlaceholder], isOrganic: false, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 10*24*60*60*1000) },

      // Fatima Begum (Fruits)
      { farmerId: createdFarmers[1].user.id, name: 'Mangoes', description: 'Sweet Alphonso mangoes', categoryId: createdCategories[1].id, price: 150.00, unit: 'kg', quantityAvailable: 30, images: [productPlaceholder], isOrganic: true, isFeatured: true, harvestDate: new Date(), availableUntil: new Date(Date.now() + 14*24*60*60*1000) },
      { farmerId: createdFarmers[1].user.id, name: 'Bananas', description: 'Fresh yellow bananas', categoryId: createdCategories[1].id, price: 25.00, unit: 'dozen', quantityAvailable: 200, images: [productPlaceholder], isOrganic: false, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 7*24*60*60*1000) },
      { farmerId: createdFarmers[1].user.id, name: 'Pineapples', description: 'Juicy tropical pineapples', categoryId: createdCategories[1].id, price: 80.00, unit: 'piece', quantityAvailable: 40, images: [productPlaceholder], isOrganic: true, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 10*24*60*60*1000) },


      // Rahman Hossain (Grains)
      { farmerId: createdFarmers[2].user.id, name: 'Basmati Rice', description: 'Premium long-grain basmati rice', categoryId: createdCategories[3].id, price: 120.00, unit: 'kg', quantityAvailable: 500, images: [productPlaceholder], isOrganic: false, isFeatured: true, harvestDate: new Date(), availableUntil: new Date(Date.now() + 30*24*60*60*1000) },
      { farmerId: createdFarmers[2].user.id, name: 'Whole Wheat Flour', description: 'Freshly milled whole wheat flour', categoryId: createdCategories[3].id, price: 60.00, unit: 'kg', quantityAvailable: 300, images: [productPlaceholder], isOrganic: true, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 20*24*60*60*1000) },


      // Ayesha Akter (Herbs)
      { farmerId: createdFarmers[3].user.id, name: 'Fresh Mint', description: 'Aromatic mint leaves', categoryId: createdCategories[4].id, price: 20.00, unit: 'bunch', quantityAvailable: 100, images: [productPlaceholder], isOrganic: true, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 3*24*60*60*1000) },
      { farmerId: createdFarmers[3].user.id, name: 'Turmeric Powder', description: 'Ground turmeric spice', categoryId: createdCategories[4].id, price: 100.00, unit: 'kg', quantityAvailable: 50, images: [productPlaceholder], isOrganic: true, isFeatured: true, harvestDate: new Date(), availableUntil: new Date(Date.now() + 60*24*60*60*1000) },
      { farmerId: createdFarmers[3].user.id, name: 'Coriander Leaves', description: 'Fresh coriander for cooking', categoryId: createdCategories[4].id, price: 15.00, unit: 'bunch', quantityAvailable: 150, images: [productPlaceholder], isOrganic: false, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 2*24*60*60*1000) },


      // Mohammed Ali (Dairy)
  { farmerId: createdFarmers[4].user.id, name: 'Fresh Milk', description: 'Pure cow milk', categoryId: createdCategories[2].id, price: 35.00, unit: 'liter', quantityAvailable: 200, images: [productPlaceholder], isOrganic: true, isFeatured: true, harvestDate: new Date(), availableUntil: new Date(Date.now() + 1*24*60*60*1000) },
      { farmerId: createdFarmers[4].user.id, name: 'Homemade Cheese', description: 'Artisanal cheese from local milk', categoryId: createdCategories[2].id, price: 250.00, unit: 'kg', quantityAvailable: 20, images: [productPlaceholder], isOrganic: true, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 7*24*60*60*1000) },
      { farmerId: createdFarmers[4].user.id, name: 'Butter', description: 'Fresh churned butter', categoryId: createdCategories[2].id, price: 180.00, unit: 'kg', quantityAvailable: 30, images: [productPlaceholder], isOrganic: false, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 5*24*60*60*1000) },

      // Additional products to reach 20
      { farmerId: createdFarmers[0].user.id, name: 'Bell Peppers', description: 'Colorful bell peppers', categoryId: createdCategories[0].id, price: 70.00, unit: 'kg', quantityAvailable: 60, images: [productPlaceholder], isOrganic: true, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 8*24*60*60*1000) },
      { farmerId: createdFarmers[1].user.id, name: 'Oranges', description: 'Sweet navel oranges', categoryId: createdCategories[1].id, price: 45.00, unit: 'kg', quantityAvailable: 120, images: [productPlaceholder], isOrganic: false, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 12*24*60*60*1000) },
      { farmerId: createdFarmers[2].user.id, name: 'Barley', description: 'Nutritious barley grains', categoryId: createdCategories[3].id, price: 80.00, unit: 'kg', quantityAvailable: 400, images: [productPlaceholder], isOrganic: true, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 25*24*60*60*1000) },
  { farmerId: createdFarmers[3].user.id, name: 'Ginger', description: 'Fresh ginger root', categoryId: createdCategories[4].id, price: 90.00, unit: 'kg', quantityAvailable: 70, images: [productPlaceholder], isOrganic: true, isFeatured: false, harvestDate: new Date(), availableUntil: new Date(Date.now() + 15*24*60*60*1000) },
    ];

    const createdProducts = await Promise.all(
      productsData.map(prod => models.Product.create(prod))
    );
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedDatabase;
