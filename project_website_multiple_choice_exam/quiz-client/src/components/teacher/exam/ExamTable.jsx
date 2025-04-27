import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExamTable = () => {
  const [exams, setExams] = useState(null);
  const API_BAITHI = "https://quiz-api-34vp.onrender.com/api/baithi";
  const [selectedTestId, setSelectedTestId] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [testOptions, setTestOptions] = useState([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(API_BAITHI);
        setExams(res.data);
        const testMap = {};
        res.data.forEach((item) => {
          const id = item.dethi.id_dethi;
          if (!testMap[id]) testMap[id] = [];
          testMap[id].push(item);
        });
        const options = Object.keys(testMap).map((id) => ({
          id,
          count: testMap[id].length,
        }));
        setTestOptions(options);
      } catch (error) {
        console.log("Lỗi khi tải dữ liệu bài thi", error);
      }
    };
    fetchExam();
  }, []);

  useEffect(() => {
    if (!selectedTestId) return;
    const result = exams.filter((e) => e.dethi.id_dethi === selectedTestId);
    setFiltered(result);
  }, [selectedTestId, exams]);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Truy xuất bài thi theo đề</h1>
      <div className="mb-6">
        <label className="font-semibold mr-3" htmlFor="">
          Chọn đề thi:
        </label>
        <select
          name=""
          id=""
          value={selectedTestId}
          onChange={(e) => setSelectedTestId(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">-- Chọn đề thi --</option>
          {testOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.id}({opt.count} bài)
            </option>
          ))}
        </select>
      </div>
      {filtered.length > 0 ? (
        <table className="w-full border ">
          <thead className="bg-gray-300">
            <tr className="">
              <th className="border p-2">STT</th>
              <th className="border p-2">Học sinh</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Ngày làm</th>
              <th className="border p-2">Điểm</th>
              <th className="border p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id_hocsinh} className="text-center">
                <th className="border p-2">{index + 1}</th>
                <th className="border p-2">{item.hocsinh.ten_hocsinh}</th>
                <th className="border p-2">{item.hocsinh.email}</th>
                <th className="border p-2">
                  {new Date(item.ngaylam).toLocaleDateString("vi-VN")}
                </th>
                <th className="border p-2 font-semibold">{item.diemthi}</th>
                <th
                  className={`border p-2 ${
                    item.trangthai === "hoanthanh"
                      ? "text-green-500"
                      : "text-red-500"
                  } font-medium`}
                >
                  {item.trangthai}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedTestId ? (
        <p>Không có bài thi nào cho đề này</p>
      ) : null}
    </div>
  );
};

export default ExamTable;
