import { useState, useEffect } from 'react';
import { MapPin, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HomePageProps {
  onSelectLAC: (lac: string) => void;
  onAdminClick: () => void;
}

export default function HomePage({ onSelectLAC, onAdminClick }: HomePageProps) {
  const [lacs, setLacs] = useState<Array<{ name: string; displayName: string; color: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLACs();
  }, []);

  const fetchLACs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('polling_stations')
      .select('lac')
      .order('lac');

    if (!error && data) {
      const uniqueLacs = Array.from(new Set(data.map(item => item.lac)));
      const lacColors = ['bg-orange-500 hover:bg-orange-600', 'bg-green-600 hover:bg-green-700', 'bg-orange-500 hover:bg-orange-600'];

      const formattedLacs = uniqueLacs.map((lac, index) => ({
        name: lac,
        displayName: lac.replace(/^\d+-/, '').replace(/ \(ST\)$/, ''),
        color: lacColors[index % lacColors.length]
      }));

      setLacs(formattedLacs);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
            DATA COLLECTION FORM
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-700">
            FOR MANN KI BAAT PROGRAM
          </h3>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h4 className="text-xl font-semibold text-center text-gray-700 mb-8">
            SELECT LAC
          </h4>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lacs.map((lac) => (
                <button
                  key={lac.name}
                  onClick={() => onSelectLAC(lac.name)}
                  className={`${lac.color} text-white font-bold py-6 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 text-lg`}
                >
                  <MapPin className="w-6 h-6" />
                  {lac.displayName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center space-y-4">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-green-600 p-1 rounded-lg">
            <div className="bg-white px-8 py-4 rounded-lg">
              <p className="text-gray-700 font-semibold">
                Empowering Democracy Through Engagement
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onAdminClick}
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
