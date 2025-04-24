import React from "react";

const ProductHeader = () => {

    return (
        <div className="flex justify-between item-start">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Chi tiết sản phẩm Ty thủy lực </h1>
                <p className="text-sm text-slate-500">Mã SKU: XL-350</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded h-fit">
                Đang bán
            </span>
        </div>
    )
};

export default ProductHeader;