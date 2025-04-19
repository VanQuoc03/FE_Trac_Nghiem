import React, { useState, useEffect } from "react";

const HocSinhManager = ({ apiUrl }) => {
  const [hocsinhList, setHocsinhList] = useState([]);
  const [newHocsinh, setNewHocsinh] = useState({
    id_hocsinh: "",
    ten_hocsinh: "",
    tendangnhap: "",
    matkhau: "",
    email: "",
    phone: "",
  });
  const [editingHocsinh, setEditingHocsinh] = useState(null);

  const fetchHocsinh = async () => {
    try {
      const response = await fetch(`${apiUrl}/hocsinh`);
      const data = await response.json();
      setHocsinhList(data);
    } catch (error) {
      console.error("Error fetching hocsinh:", error);
    }
  };

  useEffect(() => {
    fetchHocsinh();
  }, []);

  // Thêm học sinh
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/hocsinh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHocsinh),
      });
      if (response.ok) {
        fetchHocsinh();
        setNewHocsinh({
          id_hocsinh: "",
          ten_hocsinh: "",
          tendangnhap: "",
          matkhau: "",
          email: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error adding hocsinh:", error);
    }
  };

  // Sửa học sinh
  const handleEdit = (hs) => {
    setEditingHocsinh(hs);
    setNewHocsinh(hs);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/hocsinh/${editingHocsinh.id_hocsinh}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHocsinh),
      });
      if (response.ok) {
        fetchHocsinh();
        setEditingHocsinh(null);
        setNewHocsinh({
          id_hocsinh: "",
          ten_hocsinh: "",
          tendangnhap: "",
          matkhau: "",
          email: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error updating hocsinh:", error);
    }
  };

  // Xóa học sinh
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/hocsinh/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchHocsinh();
      }
    } catch (error) {
      console.error("Error deleting hocsinh:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Danh Sách Học Sinh</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {editingHocsinh ? "Sửa Học Sinh" : "Thêm Học Sinh"}
        </h2>
        <form onSubmit={editingHocsinh ? handleUpdate : handleAdd}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="ID Học Sinh"
              value={newHocsinh.id_hocsinh}
              onChange={(e) =>
                setNewHocsinh({ ...newHocsinh, id_hocsinh: e.target.value })
              }
              className="border p-2 rounded"
              disabled={editingHocsinh !== null}
            />
            <input
              type="text"
              placeholder="Tên Học Sinh"
              value={newHocsinh.ten_hocsinh}
              onChange={(e) =>
                setNewHocsinh({ ...newHocsinh, ten_hocsinh: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Tên Đăng Nhập"
              value={newHocsinh.tendangnhap}
              onChange={(e) =>
                setNewHocsinh({ ...newHocsinh, tendangnhap: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Mật Khẩu"
              value={newHocsinh.matkhau}
              onChange={(e) =>
                setNewHocsinh({ ...newHocsinh, matkhau: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newHocsinh.email}
              onChange={(e) =>
                setNewHocsinh({ ...newHocsinh, email: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Số Điện Thoại"
              value={newHocsinh.phone}
              onChange={(e) =>
                setNewHocsinh({ ...newHocsinh, phone: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingHocsinh ? "Cập Nhật" : "Thêm"}
          </button>
          {editingHocsinh && (
            <button
              type="button"
              onClick={() => {
                setEditingHocsinh(null);
                setNewHocsinh({
                  id_hocsinh: "",
                  ten_hocsinh: "",
                  tendangnhap: "",
                  matkhau: "",
                  email: "",
                  phone: "",
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
            <th className="p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {hocsinhList.map((hs) => (
            <tr key={hs.id_hocsinh} className="border-t">
              <td className="p-2">{hs.id_hocsinh}</td>
              <td className="p-2">{hs.ten_hocsinh}</td>
              <td className="p-2">{hs.tendangnhap}</td>
              <td className="p-2">{hs.email}</td>
              <td className="p-2">{hs.phone}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(hs)}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(hs.id_hocsinh)}
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

export default HocSinhManager;