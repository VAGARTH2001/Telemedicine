import React, { useState } from "react";

// Use backend proxy to avoid CORS when fetching from NPI API
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse";

const SPECIALTIES = [
  "Cardiology",
  "Internal Medicine",
  "Family Medicine",
  "Pediatrics",
  "Dermatology",
  "Psychiatry",
  "Orthopedic Surgery",
  "Neurology",
  "Ophthalmology",
  "Obstetrics and Gynecology",
  "Anesthesiology",
  "Emergency Medicine",
  "Radiology",
  "Pathology",
  "General Practice",
  "Nephrology",
  "Pulmonology",
  "Endocrinology",
  "Gastroenterology",
  "Urology",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

function parseLocation(locationStr) {
  const trimmed = (locationStr || "").trim();
  if (!trimmed) return {};
  // ZIP: 5 digits or 5+4
  if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
    return { postal_code: trimmed };
  }
  // "City, ST" or "City, State"
  const comma = trimmed.indexOf(",");
  if (comma > 0) {
    const city = trimmed.slice(0, comma).trim();
    const statePart = trimmed.slice(comma + 1).trim();
    const state = US_STATES.includes(statePart.toUpperCase())
      ? statePart.toUpperCase()
      : statePart;
    return { city, state };
  }
  // Single word: treat as state if it's a valid abbreviation
  const upper = trimmed.toUpperCase();
  if (US_STATES.includes(upper)) return { state: upper };
  return { city: trimmed };
}

async function reverseGeocode(lat, lon) {
  const url = `${NOMINATIM_REVERSE}?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "TelemedicineFindDoctor/1.0",
    },
  });
  if (!res.ok) throw new Error("Failed to get address");
  const data = await res.json();
  const addr = data.address || {};
  const city = addr.city || addr.town || addr.village || addr.county || "";
  const state = addr.state || "";
  if (city && state) return `${city}, ${state}`;
  if (data.display_name) return data.display_name.split(",").slice(0, 2).join(",").trim();
  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}

async function searchDoctors(params) {
  const search = new URLSearchParams();
  search.set("limit", "50");
  if (params.taxonomy_description) search.set("taxonomy_description", params.taxonomy_description);
  if (params.state) search.set("state", params.state);
  if (params.city) search.set("city", params.city);
  if (params.postal_code) search.set("postal_code", params.postal_code);
  const url = `${API_BASE}/api/doctors?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Search failed");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function getProviderDisplayName(result) {
  const basic = result.basic || {};
  const first = basic.first_name || "";
  const last = basic.last_name || "";
  if (first || last) return [first, last].filter(Boolean).join(" ");
  const org = result.organization_name || "";
  return org || "Provider";
}

function getTaxonomy(result) {
  const tax = result.taxonomies || [];
  const primary = tax.find((t) => t.primary) || tax[0];
  return primary ? primary.desc || primary.taxonomy_description : "";
}

function getAddress(result) {
  const addrs = result.addresses || [];
  const practice = addrs.find((a) => a.address_purpose === "LOCATION") || addrs[0];
  if (!practice) return "";
  const parts = [
    practice.address_1,
    practice.address_2,
    practice.city,
    practice.state,
    practice.postal_code,
  ].filter(Boolean);
  return parts.join(", ");
}

