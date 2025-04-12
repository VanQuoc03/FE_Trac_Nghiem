
import React from 'react'
import { CiClock2 } from "react-icons/ci";  
import { useNavigate } from 'react-router-dom';
const examsToday = [
  {
    id: 1,
    title: "Practice Set 2023 TOEIC Test 10",
    startTime: "12:30",
    endTime: "13:30",
    duration: "40 phút",
  },
  {
    id: 2,
    title: "Practice Set 2023 TOEIC Test 11",
    startTime: "14:00",
    endTime: "15:00",
    duration: "60 phút",
  },
  {
    id: 3,
    title: "Practice Set 2023 TOEIC Test 10",
    startTime: "12:30",
    endTime: "13:30",
    duration: "40 phút",
  },
  {
    id: 4,
    title: "Practice Set 2023 TOEIC Test 10",
    startTime: "12:30",
    endTime: "13:30",
    duration: "40 phút",
  },
  {
    id: 5,
    title: "Practice Set 2023 TOEIC Test 18",
    startTime: "12:30",
    endTime: "13:30",
    duration: "40 phút",
  },
  
];
const completedExams = [
  { title: "Bài Thi Toán 1", date: "01/03/2025", score: "8.5" },
  { title: "Bài Thi Văn 1", date: "05/03/2025", score: "9.0" },
  { title: "Bài Thi Lý 1", date: "10/03/2025", score: "7.0" },
];
const latestExam = {id: 1, title: "Bài thi hóa 1", date: "15/03/2025"};
const ExamCard = ({ id, title, startTime, endTime, duration, score, date, button})=>{
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-md w-[250px] h-[100%] box border m-2">
  <h3 className="font-bold">{title}</h3>
  <div>
    {startTime && endTime && duration &&(
      <>
        <p className="p-2 flex"><CiClock2 className="m-1"/> <strong>{duration}</strong></p>
        <p className="p-2 "> Thời gian bắt đầu:<strong>{startTime}</strong></p>
        <p className="p-2">Thời gian kết thúc: <strong>{endTime}</strong></p>
      </>
    )}
    {date && <p>Ngày thi: <strong>{date}</strong></p>}
    {score && <p>Điểm: <strong>{score}</strong></p>}
  </div>
  <div className="flex justify-center mb-3">
  {button && (
    <button className="mt-3 bg-white px-4 py-2 rounded-lg hover:bg-slate-300 w-[90%] text-black border-2 border-solid"
    onClick={()=> navigate(`/exam/${id}`)}>
    {button}
  </button>
  )}
  </div>
  
</div>
  )
}

const HomePage = () => {

  return (
    <div className="bg-gray-100 min-h-screen p-5 w-[100%]">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="font-bold text-2xl mb-4">Lịch thi hôm nay</h2>
      <div className="flex flex-wrap w-full gap-4 justify-start">
        {examsToday.map((exam)=>(
          <ExamCard key={exam.id} {...exam} button="Làm bài"></ExamCard>
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-4 ">Các bài đã thi</h2>
      <div className="flex flex-wrap gap-4 justify-start  ">
        {completedExams.map((exam, index)=>(
          <ExamCard key={index}{...exam}></ExamCard>
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-4">Bài thi mới nhất</h2>
      <div className="">
        <ExamCard {...latestExam} button="Chi tiết"/>
      </div>
    </div>
    </div>
  );
}

export default HomePage

































// import React, { useEffect, useState } from 'react';
// import { CiClock2 } from "react-icons/ci";
// import { useNavigate } from 'react-router-dom';

// const API_BAITHI = "/api/baithi";

// const ExamCard = ({ id, title, date, score, button }) => {
//   const navigate = useNavigate();
//   return (
//     <div className="bg-white rounded-xl shadow-md w-[250px] h-[100%] box border m-2 p-4">
//       <h3 className="font-bold">{title}</h3>
//       <div>
//         {date && <p>Ngày thi: <strong>{new Date(date).toLocaleString()}</strong></p>}
//         {score !== undefined && <p>Điểm: <strong>{score}</strong></p>}
//       </div>
//       {button && (
//         <div className="flex justify-center mt-3">
//           <button
//             className="bg-white px-4 py-2 rounded-lg hover:bg-slate-300 w-[90%] text-black border-2 border-solid"
//             onClick={() => navigate(`/exam/${id}`)}
//           >
//             {button}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const HomePage = () => {
//   const [exams, setExams] = useState([]);
//   const [completedExams, setCompletedExams] = useState([]);
//   const [latestExam, setLatestExam] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(API_BAITHI, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           mode: "cors",
//         });
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         const data = await response.json();
//         console.log("Dữ liệu API nhận được:", data);

//         if (!Array.isArray(data)) {
//           console.error("API không trả về mảng!");
//           return;
//         }

//         const examsToday = data.filter(exam => (exam.trangthai || "").trim() === "danglam" || (exam.trangthai || "").trim() === "");
//         const completed = data.filter(exam => (exam.trangthai || "").trim() === "hoanthanh");
//         completed.sort((a, b) => new Date(b.ngaylam) - new Date(a.ngaylam));

//         setExams(examsToday);
//         setCompletedExams(completed);
//         setLatestExam(completed[0] || null);
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu từ API:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="text-center text-xl font-bold mt-10">Đang tải dữ liệu...</div>;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen p-5 w-[100%]">
//       <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
//         <h2 className="font-bold text-2xl mb-4">Lịch thi hôm nay</h2>
//         <div className="flex flex-wrap w-full gap-4 justify-start">
//           {exams.length > 0 ? (
//             exams.map((exam) => (
//               <ExamCard key={exam.id_baithi} id={exam.id_baithi} title={`Bài thi ${exam.id_dethi}`} date={exam.ngaylam} button="Làm bài" />
//             ))
//           ) : (
//             <p>Không có bài thi nào hôm nay.</p>
//           )}
//         </div>

//         <h2 className="text-2xl font-bold mb-4">Các bài đã thi</h2>
//         <div className="flex flex-wrap gap-4 justify-start">
//           {completedExams.length > 0 ? (
//             completedExams.map((exam, index) => (
//               <ExamCard key={index} id={exam.id_baithi} title={`Bài thi ${exam.id_dethi}`} date={exam.ngaylam} score={exam.diemthi} />
//             ))
//           ) : (
//             <p>Chưa có bài thi nào được hoàn thành.</p>
//           )}
//         </div>

//         {latestExam && (
//           <>
//             <h2 className="text-2xl font-bold mb-4">Bài thi mới nhất</h2>
//             <div>
//               <ExamCard id={latestExam.id_baithi} title={`Bài thi ${latestExam.id_dethi}`} date={latestExam.ngaylam} score={latestExam.diemthi} button="Chi tiết" />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;
