import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="p-6 border rounded">Report Issues</div>
        <div className="p-6 border rounded">Track Progress</div>
        <div className="p-6 border rounded">Community Votes</div>
      </div>
    </section>
  );
}

export default FeaturesSection;
