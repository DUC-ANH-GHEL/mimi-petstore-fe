// // 📁 src/components/order/steps/OrderSummaryStep.tsx
// import React from 'react';
// import { ChevronLeft } from 'lucide-react';
// import { Customer, Product, Address, ShippingMethod } from '../../../types/order';

// type Props = {
//   onPrev: () => void;
//   onSubmit: () => void;
//   customer: Customer;
//   products: Product[];
//   address: Address;
//   shippingMethod: ShippingMethod;
// };

// const OrderSummaryStep: React.FC<Props> = ({
//   onPrev,
//   onSubmit,
//   customer,
//   products,
//   address,
//   shippingMethod,
// }) => {
//   const getShippingMethodLabel = (method: ShippingMethod) => {
//     switch (method) {
//       case 'standard': return 'Tiêu chuẩn';
//       case 'economy': return 'Tiết kiệm';
//       case 'express': return 'Hoả tốc';
//       default: return '';
//     }
//   };

//   const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow mb-6">
//       <h2 className="text-lg font-semibold flex items-center gap-3 mb-4">
//         <span className="rounded-full bg-emerald-600 text-white w-6 h-6 flex items-center justify-center text-sm">5</span>
//         Tóm tắt đơn hàng
//       </h2>

//       <div className="mb-6 space-y-4">
//         <div>
//           <h3 className="font-medium mb-1">Khách hàng</h3>
//           <p>Họ tên: {customer.name}</p>
//           <p>Số điện thoại: {customer.phone}</p>
//         </div>

//         <div>
//           <h3 className="font-medium mb-1">Địa chỉ giao hàng</h3>
//           <p>{address.detail}, {address.ward}, {address.district}, {address.province}</p>
//           <p>SĐT người nhận: {address.receiverPhone}</p>
//         </div>

//         <div>
//           <h3 className="font-medium mb-1">Phương thức giao hàng</h3>
//           <p>{getShippingMethodLabel(shippingMethod)}</p>
//         </div>

//         <div>
//           <h3 className="font-medium mb-1">Sản phẩm</h3>
//           <table className="w-full text-sm border rounded">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left p-2">Tên</th>
//                 <th className="text-right p-2">Đơn giá</th>
//                 <th className="text-center p-2">SL</th>
//                 <th className="text-right p-2">Thành tiền</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map(p => (
//                 <tr key={p.id} className="border-t">
//                   <td className="p-2">{p.name}</td>
//                   <td className="p-2 text-right">{p.price.toLocaleString()}đ</td>
//                   <td className="p-2 text-center">{p.quantity}</td>
//                   <td className="p-2 text-right">{(p.price * p.quantity).toLocaleString()}đ</td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr className="border-t font-semibold">
//                 <td colSpan={3} className="text-right p-2">Tổng</td>
//                 <td className="text-right p-2">{total.toLocaleString()}đ</td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>

//       <div className="mt-6 flex justify-between">
//         <button
//           onClick={onPrev}
//           className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
//         >
//           <ChevronLeft className="h-4 w-4" /> Quay lại
//         </button>
//         <button
//           onClick={onSubmit}
//           className="px-6 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
//         >
//           Tạo đơn hàng
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSummaryStep;

// 📁 src/components/order/steps/OrderSummaryStep.tsx
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Address, Customer, Product, ShippingMethod } from '../../../types/order';

type Props = {
  customer: Customer;
  address: Address;
  products: Product[];
  shipping: {
    method: ShippingMethod;
    fee: number;
  };
  onPrev: () => void;
  onCreate: () => void;
  provinces: { PROVINCE_ID: number; PROVINCE_NAME: string }[];
  districts: { DISTRICT_ID: number; DISTRICT_NAME: string }[];
  wards: { WARDS_ID: number; WARDS_NAME: string }[];
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
          {shipping.method === 'standard' && 'Tiêu chuẩn'}
          {shipping.method === 'economy' && 'Tiết kiệm'}
          {shipping.method === 'express' && 'Hỏa tốc'}
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
                <td className="p-2 text-right">{p.price}đ</td>
                <td className="p-2 text-center">{p.quantity}</td>
                <td className="p-2 text-right">{p.price * p.quantity}đ</td>
              </tr>
            ))}
            <tr className="border-t font-semibold">
              <td className="p-2">Tổng</td>
              <td></td>
              <td></td>
              <td className="p-2 text-right">{subtotal + shipping.fee}đ</td>
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
