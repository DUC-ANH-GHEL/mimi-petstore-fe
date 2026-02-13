import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductsTable from '../../../components/products/List/ProductsTable';
import FilterBar from '../../../components/products/List/FillterBar';
import { productService } from '../../../services/productService';
import { getProducts } from '../../../services/productService';
import { useToast } from '../../../components/Toast';
import { parseApiError } from '../../../utils/apiError';
import { logout } from '../../../services/authService';

const Products = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: 'true',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(filters);
    console.log("fetchproduct", response)

      setProducts(response.data);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1 // Reset to first page when searching
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleSelectItem = (id, isSelected) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedItems(products.map(product => product.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá ${selectedItems?.length} sản phẩm đã chọn?`)) {
      try {
        await productService.deleteMultiple(selectedItems);
        showToast('Đã xoá sản phẩm đã chọn', 'success');
        fetchProducts();
        setSelectedItems([]);
      } catch (error) {
        console.error('Error deleting products:', error);
        const parsed = parseApiError(error);
        if (parsed?.status === 401) {
          showToast('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error', 5000);
          logout();
          const current = `${window.location.pathname}${window.location.search}`;
          window.location.href = `/admin/login?redirect=${encodeURIComponent(current)}`;
          return;
        }
        showToast(parsed?.message || 'Không xoá được sản phẩm', 'error', 6000);
      }
    }
  };

  const handleCreateProduct = () => {
    navigate('/admin/products/create');
  };

  return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quản lý Sản phẩm</h1>
          <button 
            onClick={handleCreateProduct}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 font-semibold shadow-sm transition-colors"
          >
            <span className="text-sm">Tạo sản phẩm</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <FilterBar 
            onSearchChange={handleSearchChange} 
            onFilterChange={handleFilterChange}
            onBulkDelete={selectedItems.length > 0 ? handleDeleteSelected : null}
            selectedCount={selectedItems.length}
          />
          
          <ProductsTable 
            products={products}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onSortChange={handleSortChange}
            currentSort={{ sortBy: filters.sortBy, sortOrder: filters.sortOrder }}
          />

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Hiển thị {products?.length} / {totalCount} sản phẩm
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              >
                Trước
              </button>
              <span className="px-3 py-1 bg-gray-100 rounded">
                {filters.page}
              </span>
              <button 
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={products?.length < filters.limit}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Products;