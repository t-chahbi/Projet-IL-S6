import { Button } from '@/components/ui/home/Button';
import EyesLogo from '@/components/ui/home/Eyes';

export default function Header() {
  return (
    <div className="flex justify-end justify-between w-full">
      <EyesLogo />
      <header className="inline-flex items-center justify-between h-12 p-4 mt-10 bg-transparent w-fit rounded-xl">
        <div className="flex gap-4 h-fit">
          <a
            className="font-medium text-white hover:text-indigo-400"
            href="/auth/register"
          >
            Sign
          </a>
          <a
            className="font-medium text-white hover:text-indigo-400"
            href="/auth/login"
          >
            Log in
          </a>
          <a
            className="font-medium text-white hover:text-indigo-400"
            href="/upgrade"
          >
            upgrade
          </a>
        </div>
      </header>
    </div>
  );
}
export { Header };
