import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthRedirect() {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        if (!userEmail) {
            sessionStorage.setItem("unauthorizedAccess", "true"); // ✅ Store flag before redirect
            navigate("/login", { replace: true }); // ✅ Redirect immediately
        }
    }, [userEmail, navigate]);
}
