/**
 * Home Client Component
 * "use client" component với tất cả interactivity
 */

'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app/useAppStore';
import { useQuizStore } from '@/stores/quiz/useQuizStore';
import { Button } from '@/components/atoms/button/button';
import { Heading } from '@/components/atoms/typography/heading/heading';
import { Text } from '@/components/atoms/typography/text/text';

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
  const { setCurrentPage, theme } = useAppStore();
  const { setGrammarForm, selectedGrammarForm } = useQuizStore();

  useEffect(() => {
    setCurrentPage('home');
  }, [setCurrentPage]);

  const handleStartPractice = (grammarForm: string) => {
    setGrammarForm(grammarForm as any);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <Heading className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
          Japanese Learning App
        </Heading>
        <Text className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Học chuyển đổi từ thể lịch sự sang thể thường
        </Text>
        
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
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {initialData.totalQuestions}
          </div>
          <Text className="text-gray-600 dark:text-gray-300">Câu hỏi</Text>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {initialData.grammarForms.length}
          </div>
          <Text className="text-gray-600 dark:text-gray-300">Dạng ngữ pháp</Text>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            100%
          </div>
          <Text className="text-gray-600 dark:text-gray-300">Miễn phí</Text>
        </div>
      </motion.div>

      {/* Grammar Forms Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <Heading className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Chọn dạng ngữ pháp để học
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {grammarCards.map((card, index) => (
            <motion.div
              key={card.form}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group cursor-pointer"
              onClick={() => handleStartPractice(card.form)}
            >
              <div className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                <Heading className="text-xl font-bold mb-2">{card.title}</Heading>
                <Text className="text-sm opacity-90 mb-3">{card.description}</Text>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3">
                  <Text className="text-sm font-mono">{card.example}</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-sm opacity-75">{card.questions} câu hỏi</Text>
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <Heading className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Tính năng nổi bật
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <Heading className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Quiz tương tác
            </Heading>
            <Text className="text-gray-600 dark:text-gray-300">
              Luyện tập với hệ thống quiz thông minh và feedback ngay lập tức
            </Text>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <Heading className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Theo dõi tiến độ
            </Heading>
            <Text className="text-gray-600 dark:text-gray-300">
              Xem thống kê chi tiết về quá trình học tập và điểm số
            </Text>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🔄</div>
            <Heading className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Ôn tập thông minh
            </Heading>
            <Text className="text-gray-600 dark:text-gray-300">
              Hệ thống ôn tập tự động các câu trả lời sai để củng cố kiến thức
            </Text>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeClient;
