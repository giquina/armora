import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './FAQ.module.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "How can Armora provide protection in just 15-20 minutes?",
    answer: "We have SIA-licensed Close Protection Officers strategically positioned across major UK cities. When your booking arrives, our Operations Center immediately receives your location and secureDestination, runs a location assessment for your specific route, conducts basic threat assessment for your journey areas, assigns the nearest qualified officer, and sends them your profile preferences. It's organized, efficient, and professional - like having your own security team always nearby."
  },
  {
    id: 2,
    question: "What's the difference between Armora and just getting a regular Protection Officer?",
    answer: "Many successful professionals want more than someone who can drive - they want genuine peace of mind. Regular Protection Officers provide transportation only with no security training. Armora Close Protection Officers are SIA-licensed by the UK government, have military or police backgrounds (minimum 5 years), are trained in threat assessment and defensive driving, and can handle security situations professionally. As one client puts it: \"I don't need theatrical bodyguards, but knowing my officer is government-licensed and thinking about my security - not just the route - changes everything.\""
  },
  {
    id: 3,
    question: "What app features enhance my protection experience?",
    answer: "Our app is your complete protection platform. Features include secure messaging with your Close Protection Officer, live tracking of arrival and journey, saved profile preferences (protection style, regular routes, special requirements), ability to request favorite officers, complete journey history for expenses, panic button for emergencies, and multi-Principal booking options. Once you create your profile with preferences, every officer arrives fully briefed - no repeated explanations needed."
  },
  {
    id: 4,
    question: "Who typically uses Armora and why?",
    answer: "Our diverse client base includes content creators and streamers (\"Fan meetups can get overwhelming\"), international business visitors (\"Need UK security without hiring a firm\"), nightlife groups (\"Birthday party with 8 friends, booked 3 officers\"), nightlife club performers and dancers who prioritize safe transport after late performances, female executives (\"Late night office departures\"), crypto entrepreneurs (\"After my gains went public\"), medical tourists (\"Vulnerable after Harley Street procedures\"), and anyone who simply wants more than just a Protection Officer. The common thread? They all want genuine, government-licensed protection that's easy to arrange."
  },
  {
    id: 5,
    question: "Can I book multiple Close Protection Officers?",
    answer: "Absolutely. Through our app, you can book 1 to 10+ officers depending on your needs. Select the number needed, choose protection style for each (visible or discrete), and a lead officer coordinates the team. Common scenarios include content creator events (4 officers for meet-and-greets), nightclub tables (3 officers for comprehensive coverage), private parties (5+ officers for full venue security), and group celebrations where everyone wants to relax knowing security is handled. It's as easy as moving a slider in the app."
  },
  {
    id: 6,
    question: "How does Armora work for international visitors?",
    answer: "We're particularly popular with international visitors who want familiar security standards in the UK. Business executives use us for meeting-to-meeting protection, government officials book us when not qualifying for diplomatic protection, investors request us for high-value property viewings, and tourists want peace of mind exploring London. Your profile saves language preferences, protection style, and regular destinations. As one Dubai executive noted: \"Armora gives me the same protection standard I have at home, bookable from my hotel.\""
  },
  {
    id: 7,
    question: "What happens with location and threat assessment?",
    answer: "When your booking arrives, we specifically assess YOUR journey - not monitor all of London. Our Operations Center evaluates your Commencement Point and secureDestination areas, checks for current events or disruptions, identifies secure alternatives if needed, considers time-specific factors (late night, rush hour), and briefs your officer on any relevant considerations. It's focused, practical intelligence for your specific journey, delivered in minutes not hours."
  },
  {
    id: 8,
    question: "How does Armora work for nightlife and social events?",
    answer: "Your night out deserves proper protection. Whether solo or celebrating with friends, choose exactly the protection you need. Book one officer for personal security, two for couples, three for small groups, or scale up to 10+ for large events. Choose visible protection (professional attire) or discrete service (smart casual, blending in). Our officers understand nightlife dynamics - from managing club table security to ensuring safe departures for performers and dancers after late-night venues. Perfect for birthdays, corporate entertainment, casino nights, or just wanting to enjoy London's nightlife with complete peace of mind."
  },
  {
    id: 9,
    question: "What makes Armora perfect for content creators and digital celebrities?",
    answer: "The digital age has created new security needs. Streamers use us for fan meetups and events, YouTubers book protection after revealing valuable setups, vloggers have officers maintain comfortable distances while filming, and influencers need discrete security at brand events. Our Close Protection Officers understand the difference between excited fans and genuine concerns, protecting without damaging your audience relationships. As one creator with 2M subscribers said: \"They keep me safe without making my fans feel pushed away.\""
  },
  {
    id: 10,
    question: "How does the profile system make service better?",
    answer: "Create your profile once, and every booking is personalized. Set your protection style preference (visible/discrete/shadow), save regular destinations, specify language preferences, include medical information if relevant, choose vehicle preferences, and note any special requirements. Every Close Protection Officer arrives knowing exactly how you want your protection handled. After several bookings, request your favorite officers directly. It's like having your own security team who knows you, available on-demand."
  },
  {
    id: 11,
    question: "What makes Armora special for those who just want peace of mind?",
    answer: "Not everyone faces specific threats - many clients simply want confidence and peace of mind. This means knowing your Protection Officer is government-licensed for protection, having someone trained to notice unusual situations, professional handling if incidents occur, discrete service that doesn't embarrass you, and reliable presence when feeling vulnerable. You're not just paying for transport - you're investing in professional security that happens to include transportation. Sometimes the value isn't in preventing specific threats, but in the confidence that comes from genuine protection."
  },
  {
    id: 12,
    question: "How easy is it really to book protection?",
    answer: "Booking takes literally 30 seconds. Open the app, select number of officers needed (1-10+), choose your protection level, confirm location and secureDestination, and track your officer's arrival. No phone calls, no quotes, no waiting for callbacks. Your saved profile means no repeated explanations. In-app messaging lets you communicate specifics without awkward calls. Whether you need one officer for an airport run or five for a private party, it's the same simple process. Professional security has never been this accessible."
  }
];

export function FAQ() {
  const { navigateToView } = useApp();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactSupport = () => {
    window.open('tel:+442071234567');
  };

  const handleBookProtection = () => {
    localStorage.setItem('armora_booking_context', 'faq');
    navigateToView('booking');
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Everything you need to know about Armora's on-demand protection services
          </p>
        </div>

        <div className={styles.faqItems}>
          {FAQ_DATA.map((faq) => (
            <div className={styles.faqItem} key={faq.id}>
              <button
                className={`${styles.faqQuestion} ${expandedFaq === faq.id ? styles.active : ''}`}
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={expandedFaq === faq.id}
              >
                <span className={styles.questionText}>{faq.question}</span>
                <span className={styles.expandIcon}>
                  {expandedFaq === faq.id ? '−' : '+'}
                </span>
              </button>
              {expandedFaq === faq.id && (
                <div className={styles.faqAnswer}>
                  <p className={styles.answerText}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.faqCta}>
          <p className={styles.ctaText}>Still have questions?</p>
          <div className={styles.ctaButtons}>
            <button className={styles.contactButton} onClick={handleContactSupport}>
              Contact Support
            </button>
            <button className={styles.bookButton} onClick={handleBookProtection}>
              Request Protection Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}