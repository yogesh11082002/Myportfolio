"use client";

import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div className={`container mx-auto px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
