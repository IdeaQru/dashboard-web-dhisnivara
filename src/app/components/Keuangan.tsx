import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  DollarSign,
  Calendar,
  Filter,
  Download,
  FileText,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface HarvestEntry {
  id: number;
  location: string;
  date: string;
  weight: number;
  pricePerKg: number;
  total: number;
}

interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface KeuanganProps {
  harvestHistory: HarvestEntry[];
}

export function Keuangan({ harvestHistory }: KeuanganProps) {
  const [activeTab, setActiveTab] = useState<'rekap' | 'analisa'>('rekap');
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Dummy expenses data
  const [expenses] = useState<Expense[]>([
    { id: 1, category: 'Substrate', description: 'Pembelian Substrate 100kg', amount: 1200000, date: '2024-12-25' },
    { id: 2, category: 'Listrik', description: 'Tagihan Listrik Desember', amount: 450000, date: '2024-12-20' },
    { id: 3, category: 'Bibit', description: 'Bibit Jamur Tiram', amount: 800000, date: '2024-12-15' },
    { id: 4, category: 'Perawatan', description: 'Maintenance Equipment', amount: 350000, date: '2024-12-10' },
  ]);

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

  // Calculate totals
  const totalIncome = harvestHistory.reduce((sum, h) => sum + h.total, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Get this month's data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthIncome = harvestHistory
    .filter(h => {
      const date = new Date(h.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, h) => sum + h.total, 0);

  const thisMonthExpense = expenses
    .filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const thisMonthProfit = thisMonthIncome - thisMonthExpense;

  // Prepare chart data - Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const dayIncome = harvestHistory
      .filter(h => h.date === dateStr)
      .reduce((sum, h) => sum + h.total, 0);
    
    const dayExpense = expenses
      .filter(e => e.date === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      income: dayIncome / 1000, // Convert to thousands
      expense: dayExpense / 1000,
    };
  });

  // Expense by category
  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value: value / 1000,
  }));

  // Function to export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Laporan Keuangan', 14, 20);

    // Add Harvest History Table
    doc.setFontSize(12);
    doc.text('Riwayat Panen', 14, 30);
    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Lokasi', 'Tanggal', 'Berat (kg)', 'Harga/kg (Rp)', 'Total (Rp)']],
      body: harvestHistory.map(h => [
        h.id,
        h.location,
        formatDate(h.date),
        h.weight,
        formatCurrency(h.pricePerKg).replace('Rp', ''),
        formatCurrency(h.total).replace('Rp', '')
      ]),
      theme: 'grid'
    });

    // Add Expenses Table
    doc.addPage();
    doc.setFontSize(12);
    doc.text('Riwayat Pengeluaran', 14, 30);
    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Kategori', 'Deskripsi', 'Jumlah (Rp)', 'Tanggal']],
      body: expenses.map(e => [
        e.id,
        e.category,
        e.description,
        formatCurrency(e.amount).replace('Rp', ''),
        formatDate(e.date)
      ]),
      theme: 'grid'
    });

    doc.save('laporan_keuangan.pdf');
  };

  // Analisa Pendapatan - Filter by date range
  const filteredHarvest = harvestHistory.filter(h => {
    const harvestDate = new Date(h.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return harvestDate >= start && harvestDate <= end;
  });

  // Calculate totals for date range
  const rangeIncome = filteredHarvest.reduce((sum, h) => sum + h.total, 0);
  const rangeWeight = filteredHarvest.reduce((sum, h) => sum + h.weight, 0);
  const rangeAvgPrice = filteredHarvest.length > 0 
    ? filteredHarvest.reduce((sum, h) => sum + h.pricePerKg, 0) / filteredHarvest.length 
    : 0;

  // Group by date for chart
  const dailyData = filteredHarvest.reduce((acc, h) => {
    if (!acc[h.date]) {
      acc[h.date] = { date: h.date, weight: 0, income: 0 };
    }
    acc[h.date].weight += h.weight;
    acc[h.date].income += h.total;
    return acc;
  }, {} as Record<string, { date: string; weight: number; income: number }>);

  const analisaChartData = Object.values(dailyData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      date: formatDate(item.date),
      income: item.income / 1000,
      weight: item.weight,
    }));

  return (
    <div className="pb-6">
      {/* Tab Switcher */}
      <div className="mb-6 bg-white/70 backdrop-blur-lg rounded-2xl p-1.5 shadow-sm border border-emerald-100/80 inline-flex">
        <button
          onClick={() => setActiveTab('rekap')}
          className={`px-6 py-2.5 rounded-xl text-sm tracking-wide transition-all ${
            activeTab === 'rekap'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:text-emerald-600'
          }`}
        >
          Rekap Keuangan
        </button>
        <button
          onClick={() => setActiveTab('analisa')}
          className={`px-6 py-2.5 rounded-xl text-sm tracking-wide transition-all ${
            activeTab === 'analisa'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:text-emerald-600'
          }`}
        >
          Analisa Pendapatan
        </button>
      </div>

      {/* Render based on active tab */}
      {activeTab === 'rekap' ? (
        <>
          {/* Keuangan Header Section - Seamless Integration */}
          <section className="mb-8">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 shadow-lg border border-emerald-100/80 dark:border-gray-700">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-1">Keuangan</h2>
                  <p className="text-xs text-emerald-600 tracking-wide">Monitor pendapatan & pengeluaran</p>
                </div>
              </div>

              {/* Net Profit Card */}
              <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 mb-5 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-emerald-100 text-sm mb-2 uppercase tracking-wide">Profit Bulan Ini</p>
                    <p className="text-white text-4xl tracking-tight mb-1">
                      {formatCurrency(thisMonthProfit).replace('Rp', 'Rp ')}
                    </p>
                    <div className="flex items-center gap-2 text-emerald-100 text-xs">
                      <TrendingUp className="w-4 h-4" />
                      <span>+12% dari bulan lalu</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Income & Expense Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2.5 rounded-full bg-green-100">
                      <ArrowUpRight className="w-5 h-5 text-green-700" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Pendapatan</p>
                  <p className="text-2xl text-gray-900 tracking-tight mb-1">
                    {formatCurrency(thisMonthIncome).replace('Rp', 'Rp ')}
                  </p>
                  <p className="text-xs text-emerald-600">{harvestHistory.length} transaksi</p>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2.5 rounded-full bg-green-100">
                      <ArrowDownRight className="w-5 h-5 text-green-700" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Pengeluaran</p>
                  <p className="text-2xl text-gray-900 tracking-tight mb-1">
                    {formatCurrency(thisMonthExpense).replace('Rp', 'Rp ')}
                  </p>
                  <p className="text-xs text-orange-600">{expenses.length} transaksi</p>
                </div>
              </div>
            </div>
          </section>

          {/* Chart - Income vs Expense */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-emerald-100/80 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-1">Trend Keuangan</h2>
                <p className="text-xs text-gray-500">7 Hari Terakhir (dalam ribuan)</p>
              </div>
              <div className="flex gap-2">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      timeRange === range
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range === 'week' ? '7D' : range === 'month' ? '30D' : '1Y'}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1fae5' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1fae5' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d1fae5',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`Rp ${(value * 1000).toLocaleString('id-ID')}`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Pendapatan"
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Pengeluaran"
                  dot={{ fill: '#f97316', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Expense by Category */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-emerald-100/80 mb-6">
            <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-5">Pengeluaran per Kategori</h2>
            
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis 
                  type="number"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1fae5' }}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1fae5' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d1fae5',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`Rp ${(value * 1000).toLocaleString('id-ID')}`, 'Total']}
                />
                <Bar dataKey="value" fill="#f97316" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction History */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-emerald-100/80">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg text-gray-900 dark:text-white tracking-tight">Transaksi Terbaru</h2>
              <button className="text-emerald-600 text-sm flex items-center gap-1 hover:gap-2 transition-all">
                <span>Lihat Semua</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Income Transactions from Harvest */}
              {harvestHistory.slice(-5).reverse().map((harvest) => (
                <div
                  key={`harvest-${harvest.id}`}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 tracking-tight">Panen - {harvest.location}</p>
                      <p className="text-xs text-gray-500">{formatDate(harvest.date)} • {harvest.weight} kg</p>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 tracking-tight">
                    +{formatCurrency(harvest.total).replace('Rp', 'Rp ')}
                  </p>
                </div>
              ))}

              {/* Expense Transactions */}
              {expenses.slice(0, 3).map((expense) => (
                <div
                  key={`expense-${expense.id}`}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-100">
                      <ArrowDownRight className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 tracking-tight">{expense.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(expense.date)} • {expense.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-orange-600 tracking-tight">
                    -{formatCurrency(expense.amount).replace('Rp', 'Rp ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="bg-white/70 backdrop-blur-lg border border-emerald-100/80 rounded-2xl p-4 flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all">
              <Plus className="w-5 h-5" />
              <span className="text-sm">Tambah Pengeluaran</span>
            </button>
            <button className="bg-white/70 backdrop-blur-lg border border-emerald-100/80 rounded-2xl p-4 flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all" onClick={exportToPDF}>
              <Download className="w-5 h-5" />
              <span className="text-sm">Export Data</span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Analisa Pendapatan Section */}
          <section className="mb-8">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-5 shadow-lg border border-emerald-100/80 dark:border-gray-700">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-1">Analisa Pendapatan</h2>
                  <p className="text-xs text-emerald-600 tracking-wide">Analisis pendapatan berdasarkan rentang tanggal</p>
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="grid grid-cols-1 gap-3 mb-5">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wide">
                    <Calendar className="w-3 h-3" />
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-emerald-200/80 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wide">
                    <Calendar className="w-3 h-3" />
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-emerald-200/80 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <button className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="tracking-wide">Terapkan Filter</span>
                </button>
              </div>

              {/* Income Summary */}
              <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 mb-5 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-emerald-100 text-sm mb-2 uppercase tracking-wide">Pendapatan Total</p>
                    <p className="text-white text-4xl tracking-tight mb-1">
                      {formatCurrency(rangeIncome).replace('Rp', 'Rp ')}
                    </p>
                    <div className="flex items-center gap-2 text-emerald-100 text-xs">
                      <TrendingUp className="w-4 h-4" />
                      <span>+15% dari periode sebelumnya</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Income & Weight Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2.5 rounded-full bg-green-100">
                      <ArrowUpRight className="w-5 h-5 text-green-700" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Pendapatan</p>
                  <p className="text-2xl text-gray-900 tracking-tight mb-1">
                    {formatCurrency(rangeIncome).replace('Rp', 'Rp ')}
                  </p>
                  <p className="text-xs text-emerald-600">{filteredHarvest.length} transaksi</p>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2.5 rounded-full bg-green-100">
                      <ArrowUpRight className="w-5 h-5 text-green-700" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Berat Total</p>
                  <p className="text-2xl text-gray-900 tracking-tight mb-1">
                    {rangeWeight} kg
                  </p>
                  <p className="text-xs text-emerald-600">{filteredHarvest.length} transaksi</p>
                </div>
              </div>
            </div>
          </section>

          {/* Chart - Income by Date */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-emerald-100/80 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg text-gray-900 dark:text-white tracking-tight mb-1">Trend Pendapatan</h2>
                <p className="text-xs text-gray-500">Berdasarkan Rentang Tanggal (dalam ribuan)</p>
              </div>
              <div className="flex gap-2">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      timeRange === range
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range === 'week' ? '7D' : range === 'month' ? '30D' : '1Y'}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analisaChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1fae5' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#d1fae5' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d1fae5',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`Rp ${(value * 1000).toLocaleString('id-ID')}`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Pendapatan"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction History */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-emerald-100/80 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg text-gray-900 dark:text-white tracking-tight">Tabel Data Panen</h2>
              <p className="text-xs text-gray-500">{filteredHarvest.length} transaksi</p>
            </div>

            {filteredHarvest.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Tidak ada data panen dalam rentang tanggal ini</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-emerald-100">
                      <th className="text-left py-3 px-2 text-xs text-gray-600 uppercase tracking-wide">Tanggal</th>
                      <th className="text-left py-3 px-2 text-xs text-gray-600 uppercase tracking-wide">Lokasi</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 uppercase tracking-wide">Berat</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 uppercase tracking-wide">Harga/kg</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHarvest.slice().reverse().map((harvest) => (
                      <tr key={harvest.id} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-all">
                        <td className="py-3 px-2 text-sm text-gray-900">{formatDate(harvest.date)}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{harvest.location}</td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-right">{harvest.weight} kg</td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-right">
                          {formatCurrency(harvest.pricePerKg).replace('Rp', 'Rp ')}
                        </td>
                        <td className="py-3 px-2 text-sm text-emerald-600 text-right">
                          {formatCurrency(harvest.total).replace('Rp', 'Rp ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-emerald-200 bg-emerald-50/30">
                      <td colSpan={2} className="py-3 px-2 text-sm text-gray-900 uppercase tracking-wide">Total</td>
                      <td className="py-3 px-2 text-sm text-gray-900 text-right">{rangeWeight} kg</td>
                      <td className="py-3 px-2 text-sm text-gray-900 text-right">
                        {formatCurrency(rangeAvgPrice).replace('Rp', 'Rp ')}
                      </td>
                      <td className="py-3 px-2 text-sm text-emerald-600 text-right">
                        {formatCurrency(rangeIncome).replace('Rp', 'Rp ')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Previous Transaction History section */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-emerald-100/80">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg text-gray-900 dark:text-white tracking-tight">Transaksi Terbaru</h2>
              <button className="text-emerald-600 text-sm flex items-center gap-1 hover:gap-2 transition-all">
                <span>Lihat Semua</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Income Transactions from Harvest */}
              {filteredHarvest.slice(-5).reverse().map((harvest) => (
                <div
                  key={`harvest-${harvest.id}`}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 tracking-tight">Panen - {harvest.location}</p>
                      <p className="text-xs text-gray-500">{formatDate(harvest.date)} • {harvest.weight} kg</p>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 tracking-tight">
                    +{formatCurrency(harvest.total).replace('Rp', 'Rp ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="bg-white/70 backdrop-blur-lg border border-emerald-100/80 rounded-2xl p-4 flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all">
              <Plus className="w-5 h-5" />
              <span className="text-sm">Tambah Pengeluaran</span>
            </button>
            <button className="bg-white/70 backdrop-blur-lg border border-emerald-100/80 rounded-2xl p-4 flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all" onClick={exportToPDF}>
              <Download className="w-5 h-5" />
              <span className="text-sm">Export Data</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}