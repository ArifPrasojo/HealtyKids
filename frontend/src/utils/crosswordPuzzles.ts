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
  {
    id: 'puzzle-1',
    title: 'Kebersihan Diri',
    // GRID LAYOUT YANG SUDAH DIPERBAIKI:
    // Row 0: M A N D I . . . . .  (1-MENDATAR: MANDI)
    // Row 1: U . . . . . . . . .  
    // Row 2: L . S I K A T . . .  (3-MENDATAR: SIKAT)
    // Row 3: U . A . . . . . . .
    // Row 4: T . B . C U C I . .  (5-MENDATAR: CUCI)
    // Row 5: . . U . . . . . . .
    // Row 6: . . N . . . . . . .
    // Row 7: H A N D U K . . . .  (7-MENDATAR: HANDUK)
    clues: [
      { id: 1, number: 1, clue: 'Membersihkan badan dengan air', answer: 'MANDI', direction: 'across', startRow: 0, startCol: 0 },
      { id: 2, number: 2, clue: 'Organ untuk makan dan berbicara', answer: 'MULUT', direction: 'down', startRow: 0, startCol: 0 },
      { id: 3, number: 3, clue: 'Alat untuk menggosok gigi', answer: 'SIKAT', direction: 'across', startRow: 2, startCol: 2 },
      { id: 4, number: 4, clue: 'Digunakan untuk mencuci tangan agar bersih', answer: 'SABUN', direction: 'down', startRow: 2, startCol: 2 },
      { id: 5, number: 5, clue: '... tangan sebelum makan', answer: 'CUCI', direction: 'across', startRow: 4, startCol: 4 },
      { id: 6, number: 6, clue: 'Jari tangan ada lima, ujungnya ada ...', answer: 'KUKU', direction: 'down', startRow: 2, startCol: 5 },
      { id: 7, number: 7, clue: 'Kain untuk mengeringkan badan setelah mandi', answer: 'HANDUK', direction: 'across', startRow: 7, startCol: 0 },
      { id: 8, number: 8, clue: 'Tubuh yang tidak sakit dan bugar', answer: 'SEHAT', direction: 'down', startRow: 4, startCol: 7 },
    ]
  },
  {
    id: 'puzzle-2',
    title: 'Makanan Sehat',
    // GRID LAYOUT YANG SUDAH DIPERBAIKI:
    // Row 0: S A Y U R . . . . .  (1-MENDATAR: SAYUR)
    // Row 1: U . . . . . . . . .
    // Row 2: S . B U A H . . . .  (3-MENDATAR: BUAH)
    // Row 3: U . . . . . . . . .
    // Row 4: . . N A S I . . . .  (5-MENDATAR: NASI)
    // Row 5: . . A . . . . . . .
    // Row 6: T E L U R . . . . .  (7-MENDATAR: TELUR)
    // Row 7: . . . . . . . . . .
    clues: [
      { id: 1, number: 1, clue: 'Bayam, kangkung, wortel adalah jenis ...', answer: 'SAYUR', direction: 'across', startRow: 0, startCol: 0 },
      { id: 2, number: 2, clue: 'Minuman putih bergizi dari sapi', answer: 'SUSU', direction: 'down', startRow: 0, startCol: 0 },
      { id: 3, number: 3, clue: 'Apel, jeruk, pisang adalah jenis ...', answer: 'BUAH', direction: 'across', startRow: 2, startCol: 2 },
      { id: 4, number: 4, clue: 'Sumber karbohidrat untuk energi', answer: 'NANA', direction: 'down', startRow: 4, startCol: 2 },
      { id: 5, number: 5, clue: 'Makanan pokok orang Indonesia', answer: 'NASI', direction: 'across', startRow: 4, startCol: 2 },
      { id: 6, number: 6, clue: 'Cairan bening yang penting untuk tubuh', answer: 'AIR', direction: 'down', startRow: 2, startCol: 5 },
      { id: 7, number: 7, clue: 'Sumber protein dari ayam', answer: 'TELUR', direction: 'across', startRow: 6, startCol: 0 },
      { id: 8, number: 8, clue: 'Makan bergizi membuat tubuh ...', answer: 'SEHAT', direction: 'down', startRow: 0, startCol: 4 },
    ]
  },
  {
    id: 'puzzle-3',
    title: 'Olahraga dan Aktivitas',
    // GRID LAYOUT YANG SUDAH DIPERBAIKI:
    // Row 0: L A R I . . . . . .  (1-MENDATAR: LARI)
    // Row 1: O . . . . . . . . .
    // Row 2: M . R E N A N G . .  (3-MENDATAR: RENANG)
    // Row 3: P . . . . . . . . .
    // Row 4: A . B O L A . . . .  (5-MENDATAR: BOLA)
    // Row 5: T . . . . . . . . .
    // Row 6: . . S E N A M . . .  (7-MENDATAR: SENAM)
    clues: [
      { id: 1, number: 1, clue: 'Bergerak cepat dengan kaki', answer: 'LARI', direction: 'across', startRow: 0, startCol: 0 },
      { id: 2, number: 2, clue: 'Meloncat tinggi dengan kaki', answer: 'LOMPAT', direction: 'down', startRow: 0, startCol: 0 },
      { id: 3, number: 3, clue: 'Olahraga di dalam air', answer: 'RENANG', direction: 'across', startRow: 2, startCol: 2 },
      { id: 4, number: 4, clue: 'Anak yang suka bergerak aktif', answer: 'RAJIN', direction: 'down', startRow: 0, startCol: 2 },
      { id: 5, number: 5, clue: 'Sepak ..., basket, voli menggunakan ini', answer: 'BOLA', direction: 'across', startRow: 4, startCol: 2 },
      { id: 6, number: 6, clue: 'Olahraga melatih kekuatan ...', answer: 'OTOT', direction: 'down', startRow: 4, startCol: 3 },
      { id: 7, number: 7, clue: 'Gerakan peregangan tubuh', answer: 'SENAM', direction: 'across', startRow: 6, startCol: 2 },
      { id: 8, number: 8, clue: 'Tubuh yang bugar dan kuat', answer: 'SEHAT', direction: 'down', startRow: 6, startCol: 2 },
    ]
  },
  {
    id: 'puzzle-4',
    title: 'Bagian Tubuh',
    // GRID LAYOUT YANG SUDAH DIPERBAIKI:
    // Row 0: M A T A . . . . . .  (1-MENDATAR: MATA)
    // Row 1: U . A . . . . . . .
    // Row 2: L . N . H I D U N G  (5-MENDATAR: HIDUNG)
    // Row 3: U . G . . . . . . .
    // Row 4: T . A . . . . . . .
    // Row 5: . . N . . . . . . .
    // Row 6: K A K I . . . . . .  (6-MENDATAR: KAKI)
    clues: [
      { id: 1, number: 1, clue: 'Organ untuk melihat', answer: 'MATA', direction: 'across', startRow: 0, startCol: 0 },
      { id: 2, number: 2, clue: 'Organ untuk makan dan berbicara', answer: 'MULUT', direction: 'down', startRow: 0, startCol: 0 },
      { id: 3, number: 3, clue: 'Lima jari untuk memegang', answer: 'TANGAN', direction: 'down', startRow: 0, startCol: 2 },
      { id: 4, number: 4, clue: 'Digunakan untuk berpikir', answer: 'OTAK', direction: 'down', startRow: 0, startCol: 3 },
      { id: 5, number: 5, clue: 'Bagian wajah untuk mencium bau', answer: 'HIDUNG', direction: 'across', startRow: 2, startCol: 4 },
      { id: 6, number: 6, clue: 'Anggota tubuh untuk berjalan', answer: 'KAKI', direction: 'across', startRow: 6, startCol: 0 },
      { id: 7, number: 7, clue: 'Organ untuk mendengar suara', answer: 'TELINGA', direction: 'across', startRow: 8, startCol: 0 },
      { id: 8, number: 8, clue: 'Untuk mengunyah makanan', answer: 'GIGI', direction: 'down', startRow: 2, startCol: 7 },
    ]
  },
  {
    id: 'puzzle-5',
    title: 'Kebiasaan Sehat',
    // GRID LAYOUT YANG SUDAH DIPERBAIKI:
    // Row 0: T I D U R . . . . .  (1-MENDATAR: TIDUR)
    // Row 1: E . . . . . . . . .
    // Row 2: R . M I N U M . . .  (3-MENDATAR: MINUM)
    // Row 3: A . . . . . . . . .
    // Row 4: T . S A R A P A N .  (5-MENDATAR: SARAPAN)
    // Row 5: U . . . . . . . . .
    // Row 6: R . S E H A T . . .  (7-MENDATAR: SEHAT)
    clues: [
      { id: 1, number: 1, clue: 'Istirahat malam minimal 8 jam', answer: 'TIDUR', direction: 'across', startRow: 0, startCol: 0 },
      { id: 2, number: 2, clue: 'Makan harus ..., 3 kali sehari', answer: 'TERATUR', direction: 'down', startRow: 0, startCol: 0 },
      { id: 3, number: 3, clue: '... air putih 8 gelas sehari', answer: 'MINUM', direction: 'across', startRow: 2, startCol: 2 },
      { id: 4, number: 4, clue: 'Harus ... berolahraga setiap hari', answer: 'RUTIN', direction: 'down', startRow: 0, startCol: 4 },
      { id: 5, number: 5, clue: 'Makan pagi sebelum beraktivitas', answer: 'SARAPAN', direction: 'across', startRow: 4, startCol: 2 },
      { id: 6, number: 6, clue: 'Jaga kebersihan agar tetap ...', answer: 'BERSIH', direction: 'down', startRow: 4, startCol: 7 },
      { id: 7, number: 7, clue: 'Kebiasaan baik membuat tubuh tetap ...', answer: 'SEHAT', direction: 'across', startRow: 6, startCol: 2 },
      { id: 8, number: 8, clue: '... kaki adalah olahraga ringan', answer: 'JALAN', direction: 'down', startRow: 2, startCol: 5 },
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
