import { useQueries } from '@tanstack/react-query';
import API from '../services/api';
import PageLoader from '../components/PageLoader';

const Dashboard = () => {
  const queries = useQueries({
    queries: [
      { queryKey: ['workers'], queryFn: () => API.get('/admin/workers').then(res => res.data.workers) },
      { queryKey: ['employers'], queryFn: () => API.get('/admin/employers').then(res => res.data.employers) },
      { queryKey: ['jobs'], queryFn: () => API.get('/admin/jobs').then(res => res.data.jobs) },
      { queryKey: ['subscriptions'], queryFn: () => API.get('/admin/subscriptions').then(res => res.data.subscriptions) },
    ],
  });

  if (queries.some(q => q.isLoading)) {
    return <PageLoader message="Loading dashboard data..." />;
  }
  
  if (queries.some(q => q.isError)) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading dashboard data. Please try again.
        </div>
      </div>
    );
  }

  const [workers, employers, jobs, subscriptions] = queries.map(q => q.data || []);

  // Calculate stats
  const activeSubscriptions = subscriptions.filter(s => s.isActive).length;
  const activeJobs = jobs.filter(j => j.status === 'ACTIVE').length;
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED').length;

  const stats = [
    {
      title: 'Total Workers',
      value: workers.length,
      icon: '👷',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Registered workers'
    },
    {
      title: 'Total Employers',
      value: employers.length,
      icon: '🏢',
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Active employers'
    },
    {
      title: 'Active Jobs',
      value: activeJobs,
      icon: '💼',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${completedJobs} completed`
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: '⭐',
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: `${subscriptions.length} total`
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </div>
              <h3 className="text-gray-600 font-medium text-sm mb-1">{stat.title}</h3>
              <p className="text-gray-400 text-xs">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Jobs</h3>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job, index) => (
              <div key={job._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.location}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                  job.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
            {jobs.length === 0 && (
              <p className="text-center text-gray-400 py-8">No jobs yet</p>
            )}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Subscriptions</h3>
          <div className="space-y-3">
            {subscriptions.slice(0, 5).map((sub, index) => (
              <div key={sub._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{sub.workerId?.fullName || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{sub.workerId?.phoneNumber || 'N/A'}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  sub.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {sub.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
            {subscriptions.length === 0 && (
              <p className="text-center text-gray-400 py-8">No subscriptions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{((activeJobs / (jobs.length || 1)) * 100).toFixed(0)}%</div>
            <div className="text-indigo-100 text-sm mt-1">Job Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{((activeSubscriptions / (subscriptions.length || 1)) * 100).toFixed(0)}%</div>
            <div className="text-indigo-100 text-sm mt-1">Active Subscriptions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{workers.length + employers.length}</div>
            <div className="text-indigo-100 text-sm mt-1">Total Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
