import type { Metadata } from 'next';
import { inter } from '@/lib/fonts';
import AdminApp from './AdminApp';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin — Campanhas Rise',
  robots: { index: false, follow: false },
};

export default function AdminCampanhaPage() {
  return (
    <div className={`adm ${inter.variable}`}>
      <AdminApp />
    </div>
  );
}
