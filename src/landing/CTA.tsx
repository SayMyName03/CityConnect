import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-12 bg-transparent text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Join your community</h2>
        <p className="mb-6 text-muted-foreground">Create an account to start reporting issues near you and follow their progress.</p>
        <a href="/register" className="px-5 py-3 rounded bg-primary text-primary-foreground">Create account</a>
      </div>
    </section>
  );
}

export default CTA;
