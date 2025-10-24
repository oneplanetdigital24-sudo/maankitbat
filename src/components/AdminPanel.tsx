import { useState } from 'react';
import { ArrowLeft, BarChart3, List, Filter } from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import AdminSubmissions from './AdminSubmissions';
import UnsubmittedStations from './UnsubmittedStations';

interface AdminPanelProps {
  onBack: () => void;
}

type AdminView = 'analytics' | 'submissions' | 'unsubmitted';

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<AdminView>('analytics');

  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <div className="w-32"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setCurrentView('analytics')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                currentView === 'analytics'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('submissions')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                currentView === 'submissions'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
              Submissions
            </button>
            <button
              onClick={() => setCurrentView('unsubmitted')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                currentView === 'unsubmitted'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-5 h-5" />
              Unsubmitted Stations
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentView === 'analytics' && <AdminAnalytics />}
          {currentView === 'submissions' && <AdminSubmissions />}
          {currentView === 'unsubmitted' && <UnsubmittedStations />}
        </div>
      </div>
    </div>
  );
}
