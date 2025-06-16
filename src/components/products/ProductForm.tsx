// src/components/products/ProductForm.tsx
import * as React from "react";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { ProductFormData, FormError, ProductFormDataUpdate } from '../../types/product';
import ImageUploader from './ImageUploader';
import SpecificationFields from './SpecificationFields';
import { createProduct, getProductById, getProductImageByProductId, updateProduct } from '../../services/productService';
import { useParams } from "react-router-dom";
import { useToast } from '../Toast';
import { validateForm, ValidationRules, commonRules } from '../../utils/validation';
import LoadingButton from '../common/LoadingButton';
import LoadingOverlay from '../common/LoadingOverlay';
import { Layers, BadgeCheck, Tag, DollarSign, Info, Ruler, Weight, Maximize2, Percent, ArrowLeft, Save, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  id: number | null;
}

const productValidationRules: ValidationRules = {
  name: {
    ...commonRules.name,
    message: 'Tên sản phẩm phải từ 2-100 ký tự'
  },
  sku: {
    ...commonRules.sku,
    message: 'Mã SKU không được để trống và chỉ được chứa chữ hoa, số và dấu gạch ngang'
  },
  price: {
    ...commonRules.price,
    message: 'Giá sản phẩm phải lớn hơn 0'
  },
  stock: {
    ...commonRules.quantity,
    message: 'Số lượng tồn kho không được âm'
  },
  weight: {
    required: true,
    min: 0,
    message: 'Cân nặng phải lớn hơn hoặc bằng 0'
  },
  length: {
    required: true,
    min: 0,
    message: 'Chiều dài phải lớn hơn hoặc bằng 0'
  },
  width: {
    required: true,
    min: 0,
    message: 'Chiều rộng phải lớn hơn hoặc bằng 0'
  },
  height: {
    required: true,
    min: 0,
    message: 'Chiều cao phải lớn hơn hoặc bằng 0'
  },
  affiliate: {
    required: true,
    min: 0,
    max: 100,
    message: 'Phần trăm affiliate phải từ 0-100'
  },
  category_id: {
    required: true,
    min: 1,
    message: 'Vui lòng chọn danh mục sản phẩm'
  }
};

