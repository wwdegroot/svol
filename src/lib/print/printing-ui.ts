import type { ScaleInfo } from './printing-map.js';

// Create a rounded rectangle for the scalebar
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// Draw the scalebar element
export function drawScaleBar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: ScaleInfo
) {
    const { label, barWidthPx } = scale;
    const barH = 6;
    const tickH = 10;
    const padding = 16;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    roundRect(ctx, x - padding, y - 22, barWidthPx + padding * 2, 36, 6);
    ctx.fill();
    ctx.restore();

    const segments = 4;
    const segW = barWidthPx / segments;
    for (let i = 0; i < segments; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#222' : '#fff';
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.fillRect(x + i * segW, y - barH / 2, segW, barH);
        ctx.strokeRect(x + i * segW, y - barH / 2, segW, barH);
    }

    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5;
    [0, barWidthPx].forEach((dx) => {
        ctx.beginPath();
        ctx.moveTo(x + dx, y - tickH / 2);
        ctx.lineTo(x + dx, y + tickH / 2);
        ctx.stroke();
    });

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + barWidthPx / 2, y - 10);
    ctx.textAlign = 'left';
    ctx.fillText('0', x, y + 20);
}

// draw a North Arrow
export function drawNorthArrow(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    rotation: number
) {
    // Background circle (drawn without rotation)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.75, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fill();
    ctx.restore();

    // Arrow body (rotated with the map)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.35, 0);
    ctx.lineTo(-size * 0.35, 0);
    ctx.closePath();
    ctx.fillStyle = '#d63031';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(size * 0.35, 0);
    ctx.lineTo(-size * 0.35, 0);
    ctx.closePath();
    ctx.fillStyle = '#2d3436';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();

    // N north label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.font = `bold ${Math.round(size * 0.55)}px serif`;
    ctx.fillStyle = '#2d3436';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('N', 0, -size - 4);
    ctx.restore();
}
