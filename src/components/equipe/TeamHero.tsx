"use client"

export default function TeamHero() {
  return (
    <div className="relative h-screen max-h-[800px] min-h-[600px]">
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2"
        >
          <source src="/Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="w-48 md:w-64 mb-8">
          <img 
            src="/logos/TikiLogo.png"
            alt="Tiki Logo"
            className="w-full h-auto"
          />
        </div>
        <h1 className="font-dynapuff text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
          Notre équipe
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl">
          Une passion commune : vous faire voyager à travers nos saveurs
        </p>
        <div className="w-24 h-1 bg-[#C4B5A2]"></div>
      </div>
    </div>
  );
} 