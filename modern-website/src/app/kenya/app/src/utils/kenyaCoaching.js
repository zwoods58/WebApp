/**
 * Kenya-Specific Financial Coaching System
 * Provides business advice tailored for Kenyan informal businesses
 * References Kenya Revenue Authority (KRA), Central Bank of Kenya (CBK) guidelines
 */

export class KenyaCoachingSystem {
  constructor() {
    this.topics = {
      taxObligations: {
        title: 'Tax Obligations for Kenyan Businesses',
        icon: '📋',
        priority: 'high',
        content: this.getTaxObligationsContent()
      },
      businessRegistration: {
        title: 'Business Registration in Kenya',
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
        title: 'Digital Payments & M-Pesa',
        icon: '📱',
        priority: 'high',
        content: this.getDigitalPaymentsContent()
      },
      employeeManagement: {
        title: 'Employee Management',
        icon: '👥',
        priority: 'low',
        content: this.getEmployeeManagementContent()
      }
    };
  }

  /**
   * Get tax obligations content
   */
  getTaxObligationsContent() {
    return {
      overview: 'Understanding your tax obligations is crucial for business compliance in Kenya.',
      keyPoints: [
        {
          title: 'Turnover Tax',
          description: 'Applicable to businesses with annual turnover between KES 1 million and KES 25 million',
          rate: '1% of gross turnover',
          payment: 'Monthly by 20th of following month',
          reference: 'KRA Tax Procedures Act 2015, Section 12B'
        },
        {
          title: 'VAT (Value Added Tax)',
          description: 'Mandatory for businesses with annual turnover exceeding KES 5 million',
          rate: '16% on taxable supplies',
          payment: 'Monthly by 20th of following month',
          reference: 'VAT Act 2013, Cap 476'
        },
        {
          title: 'Income Tax',
          description: 'For sole proprietors and partnerships',
          rates: 'Progressive rates from 10% to 30%',
          payment: 'Annual installments (4 times per year)',
          reference: 'Income Tax Act, Cap 470'
        },
        {
          title: 'Withholding Tax',
          description: 'Deducted at source on certain payments',
          rates: '5%, 10%, 15%, or 20% depending on transaction type',
          payment: 'By 20th of following month',
          reference: 'Income Tax Act, Cap 470, Part VII'
        }
      ],
      steps: [
        'Register for KRA PIN certificate',
        'Determine applicable tax obligations',
        'Set up proper bookkeeping system',
        'File tax returns on time (monthly/annual)',
        'Keep all tax payment receipts',
        'Consult tax professional for complex matters'
      ],
      resources: [
        {
          title: 'KRA iTax Portal',
          url: 'https://itax.kra.go.ke',
          description: 'Official KRA portal for tax registration and filing'
        },
        {
          title: 'KRA Helpline',
          contact: '0800 572 000',
          description: 'Free taxpayer service hotline'
        },
        {
          title: 'KRA Mobile App',
          description: 'Download from Google Play Store for mobile tax services'
        }
      ],
      warnings: [
        'Failure to file tax returns attracts penalties of KES 2,000 or 1% of tax due',
        'Late payments incur interest at 1% per month',
        'Non-compliance may lead to prosecution and business closure'
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
          description: 'Register your business name with the Attorney General\'s office',
          cost: 'KES 650 for online registration',
          validity: '10 years (renewable)',
          reference: 'Business Names Act, Cap 499'
        },
        {
          title: 'Single Business Permit',
          description: 'Required from county government for operating business',
          cost: 'Varies by county and business type (KES 2,000 - 15,000)',
          validity: 'Annual renewal required',
          reference: 'County Governments Act, 2012'
        },
        {
          title: 'Company Registration',
          description: 'For limited liability companies',
          cost: 'KES 10,650 for online registration',
          benefits: 'Limited liability, better access to credit',
          reference: 'Companies Act, 2015'
        },
        {
          title: 'KRA PIN Registration',
          description: 'Mandatory for all businesses',
          cost: 'Free',
          purpose: 'Tax compliance and opening bank accounts',
          reference: 'Tax Procedures Act, 2015'
        }
      ],
      steps: [
        'Choose unique business name',
        'Conduct name search at Attorney General\'s office',
        'Register business name online or at Huduma Centers',
        'Obtain county single business permit',
        'Register for KRA PIN',
        'Open business bank account',
        'Display business permit and certificates prominently'
      ],
      resources: [
        {
          title: 'eCitizen Portal',
          url: 'https://www.ecitizen.go.ke',
          description: 'Online platform for business registration services'
        },
        {
          title: 'Huduma Centers',
          description: 'One-stop shops for government services nationwide'
        },
        {
          title: 'County Government Offices',
          description: 'Visit your local county for business permits'
        }
      ],
      warnings: [
        'Operating without proper registration is illegal',
        'Unregistered businesses cannot access government tenders',
        'County officials may arrest unregistered business operators'
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
          reference: 'Tax Procedures Act, 2015, Section 23'
        },
        {
          title: 'Record Retention Period',
          description: 'Keep records for specified periods',
          duration: '5 years for tax purposes',
          reference: 'Tax Procedures Act, 2015, Section 23(2)'
        },
        {
          title: 'Digital Records',
          description: 'Electronic records are acceptable',
          requirements: 'Must be authentic and verifiable',
          reference: 'Evidence Act, Cap 80'
        },
        {
          title: 'Audit Requirements',
          description: 'KRA may audit your records',
          frequency: 'Random or based on risk assessment',
          reference: 'Tax Procedures Act, 2015, Section 36'
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
          title: 'KRA Record Keeping Guide',
          url: 'https://www.kra.go.ke/general/record-keeping',
          description: 'Official KRA guidelines on record keeping'
        },
        {
          title: 'Simple Accounting Apps',
          options: ['BeeZee Finance', 'QuickBooks', 'Sage'],
          description: 'Digital solutions for small businesses'
        }
      ],
      warnings: [
        'Poor record keeping leads to tax penalties',
        'KRA can estimate taxes based on industry standards if records are inadequate',
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
          title: 'CBK Financial Literacy',
          url: 'https://www.centralbank.go.ke/financial-literacy',
          description: 'Central Bank financial education resources'
        },
        {
          title: 'Kenya Bankers Association',
          url: 'https://www.kba.co.ke',
          description: 'Banking industry guidance for businesses'
        }
      ],
      tips: [
        'Use M-Pesa for daily transactions to track cash flow',
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
          description: 'Common requirements from Kenyan banks',
          documents: [
            'Business registration certificates',
            'KRA PIN certificate',
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
            'Youth Enterprise Development Fund',
            'Women Enterprise Fund',
            'Uwezo Fund',
            'Agricultural Finance Corporation'
          ]
        },
        {
          title: 'Alternative Financing',
          description: 'Non-bank financing options',
          options: [
            'SACCOs (Savings and Credit Cooperatives)',
            'Microfinance institutions',
            'Mobile money lenders',
            'Peer-to-peer lending platforms'
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
          title: 'Credit Reference Bureau (CRB)',
          url: 'https://www.crbafrica.com/kenya',
          description: 'Check your credit status'
        },
        {
          title: 'Kenya Bankers Association Loan Guide',
          description: 'Comprehensive loan application guidance'
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
          title: 'County Business Permits',
          description: 'Required for all businesses operating within counties',
          types: ['Single Business Permit', 'Food Handling License', 'Health Certificate'],
          renewal: 'Annual renewal required'
        },
        {
          title: 'Industry-Specific Licenses',
          description: 'Special licenses for certain business types',
          examples: [
            'Tourism: Tourism Regulatory Authority license',
            'Transport: NTSA licenses',
            'Food: Food and Drugs Act compliance',
            'Construction: NCA registration'
          ]
        },
        {
          title: 'Environmental Compliance',
          description: 'Environmental Impact Assessment for certain businesses',
          requirement: 'NEMA (National Environment Management Authority) approval',
          applicability: 'Manufacturing, large-scale operations'
        },
        {
          title: 'Health and Safety',
          description: 'Workplace safety requirements',
          authority: 'Directorate of Occupational Safety and Health (DOSH)',
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
          title: 'County Government Websites',
          description: 'Check your county\'s specific requirements'
        },
        {
          title: 'Regulatory Authorities Directory',
          description: 'Comprehensive list of Kenyan regulators'
        }
      ],
      warnings: [
        'Operating without licenses can lead to closure',
        'License violations may result in fines',
        'Customers prefer licensed businesses'
      ]
    };
  }

  /**
   * Get digital payments content
   */
  getDigitalPaymentsContent() {
    return {
      overview: 'Digital payments are essential for modern business operations in Kenya.',
      keyPoints: [
        {
          title: 'M-Pesa Business',
          description: 'Most popular mobile money platform',
          features: [
            'Till Number for business payments',
            'PayBill Number for customer payments',
            'Bulk payments to suppliers',
            'Transaction history and reporting'
          ],
          costs: 'Transaction fees vary by amount'
        },
        {
          title: 'Bank Mobile Banking',
          description: 'Bank-based mobile payment solutions',
          options: [
            'Equitel',
            'KCB Mobile',
            'Co-op Mobile',
            'NCBA Loop'
          ]
        },
        {
          title: 'Card Payments',
          description: 'Accept debit and credit cards',
          providers: [
            'PayPal',
            'Flutterwave',
            'DPO Group',
            'PesaPal'
          ]
        },
        {
          title: 'Digital Wallet Integration',
          description: 'Multiple payment options for customers',
          benefits: [
            'Increased sales',
            'Better record keeping',
            'Reduced cash handling risks',
            'Customer convenience'
          ]
        }
      ],
      steps: [
        'Register M-Pesa business till number',
        'Set up bank mobile banking',
        'Choose card payment provider',
        'Train staff on payment systems',
        'Display payment options prominently',
        'Reconcile digital payments daily',
        'Maintain transaction records'
      ],
      resources: [
        {
          title: 'Safaricom Business Portal',
          url: 'https://www.safaricom.co.ke/business',
          description: 'M-Pesa business services'
        },
        {
          title: 'CBK Mobile Money Guidelines',
          url: 'https://www.centralbank.go.ke',
          description: 'Regulatory framework for mobile money'
        }
      ],
      tips: [
        'Keep M-Pesa PIN secure',
        'Regularly check transaction history',
        'Use separate business M-Pesa account',
        'Educate customers on digital payments'
      ]
    };
  }

  /**
   * Get employee management content
   */
  getEmployeeManagementContent() {
    return {
      overview: 'Proper employee management ensures compliance and productivity.',
      keyPoints: [
        {
          title: 'Employment Laws',
          description: 'Key labor legislation in Kenya',
          acts: [
            'Employment Act, 2007',
            'Occupational Safety and Health Act, 2007',
            'Work Injury Benefits Act, 2007',
            'National Hospital Insurance Fund Act'
          ]
        },
        {
          title: 'Minimum Wage',
          description: 'Government-set minimum wages',
          current: 'Varies by industry and location (KES 13,572 - KES 27,145)',
          review: 'Reviewed annually by government'
        },
        {
          title: 'Statutory Deductions',
          description: 'Mandatory deductions from employee salaries',
          types: [
            'PAYE (Pay As You Earn) tax',
            'NSSF (National Social Security Fund)',
            'NHIF (National Hospital Insurance Fund)'
          ]
        },
        {
          title: 'Employee Benefits',
          description: 'Statutory and recommended benefits',
          types: [
            'Annual leave (21 days)',
            'Sick leave',
            'Maternity/paternity leave',
            'Service gratuity for long-term employees'
          ]
        }
      ],
      steps: [
        'Register as employer with relevant authorities',
        'Obtain employer PIN from KRA',
        'Register with NSSF and NHIF',
        'Create employment contracts',
        'Set up payroll system',
        'Maintain employee records',
        'Provide safe working environment'
      ],
      resources: [
        {
          title: 'Ministry of Labour',
          url: 'https://www.labour.go.ke',
          description: 'Official labor guidelines and resources'
        },
        {
          title: 'FKE (Federation of Kenya Employers)',
          url: 'https://www.fkekenya.org',
          description: 'Employer guidance and support'
        }
      ],
      warnings: [
        'Non-compliance with labor laws leads to penalties',
        'Unfair dismissal can result in legal action',
        'Employee safety is mandatory'
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
          message: 'I couldn\'t determine the specific topic. Please ask about tax, registration, record keeping, cash flow, credit, licensing, digital payments, or employee management.'
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
      taxObligations: ['tax', 'kra', 'vat', 'turnover', 'withholding', 'income tax', 'pin'],
      businessRegistration: ['register', 'registration', 'business name', 'permit', 'license', 'company'],
      recordKeeping: ['records', 'bookkeeping', 'accounts', 'receipts', 'documentation', 'audit'],
      cashFlowManagement: ['cash flow', 'money', 'liquidity', 'working capital', 'emergency fund'],
      accessingCredit: ['loan', 'credit', 'financing', 'borrow', 'bank', 'sacco', 'fund'],
      licensing: ['license', 'permit', 'compliance', 'regulation', 'nema', 'county'],
      digitalPayments: ['m-pesa', 'mobile money', 'digital payments', 'till number', 'paybill'],
      employeeManagement: ['employee', 'staff', 'worker', 'payroll', 'nssf', 'nhif', 'paye']
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
      keyPoints: topicData.content.keyPoints.slice(0, 3), // Limit to 3 key points
      actionableSteps: topicData.content.steps.slice(0, 5), // Limit to 5 steps
      resources: topicData.content.resources.slice(0, 2), // Limit to 2 resources
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
      advice.push('As a small business, focus on compliance basics first: KRA PIN, business permit, and simple record keeping.');
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
    if (context.location === 'nairobi') {
      advice.push('Nairobi County has specific business requirements - check with Nairobi City County services.');
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
      licensing: ['businessRegistration', 'employeeManagement'],
      digitalPayments: ['cashFlowManagement', 'recordKeeping'],
      employeeManagement: ['licensing', 'recordKeeping']
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
export const kenyaCoachingSystem = new KenyaCoachingSystem();
