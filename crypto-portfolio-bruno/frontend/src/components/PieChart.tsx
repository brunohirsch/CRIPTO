import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

export default function PieChart({ labels, values }: { labels: string[]; values: number[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: { labels, datasets: [{ data: values }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
    return () => chart.destroy();
  }, [labels.join(','), values.join(',')]);
  return <canvas ref={ref} style={{width:'100%', height:300}} />
}
