import { useState } from "react";
import { useAppContext } from "../../Context/AppContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const { setUser } = useAppContext();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Gọi API danh sách học sinh
        const response = await fetch("/api/hocsinh");
        const students = await response.json();

        // Tìm sinh viên theo username
        const student = students.find(st => st.tendangnhap === username);

        if (student) {
            setUser(student); // Lưu vào Context
            alert("Đăng nhập thành công!");
        } else {
            alert("Tên đăng nhập không tồn tại!");
        }
    };

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 w-full mb-4"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}
