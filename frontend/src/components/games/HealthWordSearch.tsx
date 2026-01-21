import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import CloudBackground from '../layouts/CloudBackground';

interface WordData {
  word: string;
  hint: string;
  found: boolean;
}

interface Cell {
  letter: string;
  isHighlighted: boolean;
  isFound: boolean;
  wordId?: number;
}

interface GameState {
  score: number;
  wordsFound: number;
  totalWords: number;
  gameStatus: 'menu' | 'playing' | 'completed';
  timeElapsed: number;
  hintsUsed: number;
}

interface Placement {
  word: string;
  row: number;
  col: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

const HealthWordSearch: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    wordsFound: 0,
    totalWords: 0,
    gameStatus: 'menu',
    timeElapsed: 0,
    hintsUsed: 0
  });

  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [touchStart, setTouchStart] = useState<{ row: number; col: number } | null>(null);

  // Health-related words to find
  const words: WordData[] = [
    { word: 'PUBERTAS', hint: 'Masa perubahan dari anak ke remaja', found: false },
    { word: 'HORMON', hint: 'Zat kimia pengatur tubuh', found: false },
    { word: 'PRIVASI', hint: 'Hak menjaga area pribadi', found: false },
    { word: 'SEHAT', hint: 'Kondisi tubuh yang baik', found: false },
    { word: 'TUBUH', hint: 'Bagian fisik manusia', found: false },
    { word: 'EMOSI', hint: 'Perasaan dan suasana hati', found: false },
    { word: 'BATASAN', hint: 'Batas yang tidak boleh dilanggar', found: false },
    { word: 'KEBERSIHAN', hint: 'Menjaga diri tetap bersih', found: false },
    { word: 'MENSTRUASI', hint: 'Siklus bulanan pada perempuan', found: false },
    { word: 'NUTRISI', hint: 'Zat makanan untuk pertumbuhan', found: false }
  ];

  const [wordList, setWordList] = useState<WordData[]>(words);

  // Grid size
  const GRID_SIZE = 13;

  // Function to generate random placements
  const generatePlacements = (): Placement[] => {
    const directions: ('horizontal' | 'vertical' | 'diagonal')[] = ['horizontal', 'vertical', 'diagonal'];
    const newPlacements: Placement[] = [];
    const usedCells = new Set<string>();

    words.forEach(({ word }) => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100; // Prevent infinite loop

      while (!placed && attempts < maxAttempts) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        let row = 0;
        let col = 0;

        if (direction === 'horizontal') {
          row = Math.floor(Math.random() * GRID_SIZE);
          col = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
        } else if (direction === 'vertical') {
          row = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
          col = Math.floor(Math.random() * GRID_SIZE);
        } else if (direction === 'diagonal') {
          row = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
          col = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
        }

        // Check if all cells are free
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          let r = row;
          let c = col;

          if (direction === 'horizontal') {
            c = col + i;
          } else if (direction === 'vertical') {
            r = row + i;
          } else if (direction === 'diagonal') {
            r = row + i;
            c = col + i;
          }

          if (usedCells.has(`${r}-${c}`)) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          // Mark cells as used
          for (let i = 0; i < word.length; i++) {
            let r = row;
            let c = col;

            if (direction === 'horizontal') {
              c = col + i;
            } else if (direction === 'vertical') {
              r = row + i;
            } else if (direction === 'diagonal') {
              r = row + i;
              c = col + i;
            }

            usedCells.add(`${r}-${c}`);
          }

          newPlacements.push({ word, row, col, direction });
          placed = true;
        }
        attempts++;
      }

      if (!placed) {
        // Fallback: place horizontally at top
        const row = newPlacements.length;
        const col = 0;
        newPlacements.push({ word, row, col, direction: 'horizontal' });
        for (let i = 0; i < word.length; i++) {
          usedCells.add(`${row}-${col + i}`);
        }
      }
    });

    return newPlacements;
  };

  // Generate grid with words
  const generateGrid = (): Cell[][] => {
    const grid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        letter: '',
        isHighlighted: false,
        isFound: false
      }))
    );

    placements.forEach((placement, index) => {
      const { word, row, col, direction } = placement;
      for (let i = 0; i < word.length; i++) {
        let r = row;
        let c = col;

        if (direction === 'horizontal') {
          c = col + i;
        } else if (direction === 'vertical') {
          r = row + i;
        } else if (direction === 'diagonal') {
          r = row + i;
          c = col + i;
        }

        if (r < GRID_SIZE && c < GRID_SIZE) {
          grid[r][c] = {
            letter: word[i],
            isHighlighted: false,
            isFound: false,
            wordId: index
          };
        }
      }
    });

    // Fill empty cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!grid[i][j].letter) {
          grid[i][j].letter = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    return grid;
  };

  const [grid, setGrid] = useState<Cell[][]>(() => generateGrid());

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      totalWords: words.length
    }));
  }, []);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.gameStatus === 'playing') {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
    highlightCell(row, col, true);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting && selectedCells.length > 0) {
      const firstCell = selectedCells[0];
      const lastCell = selectedCells[selectedCells.length - 1];
      
      // Cek apakah masih dalam satu garis lurus
      const isHorizontal = row === firstCell.row;
      const isVertical = col === firstCell.col;
      const isDiagonal = Math.abs(row - firstCell.row) === Math.abs(col - firstCell.col);
      
      if (isHorizontal || isVertical || isDiagonal) {
        // Hilangkan highlight cells sebelumnya
        selectedCells.forEach(({ row: r, col: c }) => {
          highlightCell(r, c, false);
        });
        
        // Buat array cells baru dari start ke current position
        const newCells: { row: number; col: number }[] = [firstCell];
        
        if (isHorizontal) {
          const step = col > firstCell.col ? 1 : -1;
          for (let c = firstCell.col + step; c !== col + step; c += step) {
            newCells.push({ row, col: c });
          }
        } else if (isVertical) {
          const step = row > firstCell.row ? 1 : -1;
          for (let r = firstCell.row + step; r !== row + step; r += step) {
            newCells.push({ row: r, col });
          }
        } else if (isDiagonal) {
          const rowStep = row > firstCell.row ? 1 : -1;
          const colStep = col > firstCell.col ? 1 : -1;
          let r = firstCell.row + rowStep;
          let c = firstCell.col + colStep;
          while (r !== row + rowStep && c !== col + colStep) {
            newCells.push({ row: r, col: c });
            r += rowStep;
            c += colStep;
          }
        }
        
        setSelectedCells(newCells);
        newCells.forEach(({ row: r, col: c }) => {
          highlightCell(r, c, true);
        });
      }
    }
  };

  const handleCellMouseUp = () => {
    setIsSelecting(false);
    checkSelectedWord();
    clearHighlights();
    setSelectedCells([]);
  };

  const handleCellTouchStart = (row: number, col: number, e: React.TouchEvent) => {
    e.preventDefault();
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
    highlightCell(row, col, true);
    setTouchStart({ row, col });
  };

  const handleCellTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isSelecting || !touchStart) return;

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element) {
      const cellKey = element.getAttribute('data-cell');
      if (cellKey) {
        const [rowStr, colStr] = cellKey.split('-');
        const row = parseInt(rowStr);
        const col = parseInt(colStr);
        handleCellMouseEnter(row, col);
      }
    }
  };

  const handleCellTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsSelecting(false);
    checkSelectedWord();
    clearHighlights();
    setSelectedCells([]);
    setTouchStart(null);
  };

  const highlightCell = (row: number, col: number, highlight: boolean) => {
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[row][col] = {
        ...newGrid[row][col],
        isHighlighted: highlight
      };
      return newGrid;
    });
  };

  const clearHighlights = () => {
    setGrid(prev =>
      prev.map(row =>
        row.map(cell => ({
          ...cell,
          isHighlighted: false
        }))
      )
    );
  };

  const checkSelectedWord = () => {
    if (selectedCells.length < 2) return;

    // Pastikan cells terurut berdasarkan posisi
    const isHorizontal = selectedCells.every((cell, i) => 
      i === 0 || cell.row === selectedCells[0].row
    );
    const isVertical = selectedCells.every((cell, i) => 
      i === 0 || cell.col === selectedCells[0].col
    );
    const isDiagonal = selectedCells.every((cell, i) => 
      i === 0 || (Math.abs(cell.row - selectedCells[0].row) === Math.abs(cell.col - selectedCells[0].col))
    );

    if (!isHorizontal && !isVertical && !isDiagonal) {
      return; // Selection tidak valid
    }

    // Urutkan cells berdasarkan arah
    let sortedCells = [...selectedCells];
    if (isHorizontal) {
      sortedCells.sort((a, b) => a.col - b.col);
    } else if (isVertical) {
      sortedCells.sort((a, b) => a.row - b.row);
    } else if (isDiagonal) {
      sortedCells.sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
      });
    }

    const selectedWord = sortedCells.map(({ row, col }) => grid[row][col].letter).join('');
    const reverseWord = selectedWord.split('').reverse().join('');

    console.log('Selected word:', selectedWord, 'Reverse:', reverseWord); // Debug

    const foundWordIndex = wordList.findIndex(
      w => !w.found && (w.word === selectedWord || w.word === reverseWord)
    );

    if (foundWordIndex !== -1) {
      // Mark word as found
      setWordList(prev => {
        const newList = [...prev];
        newList[foundWordIndex].found = true;
        return newList;
      });

      // Mark cells as found
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        sortedCells.forEach(({ row, col }) => {
          newGrid[row][col].isFound = true;
        });
        return newGrid;
      });

      // Update score
      const wordsFound = gameState.wordsFound + 1;
      setGameState(prev => ({
        ...prev,
        wordsFound,
        score: wordsFound * 10
      }));

      // Check if game completed
      if (wordsFound === words.length) {
        setGameState(prev => ({
          ...prev,
          gameStatus: 'completed'
        }));
      }
    }
  };

  const startGame = () => {
    const newPlacements = generatePlacements();
    setPlacements(newPlacements);
    setGameState({
      score: 0,
      wordsFound: 0,
      totalWords: words.length,
      gameStatus: 'playing',
      timeElapsed: 0,
      hintsUsed: 0
    });
    setGrid(generateGrid());
    setWordList(words.map(w => ({ ...w, found: false })));
  };

  const backToDashboard = () => {
    navigate('/gamehome');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

const renderGrid = () => (
    <div 
      // UBAH 1: Gunakan 'grid' (bukan inline-grid), w-full, dan max-w agar responsif tapi tidak melebar berlebihan
      className="grid gap-0.5 bg-gray-300 p-2 md:p-3 rounded-xl w-full max-w-xl mx-auto select-none touch-none"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      onMouseLeave={() => {
        if (isSelecting) {
          setIsSelecting(false);
          checkSelectedWord();
          clearHighlights();
          setSelectedCells([]);
        }
      }}
      // Tambahkan prevent default untuk mencegah scroll saat swipe di HP
      onTouchMove={handleCellTouchMove}
      onTouchEnd={handleCellTouchEnd}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellKey = `${rowIndex}-${colIndex}`;
          
          return (
            <div
              key={cellKey}
              data-cell={cellKey}
              // UBAH 2: 
              // - Hapus 'w-8 h-8' dll.
              // - Ganti dengan 'aspect-square w-full' (kotak otomatis persegi mengikuti lebar kolom)
              // - Font size diperkecil untuk mobile: text-[10px]
              className={`aspect-square w-full flex items-center justify-center text-[10px] sm:text-xs md:text-base font-bold cursor-pointer transition-all border ${
                cell.isFound
                  ? 'bg-green-400 text-white border-green-600'
                  : cell.isHighlighted
                  ? 'bg-blue-300 border-blue-500'
                  : 'bg-white border-gray-400 hover:bg-gray-100 active:bg-gray-200'
              }`}
              onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
              onMouseUp={handleCellMouseUp}
              onTouchStart={(e) => handleCellTouchStart(rowIndex, colIndex, e)}
            >
              {cell.letter}
            </div>
          );
        })
      )}
    </div>
  );

  const renderWordList = () => (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
      <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">
        Kata yang Dicari ({gameState.wordsFound}/{gameState.totalWords})
      </h3>
      <div className="space-y-2">
        {wordList.map((word, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg transition-all ${
              word.found
                ? 'bg-green-100 border-2 border-green-500 line-through'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm md:text-base ${word.found ? 'text-green-700' : 'text-gray-800'}`}>
                {word.word}
              </span>
              {word.found && <span className="text-xl">✓</span>}
            </div>
            <p className="text-xs text-gray-600 mt-1">{word.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {gameState.gameStatus === 'menu' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100 relative flex items-center justify-center">
          <CloudBackground />
          
          <div className="relative z-10 p-4 md:p-6 w-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 md:p-8 shadow-xl">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">🔍 Teka-Teki Kata Kesehatan</h2>
                  <h4 className="font-bold text-base md:text-lg mb-2 md:mb-3 flex items-center">
                    📋 Cara Bermain:
                  </h4>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 shadow-md flex-1 md:flex-none">
                  <div className="text-xs text-gray-600">Hint</div>
                  <div className="text-lg md:text-xl font-bold text-orange-600">{gameState.hintsUsed}/5</div>
                </div>
                  <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-purple-50">
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-300 font-bold">1.</span>
                      <span>Cari kata-kata yang ada di daftar dalam kotak huruf</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-300 font-bold">2.</span>
                      <span>Klik dan drag mouse untuk memilih kata (horizontal, vertikal, atau diagonal)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-300 font-bold">3.</span>
                      <span>Kata yang ditemukan akan berubah warna hijau</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-300 font-bold">4.</span>
                      <span>Temukan semua kata untuk menyelesaikan permainan!</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                  <Button 
                    onClick={startGame}
                    className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black text-base md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transform hover:scale-105 transition-transform"
                  >
                    🚀 Mulai Bermain
                  </Button>
                  <Button 
                    onClick={backToDashboard}
                    variant="secondary"
                    className="w-full md:w-auto px-6 py-3 text-sm md:text-base"
                  >
                    ← Kembali
                  </Button>
                </div>
              </div>
            </div>
          </div>
      )}

      {gameState.gameStatus === 'playing' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100 p-4 md:p-6 relative">
          <CloudBackground />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Game Stats */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Teka-Teki Kata Kesehatan</h2>
              <div className="flex gap-3 flex-wrap">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 shadow-md flex-1 md:flex-none">
                  <div className="text-xs text-gray-600">Score</div>
                  <div className="text-lg md:text-xl font-bold text-purple-600">{gameState.score}</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 shadow-md flex-1 md:flex-none">
                  <div className="text-xs text-gray-600">Kata</div>
                  <div className="text-lg md:text-xl font-bold text-pink-600">
                    {gameState.wordsFound}/{gameState.totalWords}
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 shadow-md flex-1 md:flex-none">
                  <div className="text-xs text-gray-600">Waktu</div>
                  <div className="text-lg md:text-xl font-bold text-blue-600">
                    {formatTime(gameState.timeElapsed)}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Game Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
              {/* Word Search Grid */}
              <div className="lg:col-span-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 text-center">
                  Papan Teka-Teki
                </h3>
                <div className="flex justify-center overflow-x-auto">
                  {renderGrid()}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs md:text-sm text-gray-600">
                    💡 Tips: Klik dan drag untuk memilih kata. Kata bisa horizontal, vertikal, atau diagonal!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-4">
                  <Button 
                    onClick={startGame} 
                    variant="secondary" 
                    size="sm"
                    className="w-full md:w-auto text-xs md:text-sm"
                  >
                    🔄 Reset Game
                  </Button>
                  <Button 
                    onClick={backToDashboard}
                    variant="secondary"
                    className="w-full md:w-auto px-6 py-3 text-sm md:text-base"
                  >
                    ← Kembali
                  </Button>
                </div>
              </div>

              {/* Word List */}
              <div className="lg:col-span-4">
                {renderWordList()}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.gameStatus === 'completed' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100 p-4 md:p-6 relative flex items-center justify-center">
          <CloudBackground />
          
          <div className="relative z-10 w-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">🎉</div>
                <h3 className="text-2xl md:text-3xl font-bold text-purple-600 mb-3 md:mb-4">
                  Luar Biasa! Semua Kata Ditemukan!
                </h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 mb-4 md:mb-6 border-2 border-purple-200">
                  <p className="text-base md:text-lg mb-2">Final Score: {gameState.score}</p>
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    Kamu berhasil menemukan semua {gameState.totalWords} kata dalam waktu {formatTime(gameState.timeElapsed)}!
                  </p>
                  <div className="text-xs md:text-sm text-gray-600 space-y-1">
                    <p>✨ Waktu: {formatTime(gameState.timeElapsed)}</p>
                    <p>⭐ Kata Ditemukan: {gameState.wordsFound}/{gameState.totalWords}</p>
                    <p>🎯 Score: {gameState.score} poin</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                  <Button 
                    onClick={startGame} 
                    className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 text-sm md:text-base"
                  >
                    🔄 Main Lagi
                  </Button>
                  <Button 
                    onClick={backToDashboard}
                    variant="secondary"
                    className="w-full md:w-auto px-6 py-3 text-sm md:text-base"
                  >
                    ← Kembali ke Dashboard
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

export default HealthWordSearch;