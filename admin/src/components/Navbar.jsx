import { useUser, useClerk } from '@clerk/clerk-react';

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user?.imageUrl && (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-gray-700 font-medium">
            {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'Admin'}
          </span>
        </div>
        <button 
          onClick={() => signOut()} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
