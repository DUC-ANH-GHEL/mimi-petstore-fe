import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="text-2xl font-extrabold text-white">MiMi Petwear</div>
            <p className="mt-3 text-gray-300 max-w-xl">
              Outfit & phụ kiện cho thú cưng theo vibe streetwear — mềm, xịn, dễ phối.
              Mặc lên là muốn chụp hình ngay.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:items-center">
              <a
                href="tel:0966201140"
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700 transition"
              >
                Hotline: 0966 201 140
              </a>
              <a
                href="mailto:contact@mimipetwear.vn"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/15 transition"
              >
                Email: contact@mimipetwear.vn
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white tracking-wider">MUA SẮM</div>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/products" className="hover:text-white">Shop sản phẩm</Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-white">Thanh toán</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">Tư vấn size</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-white tracking-wider">HỖ TRỢ</div>
            <ul className="mt-4 space-y-2">
              <li>
                <a className="hover:text-white" href="#">Chính sách đổi trả</a>
              </li>
              <li>
                <a className="hover:text-white" href="#">Vận chuyển</a>
              </li>
              <li>
                <a className="hover:text-white" href="#">Hướng dẫn chọn size</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-gray-400 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} MiMi Petwear. All rights reserved.</div>
          <div className="text-gray-500">Made for pets. Designed for style.</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;