import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Upload, CheckCircle } from 'lucide-react';
import { supabase, PollingStation, ManKiBatSubmission } from '../lib/supabase';

interface DataCollectionFormProps {
  lac: string;
  onBack: () => void;
}

export default function DataCollectionForm({ lac, onBack }: DataCollectionFormProps) {
  const [pollingStations, setPollingStations] = useState<PollingStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    polling_station: '',
    total_attendances: '',
    venue: '',
    eminent_guests: [''],
  });

  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string>('');
  const [backImagePreview, setBackImagePreview] = useState<string>('');

  useEffect(() => {
    fetchPollingStations();
  }, [lac]);

  const fetchPollingStations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('polling_stations')
      .select('*')
      .eq('lac', lac)
      .order('station_name');

    if (!error && data) {
      setPollingStations(data);
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'front') {
        setFrontImage(file);
        setFrontImagePreview(URL.createObjectURL(file));
      } else {
        setBackImage(file);
        setBackImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const addGuestField = () => {
    setFormData({
      ...formData,
      eminent_guests: [...formData.eminent_guests, ''],
    });
  };

  const removeGuestField = (index: number) => {
    const newGuests = formData.eminent_guests.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      eminent_guests: newGuests.length > 0 ? newGuests : [''],
    });
  };

  const updateGuest = (index: number, value: string) => {
    const newGuests = [...formData.eminent_guests];
    newGuests[index] = value;
    setFormData({
      ...formData,
      eminent_guests: newGuests,
    });
  };

  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('man-ki-bat-images')
      .upload(path, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('man-ki-bat-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!frontImage || !backImage) {
      alert('Please upload both front and back images');
      return;
    }

    setSubmitting(true);

    try {
      const timestamp = Date.now();
      const frontImageUrl = await uploadImage(
        frontImage,
        `${lac}/${timestamp}-front-${frontImage.name}`
      );
      const backImageUrl = await uploadImage(
        backImage,
        `${lac}/${timestamp}-back-${backImage.name}`
      );

      if (!frontImageUrl || !backImageUrl) {
        alert('Failed to upload images. Please try again.');
        setSubmitting(false);
        return;
      }

      const submission: ManKiBatSubmission = {
        lac,
        polling_station: formData.polling_station,
        total_attendances: parseInt(formData.total_attendances),
        venue: formData.venue,
        eminent_guests: formData.eminent_guests.filter(g => g.trim() !== ''),
        front_image_url: frontImageUrl,
        back_image_url: backImageUrl,
      };

      const { error } = await supabase
        .from('man_ki_bat_submissions')
        .insert([submission]);

      if (error) {
        console.error('Submission error:', error);
        alert('Failed to submit form. Please try again.');
      } else {
        setSubmitted(true);
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }

    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Form Submitted Successfully!
          </h2>
          <p className="text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
            {lac.toUpperCase()}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Select Polling Station *
              </label>
              <select
                required
                value={formData.polling_station}
                onChange={(e) => setFormData({ ...formData, polling_station: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                disabled={loading}
              >
                <option value="">-- Select Polling Station --</option>
                {pollingStations.map((station) => (
                  <option key={station.id} value={station.station_name}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Total Attendances *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.total_attendances}
                onChange={(e) => setFormData({ ...formData, total_attendances: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="Enter total number of attendees"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Venue *
              </label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="Enter venue location"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-semibold">
                  Eminent Guests
                </label>
                <button
                  type="button"
                  onClick={addGuestField}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add More
                </button>
              </div>
              <div className="space-y-3">
                {formData.eminent_guests.map((guest, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={guest}
                      onChange={(e) => updateGuest(index, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      placeholder={`Guest ${index + 1} name`}
                    />
                    {formData.eminent_guests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuestField(index)}
                        className="px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload Front Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'front')}
                    className="hidden"
                    id="front-image"
                    required
                  />
                  <label htmlFor="front-image" className="cursor-pointer">
                    {frontImagePreview ? (
                      <img
                        src={frontImagePreview}
                        alt="Front preview"
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm text-gray-600">
                      {frontImage ? frontImage.name : 'Click to upload'}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload Back Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'back')}
                    className="hidden"
                    id="back-image"
                    required
                  />
                  <label htmlFor="back-image" className="cursor-pointer">
                    {backImagePreview ? (
                      <img
                        src={backImagePreview}
                        alt="Back preview"
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm text-gray-600">
                      {backImage ? backImage.name : 'Click to upload'}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 to-green-600 text-white font-bold py-4 rounded-lg hover:from-orange-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
