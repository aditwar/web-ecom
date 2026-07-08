import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { GiHamburgerMenu } from 'react-icons/gi';
import Link from 'next/link';
import Image from 'next/image';
import LoginLogoutHidde from './LoginLogoutHidde';

export const NavbarHidden = async () => {
  return (
    <>
      <div className="sticky w-full flex items-center z-10">
        <div className="fixed bottom-[calc(100%-75px)] right-[calc(100%-80px)]">
          <Link href={'/'} className="">
            <Image
              src="/assets/svg/logo.svg"
              alt="Logo"
              height={1000}
              width={1000}
              priority={true}
              className="h-12 w-auto hover:drop-shadow-[0_0_0.3rem_#ffffff]"
            />
          </Link>
        </div>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <GiHamburgerMenu
                size={25}
                fill="white"
                className="hover:drop-shadow-[0_0_0.3rem_#ffffff]"
              />
            </MenubarTrigger>

            <MenubarContent>
              <MenubarItem>
                <div className="hover:drop-shadow-[0_0_0.3rem_#ffffff] text-white hover:text-[rgb(255,_0,_0)] transition">
                  <Link href={'/'}>Home</Link>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <div className="hover:drop-shadow-[0_0_0.3rem_#ffffff] text-white hover:text-[rgb(255,_0,_0)] transition">
                  <Link href={'/events'}>Event</Link>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <div className="hover:drop-shadow-[0_0_0.3rem_#ffffff] text-white hover:text-[rgb(255,_0,_0)] transition">
                  <Link href={'/news'}>News</Link>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <div className="hover:drop-shadow-[0_0_0.3rem_#ffffff] text-white hover:text-[rgb(255,_0,_0)] transition">
                  <Link href={'/myshop'}>MyShop</Link>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <div className="flex cursor-pointer items-center hover:drop-shadow-[0_0_0.3rem_#ffffff] text-white hover:text-[rgb(255,_0,_0)] transition">
                  <LoginLogoutHidde />
                </div>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </>
  );
};
