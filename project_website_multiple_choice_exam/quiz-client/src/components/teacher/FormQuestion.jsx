import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdUpload } from "react-icons/md";
import axios from "axios";

const FormQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { numQuestions = 5, examData } = location.state || {};
  const [questions, setQuestions] = useState(
    Array.from({ length: numQuestions }, (_, i) => ({
      id: i + 1,
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    }))
  );
  const [selectedLongQuestion, setSelectedLongQuestion] = useState(null);
  const [selectedSmallQuestion, setSelectedSmallQuestion] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "teacher") {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    if (!examData || !examData.id_dethi || !examData.id_monhoc) {
      setError("Dữ liệu đề thi không hợp lệ. Vui lòng tạo lại.");
      navigate("/teacher/create-exam");
    }
  }, [navigate, examData]);

  const handleChanged = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleSaveQuestions = async () => {
    for (const q of questions) {
      if (!q.text || !q.correctAnswer || !q.options.every((opt) => opt)) {
        console.log("Validation failed: Incomplete question", q);
        alert("Mỗi câu hỏi phải có nội dung, đáp án đúng, và 4 lựa chọn đầy đủ.");
        return;
      }
      if (!q.options.includes(q.correctAnswer)) {
        console.log("Validation failed: Correct answer not in options", {
          correctAnswer: q.correctAnswer,
          options: q.options,
        });
        alert("Đáp án đúng phải nằm trong các lựa chọn.");
        return;
      }
    }

    const payload = {
      examId: examData.id_dethi,
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        id_monhoc: examData.id_monhoc,
      })),
    };

    console.log("Sending payload to /api/questions:", payload);

    try {
      const response = await fetch("https://quiz-api-34vp.onrender.com/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("Response from /api/questions:", responseData);

      if (response.ok) {
        setIsConfirmModalOpen(true);
      } else {
        console.error("Error from /api/questions:", responseData);
        alert(responseData.message || "Lỗi khi lưu câu hỏi!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error.message);
      alert(`Lỗi khi lưu câu hỏi: ${error.message}`);
    }
  };

  const handleFileUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) return;

    if (
      (fileType === "docx" && !file.name.endsWith(".docx")) ||
      (fileType === "pdf" && !file.name.endsWith(".pdf"))
    ) {
      alert(`Vui lòng chọn file ${fileType.toUpperCase()}!`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("examId", examData.id_dethi);
    formData.append("id_monhoc", examData.id_monhoc);

    try {
      const response = await fetch("https://quiz-api-34vp.onrender.com/api/upload-questions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Upload và lưu câu hỏi thành công!");
        setIsConfirmModalOpen(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Lỗi khi upload file!");
      }
    } catch (error) {
      console.error("Lỗi khi upload file:", error);
      alert("Lỗi khi upload file!");
    }
  };

  const handleCreateStudentList = async () => {
    try {
      // Set is_restricted = 1 for the exam
      await axios.post(
        `https://quiz-api-34vp.onrender.com/api/dethi/${examData.id_dethi}/students`,
        {
          is_restricted: 1,
          allowed_students: [],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigate("/teacher/create-student-list", {
        state: { examData: { ...examData, is_restricted: 1 } },
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đề thi:", error);
      alert(error.response?.data?.message || "Lỗi khi chuyển sang trang tạo danh sách học sinh!");
    }
  };

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-md w-[90%] mx-auto mt-10">
      <h2 className="font-medium text-3xl flex justify-center m-6">
        Tạo Câu hỏi bài thi
      </h2>
      <div className="flex h-[40px] mb-4">
        <label className="text-blue-700 flex items-center border-2 hover:bg-blue-700 hover:text-white border-blue-700 w-[130px] rounded-md mr-4 cursor-pointer">
          <MdUpload className="mr-1" />
          Tải lên file doc
          <input
            type="file"
            accept=".docx"
            hidden
            onChange={(e) => handleFileUpload(e, "docx")}
          />
        </label>
        <label className="text-red-600 flex items-center border-2 hover:bg-red-700 hover:text-white border-red-600 w-[130px] rounded-md mr-4 cursor-pointer">
          <MdUpload className="mr-1" />
          Tải lên file pdf
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => handleFileUpload(e, "pdf")}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {questions.map((q, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedLongQuestion(index);
                setSelectedSmallQuestion(null);
              }}
              className={`border p-4 rounded-md shadow-md text-left w-full ${
                selectedLongQuestion === index ? "bg-blue-200" : ""
              } `}
            >
              Câu hỏi {index + 1}
            </button>
          ))}
        </div>
        <div
          className="grid grid-cols-5 gap-4 w-[100%] p-4 h-[400px] overflow-y-auto rounded-md
        shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
        >
          {questions.map((q, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedSmallQuestion(index);
                setSelectedLongQuestion(null);
              }}
              className={`box w-[50px] h-[50px] border p-4 rounded-md shadow-sm text-center 
            ${selectedSmallQuestion === index ? "bg-blue-200" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="bg-[#D9B384] hover:bg-[#f5c896] text-black p-2 rounded-md mt-4 w-[50%]"
          onClick={() => navigate("/teacher/create-exam")}
        >
          Quay lại
        </button>
        <button
          className="bg-[#D9B384] hover:bg-[#f5c896] text-black p-2 rounded-md mt-4 ml-4 w-[50%]"
          onClick={handleSaveQuestions}
        >
          Lưu tất cả câu hỏi
        </button>
      </div>
      {(selectedLongQuestion !== null || selectedSmallQuestion !== null) && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white p-4 rounded-lg shadow-md w-[700px]">
            <button
              className="absolute top-2 right-2"
              onClick={() => {
                setSelectedLongQuestion(null);
                setSelectedSmallQuestion(null);
              }}
            >
              ✖
            </button>
            <h3 className="text-2xl font-medium mb-3">
              Câu hỏi{" "}
              {(selectedLongQuestion !== null
                ? selectedLongQuestion
                : selectedSmallQuestion) + 1}
            </h3>
            <hr className="border-gray-200 w-full" />
            <textarea
              className="w-full border border-gray-300 p-4 rounded-md mt-4"
              placeholder={`Nhập nội dung câu hỏi ${
                (selectedLongQuestion !== null
                  ? selectedLongQuestion
                  : selectedSmallQuestion) + 1
              }`}
              value={
                questions[
                  selectedLongQuestion !== null
                    ? selectedLongQuestion
                    : selectedSmallQuestion
                ]?.text || ""
              }
              onChange={(e) =>
                handleChanged(
                  selectedLongQuestion !== null
                    ? selectedLongQuestion
                    : selectedSmallQuestion,
                  "text",
                  e.target.value
                )
              }
            ></textarea>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {questions[
                selectedLongQuestion !== null
                  ? selectedLongQuestion
                  : selectedSmallQuestion
              ].options.map((opt, index) => (
                <div key={index} className="flex items-center">
                  <input
                    className="w-full border border-gray-300 p-2 rounded-md"
                    type="text"
                    value={opt}
                    placeholder={`Nhập đáp án ${String.fromCharCode(65 + index)}`}
                    onChange={(e) =>
                      handleOptionChange(
                        selectedLongQuestion !== null
                          ? selectedLongQuestion
                          : selectedSmallQuestion,
                        index,
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
              <div className="mt-4">
                <label className="block mb-1 font-medium">Đáp án đúng</label>
                <input
                  className="w-full border border-gray-300 p-2 rounded-md"
                  type="text"
                  value={
                    questions[
                      selectedLongQuestion !== null
                        ? selectedLongQuestion
                        : selectedSmallQuestion
                    ].correctAnswer
                  }
                  placeholder="Nhập đáp án đúng"
                  onChange={(e) =>
                    handleChanged(
                      selectedLongQuestion !== null
                        ? selectedLongQuestion
                        : selectedSmallQuestion,
                      "correctAnswer",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <button
              className="bg-blue-400 hover:bg-blue-500 w-full text-white p-2 rounded-md mt-4"
              onClick={() => {
                setSelectedLongQuestion(null);
                setSelectedSmallQuestion(null);
              }}
            >
              Xong
            </button>
          </div>
        </div>
      )}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-[30%]">
            <div className="p-4">
              <h3 className="text-xl mb-2">Thông báo</h3>
              <hr />
              <p className="flex justify-center">
                Đề thi đã được tạo thành công!
              </p>
              <p className="">
                Bạn có muốn <b>tạo danh sách học sinh </b> dành riêng cho đề thi
                không?
              </p>
            </div>
            <hr className="m-5" />
            <div className="flex justify-end mb-3">
              <button
                className="bg-gray-600 w-[15%] mr-2 rounded-md text-white"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  navigate("/teacher"); // Navigate to teacher dashboard
                }}
              >
                Không
              </button>
              <button
                className="bg-blue-500 w-[10%] mr-3 rounded-md h-[40px] text-white"
                onClick={handleCreateStudentList}
              >
                Có
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormQuestion;
