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
import type { DartThrow } from '~/components/RecentThrows';

// Components
import { Header } from '~/components/Header';
import { GameModeToggle } from '~/components/GameModeToggle';
import { DimensionsToggle } from '~/components/DimensionsToggle';
import { ResetGameButton } from '~/components/ResetGameButton';
import { DartboardStage } from '~/components/DartboardStage';
import { DimensionsPanel } from '~/components/DimensionsPanel';
import { Game501ScoreCard, PracticeScoreCard } from '~/components/ScoreCards';
import { RecentThrows } from '~/components/RecentThrows';
import { Footer } from '~/components/Footer';
import { ScorePopup } from '~/components/ScorePopup';
import { Celebration180 } from '~/components/Celebration180';
import { DartboardInfo } from '~/components/DartboardInfo';

import logoImage from '/shydeveloper-logo.svg';

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
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [show180Celebration, setShow180Celebration] = useState(false);
  const [last180Index, setLast180Index] = useState<number>(-1); // Track when we last showed 180

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
    // No more throws allowed if 501 game is over
    if (gameState.mode === '501' && gameState.isGameOver) {
      return; // Early exit - ignore this throw
    }

    setThrows((prev) => {
      const newThrows = [...prev, result];
      const currentIndex = newThrows.length - 1;

      // Check for 180 celebration:
      // - We need at least 3 throws total
      // - The last 3 consecutive throws must sum up to 180 (i.e. 3 x triple 20)
      // - The current throw must be at least 3 throws after the last 180 celebration
      //   (to prevent showing 180 multiple times for overlapping throws)
      //
      // Example:
      // Throws: [60, 60, 60, 60] - indices 0,1,2,3 (triple 20 each)
      // After throw at index 2: sum of [60,60,60] = 180 ✓ (we celebrate, and set last180Index = 2)
      // After throw at index 3: sum of [60,60,60] = 180 but currentIndex (3) < (last180Index (2) + 3)... or this is just one throw since last celebration
      // So we DON'T celebrate again at this point, until all conditions are met.
      if (newThrows.length >= 3 && currentIndex >= last180Index + 3) {
        // Get the last 3 throws and check if they sum to 180
        const lastThree = newThrows.slice(-3);
        const sum = lastThree.reduce((acc, t) => acc + t.score, 0);

        if (sum === 180) {
          // Trigger 180 celebration!
          setShow180Celebration(true);
          setLast180Index(currentIndex); // Remember this index so we don't re-celebrate
          setTimeout(() => setShow180Celebration(false), 3000); // Hide celebration after 3 seconds
        }
      }

      return newThrows;
    });

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
    setLast180Index(-1); // Reset 180 celebration tracking

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
    setLast180Index(-1);
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
        onInfoToggle={() => setIsInfoOpen(!isInfoOpen)}
        isInfoOpen={isInfoOpen}
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
          isGameOver={gameState.mode === '501' && gameState.isGameOver}
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
          {/* 180 Celebration Popup */}
          {show180Celebration && <Celebration180 onComplete={() => setShow180Celebration(false)} />}
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
        <div className="flex items-start md:items-center gap-0 md:gap-4 max-w-[350px] md:max-w-none">
          <span className="text-3xl">🎯</span>
          <p>No actual darts were thrown. All scores simulated.</p>
        </div>

        <p className="flex items-center gap-1">
          &copy; {new Date().getFullYear()} ShyDeveloper{' '}
          <img src={logoImage} alt="ShyDeveloper Logo" className="inline-block w-6 h-6" />
        </p>
      </Footer>
      
      <DartboardInfo isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}

export default App;
