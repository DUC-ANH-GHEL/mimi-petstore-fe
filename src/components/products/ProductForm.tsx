// src/components/products/ProductForm.tsx
import React from "react";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { ProductFormData, FormError } from '../../types/product';
import ImageUploader from './ImageUploader';
import SpecificationFields from './SpecificationFields';
import { createProduct, getProductById, getProductImageByProductId } from '../../services/productService';
import { useParams } from "react-router-dom";

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  id: number | null;
}


const ProductForm = ({ onSuccess, onCancel, id }: ProductFormProps) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormError>({});
  const [product, setProduct] = useState<ProductFormData>();

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
    category: '',
    labels: [],
    images: [],
    // specs: [{ key: '', value: '' }],
    specs: [],
    slug: '',
    metaTitle: '',
    metaDescription: '',
  });

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
        console.log(fullData)
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
  const handleImagesUpdate = (images: File[]) => {
    setFormData(prev => ({ ...prev, images }));
    console.log(formData)
  };

  // Định dạng giá tiền
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormError = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'Mã SKU không được để trống';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Số lượng tồn kho không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Gọi API để tạo sản phẩm
        await createProduct(formData);
        
        // Hiển thị thông báo thành công
        alert('Tạo sản phẩm thành công!');
        
        // Gọi callback onSuccess nếu được cung cấp
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        alert('Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại sau.');
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
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
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

         {/* % affiliate */}
         <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
            <p className="text-gray-500 text-sm mt-1">{(formData.affiliate)}%</p>
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
            {/* <option value="out_of_stock">Hết hàng</option> */}
          </select>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Cân nặng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            className={`w-full border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500`}
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Cân nặng (gram)"
          />
           {formData.weight > 0 && (
            <p className="text-gray-500 text-sm mt-1">{(formData.weight)} g</p>
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
            <p className="text-gray-500 text-sm mt-1">{(formData.length)} cm</p>
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
            <p className="text-gray-500 text-sm mt-1">{(formData.width)} cm</p>
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
            <p className="text-gray-500 text-sm mt-1">{(formData.height)} cm</p>
          )}
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>
        
      </div>

      {/* Tồn kho và Danh mục - flex trên desktop */}
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
            name="category"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">-- Chọn danh mục --</option>
            <option value="1">Ty xy lanh</option>
            <option value="2">Van thủy lực</option>
            <option value="3">Tràng gạt</option>
          </select>
        </div>
      </div>

      {/* Nhãn */}
      {/* <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn</label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="label-new"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              checked={formData.labels.includes('new')}
              onChange={() => handleCheckboxChange('new')}
            />
            <label htmlFor="label-new" className="ml-2 text-sm text-gray-700">
              Sản phẩm mới
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="label-promotion"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              checked={formData.labels.includes('promotion')}
              onChange={() => handleCheckboxChange('promotion')}
            />
            <label htmlFor="label-promotion" className="ml-2 text-sm text-gray-700">
              Khuyến mãi
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="label-bestseller"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              checked={formData.labels.includes('bestseller')}
              onChange={() => handleCheckboxChange('bestseller')}
            />
            <label htmlFor="label-bestseller" className="ml-2 text-sm text-gray-700">
              Bán chạy
            </label>
          </div>
        </div>
      </div> */}

      {/* Upload ảnh sản phẩm */}
      <ImageUploader onImagesUpdate={handleImagesUpdate} />

      {/* Thông số kỹ thuật */}
      {/* <SpecificationFields 
        specs={formData.specs} 
        onSpecsUpdate={handleSpecsUpdate} 
      /> */}

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

        {/* Meta Title & Description - flex trên desktop */}
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
        <button
          type="button"
          className="border px-5 py-2 rounded text-gray-600 hover:bg-gray-100"
          onClick={handleCancel}
        >
          Huỷ
        </button>
        <button
          type="submit"
          className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 transition"
        >
          Tạo sản phẩm
        </button>
      </div>
    </form>
  );
};

export default ProductForm;