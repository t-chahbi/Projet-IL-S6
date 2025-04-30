import { Comments } from "@/components/ui/home/Comments"; 

export default function About(){
    return(
        <div className="flex flex-col gap-6 items-center">
            
            <div className=" bg-white p-4 rounded-lg shadow-lg w-1/2">
                <Comments></Comments>
            </div>
        </div>
        
        
    );
};
export{About}