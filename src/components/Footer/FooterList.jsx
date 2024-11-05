import React from 'react';

const FooterList = ({ items }) => {
  return (
    <ol>
      {items.map((item, index) => (
        <li className="my-1" key={index}>
          <div className="flex flex-row items-center justify-center">
            <div className="flex items-center justify-center bg-pdarkblue md:p-2 p-1 md:m-2 m-1 text-base rounded-full mr-2 transition-transform duration-300 ease-in-out transform hover:scale-110">
              <item.icon />
            </div>
            <div className="w-3/4">
              <a href={item.href} className="text-md group relative w-max">
              <span>{item.text}</span>
              <span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-primaryBlue group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default FooterList;