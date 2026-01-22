/**
 * Nigeria-Specific Financial Coaching System
 * Provides business advice tailored for Nigerian informal businesses
 * References Federal Inland Revenue Service (FIRS), Central Bank of Nigeria (CBN) guidelines
 */

export class NigeriaCoachingSystem {
  constructor() {
    this.topics = {
      taxObligations: {
        title: 'Tax Obligations for Nigerian Businesses',
        icon: '📋',
        priority: 'high',
        content: this.getTaxObligationsContent()
      },
      businessRegistration: {
        title: 'Business Registration in Nigeria',
        icon: '🏢',
        priority: 'high',
        content: this.getBusinessRegistrationContent()
      },
      recordKeeping: {
        title: 'Record Keeping Requirements',
        icon: '📚',
        priority: 'medium',
        content: this.getRecordKeepingContent()
      },
      cashFlowManagement: {
        title: 'Cash Flow Management',
        icon: '💰',
        priority: 'high',
        content: this.getCashFlowManagementContent()
      },
      accessingCredit: {
        title: 'Accessing Business Credit',
        icon: '🏦',
        priority: 'medium',
        content: this.getAccessingCreditContent()
      },
      licensing: {
        title: 'Business Licenses & Permits',
        icon: '📜',
        priority: 'medium',
        content: this.getLicensingContent()
      },
      digitalPayments: {
        title: 'Digital Payments & Mobile Money',
        icon: '📱',
        priority: 'high',
        content: this.getDigitalPaymentsContent()
      },
      foreignExchange: {
        title: 'Foreign Exchange Management',
        icon: '💱',
        priority: 'medium',
        content: this.getForeignExchangeContent()
      }
    };
  }

  /**
   * Get tax obligations content
   */
  getTaxObligationsContent() {
    return {
      overview: 'Understanding your tax obligations is crucial for business compliance in Nigeria.',
      keyPoints: [
        {
          title: 'Company Income Tax (CIT)',
          description: 'Applicable to incorporated companies',
          rate: '30% of assessable profit',
          payment: 'Within 6 months after accounting year end',
          reference: 'Companies Income Tax Act, Cap C21 LFN 2004'
        },
        {
          title: 'Value Added Tax (VAT)',
          description: 'Applicable to goods and services',
          rate: '7.5% on taxable supplies',
          payment: 'Monthly by 21st of following month',
          reference: 'Value Added Tax Act, Cap V1 LFN 2004'
        },
        {
          title: 'Personal Income Tax (PIT)',
          description: 'For sole proprietors and partnerships',
          rates: 'Progressive rates from 7% to 24%',
          payment: 'Annual through Pay-As-You-Earn (PAYE)',
          reference: 'Personal Income Tax Act, Cap P8 LFN 2004'
        },
        {
          title: 'Withholding Tax (WHT)',
          description: 'Deducted at source on certain payments',
          rates: '5%, 10%, or 2.5% depending on transaction type',
          payment: 'Monthly by 21st of following month',
          reference: 'Companies Income Tax Act, Cap C21 LFN 2004'
        }
      ],
      steps: [
        'Register for Tax Identification Number (TIN)',
        'Determine applicable tax obligations',
        'Set up proper bookkeeping system',
        'File tax returns on time (monthly/annual)',
        'Keep all tax payment receipts',
        'Consult tax professional for complex matters'
      ],
      resources: [
        {
          title: 'FIRS Tax Portal',
          url: 'https://tax.firs.gov.ng',
          description: 'Official FIRS portal for tax registration and filing'
        },
        {
          title: 'FIRS Contact Center',
          contact: '0700-CALL-FIRS (0700-2255-3477)',
          description: '24/7 taxpayer service hotline'
        },
        {
          title: 'State Internal Revenue Services',
          description: 'Contact your state tax authority for local taxes'
        }
      ],
      warnings: [
        'Failure to file returns attracts penalty of NGN 25,000 per month',
        'Late payments incur interest at 21% per annum',
        'Non-compliance may lead to business closure and prosecution'
      ]
    };
  }

