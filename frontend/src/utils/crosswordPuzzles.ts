// Crossword puzzles data untuk edukasi kesehatan anak
// Setiap puzzle dirancang dengan penomoran berurutan 1-8

export interface CrosswordClue {
  id: number;
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
}

export interface PuzzleSet {
  id: string;
  title: string;
  clues: CrosswordClue[];
}

// Koleksi puzzle kesehatan untuk anak-anak
// SEMUA PUZZLE SUDAH DIVERIFIKASI 100% BENAR!
// Setiap huruf persimpangan antara mendatar dan menurun PASTI COCOK!
const puzzles: PuzzleSet[] = [
  // PUZZLE SET 1 - Kesehatan Reproduksi Remaja
  {
    id: 'puzzle-reproduksi-1',
    title: 'Kesehatan Reproduksi Remaja',
    clues: [
      // --- MENDATAR (ACROSS) - 4 soal ---
      {
        id: 1,
        number: 1,
        clue: 'Masa peralihan dari anak menuju dewasa disebut masa…',
        answer: 'REMAJA',
        direction: 'across',
        startRow: 3,
        startCol: 2
      },
      {
        id: 2,
        number: 2,
        clue: 'Kondisi ketika remaja sulit mengontrol dorongan karena dilakukan berulang-ulang disebut…',
        answer: 'KECANDUAN',
        direction: 'down',
        startRow: 2,
        startCol: 3
      },
      {
        id: 3,
        number: 3,
        clue: 'Perilaku seksual dengan sentuhan area sensitif secara intens disebut…',
        answer: 'PETTING',
        direction: 'down',
        startRow: 7,
        startCol: 9
      },
      {
        id: 4,
        number: 4,
        clue: 'Masa dimana remaja mengalami perubahan hormon yang signifikan disebut masa…',
        answer: 'PUBERTAS',
        direction: 'across',
        startRow: 8,
        startCol: 6
      },

      // --- MENURUN (DOWN) - 3 soal ---
      {
        id: 5,
        number: 5,
        clue: 'Perubahan suara menjadi lebih berat pada remaja laki-laki ditandai dengan tumbuhnya…',
        answer: 'JAKUN',
        direction: 'down',
        startRow: 2,
        startCol: 7
      },
      {
        id: 6,
        number: 6,
        clue: 'Hubungan seksual melalui anus disebut seks…',
        answer: 'ANAL',
        direction: 'across',
        startRow: 6,
        startCol: 2
      },
      {
        id: 7,
        number: 7,
        clue: 'Media yang sering menampilkan konten seksual berlebihan adalah…',
        answer: 'INTERNET',
        direction: 'across',
        startRow: 10,
        startCol: 2
      }
    ]
  },

  // PUZZLE SET 2 - Perilaku Seksual Remaja
  {
    id: 'puzzle-perilaku-seksual-2',
    title: 'Perilaku Seksual Remaja',
    clues: [
      // --- MENDATAR (ACROSS) - 4 soal ---
      {
        id: 1,
        number: 1,
        clue: 'Perilaku berpacaran dengan sentuhan ringan seperti berpegangan tangan disebut…',
        answer: 'TOUCHING',
        direction: 'across',
        startRow: 3,
        startCol: 2
      },
      {
        id: 2,
        number: 2,
        clue: 'Ciuman yang dapat meningkatkan hasrat seksual remaja disebut…',
        answer: 'KISSING',
        direction: 'across',
        startRow: 6,
        startCol: 8
      },
      {
        id: 3,
        number: 3,
        clue: 'Perilaku seksual dengan fokus pada area leher hingga dada disebut…',
        answer: 'NECKING',
        direction: 'down',
        startRow: 3,
        startCol: 8
      },

      
      // --- MENURUN (DOWN) - 3 soal ---
      {
        id: 4,
        number: 4,
        clue: 'Perilaku seksual yang melibatkan mulut dan alat kelamin disebut seks…',
        answer: 'ORAL',
        direction: 'down',
        startRow: 8,
        startCol: 5
      },
      {
        id: 5,
        number: 5,
        clue: 'Faktor pendorong perilaku seksual yang berasal dari lingkungan pergaulan disebut pengaruh…',
        answer: 'TEMAN',
        direction: 'down',
        startRow: 3,
        startCol: 2
      },
      {
        id: 6,
        number: 6,
        clue: 'Materi visual atau audio yang membangkitkan hasrat seksual disebut…',
        answer: 'PORNOGRAFI',
        direction: 'across',
        startRow: 9,
        startCol: 3
      }
    ]
  },

  // PUZZLE SET 3 - Kesehatan Mental & Fisik
  {
    id: 'puzzle-kesehatan-mental-3',
    title: 'Kesehatan Mental & Fisik Remaja',
    clues: [
      // --- MENDATAR (ACROSS) - 4 soal ---
      {
        id: 1,
        number: 1,
        clue: 'Masa dimana remaja mengalami perubahan hormon yang signifikan disebut masa…',
        answer: 'PUBERTAS',
        direction: 'across',
        startRow: 2,
        startCol: 1
      },
      {
        id: 2,
        number: 2,
        clue: 'Organ reproduksi wanita yang menjadi tempat berkembangnya janin adalah…',
        answer: 'RAHIM',
        direction: 'down',
        startRow: 2,
        startCol: 5
      },
      {
        id: 3,
        number: 3,
        clue: 'Masa peralihan dari anak menuju dewasa siebut masa…',
        answer: 'REMAJA',
        direction: 'across',
        startRow: 6,
        startCol: 3,
      },
      {
        id: 4,
        number: 4,
        clue: 'Virus yang menyerang sistem kekebalan tubuh manusia disebut…',
        answer: 'HIV',
        direction: 'across',
        startRow: 4,
        startCol: 5
      },
      {
        id: 5,
        number: 5,
        clue: 'Hubungan seksual melalui anus disebut…',
        answer: 'ANAL',
        direction: 'down',
        startRow: 6,
        startCol: 8
      },
      {
        id: 6,
        number: 6,
        clue: 'Upaya pemberitahuan informasi yang benar tentang kesehatan reproduksi disebut pendidikan…',
        answer: 'SEKSUAL',
        direction: 'across',
        startRow: 9,
        startCol: 1       
      }
    ]
  }
];

const STORAGE_KEY = 'currentCrosswordPuzzleId';

/**
 * Get a random puzzle from the collection
 */
export function getRandomPuzzle(): PuzzleSet {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

/**
 * Get a puzzle by its ID
 */
export function getPuzzleById(id: string): PuzzleSet | undefined {
  return puzzles.find(puzzle => puzzle.id === id);
}

/**
 * Save the current puzzle ID to localStorage
 */
export function saveCurrentPuzzle(puzzleId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, puzzleId);
  } catch (error) {
    console.error('Failed to save puzzle ID to localStorage:', error);
  }
}

/**
 * Get the current puzzle ID from localStorage
 */
export function getCurrentPuzzleId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to get puzzle ID from localStorage:', error);
    return null;
  }
}

/**
 * Clear the current puzzle from localStorage
 */
export function clearCurrentPuzzle(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear puzzle ID from localStorage:', error);
  }
}

/**
 * Get all available puzzles
 */
export function getAllPuzzles(): PuzzleSet[] {
  return puzzles;
}

/**
 * Get the total number of puzzles available
 */
export function getPuzzleCount(): number {
  return puzzles.length;
}
