import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditExam = () => {
  const { id_dethi } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`/api/dethi/${id_dethi}`);
        setForm(res.data);
      } catch (error) {
        console.log("Lỗi khi tải đề thi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id_dethi]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { thoigianthi, trangthai } = form;
      const res = await axios.put(`/api/dethi/${id_dethi}`, {
        thoigianthi,
        trangthai,
      });
      alert("Cập nhật thành công!");
      console.log("Dữ liệu sau khi cập nhật", res.data);
      navigate("/teacher/exams");
    } catch (error) {
      console.log("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };
  if (!form) return <div>Đang tải dữ liệu...</div>;
  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto shadow rounded bg-white mt-10 p-6"
    >
      <h2 className="text-2xl font-bold mb-4">
        Chỉnh sửa đề thi {form.id_dethi}
      </h2>
      <label htmlFor="" className="block font-medium mb-1">
        Thời gian thi (Phút)
      </label>
      <input
        type="number"
        name="thoigianthi"
        className="border w-full p-2 rounded mb-4"
        value={form.thoigianthi}
        onChange={handleChange}
      />

      <label htmlFor="" className="block font-medium mb-1">
        Trạng thái
      </label>
      <select
        name="trangthai"
        value={form.trangthai}
        onChange={handleChange}
        id=""
        className="border w-full p-2 rounded mb-4"
      >
        <option value="onthi">Ôn thi</option>
        <option value="dethi">Đề thi</option>
      </select>
      <button className="bg-blue-500 text-white rounded px-4 py-2">Lưu</button>
    </form>
  );
};

export default EditExam;
