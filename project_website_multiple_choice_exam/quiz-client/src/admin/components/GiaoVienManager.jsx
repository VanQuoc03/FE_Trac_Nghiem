import React, { useState, useEffect } from "react";

const GiaoVienManager = ({ apiUrl }) => {
  const [giaovienList, setGiaovienList] = useState([]);
  const [newGiaovien, setNewGiaovien] = useState({
    id_giaovien: "",
    ten_giaovien: "",
    tendangnhap_gv: "",
    matkhau_gv: "",
    email_gv: "",
    phone_gv: "",
    monchinh: "",
    lopdaychinh: "",
  });
  const [editingGiaovien, setEditingGiaovien] = useState(null);

  // Lấy danh sách giáo viên
  const fetchGiaovien = async () => {
    try {
      const response = await fetch(`${apiUrl}/giaovien`);
      const data = await response.json();
      setGiaovienList(data);
    } catch (error) {
      console.error("Error fetching giaovien:", error);
    }
  };

  useEffect(() => {
    fetchGiaovien();
  }, []);

  // Thêm giáo viên
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/giaovien`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGiaovien),
      });
      if (response.ok) {
        fetchGiaovien();
        setNewGiaovien({
          id_giaovien: "",
          ten_giaovien: "",
          tendangnhap_gv: "",
          matkhau_gv: "",
          email_gv: "",
          phone_gv: "",
          monchinh: "",
          lopdaychinh: "",
        });
      }
    } catch (error) {
      console.error("Error adding giaovien:", error);
    }
  };

  // Sửa giáo viên
  const handleEdit = (gv) => {
    setEditingGiaovien(gv);
    setNewGiaovien(gv);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/giaovien/${editingGiaovien.id_giaovien}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGiaovien),
      });
      if (response.ok) {
        fetchGiaovien();
        setEditingGiaovien(null);
        setNewGiaovien({
          id_giaovien: "",
          ten_giaovien: "",
          tendangnhap_gv: "",
          matkhau_gv: "",
          email_gv: "",
          phone_gv: "",
          monchinh: "",
          lopdaychinh: "",
        });
      }
    } catch (error) {
      console.error("Error updating giaovien:", error);
    }
  };

  // Xóa giáo viên
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/giaovien/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchGiaovien();
      }
    } catch (error) {
      console.error("Error deleting giaovien:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Danh Sách Giáo Viên</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {editingGiaovien ? "Sửa Giáo Viên" : "Thêm Giáo Viên"}
        </h2>
        <form onSubmit={editingGiaovien ? handleUpdate : handleAdd}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="ID Giáo Viên"
              value={newGiaovien.id_giaovien}
              onChange={(e) =>
                setNewGiaovien({ ...newGiaovien, id_giaovien: e.target.value })
              }
              className="border p-2 rounded"
              disabled={editingGiaovien !== null}
            />
            <input
              type="text"
              placeholder="Tên Giáo Viên"
              value={newGiaovien.ten_giaovien}
              onChange={(e) =>
                setNewGiaovien({ ...newGiaovien, ten_giaovien: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Tên Đăng Nhập"
              value={newGiaovien.tendangnhap_gv}
              onChange={(e) =>
                setNewGiaovien({
                  ...newGiaovien,
                  tendangnhap_gv: e.target.value,
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Mật Khẩu"
              value={newGiaovien.matkhau_gv}
              onChange={(e) =>
                setNewGiaovien({ ...newGiaovien, matkhau_gv: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newGiaovien.email_gv}
              onChange={(e) =>
                setNewGiaovien({ ...newGiaovien, email_gv: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Số Điện Thoại"
              value={newGiaovien.phone_gv}
              onChange={(e) =>
                setNewGiaovien({ ...newGiaovien, phone_gv: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Môn Chính"
              value={newGiaovien.monchinh}
              onChange={(e) =>
                setNewGiaovien({ ...newGiaovien, monchinh: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Lớp Dạy Chính"
              value={newGiaovien.lopdaychinh}
              onChange={(e) =>
                setNewGiaovien({ ...newGiaovien, lopdaychinh: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingGiaovien ? "Cập Nhật" : "Thêm"}
          </button>
          {editingGiaovien && (
            <button
              type="button"
              onClick={() => {
                setEditingGiaovien(null);
                setNewGiaovien({
                  id_giaovien: "",
                  ten_giaovien: "",
                  tendangnhap_gv: "",
                  matkhau_gv: "",
                  email_gv: "",
                  phone_gv: "",
                  monchinh: "",
                  lopdaychinh: "",
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
            <th className="p-2">Tên</th>
            <th className="p-2">Tên Đăng Nhập</th>
            <th className="p-2">Email</th>
            <th className="p-2">Số Điện Thoại</th>
            <th className="p-2">Môn Chính</th>
            <th className="p-2">Lớp Dạy Chính</th>
            <th className="p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {giaovienList.map((gv) => (
            <tr key={gv.id_giaovien} className="border-t">
              <td className="p-2">{gv.id_giaovien}</td>
              <td className="p-2">{gv.ten_giaovien}</td>
              <td className="p-2">{gv.tendangnhap_gv}</td>
              <td className="p-2">{gv.email_gv}</td>
              <td className="p-2">{gv.phone_gv}</td>
              <td className="p-2">{gv.monchinh}</td>
              <td className="p-2">{gv.lopdaychinh}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(gv)}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(gv.id_giaovien)}
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

export default GiaoVienManager;