"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getProducts } from "../redux/slices/productSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FaFilter, FaSearch, FaLeaf } from "react-icons/fa";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { products, loading } = useSelector((state) => state.products);
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.categories
  );

  const [filters, setFilters] = useState({
    category: "",
    search: "",
    sort: "newest",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Get categories and sync URL param
  useEffect(() => {
    dispatch(getCategories());

    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [dispatch, location.search]);

  // Debounced product fetching
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = {};

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      dispatch(getProducts(params));
    }, 1000); // delay of 1 second

    return () => clearTimeout(delayDebounce);
  }, [dispatch, filters.category, filters.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // FIXED: Safe sorting with null check
  const sortedProducts = [...(products || [])].sort((a, b) => {
    if (filters.sort === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filters.sort === "price-low") {
      return a.price - b.price;
    } else if (filters.sort === "price-high") {
      return b.price - a.price;
    }
    return 0;
  });

  if (loading || categoryLoading) {
    return <Loader />;
  }

  return (
    <div>
      <section className="section section--soft-gray">
        <div className="container mx-auto px-4">
          <h1 className="section-heading">Browse Products</h1>
          <div className="section-divider" />

          <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-grow">
            <Input id="products-search" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search products..." icon={<FaSearch className="text-gray-400" />} />
          </form>

          <div className="flex gap-4">
            <Input as="select" name="sort" value={filters.sort} onChange={handleFilterChange} className="px-4 py-2">
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </Input>

            <Button onClick={toggleFilters} variant="primary" className="flex items-center gap-2">
              <FaFilter />
              <span>Filters</span>
            </Button>
          </div>
        </div>

          {showFilters && (
            <div className="mt-4">
              <div className="panel--grouped">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Input as="select" name="category" value={filters.category} onChange={handleFilterChange}>
                      <option value="">All Categories</option>
                      {categories && categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </Input>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4">
          {sortedProducts && sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="card--elevated">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaLeaf className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;