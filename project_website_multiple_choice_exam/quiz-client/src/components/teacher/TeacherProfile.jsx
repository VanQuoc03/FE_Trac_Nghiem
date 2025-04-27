import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const API_GIANGVIEN = "/api/giaovien";

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user);

    if (!user) {
      console.log("No user found, redirecting to /login");
      navigate("/login");
      return;
    }
    if (user.role !== "teacher") {
      console.log(`Invalid role: ${user.role}, redirecting to /login`);
      navigate("/login");
      return;
    }
    if (!user.token) {
      console.log("No token found, redirecting to /login");
      navigate("/login");
      return;
    }

    // Extract ID from token if user.id is missing
    let teacherId = user.id;
    if (!teacherId) {
      try {
        const tokenPayload = JSON.parse(atob(user.token.split(".")[1]));
        teacherId = tokenPayload.id_giaovien;
        console.log("Extracted teacherId from token:", teacherId);
        // Update user object and localStorage
        user.id = teacherId;
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Error decoding token:", error);
        console.log("Cannot extract ID from token, redirecting to /login");
        navigate("/login");
        return;
      }
    }

    if (!teacherId) {
      console.log("No user ID found after token extraction, redirecting to /login");
      navigate("/login");
      return;
    }

    const fetchTeacher = async () => {
      try {
        console.log(`Fetching teacher data for ID: ${teacherId} with token: ${user.token}`);
        const res = await axios.get(`${API_GIANGVIEN}/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.data) {
          throw new Error("Không nhận được dữ liệu từ server");
        }

        console.log("Teacher data received:", res.data);
        setTeacher(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giáo viên:", error);
        const errorMessage =
          error.response?.status === 401
            ? "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."
            : error.response?.data?.message ||
              "Không thể tải thông tin giáo viên. Vui lòng thử lại sau.";
        console.log("Error message:", errorMessage);
        setError(errorMessage);
        if (error.response?.status === 401) {
          console.log("401 Unauthorized, clearing localStorage and redirecting to /login");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!teacher) {
    return <div className="text-center mt-10">Không có dữ liệu giáo viên.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-24">
      <div className="flex items-center gap-6">
        <img
          src={`https://i.pravatar.cc/150?u=${teacher.id_giaovien}`}
          alt="Avatar giáo viên"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">
            {teacher.ten_giaovien || "Giáo viên"}
          </h2>
          <p>
            <strong>ID Giáo viên:</strong> {teacher.id_giaovien || "Không có"}
          </p>
          <p>
            <strong>Tên đăng nhập:</strong>{" "}
            {teacher.tendangnhap_gv || "Không có"}
          </p>
          <p>
            <strong>Email:</strong> {teacher.email_gv || "Không có"}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {teacher.phone_gv || "Không có"}
          </p>
          <p>
            <strong>Môn dạy:</strong> {teacher.monhoc?.tenmonhoc || "Không rõ"}
          </p>
          <p>
            <strong>Lớp dạy:</strong> {teacher.lopdaychinh || "Không có"}
          </p>
          <button
            className="bg-[#C7A36F] text-white rounded hover:bg-[#8f6427] px-4 py-2 mt-4"
            onClick={() => navigate("/teacher/profile/edit-teacher")}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;