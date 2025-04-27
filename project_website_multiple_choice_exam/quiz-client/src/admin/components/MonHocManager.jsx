import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';

export default function MonHocManager({ setToken }) {
  const [monHocList, setMonHocList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

  // Fetch danh sách môn học từ API
  const fetchMonHoc = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://quiz-api-34vp.onrender.com/api/monhoc', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonHocList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonHoc();
  }, []);

  return (
    <div className="flex">
      <Sidebar setToken={setToken} />
      <div className="ml-64 p-6 flex-1 bg-[#FFF0E5] min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-[#333]">Quản lý môn học</h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p className="text-red-600 bg-white px-3 py-2 rounded mb-6 text-sm text-center">{error}</p>
        )}

        {/* DANH SÁCH MÔN HỌC */}
        {loading ? (
          <p className="text-center">Đang tải dữ liệu...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-[#C7A36F] text-white">
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Tên Môn</th>
                </tr>
              </thead>
              <tbody>
                {monHocList.map((monHoc) => (
                  <tr key={monHoc.id_monhoc} className="hover:bg-gray-100">
                    <td className="border p-3">{monHoc.id_monhoc}</td>
                    <td className="border p-3">{monHoc.tenmonhoc}</td>
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
