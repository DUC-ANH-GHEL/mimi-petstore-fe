// src/components/products/ProductForm.tsx
import * as React from "react";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { ProductFormData, FormError, ProductFormDataUpdate } from '../../types/product';
import ImageUploader from './ImageUploader';
import { createProduct, getProductById, getProductImageByProductId, updateProduct, productService, updateProductStock } from '../../services/productService';
import { useParams } from "react-router-dom";
import { useToast } from '../Toast';
import { validateForm, ValidationRules, commonRules } from '../../utils/validation';
import LoadingOverlay from '../common/LoadingOverlay';
import { BadgeCheck, Tag, DollarSign, Info, Weight, Maximize2, Percent, Save, XCircle, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { logo_url } from '../../config/api';

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  id: number | null;
}

type VariantDraft = {
  sku: string;
  size: string;
  color: string;
  material: string;
  price: string; // keep as string for input; convert on submit
  stock: string;
  is_active: boolean;
};

const productValidationRules: ValidationRules = {
  name: {
    ...commonRules.name,
    message: 'Tên sản phẩm phải từ 2-100 ký tự'
  },
  slug: {
    required: true,
    minLength: 1,
    message: 'Slug không được để trống'
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
  // affiliate is optional; we keep sending default 0 but don't show input
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
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [variants, setVariants] = useState<VariantDraft[]>([]);

  // Khởi tạo giá trị form
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    sku: '',
    price: 0,
    sale_price: null,
    currency: 'VND',
    affiliate: 0,
    weight:0,
    length: 0,
    width: 0,
    height:0,

    stock: 0,
    status: 'active',
    is_active: true,
    category_id: 0,
    brand: '',
    material: '',
    size: '',
    color: '',
    pet_type: '',
    season: '',
    labels: [],
    images: [],
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
      sale_price: null,
      currency: 'VND',
      affiliate: 0,
      weight:0,
      length: 0,
      width: 0,
      height:0,
      stock: 0,
      status: 'active',
      is_active: true,
      category_id: 0,
      brand: '',
      material: '',
      size: '',
      color: '',
      pet_type: '',
      season: '',
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
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const list = await productService.getCategories();
        const safe = Array.isArray(list) ? list : [];
        setCategories(safe.map((c: any) => ({ id: Number(c.id), name: String(c.name ?? '') })));
      } catch (e) {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(id);
        const imageList = await getProductImageByProductId(id);
        let listImage = imageList.map((element: any) => element.image_url);
        if (!listImage || listImage.length === 0) {
          listImage = [logo_url];
        }
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
    if (typeof id === 'number' && id > 0) {
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

    const numericFields = new Set([
      'price',
      // sale_price + affiliate inputs removed from UI
      'stock',
      'weight',
      'length',
      'width',
      'height',
      'category_id',
    ]);

    const nextValue: any = numericFields.has(name) ? Number(value) : value;

    setFormData(prev => ({ ...prev, [name]: nextValue }));
    setFormDataUpdate(prev => ({ ...prev, [name]: nextValue }));
    // setFormDataUpdate({ ... formData, id: id, listImageCurrent: listImage})
    // console.log("formupdate2", formDataUpdate)
    // Tự động tạo slug từ tên sản phẩm
    if (name === 'name') {
      const slug = removeVietnameseTones(value)
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
      setFormDataUpdate(prev => ({ ...prev, slug }));
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
  const handleImagesUpdate = (files: File[], existing: string[]) => {
    const nextImages: Array<string | File> = [...existing, ...files];
    setFormData(prev => ({ ...prev, images: nextImages }));

    // For update payload, keep the backend-required listImageCurrent in sync
    setFormDataUpdate(prev => ({ ...prev, listImageCurrent: existing }));
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

    // OpenAPI requires `slug` on create; ensure it is generated
    const ensuredSlug = (formData.slug ?? '').trim() || removeVietnameseTones(formData.name)
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    const dataForValidation: ProductFormData = {
      ...(ensuredSlug !== formData.slug ? { ...formData, slug: ensuredSlug } : formData),
      variants: variants.length > 0
        ? variants.map((v) => {
            const priceText = v.price.trim();
            return {
              sku: v.sku.trim(),
              size: v.size.trim() || null,
              color: v.color.trim() || null,
              material: v.material.trim() || null,
              price: priceText.length > 0 ? Number(priceText) : null,
              stock: Number(v.stock),
              is_active: v.is_active,
            };
          })
        : null,
    };

    if (ensuredSlug !== formData.slug) {
      setFormData((prev) => ({ ...prev, slug: ensuredSlug }));
      setFormDataUpdate((prev) => ({ ...prev, slug: ensuredSlug }));
    }

    const validationErrors = validateForm(dataForValidation, productValidationRules);

    // Deep variants validation (unique SKU, non-negative stock)
    const hasVariants = Array.isArray(dataForValidation.variants) && dataForValidation.variants.length > 0;
    if (hasVariants) {
      const skuSet = new Set<string>();
      for (let i = 0; i < dataForValidation.variants.length; i++) {
        const variant = dataForValidation.variants[i] as any;
        const sku = String(variant.sku ?? '').trim();
        if (!sku) {
          validationErrors.variants = `Biến thể #${i + 1}: thiếu SKU`;
          break;
        }
        if (skuSet.has(sku)) {
          validationErrors.variants = `Biến thể #${i + 1}: SKU bị trùng (${sku})`;
          break;
        }
        skuSet.add(sku);

        const stock = Number(variant.stock);
        if (!Number.isFinite(stock) || stock < 0) {
          validationErrors.variants = `Biến thể #${i + 1}: tồn kho phải >= 0`;
          break;
        }

        const vPrice = variant.price !== null && variant.price !== undefined ? Number(variant.price) : undefined;
        if (vPrice !== undefined && (!Number.isFinite(vPrice) || vPrice < 0)) {
          validationErrors.variants = `Biến thể #${i + 1}: giá không hợp lệ`;
          break;
        }
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Vui lòng kiểm tra lại thông tin sản phẩm', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if (typeof id === 'number' && id > 0) {
        await updateProduct(formDataUpdate);
        showToast('Cập nhật sản phẩm thành công!', 'success');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const created = await createProduct(dataForValidation);

        // If backend didn't set stock on create, set initial stock via PATCH (delta-based)
        // If variants are provided, backend overrides stock using variants' total.
        // Only do best-effort stock sync when creating a simple (non-variant) product.
        const hasVariantsOnCreate = Array.isArray(dataForValidation.variants) && dataForValidation.variants.length > 0;
        if (!hasVariantsOnCreate) {
          const createdId = Number(created?.id);
          const createdStock = typeof created?.stock === 'number' ? Number(created.stock) : undefined;
          const desiredStock = Number(dataForValidation.stock ?? 0);
          if (Number.isFinite(createdId) && desiredStock > 0 && createdStock !== desiredStock) {
            try {
              const delta = typeof createdStock === 'number' ? (desiredStock - createdStock) : desiredStock;
              if (delta !== 0) {
                await updateProductStock(createdId, delta);
              }
            } catch {
              // stock update is best-effort; don't fail product creation
            }
          }
        }

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
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">Sản phẩm quần áo thú cưng</div>
            <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
              {typeof id === 'number' && id > 0 ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">SKU: {formData.sku || '—'}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${formData.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                <BadgeCheck size={14} className={formData.is_active ? 'text-green-600 dark:text-green-300' : 'text-gray-400'} />
                {formData.is_active ? 'Đang bán' : 'Ẩn'}
              </span>
            </div>
          </div>

          <img src={logo_url} alt="MiMi" className="h-10 w-10 rounded-full ring-1 ring-gray-200 dark:ring-gray-800" />
        </div>

        {/* Images */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ảnh sản phẩm</div>
          {!loading && (
            <ImageUploader
              initialImages={formData.images}
              onImagesUpdate={handleImagesUpdate}
            />
          )}
        </div>

        {/* Core info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Tên sản phẩm</label>
            <input
              ref={nameInputRef}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: Áo hoodie cho chó (Streetwear)"
            />
            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Mã SKU</label>
            <input
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: MIMI-HOODIE-001"
            />
            {errors.sku && <div className="text-red-500 text-xs mt-1">{errors.sku}</div>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Giá bán (VND)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: 199000"
              min={0}
            />
            {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Danh mục</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              disabled={categoriesLoading}
            >
              <option value={0}>{categoriesLoading ? 'Đang tải danh mục...' : 'Chọn danh mục'}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Trạng thái bán</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Ẩn/hiện sản phẩm trên cửa hàng</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, is_active: !prev.is_active }));
                setFormDataUpdate((prev) => ({ ...prev, is_active: !prev.is_active }));
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.is_active ? 'bg-rose-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
              aria-label="Toggle active"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  formData.is_active ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Thương hiệu</label>
            <input
              name="brand"
              value={String(formData.brand ?? '')}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: MiMi"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Chất liệu</label>
            <input
              name="material"
              value={String(formData.material ?? '')}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: Cotton"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Loại thú cưng</label>
            <input
              name="pet_type"
              value={String(formData.pet_type ?? '')}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: Chó / Mèo"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Mùa</label>
            <input
              name="season"
              value={String(formData.season ?? '')}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: Winter / Summer"
            />
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Slug</label>
          <div className="flex items-center gap-2">
            <div className="shrink-0 text-gray-400"><Link2 size={16} /></div>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: ao-hoodie-cho-cho-streetwear"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Mô tả chất liệu, form, size, hướng dẫn giặt..."
            rows={5}
          />
        </div>

        {/* Variants (create only) */}
        {!(typeof id === 'number' && id > 0) && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Biến thể (Size / Màu / ...)</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Mỗi biến thể có SKU, giá và tồn kho riêng.</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVariants((prev) => [
                    ...prev,
                    {
                      sku: '',
                      size: '',
                      color: '',
                      material: '',
                      price: '',
                      stock: '0',
                      is_active: true,
                    },
                  ]);
                  if (errors.variants) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.variants;
                      return next;
                    });
                  }
                }}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                + Thêm biến thể
              </button>
            </div>

            {variants.length > 0 && (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 bg-gray-50 dark:bg-gray-800/40 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <div className="col-span-3">SKU *</div>
                  <div className="col-span-1">Size</div>
                  <div className="col-span-1">Màu</div>
                  <div className="col-span-2">Chất liệu</div>
                  <div className="col-span-2">Giá</div>
                  <div className="col-span-1">Kho *</div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 px-3 py-3">
                      <div className="col-span-3">
                        <input
                          value={v.sku}
                          onChange={(e) => {
                            const value = e.target.value;
                            setVariants((prev) => prev.map((row, i) => (i === idx ? { ...row, sku: value } : row)));
                            if (errors.variants) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.variants;
                                return next;
                              });
                            }
                          }}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="VD: MIMI-HOODIE-S-BLACK"
                        />
                      </div>

                      <div className="col-span-1">
                        <input
                          value={v.size}
                          onChange={(e) => {
                            const value = e.target.value;
                            setVariants((prev) => prev.map((row, i) => (i === idx ? { ...row, size: value } : row)));
                          }}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="S"
                        />
                      </div>

                      <div className="col-span-1">
                        <input
                          value={v.color}
                          onChange={(e) => {
                            const value = e.target.value;
                            setVariants((prev) => prev.map((row, i) => (i === idx ? { ...row, color: value } : row)));
                          }}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="Đen"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          value={v.material}
                          onChange={(e) => {
                            const value = e.target.value;
                            setVariants((prev) => prev.map((row, i) => (i === idx ? { ...row, material: value } : row)));
                          }}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="Cotton"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min={0}
                          value={v.price}
                          onChange={(e) => {
                            const value = e.target.value;
                            setVariants((prev) => prev.map((row, i) => (i === idx ? { ...row, price: value } : row)));
                          }}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="(để trống = dùng giá chung)"
                        />
                      </div>

                      <div className="col-span-1">
                        <input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) => {
                            const value = e.target.value;
                            setVariants((prev) => prev.map((row, i) => (i === idx ? { ...row, stock: value } : row)));
                          }}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="0"
                        />
                      </div>

                      <div className="col-span-12 flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setVariants((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                        >
                          Xoá biến thể
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setVariants((prev) => prev.map((row, i) => (i === idx ? { ...row, is_active: !row.is_active } : row)));
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            v.is_active ? 'bg-rose-600' : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                          aria-label="Toggle variant active"
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              v.is_active ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.variants && <div className="text-red-500 text-xs">{errors.variants}</div>}
            {variants.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Khi có biến thể, hệ thống sẽ tính tồn kho theo tổng tồn kho của các biến thể.
              </div>
            )}
          </div>
        )}

        {/* Shipping dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Khối lượng (g)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: 200"
              min={0}
            />
            {errors.weight && <div className="text-red-500 text-xs mt-1">{errors.weight}</div>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Dài (cm)</label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: 25"
              min={0}
            />
            {errors.length && <div className="text-red-500 text-xs mt-1">{errors.length}</div>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Rộng (cm)</label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: 20"
              min={0}
            />
            {errors.width && <div className="text-red-500 text-xs mt-1">{errors.width}</div>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Cao (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: 5"
              min={0}
            />
            {errors.height && <div className="text-red-500 text-xs mt-1">{errors.height}</div>}
          </div>
        </div>

        {/* Stock only on create */}
        {!(typeof id === 'number' && id > 0) && variants.length === 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Tồn kho ban đầu</label>
            <input
              type="number"
              name="stock"
              value={Number(formData.stock ?? 0)}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="VD: 50"
              min={0}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Nếu không có variants, tồn kho sẽ được set khi tạo sản phẩm.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <XCircle size={18} /> Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 font-semibold text-white shadow-sm disabled:opacity-60"
          >
            <Save size={18} /> {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </motion.form>
    </>
  );
};

export default ProductForm;