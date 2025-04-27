import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinExam = () => {
  const navigate = useNavigate();
  const [allExams, setAllExams] = useState([]);
  const [accessibleIds, setAccessibleIds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(null);

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Không hợp lệ';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
  };

  const convertToAsiaHoChiMinh = (utcDate) => {
    return new Date(utcDate.getTime() + 7 * 60 * 60 * 1000); // Cộng 7 giờ
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.thoigianbatdau);
    const end = new Date(exam.thoigianketthuc);
    const nowLocal = convertToAsiaHoChiMinh(now);
    const startLocal = convertToAsiaHoChiMinh(start);
    const endLocal = convertToAsiaHoChiMinh(end);

    if (isNaN(startLocal.getTime()) || isNaN(endLocal.getTime())) {
      return { status: 'invalid', message: 'Thời gian không hợp lệ' };
    }
    if (nowLocal < startLocal) {
      return { status: 'not_started', message: `Chưa bắt đầu (Bắt đầu lúc ${formatDate(start)})` };
    }
    if (nowLocal > endLocal) {
      return { status: 'ended', message: `Đã hết hạn (Kết thúc lúc ${formatDate(end)})` };
    }
    return { status: 'active', message: 'Đang diễn ra' };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'student') return navigate('/login');

        const [accessRes, allExamRes] = await Promise.all([
          axios.get('https://quiz-api-34vp.onrender.com/api/accessible-exams', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get('/api/dethi', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        setAccessibleIds(accessRes.data.examIds);
        setAllExams(allExamRes.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Không thể tải dữ liệu: ' + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleJoin = async (exam) => {
    setError('');
    setIsChecking(exam.id_dethi);

    const now = new Date();
    const start = new Date(exam.thoigianbatdau);
    const end = new Date(exam.thoigianketthuc);
    const nowLocal = convertToAsiaHoChiMinh(now);
    const startLocal = convertToAsiaHoChiMinh(start);
    const endLocal = convertToAsiaHoChiMinh(end);

    if (nowLocal < startLocal || nowLocal > endLocal) {
      setError(`Đề thi không hợp lệ theo thời gian.`);
      setIsChecking(null);
      return;
    }

    navigate(`/join-exam/take/${exam.id_dethi}`);
  };

  if (loading) return <div className='text-center p-6'>Đang tải...</div>;
  if (error) return <div className='text-center p-6 text-red-500'>{error}</div>;

  const personalExams = allExams.filter(
    (e) => e.is_restricted === 1 && accessibleIds.includes(e.id_dethi)
  );
  const publicExams = allExams.filter((e) => e.is_restricted === 0);

  const renderExamList = (exams, title) => (
    <div className='mb-10'>
      <h2 className='text-xl font-semibold mb-4'>{title}</h2>
      {exams.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {exams.map((exam) => {
            const { status, message } = getExamStatus(exam);
            const isDisabled = status !== 'active' || isChecking === exam.id_dethi;

            return (
              <div key={exam.id_dethi} className='bg-white p-4 rounded-lg shadow hover:shadow-2xl hover:shadow-gray-800 transform hover:scale-105 transition-all'>
                <h3 className='text-lg font-bold'>{exam.tendethi}</h3>
                <p><strong>Môn:</strong> {exam.monhoc.tenmonhoc}</p>
                <p><strong>Thời gian bắt đầu:</strong> {formatDate(exam.thoigianbatdau)}</p>
                <p><strong>Thời gian kết thúc:</strong> {formatDate(exam.thoigianketthuc)}</p>
                <p><strong>Thời gian làm bài:</strong> {exam.thoigianthi} phút</p>
                <p><strong>Trạng thái:</strong> {message}</p>
                <button
                  className={`mt-2 px-4 py-2 rounded text-white ${isDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  onClick={() => handleJoin(exam)}
                  disabled={isDisabled}
                >
                  {isChecking === exam.id_dethi ? 'Đang kiểm tra...' : 'Tham Gia Thi'}
                </button>
              </div>

            );
          })}
        </div>
      ) : (
        <p className='text-gray-500'>Không có đề thi nào.</p>
      )}
    </div>
  );

  return (
    <div className='p-6 max-w-6xl mx-auto pt-24'>
      <h1 className='text-2xl font-bold text-center mb-8'>Lựa Chọn Đề Thi</h1>
      {renderExamList(personalExams, 'Bài thi cá nhân')}
      {renderExamList(publicExams, 'Bài thi chung')}
    </div>
  );
};

export default JoinExam;
