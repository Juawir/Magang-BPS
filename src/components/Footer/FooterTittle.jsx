import React from 'react';

const FooterTitle = ({ title }) => {
  return (
    <div className='flex flex-col items-center justify-center mb-2'>
      <h2 className="text-pdarkblue text-left font-bold mb-1">
        {title}
      </h2>
      <div className='w-[5em] rounded-full h-{24} h-[.2em] bg-pdarkblue'></div>
    </div>
  );
};

export default FooterTitle;