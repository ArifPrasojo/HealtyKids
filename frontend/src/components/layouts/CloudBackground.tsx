import React from 'react';

interface CloudBackgroundProps {
  cloudImage?: string;
}

const CloudBackground: React.FC<CloudBackgroundProps> = ({ 
  cloudImage = './src/assets/images/awanhijau.png' 
}) => {
  return (
    <div className="cloud-background">
      <img src={cloudImage} alt="" className="cloud-image cloud-top-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-top-right" />
      <img src={cloudImage} alt="" className="cloud-image cloud-middle-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-middle-right" />
      <img src={cloudImage} alt="" className="cloud-image cloud-bottom-left" />
      <img src={cloudImage} alt="" className="cloud-image cloud-bottom-right" />
    </div>
  );
};

export default CloudBackground;