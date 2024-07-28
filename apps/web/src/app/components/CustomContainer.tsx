"use client";

import { ReactNode } from "react";

const CustomContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto px-4 max-w-[1000px]" >
      {children}
    </div >
  );
};
export default CustomContainer;

