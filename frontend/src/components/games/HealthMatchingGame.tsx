import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

interface GameState {
  score: number;
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
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    gameStatus: 'menu',
    correctMatches: 0,
    wrongMatches: 0
  });

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [currentItems, setCurrentItems] = useState<HealthItem[]>([]);
  const [connections, setConnections] = useState<{ leftId: number; rightId: number; isCorrect?: boolean }[]>([]);
  const [showCheck, setShowCheck] = useState(false);

  // Health education data for SMP/SMA students
  const healthItems: HealthItem[] = [
    // Organ tubuh
    { id: 1, term: "Jantung", definition: "Organ yang memompa darah ke seluruh tubuh", category: "organ" },
    { id: 2, term: "Paru-paru", definition: "Organ pernapasan yang mengambil oksigen dari udara", category: "organ" },
    { id: 3, term: "Hati", definition: "Organ yang menyaring racun dari darah", category: "organ" },
    { id: 4, term: "Ginjal", definition: "Organ yang menyaring limbah dari darah dan membuat urin", category: "organ" },
    
    // Nutrisi
    { id: 5, term: "Protein", definition: "Zat gizi untuk membangun dan memperbaiki jaringan tubuh", category: "nutrisi" },
    { id: 6, term: "Karbohidrat", definition: "Sumber energi utama bagi tubuh", category: "nutrisi" },
    { id: 7, term: "Vitamin C", definition: "Vitamin yang meningkatkan daya tahan tubuh", category: "nutrisi" },
    { id: 8, term: "Kalsium", definition: "Mineral penting untuk kesehatan tulang dan gigi", category: "nutrisi" },
    
    // Aktivitas kesehatan
    { id: 9, term: "Aerobik", definition: "Olahraga yang meningkatkan kesehatan jantung dan paru-paru", category: "aktivitas" },
    { id: 10, term: "Yoga", definition: "Latihan yang menggabungkan pose, pernapasan, dan meditasi", category: "aktivitas" },
    { id: 11, term: "Pemanasan", definition: "Aktivitas ringan sebelum olahraga untuk mencegah cedera", category: "aktivitas" },
    { id: 12, term: "Stretching", definition: "Peregangan otot untuk meningkatkan fleksibilitas", category: "aktivitas" },
    
    // Penyakit/kondisi
    { id: 13, term: "Hipertensi", definition: "Kondisi tekanan darah tinggi", category: "penyakit" },
    { id: 14, term: "Diabetes", definition: "Penyakit yang ditandai kadar gula darah tinggi", category: "penyakit" },
    { id: 15, term: "Anemia", definition: "Kondisi kekurangan sel darah merah", category: "penyakit" },
    { id: 16, term: "Obesitas", definition: "Kondisi kelebihan berat badan yang berlebihan", category: "penyakit" },
    
    // Kesehatan mental
    { id: 17, term: "Stres", definition: "Reaksi tubuh terhadap tekanan fisik atau mental", category: "mental" },
    { id: 18, term: "Depresi", definition: "Gangguan mood yang menyebabkan perasaan sedih berkepanjangan", category: "mental" },
    { id: 19, term: "Resiliensi", definition: "Kemampuan untuk pulih dari kesulitan hidup", category: "mental" },
    { id: 20, term: "Mindfulness", definition: "Kesadaran penuh terhadap momen saat ini", category: "mental" }
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
    const selectedItems = shuffleArray(healthItems).slice(0, 6); // Select 6 random items
    setCurrentItems(selectedItems);
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
    if (matches.find(m => m.leftId === id && m.isMatched)) return; // Already matched
    if (connections.find(c => c.leftId === id)) return; // Already connected
    setSelectedLeft(selectedLeft === id ? null : id);
  };

  const handleRightClick = (id: number) => {
    if (matches.find(m => m.rightId === id && m.isMatched)) return; // Already matched
    if (connections.find(c => c.rightId === id)) return; // Already connected
    
    if (selectedLeft !== null) {
      // Create connection line
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
    const updatedConnections = connections.map(conn => {
      const leftItem = currentItems.find(item => item.id === conn.leftId);
      const rightItem = currentItems.find(item => item.id === conn.rightId);
      
      if (leftItem && rightItem && leftItem.id === rightItem.id) {
        // Correct match
        correctCount++;
        updatedMatches.push({ leftId: conn.leftId, rightId: conn.rightId, isMatched: true });
        return { ...conn, isCorrect: true };
      } else {
        // Wrong match
        wrongCount++;
        return { ...conn, isCorrect: false };
      }
    });
    
    // Update state
    setGameState(prev => ({
      ...prev,
      correctMatches: prev.correctMatches + correctCount,
      wrongMatches: prev.wrongMatches + wrongCount,
      score: Math.max(0, prev.score + (correctCount * 10) - (wrongCount * 2))
    }));
    
    setMatches(updatedMatches);
    setConnections(updatedConnections);
    
    // Remove wrong connections after delay
    setTimeout(() => {
      const correctConnections = updatedConnections.filter(conn => conn.isCorrect);
      setConnections(correctConnections);
      setShowCheck(correctConnections.length < currentItems.length && connections.some(c => c.isCorrect === undefined));
      
      // Check if all matches are completed
      if (gameState.correctMatches + correctCount === currentItems.length) {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gameStatus: 'completed' }));
        }, 500);
      }
    }, 2000);
  };

  // Draw SVG connections
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
                   conn.isCorrect === false ? '#EF4444' : '#3B82F6';
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
      score: 0,
      level: 1,
      gameStatus: 'playing',
      correctMatches: 0,
      wrongMatches: 0
    });
  };

  const resetGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'menu' }));
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
      case 'organ': return 'from-red-400 to-pink-500';
      case 'nutrisi': return 'from-green-400 to-emerald-500';
      case 'aktivitas': return 'from-blue-400 to-cyan-500';
      case 'penyakit': return 'from-yellow-400 to-orange-500';
      case 'mental': return 'from-purple-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const isMatched = (id: number, side: 'left' | 'right') => {
    return matches.find(m => 
      side === 'left' ? m.leftId === id && m.isMatched : m.rightId === id && m.isMatched
    );
  };

  const renderGameScreen = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 z-50 overflow-auto">
      <div className="min-h-screen p-8" id="game-container">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">🎯 Cocokkan Istilah dengan Definisinya</h3>
          <p className="text-gray-600 text-lg">Tarik garis dari istilah ke definisi yang tepat</p>
        </div>

        {/* Score Display */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-3xl font-bold text-blue-600">{gameState.score}</div>
          </div>
          <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
            <div className="text-sm text-gray-600">Correct</div>
            <div className="text-3xl font-bold text-green-600">{gameState.correctMatches}/{currentItems.length}</div>
          </div>
          <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
            <div className="text-sm text-gray-600">Wrong</div>
            <div className="text-3xl font-bold text-red-600">{gameState.wrongMatches}</div>
          </div>
        </div>

        {/* SVG for connection lines */}
        <svg 
          className="absolute inset-0 pointer-events-none z-10"
          style={{ width: '100%', height: '100%' }}
        >
          {drawConnections()}
        </svg>

        {/* Matching Game */}
        <div className="grid grid-cols-2 gap-16 max-w-6xl mx-auto relative z-20">
          {/* Left side - Terms */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold text-center text-gray-700 mb-6">Istilah</h4>
            {currentItems.map((item, index) => (
              <div
                key={`left-${item.id}`}
                id={`left-${item.id}`}
                onClick={() => handleLeftClick(item.id)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isMatched(item.id, 'left') 
                    ? `bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-xl opacity-75`
                    : connections.find(c => c.leftId === item.id)
                    ? connections.find(c => c.leftId === item.id)?.isCorrect === false
                      ? 'bg-red-200 border-4 border-red-500 shadow-lg animate-pulse'
                      : connections.find(c => c.leftId === item.id)?.isCorrect === true
                      ? `bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-xl`
                      : 'bg-blue-200 border-4 border-blue-500 shadow-lg'
                    : selectedLeft === item.id
                    ? 'bg-yellow-200 border-4 border-yellow-400 shadow-lg ring-4 ring-yellow-300'
                    : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className={`font-bold text-xl ${
                    isMatched(item.id, 'left') || connections.find(c => c.leftId === item.id)?.isCorrect === true
                      ? 'text-white' 
                      : 'text-gray-800'
                  }`}>
                    {item.term}
                  </div>
                  <div className={`text-sm mt-2 ${
                    isMatched(item.id, 'left') || connections.find(c => c.leftId === item.id)?.isCorrect === true
                      ? 'text-white opacity-80' 
                      : 'text-gray-500'
                  }`}>
                    {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Definitions */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold text-center text-gray-700 mb-6">Definisi</h4>
            {shuffleArray([...currentItems]).map((item, index) => (
              <div
                key={`right-${item.id}`}
                id={`right-${item.id}`}
                onClick={() => handleRightClick(item.id)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isMatched(item.id, 'right') 
                    ? `bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-xl opacity-75`
                    : connections.find(c => c.rightId === item.id)
                    ? connections.find(c => c.rightId === item.id)?.isCorrect === false
                      ? 'bg-red-200 border-4 border-red-500 shadow-lg animate-pulse'
                      : connections.find(c => c.rightId === item.id)?.isCorrect === true
                      ? `bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-xl`
                      : 'bg-blue-200 border-4 border-blue-500 shadow-lg'
                    : selectedRight === item.id
                    ? 'bg-yellow-200 border-4 border-yellow-400 shadow-lg ring-4 ring-yellow-300'
                    : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className={`text-lg leading-relaxed ${
                    isMatched(item.id, 'right') || connections.find(c => c.rightId === item.id)?.isCorrect === true
                      ? 'text-white' 
                      : 'text-gray-700'
                  }`}>
                    {item.definition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Check Button */}
        {showCheck && connections.some(c => c.isCorrect === undefined) && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <Button
              onClick={checkConnections}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all"
            >
              ✓ Periksa Jawaban
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="fixed bottom-8 right-8 z-30">
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg max-w-xs">
            <p className="text-sm text-gray-600">
              💡 Klik istilah → Klik definisi → Tekan "Periksa Jawaban"
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="fixed top-4 right-4 z-30">
          <Button 
            onClick={resetGame} 
            variant="secondary"
            className="bg-white bg-opacity-90 hover:bg-opacity-100 shadow-lg"
          >
            ✕ Tutup
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎯 Game Mencocokkan Istilah Kesehatan</h2>
        <p className="text-gray-600">Cocokkan istilah kesehatan dengan definisi yang tepat!</p>
      </div>

      {gameState.gameStatus === 'menu' && (
        <div className="text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-8">
          <h2 className="text-4xl font-bold mb-4">🎯 Game Mencocokkan Istilah Kesehatan</h2>
          <p className="text-lg mb-6">
            Uji pengetahuanmu tentang kesehatan! 
            Cocokkan istilah kesehatan dengan definisi yang tepat dan pelajari hal-hal penting tentang tubuh dan kesehatan.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-6 text-left">
            <div>
              <h4 className="font-bold text-green-200 mb-3">📚 Kategori Materi:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-pink-500 mr-2"></span>Organ Tubuh</div>
                <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-2"></span>Nutrisi</div>
                <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 mr-2"></span>Aktivitas</div>
                <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mr-2"></span>Penyakit</div>
                <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 mr-2"></span>Kesehatan Mental</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-blue-200 mb-3">⭐ Sistem Poin:</h4>
              <div className="space-y-2 text-sm">
                <div>✅ Jawaban Benar: +10 poin</div>
                <div>❌ Jawaban Salah: -2 poin</div>
                <div>🎯 Target: Cocokkan semua pasangan</div>
                <div>🏆 Semakin akurat, semakin tinggi skormu!</div>
              </div>
            </div>
          </div>
          <div className="mb-6 p-4 bg-white bg-opacity-20 rounded-lg">
            <h4 className="font-bold mb-2">📖 Cara Bermain:</h4>
            <div className="text-sm space-y-1">
              <div>1. Klik pada istilah di kolom kiri</div>
              <div>2. Kemudian klik definisi yang sesuai di kolom kanan</div>
              <div>3. Garis biru akan menghubungkan pilihanmu</div>
              <div>4. Tekan tombol "Periksa Jawaban" untuk validasi</div>
              <div>5. Garis hijau = benar, garis merah putus-putus = salah</div>
            </div>
          </div>
          <Button 
            onClick={startGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-black text-xl px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-transform"
          >
            🚀 Mulai Belajar!
          </Button>
        </div>
      )}

      {(gameState.gameStatus === 'playing') && (
        <div className="flex flex-col items-center">
          {renderGameScreen()}
        </div>
      )}

      {gameState.gameStatus === 'completed' && (
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-green-600 mb-4">Selamat! Game Selesai!</h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-6 border-2 border-green-200">
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{gameState.correctMatches}</div>
                <div className="text-sm text-gray-600">Jawaban Benar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">{gameState.wrongMatches}</div>
                <div className="text-sm text-gray-600">Jawaban Salah</div>
              </div>
            </div>
            
            <div className="text-lg mb-4">
              {gameState.score >= 55 ? (
                <div className="text-green-700">
                  <div className="text-2xl mb-2">🌟 Luar Biasa!</div>
                  <p>Kamu memiliki pengetahuan kesehatan yang sangat baik! Terus pertahankan pola hidup sehat ya!</p>
                </div>
              ) : gameState.score >= 40 ? (
                <div className="text-blue-700">
                  <div className="text-2xl mb-2">👍 Bagus Sekali!</div>
                  <p>Pengetahuan kesehatanmu sudah cukup baik. Terus belajar untuk menjadi lebih sehat!</p>
                </div>
              ) : gameState.score >= 25 ? (
                <div className="text-yellow-700">
                  <div className="text-2xl mb-2">📚 Perlu Belajar Lagi!</div>
                  <p>Terus semangat belajar! Pengetahuan kesehatan sangat penting untuk masa depanmu.</p>
                </div>
              ) : (
                <div className="text-red-700">
                  <div className="text-2xl mb-2">💪 Jangan Menyerah!</div>
                  <p>Ayo coba lagi! Dengan belajar lebih banyak, kamu pasti bisa mendapat skor yang lebih baik.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-blue-100 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">💡 Tahukah Kamu?</h4>
              <p className="text-blue-700 text-sm">
                Mempelajari istilah kesehatan membantu kita memahami tubuh lebih baik dan membuat keputusan hidup yang lebih sehat!
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={startGame} 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3"
            >
              🔄 Main Lagi
            </Button>
            <Button 
              onClick={nextLevel}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-6 py-3"
            >
              ⭐ Level Berikutnya
            </Button>
            <Button onClick={resetGame} variant="secondary" className="px-6 py-3">
              🏠 Kembali ke Menu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthMatchingGame;