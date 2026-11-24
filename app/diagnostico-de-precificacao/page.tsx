import { inter } from '@/lib/fonts';
import Quiz from './Quiz';
import './vhs.css';

export default function DiagnosticoPage() {
  return (
    <div className={`vhs ${inter.variable}`}>
      <Quiz />
    </div>
  );
}
