import React, { useState, useEffect } from 'react';
import './QuizComponent.css';

const QUESTIONS = [
  {
    id: 1,
    question: "In what year was IEEE (Institute of Electrical and Electronics Engineers) founded?",
    options: ["1947", "1963", "1980", "1955"],
    answer: "1963"
  },
  {
    id: 2,
    question: "Which two organizations merged to form IEEE?",
    options: ["AIEE & IRE", "ACM & AIEE", "IEEE & ACM", "IRE & ITU"],
    answer: "AIEE & IRE"
  },
  {
    id: 3,
    question: "What is the primary mission of IEEE?",
    options: ["Advancing Technology for Humanity", "Building faster computers", "Standardizing the internet", "Winning Nobel prizes"],
    answer: "Advancing Technology for Humanity"
  },
  {
    id: 4,
    question: "Which IEEE standard is most commonly associated with Wi-Fi?",
    options: ["IEEE 802.3", "IEEE 802.11", "IEEE 802.15", "IEEE 1394"],
    answer: "IEEE 802.11"
  },
  {
    id: 5,
    question: "Who is often called the 'Mother of Computing' and has an IEEE award named after her?",
    options: ["Grace Hopper", "Ada Lovelace", "Margaret Hamilton", "Katherine Johnson"],
    answer: "Ada Lovelace"
  },
  {
    id: 6,
    question: "Nirma University's IEEE Student Branch is known for which flagship carnival event?",
    options: ["Techno-Nirma", "IEEE Carnival", "Nirma-Con", "Electric-Vibe"],
    answer: "IEEE Carnival"
  },
  {
    id: 7,
    question: "Which of these is NOT a society under IEEE?",
    options: ["Computer Society", "Power & Energy Society", "Robotics & Automation Society", "Internet Marketing Society"],
    answer: "Internet Marketing Society"
  },
  {
    id: 8,
    question: "Where is the registration booth for the IEEE Carnival located?",
    options: ["Library", "Main Entrance", "Canteen", "Auditorium"],
    answer: "Main Entrance"
  }
];

const QuizComponent = () => {
  const [step, setStep] = useState('login'); // login, quiz, result
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finalResult, setFinalResult] = useState(null);

  // Check if a user is already remembered on this device
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('quiz_current_user');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      const savedResult = localStorage.getItem(`quiz_completed_${rememberedEmail}`);
      if (savedResult) {
        setFinalResult(JSON.parse(savedResult));
        setStep('result');
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith('@nirmauni.ac.in')) {
      setError('Please use your Nirma University email (@nirmauni.ac.in)');
      return;
    }

    // Remember this user on this device
    localStorage.setItem('quiz_current_user', email);

    const savedResult = localStorage.getItem(`quiz_completed_${email}`);
    if (savedResult) {
      setFinalResult(JSON.parse(savedResult));
      setStep('result');
    } else {
      setStep('quiz');
      setError('');
    }
  };

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === QUESTIONS[currentQuestionIndex].answer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQuestionIndex + 1 < QUESTIONS.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz Finished
      const coupon = newScore === 8 ? `IEEE-CARNIVAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}` : null;
      const resultData = {
        score: newScore,
        total: QUESTIONS.length,
        coupon: coupon,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`quiz_completed_${email}`, JSON.stringify(resultData));
      setFinalResult(resultData);
      setStep('result');
    }
  };

  if (step === 'login') {
    return (
      <section className="quiz-container neo-panel">
        <h2 className="quiz-title">Carnival Quiz</h2>
        <form onSubmit={handleLogin} className="quiz-input-group">
          <p className="text-center font-bold text-gray-700">Login with your Nirma ID to start the challenge!</p>
          <input 
            type="email" 
            placeholder="yourname@nirmauni.ac.in" 
            className="quiz-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="quiz-button">Start Quiz</button>
          {error && <p className="quiz-error">{error}</p>}
        </form>
      </section>
    );
  }

  if (step === 'quiz') {
    const q = QUESTIONS[currentQuestionIndex];
    return (
      <section className="quiz-container neo-panel">
        <div className="quiz-progress">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</div>
        <h2 className="question-text">{q.question}</h2>
        <div className="options-grid">
          {q.options.map(option => (
            <button 
              key={option} 
              className="option-button"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (step === 'result') {
    return (
      <section className="quiz-container neo-panel result-container">
        <h2 className="quiz-title">Quiz Result</h2>
        <p className="text-2xl font-black mb-4">Score: {finalResult.score} / {finalResult.total}</p>
        
        {finalResult.score === 8 ? (
          <div className="coupon-box animate-bounce">
            <span className="coupon-code">{finalResult.coupon}</span>
            <p className="coupon-message">
              Please take a screenshot and show it to the registration desk along with your nirma ID !!
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <p className="failure-message">Better luck next time!</p>
            <p className="font-bold text-gray-600 mt-2">You can't attempt the quiz again on this device.</p>
          </div>
        )}
        
        <div className="flex flex-col gap-4 mt-8 items-center">
          <p className="font-bold text-gray-500 italic text-sm">
            Device session locked to this result.
          </p>
        </div>
      </section>
    );
  }

  return null;
};

export default QuizComponent;
