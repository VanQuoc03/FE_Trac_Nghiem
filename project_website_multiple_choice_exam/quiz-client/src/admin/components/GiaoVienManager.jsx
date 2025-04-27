import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';

export default function GiaoVienManager({ setToken }) {
  const [giaoVienList, setGiaoVienList] = useState([]);
  const [monHocList, setMonHocList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    ten_giaovien: '',
    tendangnhap_gv: '',
    matkhau_gv: '',
    email_gv: '',
    phone_gv: '',
    monchinh: '',
    lopdaychinh: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

  // Fetch danh sách giáo viên
  const fetchGiaoVien = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://quiz-api-34vp.onrender.com/api/giaovien', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGiaoVienList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải danh sách giáo viên');
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách môn học
  const fetchMonHoc = async () => {
    try {
      const res = await axios.get('https://quiz-api-34vp.onrender.com/api/monhoc', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonHocList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải danh sách môn học');
    }
  };

  useEffect(() => {
    fetchGiaoVien();
    fetchMonHoc();
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
        // Update giáo viên
        const updateData = { ...formData };
        delete updateData.matkhau_gv; // Không gửi mật khẩu khi cập nhật
        await axios.put(`https://quiz-api-34vp.onrender.com/api/giaovien/${editingId}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Thêm giáo viên mới
        await axios.post('https://quiz-api-34vp.onrender.com/api/giaovien/register', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({
        ten_giaovien: '',
        tendangnhap_gv: '',
        matkhau_gv: '',
        email_gv: '',
        phone_gv: '',
        monchinh: '',
        lopdaychinh: '',
      });
      setIsEditing(false);
      setEditingId(null);
      fetchGiaoVien();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi gửi dữ liệu');
    }
  };

  const handleEdit = (giaoVien) => {
    setFormData({
      ten_giaovien: giaoVien.ten_giaovien,
      tendangnhap_gv: giaoVien.tendangnhap_gv,
      matkhau_gv: '', // Không load mật khẩu
      email_gv: giaoVien.email_gv,
      phone_gv: giaoVien.phone_gv,
      monchinh: giaoVien.monhoc.id_monhoc,
      lopdaychinh: giaoVien.lopdaychinh,
    });
    setIsEditing(true);
    setEditingId(giaoVien.id_giaovien);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giáo viên này không?')) return;
    setError('');
    try {
      await axios.delete(`https://quiz-api-34vp.onrender.com/api/giaovien/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGiaoVien();
    } catch (err) {
      const msg = err.response?.data?.error || 'Lỗi khi xóa giáo viên';
      if (
        msg.includes('foreign key constraint fails') ||
        msg.toLowerCase().includes('a foreign key constraint')
      ) {
        setError('Không thể xóa giáo viên này vì đang được liên kết với đề thi.');
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar setToken={setToken} />
      <div className="ml-64 p-6 flex-1 bg-[#FFF0E5] min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-[#333]">Quản lý giáo viên</h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p className="text-red-600 bg-white px-3 py-2 rounded mb-6 text-sm text-center">{error}</p>
        )}

        {/* FORM THÊM/SỬA */}
        <form onSubmit={handleSubmit} className="bg-white p-6 mb-8 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-[#333]">{isEditing ? 'Sửa' : 'Thêm'} giáo viên</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="ten_giaovien"
              value={formData.ten_giaovien}
              onChange={handleChange}
              placeholder="Tên giáo viên"
              className="border p-2 rounded"
              required
            />
            <input
              name="tendangnhap_gv"
              value={formData.tendangnhap_gv}
              onChange={handleChange}
              placeholder="Tên đăng nhập"
              className="border p-2 rounded"
              required
              disabled={isEditing} // Không cho sửa tên đăng nhập khi cập nhật
            />
            <input
              name="matkhau_gv"
              type="password"
              value={formData.matkhau_gv}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="border p-2 rounded"
              required={!isEditing} // Bắt buộc khi thêm mới
            />
            <input
              name="email_gv"
              value={formData.email_gv}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className="border p-2 rounded"
              required
            />
            <input
              name="phone_gv"
              value={formData.phone_gv}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="border p-2 rounded"
            />
            <select
              name="monchinh"
              value={formData.monchinh}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Chọn môn chính</option>
              {monHocList.map((mon) => (
                <option key={mon.id_monhoc} value={mon.id_monhoc}>
                  {mon.tenmonhoc}
                </option>
              ))}
            </select>
            <input
              name="lopdaychinh"
              value={formData.lopdaychinh}
              onChange={handleChange}
              placeholder="Lớp dạy chính"
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
                  ten_giaovien: '',
                  tendangnhap_gv: '',
                  matkhau_gv: '',
                  email_gv: '',
                  phone_gv: '',
                  monchinh: '',
                  lopdaychinh: '',
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

        {/* DANH SÁCH GIÁO VIÊN */}
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
                  <th className="border p-3">Môn</th>
                  <th className="border p-3">Lớp chính</th>
                  <th className="border p-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {giaoVienList.map((giaoVien) => (
                  <tr key={giaoVien.id_giaovien} className="hover:bg-gray-100">
                    <td className="border p-3">{giaoVien.id_giaovien}</td>
                    <td className="border p-3">{giaoVien.ten_giaovien}</td>
                    <td className="border p-3">{giaoVien.tendangnhap_gv}</td>
                    <td className="border p-3">{giaoVien.email_gv}</td>
                    <td className="border p-3">{giaoVien.phone_gv}</td>
                    <td className="border p-3">{giaoVien.monhoc?.tenmonhoc}</td>
                    <td className="border p-3">{giaoVien.lopdaychinh}</td>
                    <td className="border p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(giaoVien)}
                        className="bg-yellow-400 px-2 py-1 rounded text-white text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(giaoVien.id_giaovien)}
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
