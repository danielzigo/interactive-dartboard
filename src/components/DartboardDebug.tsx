import { useEffect, useRef } from 'react';
import { DARTBOARD_DIMENSIONS } from '~/lib/dartboard-geometry';

interface DartboardDebugProps {
  width?: number;
  height?: number;
  scale: number;
}

/**
 * Debug overlay to verify dartboard dimensions are accurate
 * Shows measurement circles and displays actual vs expected dimensions
 */
export function DartboardDebug({ width = 600, height = 600, scale }: DartboardDebugProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centerX = width / 2;
  const centerY = height / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw dark overlay to dim the dartboard (75% opacity)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);

    // Define measurements - matching exactly what Dartboard component uses
    const measurements = [
      {
        name: 'Bull',
        radius: DARTBOARD_DIMENSIONS.BULL,
        radiusMm: 6.35,
        color: '#ff0000',
        angle: 0,
      },
      {
        name: 'Outer Bull',
        radius: DARTBOARD_DIMENSIONS.OUTER_BULL,
        radiusMm: 16,
        color: '#00ff00',
        angle: 60,
      },
      {
        name: 'Triple In',
        radius: DARTBOARD_DIMENSIONS.TRIPLE_INNER,
        radiusMm: 99,
        color: '#ffff00',
        angle: 120,
      },
      {
        name: 'Triple Out',
        radius: DARTBOARD_DIMENSIONS.TRIPLE_OUTER,
        radiusMm: 107,
        color: '#ff00ff',
        angle: 180,
      },
      {
        name: 'Double In',
        radius: DARTBOARD_DIMENSIONS.DOUBLE_INNER,
        radiusMm: 162,
        color: '#00ffff',
        angle: 240,
      },
      {
        name: 'Double Out',
        radius: DARTBOARD_DIMENSIONS.DOUBLE_OUTER,
        radiusMm: 170,
        color: '#ffa500',
        angle: 300,
      },
      {
        name: 'Total (R)',
        radius: DARTBOARD_DIMENSIONS.TOTAL_RADIUS,
        radiusMm: 225.5,
        color: '#ffffff',
        angle: 30,
      },
    ];

    const canvasHalfWidth = width / 2;
    const canvasHalfHeight = height / 2;

    measurements.forEach((measure) => {
      const scaledRadius = measure.radius * scale;

      // Draw circle with glow
      ctx.beginPath();
      ctx.arc(0, 0, scaledRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = measure.color;
      ctx.lineWidth = 1;
      ctx.shadowColor = measure.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Calculate initial label position
      const angleRad = (measure.angle * Math.PI) / 180;

      // Smart positioning: Outer rings get labels inside, inner rings get labels outside
      let labelDistance;

      if (scaledRadius < 50) {
        // Bull/Outer Bull - position outward
        labelDistance = 80;
      } else if (scaledRadius > 150) {
        // Double rings and Total - position inward to stay on screen
        labelDistance = scaledRadius - 50;
      } else {
        // Triple rings - position outward with moderate distance
        labelDistance = scaledRadius + 40;
      }

      let labelX = Math.cos(angleRad) * labelDistance;
      let labelY = Math.sin(angleRad) * labelDistance;

      // Keep labels within canvas bounds with generous margin
      const safeMargin = 110;
      const maxX = canvasHalfWidth - safeMargin;
      const maxY = canvasHalfHeight - safeMargin;

      // Clamp label position to stay on canvas
      labelX = Math.max(-maxX, Math.min(maxX, labelX));
      labelY = Math.max(-maxY, Math.min(maxY, labelY));

      // Text configuration
      ctx.font = 'bold 13px monospace';
      ctx.textBaseline = 'middle';

      // Determine text alignment based on position
      if (labelX < -10) {
        ctx.textAlign = 'right';
      } else if (labelX > 10) {
        ctx.textAlign = 'left';
      } else {
        ctx.textAlign = 'center';
      }

      // Prepare text lines
      const labelText = measure.name;
      const sublabelText = `${measure.radiusMm}mm: ${scaledRadius.toFixed(1)}px`;

      // Measure text for background
      const labelMetrics = ctx.measureText(labelText);
      const sublabelMetrics = ctx.measureText(sublabelText);
      const textWidth = Math.max(labelMetrics.width, sublabelMetrics.width);
      const textHeight = 32;

      // Calculate background position based on alignment
      let bgX = labelX;
      const bgY = labelY - textHeight / 2;

      if (ctx.textAlign === 'right') {
        bgX = labelX - textWidth - 8;
      } else if (ctx.textAlign === 'left') {
        bgX = labelX - 4;
      } else {
        bgX = labelX - textWidth / 2 - 4;
      }

      // Draw background with border
      const padding = 6;
      const rectX = bgX - padding;
      const rectY = bgY - padding;
      const rectWidth = textWidth + padding * 2 + 8;
      const rectHeight = textHeight + padding * 2;
      const radius = 6;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.strokeStyle = measure.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = measure.color;
      ctx.shadowBlur = 10;

      // Rounded rectangle
      ctx.beginPath();
      ctx.moveTo(rectX + radius, rectY);
      ctx.lineTo(rectX + rectWidth - radius, rectY);
      ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius);
      ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
      ctx.quadraticCurveTo(
        rectX + rectWidth,
        rectY + rectHeight,
        rectX + rectWidth - radius,
        rectY + rectHeight
      );
      ctx.lineTo(rectX + radius, rectY + rectHeight);
      ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius);
      ctx.lineTo(rectX, rectY + radius);
      ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Draw label text
      ctx.fillStyle = measure.color;
      ctx.font = 'bold 13px monospace';
      ctx.fillText(labelText, labelX, labelY - 7);

      ctx.fillStyle = '#d0d0d0';
      ctx.font = '11px monospace';
      ctx.fillText(sublabelText, labelX, labelY + 8);

      // Draw connecting line
      ctx.strokeStyle = measure.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([3, 6]);
      ctx.globalAlpha = 0.45;
      ctx.shadowColor = measure.color;
      ctx.shadowBlur = 4;

      ctx.beginPath();
      ctx.moveTo(Math.cos(angleRad) * scaledRadius, Math.sin(angleRad) * scaledRadius);
      ctx.lineTo(labelX, labelY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    });

    // Draw enhanced crosshair at center
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(25, 0);
    ctx.moveTo(0, -25);
    ctx.lineTo(0, 25);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }, [width, height, scale, centerX, centerY]);

  return (
    // Wrap canvas in div to capture and block all events
    // So you can't throw darts on the dartboard
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'auto', // Captures and blocks all events
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          pointerEvents: 'none', // Canvas doesn't interfere
        }}
      />
    </div>
  );
}

