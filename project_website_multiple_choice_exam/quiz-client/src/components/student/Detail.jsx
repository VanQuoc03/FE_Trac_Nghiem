import { useParams, useLocation } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Detail() {
  const { id } = useParams();
  const { state } = useLocation(); // Get navigation state
  const { databaithi } = useAppContext();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [error, setError] = useState("");

  // Get studentInfo from navigation state (passed from ViewSv)
  const studentInfo = state?.studentInfo;

  // Find the exam in databaithi
  const baithi = databaithi.find((item) => item.id_baithi.toString() === id);

  // Fetch additional student details if needed
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!studentInfo?.id_hocsinh) {
        setError("Không có thông tin học sinh.");
        setLoadingStudent(false);
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(`https://quiz-api-34vp.onrender.com/api/hocsinh/${studentInfo.id_hocsinh}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });
        setStudentDetails(response.data);
      } catch (err) {
        console.error("Error fetching student details:", err);
        setError("Không thể tải thông tin học sinh.");
      } finally {
        setLoadingStudent(false);
      }
    };

    fetchStudentDetails();
  }, [studentInfo]);

  if (!baithi) {
    return <p className="text-center text-red-500">Không tìm thấy bài thi!</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Chi tiết bài thi</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p>
          <strong>ID:</strong> {baithi.id_baithi}
        </p>
        <p>
          <strong>ID Học Sinh:</strong> {studentInfo?.id_hocsinh || "Không có"}
        </p>
        {loadingStudent ? (
          <p>Đang tải thông tin học sinh...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          studentDetails && (
            <>
              <p>
                <strong>Tên Học Sinh:</strong> {studentDetails.ten_hocsinh || "Không có"}
              </p>
              <p>
                <strong>Email:</strong> {studentDetails.email || "Không có"}
              </p>
            </>
          )
        )}
        <p>
          <strong>ID Đề Thi:</strong> {baithi.dethi?.id_dethi}
        </p>
        <p>
          <strong>Ngày Làm:</strong> {baithi.ngaylam}
        </p>
        <p>
          <strong>Trạng Thái:</strong> {baithi.trangthai}
        </p>
        <p>
          <strong>Điểm Thi:</strong> {baithi.diemthi}
        </p>
      </div>

      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Đánh giá bài thi</h2>
        {submitted ? (
          <div className="text-center text-green-600">
            <p>Cảm ơn bạn đã đánh giá!</p>
            <p>
              <strong>Đánh giá:</strong> {rating} sao
            </p>
            <p>
              <strong>Nhận xét:</strong> {comment}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium">Chọn số sao:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
              >
                <option value="0">Chọn số sao</option>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Nhận xét:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded resize-none"
                rows="3"
                placeholder="Nhập nhận xét của bạn..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Gửi đánh giá
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
