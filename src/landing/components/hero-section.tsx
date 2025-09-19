import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h1 className="text-5xl font-extrabold mb-4">CityConnect — Report city issues, get them fixed</h1>
        <p className="text-lg text-muted-foreground mb-6">Quickly report potholes, broken lights, garbage and more. Track progress and join community efforts.</p>
        <div className="flex justify-center">
          <a href="/app" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md shadow">Open App</a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