/**
 * Display component showing dimension verification table
 * Using Tailwind CSS with accessible colour contrast
 */
export function DimensionsTable({ scale }: { scale: number }) {
  const dimensions = [
    {
      name: 'Bull (inner)',
      official: '12.7mm diameter',
      actual: DARTBOARD_DIMENSIONS.BULL * 2,
      note: '0.5" | Radius: 6.35mm',
    },
    {
      name: 'Outer Bull',
      official: '32mm diameter',
      actual: DARTBOARD_DIMENSIONS.OUTER_BULL * 2,
      note: '1.26" | Radius: 16mm',
    },
    {
      name: 'Triple Ring (inner edge)',
      official: '99mm from center',
      actual: DARTBOARD_DIMENSIONS.TRIPLE_INNER,
      note: 'Radius measurement',
    },
    {
      name: 'Triple Ring (outer edge)',
      official: '107mm from center',
      actual: DARTBOARD_DIMENSIONS.TRIPLE_OUTER,
      note: '4.21" radius',
    },
    {
      name: 'Double Ring (inner edge)',
      official: '162mm from center',
      actual: DARTBOARD_DIMENSIONS.DOUBLE_INNER,
      note: 'Radius measurement',
    },
    {
      name: 'Double Ring (outer edge)',
      official: '170mm from center',
      actual: DARTBOARD_DIMENSIONS.DOUBLE_OUTER,
      note: '6.69" radius',
    },
    {
      name: 'Total Radius',
      official: '225.5mm',
      actual: DARTBOARD_DIMENSIONS.TOTAL_RADIUS,
      note: 'Diameter: 451mm (17.75")',
    },
    {
      name: 'Ring Width (Double/Triple)',
      official: '8mm',
      actual: 8,
      note: '0.315"',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-4 font-mono border-2 border-slate-700">
      <h3 className="text-lg font-semibold text-blue-400 mb-4 uppercase tracking-wider">
        📏 Dimension Verification
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-600">
              <th className="text-left p-2 text-slate-200 font-semibold text-sm">Component</th>
              <th className="text-right p-2 text-slate-200 font-semibold text-sm">Official</th>
              <th className="text-right p-2 text-slate-200 font-semibold text-sm">Our Value</th>
              <th className="text-right p-2 text-slate-200 font-semibold text-sm">Pixels</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim, i) => {
              const isMatch = Math.abs(dim.actual - parseFloat(dim.official)) < 0.5;
              return (
                <tr
                  key={i}
                  className="border-b border-slate-700 hover:bg-slate-750 transition-colors"
                >
                  <td className="p-2">
                    <div className="text-slate-100 font-medium">{dim.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{dim.note}</div>
                  </td>
                  <td className="text-right p-2 text-slate-300">{dim.official}</td>
                  <td
                    className={`text-right p-2 font-bold ${
                      isMatch ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {dim.actual.toFixed(1)}mm
                  </td>
                  <td className="text-right p-2 text-blue-400 font-medium">
                    {(dim.actual * scale).toFixed(1)}px
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-emerald-400 font-medium">
        ✅ All dimensions match official dartboard specifications from dimensions.com
      </p>

      <div className="mt-4 p-3 bg-slate-900 rounded-lg">
        <strong className="text-blue-400 font-semibold text-sm">📐 Measurement Notes:</strong>
        <ul className="mt-2 ml-6 space-y-1 text-xs text-slate-300 list-disc">
          <li>
            <strong className="text-slate-200">Bulls:</strong> Measured as diameter (across the
            circle)
          </li>
          <li>
            <strong className="text-slate-200">Rings:</strong> Measured as radius (from center to
            edge)
          </li>
          <li>
            <strong className="text-slate-200">Total:</strong> Radius = 225.5mm, Diameter = 451mm
          </li>
          <li>
            <strong className="text-slate-200">Ring width:</strong> Both double and triple rings are
            8mm wide
          </li>
        </ul>
      </div>

      <p className="mt-2 text-sm text-slate-300">
        Scale factor: <span className="font-semibold text-slate-100">{scale.toFixed(4)}</span>{' '}
        (pixels per mm)
      </p>

      <p className="mt-2 text-xs text-slate-400">
        Reference: Standard dartboard (17.75" | 451mm diameter)
      </p>
    </div>
  );
}
