import React from "react";
import { useParams } from "react-router-dom";
import ProductHeader from "../../../components/products/Detail/ProductHeader";
import ProductGallery from "../../../components/products/Detail/ProductGallery";
import ProductInfoBlock from "../../../components/products/Detail/ProductInfoBlock";
import ProductSpec from "../../../components/products/Detail/ProductSpec";

const ProductDetail = () => {
    const {id} = useParams();
    return (
        <div className="min-h-screen">
            <ProductHeader/>
            <div className="py-5">
            <ProductGallery/>
            </div>
            <ProductInfoBlock/>
            <div className="py-5">
            <ProductSpec/>
            </div>
        </div>
    );
};
export default ProductDetail;