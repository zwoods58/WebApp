"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, ShoppingCart, Truck, Dumbbell, Coffee, Utensils, Heart, Wrench, Phone, Package, Car, Building, Star, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Define industries with their metadata - these are the actual industries from Beezee app
const INDUSTRIES = [
  {
    id: 'retail',
    name: 'Retail',
    description: 'General stores, electronics, clothing, grocery & food shops',
    icon: ShoppingCart,
    color: 'blue',
    countries: ['ke', 'ng', 'za', 'gh', 'ug', 'tz', 'rw'],
    sectors: ['general_store', 'electronics', 'clothing', 'grocery']
  },
  {
    id: 'food',
    name: 'Food Service',
    description: 'Restaurants, cafes, bakeries, and food trucks',
    icon: Coffee,
    color: 'orange',
    countries: ['ke', 'ng', 'za', 'gh', 'ug', 'tz', 'rw'],
    sectors: ['restaurant', 'cafe', 'bakery', 'food_truck']
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Taxi services, delivery, logistics, and vehicle rental',
    icon: Truck,
    color: 'green',
    countries: ['ke', 'ng', 'za', 'gh', 'ug', 'tz', 'rw'],
    sectors: ['taxi', 'delivery', 'logistics', 'rental']
  },
  {
    id: 'salon',
    name: 'Salon',
    description: 'Barber shops, hair stylists, nail salons, beauty services',
    icon: Sparkles,
    color: 'pink',
    countries: ['ke', 'ng', 'za', 'gh', 'ug', 'tz', 'rw'],
    sectors: ['barber', 'hair_stylist', 'nails', 'beauty_salon']
  },
  {
    id: 'tailor',
    name: 'Tailor',
    description: 'Clothing tailors, alterations, custom designs, uniforms',
    icon: Target,
    color: 'purple',
    countries: ['ke', 'ng', 'za', 'gh', 'ug', 'tz', 'rw'],
    sectors: ['clothing_tailor', 'alterations', 'custom_designs', 'uniforms']
  },
  {
    id: 'repairs',
    name: 'Repairs',
    description: 'Electronics, phone, appliance, and general repair services',
    icon: Wrench,
    color: 'gray',
    countries: ['ke', 'ng', 'za', 'gh', 'ug', 'tz', 'rw'],
    sectors: ['electronics_repair', 'phone_repair', 'appliance_repair', 'general_repair']
  },
  {
    id: 'freelance',
    name: 'Freelance',
    description: 'Consulting, design, development, writing, real estate services',
    icon: Building,
    color: 'indigo',
    countries: ['ke', 'ng', 'za', 'gh', 'ug', 'tz', 'rw'],
    sectors: ['consulting', 'design', 'development', 'writing', 'real_estate', 'virtual_assistant']
  }
];

const COUNTRIES = [
  { code: 'ke', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ng', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'za', name: 'South Africa', flag: '🇿🇦' },
  { code: 'gh', name: 'Ghana', flag: '🇬🇭' },
  { code: 'ug', name: 'Uganda', flag: '🇺🇬' },
  { code: 'tz', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'rw', name: 'Rwanda', flag: '🇷🇼' }
];

export default function MarketingAdmin() {
  const [selectedCountry, setSelectedCountry] = useState('ke');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIndustries = INDUSTRIES.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIndustryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500',
      teal: 'bg-teal-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  const getIndustryBgColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      red: 'bg-red-50',
      orange: 'bg-orange-50',
      pink: 'bg-pink-50',
      purple: 'bg-purple-50',
      indigo: 'bg-indigo-50',
      yellow: 'bg-yellow-50',
      gray: 'bg-gray-50',
      teal: 'bg-teal-50'
    };
    return colors[color] || 'bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Marketing Admin Portal</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Admin User
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selector */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Select Country</h2>
              <p className="text-sm text-gray-500">Choose the country to manage industries</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    selectedCountry === country.code
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Industries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndustries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <Link href={`/Beezee-App/app/${selectedCountry}/${industry.id}`} target="_blank">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${getIndustryBgColor(industry.color)}`}>
                        <Icon className={`w-6 h-6 ${getIndustryColor(industry.color).replace('bg-', 'text-')}`} />
                      </div>
                      <span className="text-sm text-gray-500">{industry.id}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {industry.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {industry.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Available in:</span>
                        <div className="flex space-x-1">
                          {industry.countries.map((countryCode) => {
                            const country = COUNTRIES.find(c => c.code === countryCode);
                            return (
                              <span key={countryCode} className="text-xs">
                                {country?.flag}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedCountry && industry.countries.includes(selectedCountry)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {selectedCountry && industry.countries.includes(selectedCountry) ? 'Open Dashboard' : 'Not Available'}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Opens in new tab</span>
                        <span>→ {selectedCountry.toUpperCase()}/{industry.id}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Industries</p>
                <p className="text-2xl font-bold text-gray-900">{INDUSTRIES.length}</p>
              </div>
              <Store className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Countries Supported</p>
                <p className="text-2xl font-bold text-gray-900">{COUNTRIES.length}</p>
              </div>
              <div className="flex space-x-1">
                {COUNTRIES.map((country) => (
                  <span key={country.code} className="text-lg">{country.flag}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available in {COUNTRIES.find(c => c.code === selectedCountry)?.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {INDUSTRIES.filter(industry => industry.countries.includes(selectedCountry)).length}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full ${getIndustryColor('blue')}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
