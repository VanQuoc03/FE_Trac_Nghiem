import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage({ setToken }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    // Loại bỏ khoảng trắng thừa
    const trimmedLogin = login.trim();
    const trimmedPass = pass.trim();

    // Kiểm tra độ dài
    if (trimmedLogin.length < 3 || trimmedPass.length < 6) {
      return 'Tên đăng nhập phải >= 3 ký tự và mật khẩu >= 6 ký tự.';
    }

    // Kiểm tra định dạng login (chỉ chứa chữ cái, số, dấu gạch dưới)
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedLogin)) {
      return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/login', {
        login: login.trim(),
        pass: pass.trim(),
      });

      const { token, id_admin, role, message } = response.data;

      if (message === 'Đăng nhập thành công') {
        // Lưu thông tin tối thiểu vào localStorage (nếu không dùng HttpOnly cookie)
        const userData = { role, token, id_admin, login: login.trim() };
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        navigate('/HomeAdmin');
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0E5] flex items-center justify-center p-4">
      <div className="bg-[#DBBA84] rounded-xl shadow-2xl px-8 py-10 w-full max-w-md">
        <h2 className="text-white text-3xl font-bold mb-6 text-center border-b border-white/50 pb-3">
          ĐĂNG NHẬP ADMIN
        </h2>
        {error && (
          <p className="text-red-600 bg-white/90 px-4 py-2 rounded-lg mb-4 text-sm text-center font-medium">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="text-white font-semibold text-sm block mb-2">
              Tên đăng nhập:
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#936222] transition"
              placeholder="Nhập tên đăng nhập"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="text-white font-semibold text-sm block mb-2">
              Mật khẩu:
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#936222] transition"
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full text-[#333] bg-[#D8AD73] font-bold transition flex items-center justify-center ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#936222]'
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-[#333]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              'ĐĂNG NHẬP'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}