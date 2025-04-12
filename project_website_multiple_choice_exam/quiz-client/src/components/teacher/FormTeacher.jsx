import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FormTeacher = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const teacherId = "GV002";
  const API_GIANGVIEN = "/api/giaovien";

  useEffect(() => {
    const fetchTeacher = async () => {
      const res = await axios.get(`${API_GIANGVIEN}/${teacherId}`);
      setForm(res.data);
    };
    fetchTeacher();
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { ten_giaovien, email_gv, phone_gv, lopdaychinh } = form;
      const res = await axios.put(`${API_GIANGVIEN}/${teacherId}`, {
        ten_giaovien,
        email_gv,
        phone_gv,
        lopdaychinh,
      });
      alert("Cập nhật thành công!");
      console.log("Dữ liệu sau khi cập nhật", res.data);
      navigate("/profile"); 
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };
  if (!form) return <div>Đang tải dữ liệu...</div>;
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-md rounded"
      action=""
    >
      <h2 className="text-2xl font-medium flex justify-center">
        Chỉnh sửa thông tin
      </h2>
      <label htmlFor="" className="block font-bold mb-2">
        Tên giảng viên
      </label>
      <input
        type="text"
        name="ten_giaovien"
        className="w-full border p-2 rounded mb-4"
        value={form.ten_giaovien}
        onChange={handleChange}
      />

      <label htmlFor="" className="block font-bold mb-2">
        Email
      </label>
      <input
        type="email"
        name="email_gv"
        className="w-full border p-2 rounded mb-4"
        value={form.email_gv}
        onChange={handleChange}
      />

      <label htmlFor="" className="block font-bold mb-2">
        Số điện thoại
      </label>
      <input
        type="text"
        name="phone_gv"
        className="w-full border p-2 rounded mb-4"
        value={form.phone_gv}
        onChange={handleChange}
      />

      <label htmlFor="" className="block font-bold mb-2">
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
