import { Button } from '~/components/Button';

interface DimensionsToggleProps {
  active: boolean;
  onToggle: () => void;
}

export function DimensionsToggle({ active, onToggle }: DimensionsToggleProps) {
  return (
    <Button
      size="sm"
      variant="slate"
      active={active}
      asToggle
      onClick={onToggle}
      iconLeft={<span aria-hidden="true">📏</span>}
      iconActive={<span aria-hidden="true">✅</span>}
    >
      {active ? 'Debug' : 'Dimensions'}
    </Button>
  );
}
