/**
 * Cards Demo Page - Card Design Demo Implementation
 * 
 * Trang demo hiển thị tất cả card components theo design từ card-design-demo.html
 * 
 * @author Japanese Learning App Team
 * @version 3.0.0 - Card Design Demo Implementation
 */

'use client';

import React, { useState } from 'react';
import { ExerciseCard } from '../../../components/molecules/cards/exercise-card';
import { TheoryCard } from '../../../components/molecules/cards/theory-card';
import { QuizCard } from '../../../components/molecules/cards/quiz-card';
import { Exercise, ExerciseProgress } from '../../../components/molecules/cards/exercise-card/types';
import { GrammarPattern, StudyProgress } from '../../../components/molecules/cards/theory-card/types';
import { QuizQuestion } from '../../../components/molecules/cards/quiz-card/types';

// Mock data
const mockExercise: Exercise = {
  id: 'te-form-basic',
  title: 'Te Form Practice',
  description: 'Luyện tập động từ dạng て cơ bản',
  form: 'te',
  questionCount: 120,
  estimatedTime: 15,
  difficulty: 3,
  patterns: ['te_kudasai', 'te_imasu', 'te_mo_ii'],
  metadata: {
    category: 'grammar',
    tags: ['beginner', 'verb-forms'],
    prerequisites: ['hiragana', 'basic-verbs']
  }
};

const mockProgressNotStarted: ExerciseProgress = {
  status: 'not-started',
  questionsAnswered: 0,
  correctAnswers: 0,
  completionPercentage: 0,
  accuracy: 0,
  timeSpent: 0,
  attemptCount: 0,
  bestScore: 0
};

const mockProgressInProgress: ExerciseProgress = {
  status: 'in-progress',
  questionsAnswered: 45,
  correctAnswers: 38,
  completionPercentage: 65,
  accuracy: 84,
  timeSpent: 8,
  attemptCount: 1,
  bestScore: 0,
  lastAttempted: new Date('2024-12-19T10:30:00')
};

const mockProgressCompleted: ExerciseProgress = {
  status: 'completed',
  questionsAnswered: 120,
  correctAnswers: 102,
  completionPercentage: 100,
  accuracy: 85,
  timeSpent: 18,
  attemptCount: 2,
  bestScore: 87,
  lastAttempted: new Date('2024-12-19T11:45:00')
};

const mockPattern: GrammarPattern = {
  id: 'te-kudasai',
  name: 'te_kudasai',
  title: 'てください',
  description: 'Cách lịch sự để yêu cầu ai đó làm gì',
  explanation: 'Mẫu câu てください được sử dụng để đưa ra yêu cầu một cách lịch sự. Đây là cách thông dụng nhất để nhờ vả trong tiếng Nhật. Cấu trúc: Động từ dạng て + ください',
  examples: [
    {
      japanese: '手伝ってください。',
      vietnamese: 'Xin hãy giúp đỡ tôi.',
      romaji: 'Tetsudatte kudasai.'
    },
    {
      japanese: '待ってください。',
      vietnamese: 'Xin hãy đợi.',
      romaji: 'Matte kudasai.'
    }
  ],
  difficulty: 3,
  form: 'te',
  questionCount: 120,
  estimatedTime: 25
};

const mockStudyProgress: StudyProgress = {
  status: 'in-progress',
  completedQuestions: 45,
  totalQuestions: 120,
  accuracy: 84,
  lastStudied: new Date('2024-12-19T10:30:00'),
  reviewCount: 2
};

const mockQuestion: QuizQuestion = {
  id: 'q1',
  instruction: 'Chuyển động từ sau sang thể thường:',
  japanese: 'きのう えいがを みました。',
  hint: 'hôm qua đã xem phim',
  questionText: '→ きのう えいがを ________________.',
  correctAnswer: 'みた',
  hintText: 'Đây là thì quá khứ, cần chuyển từ thể lịch sự sang thể thường',
  explanation: 'みました là thể lịch sự của quá khứ, thể thường là みた',
  difficulty: 3,
  category: 'Động Từ - Quá Khứ'
};

