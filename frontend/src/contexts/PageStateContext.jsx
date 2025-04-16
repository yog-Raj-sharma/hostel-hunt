import React, { createContext, useState } from 'react';

const PageStateContext = createContext();

export const PageStateProvider = ({ children }) => {
  const [hostelState, setHostelState] = useState({averageRatings: {}, userRatings: {}});
  const [outletsState, setOutletsState] = useState({ averageRatings: {}, userRatings: {},});
  const [sellState, setSellState] = useState({  items: [], newItem: { name: '', image: null, price: '', contact: '' },});

  const value = {
    hostelState,
    setHostelState,
    outletsState,
    setOutletsState,
    sellState,
    setSellState,
  };

  return (
    <PageStateContext.Provider value={{ hostelState, setHostelState, outletsState, setOutletsState, sellState, setSellState }}>
      {children}
    </PageStateContext.Provider>
  );
};

export default PageStateContext;
