import { Comments } from "@/components/ui/home/Comments";

export default function About() {
  return (
    <div className="flex flex-col gap-6 items-center text-white">
      <div className="bg-gray-800 border border-teal-800 p-4 rounded-lg shadow w-1/2">
        <Comments />
      </div>
    </div>
  );
}

export { About };
