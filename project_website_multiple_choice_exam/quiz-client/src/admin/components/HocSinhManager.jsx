import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';

export default function HocSinhManager({ setToken }) {
  const [hocSinhList, setHocSinhList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    ten_hocsinh: '',
    tendangnhap: '',
    matkhau: '',
    email: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

  // Fetch danh sách học sinh
  const fetchHocSinh = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://quiz-api-34vp.onrender.com/api/hocsinh', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHocSinhList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHocSinh();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        // Update học sinh
        const updateData = { ...formData };
        delete updateData.matkhau; // Không gửi mật khẩu khi cập nhật
        await axios.put(`https://quiz-api-34vp.onrender.com/api/hocsinh/${editingId}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Thêm học sinh mới
        await axios.post('https://quiz-api-34vp.onrender.com/api/hocsinh/register', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({
        ten_hocsinh: '',
        tendangnhap: '',
        matkhau: '',
        email: '',
        phone: '',
      });
      setIsEditing(false);
      setEditingId(null);
      fetchHocSinh();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi gửi dữ liệu');
    }
  };

  const handleEdit = (hocSinh) => {
    setFormData({
      ten_hocsinh: hocSinh.ten_hocsinh,
      tendangnhap: hocSinh.tendangnhap,
      matkhau: '', // Không load mật khẩu
      email: hocSinh.email,
      phone: hocSinh.phone,
    });
    setIsEditing(true);
    setEditingId(hocSinh.id_hocsinh);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học sinh này? Tất cả bài thi liên quan sẽ bị xóa.')) return;
    setError('');
    try {
      await axios.delete(`https://quiz-api-34vp.onrender.com/api/hocsinh/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHocSinh();
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể xóa học sinh. Vui lòng kiểm tra các bài thi liên quan.');
    }
  };

  return (
    <div className="flex">
      <Sidebar setToken={setToken} />
      <div className="ml-64 p-6 flex-1 bg-[#FFF0E5] min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-[#333]">Quản lý học sinh</h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p className="text-red-600 bg-white px-3 py-2 rounded mb-6 text-sm text-center">{error}</p>
        )}

        {/* FORM THÊM/SỬA */}
        <form onSubmit={handleSubmit} className="bg-white p-6 mb-8 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-[#333]">{isEditing ? 'Sửa' : 'Thêm'} học sinh</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="ten_hocsinh"
              value={formData.ten_hocsinh}
              onChange={handleChange}
              placeholder="Tên học sinh"
              className="border p-2 rounded"
              required
            />
            <input
              name="tendangnhap"
              value={formData.tendangnhap}
              onChange={handleChange}
              placeholder="Tên đăng nhập"
              className="border p-2 rounded"
              required
              disabled={isEditing} // Không cho sửa tên đăng nhập khi cập nhật
            />
            <input
              name="matkhau"
              type="password"
              value={formData.matkhau}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="border p-2 rounded"
              required={!isEditing} // Bắt buộc khi thêm mới
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className="border p-2 rounded"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="border p-2 rounded"
            />
          </div>
          <button type="submit" className="mt-4 bg-[#C7A36F] text-white px-4 py-2 rounded">
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ten_hocsinh: '',
                  tendangnhap: '',
                  matkhau: '',
                  email: '',
                  phone: '',
                });
                setIsEditing(false);
                setEditingId(null);
              }}
              className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          )}
        </form>

        {/* DANH SÁCH HỌC SINH */}
        {loading ? (
          <p className="text-center">Đang tải dữ liệu...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-[#C7A36F] text-white">
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Tên</th>
                  <th className="border p-3">Tên đăng nhập</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">SĐT</th>
                  <th className="border p-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {hocSinhList.map((hs) => (
                  <tr key={hs.id_hocsinh} className="hover:bg-gray-100">
                    <td className="border p-3">{hs.id_hocsinh}</td>
                    <td className="border p-3">{hs.ten_hocsinh}</td>
                    <td className="border p-3">{hs.tendangnhap}</td>
                    <td className="border p-3">{hs.email}</td>
                    <td className="border p-3">{hs.phone}</td>
                    <td className="border p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(hs)}
                        className="bg-yellow-400 px-2 py-1 rounded text-white text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(hs.id_hocsinh)}
                        className="bg-red-500 px-2 py-1 rounded text-white text-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
