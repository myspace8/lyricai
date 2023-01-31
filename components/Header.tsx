// import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
      <header className="hidden md:flex items-center justify-between max-w-6xl m-auto py-5 text-primary-white">
        <div className="logo text-2xl tracking-wide">
          <Link href="#">LyricAI</Link>
        </div>
        <nav>
          <ul className="flex items-center justify-center">
            <li>
              <Link href="#">Contact</Link>
            </li>
            <li>
              <Link href="#">About</Link>
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