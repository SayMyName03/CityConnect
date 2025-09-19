import React from 'react';

const Navigation: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 bg-white/80 dark:bg-black/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-lg font-bold">CityConnect</div>
        <nav className="space-x-4">
          <a href="/app" className="text-sm">Open App</a>
          <a href="/login" className="text-sm">Sign in</a>
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
