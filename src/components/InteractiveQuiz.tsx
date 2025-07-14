import React, { useState } from 'react';
import { CheckCircle, ArrowRight, RefreshCw, Target, TrendingUp, Users, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    category: 'finance' | 'product' | 'strategy' | 'technology' | 'revenue';
  }[];
}

interface Result {
  category: 'finance' | 'product' | 'strategy' | 'technology' | 'revenue';
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: string;
  link: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your biggest business challenge right now?",
    options: [
      { id: 'finance', text: 'Financial planning & fundraising', category: 'finance' },
      { id: 'product', text: 'Product strategy & market fit', category: 'product' },
      { id: 'strategy', text: 'Strategic direction & growth', category: 'strategy' },
      { id: 'technology', text: 'Technology infrastructure & scaling', category: 'technology' },
      { id: 'revenue', text: 'Revenue optimization & sales', category: 'revenue' }
    ]
  },
  {
    id: 2,
    question: "What stage is your company in?",
    options: [
      { id: 'strategy', text: 'Early stage / Startup', category: 'strategy' },
      { id: 'product', text: 'Growth stage / Scaling', category: 'product' },
      { id: 'finance', text: 'Mature / Looking to optimize', category: 'finance' },
      { id: 'technology', text: 'Technology transformation', category: 'technology' },
      { id: 'revenue', text: 'Revenue expansion', category: 'revenue' }
    ]
  },
  {
    id: 3,
    question: "What's your primary goal for the next 12 months?",
    options: [
      { id: 'finance', text: 'Secure funding or optimize finances', category: 'finance' },
      { id: 'product', text: 'Launch new products or features', category: 'product' },
      { id: 'strategy', text: 'Define strategic direction', category: 'strategy' },
      { id: 'technology', text: 'Modernize technology stack', category: 'technology' },
      { id: 'revenue', text: 'Increase revenue and market share', category: 'revenue' }
    ]
  }
];

const results: Record<string, Result> = {
  finance: {
    category: 'finance',
    title: 'Financial Strategy Expert',
    description: 'Michael Kaminski specializes in financial planning, fundraising, and strategic financial management. His expertise in PE reporting, M&A, and financial optimization can help drive your company\'s financial success.',
    icon: <DollarSign size={48} className="text-green-600" />,
    cta: 'View Finance Experience',
    link: '/cfo'
  },
  product: {
    category: 'product',
    title: 'Product Strategy Leader',
    description: 'Michael Kaminski excels in product strategy, market analysis, and product-market fit. His experience in product development and strategic planning can accelerate your product success.',
    icon: <Target size={48} className="text-blue-600" />,
    cta: 'View Product Experience',
    link: '/cpo'
  },
  strategy: {
    category: 'strategy',
    title: 'Strategic Transformation Expert',
    description: 'Michael Kaminski is a proven strategic leader with expertise in business transformation, growth strategies, and strategic planning. His track record in turnarounds and strategic initiatives speaks for itself.',
    icon: <TrendingUp size={48} className="text-purple-600" />,
    cta: 'View Strategy Experience',
    link: '/strategy'
  },
  technology: {
    category: 'technology',
    title: 'Technology Leadership Specialist',
    description: 'Michael Kaminski combines deep technology expertise with strategic business acumen. His experience in technology transformation and digital strategy can modernize your technology approach.',
    icon: <RefreshCw size={48} className="text-indigo-600" />,
    cta: 'View Technology Experience',
    link: '/technology'
  },
  revenue: {
    category: 'revenue',
    title: 'Revenue Growth Expert',
    description: 'Michael Kaminski specializes in revenue optimization, sales strategy, and market expansion. His proven track record in driving revenue growth can accelerate your company\'s success.',
    icon: <Users size={48} className="text-orange-600" />,
    cta: 'View Revenue Experience',
    link: '/revenue'
  }
};

const InteractiveQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleAnswer = (questionId: number, category: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: category }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const categoryCounts: Record<string, number> = {};
    
    Object.values(answers).forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const topCategory = Object.entries(categoryCounts).reduce((a, b) => 
      categoryCounts[a[0]] > categoryCounts[b[0]] ? a : b
    )[0];
    
    return results[topCategory];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setIsStarted(false);
  };

  if (!isStarted) {
    return (
      <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <Target className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Your Perfect Match
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take this quick quiz to discover how Michael Kaminski's expertise aligns with your business needs.
            </p>
            <button
              onClick={() => setIsStarted(true)}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Start Quiz</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const result = getResult();
    
    return (
      <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
          >
            <div className="mb-8">
              {result.icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {result.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {result.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href={result.link}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {result.cta}
              </a>
              <a
                href="https://calendly.com/michael-kaminski/executive-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Schedule a Call
              </a>
            </div>
            
            <button
              onClick={resetQuiz}
              className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <RefreshCw size={16} />
              <span>Take Quiz Again</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(question.id, option.category)}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {option.text}
                  </span>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveQuiz; 