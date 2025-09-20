import React from 'react';
import { MapPin } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CityConnect</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#community" className="text-gray-700 hover:text-blue-600 transition-colors">Community</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <a 
            href="/login" 
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Sign In
          </a>
          <a 
            href="/register" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navigation;