import { Button } from '~/components/Button';

interface GameModeToggleProps {
  mode: 'practice' | '501';
  onChange?: (m: 'practice' | '501') => void;
}

export function GameModeToggle({ mode, onChange }: GameModeToggleProps) {
  return (
    <>
      <Button
        size="sm"
        variant="cyan"
        active={mode === 'practice'}
        asToggle
        onClick={() => onChange?.('practice')}
      >
        Practice
      </Button>

      <Button
        size="sm"
        variant="violet"
        active={mode === '501'}
        asToggle
        onClick={() => onChange?.('501')}
      >
        501 Game
      </Button>
    </>
  );
}
