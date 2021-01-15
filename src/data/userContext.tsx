import React, {createContext, useEffect, useState} from 'react';
import * as jellyfinApi from '@jellyfin/client-axios';

export const UserContext = createContext({
    user: {} as jellyfinApi.UserDto,
    apiKey: null,
    TokenNotification: null,
    setUser: (...user) => {},
    setApiKey: (...ApiKey) => {},
    setTokenNotification: (...TokenNotification) => {},
});

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [apiKey, setApiKey] = useState({});
    const [TokenNotification, setTokenNotification] = useState({});
    useEffect(() => {
      // async storage get item
    }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        apiKey,
        TokenNotification,
        setUser,
        setApiKey,
        setTokenNotification
      }}
    >
      {children}
    </UserContext.Provider>
  );
}