import { SEO_CONFIG } from '../data/seoConfig';

/**
 * Utility functions for managing SEO meta tags and page titles
 * Works without external dependencies like react-helmet
 */

export interface SEOPageData {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
}

/**
 * Update the document title dynamically
 */
export const updatePageTitle = (title?: string): void => {
  if (typeof document !== 'undefined') {
    document.title = title || SEO_CONFIG.defaultTitle;
  }
};

/**
 * Update meta description dynamically
 */
export const updateMetaDescription = (description?: string): void => {
  if (typeof document !== 'undefined') {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || SEO_CONFIG.defaultDescription);
    }
  }
};

/**
 * Update meta keywords dynamically
 */
export const updateMetaKeywords = (keywords?: string[]): void => {
  if (typeof document !== 'undefined' && keywords) {
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords.join(', '));
    }
  }
};

/**
 * Get SEO data for a specific page
 */
export const getPageSEO = (pageName: keyof typeof SEO_CONFIG.pages): SEOPageData => {
  const pageData = SEO_CONFIG.pages[pageName];
  return {
    title: pageData?.title || SEO_CONFIG.defaultTitle,
    description: pageData?.description || SEO_CONFIG.defaultDescription,
    keywords: SEO_CONFIG.keywords.primary,
    path: `/${pageName === 'home' ? '' : pageName}`
  };
};

/**
 * Apply complete SEO update for a page
 */
export const applySEOUpdate = (pageName: keyof typeof SEO_CONFIG.pages): void => {
  const seoData = getPageSEO(pageName);
  updatePageTitle(seoData.title);
  updateMetaDescription(seoData.description);
  updateMetaKeywords(seoData.keywords);
};

/**
 * Generate canonical URL for current page
 */
export const getCanonicalUrl = (path: string = ''): string => {
  return `${SEO_CONFIG.siteUrl}${path}`;
};

/**
 * Validate if text uses professional close protection terminology
 */
export const validateTerminology = (text: string): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  const forbiddenTerms = ['taxi', 'protection service', 'protection officer', 'principal', 'protection detail', 'uber', 'lyft'];

  forbiddenTerms.forEach(term => {
    if (text.toLowerCase().includes(term)) {
      issues.push(`Found forbidden term: "${term}". Consider using professional security terminology instead.`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * Hook-style function for React components to manage SEO
 */
export const useSEO = (pageName: keyof typeof SEO_CONFIG.pages) => {
  // Apply SEO updates when called
  const updateSEO = () => {
    applySEOUpdate(pageName);
  };

  return { updateSEO, seoData: getPageSEO(pageName) };
};