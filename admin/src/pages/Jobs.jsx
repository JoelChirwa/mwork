import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import API from '../services/api';
import PageLoader from '../components/PageLoader';

const Jobs = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: jobs, isLoading, isError } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => API.get('/admin/jobs').then(res => res.data.jobs),
  });

  if (isLoading) return <PageLoader message="Loading jobs..." />;
  if (isError) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Failed to load jobs. Please try again.
      </div>
    </div>
  );

  const filteredJobs = jobs?.filter(job => {
    const matchesStatus = filterStatus === 'ALL' || job.status === filterStatus;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.district?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  const statusCounts = {
    ALL: jobs?.length || 0,
    OPEN: jobs?.filter(j => j.status === 'OPEN').length || 0,
    ASSIGNED: jobs?.filter(j => j.status === 'ASSIGNED').length || 0,
    COMPLETED: jobs?.filter(j => j.status === 'COMPLETED').length || 0,
    CANCELLED: jobs?.filter(j => j.status === 'CANCELLED').length || 0,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Jobs</h2>
          <p className="text-gray-500 mt-1">{jobs?.length || 0} total jobs</p>
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
          placeholder="Search by job title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'ALL' ? 'No jobs found matching your criteria.' : 'No jobs yet.'}
            </p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">📍</span>
                  <span className="ml-2">{job.location?.district || 'Not specified'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">🏢</span>
                  <span className="ml-2">{job.employerId?.fullName || 'Unknown'}</span>
                  {job.employerId?.companyName && (
                    <span className="text-gray-400 ml-1">({job.employerId.companyName})</span>
                  )}
                </div>
                {job.category && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">🏷️</span>
                    <span className="ml-2">{job.category}</span>
                  </div>
                )}
              </div>

              {job.assignedWorkerId && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {job.assignedWorkerId.fullName?.charAt(0)}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">
                        {job.assignedWorkerId.fullName}
                      </p>
                      <p className="text-xs text-gray-500">Assigned Worker</p>
                    </div>
                  </div>
                </div>
              )}

              {job.proposals && job.proposals.length > 0 && job.status === 'OPEN' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    💼 {job.proposals.length} proposal{job.proposals.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;
