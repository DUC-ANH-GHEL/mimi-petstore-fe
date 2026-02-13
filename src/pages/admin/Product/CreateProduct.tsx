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
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{isUpdate ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}</h1>
        <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} id={id ? parseInt(id?.toString()) : 0} />
    </div>
  );
};

export default CreateProduct;