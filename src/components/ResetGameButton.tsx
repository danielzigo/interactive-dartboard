import { Button } from '~/components/Button';

interface ResetGameButtonProps {
  onReset: () => void;
}

export function ResetGameButton({ onReset }: ResetGameButtonProps) {
  return (
    <Button size="lg" variant="blue" block onClick={onReset}>
      Reset Game
    </Button>
  );
}
