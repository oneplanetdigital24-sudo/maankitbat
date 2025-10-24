import { useEffect, useState } from 'react';
import { Users, MapPin, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LACStats {
  lac: string;
  totalSubmissions: number;
  totalAttendances: number;
  submittedStations: number;
  totalStations: number;
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState<LACStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallStats, setOverallStats] = useState({
    totalSubmissions: 0,
    totalAttendances: 0,
    totalStations: 0,
    submittedStations: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);

    const { data: submissions } = await supabase
      .from('man_ki_bat_submissions')
      .select('*')
      .order('created_at', { ascending: true });

    const { data: allStations } = await supabase
      .from('polling_stations')
      .select('lac, station_name');

    if (submissions && allStations) {
      const lacs = ['Dhemaji', 'Sisiborgaon', 'Jonai'];
      const lacStats: LACStats[] = [];

      let totalSubs = 0;
      let totalAtt = 0;
      let totalSt = 0;
      let submittedSt = 0;

      lacs.forEach((lac) => {
        const lacSubmissions = submissions.filter((s) => s.lac === lac);
        const lacStations = allStations.filter((s) => s.lac === lac);
        const uniqueStations = new Set(lacSubmissions.map((s) => s.polling_station));

        const totalAttendances = lacSubmissions.reduce(
          (sum, s) => sum + (s.total_attendances || 0),
          0
        );

        lacStats.push({
          lac,
          totalSubmissions: lacSubmissions.length,
          totalAttendances,
          submittedStations: uniqueStations.size,
          totalStations: lacStations.length,
        });

        totalSubs += lacSubmissions.length;
        totalAtt += totalAttendances;
        totalSt += lacStations.length;
        submittedSt += uniqueStations.size;
      });

      setStats(lacStats);
      setOverallStats({
        totalSubmissions: totalSubs,
        totalAttendances: totalAtt,
        totalStations: totalSt,
        submittedStations: submittedSt,
      });
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase">Total Submissions</span>
            </div>
            <p className="text-4xl font-bold">{overallStats.totalSubmissions}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase">Total Attendances</span>
            </div>
            <p className="text-4xl font-bold">{overallStats.totalAttendances}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase">Submitted Stations</span>
            </div>
            <p className="text-4xl font-bold">{overallStats.submittedStations}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase">Total Stations</span>
            </div>
            <p className="text-4xl font-bold">{overallStats.totalStations}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">LAC-wise Analytics</h2>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div
              key={stat.lac}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors"
            >
              <h3 className="text-xl font-bold text-orange-600 mb-4">{stat.lac}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Submissions</p>
                  <p className="text-2xl font-bold text-blue-600">{stat.totalSubmissions}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Attendances</p>
                  <p className="text-2xl font-bold text-green-600">{stat.totalAttendances}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Submitted Stations</p>
                  <p className="text-2xl font-bold text-orange-600">{stat.submittedStations}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Stations</p>
                  <p className="text-2xl font-bold text-gray-600">{stat.totalStations}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-800">
                    {stat.totalStations > 0
                      ? ((stat.submittedStations / stat.totalStations) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stat.totalStations > 0
                          ? (stat.submittedStations / stat.totalStations) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
