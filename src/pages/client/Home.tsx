import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTruck, FaTools, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Initialize Swiper modules
SwiperCore.use([Autoplay, Navigation, Pagination]);

// Components
import ProductCard from '../../components/products/ProductCard';
import CategoryCard from '../../components/categories/CategoryCard';
import NewsCard from '../../components/news/NewsCard';
import PartnerLogo from '../../components/partners/PartnerLogo';
import ProductShowcaseTabs from '../../components/products/ProductShowcaseTabs';
import HydraulicBladeProducts from '../../components/products/HydraulicBladeProducts';

// Types
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import { News } from '../../types/news';
import { Partner } from '../../types/partner';

// Mock data (sẽ được thay thế bằng API call)
const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Ty xy lanh thủy lực KTM-100',
    description: 'Ty xy lanh thủy lực chất lượng cao, chịu lực tốt',
    price: 2500000,
    images: ['/images/products/ty-xy-lanh-1.jpg'],
    category_id: 1,
    sku: 'KTM-100',
    stock: 10,
    status: 'active',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  // Thêm các sản phẩm khác...
];

const categories: Category[] = [
  {
    id: 1,
    name: 'Ty xy lanh',
    description: 'Các loại ty xy lanh thủy lực chất lượng cao',
    image: '/images/categories/ty-xy-lanh.jpg',
    slug: 'ty-xy-lanh',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  // Thêm các danh mục khác...
];

const news: News[] = [
  {
    id: 1,
    title: 'KTM ra mắt dòng sản phẩm thủy lực mới',
    content: 'KTM tự hào giới thiệu dòng sản phẩm thủy lực mới với công nghệ tiên tiến...',
    image: '/images/news/news-1.jpg',
    slug: 'ktm-ra-mat-dong-san-pham-thuy-luc-moi',
    created_at: new Date(),
    updated_at: new Date()
  },
  // Thêm các tin tức khác...
];

const partners: Partner[] = [
  {
    id: 1,
    name: 'Partner 1',
    logo: '/images/partners/partner-1.png',
    website: 'https://partner1.com'
  },
  // Thêm các đối tác khác...
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-800">
        <Swiper
          navigation
          pagination={{ clickable: true }}
          className="h-full"
        >
          <SwiperSlide>
            <div className="relative h-full">
              <img
                src="https://res.cloudinary.com/diwxfpt92/image/upload/v1747538306/1_hh8ucd.jpg"
                alt="KTM Hydraulic"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl font-bold mb-4"
                  >
                    Ty xy lanh – Trang gạt KTM chính hãng
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl mb-8"
                  >
                    Bền bỉ – Lắp vừa mọi máy – Giao hàng toàn quốc – Bảo hành 12 tháng
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Link
                      to="/products"
                      className="bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition-colors"
                    >
                      Khám phá ngay
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {/* Thêm các slide khác */}
        </Swiper>
      </section>

      {/* Product Showcase Tabs */}
      <ProductShowcaseTabs />

      {/* Hydraulic Blade Products */}
      <HydraulicBladeProducts />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Giao hàng toàn quốc</h3>
              <p className="text-gray-600">Miễn phí vận chuyển cho đơn hàng từ 5 triệu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTools className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bảo hành chính hãng</h3>
              <p className="text-gray-600">Bảo hành 12 tháng cho tất cả sản phẩm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Đội ngũ kỹ thuật viên chuyên nghiệp</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">Sản phẩm chính hãng, chất lượng cao</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Danh Mục Sản Phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Sản Phẩm Nổi Bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Về KTM Hydraulic</h2>
              <p className="text-gray-600 mb-6">
                KTM Hydraulic tự hào là đơn vị cung cấp giải pháp thủy lực toàn diện cho các doanh nghiệp.
                Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi cam kết mang đến những sản phẩm chất lượng
                cao và dịch vụ chuyên nghiệp nhất.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                  Đội ngũ kỹ thuật viên giàu kinh nghiệm
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                  Sản phẩm chính hãng, chất lượng cao
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                  Dịch vụ bảo hành, bảo trì chuyên nghiệp
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                  Giá cả cạnh tranh, chính sách hậu mãi tốt
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="/images/about/about-1.jpg"
                alt="About KTM"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl font-bold text-teal-500 mb-2">10+</div>
                <div className="text-gray-600">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tin Tức & Sự Kiện</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/news"
              className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition-colors"
            >
              Xem tất cả tin tức
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Đối Tác</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner) => (
              <PartnerLogo key={partner.id} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Bạn cần tư vấn?</h2>
          <p className="text-xl mb-8">
            Hãy liên hệ với chúng tôi để được tư vấn miễn phí về giải pháp thủy lực
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 