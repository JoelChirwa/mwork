import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import API from '../services/api';
import PageLoader from '../components/PageLoader';

const Employers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: employers, isLoading, isError } = useQuery({
    queryKey: ['employers'],
    queryFn: () => API.get('/admin/employers').then(res => res.data.employers)
  });

  if (isLoading) return <PageLoader message="Loading employers..." />;
  if (isError) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Failed to load employers. Please try again.
      </div>
    </div>
  );

  const filteredEmployers = employers?.filter(employer =>
    employer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Employers</h2>
          <p className="text-gray-500 mt-1">{employers?.length || 0} total employers</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Employers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployers.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">
              {searchTerm ? 'No employers found matching your search.' : 'No employers yet.'}
            </p>
          </div>
        ) : (
          filteredEmployers.map(employer => (
            <div key={employer._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start space-x-4">
                {employer.profileImageUrl ? (
                  <img className="h-16 w-16 rounded-full" src={employer.profileImageUrl} alt="" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xl">
                    {employer.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{employer.fullName}</h3>
                  {employer.companyName && (
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      🏢 {employer.companyName}
                    </p>
                  )}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">📧</span>
                      <span className="ml-2 truncate">{employer.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">📞</span>
                      <span className="ml-2">{employer.phoneNumber}</span>
                    </div>
                    {employer.location?.district && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">📍</span>
                        <span className="ml-2">{employer.location.district}</span>
                      </div>
                    )}
                  </div>
                  {employer.profileCompleted && (
                    <div className="mt-3">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        ✓ Profile Complete
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Employers;
