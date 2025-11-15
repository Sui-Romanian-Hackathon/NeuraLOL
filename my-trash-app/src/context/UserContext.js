import React, { createContext, useState, useContext } from "react";

// Contextul propriu-zis
const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState("user"); // default = user

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pentru a folosi contextul ușor
export const useUser = () => useContext(UserContext);
