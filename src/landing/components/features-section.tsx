import React from 'react';
import { MapPin, Bell, Users, TrendingUp } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Report Issues",
      description: "Easily report problems in your neighborhood with photos and precise location."
    },
    {
      icon: <Bell className="h-8 w-8 text-blue-600" />,
      title: "Get Notified",
      description: "Receive updates when reported issues are being addressed or resolved."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Community Power",
      description: "Join forces with your neighbors to prioritize the most important issues."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Track Progress",
      description: "Follow the status of reported issues from submission to resolution."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How CityConnect Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform makes it simple to report, track, and resolve local issues together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-6 text-center card-hover"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;