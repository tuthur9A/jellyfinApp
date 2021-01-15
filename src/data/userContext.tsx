import React, {createContext, useState} from 'react';
import * as jellyfinApi from '@jellyfin/client-axios';

export const UserContext = createContext({
    user: {} as jellyfinApi.UserDto,
    apiKey: null,
    setUser: (...user) => {},
    setApiKey: (...ApiKey) => {},
});

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [apiKey, setApiKey] = useState({});

  return (
    <UserContext.Provider
      value={{
        user,
        apiKey,
        setUser,
        setApiKey
      }}
    >
      {children}
    </UserContext.Provider>
  );
}