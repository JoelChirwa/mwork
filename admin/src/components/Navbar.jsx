import { useUser, useClerk } from '@clerk/clerk-react';

const Navbar = ({ onMenuClick }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg md:text-xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          {user?.imageUrl && (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="hidden md:block text-gray-700 font-medium">
            {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'Admin'}
          </span>
        </div>
        <button 
          onClick={() => signOut()} 
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 md:px-4 text-sm md:text-base rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
