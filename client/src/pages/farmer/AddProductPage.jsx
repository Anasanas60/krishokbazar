"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  resetProductSuccess,
} from "../../redux/slices/productSlice";
import axios from 'axios';
import { getCategories } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
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
    dispatch(getCategories());
  }, [dispatch]);



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

    // store File objects temporarily in a hidden field for upload
    setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    setFormData({
      ...formData,
      // images will contain preview URLs until uploaded; keep files separately
      images: [...formData.images, ...newImagePreviewUrls],
      _imageFiles: [...(formData._imageFiles || []), ...files],
    });
  };

  const removeImage = (index) => {
    const newImagePreviewUrls = [...imagePreviewUrls];
    const newImages = [...formData.images];

    newImagePreviewUrls.splice(index, 1);
    newImages.splice(index, 1);

    setImagePreviewUrls(newImagePreviewUrls);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
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
      // If there are new image files, upload them first
      const uploadAndCreate = async () => {
        try {
          const files = formData._imageFiles || [];
          if (files.length > 0) {
            const uploadForm = new FormData();
            files.forEach(f => uploadForm.append('images', f));

              // Use same backend env var as other slices; fall back to VITE_API_URL if present
              const BACKEND = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "";
              const authToken = token || localStorage.getItem("token") || null;
              const config = {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                },
              };

              // Ensure we don't end up with double '/api/api' if BACKEND already contains '/api'
              const normalizedBackend = BACKEND.replace(/\/$/, "");
              const uploadUrl = normalizedBackend.endsWith("/api")
                ? `${normalizedBackend}/uploads/product`
                : `${normalizedBackend}/api/uploads/product`;
              const res = await axios.post(uploadUrl, uploadForm, config);
            if (res.data && res.data.data && res.data.data.urls) {
              formData.images = res.data.data.urls;
            }
          }

          // Remove temporary _imageFiles before sending
          const payload = { ...formData };
          delete payload._imageFiles;
          dispatch(createProduct(payload));
        } catch (error) {
          console.error('Image upload failed', error);
        }
      }

      uploadAndCreate();
    }
  };

  if (loading || categoriesLoading) {
    return <Loader />;
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
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Input id="name" name="name" label="Product Name*" value={formData.name} onChange={handleChange} placeholder="Product name" className={errors.name ? 'border-red-500' : ''} />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
            </div>

            <div>
              <Input id="categoryId" name="categoryId" label="Category*" as="select" value={formData.categoryId} onChange={handleChange} options={[{value:'',label:'Select a category'}, ...(categories ? categories.map(c=>({value:c.id||c._id,label:c.name})) : [])]} className={errors.categoryId ? 'border-red-500' : ''} />
              {errors.categoryId && (<p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>)}
            </div>
          </div>

          <div className="mb-6">
            <Input id="description" name="description" label="Description*" as="textarea" rows={4} value={formData.description} onChange={handleChange} placeholder="Describe your product..." className={errors.description ? 'border-red-500' : ''} />
            {errors.description && (<p className="text-red-500 text-xs mt-1">{errors.description}</p>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0.00" className={errors.price ? 'border-red-500' : ''} />
              {errors.price && (<p className="text-red-500 text-xs mt-1">{errors.price}</p>)}
            </div>

            <div>
              <Input id="unit" name="unit" label="Unit*" as="select" value={formData.unit} onChange={handleChange} options={[{value:'lb',label:'Pound (lb)'},{value:'kg',label:'Kilogram (kg)'},{value:'oz',label:'Ounce (oz)'},{value:'g',label:'Gram (g)'},{value:'each',label:'Each'},{value:'bunch',label:'Bunch'},{value:'dozen',label:'Dozen'},{value:'pint',label:'Pint'},{value:'quart',label:'Quart'},{value:'gallon',label:'Gallon'}]} className={errors.unit ? 'border-red-500' : ''} />
              {errors.unit && (<p className="text-red-500 text-xs mt-1">{errors.unit}</p>)}
            </div>

            <div>
              <Input id="quantityAvailable" name="quantityAvailable" label="Quantity Available*" type="number" value={formData.quantityAvailable} onChange={handleChange} className={errors.quantityAvailable ? 'border-red-500' : ''} min={0} />
              {errors.quantityAvailable && (<p className="text-red-500 text-xs mt-1">{errors.quantityAvailable}</p>)}
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
                className="form-input pl-3"
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
                className="form-input pl-3"
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
            <Button type="submit" variant="primary" className="px-6 py-2" disabled={loading}>{loading ? 'Creating...' : 'Create Product'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
