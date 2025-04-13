import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || storedUser.role !== "student") {
          navigate("/login");
          return;
        }

        // Optionally fetch additional user data from the backend
        const response = await axios.get(`/api/users/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${storedUser.token}` },
        });
        setUser(response.data);
        setUpdatedUsername(response.data.tendangnhap);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Không thể tải thông tin tài khoản.");
        // Fallback to localStorage data if backend fetch fails
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        setUpdatedUsername(storedUser.tendangnhap);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setError("");
  };

  const handleUpdateProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await axios.put(
        `/api/users/${storedUser.id}`,
        { tendangnhap: updatedUsername },
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );

      // Update localStorage and state with the new username
      const updatedUser = { ...storedUser, tendangnhap: response.data.tendangnhap };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Không thể cập nhật thông tin. Vui lòng thử lại.");
    }
  };

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (!user) return <div className="text-center p-6 text-red-500">Không tìm thấy thông tin người dùng.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Thông Tin Tài Khoản</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mã học sinh:</label>
          <p className="mt-1 text-lg">{user.id}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên đăng nhập:</label>
          {editMode ? (
            <input
              type="text"
              value={updatedUsername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
              className="mt-1 p-2 border rounded w-full max-w-md"
            />
          ) : (
            <p className="mt-1 text-lg">{user.tendangnhap}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Vai trò:</label>
          <p className="mt-1 text-lg">{user.role === "student" ? "Học sinh" : "Không xác định"}</p>
        </div>
        <div className="flex space-x-4">
          {editMode ? (
            <>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdateProfile}
              >
                Lưu
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={handleEditToggle}
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleEditToggle}
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;