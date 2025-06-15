import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaShare, FaPhoneAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/Toast/ToastContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast ? useToast() : { showToast: () => {} };
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [flyingImage, setFlyingImage] = useState(null);

  // Fake product data - replace with API call
  const product = {
    id: parseInt(id),
    name: 'Xi lanh thủy lực 2 chiều',
    description: 'Xi lanh thủy lực 2 chiều, hành trình 200mm, đường kính 50mm',
    price: 2500000,
    category: 'cylinder',
    images: [
      'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg',
      'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg',
      'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg',
      'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg',
    ],
    specifications: [
      { label: 'Hành trình', value: '200mm' },
      { label: 'Đường kính', value: '50mm' },
      { label: 'Áp suất làm việc', value: '200 bar' },
      { label: 'Nhiệt độ làm việc', value: '-20°C đến +80°C' },
      { label: 'Môi trường làm việc', value: 'Dầu thủy lực ISO VG 32-68' },
      { label: 'Vật liệu', value: 'Thép hợp kim, thép không gỉ' },
    ],
    features: [
      'Thiết kế 2 chiều, hoạt động mượt mà',
      'Độ bền cao, chống ăn mòn',
      'Dễ dàng bảo trì và thay thế',
      'Đạt tiêu chuẩn ISO 9001:2015',
      'Bảo hành 12 tháng',
    ],
  };

  // Related products - replace with API call
  const relatedProducts = [
    {
      id: 2,
      name: 'Xi lanh thủy lực 1 chiều',
      price: 1800000,
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 3,
      name: 'Xi lanh thủy lực mini',
      price: 1200000,
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 4,
      name: 'Xi lanh thủy lực công nghiệp',
      price: 3500000,
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
  ];

  const handleAddToCart = (e) => {
    if (e) e.preventDefault();
    addToCart({
      title: product.name,
      price: product.price.toLocaleString() + 'đ',
      image: product.images[selectedImage]
    });
    if (showToast) showToast('Đã thêm vào giỏ hàng!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              <button 
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                onClick={handleAddToCart}
              >
                <FaShoppingCart className="text-blue-600" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-blue-600">
                {product.price.toLocaleString()} đ
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Large Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-lg"
              style={{ marginTop: '1.5rem' }}
            >
              <FaShoppingCart size={24} /> Thêm vào giỏ hàng
            </button>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <FaHeart />
                <span>Yêu thích</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <FaShare />
                <span>Chia sẻ</span>
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tính năng nổi bật</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Cần tư vấn thêm?</p>
                  <a href="tel:0966201140" className="text-blue-600 font-semibold hover:underline">
                    0966 201 140
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <button 
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          title: product.name,
                          price: product.price,
                          image: product.image,
                          quantity: 1
                        });
                      }}
                    >
                      <FaShoppingCart className="text-blue-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {product.price.toLocaleString()} đ
                      </span>
                      <Link 
                        to={`/products/${product.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Flying Image Animation */}
      <AnimatePresence>
        {flyingImage && (
          <motion.div
            initial={{
              position: 'fixed',
              top: flyingImage.rect.top,
              left: flyingImage.rect.left,
              width: flyingImage.rect.width,
              height: flyingImage.rect.height,
              zIndex: 50,
            }}
            animate={{
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1,
              ease: 'easeInOut',
            }}
            className="pointer-events-none"
          >
            <img
              src={flyingImage.src}
              alt="Flying product"
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;