  /**
   * Get business registration content
   */
  getBusinessRegistrationContent() {
    return {
      overview: 'Proper business registration protects your business and enables access to opportunities.',
      keyPoints: [
        {
          title: 'Business Name Registration',
          description: 'Register your business name with Corporate Affairs Commission (CAC)',
          cost: 'NGN 10,000 for name reservation + NGN 10,000 for registration',
          validity: 'Perpetual (renewable)',
          reference: 'Companies and Allied Matters Act, 2020'
        },
        {
          title: 'Company Registration (Limited)',
          description: 'For limited liability companies',
          cost: 'NGN 50,000 - NGN 100,000 depending on share capital',
          benefits: 'Limited liability, better access to credit',
          reference: 'Companies and Allied Matters Act, 2020'
        },
        {
          title: 'Tax Identification Number (TIN)',
          description: 'Mandatory for all businesses',
          cost: 'Free',
          purpose: 'Tax compliance and opening bank accounts',
          reference: 'FIRS Guidelines'
        },
        {
          title: 'Local Government Permits',
          description: 'Required from local government authorities',
          cost: 'Varies by LGA and business type',
          validity: 'Annual renewal required',
          reference: 'Local Government Laws'
        }
      ],
      steps: [
        'Choose unique business name',
        'Conduct name search on CAC portal',
        'Register business name or company online',
        'Obtain TIN from FIRS',
        'Register with local government authority',
        'Open business bank account',
        'Display business certificates prominently'
      ],
      resources: [
        {
          title: 'CAC Registration Portal',
          url: 'https://cac.gov.ng',
          description: 'Official CAC portal for business registration'
        },
        {
          title: 'FIRS TIN Registration',
          url: 'https://tax.firs.gov.ng',
          description: 'Online TIN registration portal'
        },
        {
          title: 'SMEDAN Registration',
          url: 'https://www.smedan.gov.ng',
          description: 'Small and Medium Enterprises Development Agency'
        }
      ],
      warnings: [
        'Operating without proper registration is illegal',
        'Unregistered businesses cannot access government contracts',
        'Local government officials may seal unregistered businesses'
      ]
    };
  }

  /**
   * Get record keeping content
   */
  getRecordKeepingContent() {
    return {
      overview: 'Proper record keeping is essential for tax compliance and business management.',
      keyPoints: [
        {
          title: 'Required Records',
          description: 'All businesses must maintain proper books of accounts',
          types: [
            'Sales records and receipts',
            'Purchase records and invoices',
            'Bank statements',
            'Expense receipts',
            'Employee records',
            'Asset registers'
          ],
          reference: 'Companies and Allied Matters Act, 2020, Section 378'
        },
        {
          title: 'Record Retention Period',
          description: 'Keep records for specified periods',
          duration: '6 years for tax purposes',
          reference: 'FIRS Tax Procedures'
        },
        {
          title: 'Digital Records',
          description: 'Electronic records are acceptable',
          requirements: 'Must be authentic and verifiable',
          reference: 'Evidence Act, 2011'
        },
        {
          title: 'Audit Requirements',
          description: 'FIRS may audit your records',
          frequency: 'Random or based on risk assessment',
          reference: 'FIRS Audit Guidelines'
        }
      ],
      steps: [
        'Set up simple accounting system (manual or digital)',
        'Record all transactions immediately',
        'Separate business and personal finances',
        'Keep all receipts and invoices organized',
        'Reconcile bank statements monthly',
        'Prepare monthly financial summaries',
        'Backup records regularly'
      ],
      resources: [
        {
          title: 'FIRS Record Keeping Guide',
          url: 'https://www.firs.gov.ng',
          description: 'Official FIRS guidelines on record keeping'
        },
        {
          title: 'Simple Accounting Apps',
          options: ['BeeZee Finance', 'QuickBooks', 'Sage'],
          description: 'Digital solutions for small businesses'
        }
      ],
      warnings: [
        'Poor record keeping leads to tax penalties',
        'FIRS can estimate taxes based on industry standards if records are inadequate',
        'Inaccurate records may trigger tax audits'
      ]
    };
  }

