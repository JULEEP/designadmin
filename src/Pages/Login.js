import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Fixed credentials
    const validEmail = 'admin@gmail.com';
    const validPassword = 'admin@123';

    // Simulate API delay
    setTimeout(() => {
      if (email === validEmail && password === validPassword) {
        // Store admin data in localStorage
        localStorage.setItem('adminId', 'admin123');
        localStorage.setItem('name', 'Admin User');
        localStorage.setItem('email', email);
        localStorage.setItem('token', 'demo-token-123456');
        localStorage.setItem('role', 'admin');

        // Log the adminId to check if it's stored correctly
        console.log('Admin ID saved to localStorage:', localStorage.getItem('adminId'));
        console.log('Login successful for:', email);

        // Redirect to the dashboard after successful login
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Use admin@gmail.com / admin@123');
      }
      setIsLoading(false);
    }, 1000); // 1 second delay to simulate API call
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/hand-painted-watercolor-background-with-sky-clouds-shape_24972-1095.jpg?t=st=1746429807~exp=1746433407~hmac=e3434110c0769d2ad42bd54e0534379335887da5831a723df88f4f74891e28d2&w=1380')",
      }}
    >
      <div className="bg-white/70 backdrop-blur-md shadow-2xl rounded-xl w-full max-w-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left - Form */}
          <div className="p-8 sm:p-10 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-center flex justify-center items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ADMIN
                </span>
                <span className="text-black">DASHBOARD</span>
              </h1>
              <p className="text-gray-700 text-sm mt-1">Admin Login</p>
              
              {/* Demo credentials hint */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 font-medium">
                  Demo Credentials:
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Email: <span className="font-bold">admin@gmail.com</span>
                </p>
                <p className="text-xs text-blue-600">
                  Password: <span className="font-bold">admin@123</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 text-red-600 bg-red-100 rounded-md shadow-sm text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full px-4 py-3 mt-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin@123"
                  className="w-full px-4 py-3 mt-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 text-white text-sm font-medium rounded-full transition duration-200
                  ${isLoading
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02]'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>

              {/* Auto-fill button for quick testing */}
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@gmail.com');
                  setPassword('admin@123');
                }}
                className="w-full py-2 px-4 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition duration-200"
              >
                Auto-fill Demo Credentials
              </button>
            </form>
          </div>

          {/* Right - Illustration */}
          <div className="hidden md:block">
            <img
              src="https://mir-s3-cdn-cf.behance.net/projects/original/ec753e129429523.61a1e79332f16.png"
              alt="Vendor Login Illustration"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;