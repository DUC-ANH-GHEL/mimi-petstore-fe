import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { productService } from '../../../services/productService';

const FilterBar = ({ onSearchChange, onFilterChange, onBulkDelete, selectedCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // useEffect(() => {
  //   // Fetch categories for dropdown
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await productService.getCategories();
  //       setCategories(response);
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };
    
  //   fetchCategories();
  // }, []);
  
  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onFilterChange({ status: value });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('all');
    onSearchChange('');
    onFilterChange({ search: '', category: '', status: 'all' });
  };
  
  // const handleCategoryChange = (e) => {
  //   const value = e.target.value;
  //   setSelectedCategory(value);
  //   onFilterChange({ category: value });
  // };
  
  // const handleStatusChange = (e) => {
  //   const value = e.target.value;
  //   setSelectedStatus(value);
  //   onFilterChange({ status: value });
  // };
  
  // const handleResetFilters = () => {
  //   setSearchTerm('');
  //   setSelectedCategory('');
  //   setSelectedStatus('all');
  //   onFilterChange({
  //     search: '',
  //     category: '',
  //     status: 'all'
  //   });
  // };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm sản phẩm theo tên, mã SKU..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        
        {/* Category filter */}
        {/* <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div> */}
        
        {/* Status filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-xl py-2 px-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Đang bán</option>
            <option value="outOfStock">Hết hàng</option>
            <option value="hidden">Ẩn</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        {/* Reset filters button */}
        <button
          onClick={handleResetFilters}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Xoá bộ lọc
        </button>
        
        {/* Bulk actions */}
        {selectedCount > 0 && (
          <button
            onClick={onBulkDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xoá {selectedCount} sản phẩm đã chọn
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;