import React, { useState, useEffect } from "react";

const DeThiManager = ({ apiUrl }) => {
  const [dethiList, setDethiList] = useState([]);
  const [monhocList, setMonhocList] = useState([]);
  const [newDethi, setNewDethi] = useState({
    id_dethi: "",
    id_giaovien: "",
    id_monhoc: "",
    tendethi: "",
    ngay_tao: "",
    thoigianthi: "",
    thoigianbatdau: "",
    thoigianketthuc: "",
    trangthai: "",
  });
  const [editingDethi, setEditingDethi] = useState(null);

  // Lấy danh sách đề thi
  const fetchDethi = async () => {
    try {
      const response = await fetch(`${apiUrl}/dethi`);
      const data = await response.json();
      setDethiList(data);
    } catch (error) {
      console.error("Error fetching dethi:", error);
    }
  };

  // Lấy danh sách môn học
  const fetchMonhoc = async () => {
    try {
      const response = await fetch(`${apiUrl}/monhoc`);
      const data = await response.json();
      setMonhocList(data);
    } catch (error) {
      console.error("Error fetching monhoc:", error);
    }
  };

  useEffect(() => {
    fetchDethi();
    fetchMonhoc();
  }, []);

  // Thêm đề thi
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/dethi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDethi),
      });
      if (response.ok) {
        fetchDethi();
        setNewDethi({
          id_dethi: "",
          id_giaovien: "",
          id_monhoc: "",
          tendethi: "",
          ngay_tao: "",
          thoigianthi: "",
          thoigianbatdau: "",
          thoigianketthuc: "",
          trangthai: "",
        });
      }
    } catch (error) {
      console.error("Error adding dethi:", error);
    }
  };

  // Sửa đề thi
  const handleEdit = (dt) => {
    setEditingDethi(dt);
    setNewDethi(dt);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/dethi/${editingDethi.id_dethi}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDethi),
      });
      if (response.ok) {
        fetchDethi();
        setEditingDethi(null);
        setNewDethi({
          id_dethi: "",
          id_giaovien: "",
          id_monhoc: "",
          tendethi: "",
          ngay_tao: "",
          thoigianthi: "",
          thoigianbatdau: "",
          thoigianketthuc: "",
          trangthai: "",
        });
      }
    } catch (error) {
      console.error("Error updating dethi:", error);
    }
  };

  // Xóa đề thi
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/dethi/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchDethi();
      }
    } catch (error) {
      console.error("Error deleting dethi:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Danh Sách Đề Thi</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {editingDethi ? "Sửa Đề Thi" : "Thêm Đề Thi"}
        </h2>
        <form onSubmit={editingDethi ? handleUpdate : handleAdd}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="ID Đề Thi"
              value={newDethi.id_dethi}
              onChange={(e) =>
                setNewDethi({ ...newDethi, id_dethi: e.target.value })
              }
              className="border p-2 rounded"
              disabled={editingDethi !== null}
            />
            <input
              type="text"
              placeholder="ID Giáo Viên"
              value={newDethi.id_giaovien}
              onChange={(e) =>
                setNewDethi({ ...newDethi, id_giaovien: e.target.value })
              }
              className="border p-2 rounded"
            />
            <select
              value={newDethi.id_monhoc}
              onChange={(e) =>
                setNewDethi({ ...newDethi, id_monhoc: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">Chọn Môn Học</option>
              {monhocList.map((mh) => (
                <option key={mh.id_monhoc} value={mh.id_monhoc}>
                  {mh.tenmonhoc}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tên Đề Thi"
              value={newDethi.tendethi}
              onChange={(e) =>
                setNewDethi({ ...newDethi, tendethi: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="date"
              placeholder="Ngày Tạo"
              value={newDethi.ngay_tao}
              onChange={(e) =>
                setNewDethi({ ...newDethi, ngay_tao: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Thời Gian Thi (phút)"
              value={newDethi.thoigianthi}
              onChange={(e) =>
                setNewDethi({ ...newDethi, thoigianthi: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="datetime-local"
              placeholder="Thời Gian Bắt Đầu"
              value={newDethi.thoigianbatdau}
              onChange={(e) =>
                setNewDethi({ ...newDethi, thoigianbatdau: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="datetime-local"
              placeholder="Thời Gian Kết Thúc"
              value={newDethi.thoigianketthuc}
              onChange={(e) =>
                setNewDethi({ ...newDethi, thoigianketthuc: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Trạng Thái"
              value={newDethi.trangthai}
              onChange={(e) =>
                setNewDethi({ ...newDethi, trangthai: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingDethi ? "Cập Nhật" : "Thêm"}
          </button>
          {editingDethi && (
            <button
              type="button"
              onClick={() => {
                setEditingDethi(null);
                setNewDethi({
                  id_dethi: "",
                  id_giaovien: "",
                  id_monhoc: "",
                  tendethi: "",
                  ngay_tao: "",
                  thoigianthi: "",
                  thoigianbatdau: "",
                  thoigianketthuc: "",
                  trangthai: "",
                });
              }}
              className="mt-4 ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Hủy
            </button>
          )}
        </form>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Tên Đề Thi</th>
            <th className="p-2">ID Giáo Viên</th>
            <th className="p-2">ID Môn Học</th>
            <th className="p-2">Ngày Tạo</th>
            <th className="p-2">Thời Gian Thi</th>
            <th className="p-2">Thời Gian Bắt Đầu</th>
            <th className="p-2">Thời Gian Kết Thúc</th>
            <th className="p-2">Trạng Thái</th>
            <th className="p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {dethiList.map((dt) => (
            <tr key={dt.id_dethi} className="border-t">
              <td className="p-2">{dt.id_dethi}</td>
              <td className="p-2">{dt.tendethi}</td>
              <td className="p-2">{dt.id_giaovien}</td>
              <td className="p-2">{dt.id_monhoc}</td>
              <td className="p-2">{dt.ngay_tao}</td>
              <td className="p-2">{dt.thoigianthi}</td>
              <td className="p-2">{dt.thoigianbatdau}</td>
              <td className="p-2">{dt.thoigianketthuc}</td>
              <td className="p-2">{dt.trangthai}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(dt)}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(dt.id_dethi)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeThiManager;