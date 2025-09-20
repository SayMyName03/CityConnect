import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden gradient-bg">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Connect with your <span className="text-gradient">community</span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Report local issues, track their progress, and help make your neighborhood a better place to live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/app" 
              className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium hover:bg-blue-700"
            >
              Get Started
            </a>
            <a 
              href="#features" 
              className="px-8 py-4 bg-white text-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium border border-gray-200"
            >
              Learn More
            </a>
          </div>
        </div>
        
        <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
          <div className="aspect-video bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500">App preview image</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;