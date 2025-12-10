# 🎯 Interactive Dartboard (Let's Play Darts)

A fully interactive dartboard built with **React**, **TypeScript**, **Tailwind v4**, **Canvas API**, and **Motion**.

## About

A single-player dartboard game with accurate scoring and proper 501 rules. Click anywhere on the board to throw – it's more about learning the game and testing the mechanics than real darts skill.

## Features

- Geometry-accurate hit detection (no image maps)
- Accurate scoring for singles, doubles, trebles, outer bull (25) and bullseye (50)
- **Practice mode:** unlimited darts, cumulative score
- **501 mode:** proper rules – finish on a double, bust protection, 3-dart turns, checkout suggestions
- Animated dart placement and real-time throw history
- Debug/Dimensions overlay to verify ring radii and segment boundaries
- Reusable component set documented in Storybook

## How Scoring Works

1. **Click → Polar:** convert `(x, y)` to radius and angle (0° at 12 o'clock, clockwise)
2. **Pick segment:** angle falls into one of 20 wedges (18° each) mapped to the standard order: `20, 1, 18, 4, ...`
3. **Pick ring:** radius determines bull (50), outer bull (25), treble (×3), double (×2), or single
4. **Result:** returns `{ score, multiplier, segmentNumber, region, description }` to drive UI and game logic

> Uses official dartboard radii (mm) and a pixel-to-mm scale – so hit detection matches the rendered size.

## 501 Rules

- Start at 501, subtract each dart's score
- Must finish on a double (e.g., D16 when you have 32 left)
- Bust protection: go below 0 or fail to finish correctly, and your score resets to the start of the turn
- 3-dart turns tracked with a counter
- Checkout suggestions when you're in finishing range

## Tech Stack

**React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Motion**, **Canvas API**, **Storybook**, **clsx**

## Why This Stack?

- **React + TypeScript:** Type safety helps with geometry calculations. Component model keeps dartboard rendering, game logic, and UI separate.
- **Vite:** Fast dev server, quick builds.
- **Tailwind v4:** Utility-first CSS, no context-switching between files.
- **Canvas API:** Pixel-perfect hit detection with full control over rendering and coordinates.
- **Motion:** Lightweight animations for dart placement and UI feedback.
- **Storybook:** Component isolation and documentation.

## Getting Started
```bash
npm install
npm run dev

# build & preview
npm run build
npm run preview

# storybook
npm run storybook
```

## Future Ideas

**Gameplay**
- Multiplayer (turn-based)
- Sound effects
- Other game modes (301, Around the Clock)
- Post-game stats

**Technical**
- Test coverage (Vitest/Playwright)
- Keyboard navigation and accessibility review

## How to Play

1. Pick **Practice** or **501 Game**
2. Click anywhere on the dartboard to throw
3. Watch the score update and dart animate into place
4. Check your throw history (last 10 throws, colour-coded)
5. **Reset Game** to start fresh
6. Toggle **Dimensions** to see the debug overlay
