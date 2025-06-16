import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductHeader from "../../../components/products/Detail/ProductHeader";
import ProductGallery from "../../../components/products/Detail/ProductGallery";
import ProductInfoBlock from "../../../components/products/Detail/ProductInfoBlock";
import ProductSpec from "../../../components/products/Detail/ProductSpec";
import { ProductFormData } from "../../../types/product";
import { getProductById } from "../../../services/productService";
import { BadgeCheck, Tag, DollarSign, Layers, ArrowLeft, Edit, Info, Ruler, Weight, Maximize2, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const [product, setProduct] = useState<ProductFormData>();
    const {id} = useParams();
    const navigate = useNavigate();

    const goToUpdate = () => {
        navigate(`/admin/product/update/${id}`)
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-50 py-8 px-2 md:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-8 flex items-center gap-6">
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center shadow-lg">
                        <Layers size={40} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">{product?.name}</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">SKU: {product?.sku}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow ${product?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                <BadgeCheck size={16} className={product?.is_active ? 'text-green-500' : 'text-gray-400'} />
                                {product?.is_active ? 'Đang bán' : 'Ẩn'}
                            </span>
                        </div>
                    </div>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
                        <ProductGallery
                            productId={id ? parseInt(id) : null}
                            product={product}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4 flex items-center gap-3 shadow">
                                <DollarSign size={28} className="text-orange-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Giá bán</div>
                                    <div className="text-xl font-bold text-orange-600">{product?.price?.toLocaleString()} đ</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 flex items-center gap-3 shadow">
                                <Tag size={28} className="text-blue-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Affiliate</div>
                                    <div className="text-xl font-bold text-blue-600">{product?.affiliate} %</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl p-4 flex items-center gap-3 shadow">
                                <Layers size={28} className="text-pink-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Danh mục</div>
                                    <div className="text-xl font-bold text-pink-600">{product?.category_id}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <blockquote className="border-l-4 border-blue-400 pl-4 text-gray-700 italic flex items-start gap-2">
                                <Info size={20} className="text-blue-400 mt-0.5" />
                                <span>{product?.description}</span>
                            </blockquote>
                        </div>
                    </motion.div>
                </div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-2xl shadow p-6 mb-8">
                    <div className="font-bold text-lg mb-4 flex items-center gap-2"><Ruler size={22} className="text-blue-500" /> Thông số kỹ thuật</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                            <Weight size={20} className="text-blue-400" />
                            <span className="text-gray-700">Cân nặng:</span>
                            <span className="font-bold text-blue-700">{product?.weight} g</span>
                        </div>
                        <div className="flex items-center gap-3 bg-pink-50 rounded-lg p-3">
                            <Maximize2 size={20} className="text-pink-400" />
                            <span className="text-gray-700">Chiều cao:</span>
                            <span className="font-bold text-pink-700">{product?.height} cm</span>
                        </div>
                        <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
                            <Maximize2 size={20} className="text-green-400" />
                            <span className="text-gray-700">Chiều rộng:</span>
                            <span className="font-bold text-green-700">{product?.width} cm</span>
                        </div>
                        <div className="flex items-center gap-3 bg-yellow-50 rounded-lg p-3">
                            <Maximize2 size={20} className="text-yellow-400" />
                            <span className="text-gray-700">Chiều dài:</span>
                            <span className="font-bold text-yellow-700">{product?.length} cm</span>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="flex flex-col md:flex-row justify-end gap-4 mt-8">
                    <a href="/admin/products" className="flex-1 md:flex-none py-3 px-6 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-bold text-center shadow hover:from-gray-400 hover:to-gray-500 transition flex items-center justify-center gap-2">
                        <ArrowLeft size={20} /> Trở lại
                    </a>
                    <button onClick={goToUpdate} className="flex-1 md:flex-none py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-center shadow hover:from-blue-600 hover:to-blue-800 transition flex items-center justify-center gap-2">
                        <Edit size={20} /> Cập nhật
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
export default ProductDetail;