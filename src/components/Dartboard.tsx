import { useEffect, useRef, useState } from 'react';
import {
  DARTBOARD_DIMENSIONS,
  DARTBOARD_NUMBERS,
  COLORS,
  isSegmentDark,
  calculateScore,
} from '~/lib/dartboard-geometry';

interface DartboardProps {
  width?: number;
  height?: number;
  onDartThrow?: (result: {
    score: number;
    multiplier: 1 | 2 | 3;
    segmentNumber: number;
    region: string;
    description: string;
  }) => void;
  isGameOver?: boolean;
}

interface Dart {
  x: number;
  y: number;
  timestamp: number; // For animation
}

export function Dartboard({ width = 600, height = 600, onDartThrow, isGameOver }: DartboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [darts, setDarts] = useState<Dart[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Calculate scale factor to fit dartboard + number ring in canvas
  // Increased from 2.16 to 2.25 to add more black space around dartboard
  const scale = Math.min(width, height) / (DARTBOARD_DIMENSIONS.TOTAL_RADIUS * 2.25);
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw the dartboard
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas with app background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Save context state
      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw black circle for number area
      const numberAreaRadius = DARTBOARD_DIMENSIONS.TOTAL_RADIUS * scale * 1.09;
      ctx.beginPath();
      ctx.arc(0, 0, numberAreaRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();

      // Draw dartboard segments
      drawSegments(ctx, scale);

      // Draw bulls (center circles)
      drawBulls(ctx, scale);

      // Draw numbers FIRST
      drawNumbers(ctx, scale);

      // Draw wire ring OUTSIDE the numbers
      drawNumberRing(ctx, scale);

      // Draw border around entire dartboard area LAST (so it's on top)
      ctx.beginPath();
      ctx.arc(0, 0, numberAreaRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw darts with animation
      const now = Date.now();
      darts.forEach((dart) => {
        const age = now - dart.timestamp;
        const animationDuration = 300; // 300ms animation (longer, more noticeable)

        if (age < animationDuration) {
          // Animate dart appearing (drop in from above + scale)
          const progress = age / animationDuration;
          const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out cubic

          const scale = 0.2 + 0.8 * easeOut; // Scale from 20% to 100%
          const dropDistance = 30; // Drop from 30px above
          const yOffset = -dropDistance * (1 - easeOut); // Move down as it animates

          ctx.save();
          ctx.translate(dart.x, dart.y + yOffset);
          ctx.scale(scale, scale);
          ctx.translate(-dart.x, -dart.y - yOffset);
          drawDart(ctx, dart.x, dart.y + yOffset);
          ctx.restore();
        } else {
          // Draw dart normally (animation finished)
          drawDart(ctx, dart.x, dart.y);
        }
      });

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height, scale, centerX, centerY, darts]);

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // Don't process/allow clicks if game is over
    if (isGameOver) {
      return;
    }

    event.preventDefault(); // Prevent any default behavior

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // Account for canvas scaling (internal size vs displayed size)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Transform click coordinates from screen space to canvas space
    const x = (event.clientX - rect.left) * scaleX - centerX;
    const y = (event.clientY - rect.top) * scaleY - centerY;

    // Check if click is within the playing area (up to double ring outer edge)
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    const playingAreaRadius = DARTBOARD_DIMENSIONS.DOUBLE_OUTER * scale; // 170mm - outermost scoring ring

    let result;
    if (distanceFromCenter > playingAreaRadius) {
      // Click was beyond the double ring - it's a miss
      result = {
        score: 0,
        multiplier: 1 as const,
        segmentNumber: 0,
        region: 'miss',
        description: 'Miss!',
      };
    } else {
      // Calculate score for hits on the playing area
      result = calculateScore(x, y, scale);
    }

    // Add dart to board with timestamp for animation
    setDarts((prev) => [...prev, { x, y, timestamp: Date.now() }]);

    // Notify parent component
    if (onDartThrow) {
      onDartThrow(result);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleCanvasClick}
      style={{
        cursor: isGameOver ? 'not-allowed' : 'crosshair',
        opacity: isGameOver ? 0.4 : 1, // Dim the board/canvas when it's game over
        backgroundColor: '#0f172a',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        display: 'block',
      }}
    />
  );
}

/**
 * Draw all dartboard segments (singles, doubles, triples)
 */
