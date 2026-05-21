// RouteTransitionBar.jsx
// TC8 — shows a thin animated bar at the top during route transitions
//        disappears when new route finishes loading

import { useNavigation } from 'react-router-dom';

const RouteTransitionBar = () => {
  const navigation = useNavigation();
  const isLoading  = navigation.state === 'loading';

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-indigo-100 overflow-hidden">
      <div className="h-full bg-indigo-600 animate-[routeBar_1.2s_ease-in-out_infinite]" />
      <style>{`
        @keyframes routeBar {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default RouteTransitionBar;