import {Button} from "@/components/ui/home/Button"
import EyesLogo from '@/components/ui/home/Eyes';

export default function Header(){
    return(
        <div className="w-full flex justify-end justify-between">
            <EyesLogo/>
            <header className="bg-transparent  h-12  inline-flex w-fit  justify-between items-center p-4 mt-10 rounded-xl">
                <div className="flex  gap-4 h-fit">
                    <Button >Sign</Button>
                    <Button >Log In</Button>
                    <Button >Upgrade</Button>
                </div> 
            </header>
        </div>
    )
};
export{Header}