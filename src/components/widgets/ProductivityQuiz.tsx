import { useState } from 'react';

interface Question {
  question: string;
  questionDe: string;
  answers: {
    text: string;
    textDe: string;
    type: 'jobs' | 'musk' | 'bezos';
  }[];
}

const questions: Question[] = [
  {
    question: "How many hours do you ideally work per day?",
    questionDe: "Wie viele Stunden arbeitest du idealerweise pro Tag?",
    answers: [
      { text: "8-10 hours with deep focus", textDe: "8-10 Stunden mit tiefem Fokus", type: 'jobs' },
      { text: "12-16 hours, every hour counts", textDe: "12-16 Stunden, jede Stunde zählt", type: 'musk' },
      { text: "6-8 hours, mornings are key", textDe: "6-8 Stunden, Morgens sind entscheidend", type: 'bezos' }
    ]
  },
  {
    question: "How do you handle distractions?",
    questionDe: "Wie gehst du mit Ablenkungen um?",
    answers: [
      { text: "Accept 20% noise is inevitable", textDe: "Akzeptiere, dass 20% Noise unvermeidbar ist", type: 'jobs' },
      { text: "Eliminate all distractions", textDe: "Eliminiere alle Ablenkungen", type: 'musk' },
      { text: "Delegate them to afternoon", textDe: "Verschiebe sie auf den Nachmittag", type: 'bezos' }
    ]
  },
  {
    question: "What's your approach to tasks?",
    questionDe: "Was ist dein Ansatz bei Aufgaben?",
    answers: [
      { text: "3-5 critical tasks per day", textDe: "3-5 kritische Aufgaben pro Tag", type: 'jobs' },
      { text: "As many as physically possible", textDe: "So viele wie physisch möglich", type: 'musk' },
      { text: "2-3 decisions before 10 AM", textDe: "2-3 Entscheidungen vor 10 Uhr", type: 'bezos' }
    ]
  },
  {
    question: "How do you measure success?",
    questionDe: "Wie misst du Erfolg?",
    answers: [
      { text: "Quality of output, not quantity", textDe: "Qualität statt Quantität", type: 'jobs' },
      { text: "Speed of execution", textDe: "Geschwindigkeit der Ausführung", type: 'musk' },
      { text: "Strategic decision quality", textDe: "Qualität strategischer Entscheidungen", type: 'bezos' }
    ]
  },
  {
    question: "Your ideal work environment?",
    questionDe: "Deine ideale Arbeitsumgebung?",
    answers: [
      { text: "Minimalist, zero clutter", textDe: "Minimalistisch, ohne Unordnung", type: 'jobs' },
      { text: "Factory floor or lab", textDe: "Fabrikhalle oder Labor", type: 'musk' },
      { text: "Quiet morning office", textDe: "Ruhiges Morgenbüro", type: 'bezos' }
    ]
  }
];

