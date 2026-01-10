// src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import CloudBackground from '../components/layouts/CloudBackground';
// Tambahkan import icon baru untuk Alert
import { Eye, EyeOff, CheckCircle2, AlertCircle, X } from 'lucide-react'; 
import { loginService } from '../services/api/loginService';

interface LoginProps {
  onLogin?: (role: 'admin' | 'siswa') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Hapus state error string biasa, ganti dengan state object Alert
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fungsi menutup alert
  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  // --- LOGIKA UTAMA ---
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginService.login({
        username: signInData.email,
        password: signInData.password
      });

      let appRole: 'admin' | 'siswa';
      const apiRole = data.user?.role; 

      if (apiRole === 'teacher' || apiRole === 'admin') {
        appRole = 'admin';
      } else {
        appRole = 'siswa';
      }

      const userToSave = {
        ...data.user, 
        role: appRole 
      };

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userToSave));

      // --- CUSTOM ALERT SUKSES ---
      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Login Berhasil!',
        message: `Selamat datang kembali, ${data.user?.nama || "Pengguna" }`,
      });

      // Beri jeda sedikit agar user bisa melihat alert sebelum pindah halaman
      setTimeout(() => {
        onLogin?.(appRole);
        if (appRole === 'admin') {
            navigate('/admin/dashboard'); 
        } else {
            navigate('/dashboard');
        }
      }, 1500);

} catch (error: any) {
      console.error("Login Error:", error);

      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Login Gagal',
        // PERUBAHAN DI SINI:
        // Kita paksa pakai teks bahasa Indonesia, abaikan pesan bahasa Inggris dari server
        message: 'Username atau password salah. Silakan coba lagi.',
      });

    } finally {
      setIsLoading(false);
    }
  };

  const switchToAbout = () => {
    setShowAbout(true);
  };

  const switchToSignIn = () => {
    setShowAbout(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4 relative">
      
      {/* --- CUSTOM ALERT MANUAL (MODAL) --- */}
      {alert.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            {/* Header Color Bar */}
            <div className={`h-2 w-full ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
            
            <div className="p-6 text-center relative">
              {/* Close Button (X) */}
              <button 
                onClick={closeAlert}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`rounded-full p-3 ${alert.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {alert.type === 'success' ? (
                    <CheckCircle2 size={32} className="text-green-600" />
                  ) : (
                    <AlertCircle size={32} className="text-red-600" />
                  )}
                </div>
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {alert.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {alert.message}
              </p>

              {/* Button */}
              <button
                onClick={closeAlert}
                className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                  alert.type === 'success' 
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                } shadow-lg`}
              >
                {alert.type === 'success' ? 'Lanjutkan' : 'Coba Lagi'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END CUSTOM ALERT --- */}


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
                  Welcome back to Sexophone
                </p>
              </div>
              <form onSubmit={handleSignInSubmit} className="space-y-4 md:space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email / Username
                  </label>
                  <input
                    type="text" 
                    id="email"
                    name="email"
                    value={signInData.email}
                    onChange={handleSignInInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Masukkan username atau email"
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

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
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tentang Sexophone</h1>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">📱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Sex Education On Phone</h3>
                    <p className="text-sm text-gray-600">
                      Platform pendidikan kesehatan reproduksi dan seksualitas yang aman dan mudah diakses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">🎓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Materi Edukatif</h3>
                    <p className="text-sm text-gray-600">
                      Informasi akurat tentang pubertas, kesehatan reproduksi, dan hubungan sehat untuk remaja.
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
                      Memberikan pengetahuan yang tepat agar remaja dapat membuat keputusan yang bijak.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Aman & Terpercaya</h3>
                    <p className="text-sm text-gray-600">
                      Konten berbasis sains, dikurasi oleh ahli, dan disampaikan dengan pendekatan yang ramah remaja.
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
            <div className="absolute top-0 left-0 w-64 h-64 opacity-10 transform -rotate-12 -translate-x-16 -translate-y-16">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 opacity-10 transform rotate-12 translate-x-12 translate-y-12">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10 h-full p-12 flex flex-col justify-center text-white text-center">
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
                  <span style={{ display: 'none' }}>🌟</span>
                </div>
              </div>
              
              <div className="relative h-48">
                <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  showAbout ? 'opacity-0 pointer-events-none transform -translate-x-8' : 'opacity-100 pointer-events-auto transform translate-x-0'
                }`}>
                  <h2 className="text-3xl font-bold mb-4">Tentang Sexophone</h2>
                  <p className="text-green-100 text-base mb-8 leading-relaxed">
                    Platform pendidikan seksualitas yang aman dan terpercaya untuk remaja Indonesia
                  </p>
                  <button
                    onClick={switchToAbout}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/30"
                  >
                    TENTANG KAMI
                  </button>
                </div>

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
                  <span style={{ display: 'none' }}>🌟</span>
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
              <div className={`transition-all duration-700 ease-in-out ${
                !showAbout ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-full absolute inset-0 pointer-events-none'
              }`}>
                <form onSubmit={handleSignInSubmit} className="space-y-3">
                  
                  <div>
                    <input
                      name="email"
                      type="text" 
                      required
                      value={signInData.email}
                      onChange={handleSignInInputChange}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-green-500 transition-all duration-200 bg-gray-50 text-sm"
                      placeholder="Email / Username"
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
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                      <span className="text-green-600">📱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">Sex Education On Phone</h3>
                      <p className="text-xs text-gray-600">
                        Pendidikan kesehatan reproduksi yang aman dan mudah diakses di ponselmu.
                      </p>
                    </div>
                  </div>
                  {/* ... other about items ... */}
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">🎓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">Materi Edukatif</h3>
                      <p className="text-xs text-gray-600">
                        Informasi akurat tentang pubertas, kesehatan reproduksi, dan hubungan sehat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2024 Sexophone. Platform pendidikan seksualitas untuk remaja Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;