/**
 * Game logic for 501 Darts
 */

export type GameMode = 'practice' | '501';

export interface GameState {
  mode: GameMode;
  score: number; // Current score (starts at 501)
  dartsThrown: number; // Darts in current turn
  isBust: boolean; // Whether current turn is a bust
  isGameOver: boolean;
  isWinner: boolean;
}

export const INITIAL_501_SCORE = 501;
export const DARTS_PER_TURN = 3;

/**
 * Check if a score can be checked out (finished) with the remaining points
 */
export function canCheckout(remaining: number): boolean {
  // You can only checkout on doubles from 2 to 40 (double 1 to double 20)
  // Plus the bull (50)
  if (remaining === 50) return true; // Bull
  if (remaining % 2 === 0 && remaining >= 2 && remaining <= 40) return true;
  return false;
}

/**
 * Get checkout suggestion for a given remaining score
 */
export function getCheckoutSuggestion(remaining: number): string | null {
  if (remaining === 50) return "Bull's Eye for the win!";
  if (remaining === 40) return 'Double 20 for the win!';
  if (remaining === 38) return 'Double 19 for the win!';
  if (remaining === 36) return 'Double 18 for the win!';
  if (remaining === 34) return 'Double 17 for the win!';
  if (remaining === 32) return 'Double 16 for the win!';
  if (remaining === 30) return 'Double 15 for the win!';
  if (remaining === 28) return 'Double 14 for the win!';
  if (remaining === 26) return 'Double 13 for the win!';
  if (remaining === 24) return 'Double 12 for the win!';
  if (remaining === 22) return 'Double 11 for the win!';
  if (remaining === 20) return 'Double 10 for the win!';
  if (remaining === 18) return 'Double 9 for the win!';
  if (remaining === 16) return 'Double 8 for the win!';
  if (remaining === 14) return 'Double 7 for the win!';
  if (remaining === 12) return 'Double 6 for the win!';
  if (remaining === 10) return 'Double 5 for the win!';
  if (remaining === 8) return 'Double 4 for the win!';
  if (remaining === 6) return 'Double 3 for the win!';
  if (remaining === 4) return 'Double 2 for the win!';
  if (remaining === 2) return 'Double 1 for the win!';

  // Complex checkouts (combinations)
  if (remaining === 170) return 'T20, T20, Bull';
  if (remaining === 167) return 'T20, T19, Bull';
  if (remaining === 164) return 'T20, T18, Bull';
  if (remaining === 161) return 'T20, T17, Bull';
  if (remaining === 160) return 'T20, T20, D20';
  if (remaining === 158) return 'T20, T20, D19';
  if (remaining === 157) return 'T20, T19, D20';

  // For scores requiring setup
  if (remaining > 50 && remaining <= 100) {
    return 'Leave a double finish!';
  }

  if (remaining > 100 && remaining <= 170) {
    return 'Big scores needed!';
  }

  return null;
}

/**
 * Process a dart throw in 501 mode
 */
export function process501Throw(
  currentState: GameState,
  dartScore: number,
  isDouble: boolean
): GameState {
  const newScore = currentState.score - dartScore;
  const newDartsThrown = currentState.dartsThrown + 1;

  // Check for win (must be exactly 0 and on a double)
  if (newScore === 0 && isDouble) {
    return {
      ...currentState,
      score: 0,
      dartsThrown: newDartsThrown,
      isGameOver: true,
      isWinner: true,
      isBust: false,
    };
  }

  // Check for bust (went below 0, or hit exactly 0 but not on a double, or left with 1)
  // [review this rule - if it's complete]
  if (newScore < 0 || newScore === 1 || (newScore === 0 && !isDouble)) {
    return {
      ...currentState,
      dartsThrown: newDartsThrown,
      isBust: true,
      // Score stays the same (bust means no score change)
    };
  }

  // Valid throw
  return {
    ...currentState,
    score: newScore,
    dartsThrown: newDartsThrown,
    isBust: false,
  };
}

/**
 * Reset turn (after 3 darts or a bust)
 */
export function resetTurn(currentState: GameState): GameState {
  return {
    ...currentState,
    dartsThrown: 0,
    isBust: false,
  };
}

/**
 * Check if turn should end (3 darts thrown or bust)
 */
export function shouldEndTurn(state: GameState): boolean {
  return state.dartsThrown >= DARTS_PER_TURN || state.isBust;
}

/**
 * Start a new 501 game
 */
export function startNew501Game(): GameState {
  return {
    mode: '501',
    score: INITIAL_501_SCORE,
    dartsThrown: 0,
    isBust: false,
    isGameOver: false,
    isWinner: false,
  };
}

/**
 * Start practice mode
 */
export function startPracticeMode(): GameState {
  return {
    mode: 'practice',
    score: 0,
    dartsThrown: 0,
    isBust: false,
    isGameOver: false,
    isWinner: false,
  };
}
