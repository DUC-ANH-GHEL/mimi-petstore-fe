import React from "react";
import ProductForm from "../../components/products/ProductForm";

const CreateProduct = () => {
  const handleSuccess = () => {
    // Có thể điều hướng hoặc hiện toast thành công
    alert("Sản phẩm đã được tạo thành công!");
  };

  const handleCancel = () => {
    // Có thể điều hướng ngược lại danh sách sản phẩm
    alert("Đã huỷ tạo sản phẩm.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tạo sản phẩm mới</h1>
        <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default CreateProduct;