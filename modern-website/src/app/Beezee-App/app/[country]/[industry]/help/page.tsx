"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Send, 
  Search, 
  Book, 
  Video, 
  Download,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useLanguage } from '@/hooks/LanguageContext';

export default function HelpPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Help categories and content
  const helpCategories = [
    {
      id: 'getting_started',
      title: t('help.getting_started', 'Getting Started'),
      icon: Book,
      color: 'text-blue-600 bg-blue-50',
      articles: [
        { title: 'Creating your account', time: '2 min read' },
        { title: 'Setting up your business profile', time: '3 min read' },
        { title: 'Adding your first transaction', time: '2 min read' },
        { title: 'Understanding the dashboard', time: '5 min read' }
      ]
    },
    {
      id: 'features',
      title: t('help.features', 'Features'),
      icon: Star,
      color: 'text-green-600 bg-green-50',
      articles: [
        { title: 'Managing inventory', time: '4 min read' },
        { title: 'Tracking expenses', time: '3 min read' },
        { title: 'Customer credit management', time: '3 min read' },
        { title: 'Business reports', time: '5 min read' }
      ]
    },
    {
      id: 'troubleshooting',
      title: t('help.troubleshooting', 'Troubleshooting'),
      icon: HelpCircle,
      color: 'text-red-600 bg-red-50',
      articles: [
        { title: 'Login issues', time: '2 min read' },
        { title: 'Data sync problems', time: '3 min read' },
        { title: 'Payment processing errors', time: '4 min read' },
        { title: 'App performance issues', time: '3 min read' }
      ]
    },
    {
      id: 'tutorials',
      title: t('help.tutorials', 'Video Tutorials'),
      icon: Video,
      color: 'text-purple-600 bg-purple-50',
      articles: [
        { title: 'Complete app walkthrough', time: '15 min video' },
        { title: 'Inventory management guide', time: '8 min video' },
        { title: 'Reports and analytics', time: '10 min video' },
        { title: 'Advanced features', time: '12 min video' }
      ]
    }
  ];

  const faqItems = [
    {
      question: t('help.faq1_question', 'How do I add a new transaction?'),
      answer: t('help.faq1_answer', 'Go to the Cash tab, click the "Add Transaction" button, and fill in the details including amount, category, and payment method.')
    },
    {
      question: t('help.faq2_question', 'Can I export my data?'),
      answer: t('help.faq2_answer', 'Yes! Go to Reports section and click the "Export" button to download your business data in CSV format.')
    },
    {
      question: t('help.faq3_question', 'How do I manage customer credit?'),
      answer: t('help.faq3_answer', 'Navigate to the Customers tab, where you can add new credit entries, track payments, and manage outstanding balances.')
    },
    {
      question: t('help.faq4_question', 'Is my data secure?'),
      answer: t('help.faq4_answer', 'Absolutely! We use bank-level encryption and secure servers to protect your business data. Your information is never shared with third parties.')
    }
  ];

  const filteredArticles = helpCategories.flatMap(category => 
    selectedCategory === 'all' || selectedCategory === category.id
      ? category.articles.map(article => ({ ...article, category: category.title, categoryColor: category.color }))
      : []
  ).filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          {t('help.title', 'Help & Support')}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mb-6"
        >
          {t('help.description', 'Find answers and get help when you need it')}
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-6"
        >
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('help.search_placeholder', 'Search for help...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>

        {/* Quick Help Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Link
            href={`/Beezee-App/app/${country}/${industry}/tour`}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Video size={24} className="mx-auto mb-2" />
            <div className="text-sm font-medium">
              {t('help.start_tour', 'Start Tour')}
            </div>
          </Link>
          <a
            href="tel:+254700000000"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Phone size={24} className="mx-auto mb-2" />
            <div className="text-sm font-medium">
              {t('help.call_support', 'Call Support')}
            </div>
          </a>
        </motion.div>

        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto mb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {t('help.all_categories', 'All')}
            </button>
            {helpCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${article.categoryColor}`}>
                        {article.category}
                      </span>
                      <Clock size={14} />
                      <span>{article.time}</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('help.frequently_asked', 'Frequently Asked Questions')}
          </h2>
          <div className="space-y-3">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-4 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('help.contact_support', 'Contact Support')}
          </h2>
          
          <div className="grid grid-cols-1 gap-3 mb-4">
            <a
              href="mailto:support@beezee.com"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Mail size={20} />
              <span>support@beezee.com</span>
            </a>
            <a
              href="tel:+254700000000"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Phone size={20} />
              <span>+254 700 000 000</span>
            </a>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors"
            >
              <MessageCircle size={20} />
              <span>WhatsApp Support</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-3">
            <input
              type="text"
              placeholder={t('help.your_name', 'Your Name')}
              value={contactForm.name}
              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder={t('help.your_email', 'Your Email')}
              value={contactForm.email}
              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder={t('help.subject', 'Subject')}
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <textarea
              placeholder={t('help.message', 'Message')}
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {t('help.send_message', 'Send Message')}
            </button>
          </form>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('help.resources', 'Resources')}
          </h2>
          <div className="space-y-3">
            <a
              href="/downloads/user-guide.pdf"
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Download size={20} className="text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {t('help.user_guide', 'User Guide PDF')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('help.comprehensive_guide', 'Comprehensive guide to all features')}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </a>
            <a
              href="/api/backup"
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Download size={20} className="text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {t('help.backup_data', 'Backup Your Data')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('help.download_backup', 'Download a backup of your business data')}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </a>
          </div>
        </motion.div>
      </div>

      <BottomNav industry={industry} country={country} />
    </div>
  );
}
