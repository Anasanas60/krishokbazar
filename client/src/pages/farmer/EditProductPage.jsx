"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  updateProduct,
  resetProductSuccess,
} from "../../redux/slices/productSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";

const EditProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, success } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    unit: "lb",
    quantityAvailable: "",
    images: [],
    isOrganic: false,
    harvestDate: "",
    availableUntil: "",
    isActive: true,
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProductDetails(id));
    dispatch(getCategories());
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
  category: product.category?.id || "",
        price: product.price || "",
        unit: product.unit || "lb",
        quantityAvailable: product.quantityAvailable || "",
        images: product.images || [],
        isOrganic: product.isOrganic || false,
        harvestDate: product.harvestDate
          ? new Date(product.harvestDate).toISOString().split("T")[0]
          : "",
        availableUntil: product.availableUntil
          ? new Date(product.availableUntil).toISOString().split("T")[0]
          : "",
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
      setImagePreviewUrls(product.images || []);
    }
  }, [product]);

  useEffect(() => {
    if (success) {
      dispatch(resetProductSuccess());
      navigate("/farmer/products");
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviewUrls = files.map((file) => URL.createObjectURL(file));

    // store previews for UI and keep new files in _imageFiles with preview mapping
    setImagePreviewUrls((prev) => [...prev, ...newImagePreviewUrls]);
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImagePreviewUrls],
      _imageFiles: [...(prev._imageFiles || []), ...files.map((f, i) => ({ preview: newImagePreviewUrls[i], file: f }))],
    }));
  };

  const removeImage = (index) => {
    const newImagePreviewUrls = [...imagePreviewUrls];
    const newImages = [...(formData.images || [])];
    const removedPreview = newImagePreviewUrls.splice(index, 1)[0];
    // remove the image entry (could be existing URL or preview)
    const removedImage = newImages.splice(index, 1)[0];

    // remove any matching _imageFiles entry that used this preview
    const newImageFiles = (formData._imageFiles || []).filter(
      (f) => f.preview !== removedPreview
    );

    setImagePreviewUrls(newImagePreviewUrls);
    setFormData({
      ...formData,
      images: newImages,
      _imageFiles: newImageFiles,
    });

    // If removedImage is an existing persisted URL, call backend to remove it
    if (removedImage && typeof removedImage === 'string' && removedImage.startsWith('http')) {
      (async () => {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          };
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}/images`, { data: { imageUrl: removedImage }, ...config });
        } catch (err) {
          console.error('Failed to delete persisted image', err);
        }
      })();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.quantityAvailable || formData.quantityAvailable < 0)
      newErrors.quantityAvailable = "Valid quantity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const uploadAndUpdate = async () => {
        try {
          const imageFiles = formData._imageFiles || [];
          // If there are new files to upload, upload them first
          if (imageFiles.length > 0) {
            const uploadForm = new FormData();
            imageFiles.forEach((f) => uploadForm.append("images", f.file));

            const config = {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token ? `Bearer ${token}` : undefined,
              },
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/uploads/product`, uploadForm, config);
            if (res.data && res.data.data && res.data.data.urls) {
              // replace preview URLs in formData.images with returned uploaded URLs
              const uploadedUrls = res.data.data.urls;
              const previews = imageFiles.map((f) => f.preview);
              const updatedImages = (formData.images || []).map((img) => {
                const idx = previews.indexOf(img);
                if (idx !== -1) return uploadedUrls[idx];
                return img;
              });
              formData.images = updatedImages;
            }
          }

          const payload = { ...formData };
          delete payload._imageFiles;
          dispatch(updateProduct({ id, productData: payload }));
        } catch (error) {
          console.error("Image upload failed", error);
        }
      };

      uploadAndUpdate();
    }
  };

  if (loading || categoriesLoading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">Product not found</span>
        </div>
        <Link
          to="/farmer/products"
          className="mt-4 inline-block text-green-500 hover:text-green-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/farmer/products"
        className="flex items-center text-green-500 hover:text-green-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Products
      </Link>

      <div className="glass p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Input id="name" name="name" label="Product Name*" value={formData.name} onChange={handleChange} className={errors.name ? 'border-red-500' : ''} />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
            </div>

            <div>
              <Input id="category" name="category" label="Category*" as="select" value={formData.category} onChange={handleChange} options={[{value:'',label:'Select a category'}, ...categories.map(c=>({value:c.id,label:c.name}))]} className={errors.category ? 'border-red-500' : ''} />
              {errors.category && (<p className="text-red-500 text-xs mt-1">{errors.category}</p>)}
            </div>
          </div>

            <div className="mb-6">
              <Input id="description" name="description" label="Description*" as="textarea" rows={4} value={formData.description} onChange={handleChange} placeholder="Describe your product..." className={errors.description ? 'border-red-500' : ''} />
              {errors.description && (<p className="text-red-500 text-xs mt-1">{errors.description}</p>)}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₨</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`form-input pl-7 ${
                    errors.price ? "border-red-500" : ""
                  }`}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit*
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`form-input ${errors.unit ? "border-red-500" : ""}`}
                required
              >
                <option value="lb">Pound (lb)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="oz">Ounce (oz)</option>
                <option value="g">Gram (g)</option>
                <option value="each">Each</option>
                <option value="bunch">Bunch</option>
                <option value="dozen">Dozen</option>
                <option value="pint">Pint</option>
                <option value="quart">Quart</option>
                <option value="gallon">Gallon</option>
              </select>
              {errors.unit && (
                <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="quantityAvailable"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity Available*
              </label>
              <input
                type="number"
                id="quantityAvailable"
                name="quantityAvailable"
                value={formData.quantityAvailable}
                onChange={handleChange}
                className={`form-input ${
                  errors.quantityAvailable ? "border-red-500" : ""
                }`}
                min="0"
                required
              />
              {errors.quantityAvailable && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.quantityAvailable}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label
                htmlFor="harvestDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Harvest Date
              </label>
              <input
                type="date"
                id="harvestDate"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="availableUntil"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available Until
              </label>
              <input
                type="date"
                id="availableUntil"
                name="availableUntil"
                value={formData.availableUntil}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Checkbox id="isOrganic" label="Organic" checked={formData.isOrganic} onChange={(v)=>setFormData({...formData, isOrganic: v})} />
              </div>
              <div className="flex items-center">
                <Checkbox id="isActive" label="Active" checked={formData.isActive} onChange={(v)=>setFormData({...formData, isActive: v})} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <FaUpload className="text-gray-500" />
                  <span>Upload Images</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                Upload up to 5 images
              </span>
            </div>

            {imagePreviewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button to="/farmer/products" variant="secondary" className="px-6 py-2">Cancel</Button>
            <Button type="submit" variant="primary" className="px-6 py-2" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
