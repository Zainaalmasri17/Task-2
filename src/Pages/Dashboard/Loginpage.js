import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { clearUserRelatedStorage } from "./storage";
import useUserStore from "../../Store/userStore";


export default function Loginpage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { users } =useUserStore();

  useEffect(() => {
    if (sessionStorage.getItem("unauthorizedAccess")) {
      alert("🚨 يجب تسجيل الدخول للوصول إلى هذه الصفحة!");
      sessionStorage.removeItem("unauthorizedAccess");
    }
  }, []);

  const { mutate: loginUser, data: userEmail } = useMutation({
    mutationFn: (email) => {
      const user = users.find((u) => u.email === email);

      if (!user) throw new Error("❌ المستخدم غير موجود");
      if (user.role === "banned") {
        alert("🚫 تم حظرك من استخدام النظام.");
        throw new Error("Blocked user");
      }

      clearUserRelatedStorage();
      localStorage.setItem("userEmail", email);
      return email;
    },
    onSuccess: () => {
      navigate("/"); // ✅ تحويل إلى الصفحة الرئيسية بعد تسجيل الدخول
    },
    onError: (error) => {
      console.warn("فشل تسجيل الدخول:", error.message);
    },
  });

  const handleLogin = () => {
    if (email.trim()) {
      loginUser(email.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="p-8 max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          🔐 {userEmail ? "مرحبًا بك!" : "تسجيل الدخول"}
        </h2>

        {!userEmail ? (
          <>
            <input
              type="email"
              placeholder="📧 أدخل بريدك الإلكتروني..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md mb-5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg shadow-md transition hover:scale-105 hover:shadow-xl active:scale-95"
            >
              دخول
            </button>
          </>
        ) : (
          <div className="text-lg text-gray-700 dark:text-gray-300">
            ✅ تم تسجيل الدخول كبريد: <br />
            <span className="font-mono text-blue-600 dark:text-blue-400">{userEmail}</span>
          </div>
        )}
      </div>
    </div>
  );
}
