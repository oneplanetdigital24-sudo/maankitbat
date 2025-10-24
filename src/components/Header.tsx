import { Flag } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-500 via-white to-green-600 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <Flag className="w-10 h-10 text-orange-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            MP PRADAN BARUAH
          </h1>
        </div>
      </div>
    </header>
  );
}
