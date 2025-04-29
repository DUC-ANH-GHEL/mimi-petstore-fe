import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductHeader from "../../../components/products/Detail/ProductHeader";
import ProductGallery from "../../../components/products/Detail/ProductGallery";
import ProductInfoBlock from "../../../components/products/Detail/ProductInfoBlock";
import ProductSpec from "../../../components/products/Detail/ProductSpec";
import { ProductFormData } from "../../../types/product";
import { getProductById } from "../../../services/productService";

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
        <div className="min-h-screen">
            <ProductHeader
            productId = {id? parseInt(id) : null}
            product={product}/>
            <div className="py-5">
            <ProductGallery
            productId={id? parseInt(id): null}
            product={product}/>
            </div>
            <ProductInfoBlock
            product={product}/>
            <div className="py-5">
            <ProductSpec
            product={product}/>
            </div>
            <div className="flex justify-end">
                <div className="rounded bg-gray-300 mr-2">
                    <a className="py-2 px-2" href="/admin/products">Trở lại</a>
                </div>
                <div className="rounded bg-blue-300">
                    <a className="py-2 px-2" onClick={goToUpdate} >Cập nhật</a>
                </div>
            </div>
        </div>
    );
};
export default ProductDetail;