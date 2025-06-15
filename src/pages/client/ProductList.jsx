import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/Toast/ToastContext';

const ProductList = () => {
  const { addToCart } = useCart();
  const { showToast } = useToast ? useToast() : { showToast: () => {} };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [flyingImage, setFlyingImage] = useState(null);

  // Mock categories
  const categories = [
    { id: 'all', name: 'Tất cả sản phẩm' },
    { id: 'cylinder', name: 'Xi lanh thủy lực' },
    { id: 'pump', name: 'Bơm thủy lực' },
    { id: 'valve', name: 'Van thủy lực' },
    { id: 'accessories', name: 'Phụ kiện' },
  ];

  // Fake products data
  const fakeProducts = [
    {
      id: 1,
      name: 'Xi lanh thủy lực 2 chiều',
      description: 'Xi lanh thủy lực 2 chiều, hành trình 200mm, đường kính 50mm',
      price: 2500000,
      category: 'cylinder',
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 2,
      name: 'Bơm thủy lực piston',
      description: 'Bơm thủy lực piston, công suất 5HP, áp suất 200 bar',
      price: 8500000,
      category: 'pump',
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 3,
      name: 'Van điều khiển thủy lực',
      description: 'Van điều khiển thủy lực 4/3, điện từ, 24V',
      price: 3500000,
      category: 'valve',
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 4,
      name: 'Ống thủy lực cao áp',
      description: 'Ống thủy lực cao áp, đường kính 1 inch, chịu áp 300 bar',
      price: 1200000,
      category: 'accessories',
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 5,
      name: 'Xi lanh thủy lực 1 chiều',
      description: 'Xi lanh thủy lực 1 chiều, hành trình 150mm, đường kính 40mm',
      price: 1800000,
      category: 'cylinder',
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 6,
      name: 'Bơm thủy lực bánh răng',
      description: 'Bơm thủy lực bánh răng, công suất 3HP, áp suất 150 bar',
      price: 4500000,
      category: 'pump',
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 7,
      name: 'Van an toàn thủy lực',
      description: 'Van an toàn thủy lực, điều chỉnh áp suất 0-300 bar',
      price: 2800000,
      category: 'valve',
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    },
    {
      id: 8,
      name: 'Bộ lọc dầu thủy lực',
      description: 'Bộ lọc dầu thủy lực, lọc 10 micron, lưu lượng 100L/phút',
      price: 950000,
      category: 'accessories',
      image: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg'
    }
  ];

  // Filter products based on search term, category, and price range
  const filteredProducts = fakeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      title: product.name,
      price: product.price.toLocaleString() + 'đ',
      image: product.image
    });
    if (showToast) showToast('Đã thêm vào giỏ hàng!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm thủy lực</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chuyên cung cấp các sản phẩm thủy lực chất lượng cao, đa dạng mẫu mã, giá cả cạnh tranh
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              <span>Lọc sản phẩm</span>
            </button>

            {/* Desktop Category Filter */}
            <div className="hidden md:flex gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 md:hidden">
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price.toLocaleString()} đ
                  </span>
                  {/* Desktop button */}
                  <button
                    className="hidden sm:flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition items-center gap-2"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <FaShoppingCart /> Thêm vào giỏ
                  </button>
                </div>
                {/* Mobile button */}
                <button
                  className="mt-3 sm:hidden w-full py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition flex items-center justify-center gap-2 text-base font-semibold"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <FaShoppingCart size={18} /> Thêm vào giỏ hàng
                </button>
              </div>
            </motion.div>
          ))}
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

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-600">Vui lòng thử lại với bộ lọc khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;