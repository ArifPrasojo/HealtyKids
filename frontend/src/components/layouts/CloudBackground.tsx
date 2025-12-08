import React from 'react';
import cityBottomImage from '../../assets/images/latarbawah.png';
interface CloudBackgroundProps {
  cloudImage?: string;
  showCityBottom?: boolean;
}

const CloudBackground: React.FC<CloudBackgroundProps> = ({ 
  cloudImage = './src/assets/images/awanhijau.png',
  showCityBottom = true
}) => {
  return (
    <div className="cloud-background relative w-full h-full pointer-events-none">
      <img src={cloudImage} alt="" className="cloud-image cloud-top-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-top-right" />
      <img src={cloudImage} alt="" className="cloud-image cloud-middle-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-middle-right" />
      <img src={cloudImage} alt="" className="cloud-image cloud-bottom-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-bottom-right" />
      
      {/* City Bottom Image - Sesuaikan posisi dengan style */}
      {showCityBottom && (
        <img 
          src={cityBottomImage} 
          alt="City Scene" 
          className="absolute w-full object-cover"
          style={{ 
            bottom: '0',       
            left: '0',          
            height: '200px',    
            objectPosition: 'bottom center',
            opacity: 0.5
          }} 
        />
      )}
    </div>
  );
};

export default CloudBackground;