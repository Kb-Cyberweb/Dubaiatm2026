import React, { useState, useCallback } from 'react';
import { generateLeads, generateSocialGroups } from './services/geminiService';
import type { Lead, Strategy, SocialGroup } from './types';
import Header from './components/Header';
import LeadTable from './components/LeadTable';
import StrategyCard from './components/StrategyCard';
import OutreachSection from './components/OutreachSection';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Pagination from './components/Pagination';
import SparklesIcon from './components/icons/SparklesIcon';
import ClipboardIcon from './components/icons/ClipboardIcon';
import InfoIcon from './components/icons/InfoIcon';

const CATEGORIES = [
  "All Categories",
  "Restaurants & Cafes",
  "Hotels & Hospitality",
  "Retail & E-commerce",
  "Real Estate & Property",
  "Healthcare & Clinics",
  "Automotive Services",
  "Construction & Engineering",
  "Professional Services (Law, Accounting)",
  "Beauty & Wellness",
  "Education & Training",
  "Entertainment & Leisure",
];

const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [facebookGroups, setFacebookGroups] = useState<SocialGroup[]>([]);
  const [linkedinGroups, setLinkedinGroups] = useState<SocialGroup[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState<boolean>(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState<boolean>(false);
  
  const [facebookFetched, setFacebookFetched] = useState<boolean>(false);
  const [linkedinFetched, setLinkedinFetched] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [sourceUrl, setSourceUrl] = useState<string>('https://dubai-businessdirectory.com/home.php');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  
  const PROMO_MESSAGE = "If your business needs cost-effective and results-driven digital solutions, we’re here to help. From custom websites, SEO, and social media management to comprehensive review management and QR/NFC smart review cards, we deliver everything you need to strengthen your online presence and attract more customers.";


  const fetchLeads = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    if (page === 1) {
      setLeads([]);
      setStrategies([]);
      setFacebookGroups([]);
      setLinkedinGroups([]);
      setFacebookFetched(false);
      setLinkedinFetched(false);
      setTotalPages(0);
    }

    try {
      const result = await generateLeads(sourceUrl, selectedCategory, page);
      if (result && result.leads) {
        setLeads(result.leads);
        // Strategies are only fetched on the first page
        if (page === 1 && result.strategies) {
           setStrategies(result.strategies);
           setTotalPages(5); // Set total pages after first successful fetch
        }
        setCurrentPage(page);
      } else {
        setError('Received an invalid or empty response from the AI. Please try again.');
        if (page === 1) setTotalPages(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      if (page === 1) setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [sourceUrl, selectedCategory]);

  const handleGenerate = () => {
    fetchLeads(1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
        fetchLeads(page);
    }
  };


  const handleFindFacebookGroups = useCallback(async () => {
    setIsFacebookLoading(true);
    setError(null);
    try {
        const groups = await generateSocialGroups('Facebook');
        setFacebookGroups(groups);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not fetch Facebook groups.');
    } finally {
        setIsFacebookLoading(false);
        setFacebookFetched(true);
    }
  }, []);
  
  const handleFindLinkedInGroups = useCallback(async () => {
    setIsLinkedInLoading(true);
    setError(null);
    try {
        const groups = await generateSocialGroups('LinkedIn');
        setLinkedinGroups(groups);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not fetch LinkedIn groups.');
    } finally {
        setIsLinkedInLoading(false);
        setLinkedinFetched(true);
    }
  }, []);

  const handleCopyToClipboard = useCallback(() => {
    if (leads.length === 0) return;

    const headers = ["Business Name", "Industry", "Location", "Contact", "Reason for Lead"];
    
    const sanitizeField = (field: string | undefined | null): string => {
        if (field === null || typeof field === 'undefined') {
            return '';
        }
        const stringField = String(field);
        return stringField.replace(/(\r\n|\n|\r|\t)/gm, " ");
    };

    const tsvRows = [
      headers.join('\t'),
      ...leads.map(lead => [
        sanitizeField(lead.businessName),
        sanitizeField(lead.industry),
        sanitizeField(lead.location),
        sanitizeField(lead.contact),
        sanitizeField(lead.reason),
      ].join('\t'))
    ];

    const tsvString = tsvRows.join('\n');
    
    navigator.clipboard.writeText(tsvString).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      setError('Could not copy to clipboard. Your browser might not support this feature or permissions might be denied.');
    });
  }, [leads]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Your Next Client in the UAE/Dubai</h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Leverage AI to find your next client. Get a fresh, targeted list of small & medium-sized enterprises in Dubai and neighboring Emirates, perfect for the IT services offered by CGSInfotech.com.
          </p>
          <p className="text-sm text-slate-500 max-w-3xl mx-auto mt-3 flex items-center justify-center gap-2" role="status">
            <InfoIcon className="h-4 w-4 flex-shrink-0" />
            <span>Leads are sourced from a wide range of commercial areas across Dubai and its neighboring regions.</span>
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mb-12">
           <div className="w-full max-w-xl mb-6 space-y-4">
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2 text-left">
                  Business Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
             </div>
             <div>
              <label htmlFor="source-url" className="block text-sm font-medium text-slate-300 mb-2 text-left">
                Source URL for Lead Generation (e.g., a business directory)
              </label>
              <input
                type="url"
                id="source-url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example-directory.com"
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200"
                aria-describedby="url-helper-text"
              />
               <p id="url-helper-text" className="mt-2 text-xs text-slate-500 text-left">
                 The AI will use this link as the primary source to find business leads.
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !sourceUrl}
            className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-live="polite"
          >
            {isLoading && currentPage === 1 ? (
              <>
                <LoadingSpinner />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon />
                Find High-Quality Leads
              </>
            )}
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {leads.length > 0 && (
          <div className="space-y-16">
            <section aria-labelledby="leads-heading">
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 text-center">
                <h3 id="leads-heading" className="text-3xl font-bold text-amber-400">Potential Business Leads</h3>
                <button
                  onClick={handleCopyToClipboard}
                  disabled={isCopied}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:bg-green-700 disabled:cursor-default"
                  aria-label="Copy leads for Google Sheets"
                >
                  <ClipboardIcon className="h-5 w-5" />
                  {isCopied ? 'Copied to Clipboard!' : 'Copy for Sheets'}
                </button>
              </div>
              <LeadTable leads={leads} />
              {totalPages > 1 && (
                 <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                />
              )}
            </section>

            {strategies.length > 0 && (
              <section aria-labelledby="strategies-heading">
                <h3 id="strategies-heading" className="text-3xl font-bold text-center mb-8 text-amber-400">Strategic Outreach Ideas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {strategies.map((strategy, index) => (
                    <StrategyCard key={index} strategy={strategy} index={index} />
                  ))}
                </div>
              </section>
            )}
            
            <OutreachSection
                message={PROMO_MESSAGE}
                onFindFacebook={handleFindFacebookGroups}
                onFindLinkedIn={handleFindLinkedInGroups}
                facebookGroups={facebookGroups}
                linkedinGroups={linkedinGroups}
                isFacebookLoading={isFacebookLoading}
                isLinkedInLoading={isLinkedInLoading}
                facebookFetched={facebookFetched}
                linkedinFetched={linkedinFetched}
            />
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-slate-500">
        <p>&copy; {new Date().getFullYear()} Dubai Business Lead Generator. Powered by AI.</p>
      </footer>
    </div>
  );
};

export default App;