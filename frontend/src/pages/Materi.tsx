import React, { useState } from 'react';
import Layout from '../components/layouts/Layout';
import { Button } from '../components/ui/Button';

const Materi: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const modules = [
    {
      id: 1,
      title: "Pengantar Kesehatan Remaja",
      duration: "5 min",
      completed: true,
      emoji: "🎯",
      description: "Dasar-dasar kesehatan untuk remaja"
    },
    {
      id: 2,
      title: "Konsep Dasar Kesehatan",
      duration: "8 min",
      completed: true,
      emoji: "📖",
      description: "Memahami konsep kesehatan secara menyeluruh"
    },
    {
      id: 3,
      title: "Kesehatan Mental Remaja",
      duration: "12 min",
      completed: false,
      emoji: "🧠",
      description: "Mengelola kesehatan mental di masa remaja"
    },
    {
      id: 4,
      title: "Nutrisi untuk Remaja",
      duration: "10 min",
      completed: false,
      emoji: "🥗",
      description: "Pola makan sehat untuk pertumbuhan optimal"
    },
    {
      id: 5,
      title: "Aktivitas Fisik & Olahraga",
      duration: "15 min",
      completed: false,
      emoji: "💪",
      description: "Pentingnya olahraga untuk kesehatan"
    }
  ];

  const handleVideoComplete = () => {
    if (!completedVideos.includes(currentVideo)) {
      setCompletedVideos([...completedVideos, currentVideo]);
    }
  };

  const handleNextLesson = () => {
    if (currentVideo < modules.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setIsPlaying(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
      setIsPlaying(false);
    }
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const progressPercentage = ((modules.filter(m => m.completed).length / modules.length) * 100).toFixed(0);
  const currentModule = modules[currentVideo];

  return (
    <Layout className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
            📚 Pembelajaran Kesehatan
          </h1>
          <p className="text-gray-600 text-lg">Belajar dengan video interaktif yang menyenangkan</p>
        </div>

        <div className="w-full">
          <div className="grid lg:grid-cols-4 gap-6 min-h-[600px]">
            {/* Left Sidebar - Module List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-full">
                {/* Sidebar Header */}
                <div className="p-6 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white">
                  <div className="text-center mb-4">
                    <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-3 transform hover:scale-105 transition-transform duration-200">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h2 className="text-lg font-bold">Progress Belajar</h2>
                    <p className="text-indigo-100 text-sm">Kesehatan Remaja</p>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-indigo-100">Kemajuan Kamu</span>
                      <span className="font-bold text-white">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-indigo-300 bg-opacity-50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-indigo-100 mt-2 flex items-center">
                      <span className="mr-1">🔥</span>
                      {modules.filter(m => m.completed).length} dari {modules.length} materi selesai
                    </p>
                  </div>
                </div>

                {/* Module List */}
                <div className="p-4 flex-1 overflow-y-auto max-h-96">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Daftar Materi
                  </h3>
                  <div className="space-y-3">
                    {modules.map((module, index) => (
                      <div
                        key={module.id}
                        onClick={() => setCurrentVideo(index)}
                        className={`group p-3 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          currentVideo === index
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                            module.completed 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md' 
                              : currentVideo === index
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                              : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                          }`}>
                            {module.completed ? '✓' : module.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold transition-colors ${
                              currentVideo === index ? 'text-blue-700' : 'text-gray-800'
                            }`}>
                              {module.title}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <span className="mr-1">⏱️</span>
                              {module.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Achievement Section */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                    <div className="text-xs font-bold text-amber-700 mb-1 flex items-center">
                      <span className="mr-1">🎯</span>
                      Target Hari Ini
                    </div>
                    <div className="text-xs text-amber-600">
                      {currentVideo < modules.length - 1 
                        ? `${modules[currentVideo + 1].title}` 
                        : 'Semua materi selesai! 🎉'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Video Player */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-full flex flex-col">
                {/* Video Header */}
                <div className="p-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white flex-shrink-0">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <span className="text-xl">{currentModule.emoji}</span>
                      </div>
                      <div>
                        <h1 className="text-xl font-bold">{currentModule.title}</h1>
                        <p className="text-blue-100 text-sm">
                          {currentModule.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 mb-1">
                        <span className="text-sm font-semibold">
                          {currentVideo + 1} / {modules.length}
                        </span>
                      </div>
                      <div className="text-blue-100 text-xs flex items-center justify-end">
                        <span className="mr-1">⏱️</span>
                        {currentModule.duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Player */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden flex-1 min-h-[350px]">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-white max-w-md px-4">
                      {!isPlaying ? (
                        <>
                          <div 
                            onClick={handlePlayVideo}
                            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-110 group"
                          >
                            <svg className="w-8 h-8 ml-1 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
                            <span className="mr-2">{currentModule.emoji}</span>
                            {currentModule.title}
                          </h3>
                          <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                            Video pembelajaran yang menyenangkan dan mudah dipahami
                          </p>
                          <div className="flex items-center justify-center space-x-3 text-xs text-gray-400">
                            <span className="flex items-center">
                              <span className="mr-1">⏱️</span>
                              {currentModule.duration}
                            </span>
                            <span>•</span>
                            <span>Level: Pemula</span>
                          </div>
                        </>
                      ) : (
                        <div className="bg-black bg-opacity-50 rounded-2xl p-6">
                          <div className="text-lg mb-3">🎥 Video sedang diputar...</div>
                          <p className="text-gray-300 text-sm">
                            Simulasi video pembelajaran sedang berjalan
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video Controls and Navigation */}
                <div className="p-6 bg-white flex-shrink-0">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="flex items-center space-x-2 hover:shadow-md transition-all transform hover:scale-105"
                      >
                        <span>📥</span>
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="flex items-center space-x-2 hover:shadow-md transition-all transform hover:scale-105"
                      >
                        <span>📝</span>
                        <span className="hidden sm:inline">Catatan</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="flex items-center space-x-2 hover:shadow-md transition-all transform hover:scale-105"
                      >
                        <span>🔖</span>
                        <span className="hidden sm:inline">Bookmark</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        <span className="font-semibold text-indigo-600">{currentVideo + 1}</span> / {modules.length}
                      </div>
                      <div className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                        <span className="text-green-700">✓ {progressPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Video Description */}
                  <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">💡</span>
                      Yang Akan Kamu Pelajari
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      Dalam video ini, kamu akan mempelajari konsep-konsep penting tentang {currentModule.title.toLowerCase()}. 
                      Materi disajikan dengan cara yang mudah dipahami dan relevan dengan kehidupan sehari-hari.
                    </p>
                    <div className="flex items-center flex-wrap gap-4 text-xs text-gray-600">
                      <span className="flex items-center">
                        <span className="mr-1">📊</span>
                        Tingkat: Pemula
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">🎯</span>
                        Interaktif
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">📱</span>
                        Mobile Friendly
                      </span>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={handlePreviousLesson}
                      disabled={currentVideo === 0}
                      className="flex items-center space-x-2 hover:shadow-md transition-all transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
                    >
                      <span>←</span>
                      <span className="hidden sm:inline">Sebelumnya</span>
                    </Button>

                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleVideoComplete}
                      className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-md transition-all transform hover:scale-105"
                    >
                      <span>✅</span>
                      <span className="hidden sm:inline">Tandai Selesai</span>
                    </Button>

                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleNextLesson}
                      disabled={currentVideo === modules.length - 1}
                      className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:shadow-md transition-all transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
                    >
                      <span className="hidden sm:inline">Selanjutnya</span>
                      <span>→</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Materi;