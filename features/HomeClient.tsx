
'use client';

import { useAppStore } from '@/stores/app/useAppStore';
import React, { useEffect } from 'react';
import { Button } from '../components/atoms/button/button';

interface HomeClientProps {
  initialData: {
    totalQuestions: number;
    grammarForms: string[];
    userProgress: any;
  };
}

/**
 * Home Client Component
 * Handles all client-side interactivity and state management
 */
const HomeClient: React.FC<HomeClientProps> = ({ initialData }) => {
  const { setCurrentPage } = useAppStore();
  // const { setGrammarForm, selectedGrammarForm } = useQuizStore();

  useEffect(() => {
    setCurrentPage('home');
  }, [setCurrentPage]);

  const handleStartPractice = (grammarForm: string) => {
    // setGrammarForm(grammarForm as any);
    console.log('Starting practice for:', grammarForm);
    // Navigate to practice page
    window.location.href = '/practice';
  };

  const handleStartTheory = () => {
    // Navigate to theory page
    window.location.href = '/theory';
  };

  const grammarCards = [
    {
      form: 'te',
      title: 'Te Form (て形)',
      description: 'Học cách chuyển đổi từ です/ます sang て形',
      example: 'たべます → たべて',
      color: 'from-green-400 to-green-600',
      questions: 112,
    },
    {
      form: 'ta',
      title: 'Ta Form (た形)',
      description: 'Học cách chuyển đổi sang thì quá khứ',
      example: 'たべました → たべた',
      color: 'from-blue-400 to-blue-600',
      questions: 108,
    },
    {
      form: 'nai',
      title: 'Nai Form (ない形)',
      description: 'Học cách chuyển đổi sang thể phủ định',
      example: 'たべません → たべない',
      color: 'from-purple-400 to-purple-600',
      questions: 115,
    },
    {
      form: 'ru',
      title: 'Ru Form (る形)',
      description: 'Học cách chuyển đổi về thể từ điển',
      example: 'たべます → たべる',
      color: 'from-orange-400 to-orange-600',
      questions: 111,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
          Japanese Learning App
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Học chuyển đổi từ thể lịch sự sang thể thường
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleStartTheory}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            📚 Học lý thuyết
          </Button>
          <Button
            onClick={() => handleStartPractice('te')}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            🎯 Bắt đầu luyện tập
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {initialData.totalQuestions}
          </div>
          <p className="text-gray-600 dark:text-gray-300">Câu hỏi</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {initialData.grammarForms.length}
          </div>
          <p className="text-gray-600 dark:text-gray-300">Dạng ngữ pháp</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            100%
          </div>
          <p className="text-gray-600 dark:text-gray-300">Miễn phí</p>
        </div>
      </div>

      {/* Grammar Forms Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Chọn dạng ngữ pháp để học
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {grammarCards.map((card) => (
            <div
              key={card.form}
              className="group cursor-pointer"
              onClick={() => handleStartPractice(card.form)}
            >
              <div className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90 mb-3">{card.description}</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3">
                  <p className="text-sm font-mono">{card.example}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm opacity-75">{card.questions} câu hỏi</p>
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Tính năng nổi bật
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Quiz tương tác
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Luyện tập với hệ thống quiz thông minh và feedback ngay lập tức
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Theo dõi tiến độ
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Xem thống kê chi tiết về quá trình học tập và điểm số
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Ôn tập thông minh
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hệ thống ôn tập tự động các câu trả lời sai để củng cố kiến thức
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeClient;
