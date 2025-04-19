import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'

export default function Dashboard({ setToken }) {
  const [giaoVienList, setGiaoVienList] = useState([])
  const [hocSinhList, setHocSinhList] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Lấy danh sách giáo viên
        const giaoVienResponse = await axios.get('/api/giaovien', {
          headers: { Authorization: `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}` },
        })
        setGiaoVienList(giaoVienResponse.data)

        // Lấy danh sách học sinh
        const hocSinhResponse = await axios.get('/api/hocsinh', {
          headers: { Authorization: `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}` },
        })
        setHocSinhList(hocSinhResponse.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Lỗi tải dữ liệu. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex">
      <Sidebar setToken={setToken} />
      <div className="ml-64 p-6 flex-1 bg-[#FFF0E5] min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-[#333]">Tổng quan Admin</h2>
        {error && (
          <p className="text-red-600 bg-white px-3 py-2 rounded mb-6 text-sm text-center">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-center text-[#333]">Đang tải dữ liệu...</p>
        ) : (
          <>
            {/* Danh sách giáo viên */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-[#333]">Danh sách giáo viên</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-[#C7A36F] text-white">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">Tên</th>
                      <th className="border p-3 text-left">Tên đăng nhập</th>
                      <th className="border p-3 text-left">Email</th>
                      <th className="border p-3 text-left">Số điện thoại</th>
                      <th className="border p-3 text-left">Môn chính</th>
                      <th className="border p-3 text-left">Lớp dạy chính</th>
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
                        <td className="border p-3">{giaoVien.monhoc.tenmonhoc}</td>
                        <td className="border p-3">{giaoVien.lopdaychinh}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Danh sách học sinh */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#333]">Danh sách học sinh</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-[#C7A36F] text-white">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">Tên</th>
                      <th className="border p-3 text-left">Tên đăng nhập</th>
                      <th className="border p-3 text-left">Email</th>
                      <th className="border p-3 text-left">Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hocSinhList.map((hocSinh) => (
                      <tr key={hocSinh.id_hocsinh} className="hover:bg-gray-100">
                        <td className="border p-3">{hocSinh.id_hocsinh}</td>
                        <td className="border p-3">{hocSinh.ten_hocsinh}</td>
                        <td className="border p-3">{hocSinh.tendangnhap}</td>
                        <td className="border p-3">{hocSinh.email}</td>
                        <td className="border p-3">{hocSinh.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}