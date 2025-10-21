"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../redux/slices/orderSlice";
import OrderItem from "../../components/OrderItem";
import Loader from "../../components/Loader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { FaSearch, FaFilter, FaShoppingBasket } from "react-icons/fa";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders, loading } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (adminOrders) {
      let filtered = [...adminOrders];

      if (filter !== "all") {
        filtered = filtered.filter((order) => order.status === filter);
      }

        if (searchTerm) {
        filtered = filtered.filter(
          (order) =>
            (order.id || order._id).toString().includes(searchTerm) ||
            order.consumer.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredOrders(filtered);
    }
  }, [adminOrders, filter, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      dispatch(updateOrderStatus({ id: selectedOrder.id || selectedOrder._id, status: newStatus }));
      setShowStatusModal(false);
    }
  };

  if (loading && adminOrders.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Orders</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="md:w-1/2">
          <Input id="orders-search" value={searchTerm} onChange={handleSearchChange} placeholder="Search by order ID, customer, or farmer..." icon={<FaSearch className="text-gray-400" />} />
        </div>

        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>All</Button>
            <Button size="sm" variant={filter === 'pending' ? 'primary' : 'secondary'} onClick={() => setFilter('pending')}>Pending</Button>
            <Button size="sm" variant={filter === 'accepted' ? 'primary' : 'secondary'} onClick={() => setFilter('accepted')}>Accepted</Button>
            <Button size="sm" variant={filter === 'completed' ? 'primary' : 'secondary'} onClick={() => setFilter('completed')}>Completed</Button>
            <Button size="sm" variant={filter === 'rejected' ? 'danger' : 'secondary'} onClick={() => setFilter('rejected')}>Rejected</Button>
            <Button size="sm" variant={filter === 'cancelled' ? 'danger' : 'secondary'} onClick={() => setFilter('cancelled')}>Cancelled</Button>
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id || order._id} className="glass p-4 rounded-xl">
                  <OrderItem order={order} />
                    <div className="mt-4 border-t border-gray-200 pt-4 flex justify-end">
                      <Button variant="outline" onClick={() => handleUpdateStatus(order)} disabled={order.status === 'completed' || order.status === 'cancelled'}>Update Status</Button>
                    </div>
                </div>
              ))}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaShoppingBasket className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {filter === "all" && !searchTerm
              ? "There are no orders in the system yet."
              : "No orders match your search criteria."}
          </p>
        </div>
      )}

      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Order Status</h3>
            <p className="mb-4">
              Order #{(selectedOrder?.id || selectedOrder?._id || '').toString().substring(0, 8)} for {selectedOrder?.consumer?.name}
            </p>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-input"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
