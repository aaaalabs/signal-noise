import { useEffect } from 'react';

interface ArticleSchemasProps {
  slug: string;
}

export default function ArticleSchemas({ slug }: ArticleSchemasProps) {
  useEffect(() => {
    // Only add extra schemas for article-11
    if (slug !== 'three-things-productivity-system') return;

    // FAQ Schema for People Also Ask
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Three Things productivity system?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Three Things productivity system is a focus method where you identify and complete exactly three transformational tasks each day, rather than spreading your energy across dozens of maintenance tasks. It's based on the 1918 Ivy Lee Method and modern neuroscience showing that focusing on 20% of efforts drives 80% of results."
          }
        },
        {
          "@type": "Question",
          "name": "How do I identify transformational tasks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Transformational tasks are Level 3 work that creates exponential results. Ask: Would completing this task alone make today successful? Does this require deep strategic thinking? Will this matter months from now? Could anyone else do this with equal impact? If the answer to all is yes except the last, it's transformational work."
          }
        },
        {
          "@type": "Question",
          "name": "What if I have more than three important tasks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The constraint is intentional. It forces brutal prioritization using the Regret Minimization Framework: Which tasks will I regret most if left undone in 10 years? Choose the three with highest transformational impact. Everything else can be delegated, batched, or scheduled for another day."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to see results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Week 1: Complete 15-21 transformational tasks vs 0-5 in typical week. Week 4: Review 90+ transformational tasks with tangible outcomes. Over 1 year: 1,095 transformational tasks creates 37× improvement through compound effect (1.01^365 = 37.78)."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between Level 1, 2, and 3 tasks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Level 1 (Maintenance): Keeps systems running, creates no new value (email, admin, routine meetings). Level 2 (Optimization): Improves existing systems, creates 10-20% gains (workflow tweaks, process improvements). Level 3 (Transformation): Creates exponential value and moves major goals forward (strategic decisions, breakthrough innovations, key relationships)."
          }
        }
      ]
    };

    // HowTo Schema for step-by-step protocol
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Implement the Three Things Productivity System",
      "description": "Four-step daily protocol for implementing the Three Things method to achieve transformational productivity results",
      "totalTime": "PT30M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Morning Decision Protocol",
          "text": "Before checking email or Slack, ask yourself: What are the THREE transformational tasks that will make today successful? Use selection criteria: Would completing this alone make today worthwhile? Does it move toward a major goal? Will it matter months from now? Does it require deep strategic thinking?",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Protection Protocol",
          "text": "Guard your Three Things ruthlessly with time blocking (schedule 2-3 hour blocks), communication boundaries (close email/messaging during deep work), and environmental design (remove distractions, optimize workspace). Treat these blocks as sacred as client meetings.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Sequential Execution",
          "text": "Work on Task #1 until complete, then and only then move to Task #2. This preserves cognitive resources and builds completion momentum. Research shows task switching reduces quality by 40%.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Evening Reflection & Planning",
          "text": "End each day by tracking: Did I complete my Three Things? What interrupted me? What are tomorrow's Three Things? Keep a 30-day log to identify patterns in your productivity and energy.",
          "position": 4
        }
      ]
    };

    // Add FAQ schema
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.text = JSON.stringify(faqSchema);
    faqScript.id = 'faq-schema';
    document.head.appendChild(faqScript);

    // Add HowTo schema
    const howToScript = document.createElement('script');
    howToScript.type = 'application/ld+json';
    howToScript.text = JSON.stringify(howToSchema);
    howToScript.id = 'howto-schema';
    document.head.appendChild(howToScript);

    return () => {
      const faqEl = document.getElementById('faq-schema');
      const howToEl = document.getElementById('howto-schema');
      if (faqEl?.parentNode) faqEl.parentNode.removeChild(faqEl);
      if (howToEl?.parentNode) howToEl.parentNode.removeChild(howToEl);
    };
  }, [slug]);

  return null;
}
