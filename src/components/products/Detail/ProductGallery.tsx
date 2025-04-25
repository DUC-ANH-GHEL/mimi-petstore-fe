import React, {useState} from "react";

const images = [
    {type: 'video', src: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1745419699/products/v5goc0uieudrsevhtyhs.jpg' },
    {type: 'image', src: 'https://res.cloudinary.com/diwxfpt92/image/upload/v1745419699/products/v5goc0uieudrsevhtyhs.jpg'}
]

const ProductGallery = () => {
    const [active, setActive] = useState(images[0]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4">
            {/* <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <img src="https://res.cloudinary.com/diwxfpt92/image/upload/v1745419699/products/v5goc0uieudrsevhtyhs.jpg" className="rounded shadow w-full object-cover"/>
                <img src="https://res.cloudinary.com/diwxfpt92/image/upload/v1745419699/products/v5goc0uieudrsevhtyhs.jpg" className="rounded shadow w-full object-cover"/>
            </div> */}
            <div className="w-full max-w-sm mx-auto">
                {/* ảnh chính */}
                <div className="relative aspect-square overflow-hidden mb-4 rounded-mb border">
                    <img src={active.src} alt="preview" className="w-full h-full object-container" />
                    {active.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    )}
                </div>
                {/* thumbnail */}
                <div className="flex gap-2">
                    {images.map((item, i) => (
                        <div>
                            <img src={item.src} alt="thumbnal" />
                        </div>
                    ))}
                </div>
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