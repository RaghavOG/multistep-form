import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center bg-indigo-900 min-h-screen gap-5">
     <Button asChild className="  ">
      <Link href="/admin/login">
        Admin Login
      </Link>
      </Button>

     <Button asChild className="">
      <Link href="/register">
        Register
      </Link>
      </Button>
    </div>
  );
}
