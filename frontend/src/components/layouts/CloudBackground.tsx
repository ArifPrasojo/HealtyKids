import React from 'react';
import cityBottomImage from '../../assets/images/latarbawah.png';
import planeImage1 from '../../assets/images/pesawat.png';
import planeImage2 from '../../assets/images/pw2.png'; // Pesawat kuning
import planeImage3 from '../../assets/images/pw3.png'; // Pesawat ungu

interface CloudBackgroundProps {
  cloudImage?: string;
  showCityBottom?: boolean;
  showPlane?: boolean;
  planeSize?: 'small' | 'medium' | 'large' | number;
  planeCount?: number;
  planeImages?: string[]; // Array gambar pesawat custom
}

const CloudBackground: React.FC<CloudBackgroundProps> = ({ 
  cloudImage = './src/assets/images/awanhijau.png',
  showCityBottom = true,
  showPlane = true,
  planeSize = 'medium',
  planeCount = 1,
  planeImages // Opsional, jika tidak diisi akan gunakan default
}) => {
  // Default plane images jika tidak ada custom
  const defaultPlaneImages = [planeImage1, planeImage2, planeImage3];
  
  // Fungsi untuk menentukan ukuran pesawat
  const getPlaneSize = () => {
    if (typeof planeSize === 'number') {
      return planeSize;
    }
    
    switch (planeSize) {
      case 'small':
        return 60;
      case 'large':
        return 500;
      case 'medium':
      default:
        return 80;
    }
  };

  // Fungsi untuk mendapatkan gambar pesawat
  const getPlaneImage = (index: number) => {
    if (planeImages && planeImages.length > 0) {
      // Gunakan custom images, cycle jika index melebihi array
      return planeImages[index % planeImages.length];
    }
    // Gunakan default images, cycle jika index melebihi array
    return defaultPlaneImages[index % defaultPlaneImages.length];
  };

  // Fungsi untuk render pesawat
  const renderPlanes = () => {
    const planes = [];
    for (let i = 0; i < planeCount; i++) {
      planes.push(
        <img 
          key={`plane-${i}`}
          src={getPlaneImage(i)} 
          alt={`Flying Plane ${i + 1}`}
          className={`plane-flying plane-flying-${i + 1}`}
          style={{ width: `${getPlaneSize()}px` }}
        />
      );
    }
    return planes;
  };

  return (
    <div className="cloud-background relative w-full h-full pointer-events-none overflow-hidden">
      <img src={cloudImage} alt="" className="cloud-image cloud-top-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-top-right" />
      <img src={cloudImage} alt="" className="cloud-image cloud-middle-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-middle-right" />
      <img src={cloudImage} alt="" className="cloud-image cloud-bottom-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-bottom-right" />
      
      {/* Animated Planes */}
      {showPlane && (
        <div className="plane-container">
          {renderPlanes()}
        </div>
      )}
      
      {/* City Bottom Image */}
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