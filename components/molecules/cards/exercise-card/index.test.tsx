/**
 * Exercise Card Component Tests
 * 
 * Unit tests cho Exercise Card component
 * Test tất cả functionality và edge cases
 * 
 * @author Japanese Learning App Team
 * @version 1.0.0
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseCard } from './exercise-card';
import { Exercise, ExerciseProgress } from './types';

// Mock data
const mockExercise: Exercise = {
  id: 'test-exercise',
  title: 'Test Exercise',
  description: 'Test description',
  form: 'te',
  questionCount: 100,
  estimatedTime: 10,
  difficulty: 3
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
  questionsAnswered: 50,
  correctAnswers: 40,
  completionPercentage: 50,
  accuracy: 80,
  timeSpent: 5,
  attemptCount: 1,
  bestScore: 0
};

const mockProgressCompleted: ExerciseProgress = {
  status: 'completed',
  questionsAnswered: 100,
  correctAnswers: 85,
  completionPercentage: 100,
  accuracy: 85,
  timeSpent: 12,
  attemptCount: 1,
  bestScore: 85
};

describe('ExerciseCard', () => {
  it('renders exercise information correctly', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    
    expect(screen.getByText('Test Exercise')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('TE')).toBeInTheDocument();
    expect(screen.getByText('100 câu')).toBeInTheDocument();
    expect(screen.getByText('~10 phút')).toBeInTheDocument();
  });

  it('displays difficulty stars correctly', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    
    // Should show 3 filled stars and 2 empty stars for difficulty 3
    expect(screen.getByText('(3/5)')).toBeInTheDocument();
  });

  it('shows correct action button for not started exercise', () => {
    render(<ExerciseCard exercise={mockExercise} progress={mockProgressNotStarted} />);
    
    expect(screen.getByText('Bắt đầu')).toBeInTheDocument();
  });

  it('shows correct action button for in progress exercise', () => {
    render(<ExerciseCard exercise={mockExercise} progress={mockProgressInProgress} />);
    
    expect(screen.getByText('Tiếp tục')).toBeInTheDocument();
  });

  it('shows correct action button for completed exercise', () => {
    render(<ExerciseCard exercise={mockExercise} progress={mockProgressCompleted} />);
    
    expect(screen.getByText('Ôn tập')).toBeInTheDocument();
  });

  it('displays progress information for in progress exercise', () => {
    render(<ExerciseCard exercise={mockExercise} progress={mockProgressInProgress} />);
    
    expect(screen.getByText('50/100 câu')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Đang thực hiện')).toBeInTheDocument();
  });

  it('displays best score for completed exercise', () => {
    render(<ExerciseCard exercise={mockExercise} progress={mockProgressCompleted} />);
    
    expect(screen.getByText('85/100')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<ExerciseCard exercise={mockExercise} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(mockExercise);
  });

  it('calls onStartExercise when start button is clicked', () => {
    const handleStart = jest.fn();
    render(
      <ExerciseCard 
        exercise={mockExercise} 
        progress={mockProgressNotStarted}
        onStartExercise={handleStart} 
      />
    );
    
    fireEvent.click(screen.getByText('Bắt đầu'));
    expect(handleStart).toHaveBeenCalledWith(mockExercise);
  });

  it('calls onContinueExercise when continue button is clicked', () => {
    const handleContinue = jest.fn();
    render(
      <ExerciseCard 
        exercise={mockExercise} 
        progress={mockProgressInProgress}
        onContinueExercise={handleContinue} 
      />
    );
    
    fireEvent.click(screen.getByText('Tiếp tục'));
    expect(handleContinue).toHaveBeenCalledWith(mockExercise);
  });

  it('calls onReviewExercise when review button is clicked', () => {
    const handleReview = jest.fn();
    render(
      <ExerciseCard 
        exercise={mockExercise} 
        progress={mockProgressCompleted}
        onReviewExercise={handleReview} 
      />
    );
    
    fireEvent.click(screen.getByText('Ôn tập'));
    expect(handleReview).toHaveBeenCalledWith(mockExercise);
  });

  it('handles keyboard navigation', () => {
    const handleClick = jest.fn();
    render(<ExerciseCard exercise={mockExercise} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith(mockExercise);
    
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('hides optional elements when props are false', () => {
    render(
      <ExerciseCard 
        exercise={mockExercise}
        progress={mockProgressCompleted}
        showDifficulty={false}
        showQuestionCount={false}
        showEstimatedTime={false}
        showBestScore={false}
      />
    );
    
    expect(screen.queryByText('(3/5)')).not.toBeInTheDocument();
    expect(screen.queryByText('100 câu')).not.toBeInTheDocument();
    expect(screen.queryByText('~10 phút')).not.toBeInTheDocument();
    expect(screen.queryByText('85/100')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ExerciseCard exercise={mockExercise} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label');
  });
});
