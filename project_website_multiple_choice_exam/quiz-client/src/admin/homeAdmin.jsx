import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';


export default function HomeAdmin({ setToken }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    giaoVien: 0,
    hocSinh: 0,
    deThi: 0,
    baiThi: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

  useEffect(() => {
    if (!token) {
      navigate('/LoginAdmin');
      return;
    }
  
    const fetchData = async () => {
      setLoading(true);
      try {
        // ... your axios code (không cần thay đổi)
      } catch (err) {
        setError(err.response?.data?.error || 'Lỗi tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch giáo viên
        const giaoVienResponse = await axios.get('https://quiz-api-34vp.onrender.com/api/giaovien', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch học sinh
        const hocSinhResponse = await axios.get('https://quiz-api-34vp.onrender.com/api/hocsinh', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch đề thi
        const deThiResponse = await axios.get('https://quiz-api-34vp.onrender.com/api/dethi', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch bài thi
        const baiThiResponse = await axios.get('https://quiz-api-34vp.onrender.com/api/baithi', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update counts
        setCounts({
          giaoVien: giaoVienResponse.data.length,
          hocSinh: hocSinhResponse.data.length,
          deThi: deThiResponse.data.length,
          baiThi: baiThiResponse.data.length,
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Lỗi tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar setToken={setToken} />
      <div className="ml-64 p-6 flex-1 bg-[#FFF0E5] min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-[#333]">Tổng quan Admin</h2>

        {error && (
          <p className="text-red-600 bg-white px-3 py-2 rounded mb-6 text-sm text-center">{error}</p>
        )}
        {loading ? (
          <p className="text-center text-[#333]">Đang tải dữ liệu...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-[#333] mb-2">Số giáo viên</h3>
              <p className="text-3xl font-bold text-[#C7A36F]">{counts.giaoVien}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-[#333] mb-2">Số học sinh</h3>
              <p className="text-3xl font-bold text-[#C7A36F]">{counts.hocSinh}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-[#333] mb-2">Số đề thi</h3>
              <p className="text-3xl font-bold text-[#C7A36F]">{counts.deThi}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-[#333] mb-2">Số bài thi</h3>
              <p className="text-3xl font-bold text-[#C7A36F]">{counts.baiThi}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
