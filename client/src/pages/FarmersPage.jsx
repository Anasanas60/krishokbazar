import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/ui/Input";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaSearch, FaLeaf } from "react-icons/fa";

const FarmersPage = () => {
  const dispatch = useDispatch();
  const { farmers, loading } = useSelector((state) => state.farmers);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);

  useEffect(() => {
    dispatch(getAllFarmers());
  }, [dispatch]);

  useEffect(() => {
    if (farmers) {
      setFilteredFarmers(
        farmers.filter((farmer) =>
          farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [farmers, searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  if (loading) return <Loader />;

  return (
    <div>
      <section className="section section--soft-green">
        <div className="container mx-auto px-4">
          <h1 className="section-heading">Our Farmers</h1>
          <div className="section-divider" />

          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="panel--grouped">
                <label htmlFor="farmers-search" className="sr-only">Search farmers</label>
                <Input id="farmers-search" name="search" value={searchTerm} onChange={handleSearchChange} placeholder="Search farmers..." icon={<FaSearch className="text-gray-400" />} />
              </div>
            </div>
          </div>

          {filteredFarmers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFarmers.map((farmer) => (
                <div key={farmer.id} className="card--elevated">
                  <FarmerCard farmer={farmer} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaLeaf className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Farmers Found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FarmersPage;