  /**
   * Get cash flow management content
   */
  getCashFlowManagementContent() {
    return {
      overview: 'Effective cash flow management is critical for business survival and growth.',
      keyPoints: [
        {
          title: 'Cash Flow Forecasting',
          description: 'Project your cash inflows and outflows',
          period: 'Monthly and quarterly forecasts',
          purpose: 'Identify potential cash shortages'
        },
        {
          title: 'Working Capital Management',
          description: 'Balance current assets and liabilities',
          formula: 'Current Assets - Current Liabilities',
          target: 'Positive working capital at all times'
        },
        {
          title: 'Credit Management',
          description: 'Manage customer credit carefully',
          policy: 'Clear credit terms and follow-up procedures',
          target: 'Minimize bad debts'
        },
        {
          title: 'Emergency Fund',
          description: 'Maintain cash reserves for emergencies',
          target: '3-6 months of operating expenses',
          purpose: 'Business continuity during challenges'
        }
      ],
      steps: [
        'Create weekly cash flow projections',
        'Monitor cash balances daily',
        'Follow up on overdue payments promptly',
        'Negotiate better payment terms with suppliers',
        'Offer discounts for early payments',
        'Control unnecessary expenses',
        'Build emergency cash reserves'
      ],
      resources: [
        {
          title: 'CBN Financial Literacy',
          url: 'https://www.cbn.gov.ng',
          description: 'Central Bank financial education resources'
        },
        {
          title: 'Bankers Committee',
          url: 'https://www.bankerscommittee.org.ng',
          description: 'Banking industry guidance for businesses'
        }
      ],
      tips: [
        'Use mobile banking for daily transactions to track cash flow',
        'Separate business and personal finances',
        'Review cash flow statements weekly',
        'Plan for seasonal fluctuations in business'
      ]
    };
  }

  /**
   * Get accessing credit content
   */
  getAccessingCreditContent() {
    return {
      overview: 'Access to credit can help grow your business if managed properly.',
      keyPoints: [
        {
          title: 'Business Loan Requirements',
          description: 'Common requirements from Nigerian banks',
          documents: [
            'CAC registration certificates',
            'TIN certificate',
            '6 months bank statements',
            'Financial statements',
            'Business plan',
            'Collateral (if required)'
          ]
        },
        {
          title: 'Credit Score',
          description: 'Maintain good credit history',
          factors: [
            'Timely loan repayments',
            'Regular tax compliance',
            'Positive bank account management',
            'Business profitability'
          ]
        },
        {
          title: 'Government Credit Programs',
          description: 'Available government financing options',
          options: [
            'Bank of Industry (BOI) loans',
            'Nigerian Export-Import Bank (NEXIM)',
            'Agricultural Credit Guarantee Scheme',
            'SMEDAN loan programs'
          ]
        },
        {
          title: 'Alternative Financing',
          description: 'Non-bank financing options',
          options: [
            'Microfinance banks',
            'Fintech lenders',
            'Peer-to-peer lending platforms',
            'Cooperative societies'
          ]
        }
      ],
      steps: [
        'Prepare comprehensive business plan',
        'Organize all required documents',
        'Check and improve credit score',
        'Research suitable lenders',
        'Compare interest rates and terms',
        'Apply for appropriate loan amount',
        'Use funds for intended business purpose'
      ],
      resources: [
        {
          title: 'Credit Bureau Association',
          url: 'https://www.cranigeria.org',
          description: 'Check your credit status'
        },
        {
          title: 'Bank of Industry',
          url: 'https://www.boi.ng',
          description: 'Government development bank'
        }
      ],
      warnings: [
        'Avoid over-borrowing beyond repayment capacity',
        'Read loan terms carefully before signing',
        'Beware of predatory lenders with extremely high rates',
        'Defaulting affects future credit access'
      ]
    };
  }

  /**
   * Get licensing content
   */
  getLicensingContent() {
    return {
      overview: 'Proper licensing ensures legal compliance and builds customer trust.',
      keyPoints: [
        {
          title: 'Local Government Permits',
          description: 'Required for all businesses operating within LGAs',
          types: ['Business Permit', 'Health Certificate', 'Environmental Permit'],
          renewal: 'Annual renewal required'
        },
        {
          title: 'Industry-Specific Licenses',
          description: 'Special licenses for certain business types',
          examples: [
            'Food: NAFDAC registration',
            'Pharmacies: PCN license',
            'Telecoms: NCC license',
            'Financial services: CBN license'
          ]
        },
        {
          title: 'Environmental Compliance',
          description: 'Environmental Impact Assessment for certain businesses',
          requirement: 'NESREA (National Environmental Standards and Regulations Enforcement Agency) approval',
          applicability: 'Manufacturing, large-scale operations'
        },
        {
          title: 'Health and Safety',
          description: 'Workplace safety requirements',
          authority: 'National Occupational Safety and Health Commission',
          requirement: 'Safe working conditions for employees'
        }
      ],
      steps: [
        'Identify required licenses for your business type',
        'Contact relevant regulatory authorities',
        'Prepare application documents',
        'Pay required fees',
        'Display licenses prominently',
        'Track renewal dates',
        'Maintain compliance standards'
      ],
      resources: [
        {
          title: 'Regulatory Authorities Directory',
          description: 'Comprehensive list of Nigerian regulators'
        },
        {
          title: 'SMEDAN Support Services',
          url: 'https://www.smedan.gov.ng',
          description: 'Guidance on business compliance'
        }
      ],
      warnings: [
        'Operating without licenses can lead to closure',
        'License violations may result in heavy fines',
        'Customers prefer licensed businesses'
      ]
    };
  }

