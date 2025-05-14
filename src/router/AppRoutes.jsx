import { Routes, Route } from 'react-router-dom';
import UrlMonitor from '../pages/UrlMonitor';
import SalesMonitor from '../pages/SalesMonitor';
import EventDiscovery from '../pages/EventDiscovery';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UrlMonitor />} />
      <Route path="/sales" element={<SalesMonitor />} />
      <Route path="/tickets" element={<EventDiscovery />} />
    </Routes>
  );
}