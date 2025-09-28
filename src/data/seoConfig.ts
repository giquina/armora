export const SEO_CONFIG = {
  defaultTitle: 'Armora - SIA Licensed Close Protection Officers | Executive Security UK',
  titleTemplate: '%s | Armora Security',
  defaultDescription: 'SIA licensed close protection officers providing executive security services across the UK. Professional CPOs from £50/hour. Nationwide coverage England, Wales, Scotland & Northern Ireland.',
  siteUrl: 'https://armorasecurity.com',
  siteName: 'Armora Security',
  twitterHandle: '@ArmoraSecurity',

  // Page-specific titles and descriptions
  pages: {
    home: {
      title: 'SIA Licensed Close Protection Officers | Executive Security UK',
      description: 'Professional close protection services across the UK. SIA licensed CPOs from £50/hour. Nationwide coverage England, Wales, Scotland & Northern Ireland.'
    },
    services: {
      title: 'Protection Services | Essential, Executive & Shadow Protection',
      description: 'Choose from Essential Protection (£65/h), Executive Shield (£95/h), or Shadow Protocol (£125/h). All SIA licensed protection officers.'
    },
    'protection-assignment': {
      title: 'Book Protection Officers | 24/7 Security Detail Services',
      description: 'Request protection services with 2-hour minimum bookings. Immediate availability for security assignments across the UK.'
    },
    dashboard: {
      title: 'My Protection Assignments | Armora Security Dashboard',
      description: 'Manage your protection details, view active assignments, and track security officer locations in real-time.'
    },
    hub: {
      title: 'Protection Command Centre | Live Assignment Tracking',
      description: 'Monitor active protection details, communicate with CPOs, and manage security assignments from your command centre.'
    },
    profile: {
      title: 'Security Profile | Protection Preferences',
      description: 'Manage your protection preferences, security requirements, and personal safety settings.'
    },
    assignments: {
      title: 'Active Protection Details | Security Assignments',
      description: 'View current and past protection assignments, officer details, and security service history.'
    },
    payment: {
      title: 'Secure Payment | Protection Service Fees',
      description: 'Secure payment processing for close protection services. Corporate accounts and VAT invoicing available.'
    },
    about: {
      title: 'About Armora | Professional CPO Services Since 2024',
      description: 'Leading provider of SIA licensed close protection officers in London. Professional executive security since 2024.'
    },
    contact: {
      title: 'Contact Security Team | 24/7 Protection Support',
      description: '24/7 security support and emergency response. Contact our professional protection team for immediate assistance.'
    }
  },

  // SEO keywords by category
  keywords: {
    primary: ['close protection UK', 'SIA licensed CPO', 'executive protection nationwide', 'security detail', 'protection officers'],
    secondary: ['professional bodyguards UK', 'Armora security', 'personal protection services', 'corporate security', 'VIP protection'],
    location: ['UK close protection', 'England security services', 'Wales protection officers', 'Scotland bodyguards', 'Northern Ireland CPO', 'nationwide security'],
    service: ['protection detail', 'security assignment', 'executive shield', 'shadow protocol', 'essential protection']
  },

  // Schema.org structured data templates
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Armora Security',
      description: 'SIA licensed close protection officers and executive security services',
      url: 'https://armorasecurity.com',
      telephone: '+44-20-XXXX-XXXX',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB'
      },
      priceRange: '£50-£125 per hour',
      serviceType: ['Close Protection', 'Executive Protection', 'Security Services'],
      areaServed: [
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'England' },
        { '@type': 'Country', name: 'Wales' },
        { '@type': 'Country', name: 'Scotland' },
        { '@type': 'Country', name: 'Northern Ireland' }
      ]
    }
  }
};

// Professional terminology mappings for consistency
export const TERMINOLOGY_MAP = {
  // NEVER USE -> ALWAYS USE
  forbidden: {
    'taxi': 'protection service',
    'protection service': 'protection-assignment',
    'protection officer': 'protection officer',
    'principal': 'principal',
    'protection detail': 'security detail',
    'journey': 'protection detail',
    'service fee': 'service fee',
    'commencement point': 'collection',
    'secure destination': 'delivery'
  },

  // Preferred professional terms
  preferred: {
    'Close Protection Officer': 'CPO',
    'Protection Detail': 'security assignment',
    'Principal': 'client under protection',
    'Security Assessment': 'protection evaluation',
    'Protection Assignment': 'security detail'
  }
};