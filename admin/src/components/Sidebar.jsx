import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/mwork logo.png';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/workers', label: 'Workers', icon: '👷' },
    { path: '/employers', label: 'Employers', icon: '🏢' },
    { path: '/jobs', label: 'Jobs', icon: '💼' },
    { path: '/subscriptions', label: 'Subscriptions', icon: '⭐' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Logo Section */}
      <div className="bg-white border-b border-gray-700 relative">
        <img 
          src={logo} 
          alt="MworK Logo" 
          className="w-full h-auto object-cover"
        />
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              to={item.path}
              onClick={() => onClose()}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          <p>MworK Admin Panel</p>
          <p className="mt-1">© 2026 All rights reserved</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;

