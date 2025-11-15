import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: "Necunoscut", // poți completa manual aici
    name: "Necunoscut", // poți completa manual aici
    userType: "Utilizator", // poți completa manual aici
  });

  const [userType, setUserType] = useState("user"); // user sau admin

  return (
    <UserContext.Provider value={{ user, setUser, userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
