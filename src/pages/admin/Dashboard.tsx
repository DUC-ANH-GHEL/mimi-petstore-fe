import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Breadcrumb from '../../components/layout/Breadcrumb';
import KpiCard from '../../components/dashboard/KpiCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import TopProductCard from '../../components/dashboard/TopProductCard';
import OrdersTable from '../../components/dashboard/OrdersTable';
import CustomerCard from '../../components/dashboard/CustomerCard';

import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'months'>('7days');
  const loading = false;

  // Dummy Data
  const kpis = [
    { icon: <DollarSign size={20} />, title: 'Tổng doanh thu', value: '₫2,300,000', subtext: 'Tháng này', trend: 12, color: 'bg-blue-100 text-blue-600' },
    { icon: <ShoppingCart size={20} />, title: 'Đơn hàng', value: '128', subtext: 'Tuần này', trend: 5, color: 'bg-green-100 text-green-600' },
    { icon: <Users size={20} />, title: 'Khách hàng mới', value: '34', subtext: 'Tuần này', trend: -3, color: 'bg-yellow-100 text-yellow-600' },
    { icon: <TrendingUp size={20} />, title: 'Tăng trưởng', value: '8.2%', subtext: 'So với tháng trước', trend: 8, color: 'bg-purple-100 text-purple-600' },
  ];

  const revenueData = [
    { name: '01/04', sales: 800000 },
    { name: '02/04', sales: 1200000 },
    { name: '03/04', sales: 900000 },
    { name: '04/04', sales: 1350000 },
    { name: '05/04', sales: 700000 },
  ];

  const topProducts = [
    { id: 1, name: 'Ty thủy lực 50cm', image: '/img/ty50.jpg', sales: 120, growth: 15 },
    { id: 2, name: 'Bộ van tay 2 cần', image: '/img/van2.jpg', sales: 85, growth: 10 },
    { id: 3, name: 'Cầu chì 24V', image: '/img/cauchii.jpg', sales: 60, growth: -5 },
  ];

  const orders = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', mainProduct: 'Ty 50cm', total: 1450000, status: 'completed' as 'completed' },
    { id: 'ORD002', customer: 'Trần Thị B', mainProduct: 'Van 2 tay', total: 980000, status: 'processing' as 'processing' },
  ];

  const customers = [
    { id: 1, name: 'Nguyễn Văn A', avatar: '/img/ava1.jpg', orders: 5, spent: 7200000 },
    { id: 2, name: 'Trần Thị B', avatar: '/img/ava2.jpg', orders: 3, spent: 4500000 },
  ];

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
        <main className="p-6 space-y-6">
          <Breadcrumb items={[{ name: 'Trang chủ', path: '/', icon: <HomeIcon /> }, { name: 'Dashboard', path: '/dashboard' }]} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <KpiCard key={i} {...kpi} />
            ))}
          </div>

          <RevenueChart
            data={revenueData}
            loading={loading}
            chartType={chartType}
            timeRange={timeRange}
            setChartType={setChartType}
            setTimeRange={setTimeRange}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <h2 className="p-4 text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700">Sản phẩm bán chạy</h2>
              {topProducts.map((p, i) => (
                <TopProductCard key={p.id} product={p} rank={i} />
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <h2 className="p-4 text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700">Khách hàng thân thiết</h2>
              {customers.map((c) => (
                <CustomerCard key={c.id} customer={c} />
              ))}
            </div>
          </div>

          <OrdersTable orders={orders} loading={false} />
        </main>
      </div>
    </div>
  );
};

const HomeIcon = () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7m-7-7v18" /></svg>;

export default Dashboard;
