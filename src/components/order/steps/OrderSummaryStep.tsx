// 📁 src/components/order/steps/OrderSummaryStep.tsx
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Address, Customer, Product, ShippingMethod } from '../../../types/order';
import { createOrder } from '../../../services/viettelpostservice';

type Props = {
  customer: Customer;
  address: Address;
  products: Product[];
//   shipping: {
//     method: ShippingMethod;
//     fee: number;
//   };
shipping: ShippingMethod
  onPrev: () => void;
  onCreate: () => void;
  provinces: { PROVINCE_ID: number; PROVINCE_NAME: string }[];
  districts: { DISTRICT_ID: number; DISTRICT_NAME: string }[];
  wards: { WARDS_ID: number; WARDS_NAME: string }[];
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('vi-VN') + ' đ';
};


const OrderSummaryStep: React.FC<Props> = ({
  customer,
  address,
  products,
  shipping,
  onPrev,
  onCreate,
  provinces,
  districts,
  wards,
}) => {
  const getProvinceName = (id: number) => provinces.find(p => p.PROVINCE_ID === id)?.PROVINCE_NAME || '';
  const getDistrictName = (id: number) => districts.find(d => d.DISTRICT_ID === id)?.DISTRICT_NAME || '';
  const getWardName = (id: number) => wards.find(w => w.WARDS_ID === id)?.WARDS_NAME || '';

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  onCreate = async () => {
    try {
      const payload = {
        items: products.map(p => ({
          product_id: p.id,
          quantity: p.quantity
        })),
        payment_method: shipping.SERVICE_CODE,
        note: '',
        receiver_name: customer.name,
        receiver_phone: address.receiverPhone,
        receiver_address: address.detail,
        receiver_province_id: address.province,
        receiver_district_id: address.district,
        receiver_ward_id: address.ward,
      };
  
      const res = await createOrder(payload);
      console.log('Đơn hàng đã tạo:', res);
      alert('Tạo đơn thành công');
      // TODO: bạn có thể redirect hoặc hiển thị thông báo tại đây
    } catch (err) {
      console.error('Tạo đơn hàng thất bại:', err);
      alert('Tạo đơn hàng thất bại!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold flex items-center gap-3 mb-4">
        <span className="rounded-full bg-emerald-600 text-white w-6 h-6 flex items-center justify-center text-sm">5</span>
        Tóm tắt đơn hàng
      </h2>

      <div className="mb-4">
        <h3 className="font-medium">Khách hàng</h3>
        <p>Họ tên: {customer.name}</p>
        <p>Số điện thoại: {customer.phone}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-medium">Địa chỉ giao hàng</h3>
        <p>
          {getProvinceName(address.province)}, {getDistrictName(address.district)}, {getWardName(address.ward)}, {address.detail}
        </p>
        <p>SĐT người nhận: {address.receiverPhone}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-medium">Phương thức giao hàng</h3>
        <p>
          {/* {shipping.method === 'standard' && 'Tiêu chuẩn'}
          {shipping.method === 'economy' && 'Tiết kiệm'}
          {shipping.method === 'express' && 'Hỏa tốc'} */}
          {shipping.SERVICE_NAME}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-medium">Sản phẩm</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Tên</th>
              <th className="p-2 text-right">Đơn giá</th>
              <th className="p-2 text-center">SL</th>
              <th className="p-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2 text-right">{formatCurrency(p.price)}</td>
                <td className="p-2 text-center">{p.quantity}</td>
                <td className="p-2 text-right">{formatCurrency(p.price * p.quantity)}</td>
              </tr>
            ))}
             <tr className="border-t font-semibold">
              <td className="p-2">Phí vận chuyển</td>
              <td></td>
              <td></td>
              <td className="p-2 text-right">{formatCurrency(shipping.MONEY_TOTAL)}</td>
            </tr>
            {/* <tr className="border-t font-semibold">
              <td className="p-2">Phí VAT</td>
              <td></td>
              <td></td>
              <td className="p-2 text-right">{formatCurrency(shipping.MONEY_VAT)}</td>
            </tr> */}
            <tr className="border-t font-semibold">
              <td className="p-2">Tổng</td>
              <td></td>
              <td></td>
              <td className="p-2 text-right">{formatCurrency(subtotal + shipping.MONEY_TOTAL)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" /> Quay lại
        </button>
        <button
          onClick={onCreate}
          className="px-6 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Tạo đơn hàng
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryStep;
