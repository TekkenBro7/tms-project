import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../services/userService';
import UsersTable from '../components/users/UsersTable';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await UserService.getAll();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await UserService.delete(userId);
                setUsers(users.filter(user => user.id !== userId));
                setExpandedUser(null);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const toggleUserDetails = async (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            return;
        }

        if (!userDetails[userId]) {
            try {
                const { data } = await UserService.getById(userId);
                setUserDetails(prev => ({ ...prev, [userId]: data }));
            } catch (err) {
                setError(`Failed to fetch user details: ${err.message}`);
                return;
            }
        }

        setExpandedUser(userId);
    };

    if (loading) return <div className="text-center py-8">Loading users...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <Link 
                    to="/admin/users/create" 
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500"
                >
                    Add New User
                </Link>
            </div>
            
            <UsersTable
                users={users}
                expandedUser={expandedUser}
                userDetails={userDetails}
                toggleUserDetails={toggleUserDetails}
                handleDelete={handleDelete}
            />
        </div>
    );
}