const Find_Doctor = () => {
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [useLocationLoading, setUseLocationLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  const handleUseMyLocation = () => {
    setError("");
    setUseLocationLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setUseLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const address = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setLocation(address);
        } catch (e) {
          setError("Could not get address from your location.");
        } finally {
          setUseLocationLoading(false);
        }
      },
      () => {
        setError("Location access denied or unavailable.");
        setUseLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSearch = async () => {
    setError("");
    setResults([]);
    const locParams = parseLocation(location);
    const hasLocation = locParams.city || locParams.postal_code || locParams.state;
    if (!specialty.trim() && !hasLocation) {
      setError("Please enter a location and/or specialty.");
      return;
    }
    // NPI API requires at least one other criterion when using state only
    if (locParams.state && !locParams.city && !locParams.postal_code && !specialty.trim()) {
      setError("When searching by state only, please also select a specialty.");
      return;
    }
    setSearchLoading(true);
    try {
      const params = {
        ...locParams,
        ...(specialty.trim() ? { taxonomy_description: specialty.trim() } : {}),
      };
      if (params.state && !params.city && !params.postal_code) {
        params.city = ""; // NPI needs another criterion; use taxonomy or add a placeholder
      }
      const list = await searchDoctors(params);
      setResults(list);
      if (list.length === 0) setError("No providers found. Try different location or specialty.");
    } catch (e) {
      setError(e.message || "Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="FindDoctor bg-gray-50 min-h-screen">
      {/* Header - same style as Appointment */}
      <div className="main lg:text-4xl font-semibold font-serif lg:w-[90vw] w-screen lg:h-[150px] h-auto min-h-[80px] lg:ml-20 lg:mt-5 bg-blue-100 rounded-lg tracking-wide text-blue-900 pl-5 pt-3 pb-3 lg:pt-5 text-xl shadow-md">
        Find a Doctor
      </div>

      {/* Search section */}
      <div className="input px-4 lg:px-0">
        <div className="content md:flex">
          <div className="svg md:block md:ml-60 md:mt-10 flex justify-center mt-6">
            <svg
              width="80"
              height="80"
              viewBox="0 0 111 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M98.1091 79.222H68.7761C68.1011 79.222 67.5537 78.6749 67.5537 77.9996V70.6664C67.5537 69.9912 68.1009 69.4441 68.7761 69.4441H72.4427L72.4409 41.5908L72.4378 41.4809C72.4287 40.8662 72.8778 40.3405 73.4863 40.2533C74.1452 40.1586 74.8083 40.1108 75.4574 40.1108H85.5613C93.1545 40.1108 99.3318 46.2881 99.3318 53.881V77.9996C99.3315 78.6746 98.7844 79.222 98.1091 79.222ZM69.9982 76.7775H96.887V53.881C96.887 47.6359 91.8061 42.5553 85.5613 42.5553H75.4574C75.2688 42.5553 75.0784 42.5604 74.8872 42.5703V70.6664C74.8872 71.3414 74.34 71.8886 73.6648 71.8886H69.9982V76.7775Z"
                fill="#4062BB"
                stroke="#4062BB"
                strokeWidth="2"
              />
              <path
                d="M73.6673 71.8883H34.5564C33.8814 71.8883 33.334 71.3414 33.334 70.6662V41.6586C33.334 34.0657 39.5113 27.8884 47.1042 27.8884H61.1192C68.5947 27.8884 74.7697 33.9694 74.8843 41.4441L74.8863 41.5047C74.8879 41.5559 74.8897 41.6071 74.8897 41.6586V70.6662C74.8897 71.3414 74.3425 71.8883 73.6673 71.8883ZM35.7787 69.4441H72.4452L72.4434 41.5911L72.4403 41.4809C72.3459 35.3344 67.2675 30.3331 61.1192 30.3331H47.1042C40.8591 30.3331 35.7785 35.4138 35.7785 41.6589V69.4441H35.7787Z"
                fill="#4062BB"
                stroke="#4062BB"
                strokeWidth="2"
              />
              <path
                d="M54.1119 23.0001C48.0466 23.0001 43.1118 18.0656 43.1118 12.0001C43.1118 5.9345 48.0463 1 54.1119 1C60.1774 1 65.1119 5.93476 65.1119 12.0001C65.1119 18.0653 60.1777 23.0001 54.1119 23.0001ZM54.1119 3.44474C49.3944 3.44474 45.5563 7.2826 45.5563 12.0003C45.5563 16.7178 49.3944 20.5559 54.1119 20.5559C58.8293 20.5559 62.6674 16.7178 62.6674 12.0003C62.6677 7.2826 58.8296 3.44474 54.1119 3.44474Z"
                fill="#4062BB"
                stroke="#4062BB"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="para md:mt-9 flex-1">
            <p className="special font-serif md:text-5xl md:ml-7 md:font-semibold text-2xl ml-[5vw] font-bold text-blue-950">
              Search by location & specialty
            </p>
            <p className="md:ml-7 md:mt-3 md:text-xl font-medium font-serif ml-[5vw] text-blue-950">
              Enter a city/state (e.g. New York, NY) or ZIP code, and choose a specialty.
            </p>
          </div>
        </div>

        <div className="bar max-w-2xl mx-auto md:ml-[22vw] md:mx-0 mt-6 space-y-4">
          <div>
            <label className="block font-serif font-medium text-blue-950 mb-1">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Brooklyn, NY or 10001"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-serif text-blue-950 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={useLocationLoading}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white font-serif font-semibold hover:bg-blue-600 disabled:opacity-70 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                {useLocationLoading ? "Getting…" : "Use my location"}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-serif font-medium text-blue-950 mb-1">Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 font-serif text-blue-950 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a specialty</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={searchLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-900 text-white font-serif font-semibold text-lg hover:bg-blue-950 disabled:opacity-70"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
            {searchLoading ? "Searching…" : "Find Doctors"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 mx-4 md:ml-[22vw] max-w-2xl p-4 rounded-lg bg-red-50 text-red-700 font-serif">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="bottom mt-8 mb-12 px-4 lg:px-0">
        <div className="popular flex text-xl justify-center md:text-3xl font-serif font-semibold text-blue-950 mb-6">
          {results.length > 0 ? `Found ${results.length} provider(s)` : "Search results"}
        </div>
        <div className="cards grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:max-w-[90vw] lg:ml-20">
          {results.map((result, idx) => (
            <div
              key={result.number || idx}
              className="card bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-serif font-semibold text-lg text-blue-950">
                {getProviderDisplayName(result)}
              </p>
              {getTaxonomy(result) && (
                <p className="font-serif text-blue-700 mt-1">{getTaxonomy(result)}</p>
              )}
              {getAddress(result) && (
                <p className="font-serif text-sm text-gray-600 mt-2">{getAddress(result)}</p>
              )}
              {result.number && (
                <p className="font-serif text-xs text-gray-500 mt-1">NPI: {result.number}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Find_Doctor;
