'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';

/**
 * Canvas do Chart.js. Passe um `config` memoizado (useMemo):
 * o gráfico é recriado sempre que a referência muda.
 */
export default function ChartCanvas({
  config,
  height,
}: {
  config: ChartConfiguration;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
  }, [config]);

  return <canvas ref={ref} height={height} />;
}
