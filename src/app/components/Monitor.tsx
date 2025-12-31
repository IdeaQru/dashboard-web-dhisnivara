import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Power,
  Calendar,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { StatCard } from './StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { WateringAnimation } from './WateringAnimation';

interface MonitorProps {
  temperature: number;
  humidity: number;
  tempStatus: 'good' | 'warning';
  humidityStatus: 'good' | 'warning';
}

// Dummy data untuk temperature history (24 jam terakhir)
const temperatureHistory = [
  { time: '00:00', temp: 25, humidity: 88 },
  { time: '02:00', temp: 24, humidity: 90 },
  { time: '04:00', temp: 24, humidity: 92 },
  { time: '06:00', temp: 25, humidity: 91 },
  { time: '08:00', temp: 26, humidity: 89 },
  { time: '10:00', temp: 27, humidity: 87 },
  { time: '12:00', temp: 27, humidity: 86 },
  { time: '14:00', temp: 26, humidity: 88 },
  { time: '16:00', temp: 26, humidity: 90 },
  { time: '18:00', temp: 25, humidity: 91 },
  { time: '20:00', temp: 25, humidity: 92 },
  { time: '22:00', temp: 26, humidity: 90 },
];

// Dummy alerts data
const alerts = [
  { id: 1, type: 'warning', message: 'Temperature mendekati batas atas', time: '2 hours ago', resolved: false },
  { id: 2, type: 'success', message: 'Humidity kembali normal', time: '5 hours ago', resolved: true },
];

