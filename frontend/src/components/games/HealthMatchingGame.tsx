import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import CloudBackground from '../layouts/CloudBackground';

interface GameState {
  level: number;
  gameStatus: 'menu' | 'playing' | 'completed' | 'gameOver';
  correctMatches: number;
  wrongMatches: number;
}

interface HealthItem {
  id: number;
  term: string;
  definition: string;
  category: 'organ' | 'nutrisi' | 'aktivitas' | 'penyakit' | 'mental';
}

interface MatchPair {
  leftId: number;
  rightId: number;
  isMatched: boolean;
}

const HealthMatchingGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    gameStatus: 'menu',
    correctMatches: 0,
    wrongMatches: 0
  });

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [currentItems, setCurrentItems] = useState<HealthItem[]>([]);
  const [shuffledRightItems, setShuffledRightItems] = useState<HealthItem[]>([]);
  const [connections, setConnections] = useState<{ leftId: number; rightId: number; isCorrect?: boolean }[]>([]);
  const [showCheck, setShowCheck] = useState(false);

  const healthItems: HealthItem[] = [
    { id: 1, term: "Remaja", definition: "Masa peralihan dari anak menuju dewasa", category: "mental" },
    { id: 2, term: "Pubertas", definition: "Masa terjadinya perubahan fisik dan emosi pada remaja", category: "mental" },
    { id: 3, term: "Insecure", definition: "Perasaan kurang percaya diri terhadap diri sendiri", category: "mental" },
    { id: 4, term: "Privasi", definition: "Keinginan untuk memiliki ruang pribadi", category: "mental" },
    { id: 5, term: "Touching", definition: "Sentuhan ringan seperti berpegangan tangan", category: "aktivitas" },
    { id: 6, term: "Kissing", definition: "Berciuman sebagai bentuk ekspresi perasaan", category: "aktivitas" },
    { id: 7, term: "Necking", definition: "Sentuhan di area leher hingga dada", category: "aktivitas" },
    { id: 8, term: "Masturbasi", definition: "Perilaku seksual yang dilakukan terhadap diri sendiri", category: "aktivitas" },
    { id: 9, term: "Perilaku seksual berisiko", definition: "Perilaku yang dapat membahayakan kesehatan fisik dan mental", category: "penyakit" },
    { id: 10, term: "Seks daring", definition: "Aktivitas seksual yang dilakukan melalui media digital", category: "aktivitas" },
    { id: 11, term: "Pornografi", definition: "Konten yang menampilkan hal seksual dan tidak pantas", category: "aktivitas" },
    { id: 12, term: "Infeksi Menular Seksual", definition: "Penyakit yang menular melalui hubungan seksual", category: "penyakit" },
    { id: 13, term: "HIV/AIDS", definition: "Penyakit yang menyerang sistem kekebalan tubuh", category: "penyakit" },
    { id: 14, term: "Pendidikan seksual", definition: "Pemberian informasi yang benar untuk menjaga diri", category: "nutrisi" }, // Kategori nutrisi dipinjam untuk variasi warna
    { id: 15, term: "Kontrol diri", definition: "Kemampuan membatasi perilaku agar tidak merugikan diri sendiri", category: "mental" },
    { id: 16, term: "Pornografi (Visual)", definition: "Konten yang menampilkan hal seksual dalam bentuk gambar, video, atau suara", category: "aktivitas" },
    { id: 17, term: "Seks Daring (Online)", definition: "Aktivitas Seksual yang dilakukan melalui media digital", category: "aktivitas" },
    { id: 18, term: "Pengaruh Teman Sebaya", definition: "Dorongan dari teman untuk melakukan perilaku tertentu", category: "mental" },
    { id: 19, term: "Perilaku Seksual", definition: "Segala aktivitas yang didasarkan pada dorongan seksual", category: "aktivitas" },
    { id: 20, term: "Gonore", definition: "Penyakit munculnya nanah saat BAK", category: "penyakit" }
  ];

  // Shuffle array function
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize game with random items
  const initializeGame = () => {
    const selectedItems = shuffleArray(healthItems).slice(0, 5);
    setCurrentItems(selectedItems);
    setShuffledRightItems(shuffleArray([...selectedItems]));
    setMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setConnections([]);
    setShowCheck(false);
  };

  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      initializeGame();
    }
  }, [gameState.gameStatus]);

  const handleLeftClick = (id: number) => {
    if (matches.find(m => m.leftId === id && m.isMatched)) return;
    if (connections.find(c => c.leftId === id)) return;
    setSelectedLeft(selectedLeft === id ? null : id);
  };

  const handleRightClick = (id: number) => {
    if (matches.find(m => m.rightId === id && m.isMatched)) return;
    if (connections.find(c => c.rightId === id)) return;
    
    if (selectedLeft !== null) {
      const newConnection = { leftId: selectedLeft, rightId: id };
      setConnections(prev => [...prev, newConnection]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setShowCheck(true);
    } else {
      setSelectedRight(selectedRight === id ? null : id);
    }
  };

  const checkConnections = () => {
    let correctCount = 0;
    let wrongCount = 0;
    const updatedMatches = [...matches];
    
    // Hanya proses koneksi yang BELUM diverifikasi (isCorrect === undefined)
    const updatedConnections = connections.map(conn => {
      // Skip koneksi yang sudah diverifikasi sebelumnya
      if (conn.isCorrect !== undefined) {
        return conn;
      }
      
      const leftItem = currentItems.find(item => item.id === conn.leftId);
      const rightItem = currentItems.find(item => item.id === conn.rightId);
      
      if (leftItem && rightItem && leftItem.id === rightItem.id) {
        correctCount++;
        // Cek duplikasi sebelum push
        if (!updatedMatches.find(m => m.leftId === conn.leftId && m.rightId === conn.rightId)) {
          updatedMatches.push({ leftId: conn.leftId, rightId: conn.rightId, isMatched: true });
        }
        return { ...conn, isCorrect: true };
      } else {
        wrongCount++;
        return { ...conn, isCorrect: false };
      }
    });
    
    setGameState(prev => ({
      ...prev,
      correctMatches: prev.correctMatches + correctCount,
      wrongMatches: prev.wrongMatches + wrongCount
    }));
    
    setMatches(updatedMatches);
    setConnections(updatedConnections);
    
    setTimeout(() => {
      const correctConnections = updatedConnections.filter(conn => conn.isCorrect);
      setConnections(correctConnections);
      
      // Hitung total pasangan yang sudah benar (unique)
      const totalCorrectMatches = updatedMatches.length;
      
      if (totalCorrectMatches === currentItems.length) {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gameStatus: 'completed' }));
        }, 500);
      } else {
        // Masih ada yang belum dijawab
        setShowCheck(false);
      }
    }, 2000);
  };

  const drawConnections = () => {
    return connections.map((conn, index) => {
      const leftElement = document.getElementById(`left-${conn.leftId}`);
      const rightElement = document.getElementById(`right-${conn.rightId}`);
      
      if (!leftElement || !rightElement) return null;
      
      const leftRect = leftElement.getBoundingClientRect();
      const rightRect = rightElement.getBoundingClientRect();
      const containerRect = document.getElementById('game-container')?.getBoundingClientRect();
      
      if (!containerRect) return null;
      
      const x1 = leftRect.right - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      const x2 = rightRect.left - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
      
      const color = conn.isCorrect === true ? '#10B981' : 
                   conn.isCorrect === false ? '#EF4444' : '#22C55E';
      const strokeWidth = conn.isCorrect === false ? '4' : '3';
      const strokeDasharray = conn.isCorrect === false ? '10,5' : 'none';
      
      return (
        <line
          key={`line-${index}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          className={conn.isCorrect === false ? 'animate-pulse' : ''}
        />
      );
    });
  };

  const startGame = () => {
    setGameState({
      level: 1,
      gameStatus: 'playing',
      correctMatches: 0,
      wrongMatches: 0
    });
  };

  const backToGameHome = () => {
    navigate('/gamehome');
  };

  const backToDashboard = () => {
    navigate('/gamehome');
  };

  const nextLevel = () => {
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      gameStatus: 'playing',
      correctMatches: 0,
      wrongMatches: 0
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'organ': return 'from-green-400 to-emerald-500';
      case 'nutrisi': return 'from-green-500 to-teal-500';
      case 'aktivitas': return 'from-teal-400 to-cyan-500';
      case 'penyakit': return 'from-emerald-400 to-green-500';
      case 'mental': return 'from-green-600 to-emerald-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const isMatched = (id: number, side: 'left' | 'right') => {
    return matches.find(m => 
      side === 'left' ? m.leftId === id && m.isMatched : m.rightId === id && m.isMatched
    );
  };

  const renderGameScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4 md:p-6 relative">
      {/* Cloud Background */}
      <CloudBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Score */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Game Mencocokkan Istilah Kesehatan</h2>
            <div className="flex gap-3 md:gap-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 shadow-md flex-1 md:flex-none">
                <div className="text-xs text-gray-600">Benar</div>
                <div className="text-lg md:text-xl font-bold text-emerald-600">{gameState.correctMatches}/{currentItems.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Side - Matching Game */}
          <div className="lg:col-span-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6" id="game-container">
            <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-3 md:mb-4">Papan Mencocokkan</h3>
            
            {/* Matching Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-20">
              {/* Left Column - Terms */}
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-base md:text-lg font-semibold text-center text-gray-700 mb-2 md:mb-3">Istilah</h4>
                {currentItems.map((item) => (
                  <div
                    key={`left-${item.id}`}
                    id={`left-${item.id}`}
                    onClick={() => handleLeftClick(item.id)}
                    className={`p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 transform active:scale-95 md:hover:scale-105 ${
                      isMatched(item.id, 'left') 
                        ? `bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-lg opacity-75`
                        : connections.find(c => c.leftId === item.id)
                        ? connections.find(c => c.leftId === item.id)?.isCorrect === false
                          ? 'bg-red-200 border-2 border-red-500 shadow-md'
                          : connections.find(c => c.leftId === item.id)?.isCorrect === true
                          ? `bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-lg`
                          : 'bg-green-100 border-2 border-green-400 shadow-md'
                        : selectedLeft === item.id
                        ? 'bg-yellow-100 border-2 border-yellow-400 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`font-semibold text-sm md:text-base ${isMatched(item.id, 'left') || connections.find(c => c.leftId === item.id)?.isCorrect === true ? 'text-white' : 'text-gray-800'}`}>
                        {item.term}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column - Definitions */}
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-base md:text-lg font-semibold text-center text-gray-700 mb-2 md:mb-3">Definisi</h4>
                {shuffledRightItems.map((item) => (
                  <div
                    key={`right-${item.id}`}
                    id={`right-${item.id}`}
                    onClick={() => handleRightClick(item.id)}
                    className={`p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 transform active:scale-95 md:hover:scale-105 ${
                      isMatched(item.id, 'right') 
                        ? `bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-lg opacity-75`
                        : connections.find(c => c.rightId === item.id)
                        ? connections.find(c => c.rightId === item.id)?.isCorrect === false
                          ? 'bg-red-200 border-2 border-red-500 shadow-md'
                          : connections.find(c => c.rightId === item.id)?.isCorrect === true
                          ? `bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-lg`
                          : 'bg-green-100 border-2 border-green-400 shadow-md'
                        : selectedRight === item.id
                        ? 'bg-yellow-100 border-2 border-yellow-400 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-xs md:text-sm ${isMatched(item.id, 'right') || connections.find(c => c.rightId === item.id)?.isCorrect === true ? 'text-white' : 'text-gray-700'}`}>
                        {item.definition}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Check Button */}
            {showCheck && connections.some(c => c.isCorrect === undefined) && (
              <div className="mt-4 md:mt-6 text-center">
                <Button
                  onClick={checkConnections}
                  className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base"
                >
                  ✓ Periksa Jawaban
                </Button>
              </div>
            )}

            {/* Back to Game Home Button */}
            <div className="mt-4 md:mt-6 text-center">
              <Button
                onClick={backToGameHome}
                variant="secondary"
                className="w-full md:w-auto px-6 py-2 text-sm md:text-base"
              >
                ← Kembali ke Game Home
              </Button>
            </div>
          </div>

          {/* Right Side - Instructions */}
          <div className="lg:col-span-4 space-y-3 md:space-y-4">
            {/* Cara Bermain Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-5">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 flex items-center">
                <span className="text-green-500 mr-2">↗</span> Cara Bermain
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p className="text-xs md:text-sm text-gray-700">Klik istilah di kolom kiri</p>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p className="text-xs md:text-sm text-gray-700">Klik definisi yang sesuai di kolom kanan</p>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p className="text-xs md:text-sm text-gray-700">Pilihan akan tersimpan otomatis</p>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <p className="text-xs md:text-sm text-gray-700">Tekan "Periksa Jawaban" untuk validasi</p>
                </div>
              </div>
            </div>

            {/* Kategori Materi Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-5">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 flex items-center">
                <span className="text-emerald-500 mr-2">↘</span> Kategori Materi
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-600"></div>
                  <p className="text-xs md:text-sm text-gray-700">Kesehatan Mental & Pubertas</p>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"></div>
                  <p className="text-xs md:text-sm text-gray-700">Aktivitas & Perilaku</p>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
                  <p className="text-xs md:text-sm text-gray-700">Penyakit Menular Seksual</p>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500"></div>
                  <p className="text-xs md:text-sm text-gray-700">Edukasi & Pencegahan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {gameState.gameStatus === 'menu' && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative flex items-center justify-center">
          <CloudBackground />
          
          <div className="relative z-10 p-4 md:p-6 w-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 md:p-8 shadow-xl">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">🎯 Game Mencocokkan Istilah Kesehatan</h2>
                <p className="text-sm md:text-lg mb-4 md:mb-6">
                  Uji pengetahuanmu tentang kesehatan reproduksi remaja! 
                  Cocokkan istilah kesehatan dengan definisi yang tepat dan pelajari hal-hal penting tentang tubuh dan kesehatan.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6 text-left">
                  <div>
                    <h4 className="font-bold text-green-100 mb-2 md:mb-3 text-sm md:text-base">📚 Kategori Materi:</h4>
                    <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                      <div className="flex items-center"><span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 mr-2"></span>Kesehatan Mental</div>
                      <div className="flex items-center"><span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 mr-2"></span>Aktivitas Seksual</div>
                      <div className="flex items-center"><span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 mr-2"></span>Penyakit Menular</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-100 mb-2 md:mb-3 text-sm md:text-base">🎯 Cara Bermain:</h4>
                    <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                      <div>🖱️ Klik istilah di kiri</div>
                      <div>🔗 Hubungkan dengan definisi di kanan</div>
                      <div>✅ Cocokkan semua pasangan dengan benar</div>
                      <div>🏆 Usahakan tanpa kesalahan!</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                  <Button 
                    onClick={startGame}
                    className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black text-base md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transform hover:scale-105 transition-transform"
                  >
                    🚀 Mulai Belajar!
                  </Button>
                  <Button 
                    onClick={backToDashboard}
                    variant="secondary"
                    className="w-full md:w-auto px-6 py-3 text-sm md:text-base"
                  >
                    ← Back to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.gameStatus === 'playing' && renderGameScreen()}

      {gameState.gameStatus === 'completed' && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4 md:p-6 relative flex items-center justify-center">
          <CloudBackground />
          
          <div className="relative z-10 w-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">🎉</div>
                <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-3 md:mb-4">Selamat! Game Selesai!</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 mb-4 md:mb-6 border-2 border-green-200">
                  <div className="grid grid-cols-2 gap-3 md:gap-6 mb-3 md:mb-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-emerald-600">{gameState.correctMatches}</div>
                      <div className="text-xs md:text-sm text-gray-600">Jawaban Benar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-red-500">{gameState.wrongMatches}</div>
                      <div className="text-xs md:text-sm text-gray-600">Jawaban Salah</div>
                    </div>
                  </div>
                  
                  <div className="text-base md:text-lg mb-3 md:mb-4">
                    {gameState.wrongMatches === 0 ? (
                      <div className="text-green-700">
                        <div className="text-xl md:text-2xl mb-2">🌟 Sempurna!</div>
                        <p className="text-sm md:text-base">Kamu menjawab semua dengan benar tanpa kesalahan!</p>
                      </div>
                    ) : gameState.wrongMatches <= 2 ? (
                      <div className="text-emerald-700">
                        <div className="text-xl md:text-2xl mb-2">👍 Bagus Sekali!</div>
                        <p className="text-sm md:text-base">Pengetahuan kesehatanmu sudah cukup baik.</p>
                      </div>
                    ) : (
                      <div className="text-yellow-700">
                        <div className="text-xl md:text-2xl mb-2">📚 Terus Belajar!</div>
                        <p className="text-sm md:text-base">Ayo tingkatkan pengetahuanmu!</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                  <Button 
                    onClick={startGame} 
                    className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 text-sm md:text-base"
                  >
                    🔄 Main Lagi
                  </Button>
                  <Button 
                    onClick={nextLevel}
                    className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 text-sm md:text-base"
                  >
                    ⭐ Level Berikutnya
                  </Button>
                  <Button 
                    onClick={backToGameHome} 
                    variant="secondary" 
                    className="w-full md:w-auto px-6 py-3 text-sm md:text-base"
                  >
                    🏠 Kembali ke Game Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthMatchingGame;