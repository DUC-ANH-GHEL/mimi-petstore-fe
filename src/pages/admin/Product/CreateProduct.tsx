import React, { useEffect, useState } from "react";
import ProductForm from "../../../components/products/ProductForm";
import { ProductFormData } from "../../../types/product";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/Toast";

const CreateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isUpdate = Boolean(id);

  const handleSuccess = () => {
    showToast(isUpdate ? 'Cập nhật sản phẩm thành công!' : 'Tạo sản phẩm thành công!', 'success');
    navigate('/admin/products');
  };

  const handleCancel = () => {
    showToast('Đã huỷ thao tác.', 'info');
    navigate('/admin/products');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{isUpdate ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}</h1>
        <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} id={id ? parseInt(id?.toString()) : 0} />
      </div>
    </div>
  );
};

export default CreateProduct;