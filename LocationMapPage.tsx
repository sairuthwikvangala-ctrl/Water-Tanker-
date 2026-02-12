
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface LocationData {
  address: string;
  landmark: string;
  coordinates: { lat: number; lng: number } | null;
  isAutoDetected: boolean;
  intelligence?: {
    terrain: string;
    accessibility: string;
    neighborhood: string;
  };
}

interface LocationMapPageProps {
  onNavigate: (page: number) => void;
  location: LocationData;
  setLocation: React.Dispatch<React.SetStateAction<LocationData>>;
}

const LocationMapPage: React.FC<LocationMapPageProps> = ({ onNavigate, location, setLocation }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * AI-powered search triggered by Enter key.
   * Finds the location and updates the map focus.
   */
  const handleSearch = async () => {
    const query = searchValue.trim();
    if (!query) return;

    setIsSearching(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Locate this place for heavy tanker delivery: "${query}". 
        Provide the official landmark name, full address, and GPS coordinates (lat, lng).
        Return in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              address: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER }
            },
            required: ["name", "address", "lat", "lng"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      if (result.lat && result.lng) {
        setLocation({
          address: result.address,
          landmark: result.name,
          coordinates: { lat: result.lat, lng: result.lng },
          isAutoDetected: true
        });
        setSearchValue(result.name);
      } else {
        setError("Location not found.");
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError("Search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Enhanced Geolocation with 'Detecting' Animation and Auto-Focus
   */
  const detectLocation = () => {
    setIsDetecting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("GPS not supported by browser.");
      setIsDetecting(false);
      return;
    }

    // Small timeout to allow the animation to be seen
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const res = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `Reverse geocode these coordinates: ${latitude}, ${longitude}. Give me the exact address and a 1-word landmark name. Return JSON.`,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    address: { type: Type.STRING },
                    landmark: { type: Type.STRING }
                  }
                }
              }
            });
            const data = JSON.parse(res.text || '{}');
            
            // This update triggers the map focus change via getMapUrl
            setLocation({
              address: data.address || "Current GPS Point",
              landmark: data.landmark || "Current Location",
              coordinates: { lat: latitude, lng: longitude },
              isAutoDetected: true
            });
          } catch (e) {
            setLocation({
              address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
              landmark: "GPS Pin",
              coordinates: { lat: latitude, lng: longitude },
              isAutoDetected: true
            });
          } finally {
            setIsDetecting(false);
          }
        },
        (err) => {
          setError("Location access denied.");
          setIsDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }, 2000); // 2 second animation delay for 'Detecting your location'
  };

  /**
   * Returns a map URL centered on current coordinates (defaulting to Karimnagar)
   * bbox values are adjusted to "zoom in" on the new coordinates.
   */
  const getMapUrl = () => {
    const lat = location.coordinates?.lat ?? 18.4386;
    const lng = location.coordinates?.lng ?? 79.1288;
    // Bounding box: [minLng, minLat, maxLng, maxLat]
    // Zoom factor approx 0.0025 degrees for a detailed "house-level" focus
    const zoom = 0.0025;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - zoom},${lat - zoom},${lng + zoom},${lat + zoom}&layer=mapnik&marker=${lat},${lng}`;
  };

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden bg-white font-sans transition-colors duration-300">
      
      {/* Premium Detection Animation Overlay */}
      {isDetecting && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl animate-fade-in">
           <div className="relative flex h-48 w-48 items-center justify-center mb-10">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/10"></div>
              <div className="absolute inset-8 animate-ping rounded-full bg-primary/20" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute inset-16 animate-ping rounded-full bg-primary/30" style={{ animationDelay: '0.8s' }}></div>
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl border-2 border-slate-50">
                 <span className="material-symbols-outlined text-primary text-5xl font-black animate-bounce">location_searching</span>
              </div>
           </div>
           <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Detecting your location</h2>
              <p className="text-sm font-bold text-slate-400">Locking onto GPS satellites...</p>
           </div>
           <div className="absolute bottom-20 w-3/4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]"></div>
           </div>
        </div>
      )}

      {/* Simplified Search UI (No Find Landmark Button) */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center gap-3">
             <button 
              onClick={() => onNavigate(6)} 
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-xl transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined text-slate-800">arrow_back_ios_new</span>
            </button>
            <div className="flex-1 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-xl">
               <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">Delivery Location</h2>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative group">
            <div className="flex h-14 items-stretch rounded-2xl border border-slate-100 bg-white shadow-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
              <div className="flex items-center pl-4 text-primary">
                <span className="material-symbols-outlined font-bold">search</span>
              </div>
              <input 
                className="flex-1 bg-transparent px-3 text-base font-bold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-medium" 
                placeholder="Search Karimnagar..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {isSearching && (
                <div className="flex items-center pr-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-2 text-rose-500 text-[10px] font-black uppercase tracking-wider bg-rose-50 p-2 rounded-lg border border-rose-100 text-center animate-shake">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Map View - Clean White Minimalist Style */}
      <div className="relative flex-1 bg-white overflow-hidden">
        <iframe 
          title="Minimalist Map"
          className="absolute inset-0 h-full w-full border-0 transition-all duration-1000 grayscale-[0.95] contrast-[1.1] brightness-[1.1] sepia-[0.1]"
          src={getMapUrl()}
        ></iframe>

        {/* Minimal Marker UI */}
        {location.coordinates && !isDetecting && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center -translate-y-8">
               <div className="absolute h-12 w-12 animate-ping rounded-full bg-primary/10"></div>
               <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl border-4 border-primary">
                  <span className="material-symbols-outlined text-primary text-4xl font-black">water_drop</span>
               </div>
               <div className="absolute bottom-0 h-1.5 w-6 rounded-full bg-black/10 blur-[2px]"></div>
            </div>
          </div>
        )}

        {/* Small floating FAB for re-centering */}
        <button 
          onClick={detectLocation}
          className="absolute bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/40 active:scale-95 z-40 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl font-black">my_location</span>
        </button>
      </div>

      {/* Confimation Card */}
      <div className="bg-white p-6 pb-12 shadow-[0_-15px_60px_rgba(0,0,0,0.08)] z-50 rounded-t-[40px] border-t border-slate-50 animate-slide-up">
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <span className="material-symbols-outlined text-3xl font-black">pin_drop</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-slate-900 leading-none mb-2 truncate">
              {location.landmark || "Karimnagar City"}
            </h3>
            <p className="text-sm font-semibold text-slate-400 leading-snug line-clamp-2">
              {location.address}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={detectLocation}
            className="flex-1 h-16 rounded-2xl bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Auto Detect
          </button>
          <button 
            onClick={() => onNavigate(8)}
            className="flex-[2] h-16 rounded-2xl bg-primary text-white text-base font-black shadow-xl shadow-primary/20 transition-all hover:bg-primary/95 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Confirm Site</span>
            <span className="material-symbols-outlined font-bold">verified</span>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}} />
    </div>
  );
};

export default LocationMapPage;
