// import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
      <header className="hidden md:block">
        <nav>
          <ul>
            <li>
              <Link href="#">Contact</Link>
            </li>
            <li>
              <Link href="#">About</Link>
            </li>
            <li className="logo">
              <Link href="#">LyricAI</Link>
            </li>
            <li>
              <Link href="#">Feedback</Link>
            </li>
            <li>
              <Link href="#">More</Link>
            </li>
          </ul>
        </nav>
      </header>
  );
}






// <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
// <Link href="/" className="flex space-x-3">
  
// </Link>
// </header>
