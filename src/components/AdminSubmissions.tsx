import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, User, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Submission {
  id: string;
  lac: string;
  polling_station: string;
  total_attendances: number;
  venue: string;
  eminent_guests: string[];
  front_image_url: string;
  back_image_url: string;
  created_at: string;
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('man_ki_bat_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No submissions found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          All Submissions ({submissions.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-orange-500 to-green-600 text-white">
              <th className="px-4 py-3 text-left font-semibold">Sr. No.</th>
              <th className="px-4 py-3 text-left font-semibold">LAC</th>
              <th className="px-4 py-3 text-left font-semibold">Polling Station</th>
              <th className="px-4 py-3 text-left font-semibold">Venue</th>
              <th className="px-4 py-3 text-left font-semibold">Attendances</th>
              <th className="px-4 py-3 text-left font-semibold">Eminent Guests</th>
              <th className="px-4 py-3 text-left font-semibold">Images</th>
              <th className="px-4 py-3 text-left font-semibold">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr
                key={submission.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 font-semibold text-gray-700">{index + 1}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                    <MapPin className="w-4 h-4" />
                    {submission.lac}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-700">{submission.polling_station}</td>
                <td className="px-4 py-4 text-gray-700">{submission.venue}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                    <Users className="w-4 h-4" />
                    {submission.total_attendances}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {submission.eminent_guests && submission.eminent_guests.length > 0 ? (
                    <div className="space-y-1">
                      {submission.eminent_guests.map((guest, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <User className="w-3 h-3" />
                          {guest}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No guests listed</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedImage(submission.front_image_url)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold flex items-center gap-1"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Front
                    </button>
                    <button
                      onClick={() => setSelectedImage(submission.back_image_url)}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-semibold flex items-center gap-1"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(submission.created_at)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white text-xl font-bold hover:text-gray-300"
            >
              Close ✕
            </button>
            <img
              src={selectedImage}
              alt="Submission"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
