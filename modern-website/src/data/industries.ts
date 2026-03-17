import { Industry, IndustrySector } from '@/types/signup';

export const industries: Industry[] = [
  {
    id: 'retail',
    name: 'Retail',
    icon: 'Store',
    sectors: [
      { id: 'general_store', name: 'General Store' },
      { id: 'electronics', name: 'Electronics' },
      { id: 'clothing', name: 'Clothing & Fashion' },
      { id: 'grocery', name: 'Grocery & Food' }
    ]
  },
  {
    id: 'food',
    name: 'Food',
    icon: 'Food',
    sectors: [
      { id: 'restaurant', name: 'Restaurant' },
      { id: 'cafe', name: 'Cafe & Coffee Shop' },
      { id: 'bakery', name: 'Bakery' },
      { id: 'food_truck', name: 'Food Truck' }
    ]
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'Car',
    sectors: [
      { id: 'taxi', name: 'Taxi Service' },
      { id: 'delivery', name: 'Delivery Service' },
      { id: 'logistics', name: 'Logistics & Hauling' },
      { id: 'rental', name: 'Vehicle Rental' }
    ]
  },
  {
    id: 'salon',
    name: 'Salon',
    icon: 'Salon',
    sectors: [
      { id: 'barber', name: 'Barber Shop' },
      { id: 'hair_stylist', name: 'Hair Stylist' },
      { id: 'nails', name: 'Nail Salon' },
      { id: 'beauty_salon', name: 'Beauty Salon' }
    ]
  },
  {
    id: 'tailor',
    name: 'Tailor',
    icon: 'Thread',
    sectors: [
      { id: 'clothing_tailor', name: 'Clothing Tailor' },
      { id: 'alterations', name: 'Alterations & Repairs' },
      { id: 'custom_designs', name: 'Custom Designs' },
      { id: 'uniforms', name: 'Uniforms & Workwear' }
    ]
  },
  {
    id: 'repairs',
    name: 'Repairs',
    icon: 'Tools',
    sectors: [
      { id: 'electronics_repair', name: 'Electronics Repair' },
      { id: 'phone_repair', name: 'Phone Repair' },
      { id: 'appliance_repair', name: 'Appliance Repair' },
      { id: 'general_repair', name: 'General Repairs' }
    ]
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: 'Computer',
    sectors: [
      { id: 'consulting', name: 'Consulting' },
      { id: 'design', name: 'Design Services' },
      { id: 'development', name: 'Development' },
      { id: 'writing', name: 'Writing & Content' },
      { id: 'real_estate', name: 'Real Estate' },
      { id: 'virtual_assistant', name: 'Virtual Assistant' }
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
