import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import API from '../services/api';
import PageLoader from '../components/PageLoader';
import showToast from '../utils/toast';

const Subscriptions = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: subscriptions, isLoading, isError } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => API.get('/admin/subscriptions').then(res => res.data.subscriptions),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id) => API.patch(`/admin/subscriptions/deactivate/${id}`),
    onSuccess: () => {
      showToast.success('Subscription deactivated successfully');
      queryClient.invalidateQueries(['subscriptions']);
    },
    onError: () => {
      // Error is already handled by API interceptor
    }
  });

  if (isLoading) return <PageLoader message="Loading subscriptions..." />;
  if (isError) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Failed to load subscriptions. Please try again.
      </div>
    </div>
  );

  const filteredSubscriptions = subscriptions?.filter(sub => {
    const matchesStatus = filterStatus === 'ALL' || 
      (filterStatus === 'ACTIVE' && sub.isActive) ||
      (filterStatus === 'INACTIVE' && !sub.isActive);
    const matchesSearch = sub.workerId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.workerId?.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  const statusCounts = {
    ALL: subscriptions?.length || 0,
    ACTIVE: subscriptions?.filter(s => s.isActive).length || 0,
    INACTIVE: subscriptions?.filter(s => !s.isActive).length || 0,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Worker Subscriptions</h2>
          <p className="text-gray-500 mt-1">{subscriptions?.length || 0} total subscriptions</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status} ({count})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by worker name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'ALL' ? 'No subscriptions found matching your criteria.' : 'No subscriptions yet.'}
            </p>
          </div>
        ) : (
          filteredSubscriptions.map(sub => (
            <div key={sub._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
              {/* Worker Info */}
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {sub.workerId?.fullName?.charAt(0) || '?'}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {sub.workerId?.fullName || 'Unknown Worker'}
                  </h3>
                  <p className="text-sm text-gray-500">{sub.workerId?.phoneNumber || 'No phone'}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                  sub.isActive 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}>
                  {sub.isActive ? '✓ Active' : '○ Inactive'}
                </span>
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-4">
                {sub.startDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Started:</span>
                    <span className="text-gray-900">{new Date(sub.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {sub.expiresAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Expires:</span>
                    <span className="text-gray-900">{new Date(sub.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {sub.isActive && (
                <button
                  onClick={() => deactivateMutation.mutate(sub._id)}
                  disabled={deactivateMutation.isPending}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  {deactivateMutation.isPending ? 'Deactivating...' : 'Deactivate'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