export function Monitor({ temperature, humidity, tempStatus, humidityStatus }: MonitorProps) {
  const [timeRange, setTimeRange] = useState('24h');
  const [wateringMode, setWateringMode] = useState<'manual' | 'auto'>('auto');
  const [scheduleTime, setScheduleTime] = useState('06:00');
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'control'>('monitor');

  // Current readings for other sensors
  const currentCO2 = 1200;
  const currentLight = 450;
  const airFlow = 85;

  const co2Status = currentCO2 >= 800 && currentCO2 <= 1500 ? 'good' : 'warning';
  const lightStatus = currentLight >= 400 && currentLight <= 600 ? 'good' : 'warning';

  return (
    <div className="pb-6">
      {/* 3D Watering Animation Overlay */}
      <WateringAnimation isActive={isWatering} />
      
      {/* Unified Section - Monitor & Control dengan Tab Switcher */}
      <section className="mb-6">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 shadow-lg border border-emerald-100/80 dark:border-gray-700">
          {/* Header dengan Live Status */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-1">Greenhouse Control</h2>
              <p className="text-xs text-emerald-600 tracking-wide">Monitor & Automation</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-emerald-700">Live</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-5 bg-gray-100/80 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('monitor')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm tracking-tight transition-all duration-300 ${
                activeTab === 'monitor'
                  ? 'bg-white text-emerald-700 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Monitor</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('control')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm tracking-tight transition-all duration-300 ${
                activeTab === 'control'
                  ? 'bg-white text-emerald-700 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Droplets className="w-4 h-4" />
                <span>Control</span>
              </div>
            </button>
          </div>

          {/* Tab Content - Monitor */}
          {activeTab === 'monitor' && (
            <div>
              {/* Environment Stats */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <StatCard
                  title="Temperature"
                  value={`${temperature}°C`}
                  icon={<Thermometer className="w-6 h-6" />}
                  status={tempStatus}
                  subtitle="Ideal: 24-28°C"
                />
                <StatCard
                  title="Humidity"
                  value={`${humidity}%`}
                  icon={<Droplets className="w-6 h-6" />}
                  status={humidityStatus}
                  subtitle="Ideal: 85-95%"
                />
              </div>

              {/* Air Flow Status */}
              <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm mb-0.5">Air Circulation</p>
                      <p className="text-emerald-100 text-xs">Ventilation System</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-2xl tracking-tight">{airFlow}%</p>
                    <p className="text-emerald-100 text-xs">Active</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${airFlow}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Control (Sistem Penyiraman) */}
          {activeTab === 'control' && (
            <div>
              {/* Mode Selector - Manual vs Otomatis */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => {
                    setWateringMode('manual');
                    setIsWatering(false); // Reset watering saat ganti mode
                  }}
                  className={`relative py-4 px-4 rounded-2xl transition-all duration-300 border-2 ${
                    wateringMode === 'manual'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 shadow-lg shadow-orange-200'
                      : 'bg-white/80 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full transition-all ${
                      wateringMode === 'manual' 
                        ? 'bg-white/30 backdrop-blur-md' 
                        : 'bg-orange-50'
                    }`}>
                      <Power className={`w-6 h-6 ${
                        wateringMode === 'manual' ? 'text-white' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm tracking-tight mb-0.5 ${
                        wateringMode === 'manual' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Manual
                      </p>
                      <p className={`text-xs ${
                        wateringMode === 'manual' ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        Kontrol manual
                      </p>
                    </div>
                  </div>
                  {wateringMode === 'manual' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => {
                    setWateringMode('auto');
                    setIsWatering(false); // Reset watering saat ganti mode
                  }}
                  className={`relative py-4 px-4 rounded-2xl transition-all duration-300 border-2 ${
                    wateringMode === 'auto'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 shadow-lg shadow-emerald-200'
                      : 'bg-white/80 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full transition-all ${
                      wateringMode === 'auto' 
                        ? 'bg-white/30 backdrop-blur-md' 
                        : 'bg-emerald-50'
                    }`}>
                      <Clock className={`w-6 h-6 ${
                        wateringMode === 'auto' ? 'text-white' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm tracking-tight mb-0.5 ${
                        wateringMode === 'auto' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Otomatis
                      </p>
                      <p className={`text-xs ${
                        wateringMode === 'auto' ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        Terjadwal
                      </p>
                    </div>
                  </div>
                  {wateringMode === 'auto' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                </button>
              </div>

              {/* Auto Mode - Schedule Display */}
              {wateringMode === 'auto' && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
                  {!isEditingSchedule ? (
                    <>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500 shadow-md">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-emerald-700 uppercase tracking-wider mb-1">Jadwal Penyiraman</p>
                          <p className="text-3xl text-emerald-900 tracking-tight mb-1">{scheduleTime}</p>
                          <p className="text-xs text-emerald-600">WIB • Setiap hari</p>
                        </div>
                        <button
                          onClick={() => setIsEditingSchedule(true)}
                          className="p-2.5 rounded-lg bg-white/80 hover:bg-white border border-emerald-200 hover:border-emerald-300 transition-all group"
                        >
                          <Edit3 className="w-4 h-4 text-emerald-700 group-hover:text-emerald-800" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500 rounded-lg shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                          <span className="text-xs text-white tracking-wide">ON</span>
                        </div>
                        <div className="flex-1 h-px bg-emerald-200"></div>
                      </div>
                      
                      {/* Next Schedule Info */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-0.5">Penyiraman Berikutnya</p>
                          <p className="text-sm text-gray-900">Besok, {scheduleTime} WIB</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Edit Mode */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-emerald-700" />
                          <label className="text-sm text-emerald-900 tracking-tight">Atur Jadwal Baru</label>
                        </div>
                        
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border-2 border-emerald-300 rounded-xl text-emerald-900 text-center text-2xl tracking-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        
                        <p className="text-xs text-emerald-600 text-center mt-2">WIB • Setiap hari</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setIsEditingSchedule(false)}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                        >
                          <X className="w-4 h-4" />
                          <span className="text-sm tracking-wide">Batal</span>
                        </button>
                        <button
                          onClick={() => setIsEditingSchedule(false)}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white transition-all shadow-md"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm tracking-wide">Simpan</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Manual Mode - Control Button with Toggle */}
              {wateringMode === 'manual' && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-4">
                  <div className="text-center mb-4">
                    <div className={`inline-flex p-3 rounded-full shadow-lg mb-3 transition-all ${
                      isWatering 
                        ? 'bg-blue-500 animate-pulse' 
                        : 'bg-orange-500'
                    }`}>
                      <Droplets className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-900 mb-1">
                      {isWatering ? 'Sedang Menyiram...' : 'Mode Manual Aktif'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {isWatering ? 'Penyiraman berlangsung' : 'Kontrol penyiraman secara manual'}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsWatering(!isWatering)}
                    className={`w-full py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 group ${
                      isWatering
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                    }`}
                  >
                    {isWatering ? (
                      <>
                        <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="tracking-wide">Stop Siram</span>
                      </>
                    ) : (
                      <>
                        <Droplets className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="tracking-wide">Siram Sekarang</span>
                      </>
                    )}
                  </button>
                  
                  <div className="mt-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-0.5">Penyiraman Terakhir</p>
                      <p className="text-sm text-gray-900">Hari ini, 05:30 WIB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 mb-4">
        {['6h', '12h', '24h', '7d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-xl text-xs tracking-wide transition-all ${
              timeRange === range
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/70 text-gray-600 border border-emerald-100/80 hover:bg-emerald-50'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Temperature History Chart */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-emerald-100/80 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm text-gray-900 dark:text-white tracking-tight mb-1">Temperature Trend</h3>
            <p className="text-xs text-gray-500">Last 24 hours</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-xs text-orange-700">Live</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={temperatureHistory}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#d1fae5' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#d1fae5' }}
              domain={[20, 30]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #d1fae5',
                borderRadius: '12px',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#f97316" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity History Chart */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-emerald-100/80 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm text-gray-900 dark:text-white tracking-tight mb-1">Humidity Trend</h3>
            <p className="text-xs text-gray-500">Last 24 hours</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs text-blue-700">Live</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={temperatureHistory}>
            <defs>
              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#d1fae5' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#d1fae5' }}
              domain={[80, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #d1fae5',
                borderRadius: '12px',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="humidity" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorHumidity)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Section */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-emerald-100/80 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm text-gray-900 dark:text-white tracking-tight">Recent Alerts</h3>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                alert.resolved 
                  ? 'bg-emerald-50/50 border-emerald-200/50' 
                  : 'bg-orange-50/50 border-orange-200/50'
              }`}
            >
              <div className="mt-0.5">
                {alert.resolved ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white mb-1">{alert.message}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ideal Ranges Reference */}
      <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:bg-emerald-900/20 rounded-2xl p-5 border border-emerald-200/50">
        <h3 className="text-sm text-gray-900 dark:text-white mb-3 tracking-tight flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Ideal Growth Conditions
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Temperature</p>
            <p className="text-gray-900 dark:text-white">24-28°C</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Humidity</p>
            <p className="text-gray-900 dark:text-white">85-95%</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">CO₂</p>
            <p className="text-gray-900 dark:text-white">800-1500 ppm</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Light</p>
            <p className="text-gray-900 dark:text-white">400-600 lux</p>
          </div>
        </div>
      </div>
    </div>
  );
}