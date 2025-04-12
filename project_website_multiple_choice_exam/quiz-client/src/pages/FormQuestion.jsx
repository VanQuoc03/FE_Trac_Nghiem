import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdUpload } from "react-icons/md";
const FormQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { numQuestions = 5 } = location.state || {};
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
  const [isComfirmModalOpen, setIsComfirmModalOpen] = useState(false);
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

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-md w-[90%] mx-auto mt-10">
      <h2 className="font-medium text-3xl flex justify-center m-6">
        Tạo Câu hỏi bài thi
      </h2>
      <div className="flex h-[40px] mb-4">
        <button className="text-blue-700 flex items-center border-2 hover:bg-blue-700 hover:text-white border-blue-700 w-[130px] rounded-md mr-4">
          <MdUpload />
          Tải lên file doc
        </button>
        <button className="text-red-600 flex items-center border-2 hover:bg-red-700 hover:text-white border-red-600 w-[130px] rounded-md mr-4">
          <MdUpload />
          Tải lên file pdf
        </button>
        <button className="text-green-700 hover:bg-green-700 hover:text-white flex items-center border-2 border-green-600 w-[130px] rounded-md mr-4">
          <MdUpload />
          Tải lên file xlsx
        </button>
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
                setSelectedSmallQuestion(index), setSelectedLongQuestion(null);
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
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
        <button
          className="bg-[#D9B384] hover:bg-[#f5c896] text-black p-2 rounded-md mt-4 ml-4 w-[50%]"
          onClick={() => setIsComfirmModalOpen(true)}
        >
          Lưu tất cả câu hỏi
        </button>
      </div>
      {(selectedLongQuestion !== null || selectedSmallQuestion !== null) && (
        <div className="fixed top-0 left-0  w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
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
                <input
                  className="w-full border border-gray-300 p-2 rounded-md"
                  key={index}
                  type="text"
                  value={opt}
                  placeholder={`Nhập đáp án ${index + 1}`}
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
              ))}
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
      {isComfirmModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-[30%]">
            <div className=" p-4">
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
                onClick={() => setIsComfirmModalOpen(false)}
              >
                Không
              </button>
              <button
                className="bg-blue-500 w-[10%] mr-3 rounded-md h-[40px] text-white"
                onClick={() => navigate("/create-student-list")}
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
