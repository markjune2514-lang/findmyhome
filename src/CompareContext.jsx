import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (property) => {
    if (compareList.length >= 4) {
      alert('คุณสามารถเปรียบเทียบโครงการได้สูงสุด 4 โครงการ');
      return;
    }
    if (!compareList.find(p => p.id === property.id)) {
      setCompareList([...compareList, property]);
      alert(`เพิ่ม ${property.name} ลงในรายการเปรียบเทียบแล้ว`);
    } else {
      alert('โครงการนี้อยู่ในรายการเปรียบเทียบแล้ว');
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(p => p.id !== id));
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
