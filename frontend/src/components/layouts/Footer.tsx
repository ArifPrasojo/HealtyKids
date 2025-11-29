import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 w-full mt-auto">
      <div className="w-full px-6 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <img 
                src="/src/assets/images/logo.png" 
                alt="HealthyKids Logo" 
                className="w-6 h-6 rounded-lg object-cover"
              />
              <span className="text-lg font-bold text-gray-800">HealthyKids</span>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Platform pembelajaran kesehatan untuk remaja dengan metode interaktif dan menyenangkan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Quick Links</h4>
            <div className="grid grid-cols-2 gap-1">
              <a href="#" className="text-gray-600 hover:text-purple-600 text-xs transition-colors">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 text-xs transition-colors">Materi</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 text-xs transition-colors">Quiz</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 text-xs transition-colors">Progress</a>
            </div>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Support</h4>
            <div className="space-y-1 mb-3">
              <p className="text-gray-600 text-xs">support@healthykids.com</p>
              <p className="text-gray-600 text-xs">+62 123 456 7890</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-purple-600 text-xs transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-purple-600 text-xs transition-colors">Terms</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs">© 2025 HealthyKids. All rights reserved.</p>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <span className="text-xs text-gray-400">Made with</span>
              <span className="text-red-500 text-xs">❤️</span>
              <span className="text-xs text-gray-400">for healthy learning</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;