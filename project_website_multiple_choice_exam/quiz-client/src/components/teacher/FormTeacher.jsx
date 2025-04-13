import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FormTeacher = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const giaovien = JSON.parse(localStorage.getItem("giaovien"));
  const API_GIANGVIEN = "/api/giaovien";

  useEffect(() => {
    if (!giaovien) {
      navigate("/login");
      return;
    }

    const fetchTeacher = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9naWFvdmllbiI6IkdWMDAyIiwidGVuZGFuZ25oYXBfZ3YiOiJnaWFvdmllbjIiLCJpYXQiOjE3NDQ1Mzc5NjksImV4cCI6MTc0NDU0MTU2OX0.egecp73tdg7p68zPQN5SQX0CGa4_ABqA3nTT9t6LKuQ";

        const res = await axios.get(`${API_GIANGVIEN}/${giaovien.id_giaovien}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setForm(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giáo viên:", error);
        setError(error.response?.data?.message || "Không thể tải thông tin giáo viên");
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("giaovien");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchTeacher();
  }, [navigate, giaovien]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9naWFvdmllbiI6IkdWMDAyIiwidGVuZGFuZ25oYXBfZ3YiOiJnaWFvdmllbjIiLCJpYXQiOjE3NDQ1Mzc5NjksImV4cCI6MTc0NDU0MTU2OX0.egecp73tdg7p68zPQN5SQX0CGa4_ABqA3nTT9t6LKuQ";

      const { ten_giaovien, email_gv, phone_gv, lopdaychinh } = form;
      await axios.put(
        `${API_GIANGVIEN}/${giaovien.id_giaovien}`,
        {
          ten_giaovien,
          email_gv,
          phone_gv,
          lopdaychinh,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Cập nhật thành công!");
      navigate("/profile");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
    }
  };

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!form) return <div>Đang tải dữ liệu...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-md rounded"
    >
      <h2 className="text-2xl font-medium flex justify-center">
        Chỉnh sửa thông tin
      </h2>
      <label htmlFor="ten_giaovien" className="block font-bold mb-2">
        Tên giảng viên
      </label>
      <input
        type="text"
        name="ten_giaovien"
        className="w-full border p-2 rounded mb-4"
        value={form.ten_giaovien}
        onChange={handleChange}
      />

      <label htmlFor="email_gv" className="block font-bold mb-2">
        Email
      </label>
      <input
        type="email"
        name="email_gv"
        className="w-full border p-2 rounded mb-4"
        value={form.email_gv}
        onChange={handleChange}
      />

      <label htmlFor="phone_gv" className="block font-bold mb-2">
        Số điện thoại
      </label>
      <input
        type="text"
        name="phone_gv"
        className="w-full border p-2 rounded mb-4"
        value={form.phone_gv}
        onChange={handleChange}
      />

      <label htmlFor="lopdaychinh" className="block font-bold mb-2">
        Lớp dạy chính
      </label>
      <input
        type="text"
        name="lopdaychinh"
        className="w-full border p-2 rounded mb-4"
        value={form.lopdaychinh}
        onChange={handleChange}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4 hover:bg-blue-600">
        Lưu thay đổi
      </button>
    </form>
  );
};

export default FormTeacher;