import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import PageWrapper from "./Pagewrapper";

export default function Loginpage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // ✅ التحقق من unauthorizedAccess (اختياري)
  useEffect(() => {
    if (sessionStorage.getItem("unauthorizedAccess")) {
      alert("🚨 يجب تسجيل الدخول للوصول إلى هذه الصفحة!");
      sessionStorage.removeItem("unauthorizedAccess");
    }
  }, []);

  // ✅ تسجيل الدخول باستخدام useMutation
  const { mutate: loginUser, data: userEmail } = useMutation({
    mutationFn: (email) => {
      localStorage.setItem("userEmail", email);
      return email;
    },
    onSuccess: () => {
      navigate("/articles");
    },
  });

  const handleLogin = () => {
    if (email.trim()) {
      loginUser(email.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
      <div className="p-6 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-900">
          🔑 {userEmail ? "مرحبًا بك!" : "تسجيل الدخول"}
        </h2>

        {!userEmail ? (
          <>
            <input
              type="email"
              placeholder="📧 أدخل بريدك الإلكتروني..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95"
            >
              دخول
            </button>
          </>
        ) : (
          <p className="text-lg text-gray-700 dark:text-gray-300">📧 {userEmail}</p>
        )}
      </div>
    </div>
  );
}
