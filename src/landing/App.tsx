import React from 'react';
import Navigation from './components/navigation';
import Hero from './components/hero-section';
import Features from './components/features-section';
import CTA from './components/cta-section';
import Footer from './components/footer';

const App: React.FC = () => {
  return (
    <div className="landing-root">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
