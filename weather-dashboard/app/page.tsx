"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  CITIES,
  getWeatherData,
  searchCities,
  getWeatherCondition,
  getAQILabel,
  getUVLabel,
  City,
} from "@/lib/weather";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import {
  LayoutGrid,
  Compass,
  Calendar,
  Settings,
  Search,
  MapPin,
  CloudRain,
  Navigation,
  Wind,
  Activity,
  Sunrise,
  Sunset,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BACKGROUND_IMAGES: Record<string, string> = {
  clear: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=2000&auto=format&fit=crop",
  clouds: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop",
  drizzle: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=2000&auto=format&fit=crop",
  heavyRain: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=2000&auto=format&fit=crop",
  thunderstorm: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2000&auto=format&fit=crop",
  fog: "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=2000&auto=format&fit=crop",
  snow: "https://images.unsplash.com/photo-1517299321529-639fecd1227b?q=80&w=2000&auto=format&fit=crop",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "explore" | "calendar" | "settings">("dashboard");
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [data, setData] = useState<any>(null);
  const [sideCardsData, setSideCardsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAqiFallback, setIsAqiFallback] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const convertTemp = (tempC: number) => {
    if (unit === "F") return Math.round((tempC * 9) / 5 + 32);
    return Math.round(tempC);
  };

  // Weather metrics derived values
  const currentTemp = data ? convertTemp(data.weather.current.temperature_2m) : 0;
  const windSpeed = data ? Math.round(data.weather.current.wind_speed_10m) : 0;
  const humidity = data ? data.weather.current.relative_humidity_2m : 0;
  const weatherCode = data ? data.weather.current.weather_code : 0;
  const aqiValue = data ? data.aqi : 0;
  const aqiInfo = getAQILabel(aqiValue);
  const conditionText = getWeatherCondition(weatherCode);

  const uvValue = data?.weather?.daily?.uv_index_max?.[0] ? Math.round(data.weather.daily.uv_index_max[0]) : 0;
  const uvInfo = getUVLabel(uvValue);
  const sunriseTime = data?.weather?.daily?.sunrise?.[0]
    ? new Date(data.weather.daily.sunrise[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--";
  const sunsetTime = data?.weather?.daily?.sunset?.[0]
    ? new Date(data.weather.daily.sunset[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--";

  const getDynamicBackground = () => {
    if (weatherCode === 0) return BACKGROUND_IMAGES.clear;
    if (weatherCode >= 1 && weatherCode <= 3) return BACKGROUND_IMAGES.clouds;
    if (weatherCode >= 45 && weatherCode <= 48) return BACKGROUND_IMAGES.fog;
    if (weatherCode >= 51 && weatherCode <= 67) return BACKGROUND_IMAGES.drizzle;
    if (weatherCode >= 71 && weatherCode <= 77) return BACKGROUND_IMAGES.snow;
    if (weatherCode >= 80 && weatherCode <= 82) return BACKGROUND_IMAGES.heavyRain;
    if (weatherCode >= 95) return BACKGROUND_IMAGES.thunderstorm;
    return BACKGROUND_IMAGES.clouds;
  };

  // Rain Effect Canvas
  useEffect(() => {
    if (weatherCode < 51) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const drops = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 10 + 12,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.2;

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 1, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherCode]);

  // Debounced City Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        const results = await searchCities(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Weather Data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const mainResult = await getWeatherData(selectedCity.lat, selectedCity.lon);
        setData(mainResult);
        setIsAqiFallback(mainResult?.aqi === 42);

        const sideCities = CITIES.slice(1, 4);
        const sideResults = await Promise.all(sideCities.map((c) => getWeatherData(c.lat, c.lon)));

        setSideCardsData(
          sideCities.map((city, idx) => ({
            ...city,
            temp: Math.round(sideResults[idx].weather.current.temperature_2m),
            condition: getWeatherCondition(sideResults[idx].weather.current.weather_code),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setIsAqiFallback(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCity]);

  // Memoized Hourly Forecast Data
  const hourlyList = useMemo(() => {
    if (!data?.weather?.hourly?.time) return [];

    const times: string[] = data.weather.hourly.time;
    const temps: number[] = data.weather.hourly.temperature_2m;
    const codes: number[] = data.weather.hourly.weather_code;

    const now = new Date();
    const currentHourIndex = times.findIndex((t) => new Date(t) >= now);
    const startIndex = currentHourIndex !== -1 ? currentHourIndex : 0;

    return times.slice(startIndex, startIndex + 12).map((timeStr: string, idx: number) => ({
      time: new Date(timeStr).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
      temp: convertTemp(temps[startIndex + idx]),
      code: codes[startIndex + idx],
    }));
  }, [data, unit]);

  const chartData = useMemo(
    () => hourlyList.slice(0, 6).map((item) => ({ day: item.time, temp: item.temp })),
    [hourlyList]
  );

  return (
    <main className="min-h-screen bg-[#0d131a] text-slate-100 flex items-center justify-center p-2 md:p-6 relative overflow-x-hidden font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-80"
        style={{ backgroundImage: `url('${getDynamicBackground()}')` }}
      />

      {weatherCode >= 51 && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-60" />
      )}

      <div className="w-full max-w-6xl min-h-[85vh] md:h-[90vh] frosted-card rounded-2xl md:rounded-[2.5rem] flex flex-col md:flex-row relative z-10 overflow-hidden border border-white/20 shadow-2xl">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-20 frosted-glass border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col justify-between items-center p-4 md:py-6">
          <div className="flex md:flex-col items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-start">
            <Compass className="text-white animate-spin-slow" size={24} />

            <nav className="flex md:flex-col gap-4 md:gap-6">
              {[
                { id: "dashboard", icon: <LayoutGrid size={20} /> },
                { id: "explore", icon: <Compass size={20} /> },
                { id: "calendar", icon: <Calendar size={20} /> },
                { id: "settings", icon: <Settings size={20} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`p-2.5 rounded-xl transition-all ${
                    activeTab === item.id ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    setSelectedCity({
                      name: "GPS Location",
                      lat: pos.coords.latitude,
                      lon: pos.coords.longitude,
                    });
                  });
                }
              }}
              title="Use My GPS Location"
              className="text-cyan-400 hover:text-cyan-300"
            >
              <Navigation size={20} />
            </button>
          </div>
        </aside>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 md:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-slate-400 text-[10px] md:text-xs">Live Weather Dashboard</p>
              <h2 className="text-base md:text-lg font-bold text-white">{selectedCity.name}</h2>
            </div>

            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full frosted-glass text-slate-200"
              >
                <Search size={16} />
              </button>

              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-12 right-0 w-64 md:w-72 bg-[#121926]/95 border border-white/20 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl z-50"
                  >
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none"
                      autoFocus
                    />
                    {searchResults.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                        {searchResults.map((city, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedCity(city);
                              setShowSearch(false);
                              setSearchQuery("");
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-white/10 rounded-lg flex justify-between"
                          >
                            <span>{city.name}</span>
                            <span className="text-[10px] text-slate-400">{city.state || city.country}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <>
              <div className="my-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white/10 border border-white/20 text-slate-300">
                    Live Updates
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${aqiInfo.color}`}>
                    <Activity size={12} /> AQI {aqiValue} • {aqiInfo.label}
                  </span>
                  {isAqiFallback && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                      Estimated / Offline
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-white">{conditionText}</h1>
                <p className="text-slate-300 text-xs max-w-md">
                  Currently {conditionText.toLowerCase()} in {selectedCity.name}. Wind speed is {windSpeed} km/h with humidity at {humidity}%.
                </p>
              </div>

              {/* Hourly Forecast */}
              <div className="space-y-1 my-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hourly Forecast</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {hourlyList.map((item, i) => (
                    <div
                      key={i}
                      className="min-w-[4.5rem] p-2.5 rounded-xl frosted-glass border border-white/10 text-center flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                      <span className="text-xs font-bold text-white">{item.temp}°{unit}</span>
                      <span className="text-[9px] text-cyan-300 truncate w-full">{getWeatherCondition(item.code)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
    <div className="w-full h-28 md:h-32 min-h-[112px] relative mt-1 [&_.recharts-surface]:overflow-visible">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
      <defs>
        <linearGradient id="waveGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-slate-900/90 border border-white/20 px-2.5 py-1 rounded-lg text-xs text-white backdrop-blur-md shadow-lg">
                {payload[0].value}°{unit}
              </div>
            );
          }
          return null;
        }}
      />
      <Area
        type="monotone"
        dataKey="temp"
        stroke="#ffffff"
        strokeWidth={2.5}
        fill="url(#waveGlow)"
        fillOpacity={1}
        isAnimationActive={false}
      />
    </AreaChart>
  </ResponsiveContainer>
</div>
            </>
          )}

          {/* EXPLORE TAB */}
          {activeTab === "explore" && (
            <div className="my-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h3 className="text-lg font-bold text-white">Explore Weather Insights</h3>
                <p className="text-slate-400 text-xs">Detailed environmental metrics for {selectedCity.name}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl frosted-glass border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs font-semibold">Sunrise</span>
                    <Sunrise size={18} className="text-amber-400" />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-extrabold text-white">{sunriseTime}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Morning dawn</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl frosted-glass border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs font-semibold">Sunset</span>
                    <Sunset size={18} className="text-orange-400" />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-extrabold text-white">{sunsetTime}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Evening dusk</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl frosted-glass border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs font-semibold">UV Index</span>
                    <Sun size={18} className="text-yellow-400" />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-extrabold text-white">{uvValue}</p>
                    <span className={`text-[10px] font-bold ${uvInfo.color}`}>{uvInfo.label} Risk</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl frosted-glass border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs font-semibold">Humidity</span>
                    <CloudRain size={18} className="text-cyan-400" />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-extrabold text-white">{humidity}%</p>
                    <p className="text-[10px] text-slate-400 mt-1">{humidity > 60 ? "High moisture" : "Comfortable"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl frosted-glass border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs font-semibold">Wind Speed</span>
                    <Wind size={18} className="text-teal-400" />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-extrabold text-white">
                      {windSpeed} <span className="text-xs font-normal">km/h</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{windSpeed > 20 ? "Breezy" : "Gentle"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl frosted-glass border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs font-semibold">Air Quality</span>
                    <Activity size={18} className="text-emerald-400" />
                  </div>
                  <div className="mt-3 flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-extrabold text-white">{aqiValue}</p>
                      {isAqiFallback && (
                        <span className="px-1.5 py-0.5 text-[9px] font-medium bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                          Estimated
                        </span>
                      )}
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${aqiInfo.color}`}>
                      {aqiInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORECAST TAB */}
          {activeTab === "calendar" && (
            <div className="my-4 space-y-2 max-h-[50vh] overflow-y-auto">
              <h3 className="text-base font-bold text-white mb-2">5-Day Forecast</h3>
              {data?.weather?.daily?.time.slice(0, 5).map((dateStr: string, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl frosted-glass text-xs">
                  <span className="font-bold text-white">
                    {new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-slate-300">{getWeatherCondition(data.weather.daily.weather_code[i])}</span>
                  <span className="font-bold text-amber-300">
                    {convertTemp(data.weather.daily.temperature_2m_max[i])}° /{" "}
                    {convertTemp(data.weather.daily.temperature_2m_min[i])}°
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="my-4 space-y-4 max-w-md">
              <h3 className="text-base font-bold text-white">Settings</h3>
              <div className="p-4 rounded-xl frosted-glass flex justify-between items-center">
                <span className="text-xs text-slate-200 font-semibold">Temperature Unit</span>
                <div className="flex bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setUnit("C")}
                    className={`px-3 py-1 rounded-md text-xs font-bold ${
                      unit === "C" ? "bg-indigo-600 text-white" : "text-slate-400"
                    }`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setUnit("F")}
                    className={`px-3 py-1 rounded-md text-xs font-bold ${
                      unit === "F" ? "bg-indigo-600 text-white" : "text-slate-400"
                    }`}
                  >
                    °F
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-80 p-4 md:p-6 flex flex-col justify-between frosted-glass border-t md:border-t-0 md:border-l border-white/10 space-y-4">
          <div className="frosted-glass p-5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
              <MapPin size={14} className="text-rose-400" />
              <span>{selectedCity.name}</span>
            </div>
            <div className="text-4xl md:text-5xl font-black text-white mb-3">
              {loading ? "--" : `${currentTemp}°${unit}`}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Wind size={14} /> {windSpeed} km/h
              </span>
              <span>•</span>
              <span>{humidity}% Humidity</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Popular Cities</p>
            {sideCardsData.map((city, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCity(city)}
                className="w-full p-3 rounded-xl frosted-glass border border-white/10 hover:bg-white/10 flex justify-between items-center"
              >
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">{city.name}</h4>
                  <p className="text-[10px] text-slate-300">{city.condition}</p>
                </div>
                <span className="text-sm font-bold text-white">{convertTemp(city.temp)}°{unit}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}