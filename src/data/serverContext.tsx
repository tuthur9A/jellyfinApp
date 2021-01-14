import React, {createContext, useState} from 'react';

export const ServerContext = createContext({
    server: {},
    setServer: (...server) => {},
});

export const ServerProvider = ({children}) => {
    const [server, setServer] = useState({});


  return (
    <ServerContext.Provider
      value={{
        server,
        setServer,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
}