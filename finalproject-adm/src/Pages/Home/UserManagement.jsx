import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import apiClient from '../../Services/apiConfig';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('user'); // State để theo dõi tab hiện tại
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Hiển thị modal xác nhận xóa
    const [deleteItem, setDeleteItem] = useState(null); // Đối tượng cần xóa (user/admin)
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [editedUser, setEditedUser] = useState({
        username: "",
        email: "",
        password: "",
        chessElo: 1200,
        chessDownElo: 1200,
    });


    const [newAdmin, setNewAdmin] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [showEditAdminModal, setShowEditAdminModal] = useState(false);

    const [editedAdmin, setEditedAdmin] = useState({
        username: "",
        email: "",
        password: "",
    });


    useEffect(() => {
        const fetchUsersAndAdmins = async () => {
            try {
                const userResponse = await apiClient.get('/users'); // endpoint người dùng
                const adminResponse = await apiClient.get('/admins'); // endpoint quản trị viên
                setUsers(userResponse.data);
                setAdmins(adminResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Lỗi khi lấy dữ liệu');
                setLoading(false);
            }
        };

        fetchUsersAndAdmins();
    }, []);

    const confirmDelete = (username, type) => {
        setDeleteItem({ username, type });
        setShowDeleteModal(true); // Hiển thị modal xác nhận xóa
    };

    const handleCancelDelete = () => {
        setDeleteItem(null);
        setShowDeleteModal(false); // Đóng modal khi hủy
    };

    const handleDelete = async () => {
        if (!deleteItem) return;
        const { username, type } = deleteItem;

        try {
            if (type === 'user') {
                await apiClient.delete(`/users/username/${username}`);
                setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
            } else {
                await apiClient.delete(`/admins/username/${username}`);
                setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.username !== username));
            }
            setShowDeleteModal(false); // Đóng modal sau khi xoá
            toast.success('Xoá thành công!');
        } catch (err) {
            toast.error('Lỗi khi xoá');
        }
    };

    const handleAddUser = () => {
        setShowAddUserModal(true);
    };
    const handleAddAdmin = () => {
        setShowAddAdminModal(true);
    };

    const handleEdit = (user) => {
        setEditedUser({
            username: user.username,
            email: user.email,
            password: user.password,
            chessElo: user.chessElo,
            chessDownElo: user.chessDownElo
        });

        setShowEditUserModal(true); // Mở modal
    };
    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditAdmin = (admin) => {
        setEditedAdmin({
            username: admin.username,
            email: admin.email,
            password: admin.password,
        });

        setShowEditAdminModal(true); // Mở modal
    };

    const handleChangeEditAdmin = (e) => {
        const { name, value } = e.target;
        setEditedAdmin((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangeAdmin = (e) => {
        const { name, value } = e.target;

        setNewAdmin((prevAdmin) => ({
            ...prevAdmin,
            [name]: value,
        }));
    };
    const handleEditSubmitAdmin = async (e) => {
        e.preventDefault();
        // Gửi thông tin sửa tới API để cập nhật dữ liệu
        try {
            const response = await apiClient.put(`/admins/${editedAdmin.username}`, editedAdmin);

            if (response.status === 200) {
                toast.success('Cập nhật người dùng thành công!');

                // Cập nhật lại danh sách người dùng
                setAdmins((prevUsers) =>
                    prevUsers.map((user) =>
                        user.username === editedAdmin.username ? editedAdmin : user
                    )
                );

                setShowEditAdminModal(false); // Đóng modal
            } else {
                toast(`Lỗi: ${response.data}`);
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật người dùng.');
            console.error(error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        // Gửi thông tin sửa tới API để cập nhật dữ liệu
        try {
            const response = await apiClient.put(`/users/${editedUser.username}`, editedUser);

            if (response.status === 200) {
                toast.success('Cập nhật người dùng thành công!');

                // Cập nhật lại danh sách người dùng
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.username === editedUser.username ? editedUser : user
                    )
                );

                setShowEditUserModal(false); // Đóng modal
            } else {
                toast(`Lỗi: ${response.data}`);
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật người dùng.');
            console.error(error);
        }
    };


    const handleSubmitAddUser = async (e) => {
        e.preventDefault(); // Ngừng hành động mặc định của form
        setShowAddUserModal(true);
        try {
            // Gửi yêu cầu POST để thêm người dùng mới
            const response = await apiClient.post('/users', newUser);

            if (response.status === 200) {
                // Sau khi thêm người dùng thành công, đóng modal và reset form
                toast.success('Thêm người dùng mới thành công:');
                setUsers((prevUsers) => [...prevUsers, newUser]);
                setShowAddUserModal(false);
                setNewUser({ username: '', password: '', email: '' }); // Reset form
            }
        } catch (error) {
            toast.error('Phải nhập đủ và đúng định dạng các thông tin hoặc Username or email đã tồn tại !');
            setNewUser({ username: '', password: '', email: '' });
        }
    };

    const handleSubmitAddAdmin = async (e) => {
        e.preventDefault(); // Ngừng hành động mặc định của form
        setShowAddAdminModal(true);
        try {
            // Gửi yêu cầu POST để thêm người dùng mới
            const response = await apiClient.post('/admins', newAdmin);

            if (response.status === 200) {
                // Sau khi thêm người dùng thành công, đóng modal và reset form
                toast.success('Thêm người dùng mới thành công:');
                setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
                setShowAddAdminModal(false);
                setNewAdmin({ username: '', password: '', email: '' }); // Reset form
            }
        } catch (error) {
            toast.error('Phải nhập đủ và đúng định dạng các thông tin hoặc Username or email đã tồn tại !');
            setNewAdmin({ username: '', password: '', email: '' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };


    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-[#f7e3c4] px-10 pt-14 pb-6 rounded-2xl max-h-[80vh] overflow-auto shadow-2xl relative w-[1080px]">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Danh sách người dùng</h2>
                <div className="flex justify-center gap-6 mb-8">
                    <button
                        onClick={() => setActiveTab('user')}
                        className={`py-2 px-4 rounded-lg ${activeTab === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        User
                    </button>
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`py-2 px-4 rounded-lg ${activeTab === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Admin
                    </button>
                </div>

                {/* Bảng User */}
                {activeTab === 'user' && (
                    <>
                        <table className="w-full bg-white shadow-md rounded-lg text-sm">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="py-2 px-6 border-b">Username</th>
                                    <th className="py-2 px-6 border-b">Email</th>
                                    <th className="py-2 px-6 border-b">Password</th>
                                    <th className="py-2 px-6 border-b">Elo</th>
                                    <th className="py-2 px-6 border-b">Down Elo</th>
                                    <th className="py-2 px-6 border-b">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.username} className="text-center hover:bg-gray-100 transition-all">
                                        <td className="py-3 px-6 border-b">{user.username}</td>
                                        <td className="py-3 px-6 border-b">{user.email}</td>
                                        <td className="py-3 px-6 border-b">*****</td>
                                        <td className="py-3 px-6 border-b">{user.chessElo}</td>
                                        <td className="py-3 px-6 border-b">{user.chessDownElo}</td>
                                        <td className="py-3 px-6 border-b">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(user, 'User')}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user.username, 'user')}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    Xoá
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Nút thêm mới */}
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleAddUser}
                                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Thêm Mới
                            </button>
                        </div>
                    </>
                )}

                {/* Bảng Admin */}
                {activeTab === 'admin' && (
                    <>
                        <table className="w-full bg-white shadow-md rounded-lg text-sm">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="py-2 px-6 border-b">Username</th>
                                    <th className="py-2 px-6 border-b">Email</th>
                                    <th className="py-2 px-6 border-b">Password</th>
                                    <th className="py-2 px-6 border-b">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => (
                                    <tr key={admin.username} className="text-center hover:bg-gray-100 transition-all">
                                        <td className="py-3 px-6 border-b">{admin.username}</td>
                                        <td className="py-3 px-6 border-b">{admin.email}</td>
                                        <td className="py-3 px-6 border-b">*****</td>
                                        <td className="py-3 px-6 border-b">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEditAdmin(admin, 'Admin')}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(admin.username, 'Admin')}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    Xoá
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Nút thêm mới */}
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleAddAdmin}
                                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Thêm Mới
                            </button>
                        </div>
                    </>
                )}
                {/* Modal thêm người dùng (Hiển thị khi click nút thêm mới) */}
                {showAddUserModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-[#f7e3c4] w-[400px] rounded-xl p-6 relative shadow-xl border-4 border-yellow-800">
                            <h2 className="text-2xl font-bold text-center mb-4">Thêm người dùng mới</h2>
                            {/* Form thêm người dùng */}
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block mb-2">Username:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={newUser.username}
                                        onChange={handleChange}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block mb-2">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleChange}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block mb-2">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleChange}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddUserModal(false)}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={handleSubmitAddUser}
                                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showEditUserModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-[#f7e3c4] w-[400px] rounded-xl p-6 relative shadow-xl border-4 border-yellow-800">
                            <h2 className="text-2xl font-bold text-center mb-4">Sửa thông tin người dùng</h2>
                            {/* Form sửa thông tin người dùng */}
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="editUsername" className="block mb-2">Username:</label>
                                    <input
                                        type="text"
                                        id="editUsername"
                                        name="username"
                                        value={editedUser.username}
                                        onChange={handleChangeEdit}
                                        className="border px-4 py-2 w-full rounded-lg"
                                        disabled
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="editEmail" className="block mb-2">Email:</label>
                                    <input
                                        type="email"
                                        id="editEmail"
                                        name="email"
                                        value={editedUser.email}
                                        onChange={handleChangeEdit}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="editPassword" className="block mb-2">Password:</label>
                                    <input
                                        type="password"
                                        id="editPassword"
                                        name="password"
                                        value={editedUser.password}
                                        onChange={handleChangeEdit}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>

                                {/* Thêm trường chessElo */}
                                <div className="mb-4">
                                    <label htmlFor="editChessElo" className="block mb-2">Chess Elo:</label>
                                    <input
                                        type="number"
                                        id="editChessElo"
                                        name="chessElo"
                                        value={editedUser.chessElo}
                                        onChange={handleChangeEdit}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>

                                {/* Thêm trường chessDownElo */}
                                <div className="mb-4">
                                    <label htmlFor="editChessDownElo" className="block mb-2">Chess Down Elo:</label>
                                    <input
                                        type="number"
                                        id="editChessDownElo"
                                        name="chessDownElo"
                                        value={editedUser.chessDownElo}
                                        onChange={handleChangeEdit}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditUserModal(false)}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal thêm admin (Hiển thị khi click nút thêm mới) */}
                {showAddAdminModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-[#f7e3c4] w-[400px] rounded-xl p-6 relative shadow-xl border-4 border-yellow-800">
                            <h2 className="text-2xl font-bold text-center mb-4">Thêm Admin mới</h2>
                            {/* Form thêm người dùng */}
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block mb-2">Username:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={newAdmin.username}
                                        onChange={handleChangeAdmin}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block mb-2">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={newAdmin.password}
                                        onChange={handleChangeAdmin}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block mb-2">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={newAdmin.email}
                                        onChange={handleChangeAdmin}
                                        className="border px-4 py-2 w-full rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAdminModal(false)}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={handleSubmitAddAdmin}
                                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showEditAdminModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-[#f7e3c4] w-[400px] rounded-xl p-6 relative shadow-xl border-4 border-yellow-800">
                            <h2 className="text-2xl font-bold text-center mb-4">Sửa thông tin Admin</h2>
                            {/* Form sửa thông tin người dùng */}
                            <form onSubmit={handleEditSubmitAdmin}>
                                <div className="mb-4">
                                    <label htmlFor="editUsername" className="block mb-2">Username:</label>
                                    <input
                                        type="text"
                                        id="editUsername"
                                        name="username"
                                        value={editedAdmin.username}
                                        onChange={handleChangeEditAdmin}
                                        className="border px-4 py-2 w-full rounded-lg"
                                        disabled
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="editEmail" className="block mb-2">Email:</label>
                                    <input
                                        type="email"
                                        id="editEmail"
                                        name="email"
                                        value={editedAdmin.email}
                                        onChange={handleChangeEditAdmin}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="editPassword" className="block mb-2">Password:</label>
                                    <input
                                        type="password"
                                        id="editPassword"
                                        name="password"
                                        value={editedAdmin.password}
                                        onChange={handleChangeEditAdmin}
                                        className="border px-4 py-2 w-full rounded-lg"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditAdminModal(false)}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Modal Xác Nhận Xóa */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold mb-4 text-center">Xác Nhận Xoá</h3>
                            <p className="text-center mb-6">Bạn có chắc chắn muốn xoá {deleteItem?.type === 'user' ? 'User' : 'Admin'} "{deleteItem?.username}" không?</p>
                            <div className="flex justify-between">
                                <button
                                    onClick={handleCancelDelete}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Xoá
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <ToastContainer
                    position="top-center"
                    hideProgressBar={true}
                    closeOnClick
                    pauseOnHover
                    draggable
                    autoClose={1000}
                />
            </div>
            <button
                onClick={() => navigate("/")}
                className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
            >
                ⬅ Quay lại
            </button>
        </div>

    );
};

export default UserManagement;
