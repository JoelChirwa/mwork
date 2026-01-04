import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import API from '../services/api';
import PageLoader from '../components/PageLoader';
import showToast from '../utils/toast';

const Workers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: workers, isLoading, isError } = useQuery({
    queryKey: ['workers'],
    queryFn: () => API.get('/admin/workers').then(res => res.data.workers)
  });

  const suspendMutation = useMutation({
    mutationFn: ({ userId, reason }) => API.post(`/admin/suspend/${userId}`, { reason }),
    onSuccess: () => {
      showToast.success('Worker suspended successfully');
      queryClient.invalidateQueries(['workers']);
    },
  });

  const unsuspendMutation = useMutation({
    mutationFn: (userId) => API.post(`/admin/unsuspend/${userId}`),
    onSuccess: () => {
      showToast.success('Worker unsuspended successfully');
      queryClient.invalidateQueries(['workers']);
    },
  });

  if (isLoading) return <PageLoader message="Loading workers..." />;
  if (isError) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Failed to load workers. Please try again.
      </div>
    </div>
  );

  const filteredWorkers = workers?.filter(worker =>
    worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.phoneNumber.includes(searchTerm)
  ) || [];

  const handleSuspend = (worker) => {
    const reason = prompt('Enter suspension reason:');
    if (reason) {
      suspendMutation.mutate({ userId: worker._id, reason });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Workers</h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">{workers?.length || 0} total workers</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No workers found matching your search.' : 'No workers yet.'}
                  </td>
                </tr>
              ) : (
                filteredWorkers.map(worker => (
                  <tr key={worker._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {worker.profileImageUrl ? (
                            <img className="h-10 w-10 rounded-full" src={worker.profileImageUrl} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {worker.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{worker.fullName}</div>
                          <div className="text-sm text-gray-500">{worker.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{worker.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {worker.skills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {worker.skills?.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            +{worker.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {worker.location?.district || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {worker.isSuspended ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {worker.isSuspended ? (
                        <button
                          onClick={() => unsuspendMutation.mutate(worker._id)}
                          disabled={unsuspendMutation.isPending}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(worker)}
                          disabled={suspendMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Workers;
