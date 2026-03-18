import { Industry, IndustrySector } from '@/types/signup';

export const industries: Industry[] = [
  {
    id: 'retail',
    name: 'Retail',
    icon: '🏪',
    sectors: [
      { id: 'general_store', name: 'General Store', description: 'Convenience store with various household items' },
      { id: 'electronics', name: 'Electronics', description: 'Gadgets, phones, computers and accessories' },
      { id: 'clothing', name: 'Clothing & Fashion', description: 'Apparel, shoes and fashion accessories' },
      { id: 'grocery', name: 'Grocery & Food', description: 'Food items, beverages and household essentials' }
    ]
  },
  {
    id: 'food',
    name: 'Food',
    icon: '🍽️',
    sectors: [
      { id: 'restaurant', name: 'Restaurant', description: 'Full-service dining establishment' },
      { id: 'cafe', name: 'Cafe & Coffee Shop', description: 'Coffee, light meals and snacks' },
      { id: 'bakery', name: 'Bakery', description: 'Fresh bread, pastries and baked goods' },
      { id: 'food_truck', name: 'Food Truck', description: 'Mobile food service business' }
    ]
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚗',
    sectors: [
      { id: 'taxi', name: 'Taxi Service', description: 'Passenger transportation services' },
      { id: 'delivery', name: 'Delivery Service', description: 'Package and goods delivery' },
      { id: 'logistics', name: 'Logistics & Hauling', description: 'Freight and cargo transportation' },
      { id: 'rental', name: 'Vehicle Rental', description: 'Car and vehicle rental services' }
    ]
  },
  {
    id: 'salon',
    name: 'Salon',
    icon: '💇',
    sectors: [
      { id: 'barber', name: 'Barber Shop', description: 'Men\'s grooming and hair services' },
      { id: 'hair_stylist', name: 'Hair Stylist', description: 'Professional hair styling and treatment' },
      { id: 'nails', name: 'Nail Salon', description: 'Manicure, pedicure and nail art' },
      { id: 'beauty_salon', name: 'Beauty Salon', description: 'Full-service beauty and wellness treatments' }
    ]
  },
  {
    id: 'tailor',
    name: 'Tailor',
    icon: '🧵',
    sectors: [
      { id: 'clothing_tailor', name: 'Clothing Tailor', description: 'Custom-made clothing and alterations' },
      { id: 'alterations', name: 'Alterations & Repairs', description: 'Clothing modifications and repairs' },
      { id: 'custom_designs', name: 'Custom Designs', description: 'Bespoke clothing design services' },
      { id: 'uniforms', name: 'Uniforms & Workwear', description: 'Professional and corporate uniforms' }
    ]
  },
  {
    id: 'repairs',
    name: 'Repairs',
    icon: '🔧',
    sectors: [
      { id: 'electronics_repair', name: 'Electronics Repair', description: 'Device and gadget repair services' },
      { id: 'phone_repair', name: 'Phone Repair', description: 'Mobile phone and tablet repairs' },
      { id: 'appliance_repair', name: 'Appliance Repair', description: 'Home appliance maintenance and repair' },
      { id: 'general_repair', name: 'General Repairs', description: 'Multi-purpose repair services' }
    ]
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💻',
    sectors: [
      { id: 'consulting', name: 'Consulting', description: 'Business and professional consulting services' },
      { id: 'design', name: 'Design Services', description: 'Graphic, web and creative design' },
      { id: 'development', name: 'Development', description: 'Software and web development' },
      { id: 'writing', name: 'Writing & Content', description: 'Content creation and writing services' },
      { id: 'real_estate', name: 'Real Estate', description: 'Property sales and management' },
      { id: 'virtual_assistant', name: 'Virtual Assistant', description: 'Remote administrative and support services' }
    ]
  }
];

export const getIndustryById = (id: string): Industry | undefined => {
  return industries.find(industry => industry.id === id);
};

export const getSectorsByIndustry = (industryId: string): IndustrySector[] => {
  const industry = getIndustryById(industryId);
  return industry?.sectors || [];
};

export const getSectorById = (industryId: string, sectorId: string): IndustrySector | undefined => {
  const sectors = getSectorsByIndustry(industryId);
  return sectors.find(sector => sector.id === sectorId);
};
