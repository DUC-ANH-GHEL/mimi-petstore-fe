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
      try {
        const response = await getProductById(id);
        const imageList = await getProductImageByProductId(id);
        const listImage: string[] = []
        imageList.forEach(element => {
          listImage.push(element.image_url)
        });
        // Gộp luôn dữ liệu response + imageList 1 lần duy nhất
        const fullData = { ...response, images: listImage };
        setProduct(fullData);
        setFormData(fullData);
        setFormDataUpdate({ ... fullData, id: id, listImageCurrent: listImage})
        console.log("formupdate", formDataUpdate)
      } catch (error) {
        console.log("Lỗi lấy sản phẩm: ", error);
      }
    };
  
    if (id !== null) { // chỉ fetch khi id có giá trị
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
      <LoadingOverlay 
        isLoading={isSubmitting} 
        text={id ? "Đang cập nhật sản phẩm..." : "Đang tạo sản phẩm..."} 
      />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto">
        {/* Tên sản phẩm */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            ref={nameInputRef}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên sản phẩm"
            maxLength={100}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Mô tả sản phẩm */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả sản phẩm
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500 resize-none h-32"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả chi tiết về sản phẩm"
          />
        </div>

        {/* SKU, Giá, Trạng thái - flex trên desktop */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Mã SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
              Mã SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              className={`w-full border ${errors.sku ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="PROD-XXX"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          {/* Giá bán */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Giá bán <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.price}
              onChange={handleInputChange}
              min="0"
            />
            {formData.price > 0 && (
              <p className="text-gray-500 text-sm mt-1">{formatPrice(formData.price)}</p>
            )}
          </div>

          {/* % affiliate */}
          <div>
            <label htmlFor="affiliate" className="block text-sm font-medium text-gray-700 mb-1">
              % Affiliate <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="affiliate"
              name="affiliate"
              className={`w-full border ${errors.affiliate ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.affiliate}
              onChange={handleInputChange}
              min="0"
              max="100"
            />
            {formData.affiliate > 0 && (
              <p className="text-gray-500 text-sm mt-1">{formData.affiliate}%</p>
            )}
            {errors.affiliate && <p className="text-red-500 text-sm mt-1">{errors.affiliate}</p>}
          </div>

          {/* Trạng thái hiển thị */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái hiển thị
            </label>
            <select
              id="status"
              name="status"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="true">Đang bán</option>
              <option value="false">Ẩn</option>
            </select>
          </div>
        </div>

        {/* Kích thước và cân nặng */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Cân nặng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              className={`w-full border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.weight}
              onChange={handleInputChange}
              min="0"
              placeholder="Cân nặng (gram)"
            />
            {formData.weight > 0 && (
              <p className="text-gray-500 text-sm mt-1">{formData.weight} g</p>
            )}
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>

          {/* Chiều dài */}
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
              Chiều dài <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="length"
              name="length"
              className={`w-full border ${errors.length ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.length}
              onChange={handleInputChange}
              min="0"
              placeholder="Chiều dài (cm)"
            />
            {formData.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">{formData.length} cm</p>
            )}
            {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
          </div>

          {/* Chiều rộng */}
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
              Chiều rộng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="width"
              name="width"
              className={`w-full border ${errors.width ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.width}
              onChange={handleInputChange}
              min="0"
              placeholder="Chiều rộng (cm)"
            />
            {formData.width > 0 && (
              <p className="text-gray-500 text-sm mt-1">{formData.width} cm</p>
            )}
            {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
          </div>

          {/* Chiều cao */}
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Chiều cao <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="height"
              name="height"
              className={`w-full border ${errors.height ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.height}
              onChange={handleInputChange}
              min="0"
              placeholder="Chiều cao (cm)"
            />
            {formData.height > 0 && (
              <p className="text-gray-500 text-sm mt-1">{formData.height} cm</p>
            )}
            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
          </div>
        </div>

        {/* Tồn kho và Danh mục */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tồn kho */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Tồn kho
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              className={`w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>

          {/* Danh mục sản phẩm */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục sản phẩm
            </label>
            <select
              id="category"
              name="category_id"
              className={`w-full border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
              value={formData.category_id}
              onChange={handleInputChange}
            >
              <option value="">-- Chọn danh mục --</option>
              <option value="1">Ty xy lanh</option>
              <option value="2">Van thủy lực</option>
              <option value="3">Trang gạt</option>
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
          </div>
        </div>

        {/* Upload ảnh sản phẩm */}
        <div className="mb-4">
          <ImageUploader onImagesUpdate={handleImagesUpdate} initialImages={formData.images} />
        </div>

        {/* Thông số kỹ thuật */}
        <div className="mb-4">
          <SpecificationFields specs={formData.specs} onSpecsUpdate={handleSpecsUpdate} />
        </div>

        {/* SEO Section */}
        <div className="mb-4 border-t border-gray-200 pt-4 mt-6">
          <h3 className="font-medium text-gray-700 mb-3">Thông tin SEO</h3>

          {/* Slug */}
          <div className="mb-4">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug URL
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="ten-san-pham"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: example.com/san-pham/{formData.slug || 'ten-san-pham'}
            </p>
          </div>

          {/* Meta Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                value={formData.metaTitle}
                onChange={handleInputChange}
                placeholder="Tiêu đề trang cho SEO"
              />
            </div>
            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <input
                type="text"
                id="metaDescription"
                name="metaDescription"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
                value={formData.metaDescription}
                onChange={handleInputChange}
                placeholder="Mô tả ngắn cho kết quả tìm kiếm"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <LoadingButton
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Huỷ
          </LoadingButton>
          <LoadingButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingText={id ? "Đang cập nhật..." : "Đang tạo sản phẩm..."}
          >
            {id ? "Cập nhật" : "Tạo sản phẩm"}
          </LoadingButton>
        </div>
      </form>
    </>
  );
};

export default ProductForm;