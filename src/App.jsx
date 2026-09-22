import React from 'react';
import { DemoProvider, useDemo } from './context/DemoContext';
import DemoStateBar from './components/common/DemoStateBar';

// Pages
import LandingPage from './pages/LandingPage';
import CitizenLogin from './pages/citizen/CitizenLogin';
import CitizenLocation from './pages/citizen/CitizenLocation';
import CitizenHome from './pages/citizen/CitizenHome';
import CitizenRiskMap from './pages/citizen/CitizenRiskMap';
import CitizenWarning from './pages/citizen/CitizenWarning';
import CitizenShelter from './pages/citizen/CitizenShelter';
import CitizenAlerts from './pages/citizen/CitizenAlerts';
import CitizenSOS from './pages/citizen/CitizenSOS';
import CitizenProfile from './pages/citizen/CitizenProfile';

import OfficerLogin from './pages/officer/OfficerLogin';
import OfficerCommandCenter from './pages/officer/OfficerCommandCenter';
import OfficerActiveEvent from './pages/officer/OfficerActiveEvent';
import OfficerAnalysis from './pages/officer/OfficerAnalysis';
import OfficerImpactAlert from './pages/officer/OfficerImpactAlert';
import OfficerLiveSOS from './pages/officer/OfficerLiveSOS';
import OfficerHistory from './pages/officer/OfficerHistory';

function AppRouter() {
  const { currentView } = useDemo();

  switch (currentView) {
    // Citizen Flow
    case 'citizen-login':
      return <CitizenLogin />;
    case 'citizen-location':
      return <CitizenLocation />;
    case 'citizen-home':
      return <CitizenHome />;
    case 'citizen-map':
      return <CitizenRiskMap />;
    case 'citizen-warning':
      return <CitizenWarning />;
    case 'citizen-shelter':
      return <CitizenShelter />;
    case 'citizen-alerts':
      return <CitizenAlerts />;
    case 'citizen-sos':
      return <CitizenSOS />;
    case 'citizen-profile':
      return <CitizenProfile />;

    // Officer Flow
    case 'officer-login':
      return <OfficerLogin />;
    case 'officer-command':
      return <OfficerCommandCenter />;
    case 'officer-event':
      return <OfficerActiveEvent />;
    case 'officer-analysis':
      return <OfficerAnalysis />;
    case 'officer-impact':
      return <OfficerImpactAlert />;
    case 'officer-live':
      return <OfficerLiveSOS />;
    case 'officer-history':
      return <OfficerHistory />;

    // Landing Page
    case 'landing':
    default:
      return <LandingPage />;
  }
}

function MainLayout() {
  const { currentView } = useDemo();
  return (
    <div style={{ minHeight: '100vh', background: '#080D1A', display: 'flex', flexDirection: 'column' }}>
      {/* Weather Scenario Controller Bar only on internal app views */}
      {currentView !== 'landing' && <DemoStateBar />}

      {/* Dynamic Route Screen */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppRouter />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <MainLayout />
    </DemoProvider>
  );
}
