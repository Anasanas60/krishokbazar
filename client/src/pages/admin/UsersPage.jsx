"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers, deleteUser } from "../../redux/slices/userSlice"
import Loader from "../../components/Loader"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import { FaSearch, FaUserEdit, FaTrash, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"

const UsersPage = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((state) => state.users)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(null)

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  useEffect(() => {
    if (users) {
      let filtered = [...users]

      // Apply role filter
      if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === roleFilter)
      }

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      setFilteredUsers(filtered)
    }
  }, [users, searchTerm, roleFilter])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value)
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id || userToDelete._id))
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  const toggleUserDetails = (userId) => {
    const idVal = (userId && (userId.id || userId._id)) || userId || null;
    if (showUserDetails === idVal) {
      setShowUserDetails(null)
    } else {
      setShowUserDetails(idVal)
    }
  }

  if (loading && users.length === 0) {
    return <Loader />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="md:w-1/2">
          <Input id="users-search" value={searchTerm} onChange={handleSearchChange} placeholder="Search users by name or email..." icon={<FaSearch className="text-gray-400" />} />
        </div>

        <div className="md:w-1/4">
          <Input id="role-filter" as="select" value={roleFilter} onChange={handleRoleFilterChange}>
            <option value="all">All Roles</option>
            <option value="consumer">Consumers</option>
            <option value="farmer">Farmers</option>
            <option value="admin">Admins</option>
          </Input>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <React.Fragment key={user.id || user._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <span className="text-green-600 font-bold">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "farmer"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button onClick={() => toggleUserDetails(user.id || user._id)} variant="secondary" ariaLabel="view-details" className="text-blue-600 hover:text-blue-900">
                              <FaUserEdit />
                            </Button>
                            {user.role !== "admin" && (
                              <Button onClick={() => handleDeleteClick(user)} variant="danger" ariaLabel="delete-user">
                                <FaTrash />
                              </Button>
                            )}
                          </div>
                      </td>
                    </tr>
                    {showUserDetails === (user.id || user._id) && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Contact Information</h4>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <FaEnvelope className="text-gray-400 mr-2" />
                                  <span>{user.email}</span>
                                </div>
                                {user.phone && (
                                  <div className="flex items-center">
                                    <FaPhone className="text-gray-400 mr-2" />
                                    <span>{user.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {user.address && (
                              <div>
                                <h4 className="font-medium mb-2">Address</h4>
                                <div className="flex items-start">
                                  <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                                  <div>
                                    {user.address.street && <p>{user.address.street}</p>}
                                    {user.address.city && user.address.state && (
                                      <p>
                                        {user.address.city}, {user.address.state} {user.address.zipCode}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the user <span className="font-medium">{userToDelete?.name}</span> (
              {userToDelete?.email})? This action cannot be undone.
            </p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete}>Delete</Button>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
