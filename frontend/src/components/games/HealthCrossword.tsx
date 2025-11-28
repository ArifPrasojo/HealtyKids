import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

interface CrosswordClue {
  id: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  number: number;
}

interface CellData {
  letter: string;
  isBlocked: boolean;
  number?: number;
  userInput: string;
}

interface GameState {
  score: number;
  correctAnswers: number;
  totalClues: number;
  gameStatus: 'menu' | 'playing' | 'completed';
  hintsUsed: number;
}

const HealthCrossword: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    correctAnswers: 0,
    totalClues: 0,
    gameStatus: 'menu',
    hintsUsed: 0
  });

  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');

  // Health-related crossword data
  const clues: CrosswordClue[] = [
    {
      id: 1,
      clue: "Organ yang memompa darah ke seluruh tubuh",
      answer: "JANTUNG",
      direction: "across",
      startRow: 1,
      startCol: 1,
      number: 1
    },
    {
      id: 2,
      clue: "Makanan yang mengandung banyak vitamin C",
      answer: "JERUK",
      direction: "down",
      startRow: 1,
      startCol: 1,
      number: 1
    },
    {
      id: 3,
      clue: "Aktivitas fisik untuk menjaga kebugaran",
      answer: "OLAHRAGA",
      direction: "across",
      startRow: 3,
      startCol: 0,
      number: 2
    },
    {
      id: 4,
      clue: "Zat gizi untuk pertumbuhan tulang",
      answer: "KALSIUM",
      direction: "down",
      startRow: 2,
      startCol: 5,
      number: 3
    },
    {
      id: 5,
      clue: "Kegiatan untuk menghilangkan stres",
      answer: "MEDITASI",
      direction: "across",
      startRow: 5,
      startCol: 1,
      number: 4
    },
    {
      id: 6,
      clue: "Organ pernapasan utama manusia",
      answer: "PARU",
      direction: "down",
      startRow: 1,
      startCol: 4,
      number: 5
    },
    {
      id: 7,
      clue: "Waktu istirahat yang dibutuhkan tubuh",
      answer: "TIDUR",
      direction: "across",
      startRow: 7,
      startCol: 2,
      number: 6
    },
    {
      id: 8,
      clue: "Cairan penting untuk tubuh",
      answer: "AIR",
      direction: "down",
      startRow: 3,
      startCol: 7,
      number: 7
    }
  ];

  // Initialize grid
  const initializeGrid = () => {
    const grid: CellData[][] = Array(10).fill(null).map(() =>
      Array(10).fill(null).map(() => ({
        letter: '',
        isBlocked: true,
        userInput: ''
      }))
    );

    // Place clues in grid
    clues.forEach(clue => {
      const { answer, direction, startRow, startCol, number } = clue;
      
      for (let i = 0; i < answer.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        
        if (row < 10 && col < 10) {
          grid[row][col] = {
            letter: answer[i],
            isBlocked: false,
            number: i === 0 ? number : grid[row][col].number,
            userInput: ''
          };
        }
      }
    });

    return grid;
  };

  const [grid, setGrid] = useState<CellData[][]>(() => initializeGrid());

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      totalClues: clues.length
    }));
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlocked) return;

    // Find clues that pass through this cell
    const passingClues = clues.filter(clue => {
      const { direction, startRow, startCol, answer } = clue;
      
      if (direction === 'across') {
        return row === startRow && col >= startCol && col < startCol + answer.length;
      } else {
        return col === startCol && row >= startRow && row < startRow + answer.length;
      }
    });

    if (passingClues.length > 0) {
      // If multiple clues, toggle between them
      if (selectedClue) {
        const currentClue = passingClues.find(c => c.id === selectedClue);
        if (currentClue) {
          const otherClue = passingClues.find(c => c.id !== selectedClue);
          if (otherClue) {
            setSelectedClue(otherClue.id);
            setSelectedDirection(otherClue.direction);
          }
        } else {
          setSelectedClue(passingClues[0].id);
          setSelectedDirection(passingClues[0].direction);
        }
      } else {
        setSelectedClue(passingClues[0].id);
        setSelectedDirection(passingClues[0].direction);
      }
    }
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value.length > 1) return;
    
    const newGrid = [...grid];
    newGrid[row][col] = {
      ...newGrid[row][col],
      userInput: value.toUpperCase()
    };
    setGrid(newGrid);

    // Check if word is completed
    checkWordCompletion();
  };

  const checkWordCompletion = () => {
    let correctCount = 0;
    
    clues.forEach(clue => {
      const { answer, direction, startRow, startCol } = clue;
      let isCorrect = true;
      
      for (let i = 0; i < answer.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        
        if (grid[row][col].userInput !== answer[i]) {
          isCorrect = false;
          break;
        }
      }
      
      if (isCorrect) {
        correctCount++;
      }
    });

    setGameState(prev => ({
      ...prev,
      correctAnswers: correctCount,
      score: correctCount * 10
    }));

    // Check if game is completed
    if (correctCount === clues.length) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'completed'
      }));
    }
  };

  const getHint = () => {
    if (!selectedClue || gameState.hintsUsed >= 3) return;

    const clue = clues.find(c => c.id === selectedClue);
    if (!clue) return;

    const { answer, direction, startRow, startCol } = clue;
    
    // Find first empty cell and fill it
    for (let i = 0; i < answer.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      
      if (!grid[row][col].userInput) {
        const newGrid = [...grid];
        newGrid[row][col] = {
          ...newGrid[row][col],
          userInput: answer[i]
        };
        setGrid(newGrid);
        
        setGameState(prev => ({
          ...prev,
          hintsUsed: prev.hintsUsed + 1
        }));
        
        checkWordCompletion();
        break;
      }
    }
  };

  const clearGrid = () => {
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        userInput: ''
      }))
    );
    setGrid(newGrid);
    setGameState(prev => ({
      ...prev,
      score: 0,
      correctAnswers: 0
    }));
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      score: 0,
      correctAnswers: 0,
      hintsUsed: 0
    }));
    setGrid(initializeGrid());
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'menu'
    }));
    setSelectedClue(null);
  };

  const getCellHighlight = (row: number, col: number) => {
    if (!selectedClue) return '';
    
    const clue = clues.find(c => c.id === selectedClue);
    if (!clue) return '';

    const { direction, startRow, startCol, answer } = clue;
    
    if (direction === 'across') {
      if (row === startRow && col >= startCol && col < startCol + answer.length) {
        return 'bg-blue-200 border-blue-400';
      }
    } else {
      if (col === startCol && row >= startRow && row < startRow + answer.length) {
        return 'bg-blue-200 border-blue-400';
      }
    }
    
    return '';
  };

  const renderGrid = () => (
    <div className="grid grid-cols-10 gap-1 bg-gray-300 p-4 rounded-2xl">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-8 h-8 border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
              cell.isBlocked
                ? 'bg-gray-800'
                : `bg-white border-gray-400 hover:border-blue-300 ${getCellHighlight(rowIndex, colIndex)}`
            }`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {!cell.isBlocked && (
              <>
                {cell.number && (
                  <div className="absolute text-xs text-blue-600 font-bold" style={{ fontSize: '8px', marginTop: '-12px', marginLeft: '-12px' }}>
                    {cell.number}
                  </div>
                )}
                <input
                  type="text"
                  value={cell.userInput}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  className="w-full h-full text-center border-none outline-none bg-transparent text-sm font-bold text-gray-800"
                  maxLength={1}
                />
              </>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderClues = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">📝 Mendatar (Across)</h4>
        <div className="space-y-2">
          {clues
            .filter(clue => clue.direction === 'across')
            .map(clue => (
              <div
                key={clue.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedClue === clue.id ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => {
                  setSelectedClue(clue.id);
                  setSelectedDirection('across');
                }}
              >
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-blue-600 min-w-[24px]">{clue.number}.</span>
                  <span className="text-sm text-gray-700">{clue.clue}</span>
                  <span className="text-xs text-gray-400">({clue.answer.length} huruf)</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">📝 Menurun (Down)</h4>
        <div className="space-y-2">
          {clues
            .filter(clue => clue.direction === 'down')
            .map(clue => (
              <div
                key={clue.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedClue === clue.id ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => {
                  setSelectedClue(clue.id);
                  setSelectedDirection('down');
                }}
              >
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-blue-600 min-w-[24px]">{clue.number}.</span>
                  <span className="text-sm text-gray-700">{clue.clue}</span>
                  <span className="text-xs text-gray-400">({clue.answer.length} huruf)</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🧩 Teka Teki Silang Kesehatan</h2>
        <p className="text-gray-600">Asah pengetahuan kesehatanmu dengan teka-teki yang menantang!</p>
      </div>

      {gameState.gameStatus === 'menu' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Health Crossword!</h3>
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left max-w-2xl mx-auto">
              <h4 className="font-bold text-lg mb-3">🎯 How to Play:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>🖱️ Klik pada kotak putih untuk memilih kata</li>
                <li>⌨️ Ketik huruf untuk mengisi kotak</li>
                <li>📝 Baca petunjuk di sebelah kanan untuk mengetahui jawabannya</li>
                <li>💡 Gunakan tombol hint jika kesulitan (maksimal 3 kali)</li>
                <li>🎯 Isi semua kata dengan benar untuk menyelesaikan permainan</li>
                <li>🏆 Setiap kata yang benar memberikan 10 poin</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 mb-6 max-w-xl mx-auto border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">🏆 Learning Goals:</h4>
              <p className="text-green-700 text-sm">
                Belajar istilah-istilah kesehatan sambil melatih kemampuan berpikir dan konsentrasi!
              </p>
            </div>
          </div>
          <Button 
            onClick={startGame}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
          >
            🚀 Mulai Bermain
          </Button>
        </div>
      )}

      {gameState.gameStatus === 'playing' && (
        <div>
          {/* Game Stats */}
          <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
            <div className="flex space-x-6 text-sm font-semibold">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{gameState.score}</div>
                <div className="text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{gameState.correctAnswers}/{gameState.totalClues}</div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{gameState.hintsUsed}/3</div>
                <div className="text-gray-600">Hints Used</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={getHint} 
                variant="secondary" 
                size="sm"
                disabled={!selectedClue || gameState.hintsUsed >= 3}
                className="flex items-center space-x-2"
              >
                <span>💡</span>
                <span>Hint</span>
              </Button>
              <Button onClick={clearGrid} variant="secondary" size="sm">
                🗑️ Clear
              </Button>
              <Button onClick={resetGame} variant="secondary" size="sm">
                🏠 Menu
              </Button>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Crossword Grid */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">🎯 Crossword Grid</h3>
                <div className="flex justify-center">
                  {renderGrid()}
                </div>
                {selectedClue && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-semibold text-blue-800">
                      Selected: {clues.find(c => c.id === selectedClue)?.number} {selectedDirection === 'across' ? 'Mendatar' : 'Menurun'}
                    </div>
                    <div className="text-sm text-blue-700">
                      {clues.find(c => c.id === selectedClue)?.clue}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clues */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 max-h-96 overflow-y-auto">
                {renderClues()}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.gameStatus === 'completed' && (
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">Selamat! Kamu Berhasil!</h3>
          <div className="bg-green-50 rounded-2xl p-6 mb-6 border border-green-200">
            <p className="text-lg mb-2">Final Score: <span className="font-bold text-green-600">{gameState.score}</span></p>
            <p className="text-gray-600 mb-4">
              Kamu berhasil menyelesaikan semua {gameState.totalClues} kata dengan menggunakan {gameState.hintsUsed} hint!
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>💡 Pengetahuan kesehatan yang sudah kamu pelajari:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {clues.map(clue => (
                  <span key={clue.id} className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700">
                    {clue.answer}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
              🔄 Main Lagi
            </Button>
            <Button onClick={resetGame} variant="secondary">
              🏠 Menu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCrossword;