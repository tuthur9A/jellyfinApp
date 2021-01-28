import React, {createContext, useEffect, useState} from 'react';
import * as jellyfinApi from '@jellyfin/client-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext({
    user: {} as jellyfinApi.UserDto,
    apiKey: null,
    TokenNotification: null,
    Headers: null,
    URL: null,
    PageTitle: null,
    setUser: (...user) => {},
    setApiKey: (...ApiKey) => {},
    setHeaders: (...Headers) => {},
    setUrl: (...URL)=> {},
    setTokenNotification: (...TokenNotification) => {},
    setPageTitle: (...PageTitle) => {},
});

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [apiKey, setApiKey] = useState({});
    const [Headers, setHeaders] = useState({});
    const [URL, setUrl] = useState({});
    const [TokenNotification, setTokenNotification] = useState({});
    const [PageTitle, setPageTitle] = useState({});
    useEffect(() => {
      AsyncStorage.getItem('@access_token')
      .then(value => {
        setApiKey(value);
      })
      AsyncStorage.getItem('@headers')
      .then(value => {
        setHeaders(value);
      })
      AsyncStorage.getItem('@user')
      .then(value => {
        setUser(value);
      })
      AsyncStorage.getItem('@url')
      .then(value => {
        setUrl(value);
      })
      // async storage get item
      setPageTitle('Home');
    }, []
  )

  return (
    <UserContext.Provider
      value={{
        user,
        apiKey,
        Headers,
        URL,
        TokenNotification,
        PageTitle,
        setUser,
        setHeaders,
        setApiKey,
        setTokenNotification,
        setUrl,
        setPageTitle
      }}
    >
      {children}
    </UserContext.Provider>
  );
}