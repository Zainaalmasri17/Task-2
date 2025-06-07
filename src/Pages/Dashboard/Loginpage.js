import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Loginpage() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setUser(storedEmail);

    // ✅ Show alert if redirected due to unauthorized access
    if (sessionStorage.getItem("unauthorizedAccess")) {
      alert("🚨 يجب تسجيل الدخول للوصول إلى هذه الصفحة!");
      sessionStorage.removeItem("unauthorizedAccess"); // ✅ Remove flag after showing alert
    }
  }, []);

  const handleLogin = () => {
    if (email.trim()) {
      localStorage.setItem("userEmail", email);
      setUser(email);
      navigate("/articles"); // ✅ Redirect to articles page
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">🔑 {user ? "Welcome!" : "Login"}</h2>

        {!user ? (
          <>
            <input
              type="email"
              placeholder="📧 Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Login
            </button>
          </>
        ) : (
          <p className="text-lg text-gray-700">📧 {user}</p>
        )}
      </div>
    </div>
  );
}
