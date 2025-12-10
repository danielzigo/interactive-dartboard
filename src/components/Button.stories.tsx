import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['slate', 'blue', 'cyan', 'violet', 'amber', 'red'],
      description: 'Button color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    active: {
      control: 'boolean',
      description: 'Active state (for toggle buttons)',
    },
    asToggle: {
      control: 'boolean',
      description: 'Whether button behaves as a toggle',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    block: {
      control: 'boolean',
      description: 'Full width button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default button
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'blue',
    size: 'md',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'blue',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    variant: 'blue',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'blue',
    size: 'lg',
  },
};

// Variants
export const Slate: Story = {
  args: {
    children: 'Slate Button',
    variant: 'slate',
  },
};

export const Blue: Story = {
  args: {
    children: 'Blue Button',
    variant: 'blue',
  },
};

export const Cyan: Story = {
  args: {
    children: 'Practice Mode',
    variant: 'cyan',
  },
};

export const Violet: Story = {
  args: {
    children: '501 Game',
    variant: 'violet',
  },
};

export const Amber: Story = {
  args: {
    children: 'Amber Button',
    variant: 'amber',
  },
};

export const Red: Story = {
  args: {
    children: 'Red Button',
    variant: 'red',
  },
};

// Toggle buttons
export const ToggleInactive: Story = {
  args: {
    children: 'Practice',
    variant: 'cyan',
    asToggle: true,
    active: false,
  },
};

export const ToggleActive: Story = {
  args: {
    children: 'Practice',
    variant: 'cyan',
    asToggle: true,
    active: true,
  },
};

// With icons
export const WithIcon: Story = {
  args: {
    children: 'Dimensions',
    variant: 'slate',
    iconLeft: <span>📏</span>,
  },
};

export const WithActiveIcon: Story = {
  args: {
    children: 'Debug',
    variant: 'slate',
    asToggle: true,
    active: true,
    iconLeft: <span>📏</span>,
    iconActive: <span>✅</span>,
  },
};

// States
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'blue',
    disabled: true,
  },
};

export const BlockButton: Story = {
  args: {
    children: 'Reset Game',
    variant: 'blue',
    size: 'lg',
    block: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// All variants showcase
export const AllVariants: Story = {
  args: {
    children: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <Button variant="slate">Slate</Button>
      <Button variant="blue">Blue</Button>
      <Button variant="cyan">Cyan</Button>
      <Button variant="violet">Violet</Button>
      <Button variant="amber">Amber</Button>
      <Button variant="red">Red</Button>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  args: {
    children: '',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm" variant="blue">
        Small
      </Button>
      <Button size="md" variant="blue">
        Medium
      </Button>
      <Button size="lg" variant="blue">
        Large
      </Button>
    </div>
  ),
};

// Toggle interaction example
export const ToggleExample: Story = {
  args: {
    children: '',
  },
  render: function ToggleStory() {
    const [active, setActive] = React.useState(false);

    return (
      <Button
        variant="cyan"
        asToggle
        active={active}
        onClick={() => setActive(!active)}
        iconLeft={<span>📏</span>}
        iconActive={<span>✅</span>}
      >
        {active ? 'Debug' : 'Dimensions'}
      </Button>
    );
  },
};

// Playground for testing
export const Playground: Story = {
  args: {
    children: 'Playground Button',
    variant: 'blue',
    size: 'md',
    active: false,
    asToggle: false,
    disabled: false,
    block: false,
  },
};
