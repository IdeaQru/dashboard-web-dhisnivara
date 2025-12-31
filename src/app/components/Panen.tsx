import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  Scale, 
  DollarSign,
  Plus,
  CheckCircle2,
  Trash2,
  Edit
} from 'lucide-react';

interface HarvestEntry {
  id: number;
  location: string;
  date: string;
  weight: number;
  pricePerKg: number;
  total: number;
}

interface PanenProps {
  onAddHarvest: (harvest: HarvestEntry) => void;
  harvestHistory: HarvestEntry[];
  onDeleteHarvest: (id: number) => void;
  selectedLocation: string;
}

export function Panen({ onAddHarvest, harvestHistory, onDeleteHarvest, selectedLocation }: PanenProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const calculateTotal = () => {
    const w = parseFloat(weight) || 0;
    const p = parseFloat(pricePerKg) || 0;
    return w * p;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation || !weight || !pricePerKg) {
      alert('Mohon lengkapi semua field!');
      return;
    }

    const newHarvest: HarvestEntry = {
      id: Date.now(),
      location: selectedLocation,
      date,
      weight: parseFloat(weight),
      pricePerKg: parseFloat(pricePerKg),
      total: calculateTotal(),
    };

    onAddHarvest(newHarvest);
    
    // Reset form
    setWeight('');
    setPricePerKg('');
    setDate(new Date().toISOString().split('T')[0]);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate today's total
  const todayTotal = harvestHistory
    .filter(h => h.date === new Date().toISOString().split('T')[0])
    .reduce((sum, h) => sum + h.weight, 0);

  const todayIncome = harvestHistory
    .filter(h => h.date === new Date().toISOString().split('T')[0])
    .reduce((sum, h) => sum + h.total, 0);

  return (
    <div className="pb-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-700">Data panen berhasil disimpan!</p>
        </div>
      )}

      {/* Input Panen Header Section - Seamless Integration */}
      <section className="mb-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 shadow-lg border border-emerald-100/80 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-1">Input Panen</h2>
              <p className="text-xs text-emerald-600 tracking-wide">Catat hasil panen harian</p>
            </div>
          </div>

          {/* Today's Summary Grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-white" />
                <p className="text-emerald-100 text-xs uppercase tracking-wide">Hari Ini</p>
              </div>
              <p className="text-white text-3xl tracking-tight mb-1">{todayTotal} kg</p>
              <p className="text-emerald-100 text-xs">Total Panen</p>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-white" />
                <p className="text-teal-100 text-xs uppercase tracking-wide">Pendapatan</p>
              </div>
              <p className="text-white text-2xl tracking-tight mb-1">
                {formatCurrency(todayIncome).replace('Rp', 'Rp ')}
              </p>
              <p className="text-teal-100 text-xs">Hari Ini</p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Location Display */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-xl p-4">
              <label className="flex items-center gap-2 text-sm text-emerald-700 mb-1">
                <MapPin className="w-4 h-4" />
                Lokasi Saat Ini
              </label>
              <p className="text-lg text-emerald-800 tracking-tight">{selectedLocation}</p>
            </div>

            {/* Date Input */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Tanggal Panen
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/80 border border-emerald-200/80 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Weight Input */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                Jumlah Panen (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3.5 bg-white/80 border border-emerald-200/80 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Price Per Kg Input */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Harga per Kg (Rp)
              </label>
              <input
                type="number"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3.5 bg-white/80 border border-emerald-200/80 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Total Display */}
            {weight && pricePerKg && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-xl p-4">
                <p className="text-xs text-emerald-700 mb-1 uppercase tracking-wide">Total Pendapatan</p>
                <p className="text-2xl text-emerald-700 tracking-tight">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="tracking-wide">Simpan Data Panen</span>
            </button>
          </form>
        </div>
      </section>

      {/* Harvest History */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-emerald-100/80 dark:border-gray-700">
        <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-5">Riwayat Panen</h2>

        {harvestHistory.length === 0 ? (
          <div className="text-center py-12">
            <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Belum ada data panen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {harvestHistory.slice().reverse().map((harvest) => (
              <div
                key={harvest.id}
                className="bg-white/80 border border-emerald-100/60 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <p className="text-sm text-gray-900 dark:text-white">{harvest.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(harvest.date)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteHarvest(harvest.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Berat</p>
                    <p className="text-sm text-gray-900 dark:text-white">{harvest.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Harga/kg</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(harvest.pricePerKg).replace('Rp', 'Rp ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total</p>
                    <p className="text-sm text-emerald-600">
                      {formatCurrency(harvest.total).replace('Rp', 'Rp ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}