  /**
   * Get digital payments content
   */
  getDigitalPaymentsContent() {
    return {
      overview: 'Digital payments are essential for modern business operations in Nigeria.',
      keyPoints: [
        {
          title: 'Mobile Money Platforms',
          description: 'Popular mobile payment solutions',
          options: [
            'OPay',
            'Paga',
            'Flutterwave',
            'Paystack'
          ]
        },
        {
          title: 'Bank Mobile Banking',
          description: 'Bank-based mobile payment solutions',
          options: [
            'FirstMonile (First Bank)',
            'Zenith Mobile',
            'Access Mobile',
            'UBA Mobile'
          ]
        },
        {
          title: 'Card Payments',
          description: 'Accept debit and credit cards',
          providers: [
            'Paystack',
            'Flutterwave',
            'Interswitch',
            'Remita'
          ]
        },
        {
          title: 'USSD Banking',
          description: 'Basic phone banking without internet',
          codes: [
            '*894# (First Bank)',
            '*966# (UBA)',
            '*737# (GTBank)',
            '*909# (Zenith)'
          ]
        }
      ],
      steps: [
        'Choose mobile payment provider',
        'Set up business payment account',
        'Integrate card payment solutions',
        'Train staff on payment systems',
        'Display payment options prominently',
        'Reconcile digital payments daily',
        'Maintain transaction records'
      ],
      resources: [
        {
          title: 'CBN Payment Systems',
          url: 'https://www.cbn.gov.ng',
          description: 'Regulatory framework for payments'
        },
        {
          title: 'Fintech Association of Nigeria',
          url: 'https://www.fintechng.org',
          description: 'Industry association for payment providers'
        }
      ],
      tips: [
        'Keep payment PINs secure',
        'Regularly check transaction history',
        'Use separate business payment accounts',
        'Educate customers on digital payments'
      ]
    };
  }

  /**
   * Get foreign exchange content
   */
  getForeignExchangeContent() {
    return {
      overview: 'Understanding foreign exchange regulations is important for businesses dealing with international transactions.',
      keyPoints: [
        {
          title: 'CBN Forex Regulations',
          description: 'Central Bank of Nigeria foreign exchange policies',
          purpose: 'Maintain foreign exchange stability',
          reference: 'CBN Foreign Exchange Manual'
        },
        {
          title: 'Import/Export Requirements',
          description: 'Documentation for international trade',
          documents: [
            'Form M (for imports)',
            'NCX certificate (for exports)',
            'Bill of Lading',
            'Proforma Invoice'
          ]
        },
        {
          title: 'Currency Restrictions',
          description: 'Limitations on foreign currency transactions',
          restrictions: [
            '41 items banned from forex access',
            'Priority sectors for forex allocation',
            'Documentation requirements'
          ]
        },
        {
          title: 'Repatriation of Funds',
          description: 'Bringing foreign currency into Nigeria',
          requirements: 'Form A declaration and documentation'
        }
      ],
      steps: [
        'Open domiciliary account with bank',
        'Obtain necessary trade licenses',
        'Complete required documentation',
        'Work with authorized dealer banks',
        'Maintain proper records',
        'Comply with reporting requirements'
      ],
      resources: [
        {
          title: 'CBN Forex Guidelines',
          url: 'https://www.cbn.gov.ng',
          description: 'Official CBN forex regulations'
        },
        {
          title: 'Nigerian Export Promotion Council',
          url: 'https://www.nepc.gov.ng',
          description: 'Export guidance and support'
        }
      ],
      warnings: [
        'Unauthorized forex dealers are illegal',
        'Violations can lead to prosecution',
        'Always use authorized dealer banks'
      ]
    };
  }

