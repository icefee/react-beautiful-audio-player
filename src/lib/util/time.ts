export function timeFormatter(second: number): string {
    const [m, h] = [60, 60 * 60];
    const s = Math.floor(Math.max(0, second));
    return [...(s < h ? [] : [Math.floor(s / h)]), Math.floor((s < h ? s : s % h) / m), Math.round(s % m)].map(
        v => String(v).padStart(2, '0')
    ).join(':')
}