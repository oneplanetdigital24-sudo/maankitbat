import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import DataCollectionForm from './components/DataCollectionForm';
import AdminPanel from './components/AdminPanel';

type ViewMode = 'home' | 'form' | 'admin';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedLAC, setSelectedLAC] = useState<string | null>(null);

  const handleSelectLAC = (lac: string) => {
    setSelectedLAC(lac);
    setViewMode('form');
  };

  const handleBack = () => {
    setViewMode('home');
    setSelectedLAC(null);
  };

  const handleAdminClick = () => {
    setViewMode('admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex flex-col">
      <Header />
      {viewMode === 'form' && selectedLAC ? (
        <DataCollectionForm lac={selectedLAC} onBack={handleBack} />
      ) : viewMode === 'admin' ? (
        <AdminPanel onBack={handleBack} />
      ) : (
        <HomePage onSelectLAC={handleSelectLAC} onAdminClick={handleAdminClick} />
      )}
      <Footer />
    </div>
  );
}

export default App;
