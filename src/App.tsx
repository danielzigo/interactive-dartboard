import { useState } from 'react';
import {
  type GameState,
  startPracticeMode,
  startNew501Game,
  process501Throw,
  resetTurn,
  shouldEndTurn,
  getCheckoutSuggestion,
} from './lib/game-logic';

// Components
import { Header } from '~/components/Header';
import { GameModeToggle } from '~/components/GameModeToggle';
import { DimensionsToggle } from '~/components/DimensionsToggle';
import { ResetGameButton } from '~/components/ResetGameButton';
import { DartboardStage } from '~/components/DartboardStage';
import { DimensionsPanel } from '~/components/DimensionsPanel';
import { Game501ScoreCard, PracticeScoreCard } from './components/ScoreCards';
import { RecentThrows } from './components/RecentThrows';
import { Footer } from './components/Footer';
import { ScorePopup } from './components/ScorePopup';

import type { DartThrow } from './components/RecentThrows';

// Interface for popup state
interface Popup extends DartThrow {
  id: number;
  x: number;
  y: number;
}

function App() {
  const [throws, setThrows] = useState<DartThrow[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);

  // Load game mode from localStorage or default to practice
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedMode = localStorage.getItem('dartboard-game-mode') as '501' | 'practice' | null;
    if (savedMode === '501') {
      return startNew501Game();
    }
    return startPracticeMode();
  });

  // Dartboard dimensions - same as in Dartboard component
  const width = 600;
  const height = 600;
  const scale = Math.min(width, height) / (225.5 * 2.25); // Match Dartboard scale

  const handleDartThrow = (result: DartThrow) => {
    setThrows((prev) => [...prev, result]);

    // Create popup for this throw
    const popup: Popup = {
      ...result,
      id: Date.now(),
      x: width / 2, // Center of dartboard (we'll enhance positioning later)
      y: height / 2 - 50, // Slightly above center
    };
    setPopups((prev) => [...prev, popup]);

    if (gameState.mode === 'practice') {
      // Practice mode - just accumulate score
      setTotalScore((prev) => prev + result.score);
    } else if (gameState.mode === '501') {
      // 501 mode - process according to rules
      const isDouble = result.multiplier === 2;
      const newState = process501Throw(gameState, result.score, isDouble);
      setGameState(newState);

      // Check if turn should end
      if (shouldEndTurn(newState)) {
        if (newState.isBust) {
          // Show bust message briefly, then reset turn
          setTimeout(() => {
            setGameState(resetTurn(newState));
          }, 1500);
        } else if (newState.dartsThrown >= 3 && !newState.isGameOver) {
          // Turn complete, reset for next turn
          setTimeout(() => {
            setGameState(resetTurn(newState));
          }, 500);
        }
      }
    }
  };

  // Remove popup when animation completes
  const handlePopupComplete = (id: number) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  const switchToGameMode = (mode: '501' | 'practice') => {
    // Save mode to localStorage so it persists across reload
    localStorage.setItem('dartboard-game-mode', mode);

    if (mode === '501') {
      setGameState(startNew501Game());
    } else {
      setGameState(startPracticeMode());
      setTotalScore(0);
    }
    setThrows([]);
    // Reload to clear darts from board
    window.location.reload();
  };

  const resetGame = () => {
    if (gameState.mode === '501') {
      setGameState(startNew501Game());
    } else {
      setTotalScore(0);
    }
    setThrows([]);
    window.location.reload();
  };

  // Get checkout suggestion for 501 mode
  const checkoutSuggestion =
    gameState.mode === '501' && !gameState.isGameOver
      ? getCheckoutSuggestion(gameState.score)
      : null;

  return (
    <div className="app">
      <Header
        icon="🎯"
        title="Let's Play Darts"
        subtitle="Click anywhere on the dartboard to throw a dart"
        actions={
          <>
            {/* Practice + 501 (uses your existing <Button>) */}
            <GameModeToggle mode={gameState.mode} onChange={switchToGameMode} />

            {/* ✅ This is the Dimensions/Debug toggle — lives inside header-buttons */}
            <DimensionsToggle active={debugMode} onToggle={() => setDebugMode(!debugMode)} />
          </>
        }
      />

      {debugMode && <DimensionsPanel scale={scale} />}

      <div className="game-container">
        <DartboardStage
          width={width}
          height={height}
          scale={scale}
          debug={debugMode}
          onThrow={handleDartThrow}
        >
          {/* Render score popups */}
          {popups.map((popup) => (
            <ScorePopup
              key={popup.id}
              score={popup.score}
              description={popup.description}
              region={popup.region}
              onComplete={() => handlePopupComplete(popup.id)}
            />
          ))}
        </DartboardStage>

        <div className="score-panel">
          {gameState.mode === 'practice' ? (
            <PracticeScoreCard total={totalScore} throwsCount={throws.length} />
          ) : (
            <Game501ScoreCard
              score={gameState.score}
              dartsThisTurn={gameState.dartsThrown}
              isBust={gameState.isBust}
              isGameOver={gameState.isGameOver}
              isWinner={gameState.isWinner}
              checkoutSuggestion={checkoutSuggestion}
            />
          )}

          <RecentThrows throws={throws} />
          <ResetGameButton onReset={resetGame} />
        </div>
      </div>

      <Footer>
        <div className="flex items-center gap-4">
          <span className="text-3xl">🎯</span>
          <p>Built with React + TypeScript + Canvas API</p>
        </div>

        <p>&copy; {new Date().getFullYear()} ShyDeveloper</p>
      </Footer>
    </div>
  );
}

export default App;
