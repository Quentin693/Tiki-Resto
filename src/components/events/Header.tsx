import Image from 'next/image';

export default function Header() {
  return (
    <div className="relative h-[50vh] sm:h-[60vh]">
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/videoTiki.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div>
          <img 
            src="/logos/TikiLogo.png"
            alt="Tiki Logo"
            className="w-32 h-32 sm:w-auto sm:h-auto"
          />
        </div>
        <h1 className="font-dynapuff text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
          Événements à venir
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-8 max-w-2xl">
          Découvrez nos soirées exceptionnelles et moments uniques
        </p>
        <div className="w-16 sm:w-24 h-1 bg-[#C4B5A2]"></div>
      </div>
    </div>
  );
} 