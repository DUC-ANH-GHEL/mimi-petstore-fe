import React from "react";

const ProductSpec = () => {
    return (
        <div className="py-2 px-2 bg-white">
            <label className="font-bold">Thông số kỹ thuật</label>
            <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-md">
                <thead>
                <tr>
                    <td className="border text-slate-600">Thông số</td>
                    <td className="border text-slate-600">Giá trị</td>
                </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                    <tr>
                        <td className="border font-md">Cân nặng</td>
                        <td className="border">4000g</td>
                    </tr>
                    <tr>
                        <td className="border font-md">Chiều cao</td>
                        <td className="border">10cm</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ProductSpec;