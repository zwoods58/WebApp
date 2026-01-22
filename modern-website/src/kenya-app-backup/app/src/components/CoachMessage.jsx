import { ExternalLink } from 'lucide-react';
import { useCountryStore } from '../store/countryStore';

export default function CoachMessage({ content, citations = [] }) {
  const { activeCountry } = useCountryStore(); // Use global store

  // Helper to normalize citations (handles if API returns strings vs objects)
  const normalizedCitations = citations.map(c =>
    typeof c === 'string' ? { url: c, title: c } : c
  );

  // Define Country Resources Map
  const countryResources = {
    'ZA': { // South Africa
      name: 'South Africa',
      tld: 'za',
      domains: 'site:.gov.za OR site:.org.za',
      sources: {
        'supplier': 'https://www.seda.org.za/finding-suppliers-',
        'tax': 'https://www.sars.gov.za/tax-for-',
        'registration': 'https://www.cipc.co.za/register-',
        'funding': 'https://www.seda.org.za/funding-',
        'regulations': 'https://www.gov.za/regulations-',
        'license': 'https://www.seda.org.za/licensing-',
        'permit': 'https://www.gov.za/permits-'
      }
    },
    'NG': { // Nigeria
      name: 'Nigeria',
      tld: 'ng',
      domains: 'site:.gov.ng OR site:.org.ng',
      sources: {
        'supplier': 'https://smedan.gov.ng/msme-suppliers-',
        'tax': 'https://www.firs.gov.ng/tax-for-',
        'registration': 'https://www.cac.gov.ng/company-registration-',
        'funding': 'https://boi.ng/loan-products-',
        'regulations': 'https://www.son.gov.ng/regulations-',
        'license': 'https://smedan.gov.ng/business-licenses-',
        'permit': 'https://www.nipc.gov.ng/permits-'
      }
    },
    'KE': { // Kenya
      name: 'Kenya',
      tld: 'ke',
      domains: 'site:.go.ke OR site:.org.ke',
      sources: {
        'supplier': 'https://mseauthority.go.ke/suppliers-',
        'tax': 'https://itax.kra.go.ke/tax-for-',
        'registration': 'https://brs.ecitizen.go.ke/register-',
        'funding': 'https://uwezo.go.ke/funding-',
        'regulations': 'https://kebs.org/regulations-',
        'license': 'https://business.go.ke/licensing-',
        'permit': 'https://business.go.ke/permits-'
      }
    }
  };

  const currentCountry = countryResources[activeCountry?.code] || countryResources['KE']; // Default to KE in this app

  // Smart URL finding strategies
  const getCitationContext = (fullText, citationNumber) => {
    const sentences = fullText.split('. ');
    const targetSentence = sentences[citationNumber - 1] || sentences[0];

    // Extract key terms for searching
    const keywords = targetSentence
      .toLowerCase()
      .match(/\b(supplier|tax|registration|funding|regulation|legal|license|permit|cost|price|expense)\b/g) || [];

    return keywords[0] || 'business';
  };

  const buildSmartSearch = (context, businessType = 'small business') => {
    const baseQuery = `${context} ${businessType} ${currentCountry.name}`;
    const officialSources = currentCountry.domains;
    const currentYear = new Date().getFullYear();

    return `${baseQuery} ${officialSources} ${currentYear}`;
  };

  const generateFallbackUrl = (topic, businessType = 'small business') => {
    const slug = businessType.replace(' ', '-');
    const baseUrl = currentCountry.sources[topic];
    if (baseUrl) return `${baseUrl}${slug}`;

    // Generic fallbacks based on country
    if (currentCountry.code === 'ZA') return 'https://www.seda.org.za/business-advice';
    if (currentCountry.code === 'KE') return 'https://business.go.ke';
    return 'https://smedan.gov.ng/business-clinic'; // NG fallback
  };

  const findUrlForClaim = (paragraph, citationNumber) => {
    // Extract the specific claim being cited
    const sentences = paragraph.split('. ');
    const targetSentence = sentences[citationNumber - 1] || sentences[0];

    // Get topic context
    const topic = getCitationContext(content, citationNumber);

    // Build smart search with official sources
    const smartQuery = buildSmartSearch(topic);

    // Try fallback URL first, then smart search
    const fallbackUrl = generateFallbackUrl(topic);

    return {
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(smartQuery)}`,
      fallbackUrl,
      topic,
      claim: targetSentence
    };
  };

  const renderContent = () => {
    const paragraphs = content.split('\n\n');

    return paragraphs.map((paragraph, pIndex) => {
      // Skip empty paragraphs and sources section
      if (!paragraph.trim() || paragraph.trim().startsWith('📚 Sources:')) return null;

      // Handle bold and italic formatting
      const formattedParagraph = paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

      const parts = formattedParagraph.split(/(\[\d+\])/g);

      return (
        <p key={pIndex} className={`leading-relaxed ${pIndex > 0 ? 'mt-4' : ''} mb-3`}>
          {parts.map((part, index) => {
            const citationMatch = part.match(/\[(\d+)\]/);

            if (citationMatch) {
              const citationNum = parseInt(citationMatch[1]) - 1;
              const citation = normalizedCitations[citationNum];

              return (
                <sup
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    if (citation?.url) {
                      console.log('Opening URL directly:', citation.url);
                      window.open(citation.url, '_blank', 'noopener,noreferrer');
                    } else {
                      // SMART FALLBACK: Use intelligent URL finding
                      const urlInfo = findUrlForClaim(paragraph, citationNum + 1);

                      console.log('Smart search for topic:', urlInfo.topic);
                      console.log('Search query:', urlInfo.searchUrl);

                      // Try fallback URL first, then smart search
                      if (urlInfo.fallbackUrl) {
                        window.open(urlInfo.fallbackUrl, '_blank', 'noopener,noreferrer');
                      } else {
                        window.open(urlInfo.searchUrl, '_blank', 'noopener,noreferrer');
                      }
                    }
                  }}
                  className={`mx-1 inline-flex items-center justify-center text-xs font-bold rounded cursor-pointer transition-all align-super ${citation?.url
                      ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-110 shadow-sm'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  style={{
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    fontSize: '10px',
                    lineHeight: '16px',
                    verticalAlign: 'super'
                  }}
                  title={citation?.url
                    ? `Open source: ${citation.title || citation.url}`
                    : (() => {
                      const urlInfo = findUrlForClaim(paragraph, citationNum + 1);
                      return `Smart search for ${urlInfo.topic} information - Click to explore official sources`;
                    })()
                  }
                >
                  {citationMatch[1]}
                </sup>
              );
            }

            // Render HTML for bold/italic
            if (part.includes('<strong>') || part.includes('<em>')) {
              return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
            }

            return <span key={index}>{part}</span>;
          })}
        </p>
      );
    }).filter(Boolean); // Remove null entries
  };

  const renderCitationCards = () => {
    if (!normalizedCitations || normalizedCitations.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">📚 Sources</span>
        </div>
        <div className="space-y-2">
          {normalizedCitations.map((citation, idx) => (
            <a
              key={idx}
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-100 rounded-lg transition-all group"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-blue-600 truncate group-hover:underline">
                  {citation.title || citation.url}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {citation.url}
                </p>
              </div>
              <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="text-sm font-medium text-gray-900">
      {renderContent()}
      {renderCitationCards()}
    </div>
  );
}
