import Link from "next/link";

export default function Footer() {
  return (
    <footer className="rounded-lg shadow m-4 dark:bg-gray-800">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <Link href="https://www.esaip.org/" className="hover:underline">ESAIP™</Link>. All Rights Reserved.</span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link href="#" target="_blank" className="hover:underline hover:cursor-pointer me-4 md:me-6">Cédric</Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="hover:underline hover:cursor-pointer me-4 md:me-6">Kaoutar</Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="hover:underline hover:cursor-pointer me-4 md:me-6">Thomas</Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="hover:underline hover:cursor-pointer me-4 md:me-6">Loan</Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="hover:underline hover:cursor-pointer">Johan</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
