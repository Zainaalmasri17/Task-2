import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function useAuthRedirect() {
  const navigate = useNavigate();

  // ✅ نحصل على userEmail من localStorage عبر react-query
  const { data: userEmail } = useQuery({
    queryKey: ["userEmail"],
    queryFn: () => localStorage.getItem("userEmail"),
  });

  if (!userEmail) {
    sessionStorage.setItem("unauthorizedAccess", "true");
    navigate("/login", { replace: true });
  }
}