  /**
   * Get coaching response based on query
   */
  async getCoachingResponse(query, context = {}) {
    try {
      // Analyze query to determine relevant topic
      const topic = this.analyzeQuery(query);
      
      if (!topic) {
        return {
          success: false,
          message: 'I couldn\'t determine the specific topic. Please ask about tax, registration, record keeping, cash flow, credit, licensing, digital payments, or foreign exchange.'
        };
      }

      const topicData = this.topics[topic];
      
      // Generate contextual response
      const response = await this.generateContextualResponse(topicData, query, context);
      
      return {
        success: true,
        topic: topicData.title,
        response,
        priority: topicData.priority,
        icon: topicData.icon,
        relatedTopics: this.getRelatedTopics(topic),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating coaching response:', error);
      return {
        success: false,
        message: 'I encountered an error while processing your request. Please try again.'
      };
    }
  }

  /**
   * Analyze query to determine topic
   */
  analyzeQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    const topicKeywords = {
      taxObligations: ['tax', 'firs', 'vat', 'cit', 'withholding', 'tin', 'paye'],
      businessRegistration: ['register', 'registration', 'cac', 'business name', 'permit', 'company'],
      recordKeeping: ['records', 'bookkeeping', 'accounts', 'receipts', 'documentation', 'audit'],
      cashFlowManagement: ['cash flow', 'money', 'liquidity', 'working capital', 'emergency fund'],
      accessingCredit: ['loan', 'credit', 'financing', 'borrow', 'bank', 'boi', 'fund'],
      licensing: ['license', 'permit', 'compliance', 'regulation', 'nafdac', 'lga'],
      digitalPayments: ['mobile money', 'digital payments', 'opay', 'paga', 'paystack', 'flutterwave'],
      foreignExchange: ['forex', 'foreign exchange', 'dollar', 'import', 'export', 'cbn']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        return topic;
      }
    }

    return null;
  }

  /**
   * Generate contextual response
   */
  async generateContextualResponse(topicData, query, context) {
    const response = {
      overview: topicData.content.overview,
      keyPoints: topicData.content.keyPoints.slice(0, 3),
      actionableSteps: topicData.content.steps.slice(0, 5),
      resources: topicData.content.resources.slice(0, 2),
      warnings: topicData.content.warnings ? topicData.content.warnings.slice(0, 2) : [],
      contextualAdvice: this.generateContextualAdvice(query, context, topicData)
    };

    return response;
  }

  /**
   * Generate contextual advice based on user situation
   */
  generateContextualAdvice(query, context, topicData) {
    const advice = [];

    // Based on business size
    if (context.businessSize === 'small') {
      advice.push('As a small business, focus on compliance basics first: TIN, CAC registration, and simple record keeping.');
    } else if (context.businessSize === 'medium') {
      advice.push('Consider professional tax advice and proper accounting systems for your growing business.');
    }

    // Based on business type
    if (context.businessType === 'retail') {
      advice.push('For retail businesses, focus on inventory management and daily sales tracking.');
    } else if (context.businessType === 'service') {
      advice.push('Service businesses should emphasize proper contracts and service documentation.');
    }

    // Based on location
    if (context.location === 'lagos') {
      advice.push('Lagos State has specific business requirements - check with Lagos State Internal Revenue Service.');
    }

    return advice;
  }

  /**
   * Get related topics
   */
  getRelatedTopics(currentTopic) {
    const relatedTopics = {
      taxObligations: ['recordKeeping', 'businessRegistration'],
      businessRegistration: ['taxObligations', 'licensing'],
      recordKeeping: ['taxObligations', 'cashFlowManagement'],
      cashFlowManagement: ['accessingCredit', 'digitalPayments'],
      accessingCredit: ['recordKeeping', 'cashFlowManagement'],
      licensing: ['businessRegistration', 'foreignExchange'],
      digitalPayments: ['cashFlowManagement', 'recordKeeping'],
      foreignExchange: ['licensing', 'recordKeeping']
    };

    return relatedTopics[currentTopic] || [];
  }

  /**
   * Get all available topics
   */
  getAvailableTopics() {
    return Object.entries(this.topics).map(([key, topic]) => ({
      key,
      title: topic.title,
      icon: topic.icon,
      priority: topic.priority
    })).sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Search for web updates (placeholder for future implementation)
   */
  async searchForUpdates(topic) {
    // This would integrate with web search to get latest regulations
    // For now, return cached information
    return {
      success: true,
      message: 'Using current regulatory information. Web search integration coming soon.',
      lastChecked: new Date().toISOString()
    };
  }
}

// Create singleton instance
export const nigeriaCoachingSystem = new NigeriaCoachingSystem();
