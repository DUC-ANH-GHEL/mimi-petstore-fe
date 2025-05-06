import React, { useEffect, useState } from "react";
import ProductForm from "../../../components/products/ProductForm";
import { ProductFormData } from "../../../types/product";
import { useParams } from "react-router-dom";


const CreateProduct = () => {
  const {id} = useParams()
  const isUpdate = Boolean(id);
 

  const handleSuccess = () => {
    // Có thể điều hướng hoặc hiện toast thành công
    // alert("Sản phẩm đã được tạo thành công!");
  };

  const handleCancel = () => {
    // Có thể điều hướng ngược lại danh sách sản phẩm
    alert("Đã huỷ tạo sản phẩm.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{isUpdate? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}</h1>
        <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} id={id? parseInt(id?.toString()) : 0} />
      </div>
    </div>
  );
};

export default CreateProduct;