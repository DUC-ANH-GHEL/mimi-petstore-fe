import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductGallery from "../../../components/products/Detail/ProductGallery";
import { ProductFormData } from "../../../types/product";
import { getProductById } from "../../../services/productService";
import { BadgeCheck, Tag, DollarSign, Layers, ArrowLeft, Edit, Info, Ruler, Weight, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const [product, setProduct] = useState<ProductFormData>();
    const {id} = useParams();
    const navigate = useNavigate();

    const goToUpdate = () => {
        navigate(`/admin/product/update/${id}`)
    }

    const goBack = () => {
        navigate('/admin/products');
    }

    useEffect(() => {
        const fetchMethods = async() => {
            try {
                const response = await getProductById(id);
                setProduct(response)
            } catch (error) {
                console.log("Lỗi lấy sản phẩm", error)
            }
        }

        fetchMethods()

    }, [id])
    
    return (
        <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6 flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                    <Layers size={24} className="text-rose-700 dark:text-rose-200" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{product?.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">SKU: {product?.sku}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${product?.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                            <BadgeCheck size={14} className={product?.is_active ? 'text-green-600 dark:text-green-300' : 'text-gray-400'} />
                            {product?.is_active ? 'Đang bán' : 'Ẩn'}
                        </span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                        <ProductGallery
                            productId={id ? parseInt(id) : null}
                            product={product}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                                    <DollarSign size={20} className="text-rose-700 dark:text-rose-200" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Giá bán</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{product?.price?.toLocaleString()} đ</div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                                    <Tag size={20} className="text-rose-700 dark:text-rose-200" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Affiliate</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{product?.affiliate} %</div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center gap-3 sm:col-span-2">
                                <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                                    <Layers size={20} className="text-rose-700 dark:text-rose-200" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Danh mục</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{product?.category_id}</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                            <div className="flex items-start gap-2 text-gray-700 dark:text-gray-200">
                                <Info size={18} className="text-rose-600 dark:text-rose-300 mt-0.5" />
                                <div>
                                    <div className="text-sm font-semibold">Mô tả</div>
                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{product?.description}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Ruler size={20} className="text-rose-600 dark:text-rose-300" /> Thông số kỹ thuật
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                        <Weight size={18} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">Cân nặng</span>
                        <span className="ml-auto font-semibold text-gray-900 dark:text-gray-100">{product?.weight} g</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                        <Maximize2 size={18} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">Chiều cao</span>
                        <span className="ml-auto font-semibold text-gray-900 dark:text-gray-100">{product?.height} cm</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                        <Maximize2 size={18} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">Chiều rộng</span>
                        <span className="ml-auto font-semibold text-gray-900 dark:text-gray-100">{product?.width} cm</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                        <Maximize2 size={18} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">Chiều dài</span>
                        <span className="ml-auto font-semibold text-gray-900 dark:text-gray-100">{product?.length} cm</span>
                    </div>
                </div>
            </motion.div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={goBack} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <ArrowLeft size={18} /> Trở lại
                </button>
                <button onClick={goToUpdate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 font-semibold text-white shadow-sm transition-colors">
                    <Edit size={18} /> Cập nhật
                </button>
            </div>
        </div>
    );
};
export default ProductDetail;