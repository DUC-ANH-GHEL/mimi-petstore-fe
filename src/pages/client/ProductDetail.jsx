import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaShare, FaPhoneAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/Toast/ToastContext';
import { storefrontProducts, formatVnd } from '../../data/storefrontMock';

const IMAGE_DEFAULT_URL = 'https://res.cloudinary.com/diwxfpt92/image/upload/v1770981822/logo_d2wmlf.png';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast ? useToast() : { showToast: () => {} };
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [flyingImage, setFlyingImage] = useState(null);

  const productId = Number(id);
  const product = storefrontProducts.find((p) => p.id === productId);

  const relatedProducts = product
    ? storefrontProducts
        .filter((p) => p.category_id === product.category_id && p.id !== product.id)
        .slice(0, 4)
    : [];

  const specifications = [
    { label: 'Chất liệu', value: 'Mềm, thoáng, dễ vệ sinh' },
    { label: 'Form', value: 'Ôm vừa, dễ vận động' },
    { label: 'Phù hợp', value: 'Đi dạo / chụp hình / đi chơi' },
    { label: 'Bảo quản', value: 'Giặt nhẹ, phơi mát' },
  ];

  const features = [
    'Chất vải “mặc là thích” — mềm & không cấn',
    'Dễ phối: lên outfit nhanh trong 10 giây',
    'Đường may gọn gàng, bền',
    'Hợp nhiều dáng — tư vấn size nhanh',
  ];

  const handleAddToCart = (e) => {
    if (e) e.preventDefault();
    if (!product) return;
    addToCart({
      title: product.name,
      price: formatVnd(product.price),
      image: product.images?.[selectedImage] || product.images?.[0] || IMAGE_DEFAULT_URL
    });
    if (showToast) showToast('Đã thêm vào giỏ hàng!', 'success');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <h1 className="text-2xl font-extrabold text-gray-900">Không tìm thấy sản phẩm</h1>
            <p className="mt-2 text-gray-600">Sản phẩm bạn đang xem không tồn tại hoặc đã bị ẩn.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700 transition"
            >
              Quay lại shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-rose-600">Shop</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
              <img
                src={product.images?.[selectedImage] || product.images?.[0] || IMAGE_DEFAULT_URL}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              <button 
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                onClick={handleAddToCart}
              >
                <FaShoppingCart className="text-rose-600" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-rose-600' : 'border-transparent'
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
              <span className="text-3xl font-bold text-rose-600">
                {formatVnd(product.price)}
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
              className="w-full py-4 bg-rose-600 text-white text-xl font-bold rounded-lg hover:bg-rose-700 transition flex items-center justify-center gap-3 shadow-lg"
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
                {specifications.map((spec, index) => (
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
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-rose-600" />
                <div>
                  <p className="text-sm text-gray-600">Cần tư vấn thêm?</p>
                  <a href="tel:0966201140" className="text-rose-600 font-semibold hover:underline">
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
                      src={product.images?.[0] || IMAGE_DEFAULT_URL}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <button 
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          title: product.name,
                          price: formatVnd(product.price),
                          image: product.images?.[0] || IMAGE_DEFAULT_URL
                        });
                        if (showToast) showToast('Đã thêm vào giỏ hàng!', 'success');
                      }}
                    >
                      <FaShoppingCart className="text-rose-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-rose-600">
                        {formatVnd(product.price)}
                      </span>
                      <Link 
                        to={`/products/${product.id}`}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
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