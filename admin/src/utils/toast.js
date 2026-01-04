import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  promise: (promise, messages) => {
    return toast.promise(promise, messages, {
      success: {
        style: {
          background: '#10b981',
          color: '#fff',
        },
      },
      error: {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      },
      loading: {
        style: {
          background: '#3b82f6',
          color: '#fff',
        },
      },
    });
  },

  custom: (message, options = {}) => {
    toast(message, options);
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

export default showToast;
