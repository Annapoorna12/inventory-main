import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export const ProtectedRouteSupplier = ({ children, }) => {
  const { checkAuthValidity } = useAuth();
  const [isTokenValid, setIsTokenValid] = useState(null);

  let role = "Supplier";
  const validateToken = () => {
      const isValid = checkAuthValidity(role);
      console.log(isValid);
      setIsTokenValid(isValid);
  };

  useEffect(() => {
    validateToken();
  }, [checkAuthValidity]);

  if (isTokenValid === null) {
    return null;
  }

  if (!isTokenValid) {
    toast.warning('User is not Authorized');
    return <Navigate to="/login" />;
  }

  return children;
};
