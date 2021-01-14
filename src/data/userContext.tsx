import React, {createContext, useState} from 'react';

export const UserContext = createContext({
    user: {},
    setUser: (...user) => {},
    setUserApiKey: (apiKey: string) => {},
});

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({});

    const setUserApiKey = (apiKey: string) =>
        setUser({ ...user, apiKey: apiKey });


  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setUserApiKey,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}