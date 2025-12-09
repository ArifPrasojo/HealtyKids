import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import CloudBackground from '../components/layouts/CloudBackground';

interface LoginProps {
  onLogin?: (role: 'admin' | 'siswa') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
    // Hapus field role
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
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulasi login - ganti dengan API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dummy authentication logic - otomatis deteksi role berdasarkan email
      let role: 'admin' | 'siswa';
      if (signInData.email.includes('admin') || signInData.email === 'admin@healthykids.com') {
        role = 'admin';
      } else {
        role = 'siswa';
      }

      // Validasi credentials
      const validCredentials = [
        { email: 'admin@healthykids.com', password: 'admin123', role: 'admin' as const },
        { email: 'siswa@healthykids.com', password: 'siswa123', role: 'siswa' as const },
        // Tambah lebih banyak jika perlu
      ];

      const isValid = validCredentials.some(
        cred => cred.email === signInData.email && cred.password === signInData.password
      );

      if (!isValid) {
        throw new Error('Email atau password salah');
      }

      onLogin?.(role);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToAbout = () => {
    setShowAbout(true);
    setError('');
  };

  const switchToSignIn = () => {
    setShowAbout(false);
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4 relative">
      {/* Cloud Background */}
      <CloudBackground planeCount={3} planeSize="large"/>
      
      {/* Desktop Layout */}
      <div className="hidden lg:block relative w-full max-w-4xl z-10">
        <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 h-[600px]">
          
          {/* Sign In Form Container - Left Side */}
          <div className={`absolute left-0 top-0 w-1/2 h-full p-12 flex flex-col justify-center z-10 transition-all duration-1000 ease-in-out ${
            showAbout ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
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

              <form onSubmit={handleSignInSubmit} className="space-y-4 md:space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={signInData.email}
                    onChange={handleSignInInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Masukkan email Anda"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={signInData.password}
                      onChange={handleSignInInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Masukkan password Anda"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Hapus Role Selection */}

                {/* Error Message */}
                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Sedang Masuk...' : 'Masuk'}
                </button>
              </form>
            </div>
          </div>

          {/* About Us Container - Right Side */}
          <div className={`absolute right-0 top-0 w-1/2 h-full p-12 flex flex-col justify-center z-10 transition-all duration-1000 ease-in-out ${
            showAbout ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="w-full max-w-sm mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tentang Kami</h1>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">🌱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Platform Edukasi</h3>
                    <p className="text-sm text-gray-600">
                      HealthyKids adalah platform pembelajaran kesehatan yang dirancang khusus untuk remaja.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">📚</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Konten Interaktif</h3>
                    <p className="text-sm text-gray-600">
                      Menyediakan materi kesehatan, quiz interaktif, dan video edukatif yang mudah dipahami.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Tujuan Kami</h3>
                    <p className="text-sm text-gray-600">
                      Membantu remaja memahami pentingnya kesehatan dan pola hidup sehat sejak dini.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">✨</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Fitur Unggulan</h3>
                    <p className="text-sm text-gray-600">
                      Progress tracking, badges achievement, dan komunitas belajar yang supportif.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Moving Green Panel */}
          <div className={`absolute top-0 h-full w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 transition-all duration-1000 ease-in-out ${
            showAbout ? 'left-0 rounded-r-[3rem]' : 'left-1/2 rounded-l-[3rem]'
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
                {/* Sign In Panel Content (When showing Sign In form - promote About) */}
                <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  showAbout ? 'opacity-0 pointer-events-none transform -translate-x-8' : 'opacity-100 pointer-events-auto transform translate-x-0'
                }`}>
                  <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
                  <p className="text-green-100 text-base mb-8 leading-relaxed">
                    Kenali lebih dekat platform pembelajaran kesehatan untuk remaja
                  </p>
                  <button
                    onClick={switchToAbout}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/30"
                  >
                    TENTANG KAMI
                  </button>
                </div>

                {/* About Panel Content (When showing About - promote Sign In) */}
                <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  showAbout ? 'opacity-100 pointer-events-auto transform translate-x-0' : 'opacity-0 pointer-events-none transform translate-x-8'
                }`}>
                  <h2 className="text-3xl font-bold mb-4">Selamat Datang!</h2>
                  <p className="text-green-100 text-base mb-8 leading-relaxed">
                    Sudah punya akun? Masuk untuk melanjutkan perjalanan belajarmu
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
      <div className="lg:hidden relative w-full max-w-md z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden">
          
          {/* Mobile Header */}
          <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 px-8 py-8 text-center text-white relative overflow-hidden">
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
              <p className="text-green-100 text-sm">
                Platform Pembelajaran Kesehatan Remaja
              </p>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="p-5">
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              <button
                onClick={switchToSignIn}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-500 ${
                  !showAbout 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={switchToAbout}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-500 ${
                  showAbout 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Tentang Kami
              </button>
            </div>

            {/* Mobile Form Content */}
            <div className="relative overflow-hidden">
              {/* Sign In Form */}
              <div className={`transition-all duration-700 ease-in-out ${
                !showAbout ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-full absolute inset-0 pointer-events-none'
              }`}>
                <form onSubmit={handleSignInSubmit} className="space-y-3">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-2.5">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2 text-xs">⚠️</span>
                        <span className="text-red-700 text-xs">{error}</span>
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
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-green-500 transition-all duration-200 bg-gray-50 text-sm"
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
                      className="w-full px-3 py-2 pr-9 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-green-500 transition-all duration-200 bg-gray-50 text-sm"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-70 text-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </form>
              </div>

              {/* About Us Content */}
              <div className={`transition-all duration-700 ease-in-out ${
                showAbout ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full absolute inset-0 pointer-events-none'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">🌱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">Platform Edukasi</h3>
                      <p className="text-xs text-gray-600">
                        Platform pembelajaran kesehatan dirancang khusus untuk remaja.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">📚</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">Konten Interaktif</h3>
                      <p className="text-xs text-gray-600">
                        Materi kesehatan, quiz interaktif, dan video edukatif yang mudah dipahami.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">Tujuan Kami</h3>
                      <p className="text-xs text-gray-600">
                        Membantu remaja memahami pentingnya kesehatan dan pola hidup sehat.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">✨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">Fitur Unggulan</h3>
                      <p className="text-xs text-gray-600">
                        Progress tracking, badges achievement, dan komunitas belajar.
                      </p>
                    </div>
                  </div>
                </div>
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