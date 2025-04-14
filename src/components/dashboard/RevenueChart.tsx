import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { formatCurrency } from '../../data/mockData';

interface RevenueChartProps {
  data: Array<{ name: string; sales: number }>;
  loading: boolean;
  chartType: 'line' | 'bar';
  timeRange: '7days' | '30days' | 'months';
  setChartType: (type: 'line' | 'bar') => void;
  setTimeRange: (range: '7days' | '30days' | 'months') => void;
}

const RevenueChart = ({  data, 
        loading, 
        chartType, 
        timeRange, 
        setChartType, 
        setTimeRange  }: RevenueChartProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Biểu đồ doanh thu</h2>
        
        <div className="flex items-center mt-2 sm:mt-0">
          <div className="mr-4">
            <select 
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            {[
              { value: '7days', label: '7 ngày' },
              { value: '30days', label: '30 ngày' },
              { value: 'months', label: 'Theo tháng' }
            ].map((range) => (
              <button
                key={range.value}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  timeRange === range.value 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setTimeRange(range.value as '7days' | '30days' | 'months')}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-80">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md h-64 w-full"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis 
                  stroke="#6B7280"
                  tickFormatter={(value) => `${value / 1000000}tr`}
                />
                <Tooltip 
                  formatter={(value) => [`${formatCurrency(value as number)}`, 'Doanh thu']}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis 
                  stroke="#6B7280"
                  tickFormatter={(value) => `${value / 1000000}tr`}
                />
                <Tooltip 
                  formatter={(value) => [`${formatCurrency(value as number)}`, 'Doanh thu']}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;