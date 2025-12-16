import './DogImage.css';

interface DogImageProps {
  imageUrl: string;
  isLoading?: boolean;
}

export const DogImage = ({ imageUrl, isLoading }: DogImageProps) => {
  return (
    <div className="dog-image-container">
      {isLoading ? (
        <div className="dog-image-loading">Cargando imagen...</div>
      ) : (
        <img 
          src={imageUrl} 
          alt="Adivina la raza de este perro" 
          className="dog-image"
        />
      )}
    </div>
  );
};

