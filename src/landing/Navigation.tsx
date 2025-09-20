import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between bg-white/60 backdrop-blur-md dark:bg-black/40">
      <div className="flex items-center gap-3">
        <div className="font-bold">CityConnect</div>
      </div>
      <div className="space-x-4">
        <a href="/login" className="text-sm">Sign in</a>
        <a href="/register" className="text-sm font-semibold ml-2">Create account</a>
      </div>
    </nav>
  );
}

export default Navigation;