const ProductForm = ({ onSuccess, onCancel, id }: ProductFormProps) => {
  const { showToast } = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormError>({});
  const [product, setProduct] = useState<ProductFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Khởi tạo giá trị form
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    sku: '',
    price: 0,
    affiliate: 0,
    weight:0,
    length: 0,
    width: 0,
    height:0,
    stock: 0,
    status: 'active',
    is_active: true,
    category_id: 0,
    labels: [],
    images: [],
    // specs: [{ key: '', value: '' }],
    specs: [],
    slug: '',
    metaTitle: '',
    metaDescription: '',
  });

  const [formDataUpdate, setFormDataUpdate] = useState<ProductFormDataUpdate>(
    {
      id: 0,
      name: '',
      description: '',
      sku: '',
      price: 0,
      affiliate: 0,
      weight:0,
      length: 0,
      width: 0,
      height:0,
      stock: 0,
      status: 'active',
      is_active: true,
      category_id: 0,
      labels: [],
      images: [],
      // specs: [{ key: '', value: '' }],
      specs: [],
      slug: '',
      metaTitle: '',
      metaDescription: '',
      listImageCurrent: [],
    }
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(id);
        const imageList = await getProductImageByProductId(id);
        const listImage = imageList.map(element => element.image_url);
        const fullData = { ...response, images: listImage };
        setProduct(fullData);
        setFormData(fullData);
        setFormDataUpdate({ ...fullData, id: id, listImageCurrent: listImage });
      } catch (error) {
        console.log('Lỗi lấy sản phẩm hoặc ảnh: ', error);
      } finally {
        setLoading(false);
      }
    };
    if (id !== null) {
      fetchProduct();
    }
  }, [id]);
  
  // Focus vào ô tên sản phẩm khi component được mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Hàm loại bỏ dấu tiếng Việt
  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")                     // Tách các ký tự dấu ra khỏi chữ cái gốc
      .replace(/[\u0300-\u036f]/g, '')      // Xóa các dấu (accents)
      .replace(/đ/g, 'd')                   // Chuyển đ -> d
      .replace(/Đ/g, 'D');                  // Chuyển Đ -> D
  }

  // Xử lý thay đổi input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormDataUpdate(prev => ({ ...prev, [name]: value }));
    const listImage = formDataUpdate.listImageCurrent;
    // setFormDataUpdate({ ... formData, id: id, listImageCurrent: listImage})
    // console.log("formupdate2", formDataUpdate)
    // Tự động tạo slug từ tên sản phẩm
    if (name === 'name') {
      const slug = removeVietnameseTones(value)
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }

    // Xóa lỗi khi người dùng đã sửa
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Xử lý thay đổi checkbox
  const handleCheckboxChange = (value: string) => {
    setFormData(prev => {
      if (prev.labels.includes(value)) {
        return { ...prev, labels: prev.labels.filter(label => label !== value) };
      } else {
        return { ...prev, labels: [...prev.labels, value] };
      }
    });
  };

  // Xử lý cập nhật thông số kỹ thuật
  const handleSpecsUpdate = (specs: { key: string; value: string }[]) => {
    setFormData(prev => ({ ...prev, specs }));
  };

  // Xử lý cập nhật hình ảnh
  const handleImagesUpdate = (files: File[], images: string[]) => {
    setFormData(prev => {
      const prevFile = (prev.images ?? []).filter(img => typeof img === 'string') as string[];
      const same = prevFile.length === images.length && prevFile.every((f, i) => f === images[i]);
      if (same) return prev;
      return { ...prev, images: images };
    });
    setFormDataUpdate(prev => ({ ...prev, images: images }));
  };

  // Định dạng giá tiền
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, productValidationRules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Vui lòng kiểm tra lại thông tin sản phẩm', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if(id != 0){
        await updateProduct(formDataUpdate);
        showToast('Cập nhật sản phẩm thành công!', 'success');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        await createProduct(formData);
        showToast('Tạo sản phẩm thành công!', 'success');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Lỗi khi xử lý sản phẩm:', error);
      showToast('Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    showToast('Đã huỷ thao tác.', 'info');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} text="Đang tải dữ liệu sản phẩm..." />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-50 py-8 px-2 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-8 flex items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center shadow-lg">
              <Layers size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">{id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h1>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">SKU: {formData.sku}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow ${formData.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  <BadgeCheck size={16} className={formData.is_active ? 'text-green-500' : 'text-gray-400'} />
                  {formData.is_active ? 'Đang bán' : 'Ẩn'}
                </span>
              </div>
            </div>
          </motion.div>
          {/* Form */}
          <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-8">
            {/* Upload ảnh */}
            <div>
              <label className="block font-bold mb-2 flex items-center gap-2"><Layers size={20} className="text-blue-500" /> Ảnh sản phẩm</label>
              <ImageUploader initialImages={formData.images} onImagesUpdate={handleImagesUpdate} />
            </div>
            {/* Thông tin chính */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><Info size={18} className="text-blue-400" /> Tên sản phẩm</label>
                <input ref={nameInputRef} name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 shadow-sm" placeholder="Nhập tên sản phẩm" />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><Tag size={18} className="text-blue-400" /> Mã SKU</label>
                <input name="sku" value={formData.sku} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 shadow-sm" placeholder="SKU" />
                {errors.sku && <div className="text-red-500 text-xs mt-1">{errors.sku}</div>}
              </div>
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><DollarSign size={18} className="text-orange-400" /> Giá bán</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-400 shadow-sm" placeholder="Giá bán" />
                {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
              </div>
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><Percent size={18} className="text-green-400" /> Affiliate (%)</label>
                <input type="number" name="affiliate" value={formData.affiliate} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 shadow-sm" placeholder="Affiliate" />
                {errors.affiliate && <div className="text-red-500 text-xs mt-1">{errors.affiliate}</div>}
              </div>
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><Layers size={18} className="text-pink-400" /> Danh mục</label>
                <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-400 shadow-sm">
                  <option value={0}>Chọn danh mục</option>
                  <option value={1}>Ty xy lanh</option>
                  <option value={2}>Van thủy lực</option>
                  <option value={3}>Trang gạt</option>
                </select>
                {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
              </div>
            </div>
            {/* Mô tả */}
            <div>
              <label className="block font-bold mb-1 flex items-center gap-2"><Info size={18} className="text-blue-400" /> Mô tả</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 shadow-sm" placeholder="Mô tả sản phẩm" rows={3} />
              {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
            </div>
            {/* Thông số kỹ thuật */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><Weight size={18} className="text-blue-400" /> Cân nặng (g)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 shadow-sm" placeholder="Cân nặng" />
                {errors.weight && <div className="text-red-500 text-xs mt-1">{errors.weight}</div>}
              </div>
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><Maximize2 size={18} className="text-pink-400" /> Chiều dài (cm)</label>
                <input type="number" name="length" value={formData.length} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-400 shadow-sm" placeholder="Chiều dài" />
                {errors.length && <div className="text-red-500 text-xs mt-1">{errors.length}</div>}
              </div>
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><Maximize2 size={18} className="text-green-400" /> Chiều rộng (cm)</label>
                <input type="number" name="width" value={formData.width} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 shadow-sm" placeholder="Chiều rộng" />
                {errors.width && <div className="text-red-500 text-xs mt-1">{errors.width}</div>}
              </div>
              <div>
                <label className="block font-bold mb-1 flex items-center gap-2"><Maximize2 size={18} className="text-yellow-400" /> Chiều cao (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 shadow-sm" placeholder="Chiều cao" />
                {errors.height && <div className="text-red-500 text-xs mt-1">{errors.height}</div>}
              </div>
            </div>
            {/* Nút thao tác */}
            <div className="flex flex-col md:flex-row justify-end gap-4 mt-8">
              <button type="button" onClick={handleCancel} className="flex-1 md:flex-none py-3 px-6 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-bold text-center shadow hover:from-gray-400 hover:to-gray-500 transition flex items-center justify-center gap-2">
                <XCircle size={20} /> Hủy
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 md:flex-none py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-center shadow hover:from-blue-600 hover:to-blue-800 transition flex items-center justify-center gap-2">
                <Save size={20} /> {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </>
  );
};

export default ProductForm;