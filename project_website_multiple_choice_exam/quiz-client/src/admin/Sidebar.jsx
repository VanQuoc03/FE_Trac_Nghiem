import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar({ setToken }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/LoginAdmin'); 
    setToken('');         
  }

  const isActive = (path) => location.pathname === path ? 'bg-[#C7A36F] text-white' : 'text-white hover:bg-gray-600'

  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-screen fixed">
      <h1 className="text-2xl font-bold mb-6 text-[#C7A36F]">Admin Dashboard</h1>
      <nav className="space-y-2">
        <Link
          to="/HomeAdmin"
          className={`block py-2 px-4 rounded ${isActive('/')}`}
        >
          Tổng quan
        </Link>
        <Link
          to="/HocSinhManager"
          className={`block py-2 px-4 rounded ${isActive('/hocsinh')}`}
        >
          Quản lý học sinh
        </Link>
        <Link
          to="/GiaoVienManager"
          className={`block py-2 px-4 rounded ${isActive('/giaovien')}`}
        >
          Quản lý giáo viên
        </Link>
        <Link
          to="/MonHocManager"
          className={`block py-2 px-4 rounded ${isActive('/dethi')}`}
        >
          Quản lý môn học
        </Link>
        <Link
          to="/DeThiManager"
          className={`block py-2 px-4 rounded ${isActive('/dethi')}`}
        >
          Quản lý đề thi
        </Link>
        <Link
          to="/BaiThiManager"
          className={`block py-2 px-4 rounded ${isActive('/dethi')}`}
        >
          Quản lý bài thi
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 px-4 rounded text-white hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </nav>
    </div>
  )
}