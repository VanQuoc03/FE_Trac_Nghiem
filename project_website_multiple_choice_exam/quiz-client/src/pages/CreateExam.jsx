import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateExam = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("Tin học");
  const [duration, setDuration] = useState("10 phút");
  const [numQuestions, setNumQuestions] = useState(5);  
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("");

  

  const handleCreateExam = () => {
    navigate("/form-question", { state: { numQuestions } });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log = {
      title,
      description,
      subject,
      duration,
      numQuestions,
      startTime,
    };
    alert("Create exam success!");
  };
  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-md w-[90%] mx-auto mt-10">
      <h2 className="text-4xl flex justify-center m-5 font-medium">Tạo bài thi</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" action="">
        <div>
          <label className="block font-medium" htmlFor="">Tiêu đề</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium" htmlFor="">Môn học</label>
          <select
            className="w-full border border-gray-300 p-2 rounded-md"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="Tin hoc">Tin hoc</option>
            <option value="Toán">Toán</option>
            <option value="Vật lý">Vật lý</option>
            <option value="Văn">Văn</option>
          </select>
        </div>
        <div>
          <label className="block font-medium" htmlFor="">Ghi chú</label>
          <textarea
            name=""
            id=""
            className=" w-full border border-gray-300 p-2 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
            <label className="block font-medium" htmlFor="">Thời gian thi</label>
            <select className="w-full border border-gray-300 p-2 rounded-md"
            value={duration}
            onChange={(e)=> setDuration(e.target.value)}>
                <option value="10 phút">10 phút</option>
                <option value="15 phút">15 phút</option>
                <option value="20 phút">20 phút</option>
                <option value="30 phút">30 phút</option>
            </select>
        </div>
        <div>
            <label className="block font-medium" htmlFor="">Số câu hỏi</label>
            <input type="number" className="w-full border border-gray-300 p-2 rounded-md"
            value={numQuestions}
            onChange={(e)=> setNumQuestions(e.target.value)}
            min={5} required
            />
        </div>
        <div>
            <label className="block font-medium" htmlFor="">Thời gian bắt đầu</label>
            <input type="datetime-local" 
            className="w-full border border-gray-300 p-2 rounded-md"
            value={startTime}
            onChange={(e)=>setStartTime(e.target.value)}
            required/>
        </div>
        <div className="flex justify-center col-span-2">
            <button className="h-10 w-full bg-slate-100 border border-gray-300 rounded-md hover:bg-green-500"
            onClick={handleCreateExam}>Tạo câu hỏi</button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