function drawSegments(ctx: CanvasRenderingContext2D, scale: number) {
  const segmentAngle = (2 * Math.PI) / 20; // 18 degrees per segment
  const startAngle = -Math.PI / 2 - segmentAngle / 2; // Start from top, offset by half segment

  for (let i = 0; i < 20; i++) {
    const isDark = isSegmentDark(i);
    const angleStart = startAngle + i * segmentAngle;
    const angleEnd = angleStart + segmentAngle;

    // Draw outer single area (between triple and double)
    drawWedge(
      ctx,
      0,
      0,
      DARTBOARD_DIMENSIONS.TRIPLE_OUTER * scale,
      DARTBOARD_DIMENSIONS.DOUBLE_INNER * scale,
      angleStart,
      angleEnd,
      isDark ? COLORS.BLACK : COLORS.WHITE
    );

    // Draw triple ring
    drawWedge(
      ctx,
      0,
      0,
      DARTBOARD_DIMENSIONS.TRIPLE_INNER * scale,
      DARTBOARD_DIMENSIONS.TRIPLE_OUTER * scale,
      angleStart,
      angleEnd,
      isDark ? COLORS.RED : COLORS.GREEN
    );

    // Draw inner single area (between outer bull and triple)
    drawWedge(
      ctx,
      0,
      0,
      DARTBOARD_DIMENSIONS.OUTER_BULL * scale,
      DARTBOARD_DIMENSIONS.TRIPLE_INNER * scale,
      angleStart,
      angleEnd,
      isDark ? COLORS.BLACK : COLORS.WHITE
    );

    // Draw double ring
    drawWedge(
      ctx,
      0,
      0,
      DARTBOARD_DIMENSIONS.DOUBLE_INNER * scale,
      DARTBOARD_DIMENSIONS.DOUBLE_OUTER * scale,
      angleStart,
      angleEnd,
      isDark ? COLORS.RED : COLORS.GREEN
    );
  }
}

/**
 * Draw the bull's eye and outer bull
 */
function drawBulls(ctx: CanvasRenderingContext2D, scale: number) {
  // Outer bull (green)
  ctx.beginPath();
  ctx.arc(0, 0, DARTBOARD_DIMENSIONS.OUTER_BULL * scale, 0, 2 * Math.PI);
  ctx.fillStyle = COLORS.OUTER_BULL;
  ctx.fill();

  // Inner bull (red)
  ctx.beginPath();
  ctx.arc(0, 0, DARTBOARD_DIMENSIONS.BULL * scale, 0, 2 * Math.PI);
  ctx.fillStyle = COLORS.BULL;
  ctx.fill();
}

/**
 * Draw numbers around the dartboard (inside the wire ring)
 */
function drawNumbers(ctx: CanvasRenderingContext2D, scale: number) {
  const boardRadius = DARTBOARD_DIMENSIONS.TOTAL_RADIUS * scale;
  const numberRadius = boardRadius * 0.96; // More inward, away from wire ring
  const segmentAngle = (2 * Math.PI) / 20;
  const startAngle = -Math.PI / 2; // Start from top

  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.floor(36 * scale)}px Teko`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  DARTBOARD_NUMBERS.forEach((number, i) => {
    const angle = startAngle + i * segmentAngle;
    const x = Math.cos(angle) * numberRadius;
    const y = Math.sin(angle) * numberRadius;

    ctx.fillText(number.toString(), x, y + 3); // Offset slightly down to center the text
  });
}

/**
 * Draw the outer wire ring (around the numbers)
 */
function drawNumberRing(ctx: CanvasRenderingContext2D, scale: number) {
  const boardRadius = DARTBOARD_DIMENSIONS.TOTAL_RADIUS * scale;
  const outerRingRadius = boardRadius * 1.04; // Between numbers (0.98) and edge (1.09)

  // Draw outer wire ring
  ctx.beginPath();
  ctx.arc(0, 0, outerRingRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.stroke();
}

/**
 * Draw a wedge (segment) on the dartboard
 */
function drawWedge(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  color: string
) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
  ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draw a realistic dart marker on the board
 */
function drawDart(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();

  // Dart colors - 'neon cyan' (more visible)
  const dartBody = '#00BCD4'; // Cyan barrel
  const dartFlight = '#00E5FF'; // Bright cyan flight
  const dartFlightEdge = '#0097A7'; // Darker cyan edge
  const dartTip = '#1a1a1a'; // Dark tip

  // Draw shadow
  ctx.beginPath();
  ctx.arc(x + 3, y + 3, 8, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();

  // Rotate the flight of the dart
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4); // 45 degrees
  ctx.translate(-x, -y);

  // Draw flight - 4 fins in X shape (for more realistic overhead view)
  for (let i = 0; i < 4; i++) {
    const angle = (i * 90 * Math.PI) / 180; // 4 fins at 90° intervals
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Flight fin
    ctx.beginPath();
    ctx.moveTo(-14, 0); // Extended back
    ctx.lineTo(-7, -5); // Slimmer wings
    ctx.lineTo(-7, 5); // Same
    ctx.closePath();
    ctx.fillStyle = dartFlight;
    ctx.fill();
    ctx.strokeStyle = dartFlightEdge;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // Draw dart barrel (body)
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, 2 * Math.PI);
  ctx.fillStyle = dartBody;
  ctx.fill();
  ctx.strokeStyle = '#0097A7';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Add metallic shine effect
  ctx.beginPath();
  ctx.arc(x - 1.5, y - 1.5, 2.5, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();

  // Draw dart tip (point)
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, 2 * Math.PI);
  ctx.fillStyle = dartTip;
  ctx.fill();

  ctx.restore();
}
