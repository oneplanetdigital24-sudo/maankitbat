import { useEffect, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PollingStation {
  id: string;
  lac: string;
  station_name: string;
}

export default function UnsubmittedStations() {
  const [unsubmittedStations, setUnsubmittedStations] = useState<PollingStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<PollingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedLAC, setSelectedLAC] = useState<string>('All');

  const lacs = ['All', '78-DHEMAJI (ST)', '79-SISIBORGAON', '80-JONAI (ST)'];

  useEffect(() => {
    fetchUnsubmittedStations();

    const interval = setInterval(() => {
      fetchUnsubmittedStations();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedLAC === 'All') {
      setFilteredStations(unsubmittedStations);
    } else {
      setFilteredStations(unsubmittedStations.filter((s) => s.lac === selectedLAC));
    }
  }, [selectedLAC, unsubmittedStations]);

  const fetchUnsubmittedStations = async () => {
    if (isFetching) return;

    setIsFetching(true);
    try {
      const { data: allStations, error: stationsError } = await supabase
        .from('polling_stations')
        .select('*')
        .order('lac')
        .order('station_name');

      const { data: submissions, error: submissionsError } = await supabase
        .from('man_ki_bat_submissions')
        .select('polling_station, lac');

      if (stationsError) {
        console.error('Error fetching stations:', stationsError);
        setLoading(false);
        return;
      }

      if (submissionsError) {
        console.error('Error fetching submissions:', submissionsError);
        setLoading(false);
        return;
      }

      const stationsData = allStations || [];
      const submissionsData = submissions || [];

      console.log('Total stations:', stationsData.length);
      console.log('Total submissions:', submissionsData.length);

      const submittedStationNames = new Set(
        submissionsData
          .filter((s) => s?.lac && s?.polling_station)
          .map((s) => `${s.lac}-${s.polling_station}`)
      );

      const unsubmitted = stationsData.filter(
        (station) => station?.lac && station?.station_name &&
        !submittedStationNames.has(`${station.lac}-${station.station_name}`)
      );

      console.log('Unsubmitted stations:', unsubmitted.length);

      setUnsubmittedStations(unsubmitted);
      setFilteredStations(unsubmitted);

      setLoading(false);
    } catch (error) {
      console.error('Exception in fetchUnsubmittedStations:', error);
      setLoading(false);
    } finally {
      setIsFetching(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded w-72 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-10 w-24"></div>
            ))}
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg h-96"></div>
      </div>
    );
  }

  const lacCounts = lacs.slice(1).map((lac) => ({
    lac,
    count: unsubmittedStations.filter((s) => s.lac === lac).length,
  }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Unsubmitted Polling Stations ({unsubmittedStations.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {lacCounts.map(({ lac, count }) => (
            <div
              key={lac}
              className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-4"
            >
              <p className="text-sm text-red-600 font-semibold mb-1">{lac}</p>
              <p className="text-3xl font-bold text-red-700">{count}</p>
              <p className="text-xs text-red-600 mt-1">Pending</p>
            </div>
          ))}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-700">{unsubmittedStations.length}</p>
            <p className="text-xs text-gray-600 mt-1">Unsubmitted</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {lacs.map((lac) => (
            <button
              key={lac}
              onClick={() => setSelectedLAC(lac)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedLAC === lac
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {lac}
              {lac !== 'All' && (
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                  {unsubmittedStations.filter((s) => s.lac === lac).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredStations.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-green-600 text-lg font-semibold">
            All polling stations have submitted!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <th className="px-4 py-3 text-left font-semibold">Sr. No.</th>
                <th className="px-4 py-3 text-left font-semibold">LAC</th>
                <th className="px-4 py-3 text-left font-semibold">Polling Station Name</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((station, index) => (
                <tr
                  key={station.id}
                  className="border-b border-gray-200 hover:bg-red-50 transition-colors"
                >
                  <td className="px-4 py-4 font-semibold text-gray-700">{index + 1}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                      <MapPin className="w-4 h-4" />
                      {station.lac}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700 font-medium">
                    {station.station_name}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      Not Submitted
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
