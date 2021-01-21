import React, {createContext, useEffect, useState} from 'react';
import * as jellyfinApi from '@jellyfin/client-axios';

export const UserContext = createContext({
    user: {} as jellyfinApi.UserDto,
    apiKey: null,
    TokenNotification: null,
    Headers: null,
    PageTitle: null,
    setUser: (...user) => {},
    setApiKey: (...ApiKey) => {},
    setHeaders: (...Headers) => {},
    setTokenNotification: (...TokenNotification) => {},
    setPageTitle: (...PageTitle) => {},
});

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [apiKey, setApiKey] = useState({});
    const [Headers, setHeaders] = useState({});
    const [TokenNotification, setTokenNotification] = useState({});
    const [PageTitle, setPageTitle] = useState({});
    useEffect(() => {
      // async storage get item
      setPageTitle('Home');
    }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        apiKey,
        Headers,
        TokenNotification,
        PageTitle,
        setUser,
        setApiKey,
        setHeaders,
        setTokenNotification,
        setPageTitle
      }}
    >
      {children}
    </UserContext.Provider>
  );
}