import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff,
  Signal,
  Lock,
  RefreshCw,
  CheckCircle2,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface WiFiNetwork {
  ssid: string;
  signal: number;
  locked: boolean;
  connected: boolean;
  location: string; // Auto-detected location
}

export function Settings() {
  const [isScanning, setIsScanning] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<WiFiNetwork | null>({
    ssid: 'Dhisnivara-Malang1',
    signal: 95,
    locked: true,
    connected: true,
    location: 'Malang 1'
  });

  // Available WiFi networks with location mapping
  const [wifiNetworks] = useState<WiFiNetwork[]>([
    { ssid: 'Dhisnivara-Malang1', signal: 95, locked: true, connected: true, location: 'Malang 1' },
    { ssid: 'Dhisnivara-Malang2', signal: 78, locked: true, connected: false, location: 'Malang 2' },
    { ssid: 'Dhisnivara-Malang3', signal: 62, locked: true, connected: false, location: 'Malang 3' },
    { ssid: 'Dhisnivara-Kediri1', signal: 45, locked: true, connected: false, location: 'Kediri 1' },
    { ssid: 'Public-WiFi', signal: 88, locked: false, connected: false, location: 'Unknown' },
  ]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handleConnect = (network: WiFiNetwork) => {
    if (network.locked) {
      // In real app, this would show password dialog
      alert(`Masukkan password untuk ${network.ssid}`);
    }
    // Simulate connection
    setCurrentNetwork(network);
  };

  const handleDisconnect = () => {
    setCurrentNetwork(null);
  };

  const getSignalIcon = (signal: number) => {
    if (signal >= 80) return 3;
    if (signal >= 50) return 2;
    return 1;
  };

  const getSignalColor = (signal: number) => {
    if (signal >= 80) return 'text-emerald-600';
    if (signal >= 50) return 'text-amber-600';
    return 'text-orange-600';
  };

  return (
    <div className="pb-6">
      {/* WiFi Connection Header */}
      <section className="mb-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 shadow-lg border border-emerald-100/80 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-1">Koneksi WiFi</h2>
              <p className="text-xs text-emerald-600 tracking-wide">Pilih jaringan untuk mendeteksi lokasi</p>
            </div>
          </div>

          {/* Current Connection Status */}
          {currentNetwork ? (
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                    <Wifi className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <p className="text-emerald-100 text-xs uppercase tracking-wide">Terkoneksi</p>
                    </div>
                    <h3 className="text-white text-xl tracking-tight mb-1">{currentNetwork.ssid}</h3>
                    <p className="text-emerald-100 text-sm">Signal: {currentNetwork.signal}%</p>
                  </div>
                </div>
              </div>

              {/* Detected Location */}
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                  <p className="text-white text-sm uppercase tracking-wide">Lokasi Terdeteksi</p>
                </div>
                <p className="text-white text-2xl tracking-tight">{currentNetwork.location}</p>
              </div>

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="w-full mt-4 bg-white/20 backdrop-blur-md border border-white/30 text-white py-3 rounded-xl hover:bg-white/30 transition-all text-sm tracking-wide"
              >
                Putuskan Koneksi
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 text-center">
              <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Tidak ada koneksi WiFi</p>
              <p className="text-gray-500 text-xs mt-1">Pilih jaringan di bawah untuk terhubung</p>
            </div>
          )}
        </div>
      </section>

      {/* Scan WiFi Button */}
      <button
        onClick={handleScan}
        disabled={isScanning}
        className="w-full bg-white/70 backdrop-blur-lg border border-emerald-100/80 rounded-2xl p-4 mb-6 flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-50"
      >
        <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
        <span className="tracking-wide">{isScanning ? 'Mencari Jaringan...' : 'Pindai Jaringan WiFi'}</span>
      </button>

      {/* Available WiFi Networks */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-emerald-100/80">
        <h3 className="text-sm text-emerald-700 uppercase tracking-widest mb-4">Jaringan Tersedia</h3>
        
        <div className="space-y-2">
          {wifiNetworks.map((network, idx) => (
            <button
              key={idx}
              onClick={() => !network.connected && handleConnect(network)}
              disabled={network.connected}
              className={`w-full flex items-center justify-between py-4 px-4 rounded-xl transition-all ${
                network.connected
                  ? 'bg-emerald-50 border border-emerald-200 cursor-default'
                  : 'hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Signal Icon */}
                <div className={`p-2.5 rounded-xl ${network.connected ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <Signal className={`w-5 h-5 ${network.connected ? 'text-emerald-600' : getSignalColor(network.signal)}`} />
                </div>

                {/* Network Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm tracking-tight ${network.connected ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {network.ssid}
                    </p>
                    {network.locked && (
                      <Lock className="w-3 h-3 text-gray-400" />
                    )}
                    {network.connected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">
                      {network.location !== 'Unknown' ? network.location : 'Lokasi tidak dikenali'}
                    </p>
                    {network.location === 'Unknown' && (
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                    )}
                  </div>
                </div>

                {/* Signal Strength */}
                <div className="text-right">
                  <p className={`text-xs ${getSignalColor(network.signal)}`}>
                    {network.signal}%
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 mb-1">Deteksi Otomatis Lokasi</p>
            <p className="text-xs text-blue-700">
              Aplikasi akan otomatis mendeteksi lokasi greenhouse berdasarkan jaringan WiFi yang terhubung. 
              Pastikan Anda terhubung ke jaringan yang sesuai dengan lokasi Anda.
            </p>
          </div>
        </div>
      </div>

      {/* App Version Footer */}
      <div className="text-center pt-6">
        <p className="text-xs text-gray-400">
          Dhisnivara Mushroom Farm Dashboard
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Version 1.0.0 • Build 2024.12.28
        </p>
      </div>
    </div>
  );
}