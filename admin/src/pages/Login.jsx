import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">MworK Admin</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none"
              }
            }}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
