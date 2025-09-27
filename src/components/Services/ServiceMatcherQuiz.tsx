import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SERVICES_DATA } from '../../data/servicesData';
import styles from './ServiceMatcherQuiz.module.css';

interface QuizOption {
  value: string;
  label: string;
  services: string[];
  emoji: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

interface QuizResult {
  service: any;
  matchScore: number;
  reasons: string[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'need',
    question: 'What do you need protection for?',
    options: [
      {
        value: 'daily',
        label: 'Daily commute',
        services: ['standard'],
        emoji: '🏢'
      },
      {
        value: 'business',
        label: 'Business meetings',
        services: ['executive'],
        emoji: '💼'
      },
      {
        value: 'discrete',
        label: 'Discrete protection',
        services: ['shadow'],
        emoji: '🕵️'
      },
      {
        value: 'events',
        label: 'Special events',
        services: ['event'],
        emoji: '✨'
      },
      {
        value: 'family',
        label: 'Family security',
        services: ['standard', 'executive'],
        emoji: '👨‍👩‍👧‍👦'
      }
    ]
  },
  {
    id: 'visibility',
    question: 'How visible should your security be?',
    options: [
      {
        value: 'obvious',
        label: 'Visible deterrent',
        services: ['standard', 'executive'],
        emoji: '👮'
      },
      {
        value: 'discrete',
        label: 'Discrete presence',
        services: ['executive', 'shadow'],
        emoji: '🤫'
      },
      {
        value: 'invisible',
        label: 'Completely covert',
        services: ['shadow'],
        emoji: '🥷'
      },
      {
        value: 'flexible',
        label: 'Depends on situation',
        services: ['executive', 'shadow'],
        emoji: '🎭'
      }
    ]
  },
  {
    id: 'budget',
    question: 'What\'s your budget range?',
    options: [
      {
        value: 'value',
        label: 'Best value (£50-65/hr)',
        services: ['standard'],
        emoji: '💵'
      },
      {
        value: 'premium',
        label: 'Premium (£75-95/hr)',
        services: ['executive', 'shadow'],
        emoji: '💎'
      },
      {
        value: 'luxury',
        label: 'No budget limit',
        services: ['event'],
        emoji: '👑'
      },
      {
        value: 'variable',
        label: 'Depends on situation',
        services: ['standard', 'executive'],
        emoji: '📊'
      }
    ]
  },
  {
    id: 'frequency',
    question: 'How often do you need protection?',
    options: [
      {
        value: 'daily',
        label: 'Daily/regular use',
        services: ['standard', 'executive'],
        emoji: '📅'
      },
      {
        value: 'weekly',
        label: 'Weekly basis',
        services: ['executive'],
        emoji: '📆'
      },
      {
        value: 'occasional',
        label: 'Occasional/special events',
        services: ['event', 'shadow'],
        emoji: '⭐'
      },
      {
        value: 'emergency',
        label: 'On-demand/emergency',
        services: ['shadow', 'executive'],
        emoji: '🚨'
      }
    ]
  }
];

export function ServiceMatcherQuiz() {
  const { navigateToView } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateMatch = (): QuizResult => {
    const scores: Record<string, { score: number; reasons: string[] }> = {};

    // Initialize scores
    SERVICES_DATA.forEach(service => {
      scores[service.id] = { score: 0, reasons: [] };
    });

    // Calculate scores based on answers
    Object.values(answers).forEach(answer => {
      answer.services.forEach(serviceId => {
        if (scores[serviceId]) {
          scores[serviceId].score += 1;
          scores[serviceId].reasons.push(answer.label);
        }
      });
    });

    // Find the top service
    const topServiceEntry = Object.entries(scores)
      .sort(([,a], [,b]) => b.score - a.score)[0];

    const topServiceId = topServiceEntry[0];
    const topService = SERVICES_DATA.find(s => s.id === topServiceId);
    const matchScore = Math.round((topServiceEntry[1].score / QUIZ_QUESTIONS.length) * 100);

    return {
      service: topService!,
      matchScore,
      reasons: topServiceEntry[1].reasons
    };
  };

  const handleAnswer = (option: QuizOption) => {
    const newAnswers = { ...answers, [QUIZ_QUESTIONS[currentStep].id]: option };
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete - calculate result
      setIsLoading(true);

      // Simulate AI processing time for better UX
      setTimeout(() => {
        const result = calculateMatch();
        setResult(result);
        setIsLoading(false);
      }, 1500);
    }
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setIsLoading(false);
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookService = () => {
    localStorage.setItem('armora_selected_service', result!.service.id);
    localStorage.setItem('armora_quiz_match', JSON.stringify({
      service: result!.service.id,
      score: result!.matchScore,
      timestamp: Date.now()
    }));
    navigateToView('protection-request');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.quiz}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <h3 className={styles.loadingTitle}>🤖 AI is analyzing your needs...</h3>
          <p className={styles.loadingText}>Finding your perfect protection match</p>
        </div>
      </div>
    );
  }

  // Result state
  if (result) {
    return (
      <div className={styles.quiz}>
        <div className={styles.resultContainer}>
          <div className={styles.resultHeader}>
            <h3 className={styles.resultTitle}>🎯 Your Perfect Match</h3>
            <div className={styles.matchScore}>
              <span className={styles.scoreValue}>{result.matchScore}%</span>
              <span className={styles.scoreLabel}>Match</span>
            </div>
          </div>

          <div className={styles.matchCard}>
            <div className={styles.serviceIcon}>{result.service.icon}</div>
            <h4 className={styles.serviceName}>{result.service.name}</h4>
            <p className={styles.serviceTagline}>{result.service.tagline}</p>

            <div className={styles.keyPoints}>
              <div className={styles.keyPoint}>
                <span className={styles.checkmark}>✓</span>
                <span>{result.service.vehicle}</span>
              </div>
              <div className={styles.keyPoint}>
                <span className={styles.checkmark}>✓</span>
                <span>{result.service.price}</span>
              </div>
              <div className={styles.keyPoint}>
                <span className={styles.checkmark}>✓</span>
                <span>{result.service.rating} rating</span>
              </div>
            </div>

            <div className={styles.reasons}>
              <h5 className={styles.reasonsTitle}>Why this matches you:</h5>
              <ul className={styles.reasonsList}>
                {result.reasons.map((reason, index) => (
                  <li key={index} className={styles.reason}>
                    • {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.resultActions}>
              <button className={styles.selectButton} onClick={handleBookService}>
                Request {result.service.name} →
              </button>
              <button className={styles.retakeButton} onClick={restartQuiz}>
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz questions state
  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className={styles.quiz}>
      <div className={styles.quizHeader}>
        <h3 className={styles.quizTitle}>🎯 Find Your Perfect Protection in 30 Seconds</h3>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {currentStep + 1} of {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      <div className={styles.questionContainer}>
        <h4 className={styles.question}>{currentQuestion.question}</h4>

        <div className={styles.options}>
          {currentQuestion.options.map(option => (
            <button
              key={option.value}
              className={styles.optionButton}
              onClick={() => handleAnswer(option)}
            >
              <span className={styles.optionEmoji}>{option.emoji}</span>
              <span className={styles.optionLabel}>{option.label}</span>
              <span className={styles.optionArrow}>→</span>
            </button>
          ))}
        </div>
      </div>

      {currentStep > 0 && (
        <button className={styles.backButton} onClick={goBack}>
          ← Back
        </button>
      )}
    </div>
  );
}