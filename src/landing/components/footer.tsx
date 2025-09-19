import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-12 bg-muted">
      <div className="max-w-6xl mx-auto text-center text-sm">© {new Date().getFullYear()} CityConnect</div>
    </footer>
  );
}

export default Footer;
