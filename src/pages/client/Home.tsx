import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTruck, FaTools, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Wrench, Ruler, BellRing, Truck, ChevronRight, PhoneCall, Users, Star } from 'lucide-react';

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
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Hero Section (Swiper + motion như cũ) */}
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
          {/* Thêm các slide khác nếu muốn */}
        </Swiper>
      </section>

      {/* Dãy icon vàng */}
      <section className="bg-white py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="flex flex-col items-center text-center w-32">
            <div className="bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center mb-2 shadow-lg">
              <Wrench size={32} className="text-white" />
            </div>
            <span className="font-semibold text-sm">Lắp chuẩn từng Đời máy</span>
          </div>
          <div className="flex flex-col items-center text-center w-32">
            <div className="bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center mb-2 shadow-lg">
              <Ruler size={32} className="text-white" />
            </div>
            <span className="font-semibold text-sm">Vật liệu, tháp đúc - ỷ ai mà dày</span>
          </div>
          <div className="flex flex-col items-center text-center w-32">
            <div className="bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center mb-2 shadow-lg">
              <BellRing size={32} className="text-white" />
            </div>
            <span className="font-semibold text-sm">Báo kênh chỉnh hãng 13 tháng</span>
          </div>
          <div className="flex flex-col items-center text-center w-32">
            <div className="bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center mb-2 shadow-lg">
              <Truck size={32} className="text-white" />
            </div>
            <span className="font-semibold text-sm">Giao lắp tận nơi toàn quốc</span>
          </div>
        </div>
      </section>

      {/* 3 sản phẩm nổi bật */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center">
          <div className="flex-1 bg-yellow-400 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 min-h-[220px] hover:scale-105 transition">
            <img src="https://res.cloudinary.com/diwxfpt92/image/upload/v1750050820/Untitled_nwvhuf.png" alt="Trang gạt" className="h-24 mb-3" />
            <div className="font-bold text-lg text-white mb-1">TRANG GẠT THUỶ LỰC KTM</div>
          </div>
          <div className="flex-1 bg-blue-900 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 min-h-[220px] hover:scale-105 transition">
            <img src="https://res.cloudinary.com/diwxfpt92/image/upload/v1749300461/combo_van_3_tay_3_xylanh_nghi%C3%AAng_gi%E1%BB%AFa_%E1%BB%A7i_mgppxh.jpg" alt="Ty xy lanh" className="h-24 mb-3" />
            <div className="font-bold text-lg text-white mb-1">TY XY LANH I GIỮA / NGHIÊNG / ỦI</div>
          </div>
          <div className="flex-1 bg-green-100 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 min-h-[220px] hover:scale-105 transition">
            <img src="https://res.cloudinary.com/diwxfpt92/image/upload/v1750050550/ChatGPT_Image_12_08_50_16_thg_6_2025_c1nmwg.png" alt="Combo" className="h-24 mb-3" />
            <div className="font-bold text-lg text-green-900 mb-1">COMBO TRỌN BỘ LẮP ĐẶT</div>
          </div>
        </div>
      </section>

      {/* Bảng báo giá nhanh */}
      <section className="py-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <div className="font-bold text-xl mb-2 md:mb-0">BÁO GIÁ NHANH</div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-full shadow flex items-center gap-2 transition">
              <PhoneCall size={20} /> GỌI TƯ VẤN NHANH
            </button>
          </div>
          <table className="w-full mt-2 text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="text-left py-1">MTM gà</th>
                <th className="text-left py-1">Giá giá</th>
                <th className="text-left py-1">KTM</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td>KTM Thuỷ GẠT KG 190</td>
                <td className="text-yellow-600 font-bold">15,900,000 đ</td>
                <td>KTM</td>
              </tr>
              <tr className="border-t">
                <td>KTM Thuỷ GẠT KG 250</td>
                <td className="text-yellow-600 font-bold">16,900,000 đ</td>
                <td>KTM</td>
              </tr>
              <tr className="border-t">
                <td>KTM Thuỷ GẠT KG 250</td>
                <td className="text-yellow-600 font-bold">21,500,000 đ</td>
                <td>KTM</td>
              </tr>
            </tbody>
          </table>
          <div className="text-xs text-gray-500 mt-2">Giá đã bao gồm công lắp tận nơi; chưa bao gồm gọn chuyển (BIG gỗ)</div>
        </div>
      </section>

      {/* Block ảnh thực tế + form đăng ký */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Ảnh thực tế */}
          <div className="flex-1 flex gap-4">
            <img src="/images/real/1.jpg" className="rounded-xl shadow w-32 h-24 object-cover" />
            <img src="/images/real/2.jpg" className="rounded-xl shadow w-32 h-24 object-cover" />
            <img src="/images/real/3.jpg" className="rounded-xl shadow w-32 h-24 object-cover" />
          </div>
          {/* Form đăng ký */}
          <div className="w-full md:w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3">
            <div className="font-bold text-lg mb-2">ĐĂNG KÝ TƯ VẤN</div>
            <input className="rounded-lg border px-3 py-2 mb-2" placeholder="Tên" />
            <input className="rounded-lg border px-3 py-2 mb-2" placeholder="Đại lý/ cty máy" />
            <input className="rounded-lg border px-3 py-2 mb-2" placeholder="Dòng dùng" />
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg mt-2">ĐĂNG KÝ NGAY</button>
          </div>
        </div>
      </section>

      {/* Dãy logo đối tác */}
      <section className="py-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-8">
          <img src="/images/partners/thaco.png" className="h-8" />
          <img src="/images/partners/kubota.png" className="h-8" />
          <img src="/images/partners/vinacoma.png" className="h-8" />
          <img src="/images/partners/mbb.png" className="h-8" />
        </div>
      </section>

      {/* Hội thích cao KTM */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <div className="font-bold text-2xl mb-3 flex items-center gap-2"><Users size={28} className="text-blue-700" /> Hội thích cao KTM</div>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
              <li>KTM Hysbaluk: Nika máy sẵn, tủi; Đạt ng INổi, Dóng fai Hà Khang Hít Nổi!</li>
              <li>Gai đã được lắp khắp Hà Nội, Bình Dương</li>
              <li>Oval 10 gạn Hà Nghộn</li>
              <li>Trên 1000 máy đã tập dơi toàn quốc</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/images/real/staff.jpg" className="rounded-2xl shadow-xl w-80 object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 