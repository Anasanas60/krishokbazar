import { Link } from "react-router-dom";
import { placeholder, CURATED_IMAGES } from "../assets";


const ProductCard = ({ product }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  const chooseImage = () => {
    if (product?.images && product.images.length > 0) {
      const first = product.images[0];
      if (first) return first;
    }

    const catName = product?.category?.name || "General";
    return CURATED_IMAGES[catName] || placeholder;
  };

  const id = product?.id || product?._id;

  return (
    <Link
      to={`/products/${id}`}
      className="m3-card block overflow-hidden focus:outline-none"
      aria-label={`View ${product?.name || 'product'} details`}
      role="article"
      tabIndex={0}
    >
      <div className="relative h-48 bg-gray-50">
        <img
          src={chooseImage()}
          alt={product?.name || 'Product image'}
          onError={handleImageError}
          className="w-full h-48 object-cover"
        />
        {product?.isOrganic && (
          <span className="absolute top-3 right-3 m3-pill text-xs">Organic</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{product?.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{product?.category?.name || 'General'}</p>

        <div className="flex items-center justify-between">
          <span className="text-green-700 font-bold">₨{((product?.price ?? 0)).toFixed(2)}{product?.unit ? ` / ${product.unit}` : ''}</span>
          <span className="text-sm text-green-700 font-medium">Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
