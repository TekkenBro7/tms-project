import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../../services/UserService';

export default function UserEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        avatar: null,
        password: '',
        is_staff: false,
        is_superuser: false,
        is_active: true,
    });
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await UserService.getById(id);
                const user = response.data;
                console.log('Avatar from API:', user.avatar, typeof user.avatar);
                setUserDetails(user);
                setFormData({
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    avatar: null,
                    password: '',
                    is_staff: user.is_staff,
                    is_superuser: user.is_superuser,
                });
                setAvatarPreview(user.avatar);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({ ...prev, avatar: file }));
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            console.log(avatarPreview);
            console.log(avatarPreview);

        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('first_name', formData.first_name);
        data.append('last_name', formData.last_name);
        if (formData.avatar) {
            data.append('avatar', formData.avatar);
        }
        if (formData.password) {
            data.append('password', formData.password);
        }
        data.append('is_staff', formData.is_staff);
        data.append('is_superuser', formData.is_superuser);
        data.append('is_active', formData.is_active);

        try {
            await UserService.update(id, data);
            navigate('/admin/users');
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!userDetails) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Редактировать пользователя</h1>
                    <button 
                        onClick={() => navigate('/admin/users')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Отмена
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID (Только чтение)
                            </label>
                            <input
                                type="text"
                                value={userDetails.id}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Имя пользователя *
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Имя
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Фамилия
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Аватар
                            </label>
                            {avatarPreview && (
                                <div className="mb-2">
                                    <img src={avatarPreview} alt="Аватар" className="h-20 w-20 rounded-full object-cover" />
                                </div>
                            )}
                            <input
                                type="file"
                                name="avatar"
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Пароль (Оставьте пустым, если не хотите менять)
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength="8"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дата регистрации (Только чтение)
                            </label>
                            <input
                                type="text"
                                value={new Date(userDetails.date_joined).toLocaleString('ru-RU')}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Последний вход (Только чтение)
                            </label>
                            <input
                                type="text"
                                value={userDetails.last_login ? new Date(userDetails.last_login).toLocaleString('ru-RU') : 'Никогда'}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div className="col-span-2 flex items-center space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_staff"
                                    name="is_staff"
                                    checked={formData.is_staff}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_staff" className="ml-2 block text-sm text-gray-700">
                                    Сотрудник
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_superuser"
                                    name="is_superuser"
                                    checked={formData.is_superuser}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_superuser" className="ml-2 block text-sm text-gray-700">
                                    Суперпользователь
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-1 rounded shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 flex items-center"
                        >
                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
