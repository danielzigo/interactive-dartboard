import { Button } from '~/components/Button';
import { Tooltip } from 'react-tooltip';

interface DimensionsToggleProps {
  active: boolean;
  onToggle: () => void;
}

export function DimensionsToggle({ active, onToggle }: DimensionsToggleProps) {
  return (
    <>
      <Button
        data-tooltip-id="dimensions-tooltip"
        data-tooltip-content={active ? 'Hide Dimensions' : 'Show Dimensions'}
        size="sm"
        variant="slate"
        active={active}
        asToggle
        onClick={onToggle}
        iconLeft={<span aria-hidden="true">📏</span>}
        iconActive={<span aria-hidden="true">✅</span>}
      >
        Dimensions
      </Button>

      <Tooltip
        id="dimensions-tooltip"
        style={{
          zIndex: 9999,
          backgroundColor: '#334155',
          color: 'white',
          fontSize: '14px',
          borderRadius: '6px',
          padding: '6px 12px',
        }}
        place="right"
      />
    </>
  );
}
