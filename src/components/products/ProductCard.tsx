import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="relative pb-[100%]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-teal-600 font-bold">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500">
              SKU: {product.sku}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 