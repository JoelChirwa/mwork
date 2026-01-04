import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workers from './pages/Workers';
import Employers from './pages/Employers';
import Jobs from './pages/Jobs';
import Subscriptions from './pages/Subscriptions';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const RequireAdmin = ({ children, user }) => {
  const { signOut } = useClerk();
  
  if (!user) return <div>Loading...</div>;
  if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6">This admin panel is restricted to authorized administrators only.</p>
          <button
            onClick={() => signOut()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }
  return children;
};

function App() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <SignedIn>
        <RequireAdmin user={user}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
              <div className="p-4 md:p-6 bg-gray-100 flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/workers" element={<Workers />} />
                  <Route path="/employers" element={<Employers />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          </div>
        </RequireAdmin>
      </SignedIn>
      <SignedOut>
        <Routes>
          <Route path="/*" element={<Login />} />
        </Routes>
      </SignedOut>
    </>
  );
}

export default App;
