import React, { createContext, useState } from 'react';

const PageStateContext = createContext();

export const PageStateProvider = ({ children }) => {
  const [hostelState, setHostelState] = useState({averageRatings: {},
    userRatings: {}});
  const [outletsState, setOutletsState] = useState({});
  const [sellState, setSellState] = useState({});

  const value = {
    hostelState,
    setHostelState,
    outletsState,
    setOutletsState,
    sellState,
    setSellState,
  };

  return (
    <PageStateContext.Provider value={value}>
      {children}
    </PageStateContext.Provider>
  );
};

export default PageStateContext;
