export interface City {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

export const CITIES: City[] = [
  { name: "Pune", lat: 18.5204, lon: 73.8567, state: "Maharashtra" },
  { name: "Mumbai", lat: 19.0760, lon: 72.8777, state: "Maharashtra" },
  { name: "Delhi", lat: 28.6139, lon: 77.2090, state: "Delhi" },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946, state: "Karnataka" },
  { name: "London", lat: 51.5074, lon: -0.1278, country: "UK" },
  { name: "New York", lat: 40.7128, lon: -74.0060, country: "USA" }
];

export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((item: any) => ({
      name: item.name,
      lat: item.latitude,
      lon: item.longitude,
      state: item.admin1 || item.country,
      country: item.country,
    }));
  } catch (err) {
    return [];
  }
}

export async function getWeatherData(lat: number, lon: number) {
  // Weather Data + Sunrise, Sunset, UV Index
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max&timezone=auto`
  );
  const weatherData = await weatherRes.json();

  // Air Quality Fetch
  let aqiValue = 42;
  try {
    const aqiRes = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
    );
    const aqiData = await aqiRes.json();
    if (aqiData?.current?.us_aqi) {
      aqiValue = aqiData.current.us_aqi;
    }
  } catch (e) {
    console.warn("AQI fetch failed, using default");
  }

  return {
    weather: weatherData,
    aqi: aqiValue,
  };
}

export function getWeatherCondition(code: number) {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Drizzle & Rain";
  if (code >= 71 && code <= 77) return "Snowfall";
  if (code >= 80 && code <= 82) return "Heavy Showers";
  if (code >= 95) return "Thunderstorm";
  return "Cloudy";
}

export function getAQILabel(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
  if (aqi <= 100) return { label: "Moderate", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
  if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" };
  if (aqi <= 200) return { label: "Unhealthy", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
  return { label: "Hazardous", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" };
}

export function getUVLabel(uv: number) {
  if (uv <= 2) return { label: "Low", color: "text-emerald-400" };
  if (uv <= 5) return { label: "Moderate", color: "text-amber-400" };
  if (uv <= 7) return { label: "High", color: "text-orange-400" };
  if (uv <= 10) return { label: "Very High", color: "text-rose-400" };
  return { label: "Extreme", color: "text-purple-400" };
}