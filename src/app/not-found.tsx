import Link from "next/link";

export default function NotFound(){
    return(
        <div className="h-screen flex flex-1 justify-center items-center text-[50px] shrink-0 py-100 ">
            <Link href="/" className="hover:underline">404</Link>
        </div>
    )
}