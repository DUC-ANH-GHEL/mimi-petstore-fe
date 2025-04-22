import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { loginViettelPost, getShippingServices } from '../../../services/viettelpostservice';
import { Product, ShippingMethod } from '../../../types/order';

type ShippingService = {
  SERVICE_CODE: string;
  SERVICE_NAME: string;
  MONEY_TOTAL_OLD: Number;
  MONEY_TOTAL: Number;
  MONEY_TOTAL_FEE: Number;
  MONEY_FEE: Number;
  MONEY_COLLECTION_FEE: Number;
  MONEY_OTHER_FEE: Number;
  MONEY_VAS: Number;
  MONEY_VAT: Number;
  KPI_HT: Number;
  TOTAL_FEE: number;
};

type Props = {
  value: ShippingMethod;
  onChange: (value: ShippingMethod) => void;
  onNext: () => void;
  onPrev: () => void;
  address: {
    province: number;
    district: number;
  };
   products: Product[];
};

const AVAILABLE_SERVICES = [
//   { SERVICE_CODE: 'SCOD', SERVICE_NAME: 'VCN Chuyển phát nhanh' },
//   { SERVICE_CODE: 'SCOD', SERVICE_NAME: 'VTK Tiết kiệm' },
  { SERVICE_CODE: 'SCOD', SERVICE_NAME: 'SCOD Giao hàng thu tiền' }
];

const ShippingMethodStep: React.FC<Props> = ({ value, onChange, onNext, onPrev, address, products }) => {
  const [selected, setSelected] = useState<string>(value.SERVICE_CODE);
  const [methods, setMethods] = useState<ShippingService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setSelected(value.SERVICE_CODE);
  }, [value]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoading(true);
        const token = await loginViettelPost();

        const totalWeight = products.reduce((sum, p) => sum + (p.weight * p.quantity || 0), 0);
        const totalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);


        const result: ShippingService[] = [];

        for (const service of AVAILABLE_SERVICES) {
          const body = {
            PRODUCT_WEIGHT: totalWeight,
            PRODUCT_PRICE: totalPrice,
            MONEY_COLLECTION: totalPrice,
            ORDER_SERVICE_ADD: '',
            ORDER_SERVICE: service.SERVICE_CODE,
            SENDER_PROVINCE: '32',
            SENDER_DISTRICT: '357',
            RECEIVER_PROVINCE: address.province.toString(),
            RECEIVER_DISTRICT: address.district.toString(),
            PRODUCT_TYPE: 'HH',
            NATIONAL_TYPE: 1
          };

          const res = await getShippingServices(body, token);
          if (res?.data?.MONEY_TOTAL_FEE) {
            result.push({
              SERVICE_CODE: service.SERVICE_CODE,
              SERVICE_NAME: service.SERVICE_NAME,
              TOTAL_FEE: res.data.MONEY_TOTAL_FEE,
              MONEY_COLLECTION_FEE: res.data.MONEY_COLLECTION_FEE,
              MONEY_FEE: res.data.MONEY_FEE,
              KPI_HT: res.data.KPT_HT,
              MONEY_OTHER_FEE: res.data.MONEY_OTHER_FEE,
              MONEY_TOTAL: res.data.MONEY_TOTAL,
              MONEY_TOTAL_FEE: res.data.MONEY_TOTAL_FEE,
              MONEY_TOTAL_OLD: res.data.MONEY_TOTAL_OLD,
              MONEY_VAS: res.data.MONEY_VAS,
              MONEY_VAT: res.data.MONEY_VAT
            });
          }
        }

        setMethods(result);
      } catch (err) {
        console.error('Lỗi lấy phương thức giao hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [address]);

//   const handleSelect = (method: string) => {
//     setSelected(method);
//     onChange(method);
//   };

const handleSelect = (method: ShippingMethod) => {
        setSelected(method.SERVICE_CODE);
        onChange(method);
      };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold flex items-center gap-3 mb-4">
        <span className="rounded-full bg-emerald-600 text-white w-6 h-6 flex items-center justify-center text-sm">4</span>
        Phương thức giao hàng
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500 italic">Đang tải danh sách dịch vụ...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {methods.map(method => (
            <div
              key={method.SERVICE_CODE}
              onClick={() => handleSelect(method)}
              className={`border rounded p-4 cursor-pointer transition ${
                selected === method.SERVICE_CODE ? 'border-emerald-600 bg-emerald-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-emerald-700 mb-1">
                {method.SERVICE_NAME}
              </div>
              <div className="text-sm text-gray-600">
                Phí: {method.TOTAL_FEE.toLocaleString()} đ
                <br/>
                VAT: {method.MONEY_VAT.toLocaleString()} đ
                <br/>
                Tổng: {method.MONEY_TOTAL.toLocaleString()} đ
              </div>
            </div>
          ))}
        </div>
      )}

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