export default function ProductivityQuiz({ isGerman }: { isGerman: boolean }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (type: string) => {
    const newAnswers = [...answers, type];

    if (currentQuestion < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setAnswers(newAnswers);
      setShowResult(true);
    }
  };

  const calculateResult = () => {
    const counts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find the method with most votes
    let maxCount = 0;
    let winner = 'jobs'; // default fallback

    for (const [method, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        winner = method;
      }
    }

    return winner;
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const getResultContent = (type: string) => {
    const results = {
      jobs: {
        title: "Steve Jobs Method",
        titleDe: "Steve Jobs Methode",
        description: "You thrive with the 80/20 approach. Focus on 3-5 critical tasks that truly matter, accept that 20% noise is inevitable, and maintain ruthless prioritization.",
        descriptionDe: "Du blühst mit dem 80/20-Ansatz auf. Fokussiere auf 3-5 kritische Aufgaben, die wirklich zählen, akzeptiere dass 20% Noise unvermeidbar ist, und halte gnadenlose Priorisierung.",
        ratio: "80% Signal",
        color: '#00ff88'
      },
      musk: {
        title: "Elon Musk Method",
        titleDe: "Elon Musk Methode",
        description: "You're built for 100% signal intensity. No distractions, maximum output, and complete dedication to your mission. Every minute counts.",
        descriptionDe: "Du bist für 100% Signal-Intensität gebaut. Keine Ablenkungen, maximale Leistung und vollständige Hingabe an deine Mission. Jede Minute zählt.",
        ratio: "100% Signal",
        color: '#ff8800'
      },
      bezos: {
        title: "Jeff Bezos Method",
        titleDe: "Jeff Bezos Methode",
        description: "You optimize for decision quality over quantity. Make your most important decisions in the morning when you're fresh, then handle routine tasks.",
        descriptionDe: "Du optimierst für Entscheidungsqualität statt Quantität. Triff deine wichtigsten Entscheidungen morgens wenn du frisch bist, dann erledige Routineaufgaben.",
        ratio: "Morning Signal",
        color: '#00bbff'
      }
    };

    return results[type as keyof typeof results] || results.jobs;
  };

  if (showResult) {
    const result = calculateResult();
    const content = getResultContent(result);

    return (
      <div style={{
        backgroundColor: '#0f0f0f',
        border: `2px solid ${content.color}`,
        borderRadius: '12px',
        padding: '2rem',
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        <h3 style={{
          color: content.color,
          fontSize: '1.5rem',
          marginBottom: '0.5rem',
          fontWeight: '400'
        }}>
          {isGerman ? content.titleDe : content.title}
        </h3>

        <div style={{
          fontSize: '3rem',
          fontWeight: '100',
          color: content.color,
          margin: '1rem 0'
        }}>
          {content.ratio}
        </div>

        <p style={{
          color: '#e8e8e8',
          fontSize: '1rem',
          lineHeight: '1.7',
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem'
        }}>
          {isGerman ? content.descriptionDe : content.description}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: result === 'jobs' ? 'rgba(0, 255, 136, 0.1)' : '#1a1a1a',
            border: `1px solid ${result === 'jobs' ? '#00ff88' : '#333'}`,
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '1.2rem',
              color: result === 'jobs' ? '#00ff88' : '#666',
              marginBottom: '0.25rem'
            }}>
              Steve Jobs
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: result === 'jobs' ? '#e8e8e8' : '#666'
            }}>
              80% Signal
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: result === 'musk' ? 'rgba(255, 136, 0, 0.1)' : '#1a1a1a',
            border: `1px solid ${result === 'musk' ? '#ff8800' : '#333'}`,
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '1.2rem',
              color: result === 'musk' ? '#ff8800' : '#666',
              marginBottom: '0.25rem'
            }}>
              Elon Musk
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: result === 'musk' ? '#e8e8e8' : '#666'
            }}>
              100% Signal
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: result === 'bezos' ? 'rgba(0, 187, 255, 0.1)' : '#1a1a1a',
            border: `1px solid ${result === 'bezos' ? '#00bbff' : '#333'}`,
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '1.2rem',
              color: result === 'bezos' ? '#00bbff' : '#666',
              marginBottom: '0.25rem'
            }}>
              Jeff Bezos
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: result === 'bezos' ? '#e8e8e8' : '#666'
            }}>
              Morning Signal
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: content.color,
            border: `1px solid ${content.color}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${content.color}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isGerman ? 'Quiz wiederholen' : 'Retake Quiz'}
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      border: '2px solid #00ff88',
      borderRadius: '12px',
      padding: '2rem',
      margin: '3rem 0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          color: '#00ff88',
          fontSize: '1.3rem',
          fontWeight: '400'
        }}>
          🎯 {isGerman ? 'Finde deine Produktivitätsmethode' : 'Find Your Productivity Method'}
        </h3>
        <div style={{
          color: '#666',
          fontSize: '0.9rem'
        }}>
          {currentQuestion + 1} / {questions.length}
        </div>
      </div>

      <div style={{
        marginBottom: '1.5rem'
      }}>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#1a1a1a',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            height: '100%',
            backgroundColor: '#00ff88',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      <h4 style={{
        color: '#e8e8e8',
        fontSize: '1.1rem',
        fontWeight: '300',
        marginBottom: '1.5rem',
        lineHeight: '1.5'
      }}>
        {isGerman ? q.questionDe : q.question}
      </h4>

      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        {q.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(answer.type)}
            style={{
              padding: '1rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#e8e8e8',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.95rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
              e.currentTarget.style.borderColor = '#00ff88';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
              e.currentTarget.style.borderColor = '#333';
            }}
          >
            {isGerman ? answer.textDe : answer.text}
          </button>
        ))}
      </div>
    </div>
  );
}