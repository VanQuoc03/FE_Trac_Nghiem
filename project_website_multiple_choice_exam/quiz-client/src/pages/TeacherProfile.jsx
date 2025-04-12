import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const teacherId = "GV002";
  const API_GIANGVIEN = "/api/giaovien";

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(API_GIANGVIEN, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        });
        const selected = res.data.find((t) => t.id_giaovien === teacherId);
        if (selected) {
          setTeacher(selected);
          localStorage.setItem("giaovien", JSON.stringify(selected));
        }
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu từ giáo viên", error);
      }
    };
    fetchTeacher();
  }, []);

  if (!teacher)
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <div className="flex items-center gap-6">
        <img
          src={`https://i.pravatar.cc/150?u=${teacher.id_giaovien}`}
          alt="avatar"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{teacher.ten_giaovien}</h2>
          <p>
            <strong>Email:</strong> {teacher.email_gv}
          </p>
          <p>
            <strong>SĐT:</strong> {teacher.phone_gv}
          </p>
          <p>
            <strong>Môn dạy:</strong> {teacher.monhoc.tenmonhoc}
          </p>
          <p>
            <strong>Lớp dạy:</strong> {teacher.lopdaychinh}
          </p>
          <button
            className="bg-blue-500 text-white rounded hover:bg-blue-600 px-4 py-2 mt-4"
            onClick={() => navigate("/profile/edit-teacher")}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
