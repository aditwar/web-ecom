import Link from 'next/link';
import { NavbarHidden } from './NavbarHidden';
import LoginLogout from './LoginLogout';

export const Navbar = () => {

  return (
    <>
      <nav className="hidden md:flex fixed top-0 w-screen justify-center items-center p-5 z-10">
        <ul className="flex font-black items-center gap-6 text-sm py-5 px-6 dark:bg-neutral-800/30 bg-white/30 backdrop-blur-lg rounded-lg shadow-md shadow-black/5 dark:shadow-white/5">
          <li className="hover:drop-shadow-[0_0_0.3rem_#ffffff] hover:text-[rgb(255,_0,_0)] transition">
            <Link href={'/'}>Home</Link>
          </li>
          <li className="hover:drop-shadow-[0_0_0.3rem_#ffffff] hover:text-[rgb(255,_0,_0)] transition">
            <Link href={'/events'}>Events</Link>
          </li>
          <li className="hover:drop-shadow-[0_0_0.3rem_#ffffff] hover:text-[rgb(255,_0,_0)] transition">
            <Link href={'/news'}>News</Link>
          </li>
          <li className="hover:drop-shadow-[0_0_0.3rem_#ffffff] hover:text-[rgb(255,_0,_0)] transition">
            <Link href={'/myshop'}>MyShop</Link>
          </li>
        </ul>

        <div className="flex absolute top-[calc(100%-159px)] right-[50px] items-center justify-center">
          <div className="flex">
            <div className="flex">
              <LoginLogout />
            </div>
          </div>
        </div>
        
      </nav>

      <div className="flex md:hidden">
        <NavbarHidden />
      </div>
    </>
  );
};
