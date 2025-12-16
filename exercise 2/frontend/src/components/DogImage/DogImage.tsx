import { useState, useEffect } from 'react';
import './DogImage.css';

interface DogImageProps {
  imageUrl: string;
  isLoading?: boolean;
}

export const DogImage = ({ imageUrl, isLoading }: DogImageProps) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl);

  useEffect(() => {
    // Si la URL cambió, resetear el estado y cargar la nueva imagen
    if (imageUrl !== currentImageUrl) {
      setImageLoaded(false);
      setCurrentImageUrl(imageUrl);
    }
    
    // Pre-cargar la imagen actual
    if (!imageLoaded) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
      };
      img.onerror = () => {
        setImageLoaded(true); // Mostrar la imagen aunque falle para evitar loop infinito
      };
      img.src = imageUrl;
    }
  }, [imageUrl, imageLoaded, currentImageUrl]);

  const showLoading = isLoading || !imageLoaded;

  return (
    <div className="dog-image-container">
      {showLoading ? (
        <div className="dog-image-loading">Cargando imagen...</div>
      ) : (
        <img 
          src={currentImageUrl} 
          alt="Adivina la raza de este perro" 
          className="dog-image"
        />
      )}
    </div>
  );
};

