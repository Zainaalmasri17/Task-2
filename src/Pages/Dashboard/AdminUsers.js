import useUserStore from "../../Store/userStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const { users, updateRole } = useUserStore();
  const currentUser = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const currentRole = useUserStore((state) =>
    state.getRoleByEmail(currentUser)
  );

  useEffect(() => {
    // إن لم يكن Admin → أعد التوجيه
    if (currentRole !== "admin") {
      alert("❌ الوصول مرفوض، هذه الصفحة للمشرفين فقط.");
      navigate("/");
    }
  }, [currentRole, navigate]);

  const roleColors = {
    user: "text-gray-700",
    admin: "text-green-600 font-bold",
    banned: "text-red-500 line-through",
  };

  const nextRole = {
    user: "admin",
    admin: "banned",
    banned: "user",
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">🛡️ إدارة المستخدمين</h1>

        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">📧 البريد الإلكتروني</th>
              <th className="py-2">👤 الاسم</th>
              <th className="py-2">🔑 الدور</th>
              <th className="py-2">⚙️ إجراء</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.name}</td>
                <td className={`py-2 ${roleColors[u.role]}`}>{u.role}</td>
                <td className="py-2">
                  <button
                    onClick={() => updateRole(u.email, nextRole[u.role])}
                    className="text-blue-600 hover:underline text-sm"
                    disabled={u.email === currentUser} // لا تغيّر دور نفسك!
                  >
                    🔁 تحويل إلى: {nextRole[u.role]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
