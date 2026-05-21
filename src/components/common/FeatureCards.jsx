// FeatureCards.jsx — wrapped with React.memo (TC1)
// Static data; never needs to re-render due to parent state changes

import { memo }                                    from 'react';
import { Plane, Calendar, DollarSign, Users }      from 'lucide-react';

const FEATURES = [
  { icon: <Plane    className="text-blue-500"   size={48} />, title: 'Flight Status',  subtitle: 'Track any flight'      },
  { icon: <Calendar className="text-purple-500" size={48} />, title: 'Online Check-in',subtitle: 'Login required'         },
  { icon: <DollarSign className="text-blue-400" size={48} />, title: 'Baggage Policy', subtitle: 'Know before you go'     },
  { icon: <Users    className="text-pink-500"   size={48} />, title: 'Join Airways+',  subtitle: 'Earn miles & rewards'   },
];

const FeatureCards = memo(function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 py-12">
      {FEATURES.map((feature) => (
        <div
          key={feature.title}
          className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex justify-center mb-3">{feature.icon}</div>
          <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.subtitle}</p>
        </div>
      ))}
    </div>
  );
});

export default FeatureCards;