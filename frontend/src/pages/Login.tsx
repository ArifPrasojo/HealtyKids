import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSignUpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!signInData.email || !signInData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) {
        onLogin();
      }
      navigate('/dashboard');
    }, 1500);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      // Switch to sign in after successful registration
      switchToSignIn();
    }, 1500);
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setError('');
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-1/3 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block relative w-full max-w-4xl">
        <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 h-[600px]">
          
          {/* Sign In Form Container - Left Side */}
          <div className={`absolute left-0 top-0 w-1/2 h-full p-12 flex flex-col justify-center z-10 transition-all duration-1000 ease-in-out ${
            isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          }`}>
            <div className="w-full max-w-sm mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
                <p className="text-gray-600 text-sm">
                  Welcome back to HealthyKids
                </p>
              </div>

              <div className="text-center text-sm text-gray-500 mb-6">
                or use your email password
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                {error && !isSignUp && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2 text-sm">⚠️</span>
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={signInData.email}
                    onChange={handleSignInInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Email"
                  />
                </div>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={signInData.password}
                    onChange={handleSignInInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
                  >
                    Forget Your Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>SIGNING IN...</span>
                    </div>
                  ) : (
                    <span>SIGN IN</span>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Sign Up Form Container - Right Side */}
          <div className={`absolute right-0 top-0 w-1/2 h-full p-12 flex flex-col justify-center z-10 transition-all duration-1000 ease-in-out ${
            isSignUp ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="w-full max-w-sm mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                <p className="text-gray-600 text-sm">
                  Join HealthyKids today
                </p>
              </div>

              <div className="text-center text-sm text-gray-500 mb-4">
                or use your email for registration
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                {error && isSignUp && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2 text-sm">⚠️</span>
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={signUpData.name}
                    onChange={handleSignUpInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Name"
                  />
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={signUpData.email}
                    onChange={handleSignUpInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={signUpData.password}
                    onChange={handleSignUpInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Password"
                  />
                </div>

                <div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={signUpData.confirmPassword}
                    onChange={handleSignUpInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Confirm Password"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-70 mt-4"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>CREATING ACCOUNT...</span>
                    </div>
                  ) : (
                    <span>SIGN UP</span>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Moving Purple Panel */}
          <div className={`absolute top-0 h-full w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 transition-all duration-1000 ease-in-out ${
            isSignUp ? 'left-0 rounded-r-[3rem]' : 'left-1/2 rounded-l-[3rem]'
          }`}>
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 opacity-10 transform -rotate-12 -translate-x-16 -translate-y-16">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 opacity-10 transform rotate-12 translate-x-12 translate-y-12">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10 h-full p-12 flex flex-col justify-center text-white text-center">
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <img 
                    src="/logo.png" 
                    alt="HealthyKids Logo" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <span 
                    className="text-3xl font-bold text-white hidden"
                    style={{ display: 'none' }}
                  >
                    🌟
                  </span>
                </div>
              </div>
              
              {/* Panel Content Container */}
              <div className="relative h-48">
                {/* Sign In Panel Content (When showing Sign In form - promote Sign Up) */}
                <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  isSignUp ? 'opacity-0 pointer-events-none transform -translate-x-8' : 'opacity-100 pointer-events-auto transform translate-x-0'
                }`}>
                  <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
                  <p className="text-purple-100 text-base mb-8 leading-relaxed">
                    Register with your personal details to use all of site features
                  </p>
                  <button
                    onClick={switchToSignUp}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/30"
                  >
                    SIGN UP
                  </button>
                </div>

                {/* Sign Up Panel Content (When showing Sign Up form - promote Sign In) */}
                <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  isSignUp ? 'opacity-100 pointer-events-auto transform translate-x-0' : 'opacity-0 pointer-events-none transform translate-x-8'
                }`}>
                  <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                  <p className="text-purple-100 text-base mb-8 leading-relaxed">
                    To keep connected with us please login with your personal info
                  </p>
                  <button
                    onClick={switchToSignIn}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/30"
                  >
                    SIGN IN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden">
          
          {/* Mobile Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-8 py-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 transform rotate-12 translate-x-6 -translate-y-6">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              {/* Mobile Logo */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <img 
                    src="/logo.png" 
                    alt="HealthyKids Logo" 
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <span 
                    className="text-2xl font-bold text-white hidden"
                    style={{ display: 'none' }}
                  >
                    🌟
                  </span>
                </div>
              </div>
              
              <h1 className="text-xl font-bold mb-2">HealthyKids</h1>
              <p className="text-purple-100 text-sm">
                Platform Pembelajaran Kesehatan Remaja
              </p>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="p-6">
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              <button
                onClick={switchToSignIn}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-500 ${
                  !isSignUp 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={switchToSignUp}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-500 ${
                  isSignUp 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Form Content */}
            <div className="relative overflow-hidden">
              {/* Sign In Form */}
              <div className={`transition-all duration-700 ease-in-out ${
                !isSignUp ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-full absolute inset-0 pointer-events-none'
              }`}>
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {error && !isSignUp && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">⚠️</span>
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <input
                      name="email"
                      type="email"
                      required
                      value={signInData.email}
                      onChange={handleSignInInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Email"
                    />
                  </div>

                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={signInData.password}
                      onChange={handleSignInInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </form>
              </div>

              {/* Sign Up Form */}
              <div className={`transition-all duration-700 ease-in-out ${
                isSignUp ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full absolute inset-0 pointer-events-none'
              }`}>
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {error && isSignUp && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">⚠️</span>
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <input
                      name="name"
                      type="text"
                      required
                      value={signUpData.name}
                      onChange={handleSignUpInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Full Name"
                    />
                  </div>

                  <div>
                    <input
                      name="email"
                      type="email"
                      required
                      value={signUpData.email}
                      onChange={handleSignUpInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Email"
                    />
                  </div>

                  <div>
                    <input
                      name="password"
                      type="password"
                      required
                      value={signUpData.password}
                      onChange={handleSignUpInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Password"
                    />
                  </div>

                  <div>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={signUpData.confirmPassword}
                      onChange={handleSignUpInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Confirm Password"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <span>Sign Up</span>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2024 HealthyKids. Platform pembelajaran kesehatan untuk remaja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;