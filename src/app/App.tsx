import React, { useState } from "react";
import {
  Thermometer,
  Droplets,
  TrendingUp,
  Wallet,
  Bell,
  Activity,
  Sprout,
  Settings as SettingsIcon,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { StatCard } from "./components/StatCard";
import { Monitor } from "./components/Monitor";
import { Panen } from "./components/Panen";
import { Keuangan } from "./components/Keuangan";
import { Settings } from "./components/Settings";
import logoImage from "figma:asset/18f33bf4e96103b2e62a8e96eed3b28a79e27641.png";

interface HarvestEntry {
  id: number;
  location: string;
  date: string;
  weight: number;
  pricePerKg: number;
  total: number;
}

// Dummy data for harvest chart
const harvestData = [
  { day: "Mon", weight: 12 },
  { day: "Tue", weight: 15 },
  { day: "Wed", weight: 10 },
  { day: "Thu", weight: 18 },
  { day: "Fri", weight: 14 },
  { day: "Sat", weight: 20 },
  { day: "Sun", weight: 16 },
];

// Dummy transaction data
const recentTransactions = [
  {
    id: 1,
    type: "income",
    description: "Harvest Sale - Premium Oyster",
    amount: 450000,
    date: "Today",
  },
  {
    id: 2,
    type: "expense",
    description: "Substrate Purchase",
    amount: -120000,
    date: "Yesterday",
  },
  {
    id: 3,
    type: "income",
    description: "Harvest Sale - Shiitake",
    amount: 320000,
    date: "2 days ago",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("monitor");
  const [selectedLocation, setSelectedLocation] =
    useState("Malang 1");
  const [harvestHistory, setHarvestHistory] = useState<
    HarvestEntry[]
  >([
    // Dummy initial data
    {
      id: 1,
      location: "Greenhouse A - Rak 1",
      date: "2024-12-26",
      weight: 12,
      pricePerKg: 35000,
      total: 420000,
    },
    {
      id: 2,
      location: "Greenhouse A - Rak 2",
      date: "2024-12-26",
      weight: 8.5,
      pricePerKg: 35000,
      total: 297500,
    },
    {
      id: 3,
      location: "Greenhouse B - Rak 1",
      date: "2024-12-25",
      weight: 15,
      pricePerKg: 32000,
      total: 480000,
    },
  ]);

  const locations = [
    "Malang 1",
    "Malang 2",
    "Malang 3",
    "Kediri 1",
  ];

  // Current date and time
  const currentDate = new Date();
  const greeting =
    currentDate.getHours() < 12
      ? "Good Morning"
      : currentDate.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";
  const formattedDate = currentDate.toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" },
  );

  // Environment data (could vary by location in real app)
  const temperature = 26;
  const humidity = 90;
  const tempStatus =
    temperature >= 24 && temperature <= 28 ? "good" : "warning";
  const humidityStatus =
    humidity >= 85 && humidity <= 95 ? "good" : "warning";

  // Handler functions
  const handleAddHarvest = (harvest: HarvestEntry) => {
    setHarvestHistory([...harvestHistory, harvest]);
  };

  const handleDeleteHarvest = (id: number) => {
    setHarvestHistory(
      harvestHistory.filter((h) => h.id !== id),
    );
  };

  // Calculate today's harvest for home page
  const todayDate = new Date().toISOString().split("T")[0];
  const todayHarvest = harvestHistory
    .filter((h) => h.date === todayDate)
    .reduce((sum, h) => sum + h.weight, 0);

  return (
    <div className="min-h-screen bg-[#F4F8F5] dark:from-gray-900 dark:to-gray-950 pb-20">
      {/* Header Section */}
      <header className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 dark:bg-gradient-to-br dark:from-emerald-800 dark:to-teal-900 text-white px-5 pt-8 pb-20 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg p-2">
              <img
                src={logoImage}
                alt="Dhisnivara Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="tracking-tight">Dhisnivara</h3>
              <p className="text-xs text-emerald-50 tracking-wide">
                Mushroom Farm
              </p>
            </div>
          </div>
          <button className="relative p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:bg-white/30 transition-all border border-white/30">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full border-2 border-white shadow-lg"></span>
          </button>
        </div>

        <div className="mb-5">
          <h1 className="text-2xl tracking-tight mb-1">
            {greeting}, Owner
          </h1>
          <p className="text-sm text-emerald-50">
            {formattedDate}
          </p>
        </div>

        {/* Location Selector */}
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) =>
              setSelectedLocation(e.target.value)
            }
            className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl px-4 py-3.5 pr-10 appearance-none cursor-pointer hover:bg-white/30 transition-all shadow-lg text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
          >
            {locations.map((loc) => (
              <option
                key={loc}
                value={loc}
                className="text-gray-900 bg-white py-2"
              >
                {loc}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 -mt-10">
        {activeTab === "monitor" && (
          <Monitor
            temperature={temperature}
            humidity={humidity}
            tempStatus={tempStatus}
            humidityStatus={humidityStatus}
          />
        )}

        {activeTab === "panen" && (
          <Panen
            onAddHarvest={handleAddHarvest}
            harvestHistory={harvestHistory}
            onDeleteHarvest={handleDeleteHarvest}
            selectedLocation={selectedLocation}
          />
        )}

        {activeTab === "keuangan" && (
          <Keuangan harvestHistory={harvestHistory} />
        )}

        {activeTab === "settings" && <Settings />}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-emerald-100 dark:border-gray-700 px-6 py-4 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("monitor")}
            className={`flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all ${
              activeTab === "monitor"
                ? "text-emerald-600 dark:text-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:bg-emerald-900/30 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-xs tracking-wide">
              Monitor
            </span>
          </button>

          <button
            onClick={() => setActiveTab("panen")}
            className={`flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all ${
              activeTab === "panen"
                ? "text-emerald-600 dark:text-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:bg-emerald-900/30 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Sprout className="w-5 h-5" />
            <span className="text-xs tracking-wide">Panen</span>
          </button>

          <button
            onClick={() => setActiveTab("keuangan")}
            className={`flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all ${
              activeTab === "keuangan"
                ? "text-emerald-600 dark:text-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:bg-emerald-900/30 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs tracking-wide">
              Keuangan
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all ${
              activeTab === "settings"
                ? "text-emerald-600 dark:text-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:bg-emerald-900/30 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-xs tracking-wide">
              Settings
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}