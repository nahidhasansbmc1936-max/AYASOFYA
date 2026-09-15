import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import useSettingsStore from '../../store/useSettingsStore';

export default function Layout({ children }) {
  const { fetchSettings } = useSettingsStore();
  useEffect(() => { fetchSettings(); }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
