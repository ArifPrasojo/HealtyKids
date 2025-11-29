import React from 'react';

interface StatsCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  description?: string;
  icon: string;
  gradient: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  subtitle,
  value,
  description,
  icon,
  gradient,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl ${className}`}>
      {/* Color Strip */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradient}`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center mr-3`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
        {description && (
          <p className="text-gray-500 text-sm">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;