import React from "react";

export default function Button({ children } :{children:React.ReactNode}) {
  return <button className="bg-gradient-to-l from-[#1B00CD] to-[#100028] text-white p-2 rounded-full text-center px-3 py-1 w-32 " >{children}</button>;
  
}
export{Button}