import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import CloudBackground from '../layouts/CloudBackground';
import type { CrosswordClue, PuzzleSet } from '../../utils/crosswordPuzzles';
import {
  getRandomPuzzle,
  getPuzzleById,
  saveCurrentPuzzle,
  getCurrentPuzzleId,
  clearCurrentPuzzle
} from '../../utils/crosswordPuzzles';

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
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    correctAnswers: 0,
    totalClues: 0,
    gameStatus: 'menu',
    hintsUsed: 0
  });

  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleSet | null>(null);
  
  // MODIFIKASI: Array diubah menjadi 15x15
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(15).fill(null).map(() => Array(15).fill(null))
  );

  // Load or create puzzle on mount
  useEffect(() => {
    const savedPuzzleId = getCurrentPuzzleId();
    
    if (savedPuzzleId) {
      const savedPuzzle = getPuzzleById(savedPuzzleId);
      if (savedPuzzle) {
        setCurrentPuzzle(savedPuzzle);
      } else {
        const newPuzzle = getRandomPuzzle();
        setCurrentPuzzle(newPuzzle);
        saveCurrentPuzzle(newPuzzle.id);
      }
    } else {
      const newPuzzle = getRandomPuzzle();
      setCurrentPuzzle(newPuzzle);
      saveCurrentPuzzle(newPuzzle.id);
    }
  }, []);

  const clues: CrosswordClue[] = currentPuzzle?.clues || [];

  // Initialize grid
  const initializeGrid = useCallback(() => {
    // MODIFIKASI: Grid size menjadi 15x15
    const grid: CellData[][] = Array(15).fill(null).map(() =>
      Array(15).fill(null).map(() => ({
        letter: '',
        isBlocked: true,
        userInput: ''
      }))
    );

    clues.forEach(clue => {
      const { answer, direction, startRow, startCol, number } = clue;
      
      for (let i = 0; i < answer.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        
        // MODIFIKASI: Pengecekan batas menjadi < 15
        if (row < 15 && col < 15) {
          grid[row][col] = {
            letter: answer[i],
            isBlocked: false,
            number: i === 0 ? (grid[row][col].number || number) : grid[row][col].number,
            userInput: ''
          };
        }
      }
    });

    return grid;
  }, [clues]);

  const [grid, setGrid] = useState<CellData[][]>(() => initializeGrid());

  useEffect(() => {
    if (currentPuzzle) {
      setGrid(initializeGrid());
      setGameState(prev => ({
        ...prev,
        totalClues: clues.length
      }));
    }
  }, [currentPuzzle, initializeGrid, clues.length]);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlocked) return;

    setSelectedCell({row, col});

    const passingClues = clues.filter(clue => {
      const { direction, startRow, startCol, answer } = clue;
      
      if (direction === 'across') {
        return row === startRow && col >= startCol && col < startCol + answer.length;
      } else {
        return col === startCol && row >= startRow && row < startRow + answer.length;
      }
    });

    if (passingClues.length > 0) {
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

    setTimeout(() => {
      inputRefs.current[row][col]?.focus();
    }, 0);
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value.length > 1) return;
    
    const newGrid = [...grid];
    newGrid[row][col] = {
      ...newGrid[row][col],
      userInput: value.toUpperCase()
    };
    setGrid(newGrid);

    if (value && selectedClue) {
      const clue = clues.find(c => c.id === selectedClue);
      if (clue) {
        const { direction, startRow, startCol, answer } = clue;
        
        let currentIndex: number;
        if (direction === 'across') {
          currentIndex = col - startCol;
        } else {
          currentIndex = row - startRow;
        }
        
        if (currentIndex < answer.length - 1) {
          const nextRow = direction === 'across' ? row : row + 1;
          const nextCol = direction === 'across' ? col + 1 : col;
          
          // MODIFIKASI: Pengecekan batas menjadi < 15
          if (nextRow < 15 && nextCol < 15 && !grid[nextRow][nextCol].isBlocked) {
            setSelectedCell({row: nextRow, col: nextCol});
            setTimeout(() => {
              inputRefs.current[nextRow][nextCol]?.focus();
            }, 0);
          }
        }
      }
    }

    checkWordCompletion();
  };

  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!selectedClue) return;
    
    const clue = clues.find(c => c.id === selectedClue);
    if (!clue) return;
    
    const { direction, startRow, startCol, answer } = clue;
    
    if (e.key === 'Backspace') {
      if (!grid[row][col].userInput) {
        let currentIndex: number;
        if (direction === 'across') {
          currentIndex = col - startCol;
        } else {
          currentIndex = row - startRow;
        }
        
        if (currentIndex > 0) {
          const prevRow = direction === 'across' ? row : row - 1;
          const prevCol = direction === 'across' ? col - 1 : col;
          
          if (prevRow >= 0 && prevCol >= 0 && !grid[prevRow][prevCol].isBlocked) {
            const newGrid = [...grid];
            newGrid[prevRow][prevCol] = {
              ...newGrid[prevRow][prevCol],
              userInput: ''
            };
            setGrid(newGrid);
            
            setSelectedCell({row: prevRow, col: prevCol});
            setTimeout(() => {
              inputRefs.current[prevRow][prevCol]?.focus();
            }, 0);
            e.preventDefault();
          }
        }
      }
    }
    
    if (e.key === 'ArrowRight' && direction === 'across') {
      const currentIndex = col - startCol;
      if (currentIndex < answer.length - 1) {
        const nextCol = col + 1;
        setSelectedCell({row, col: nextCol});
        setTimeout(() => {
          inputRefs.current[row][nextCol]?.focus();
        }, 0);
        e.preventDefault();
      }
    }
    
    if (e.key === 'ArrowLeft' && direction === 'across') {
      const currentIndex = col - startCol;
      if (currentIndex > 0) {
        const prevCol = col - 1;
        setSelectedCell({row, col: prevCol});
        setTimeout(() => {
          inputRefs.current[row][prevCol]?.focus();
        }, 0);
        e.preventDefault();
      }
    }
    
    if (e.key === 'ArrowDown' && direction === 'down') {
      const currentIndex = row - startRow;
      if (currentIndex < answer.length - 1) {
        const nextRow = row + 1;
        setSelectedCell({row: nextRow, col});
        setTimeout(() => {
          inputRefs.current[nextRow][col]?.focus();
        }, 0);
        e.preventDefault();
      }
    }
    
    if (e.key === 'ArrowUp' && direction === 'down') {
      const currentIndex = row - startRow;
      if (currentIndex > 0) {
        const prevRow = row - 1;
        setSelectedCell({row: prevRow, col});
        setTimeout(() => {
          inputRefs.current[prevRow][col]?.focus();
        }, 0);
        e.preventDefault();
      }
    }
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

  const backToDashboard = () => {
    clearCurrentPuzzle();
    navigate('/gamehome');
  };

  const backToGameHome = () => {
    clearCurrentPuzzle();
    navigate('/gamehome');
  };

  const resetGame = () => {
    clearCurrentPuzzle();
    const newPuzzle = getRandomPuzzle();
    setCurrentPuzzle(newPuzzle);
    saveCurrentPuzzle(newPuzzle.id);
    
    setGameState(prev => ({
      ...prev,
      gameStatus: 'menu'
    }));
    setSelectedClue(null);
  };

  const playAgain = () => {
    clearCurrentPuzzle();
    const newPuzzle = getRandomPuzzle();
    setCurrentPuzzle(newPuzzle);
    saveCurrentPuzzle(newPuzzle.id);
    
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      score: 0,
      correctAnswers: 0,
      hintsUsed: 0
    }));
    setSelectedClue(null);
  };

  const getCellHighlight = (row: number, col: number) => {
    if (!selectedClue) return '';
    
    const clue = clues.find(c => c.id === selectedClue);
    if (!clue) return '';

    const { direction, startRow, startCol, answer } = clue;
    
    const isCurrentCell = selectedCell?.row === row && selectedCell?.col === col;
    
    if (direction === 'across') {
      if (row === startRow && col >= startCol && col < startCol + answer.length) {
        return isCurrentCell 
          ? 'bg-green-300 border-green-500 ring-2 ring-green-400' 
          : 'bg-green-200 border-green-400';
      }
    } else {
      if (col === startCol && row >= startRow && row < startRow + answer.length) {
        return isCurrentCell 
          ? 'bg-green-300 border-green-500 ring-2 ring-green-400' 
          : 'bg-green-200 border-green-400';
      }
    }
    
    return '';
  };

  const renderGrid = () => (
    <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-0.5 md:gap-1 bg-gray-300 p-2 md:p-4 rounded-xl md:rounded-2xl overflow-x-auto w-full max-w-full">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`aspect-square w-full border-2 flex items-center justify-center text-xs md:text-sm font-bold cursor-pointer transition-all relative ${
              cell.isBlocked
                ? 'bg-gray-700'
                : `bg-white border-gray-400 hover:border-green-300 ${getCellHighlight(rowIndex, colIndex)}`
            }`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {!cell.isBlocked && (
              <>
                {cell.number && (
                  <div className="absolute text-[6px] md:text-[8px] text-green-600 font-bold top-0 left-0.5 leading-none">
                    {cell.number}
                  </div>
                )}
                <input
                  type="text"
                  ref={(el) => {
                    inputRefs.current[rowIndex][colIndex] = el;
                  }}
                  value={cell.userInput}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                  className="w-full h-full text-center border-none outline-none bg-transparent text-[10px] sm:text-xs md:text-sm font-bold text-gray-800 p-0"
                  maxLength={1}
                />
              </>
            )}
          </div>
        ))
      )}
    </div>
  );

  const selectClueAndFocus = (clue: CrosswordClue) => {
    setSelectedClue(clue.id);
    setSelectedDirection(clue.direction);
    setSelectedCell({row: clue.startRow, col: clue.startCol});
    
    setTimeout(() => {
      inputRefs.current[clue.startRow][clue.startCol]?.focus();
    }, 0);
  };

  const renderClues = () => (
    <div className="space-y-3 md:space-y-4">
      <div>
        <h4 className="font-bold text-base md:text-lg mb-2 md:mb-3 text-gray-800 flex items-center">
          <span className="text-green-500 mr-2">→</span> Mendatar
        </h4>
        <div className="space-y-1.5 md:space-y-2">
          {clues
            .filter(clue => clue.direction === 'across')
            .sort((a, b) => a.number - b.number)
            .map(clue => (
              <div
                key={clue.id}
                className={`p-2 md:p-3 rounded-lg cursor-pointer transition-all ${
                  selectedClue === clue.id 
                    ? 'bg-green-100 border-2 border-green-400' 
                    : 'bg-green-50 hover:bg-green-100 border border-gray-200'
                }`}
                onClick={() => selectClueAndFocus(clue)}
              >
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    {clue.number}
                  </div>
                  <span className="text-xs md:text-sm text-gray-700">{clue.clue}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h4 className="font-bold text-base md:text-lg mb-2 md:mb-3 text-gray-800 flex items-center">
          <span className="text-emerald-500 mr-2">↓</span> Menurun
        </h4>
        <div className="space-y-1.5 md:space-y-2">
          {clues
            .filter(clue => clue.direction === 'down')
            .sort((a, b) => a.number - b.number)
            .map(clue => (
              <div
                key={clue.id}
                className={`p-2 md:p-3 rounded-lg cursor-pointer transition-all ${
                  selectedClue === clue.id 
                    ? 'bg-green-100 border-2 border-green-400' 
                    : 'bg-green-50 hover:bg-green-100 border border-gray-200'
                }`}
                onClick={() => selectClueAndFocus(clue)}
              >
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-emerald-500 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    {clue.number}
                  </div>
                  <span className="text-xs md:text-sm text-gray-700">{clue.clue}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {!currentPuzzle && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative flex items-center justify-center">
          <CloudBackground />
          <div className="relative z-10 text-center">
            <div className="text-4xl mb-4 animate-bounce">🧩</div>
            <p className="text-lg text-gray-600">Memuat soal...</p>
          </div>
        </div>
      )}

      {currentPuzzle && gameState.gameStatus === 'menu' && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative flex items-center justify-center">
          <CloudBackground />
          
          <div className="relative z-10 p-4 md:p-6 w-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 md:p-8 shadow-xl">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">🧩 Teka-Teki Silang Kesehatan</h2>
                <p className="text-sm md:text-lg mb-2">
                  Asah pengetahuanmu dengan teka-teki yang menantang!
                </p>
                {currentPuzzle && (
                  <p className="text-xs md:text-sm mb-4 md:mb-6 bg-white/20 rounded-lg px-3 py-1 inline-block">
                    📚 Tema: {currentPuzzle.title}
                  </p>
                )}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-4 md:mb-6 text-left">
                  <h4 className="font-bold text-base md:text-lg mb-2 md:mb-3 flex items-center">
                    <span className="text-pink-300 mr-2">🎯</span> Cara Bermain:
                  </h4>
                  <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-green-50">
                    <li className="flex items-start">
                      <span className="mr-2">🖱️</span>
                      <span>Klik pada kotak putih untuk memilih kata</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">⌨️</span>
                      <span>Ketik huruf untuk mengisi kotak</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">📝</span>
                      <span>Baca petunjuk untuk mengetahui jawabannya</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">💡</span>
                      <span>Gunakan tombol hint jika kesulitan (maksimal 3 kali)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🏆</span>
                      <span>Setiap kata benar memberikan 10 poin</span>
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
                    ← Back to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPuzzle && gameState.gameStatus === 'playing' && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4 md:p-6 relative">
          <CloudBackground />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Teka-Teki Silang Kesehatan</h2>
                {currentPuzzle && (
                  <p className="text-sm text-gray-600">📚 {currentPuzzle.title}</p>
                )}
              </div>
              <div className="flex gap-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 shadow-md flex-1 md:flex-none">
                  <div className="text-xs text-gray-600">Score</div>
                  <div className="text-lg md:text-xl font-bold text-green-600">{gameState.score}</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 shadow-md flex-1 md:flex-none">
                  <div className="text-xs text-gray-600">Selesai</div>
                  <div className="text-lg md:text-xl font-bold text-emerald-600">{gameState.correctAnswers}/{gameState.totalClues}</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 shadow-md flex-1 md:flex-none">
                  <div className="text-xs text-gray-600">Hint</div>
                  <div className="text-lg md:text-xl font-bold text-orange-600">{gameState.hintsUsed}/3</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
              <div className="lg:col-span-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 text-center">Papan Teka-Teki</h3>
                <div className="flex justify-center mb-4">
                  {renderGrid()}
                </div>
                {selectedClue && (
                  <div className="mt-3 md:mt-4 p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs md:text-sm font-semibold text-green-800 mb-1">
                      Terpilih: {clues.find(c => c.id === selectedClue)?.number} {selectedDirection === 'across' ? 'Mendatar' : 'Menurun'}
                    </div>
                    <div className="text-xs md:text-sm text-green-700">
                      {clues.find(c => c.id === selectedClue)?.clue}
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-4">
                  <Button 
                    onClick={getHint} 
                    variant="secondary" 
                    size="sm"
                    disabled={!selectedClue || gameState.hintsUsed >= 3}
                    className="w-full md:w-auto flex items-center justify-center space-x-2 text-xs md:text-sm"
                  >
                    <span>💡</span>
                    <span>Hint</span>
                  </Button>
                  <Button 
                    onClick={clearGrid} 
                    variant="secondary" 
                    size="sm"
                    className="w-full md:w-auto text-xs md:text-sm"
                  >
                    🗑️ Clear
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

              <div className="lg:col-span-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg max-h-[600px] overflow-y-auto">
                  {renderClues()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPuzzle && gameState.gameStatus === 'completed' && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4 md:p-6 relative flex items-center justify-center">
          <CloudBackground />
          
          <div className="relative z-10 w-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">🏆</div>
                <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-3 md:mb-4">Selamat! Kamu Berhasil!</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 mb-4 md:mb-6 border-2 border-green-200">
                  <p className="text-base md:text-lg mb-2">Final Score: <span className="font-bold text-green-600">{gameState.score}</span></p>
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    Kamu berhasil menyelesaikan semua {gameState.totalClues} kata dengan menggunakan {gameState.hintsUsed} hint!
                  </p>
                  <div className="text-xs md:text-sm text-gray-600 space-y-1">
                    <p className="font-semibold">💡 Pengetahuan kesehatan yang sudah kamu pelajari:</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {clues.map(clue => (
                        <span key={clue.id} className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700 border border-green-200">
                          {clue.answer}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                  <Button 
                    onClick={playAgain} 
                    className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 text-sm md:text-base"
                  >
                    🔄 Main Lagi (Soal Baru)
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

export default HealthCrossword;