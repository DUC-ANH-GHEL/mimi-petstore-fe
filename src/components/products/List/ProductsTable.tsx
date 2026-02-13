import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const getProductThumb = (product: any): string | undefined => {
    if (!product) return undefined;

    // Back/forward compatible fields
    const direct = product.image || product.image_url || product.thumbnail || product.imageUrl;
    if (typeof direct === 'string' && direct.trim()) return direct;

    const images = product.images;
    if (Array.isArray(images) && images.length > 0) {
      const first = images[0];
      if (typeof first === 'string' && first.trim()) return first;
      if (first && typeof first === 'object') {
        const url = (first as any).image_url || (first as any).url;
        if (typeof url === 'string' && url.trim()) return url;
      }
    }

    return undefined;
  };


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
      ? <span className="text-rose-600 ml-1">↑</span> 
      : <span className="text-rose-600 ml-1">↓</span>;
  };

  // Edit product
  const handleEdit = (e, productId) => {
    e.stopPropagation();
    navigate(`/admin/product/update/${productId}`);
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
    <>
      {/* Mobile Card List */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products?.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4 items-center hover:border-gray-300 dark:hover:border-gray-700 transition cursor-pointer"
            onClick={() => handleRowClick(product.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {getProductThumb(product) ? (
                <img src={getProductThumb(product)} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">No img</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{product.name}</div>
              <div className="text-orange-600 font-bold text-lg mb-1">{formatPrice(product.price)}</div>
              <div className="flex flex-wrap gap-2 items-center text-xs mb-1">
                <StatusBadge status={product.is_active} />
                <span className="bg-rose-50 text-rose-700 rounded px-2 py-0.5">SKU: {product.sku}</span>
                <span className="bg-green-50 text-green-700 rounded px-2 py-0.5">{product.affiliate} %</span>
                <span className="bg-gray-50 text-gray-700 rounded px-2 py-0.5">{product.category?.name || '-'}</span>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={e => { e.stopPropagation(); handleEdit(e, product.id); }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center gap-2 text-sm shadow-sm hover:bg-rose-700 transition"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border-separate border-spacing-0">
          <thead className="bg-gradient-to-r from-rose-600 to-rose-700 text-white">
            <tr>
              <th className="sticky top-0 border-b px-4 py-3 text-left hidden lg:table-cell">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 hidden lg:table-cell"
                />
              </th>
              <th className="sticky top-0 border-b px-4 py-3 text-left hidden lg:table-cell">Ảnh</th>
              <th 
                className="sticky top-0 border-b px-4 py-3 text-left cursor-pointer sm:table-cell lg:table-cell"
                onClick={() => handleSort('name')}
              >
                <span className="flex items-center">
                  Tên sản phẩm
                  <SortIcon field="name" />
                </span>
              </th>
              <th 
                className="sticky top-0 border-b px-4 py-3 text-right cursor-pointer sm:table-cell lg:table-cell"
                onClick={() => handleSort('price')}
              >
                <span className="flex items-center justify-end">
                  Giá bán
                  <SortIcon field="price" />
                </span>
              </th>
              <th 
                className="sticky top-0 border-b px-4 py-3 text-right cursor-pointer hidden md:hidden lg:table-cell"
                onClick={() => handleSort('affiliate')}
              >
                <span className="flex items-center justify-end">
                  Affiliate
                  <SortIcon field="affiliate" />
                </span>
              </th>
              <th className="sticky top-0 border-b px-4 py-3 text-left hidden md:hidden lg:table-cell">Trạng thái</th>
              <th className="sticky top-0 border-b px-4 py-3 text-left hidden md:hidden lg:table-cell">Danh mục</th>
              <th className="sticky top-0 border-b px-4 py-3 text-center hidden lg:table-cell">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <motion.tr 
                key={product.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(product.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                <td className="border-b px-4 py-3 hidden md:hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product.id)}
                    onChange={(e) => onSelectItem(product.id, e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                </td>
                <td className="border-b px-4 py-3 hidden lg:table-cell">
                  {getProductThumb(product) ? (
                    <img src={getProductThumb(product)} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      No img
                    </div>
                  )}
                </td>
                <td className="border-b px-4 py-3 sm:table-cell lg:table-cell">
                  <div className="font-bold text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                </td>
                <td className="border-b px-4 py-3 text-right sm:table-cell lg:table-cell">
                  <div className="text-orange-600 font-bold">{formatPrice(product.price)}</div>
                </td>
                <td className="border-b px-4 py-3 text-right hidden md:hidden lg:table-cell">
                  <div className="text-green-600 font-bold">{product.affiliate} %</div>
                </td>
                <td className="border-b px-4 py-3 hidden md:hidden lg:table-cell">
                  <StatusBadge status={product.is_active} />
                </td>
                <td className="border-b px-4 py-3 hidden md:hidden lg:table-cell">
                  <div className="text-gray-700">{product.category?.name || '-'}</div>
                </td>
                <td className="border-b px-4 py-3 text-center hidden lg:table-cell">
                  <button
                    onClick={e => { e.stopPropagation(); handleEdit(e, product.id); }}
                    className="py-2 px-4 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center gap-2 text-sm shadow-sm hover:bg-rose-700 transition"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
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