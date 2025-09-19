import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="landing-hero min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto text-center p-8">
        <h1 className="text-4xl font-extrabold mb-4">CityConnect</h1>
        <p className="text-lg text-muted-foreground mb-6">Report issues in your city quickly. Track progress and make your voice heard.</p>
        <div>
          <a href="/app" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md shadow">Open App</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
