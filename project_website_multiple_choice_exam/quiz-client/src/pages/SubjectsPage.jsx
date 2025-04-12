import React, { use, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdSsidChart } from "react-icons/md";
import { PiWarningCircleThin } from "react-icons/pi";
const API_MONHOC = "/api/monhoc";

const SubjectsPage = () => {
  const giaovien = JSON.parse(localStorage.getItem("giaovien"));
  const [monHocList, setMonhocList] = useState([]);
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const itemPerPage = 4;
  const getTenMonHoc = (id_monhoc) => {
    const found = monHocList.find((m) => m.id_monhoc === id_monhoc);
    return found ? found.tenmonhoc : "Không rõ";
  };
  const filteredExam = exams.filter((item) => {
    const mon = item.monhoc?.tenmonhoc;
    return (
      (selectedSubject === "Tất cả" || mon === selectedSubject) &&
      item.giaovien?.id_giaovien === giaovien?.id_giaovien
    );
  });

  useEffect(() => {
    const fetchMonHoc = async () => {
      try {
        const res = await fetch(API_MONHOC);
        const data = await res.json();
        setMonhocList(data);
      } catch (error) {
        console.log("Lỗi khi lấy bài thi", error);
      }
    };
    fetchMonHoc();
  }, []);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch("/api/dethi");
        const data = await res.json();
        setExams(data);
      } catch (error) {
        console.log("Lỗi khi lấy bài thi", error);
      }
    };
    fetchExam();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(API_MONHOC, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        });
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setSubjects(data.map((item) => item.tenmonhoc));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[80%] mx-auto mt-11">
      <div className="flex justify-between">
        <div className=" w-[75%]">
          <h2 className="font-medium text-3xl mb-6">Thư viên đề thi</h2>
          <div className="flex space-x-4 mb-8">
            <button
              className={`px-4 py-2 rounded-md ${
                selectedSubject === "Tất cả"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedSubject("Tất cả")}
            >
              Tất cả
            </button>
            {filteredSubjects.map((subject, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md ${
                  selectedSubject === subject
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <input
              className="border-2 rounded-l-md w-[100%] h-[35px] pl-2"
              type="text"
              placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
              value={searchTerm}
              onClick={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-green-500 w-[100px] rounded-r-md text-white">
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="bg-white justify-center w-[25%] h-[320px] box rounded-xl m-4 shadow-md">
          <div className="flex flex-wrap justify-center relative mt-4">
            <FaUserCircle className=" size-14 " />
            <div className="absolute mr-16 ">
              <p className="absolute w-[100px] mt-12 ">Teacher 2</p>
            </div>
          </div>

          <hr className="mt-7 border-gray-400" />
          <div className="flex italic  m-4">
            <PiWarningCircleThin className="size-6" />
            <p className="text-sm">
              Bạn chưa tạo mục tiêu cho quá trình luyện thi của mình. Tạo ngay
            </p>
          </div>
          <div className="flex justify-center">
            <button className="text-white bg-green-500 rounded-full w-[90%] justify-center flex items-center h-[35px]">
              <MdSsidChart />
              Thống kê kết quả
            </button>
          </div>
        </div>
      </div>
      <div
        className="flex items-center flex-wrap justify-center border-t-2 border-gray-200 mt-8
      "
      >
        {filteredExam.map((exam, index) => (
          <div
            key={exam.id_dethi}
            className="w-[20%] h-[200px] justify-between bg-white p-4 rounded-md m-4 flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          >
            <h3 className="font-bold">{exam.id_dethi}</h3>
            <h3 className="font-bold">{exam.monhoc.tenmonhoc}</h3>
            <p className="font-semibold">{exam.giaovien?.ten_giaovien}</p>
            <p>Thời gian: {exam.thoigianthi} phút</p>
            <span className="w-[35%] text-sm rounded-full flex justify-center bg-green-500 text-white ">
              #{exam.monhoc?.tenmonhoc}
            </span>
          </div>
        ))}
      </div>
      {/* <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 mx-1 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default SubjectsPage;
