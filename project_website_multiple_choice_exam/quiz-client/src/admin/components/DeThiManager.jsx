import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';

export default function DeThiManager({ setToken }) {
  const [deThiList, setDeThiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

  // Fetch danh sách đề thi
  const fetchDeThi = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://quiz-api-34vp.onrender.com/api/dethi', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeThiList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải danh sách đề thi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeThi();
  }, []);

  return (
    <div className="flex">
      <Sidebar setToken={setToken} />
      <div className="ml-64 p-6 flex-1 bg-[#FFF0E5] min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-[#333]">Quản lý đề thi</h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p className="text-red-600 bg-white px-3 py-2 rounded mb-6 text-sm text-center">{error}</p>
        )}

        {/* DANH SÁCH ĐỀ THI */}
        {loading ? (
          <p className="text-center">Đang tải dữ liệu...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-[#C7A36F] text-white">
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Tên đề</th>
                  <th className="border p-3">Giáo viên</th>
                  <th className="border p-3">Môn học</th>
                  <th className="border p-3">Ngày tạo</th>
                  <th className="border p-3">Thời gian thi</th>
                  <th className="border p-3">Bắt đầu</th>
                  <th className="border p-3">Kết thúc</th>
                  <th className="border p-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {deThiList.map((deThi) => (
                  <tr key={deThi.id_dethi} className="hover:bg-gray-100">
                    <td className="border p-3">{deThi.id_dethi}</td>
                    <td className="border p-3">{deThi.tendethi}</td>
                    <td className="border p-3">{deThi.giaovien?.ten_giaovien}</td>
                    <td className="border p-3">{deThi.monhoc?.tenmonhoc}</td>
                    <td className="border p-3">{deThi.ngay_tao?.split('T')[0]}</td>
                    <td className="border p-3">{deThi.thoigianthi} phút</td>
                    <td className="border p-3">{deThi.thoigianbatdau?.split('.')[0]}</td>
                    <td className="border p-3">{deThi.thoigianketthuc?.split('.')[0]}</td>
                    <td className="border p-3">
                      {deThi.trangthai === 'chuabatdau' ? 'Chưa bắt đầu' :
                       deThi.trangthai === 'dangdienra' ? 'Đang diễn ra' : 'Đã kết thúc'}
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
