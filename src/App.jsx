import React, { useState } from 'react';

// Screens
import LandingScreen from './screens/LandingScreen';
import AuthScreen from './screens/AuthScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import HealthScreen from './screens/HealthScreen';
import AskMaitriScreen from './screens/AskMaitriScreen';
import CommunityScreen from './screens/CommunityScreen';
import SettingsScreen from './screens/SettingsScreen';

// Layout
import BottomNav from './components/layout/BottomNav';

export default function App() {
  const [screen, setScreen] = useState('landing');

  // Router overlay setup
  const navigate = (newScreen) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScreen(newScreen);
  };

  const showBottomNav = ['home', 'health', 'askMaitri', 'community', 'settings'].includes(screen);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] font-sans text-[var(--color-text-primary)] selection:bg-[var(--color-brand-secondary)] selection:text-[var(--color-text-primary)]">
      {/* 
        Removed the phone-only max-w-[430px] container. 
        Components now handle their own max-width and internal responsiveness.
      */}
      <main className="relative min-h-screen">
        {screen === 'landing' && <LandingScreen onNavigate={navigate} />}
        {screen === 'auth' && <AuthScreen onNavigate={navigate} />}
        {screen === 'onboarding' && <OnboardingScreen onNavigate={navigate} />}

        {screen === 'home' && <HomeScreen />}
        {screen === 'health' && <HealthScreen />}
        {screen === 'askMaitri' && <AskMaitriScreen />}
        {screen === 'community' && <CommunityScreen />}
        {screen === 'settings' && <SettingsScreen onNavigate={navigate} />}

        {showBottomNav && <BottomNav active={screen} onChange={navigate} />}
      </main>
    </div>
  );
}
