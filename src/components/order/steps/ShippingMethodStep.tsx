// // 📁 src/components/order/steps/ShippingMethodStep.tsx
// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const SHIPPING_METHODS = [
//   { id: 'standard', name: 'Tiêu chuẩn', description: 'Giao hàng trong 2-3 ngày' },
//   { id: 'economy', name: 'Tiết kiệm', description: 'Giao hàng trong 3-5 ngày' },
//   { id: 'express', name: 'Hoả tốc', description: 'Giao trong 24 giờ' },
// ];

// type Props = {
//   onNext: () => void;
//   onPrev: () => void;
// };

// const ShippingMethodStep: React.FC<Props> = ({ onNext, onPrev }) => {
//   const [selected, setSelected] = useState('');

//   return (
//     <div className="bg-white p-6 rounded-lg shadow mb-6">
//       <h2 className="text-lg font-semibold flex items-center gap-3 mb-4">
//         <span className="rounded-full bg-emerald-600 text-white w-6 h-6 flex items-center justify-center text-sm">4</span>
//         Phương thức giao hàng
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {SHIPPING_METHODS.map(method => (
//           <div
//             key={method.id}
//             onClick={() => setSelected(method.id)}
//             className={`border rounded p-4 cursor-pointer transition ${
//               selected === method.id ? 'border-emerald-600 bg-emerald-50' : 'hover:bg-gray-50'
//             }`}
//           >
//             <div className="font-semibold text-emerald-700 mb-1">{method.name}</div>
//             <div className="text-sm text-gray-600">{method.description}</div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 flex justify-between">
//         <button
//           onClick={onPrev}
//           className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
//         >
//           <ChevronLeft className="h-4 w-4" /> Quay lại
//         </button>
//         <button
//           onClick={onNext}
//           disabled={!selected}
//           className={`flex items-center gap-2 px-4 py-2 rounded ${
//             selected ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//           }`}
//         >
//           Tiếp theo <ChevronRight className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ShippingMethodStep;

// 📁 src/components/order/steps/ShippingMethodStep.tsx
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShippingMethod } from '../../../types/order';

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Tiêu chuẩn', description: 'Giao hàng trong 2-3 ngày' },
  { id: 'economy', name: 'Tiết kiệm', description: 'Giao hàng trong 3-5 ngày' },
  { id: 'express', name: 'Hoả tốc', description: 'Giao trong 24 giờ' },
];

type Props = {
  value: ShippingMethod;
  onChange: (method: ShippingMethod) => void;
  onNext: () => void;
  onPrev: () => void;
};

const ShippingMethodStep: React.FC<Props> = ({ value, onChange, onNext, onPrev }) => {
  const [selected, setSelected] = useState<ShippingMethod>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (method: ShippingMethod) => {
    setSelected(method);
    onChange(method);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold flex items-center gap-3 mb-4">
        <span className="rounded-full bg-emerald-600 text-white w-6 h-6 flex items-center justify-center text-sm">4</span>
        Phương thức giao hàng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {SHIPPING_METHODS.map(method => (
          <div
            key={method.id}
            onClick={() => handleSelect(method.id as ShippingMethod)}
            className={`border rounded p-4 cursor-pointer transition ${
              selected === method.id ? 'border-emerald-600 bg-emerald-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="font-semibold text-emerald-700 mb-1">{method.name}</div>
            <div className="text-sm text-gray-600">{method.description}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" /> Quay lại
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            selected ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Tiếp theo <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ShippingMethodStep;
