import { useState, useRef, useEffect } from 'react';
import { X, FileText, Download, Plus, Trash2, Calendar, User, Mail, Phone, MapPin, Percent, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Invoice/Receipt Generator Modal Component
 * Professional template with auto-numbering, client management, and tax integration
 */
export default function InvoiceReceiptModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const { t } = useTranslation();
  const [documentType, setDocumentType] = useState('invoice'); // 'invoice' or 'receipt'
  const [documentNumber, setDocumentNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: ''
  });
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(15); // Default SA VAT rate
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [savedClients, setSavedClients] = useState([]);
  const [showClientList, setShowClientList] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const modalRef = useRef(null);

  // Auto-generate document number
  useEffect(() => {
    if (isOpen && !documentNumber) {
      generateDocumentNumber();
    }
  }, [isOpen, documentType]);

  // Calculate totals whenever items or tax rate changes
  useEffect(() => {
    calculateTotals();
  }, [items, taxRate]);

  // Load saved clients and company info
  useEffect(() => {
    loadSavedData();
  }, []);

  const generateDocumentNumber = () => {
    const prefix = documentType === 'invoice' ? 'INV' : 'REC';
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newNumber = `${prefix}-${year}-${randomNum}`;
    setDocumentNumber(newNumber);
  };

  const loadSavedData = () => {
    // Load saved clients
    const clients = localStorage.getItem('saved_clients');
    if (clients) {
      setSavedClients(JSON.parse(clients));
    }

    // Load company info
    const company = localStorage.getItem('company_info');
    if (company) {
      setCompanyInfo(JSON.parse(company));
    }
  };

  const saveCompanyInfo = () => {
    localStorage.setItem('company_info', JSON.stringify(companyInfo));
  };

  const saveClient = () => {
    if (clientInfo.name && clientInfo.email) {
      const updatedClients = [...savedClients.filter(c => c.email !== clientInfo.email), clientInfo];
      setSavedClients(updatedClients);
      localStorage.setItem('saved_clients', JSON.stringify(updatedClients));
    }
  };

  const selectClient = (client) => {
    setClientInfo(client);
    setShowClientList(false);
  };

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1;
    setItems([...items, { id: newId, description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const newSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    const newTaxAmount = newSubtotal * (taxRate / 100);
    const newTotal = newSubtotal + newTaxAmount;
    
    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotalAmount(newTotal);
  };

  const fetchTaxRate = async () => {
    try {
      // Using OpenRouter API for tax rate
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'perplexity/llama-3.1-sonar-small-128k-online',
          messages: [{
            role: 'user',
            content: 'What is the current VAT rate in South Africa for 2024? Just give me the percentage number.'
          }]
        })
      });

      const data = await response.json();
      const rate = parseFloat(data.choices[0].message.content.match(/\d+/)?.[0] || '15');
      setTaxRate(rate);
    } catch (error) {
      console.error('Error fetching tax rate:', error);
      // Fallback to 15%
      setTaxRate(15);
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Save company info and client
      saveCompanyInfo();
      saveClient();

      // Create document data
      const documentData = {
        type: documentType,
        number: documentNumber,
        issueDate,
        dueDate: documentType === 'invoice' ? dueDate : issueDate,
        companyInfo,
        clientInfo,
        items,
        taxRate,
        subtotal,
        taxAmount,
        totalAmount,
        notes
      };

      // Generate PDF (you'll need a PDF library like jsPDF)
      await onSubmit(documentData);
      
      onClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="invoice-receipt-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-modal-title"
      >
        <div className="modal-drag-handle" />
        
        <div className="modal-header-section">
          <button onClick={onClose} className="modal-close-button">
            <X size={24} />
          </button>
          <h2 id="invoice-modal-title" className="modal-title flex-1 text-center">
            {documentType === 'invoice' ? 'Create Invoice' : 'Create Receipt'}
          </h2>
          <button type="button" onClick={generatePDF} disabled={isGenerating} className="modal-action-button">
            <Download size={20} />
            {isGenerating ? 'Generating...' : 'PDF'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto modal-content">
          {/* Document Type Toggle */}
          <div className="document-type-toggle">
            <button
              type="button"
              className={`type-toggle-btn ${documentType === 'invoice' ? 'active' : ''}`}
              onClick={() => setDocumentType('invoice')}
            >
              Invoice
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${documentType === 'receipt' ? 'active' : ''}`}
              onClick={() => setDocumentType('receipt')}
            >
              Receipt
            </button>
          </div>

          {/* Document Info */}
          <div className="document-info-section">
            <div className="form-row">
              <div className="form-field">
                <label>Document Number</label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="form-input"
                  readOnly
                />
              </div>
              <div className="form-field">
                <label>Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {documentType === 'invoice' && (
              <div className="form-field">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>

          {/* Company Information */}
          <div className="company-section">
            <h3>Company Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Company Name</label>
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  className="form-input"
                  placeholder="Your company name"
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                  className="form-input"
                  placeholder="company@example.com"
                />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  className="form-input"
                  placeholder="+27 12 345 6789"
                />
              </div>
              <div className="form-field">
                <label>Address</label>
                <input
                  type="text"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                  className="form-input"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="client-section">
            <h3>Client Information</h3>
            <div className="client-header">
              <button
                type="button"
                onClick={() => setShowClientList(!showClientList)}
                className="client-select-button"
              >
                <User size={16} />
                {showClientList ? 'Hide Clients' : 'Select Saved Client'}
              </button>
            </div>

            {showClientList && savedClients.length > 0 && (
              <div className="saved-clients-list">
                {savedClients.map((client, index) => (
                  <div key={index} className="client-item" onClick={() => selectClient(client)}>
                    <div className="client-name">{client.name}</div>
                    <div className="client-email">{client.email}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="form-grid">
              <div className="form-field">
                <label>Client Name</label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                  className="form-input"
                  placeholder="Client name"
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                  className="form-input"
                  placeholder="client@example.com"
                />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                  className="form-input"
                  placeholder="+27 12 345 6789"
                />
              </div>
              <div className="form-field">
                <label>Address</label>
                <input
                  type="text"
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                  className="form-input"
                  placeholder="Client address"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="items-section">
            <div className="items-header">
              <h3>Items</h3>
              <button type="button" onClick={addItem} className="add-item-button">
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="items-list">
              {items.map((item) => (
                <div key={item.id} className="item-row">
                  <div className="item-description">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="form-input"
                    />
                  </div>
                  <div className="item-quantity">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="Qty"
                      className="form-input"
                      min="1"
                    />
                  </div>
                  <div className="item-price">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="item-total">
                    <input
                      type="number"
                      value={item.total}
                      readOnly
                      className="form-input total-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="remove-item-button"
                    disabled={items.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax and Totals */}
          <div className="totals-section">
            <div className="tax-section">
              <div className="tax-rate-row">
                <label>Tax Rate (%)</label>
                <div className="tax-input-group">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="tax-input"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <button type="button" onClick={fetchTaxRate} className="fetch-tax-button">
                    <Percent size={16} />
                    Get Current Rate
                  </button>
                </div>
              </div>
            </div>

            <div className="totals-summary">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax ({taxRate}%):</span>
                <span>R{taxAmount.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>R{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="notes-section">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or payment terms..."
              className="form-textarea"
              rows={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
