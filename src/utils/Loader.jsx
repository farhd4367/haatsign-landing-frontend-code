// src/utils/Loader.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const Loader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  if (!isLoading) return null;

  return (
    <></>
    // <div className="loader-overlay">
    //   <div className="loadingio-spinner-ripple">
    //     <div className="ldio">
    //       <div></div>
    //       <div></div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Loader;
