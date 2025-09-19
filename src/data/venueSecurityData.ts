// Venue Security Questionnaire Data for Armora Close Protection Services
import { VenueSecurityStepData } from '../types/venue';

export const venueSecuritySteps: VenueSecurityStepData[] = [
  {
    id: 1,
    title: "Event Basics",
    subtitle: "Tell us about your event",
    question: "What type of event are you planning?",
    type: "radio",
    options: [
      {
        id: "wedding",
        label: "Wedding",
        value: "wedding",
        description: "Private wedding ceremony and/or reception requiring discrete security presence"
      },
      {
        id: "corporate",
        label: "Corporate Event",
        value: "corporate",
        description: "Business conference, product launch, or company gathering with professional security needs"
      },
      {
        id: "private-party",
        label: "Private Party",
        value: "private-party",
        description: "Personal celebration, birthday, or social gathering requiring security oversight"
      },
      {
        id: "conference",
        label: "Conference/Summit",
        value: "conference",
        description: "Large-scale business or academic conference with multiple speakers and attendees"
      },
      {
        id: "gala",
        label: "Gala/Charity Event",
        value: "gala",
        description: "Formal fundraising event or charity gala with high-profile guests"
      },
      {
        id: "political",
        label: "Political Event",
        value: "political",
        description: "Political rally, campaign event, or government function requiring enhanced security"
      },
      {
        id: "entertainment",
        label: "Entertainment Event",
        value: "entertainment",
        description: "Concert, show, or entertainment venue requiring crowd management and VIP protection"
      },
      {
        id: "other",
        label: "Other",
        value: "other",
        description: "Different type of event - please specify in additional requirements section"
      }
    ],
    validation: { required: true, errorMessage: "Please select your event type" },
    helpText: "Choose the option that best describes your event type. This helps us understand the appropriate security protocols."
  },
  {
    id: 2,
    title: "Event Details",
    subtitle: "Event scheduling and duration",
    question: "When is your event and how long will it last?",
    type: "radio",
    options: [
      {
        id: "single-day",
        label: "Single Day Event",
        value: "single-day",
        description: "One day event (up to 12 hours of security coverage)"
      },
      {
        id: "2-days",
        label: "2-Day Event",
        value: "2-days",
        description: "Two consecutive days of security coverage"
      },
      {
        id: "weekend",
        label: "Weekend Event",
        value: "weekend",
        description: "Friday-Sunday or Saturday-Sunday event coverage"
      },
      {
        id: "week",
        label: "Week-Long Event",
        value: "week",
        description: "Extended event requiring security for 5-7 days"
      },
      {
        id: "month",
        label: "Monthly Coverage",
        value: "month",
        description: "Ongoing security requirements for extended period"
      },
      {
        id: "custom",
        label: "Custom Duration",
        value: "custom",
        description: "Specific timing requirements - please specify in additional notes"
      }
    ],
    validation: { required: true, errorMessage: "Please select your event duration" },
    helpText: "Select the duration that matches your security needs. Pricing is calculated per day per officer."
  },
  {
    id: 3,
    title: "Venue Information",
    subtitle: "About your venue",
    question: "Tell us about your venue and expected attendance",
    type: "slider",
    sliderProps: {
      min: 25,
      max: 5000,
      step: 25,
      defaultValue: 150,
      unit: "guests"
    },
    validation: { required: true, errorMessage: "Please set expected attendance" },
    helpText: "Move the slider to indicate how many people you expect at your event. This helps us calculate the appropriate number of security officers."
  },
  {
    id: 4,
    title: "Venue Type & Layout",
    subtitle: "Venue characteristics",
    question: "What type of venue are you using?",
    type: "checkbox",
    options: [
      {
        id: "hotel-conference-center",
        label: "Hotel/Conference Center",
        value: "hotel-conference-center",
        description: "Established venue with existing security infrastructure"
      },
      {
        id: "private-estate",
        label: "Private Estate/Manor",
        value: "private-estate",
        description: "Private property requiring comprehensive security planning"
      },
      {
        id: "restaurant-venue",
        label: "Restaurant/Event Venue",
        value: "restaurant-venue",
        description: "Commercial event space with kitchen and service areas"
      },
      {
        id: "outdoor-marquee",
        label: "Outdoor/Marquee",
        value: "outdoor-marquee",
        description: "Outdoor event requiring perimeter security and weather considerations"
      },
      {
        id: "multiple-locations",
        label: "Multiple Locations",
        value: "multiple-locations",
        description: "Event spanning multiple venues requiring coordinated security"
      },
      {
        id: "public-venue",
        label: "Public Venue",
        value: "public-venue",
        description: "Museum, gallery, or public space with access control requirements"
      },
      {
        id: "alcohol-service",
        label: "Alcohol Will Be Served",
        value: "alcohol-service",
        description: "Event includes licensed bar requiring crowd management awareness"
      },
      {
        id: "vip-areas",
        label: "VIP/Restricted Areas",
        value: "vip-areas",
        description: "Event includes exclusive areas requiring access control"
      }
    ],
    validation: {
      required: true,
      minSelections: 1,
      maxSelections: 8,
      errorMessage: "Please select 1-8 venue characteristics"
    },
    helpText: "Select all characteristics that apply to your venue. This helps our security team prepare appropriately."
  },
  {
    id: 5,
    title: "Security Requirements",
    subtitle: "Your protection needs",
    question: "What is your primary security concern?",
    type: "checkbox",
    options: [
      {
        id: "guest-safety",
        label: "General Guest Safety Management",
        value: "guest-safety",
        description: "Ensuring all attendees feel safe and secure throughout the event"
      },
      {
        id: "vip-protection",
        label: "VIP/Executive Close Protection",
        value: "vip-protection",
        description: "Personal protection for high-profile attendees or speakers"
      },
      {
        id: "asset-protection",
        label: "Asset/Gift Protection",
        value: "asset-protection",
        description: "Securing valuable items, artwork, or wedding gifts"
      },
      {
        id: "crowd-control",
        label: "Crowd Control & Access Management",
        value: "crowd-control",
        description: "Managing large groups and controlling venue access points"
      },
      {
        id: "threat-mitigation",
        label: "Known Threat Mitigation",
        value: "threat-mitigation",
        description: "Addressing specific security concerns or previous incidents"
      },
      {
        id: "media-management",
        label: "Media/Paparazzi Management",
        value: "media-management",
        description: "Controlling media access and protecting privacy"
      },
      {
        id: "emergency-response",
        label: "Emergency Response Preparedness",
        value: "emergency-response",
        description: "Medical emergencies and evacuation planning"
      }
    ],
    validation: {
      required: true,
      minSelections: 1,
      maxSelections: 5,
      errorMessage: "Please select 1-5 primary concerns"
    },
    helpText: "Select your main security concerns. Our officers are trained to handle all scenarios professionally."
  },
  {
    id: 6,
    title: "Attendee Profile",
    subtitle: "About your guests",
    question: "What type of attendees are you expecting?",
    type: "checkbox",
    options: [
      {
        id: "high-profile-guests",
        label: "High-Profile Guests",
        value: "high-profile-guests",
        description: "Celebrity, business leaders, or well-known public figures"
      },
      {
        id: "government-officials",
        label: "Government Officials",
        value: "government-officials",
        description: "Local MPs, council members, or civil servants requiring protocol awareness"
      },
      {
        id: "international-guests",
        label: "International Guests",
        value: "international-guests",
        description: "Overseas visitors who may need cultural sensitivity and language support"
      },
      {
        id: "media-presence",
        label: "Media Presence Expected",
        value: "media-presence",
        description: "Press, photographers, or media coverage planned for the event"
      },
      {
        id: "business-networking",
        label: "Business Networking Event",
        value: "business-networking",
        description: "Professional networking requiring discrete security presence"
      },
      {
        id: "family-children",
        label: "Families with Children",
        value: "family-children",
        description: "Family-friendly event requiring child safety awareness"
      },
      {
        id: "controversial-aspects",
        label: "Potentially Controversial Content",
        value: "controversial-aspects",
        description: "Event topics or speakers that might attract unwanted attention"
      },
      {
        id: "general-public",
        label: "General Public Attendees",
        value: "general-public",
        description: "Standard event guests without specific security considerations"
      }
    ],
    validation: {
      required: true,
      minSelections: 1,
      maxSelections: 6,
      errorMessage: "Please select 1-6 attendee characteristics"
    },
    helpText: "Understanding your guest profile helps us assign officers with appropriate experience and training."
  },
  {
    id: 7,
    title: "Service Level Selection",
    subtitle: "Choose your protection level",
    question: "Which level of venue protection do you need?",
    type: "radio",
    options: [
      {
        id: "essential",
        label: "Essential Protection (£500-600/day per officer)",
        value: "essential",
        description: "SIA Level 3 Licensed • Venue perimeter security • Guest list management • Emergency response protocols • Ideal for: Corporate events, essential weddings"
      },
      {
        id: "executive",
        label: "Executive Protection (£700-800/day per officer)",
        value: "executive",
        description: "Military/Police background • VIP close protection • Advance venue reconnaissance • Threat assessment included • Ideal for: High-profile events, celebrity weddings"
      },
      {
        id: "elite",
        label: "Elite Protection (£900-1000/day per officer)",
        value: "elite",
        description: "Special forces trained • Counter-surveillance • International protection experience • Full security team coordination • Ideal for: Government events, ultra-high-net-worth"
      }
    ],
    validation: { required: true, errorMessage: "Please select a service level" },
    helpText: "Choose the protection level that matches your event's profile and security requirements."
  },
  {
    id: 8,
    title: "Officer Requirements",
    subtitle: "Security team composition",
    question: "How many officers do you need?",
    type: "slider",
    sliderProps: {
      min: 2,
      max: 20,
      step: 1,
      defaultValue: 4,
      unit: "officers"
    },
    validation: { required: true, errorMessage: "Please select number of officers" },
    helpText: "We recommend 1 officer per 50-75 guests. Minimum 2 officers for any venue event. Our team will provide final recommendations based on your venue assessment."
  },
  {
    id: 9,
    title: "Final Details",
    subtitle: "Complete your request",
    question: "Any additional requirements or information?",
    type: "text",
    placeholder: "Please provide any specific requirements, venue address, special circumstances, or questions you have...",
    validation: { required: false, errorMessage: "Please provide additional details if needed" },
    helpText: "Include venue address, specific timing, special requirements, or any other details that would help us prepare the perfect security plan for your event."
  }
];

export default venueSecuritySteps;