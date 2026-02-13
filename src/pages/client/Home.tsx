import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';

import ProductCard from '../../components/products/ProductCard';
import CategoryCard from '../../components/categories/CategoryCard';
import {
  storefrontCategories,
  storefrontProducts,
  formatVnd,
} from '../../data/storefrontMock';

const Home = () => {
  const heroImage =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1800&q=80';

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="MiMi Petwear"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-gray-900/20" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl text-white">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"
            >
              <Sparkles size={16} className="text-rose-300" />
              Streetwear cho boss — mặc là nổi
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight"
            >
              MiMi Petwear
              <span className="block text-rose-200">Outfit xịn, fit đẹp, vibe hiện đại</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-4 text-base sm:text-lg text-gray-100"
            >
              Chọn nhanh theo style — hoodie, áo mưa, outfit chụp hình và phụ kiện. Nhìn phát muốn mua,
              mặc phát muốn khoe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-7 flex flex-col sm:flex-row gap-3"
            >
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700 transition"
              >
                Mua ngay <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/15 transition"
              >
                Tư vấn size / fit
              </Link>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck size={18} className="text-rose-200" />
                  Chất liệu êm
                </div>
                <div className="mt-1 text-sm text-gray-200">Mềm, thoáng, boss mặc dễ chịu.</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 font-semibold">
                  <Truck size={18} className="text-rose-200" />
                  Giao nhanh
                </div>
                <div className="mt-1 text-sm text-gray-200">Đóng gói gọn gàng, gửi liền tay.</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles size={18} className="text-rose-200" />
                  Lên hình đẹp
                </div>
                <div className="mt-1 text-sm text-gray-200">Form “ăn ảnh” — shot nào cũng slay.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop theo phong cách</h2>
              <p className="mt-2 text-gray-600">Chọn nhanh theo nhu cầu — dễ phối, dễ mua, dễ mê.</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 text-rose-700 font-semibold hover:text-rose-800"
            >
              Xem tất cả <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storefrontCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best-seller tuần này</h2>
              <p className="mt-2 text-gray-600">Mua nhanh những món đang được chọn nhiều.</p>
            </div>
            <div className="hidden sm:block text-sm text-gray-500">
              Từ <span className="font-semibold text-gray-900">{formatVnd(59000)}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storefrontProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-rose-600 to-fuchsia-600 p-8 sm:p-10 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold">Cần tư vấn size nhanh?</h3>
                <p className="mt-2 text-white/90">
                  Nhắn MiMi để chọn size & form hợp dáng — tránh mua sai, boss mặc thoải mái.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition"
              >
                Liên hệ ngay <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 