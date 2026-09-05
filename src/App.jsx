import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import MyField from './pages/MyField';
import NodeDetail from './pages/NodeDetail';
import Irrigation from './pages/Irrigation';
import Fertilizer from './pages/Fertilizer';
import CropSuggestion from './pages/CropSuggestion';
import Disease from './pages/Disease';
import Weather from './pages/Weather';
import News from './pages/News';
import Shop from './pages/Shop';
import Support from './pages/Support';
import Team from './pages/Team';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="/field" element={<MyField />} />
              <Route path="/field/node/:nodeId" element={<NodeDetail />} />
              <Route path="/irrigation" element={<Irrigation />} />
              <Route path="/fertilizer" element={<Fertilizer />} />
              <Route path="/crop" element={<CropSuggestion />} />
              <Route path="/disease" element={<Disease />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/news" element={<News />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/support" element={<Support />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/home" element={<Navigate to="/field" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
