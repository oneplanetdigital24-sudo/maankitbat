export default function Footer() {
  return (
    <footer className="bg-orange-600 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} Pradan Baruah. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
