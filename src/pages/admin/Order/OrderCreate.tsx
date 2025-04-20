
// // 📁 src/pages/admin/OrderCreate.tsx
// import React, { useState } from 'react';
// import StepIndicator from '../../../components/order/StepIndicator';
// import CustomerInfoStep from '../../../components/order/steps/CustomerInfoStep';
// import ProductSelectionStep from '../../../components/order/steps/ProductSelectionStep';
// import ShippingAddressStep from '../../../components/order/steps/ShippingAddressStep';
// import ShippingMethodStep from '../../../components/order/steps/ShippingMethodStep';
// import OrderSummaryStep from '../../../components/order/steps/OrderSummaryStep';
// import { Address, Customer, Product, ShippingMethod } from '../../../types/order';

// const OrderCreate = () => {
//   const [step, setStep] = useState(1);
//   const [customer, setCustomer] = useState<Customer>({ id: '', phone: '', name: '' });
//   const [products, setProducts] = useState<Product[]>([]);
//   const [address, setAddress] = useState<Address>({
//     province: 1, district: '', ward: '', detail: '', receiverPhone: ''
//   });
//   const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');

//   const handleCustomerChange = (field: 'phone' | 'name', value: string) => {
//     setCustomer(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-4 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Tạo đơn hàng mới</h1>
//         <StepIndicator currentStep={step} />

//         {step === 1 && (
//           <CustomerInfoStep
//             customer={customer}
//             onCustomerChange={handleCustomerChange}
//             onNext={() => setStep(2)}
//           />
//         )}

//         {step === 2 && (
//           <ProductSelectionStep
//             onNext={(selected) => {
//               setProducts(selected);
//               setStep(3);
//             }}
//             onPrev={() => setStep(1)}
//             selectedProducts={products}
//           />
//         )}

//         {step === 3 && (
//           <ShippingAddressStep
//             address={address}
//             onChange={setAddress}
//             onNext={() => setStep(4)}
//             onPrev={() => setStep(2)}
//           />
//         )}

//         {step === 4 && (
//           <ShippingMethodStep
//             value={shippingMethod}
//             onChange={setShippingMethod}
//             onNext={() => setStep(5)}
//             onPrev={() => setStep(3)}
//           />
//         )}

//         {step === 5 && (
//           // <OrderSummaryStep
//           //   customer={customer}
//           //   products={products}
//           //   address={address}
//           //   shippingMethod={shippingMethod}
//           //   onPrev={() => setStep(4)}
//           //   onSubmit={() => alert('Tạo đơn hàng thành công!')}
//           // />
//           <OrderSummaryStep
//   customer={state.customer}
//   address={state.address}
//   products={state.products}
//   shipping={state.shipping}
//   onPrev={prevStep}
//   onCreate={createOrder}
//   provinces={provinces}
//   districts={districts}
//   wards={wards}
// />

//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderCreate;


// version 2

// 📁 src/pages/admin/OrderCreate.tsx
import React, { useState, useEffect } from 'react';
import StepIndicator from '../../../components/order/StepIndicator';
import CustomerInfoStep from '../../../components/order/steps/CustomerInfoStep';
import ProductSelectionStep from '../../../components/order/steps/ProductSelectionStep';
import ShippingAddressStep from '../../../components/order/steps/ShippingAddressStep';
import ShippingMethodStep from '../../../components/order/steps/ShippingMethodStep';
import OrderSummaryStep from '../../../components/order/steps/OrderSummaryStep';
import { Address, Customer, Product, ShippingMethod } from '../../../types/order';
import { getProvinces, getDistricts, getWards } from '../../../services/viettelpostservice';

const OrderCreate = () => {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState<Customer>({ id: '', phone: '', name: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [address, setAddress] = useState<Address>({
    province: 0,
    district: 0,
    ward: 0,
    detail: '',
    receiverPhone: '',
  });
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    getProvinces().then((res) => {
      if (res?.data) setProvinces(res.data);
    });
  }, []);

  useEffect(() => {
    if (address.province) {
      getDistricts(Number(address.province)).then((res) => {
        if (res?.data) setDistricts(res.data);
      });
    }
  }, [address.province]);

  useEffect(() => {
    if (address.district) {
      getWards(Number(address.district)).then((res) => {
        if (res?.data) setWards(res.data);
      });
    }
  }, [address.district]);

  const handleCustomerChange = (field: 'phone' | 'name', value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tạo đơn hàng mới</h1>
        <StepIndicator currentStep={step} />

        {step === 1 && (
          <CustomerInfoStep
            customer={customer}
            onCustomerChange={handleCustomerChange}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <ProductSelectionStep
            onNext={(selected) => {
              setProducts(selected);
              setStep(3);
            }}
            onPrev={() => setStep(1)}
            selectedProducts={products}
          />
        )}

        {step === 3 && (
          <ShippingAddressStep
            address={address}
            onChange={setAddress}
            onNext={() => setStep(4)}
            onPrev={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <ShippingMethodStep
            value={shippingMethod}
            onChange={setShippingMethod}
            onNext={() => setStep(5)}
            onPrev={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <OrderSummaryStep
            customer={customer}
            products={products}
            address={address}
            shipping={{ method: shippingMethod, fee: 30000 }}
            onPrev={() => setStep(4)}
            onCreate={() => alert('Tạo đơn hàng thành công!')}
            provinces={provinces}
            districts={districts}
            wards={wards}
          />
        )}
      </div>
    </div>
  );
};

export default OrderCreate;