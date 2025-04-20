import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductsTable = ({ 
  products, 
  loading, 
  selectedItems,
  onSelectItem,
  onSelectAll,
  onSortChange,
  currentSort
}) => {
const navigate = useNavigate();


  // Format price with Vietnamese currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    let text = 'Không xác định';

    switch (status) {
      case true:
        bgColor = 'bg-green-100 text-green-800';
        text = 'Đang bán';
        break;
      case 'outOfStock':
        bgColor = 'bg-yellow-100 text-yellow-800';
        text = 'Hết hàng';
        break;
      case false:
        bgColor = 'bg-gray-100 text-gray-600';
        text = 'Ẩn';
        break;
    }
    
    return (
      <span className={`${bgColor} px-2 py-1 rounded-full text-xs font-medium`}>
        {text}
      </span>
    );
  };

  // Check if all visible items are selected
  const allSelected = products?.length > 0 && 
    products?.every(product => selectedItems.includes(product.id));

  // Handle sort
  const handleSort = (field) => {
    const newOrder = currentSort.sortBy === field && currentSort.sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newOrder);
  };

  // Sort icon
  const SortIcon = ({ field }) => {
    if (currentSort.sortBy !== field) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return currentSort.sortOrder === 'asc' 
      ? <span className="text-blue-600 ml-1">↑</span> 
      : <span className="text-blue-600 ml-1">↓</span>;
  };

  // Edit product
  const handleEdit = (e, productId) => {
    e.stopPropagation();
    navigate(`/admin/product/${productId}`);
  };

  // Table row click to view/edit detail
  const handleRowClick = (productId) => {
    navigate(`/admin/product/${productId}`);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (products?.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="sticky top-0 border-b px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </th>
            <th className="sticky top-0 border-b px-4 py-3 text-left">Ảnh</th>
            <th 
              className="sticky top-0 border-b px-4 py-3 text-left cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <span className="flex items-center">
                Tên sản phẩm
                <SortIcon field="name" />
              </span>
            </th>
            <th 
              className="sticky top-0 border-b px-4 py-3 text-right cursor-pointer"
              onClick={() => handleSort('price')}
            >
              <span className="flex items-center justify-end">
                Giá bán
                <SortIcon field="price" />
              </span>
            </th>
            <th className="sticky top-0 border-b px-4 py-3 text-left">Trạng thái</th>
            <th className="sticky top-0 border-b px-4 py-3 text-left">Danh mục</th>
            <th className="sticky top-0 border-b px-4 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr 
              key={product.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(product.id)}
            >
              <td className="border-b px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product.id)}
                  onChange={(e) => onSelectItem(product.id, e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </td>
              <td className="border-b px-4 py-3">
                <div className="w-12 h-12 relative">
                  {product.image ? (
                    // <img
                    //   src={product.image}
                    //   alt={product.name}
                    //   layout="fill"
                    //   objectFit="cover"
                    //   className="rounded"
                    // />
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />

                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">No img</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="border-b px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                </div>
              </td>
              <td className="border-b px-4 py-3 text-right font-medium">
                {formatPrice(product.price)}
              </td>
              <td className="border-b px-4 py-3">
                <StatusBadge status={product.is_active} />
              </td>
              <td className="border-b px-4 py-3">
                {product.category?.name || '-'}
              </td>
              <td className="border-b px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => handleEdit(e, product.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Sửa sản phẩm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9a2 2 0 11-4 0 2 2 0 014 0zM19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Loading skeleton
const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-7 gap-4 border-b py-3">
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
      </div>
      <div className="grid grid-cols-7 gap-4 border-b py-3">
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
      </div>
      <div className="grid grid-cols-7 gap-4 border-b py-3">
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
      </div>
    </div>
  );
};

export default ProductsTable;