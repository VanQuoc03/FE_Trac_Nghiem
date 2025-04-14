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

  // Hàm giải mã token để lấy id_hocsinh và tendangnhap
  const getUserInfoFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id_hocsinh: payload.id_hocsinh,
        tendangnhap: payload.tendangnhap,
      };
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || storedUser.role !== "student" || !storedUser.token) {
          setError("Vui lòng đăng nhập với tài khoản học sinh.");
          navigate("/login");
          return;
        }

        // Lấy thông tin từ token
        const tokenInfo = getUserInfoFromToken(storedUser.token);
        if (!tokenInfo) {
          setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        }

        // Gọi API để lấy thông tin học sinh
        const response = await axios.get(`/hocsinh/${tokenInfo.id_hocsinh}`, {
          headers: { Authorization: `Bearer ${storedUser.token}` },
        });

        setUser({
          id_hocsinh: tokenInfo.id_hocsinh,
          tendangnhap: response.data.tendangnhap || tokenInfo.tendangnhap,
          role: storedUser.role,
          // Lưu các trường khác từ API nếu có (ví dụ: ten_hocsinh, email, v.v.)
          ...response.data,
        });
        setUpdatedUsername(response.data.tendangnhap || tokenInfo.tendangnhap);
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else if (err.response?.status === 500) {
          setError("Lỗi server khi tải thông tin. Vui lòng thử lại.");
          // Fallback to token data
          const storedUser = JSON.parse(localStorage.getItem("user"));
          const tokenInfo = getUserInfoFromToken(storedUser.token);
          if (tokenInfo) {
            setUser({
              id_hocsinh: tokenInfo.id_hocsinh,
              tendangnhap: tokenInfo.tendangnhap,
              role: storedUser.role,
            });
            setUpdatedUsername(tokenInfo.tendangnhap);
          }
        } else {
          setError("Không thể tải thông tin tài khoản.");
        }
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
      const tokenInfo = getUserInfoFromToken(storedUser.token);
      if (!tokenInfo) {
        setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }

      // Giả sử có API PUT để cập nhật thông tin học sinh
      const response = await axios.put(
        `/hocsinh/${tokenInfo.id_hocsinh}`,
        { tendangnhap: updatedUsername },
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );

      // Cập nhật localStorage và state
      const updatedUser = {
        ...storedUser,
        tendangnhap: response.data.tendangnhap || updatedUsername,
      };
      setUser({
        id_hocsinh: tokenInfo.id_hocsinh,
        tendangnhap: response.data.tendangnhap || updatedUsername,
        role: storedUser.role,
        ...response.data,
      });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response?.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else if (err.response?.status === 500) {
        setError("Lỗi server khi cập nhật thông tin. Vui lòng thử lại.");
      } else {
        setError("Không thể cập nhật thông tin. Vui lòng thử lại.");
      }
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
          <p className="mt-1 text-lg">{user.id_hocsinh}</p>
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