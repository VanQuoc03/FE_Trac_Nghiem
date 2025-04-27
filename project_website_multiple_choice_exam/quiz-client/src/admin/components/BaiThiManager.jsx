import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';

export default function BaiThiManager({ setToken }) {
  const [baiThiList, setBaiThiList] = useState([]);
  const [ setDeThiList] = useState([]);
  const [ setHocSinhList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

  // Fetch danh sách bài thi
  const fetchBaiThi = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://quiz-api-34vp.onrender.com/api/baithi', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBaiThiList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải danh sách bài thi');
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách đề thi
  const fetchDeThi = async () => {
    try {
      const res = await axios.get('https://quiz-api-34vp.onrender.com/api/dethi', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeThiList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải danh sách đề thi');
    }
  };

  // Fetch danh sách học sinh
  const fetchHocSinh = async () => {
    try {
      const res = await axios.get('https://quiz-api-34vp.onrender.com/api/hocsinh', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHocSinhList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải danh sách học sinh');
    }
  };

  useEffect(() => {
    fetchBaiThi();
    fetchDeThi();
    fetchHocSinh();
  }, []);

  return (
    <div className="flex">
      <Sidebar setToken={setToken} />
      <div className="ml-64 p-6 flex-1 bg-[#FFF0E5] min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-[#333]">Quản lý bài thi</h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p className="text-red-600 bg-white px-3 py-2 rounded mb-6 text-sm text-center">{error}</p>
        )}

        {/* DANH SÁCH BÀI THI */}
        {loading ? (
          <p className="text-center">Đang tải dữ liệu...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-[#C7A36F] text-white">
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Đề thi</th>
                  <th className="border p-3">Học sinh</th>
                  <th className="border p-3">Ngày làm</th>
                  <th className="border p-3">Trạng thái</th>
                  <th className="border p-3">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {baiThiList.map((baiThi) => (
                  <tr key={baiThi.id_baithi} className="hover:bg-gray-100">
                    <td className="border p-3">{baiThi.id_baithi}</td>
                    <td className="border p-3">{baiThi.dethi?.tendethi}</td>
                    <td className="border p-3">{baiThi.hocsinh?.ten_hocsinh}</td>
                    <td className="border p-3">{baiThi.ngaylam?.split('.')[0]}</td>
                    <td className="border p-3">
                      {baiThi.trangthai === 'chuacham' ? 'Chưa chấm' : 'Đã chấm'}
                    </td>
                    <td className="border p-3">{baiThi.diemthi || 'N/A'}</td>
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
