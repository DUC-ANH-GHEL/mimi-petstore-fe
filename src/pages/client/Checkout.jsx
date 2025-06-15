import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaMapMarkerAlt, FaStickyNote } from 'react-icons/fa';

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Vui lòng nhập họ tên';
  if (!form.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
  else if (!/^0\d{9,10}$/.test(form.phone.trim())) errors.phone = 'Số điện thoại không hợp lệ';
  if (!form.address.trim()) errors.address = 'Vui lòng nhập địa chỉ';
  return errors;
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, p) => {
    const priceNum = parseInt(p.price.replace(/[^0-9]/g, ''));
    return sum + priceNum * p.quantity;
  }, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleBlur = (e) => {
    const field = e.target.name;
    const fieldError = validate({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: fieldError[field] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      console.log('Đơn hàng:', { ...form, cart });
      clearCart();
      setSubmitting(false);
      alert('Đặt hàng thành công!');
      navigate('/');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Giỏ hàng trống</h2>
          <p>Vui lòng chọn sản phẩm trước khi thanh toán.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6 order-2 md:order-1">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Thông tin khách hàng</h2>
          <div>
            <label className="block font-semibold mb-1" htmlFor="name">Họ và tên <span className="text-red-500">*</span></label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Nhập số điện thoại"
                required
                pattern="0[0-9]{9,10}"
                inputMode="numeric"
              />
            </div>
            {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="address">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                value={form.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Nhập địa chỉ nhận hàng"
                required
              />
            </div>
            {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="note">Ghi chú</label>
            <div className="relative">
              <FaStickyNote className="absolute left-3 top-3 text-gray-400" />
              <textarea
                id="note"
                name="note"
                rows={3}
                value={form.note}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-lg mt-4"
          >
            {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </button>
        </form>
        {/* Right: Cart summary */}
        <div className="flex-1 order-1 md:order-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sản phẩm đã chọn</h2>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-gray-700">Tổng cộng:</span>
            <span className="text-2xl font-bold text-orange-500">{total.toLocaleString()} đ</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-100">
            <ul className="divide-y divide-gray-200">
              {cart.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 py-3">
                  <img src={item.image} alt={item.title} className="w-14 h-14 rounded object-cover border" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{item.title}</div>
                    <div className="text-sm text-gray-500">SL: {item.quantity} x {item.price}</div>
                  </div>
                  <div className="font-bold text-blue-600 whitespace-nowrap">
                    {(parseInt(item.price.toString().replace(/[^\d]/g, '')) * item.quantity).toLocaleString()} đ
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 