export default function CardsDemo() {
  const [quizState, setQuizState] = useState<'answering' | 'correct' | 'incorrect'>('answering');
  const [userAnswer, setUserAnswer] = useState('');

  const handleQuizSubmit = (answer: string) => {
    setUserAnswer(answer);
    if (answer.toLowerCase().trim() === mockQuestion.correctAnswer.toLowerCase()) {
      setQuizState('correct');
    } else {
      setQuizState('incorrect');
    }
  };

  const handleQuizNext = () => {
    setQuizState('answering');
    setUserAnswer('');
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '3rem',
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎌 Japanese Learning App - Card Design Demo
        </h1>

        {/* Exercise Cards Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#2c3e50',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Exercise Cards
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Not Started */}
            <ExerciseCard
              exercise={mockExercise}
              progress={mockProgressNotStarted}
              onStartExercise={(ex) => console.log('Start:', ex)}
            />

            {/* In Progress */}
            <ExerciseCard
              exercise={{
                ...mockExercise,
                id: 'ta-form-basic',
                title: 'Ta Form Practice',
                description: 'Luyện tập động từ dạng た quá khứ',
                form: 'ta',
                questionCount: 95,
                estimatedTime: 12,
                difficulty: 4
              }}
              progress={mockProgressInProgress}
              onContinueExercise={(ex) => console.log('Continue:', ex)}
            />

            {/* Completed */}
            <ExerciseCard
              exercise={{
                ...mockExercise,
                id: 'nai-form-basic',
                title: 'Nai Form Practice',
                description: 'Luyện tập động từ dạng ない phủ định',
                form: 'nai',
                questionCount: 80,
                estimatedTime: 10,
                difficulty: 2
              }}
              progress={mockProgressCompleted}
              onReviewExercise={(ex) => console.log('Review:', ex)}
            />

            {/* Disabled */}
            <ExerciseCard
              exercise={{
                ...mockExercise,
                id: 'ru-form-advanced',
                title: 'Ru Form Practice',
                description: 'Luyện tập động từ dạng る cơ bản',
                form: 'ru',
                questionCount: 150,
                estimatedTime: 20,
                difficulty: 5,
                metadata: {
                  ...mockExercise.metadata,
                  prerequisites: ['cấp độ 3']
                }
              }}
              disabled={true}
            />

            {/* Loading */}
            <ExerciseCard
              exercise={mockExercise}
              loading={true}
            />
          </div>
        </section>

        {/* Theory Cards Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#2c3e50',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Theory Cards
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Collapsed */}
            <TheoryCard
              pattern={mockPattern}
              progress={mockStudyProgress}
              onStartStudy={(pattern) => console.log('Start study:', pattern)}
            />

            {/* Expanded */}
            <TheoryCard
              pattern={{
                ...mockPattern,
                id: 'te-mo-ii',
                title: 'てもいいです',
                description: 'Xin phép được làm gì đó',
                questionCount: 85,
                estimatedTime: 18,
                difficulty: 2
              }}
              expanded={true}
              onToggleExpand={(expanded) => console.log('Toggle:', expanded)}
            />

            {/* Completed */}
            <TheoryCard
              pattern={{
                ...mockPattern,
                id: 'bakari-de-naku',
                title: 'ばかりでなく',
                description: 'Không chỉ... mà còn (mức độ nâng cao)',
                questionCount: 45,
                estimatedTime: 30,
                difficulty: 5
              }}
              progress={{
                ...mockStudyProgress,
                status: 'completed',
                completedQuestions: 45,
                totalQuestions: 45
              }}
            />

            {/* Loading */}
            <TheoryCard
              pattern={mockPattern}
              loading={true}
            />

            {/* Disabled */}
            <TheoryCard
              pattern={{
                ...mockPattern,
                id: 'to-iu-no-wa',
                title: 'というのは',
                description: 'Cấu trúc giải thích nâng cao (Yêu cầu hoàn thành N4)',
                questionCount: 60,
                estimatedTime: 40,
                difficulty: 5,
                metadata: {
                  ...mockPattern.metadata,
                  prerequisites: ['N4']
                }
              }}
              disabled={true}
            />
          </div>
        </section>

        {/* Quiz Cards Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#2c3e50',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Quiz Card (Full Screen)
          </h2>

          {/* Answering State */}
          <QuizCard
            question={mockQuestion}
            currentQuestionIndex={1}
            totalQuestions={25}
            timeElapsed={0}
            score={0}
            state={quizState}
            userAnswer={userAnswer}
            correctAnswer={mockQuestion.correctAnswer}
            explanation={mockQuestion.explanation}
            onSubmitAnswer={handleQuizSubmit}
            onNext={handleQuizNext}
            onHint={() => console.log('Hint requested')}
          />
        </section>
      </div>
    </div>
  );
}
