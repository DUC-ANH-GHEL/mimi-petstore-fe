import React from "react";

const ProductGallery = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <img src="https://res.cloudinary.com/diwxfpt92/image/upload/v1745419699/products/v5goc0uieudrsevhtyhs.jpg" className="rounded shadow w-full object-cover"/>
                <img src="https://res.cloudinary.com/diwxfpt92/image/upload/v1745419699/products/v5goc0uieudrsevhtyhs.jpg" className="rounded shadow w-full object-cover"/>
            </div>
            <div className="space-y-4">
                <div className="bg-white rounded py-2 px-2">
                    <label className="text-sm font-medium text-slate-600">Giá bán</label>
                    <p className="font-bold text-lg">1.600.000 đ</p>
                </div>
                <div className="bg-white rouned object-cover py-2 px-2">
                    <label className="text-sm font-medium text-slate-600">Danh mục</label>
                    <p className="font-bold text-lg">Ty xy lanh</p>
                </div>
            </div>
        </div>
    )
}

export default ProductGallery;