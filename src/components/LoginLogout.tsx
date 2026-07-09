'use client';

import { deleteToken, getToken } from '@/lib/server';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { signOut } from 'next-auth/react';

function getAvatarUrl(
  avatar: string | File | { url: string } | null | undefined,
): string {
  if (!avatar) return '/assets/svg/defaultAvatar.svg';
  if (typeof avatar === 'string') return avatar;
  if (avatar instanceof File) return URL.createObjectURL(avatar);
  if ('url' in avatar) return avatar.url;
  return '/assets/svg/defaultAvatar.svg';
}

export default function LoginLogout() {
  const router = useRouter();

  const [token, setToken] = useState('');

  const getData = async () => {
    const res = await getToken();
    setToken(res || '');
  };
  const author = useAppSelector((state) => state.author);
  const users = useAppSelector((state) => state.auth);

  const onLogout = async () => {
    await deleteToken();
    setToken('');
    router.refresh();
    router.push('/');
  };
  const onLogin = async () => {
    router.refresh();
    router.push('/login');
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div>
        {token ? (
          <div className="hidden md:flex">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                  <div className="flex items-center justify-center cursor-pointer w-[50px] h-[50px] rounded-full overflow-hidden hover:drop-shadow-[0_0_0.3rem_#ffffff] transition">
                    <img
                      className="object-cover w-full h-full"
                      src={
                        getAvatarUrl(author.avatar) ||
                        getAvatarUrl(users.avatar)
                      }
                      alt={author.name || users.name || 'Your Name'}
                      onError={(e: any) =>
                        (e.currentTarget.src = '/assets/svg/defaultAvatar.svg')
                      }
                    />
                  </div>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <div
                      className="
      transition
      text-foreground
      hover:text-foreground/80
      hover:drop-shadow-[0_0_0.3rem_var(--tw-shadow-color)]
      shadow-black dark:shadow-white
    "
                    >
                      <a href={'/setting'}>Setting</a>
                    </div>
                  </MenubarItem>

                  <MenubarSeparator />

                  <MenubarItem>
                    <div onClick={onLogout}>
                      <div
                        onClick={() => signOut()}
                        className="
        flex cursor-pointer items-center
        transition
        text-foreground
        hover:text-foreground/80
        hover:drop-shadow-[0_0_0.3rem_var(--tw-shadow-color)]
        shadow-black dark:shadow-white
      "
                      >
                        LogOut
                      </div>
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        ) : (
          <div className="flex absolute bottom-[calc(100%-140px)] right-[calc(100%-10px)] cursor-pointer items-center py-5 px-6 dark:bg-neutral-800/30 bg-white/30 backdrop-blur-lg rounded-lg shadow-md shadow-black/5 dark:shadow-white/5">
            <div
              onClick={onLogin}
              className="flex font-black items-center text-sm hover:drop-shadow-[0_0_0.3rem_#ffffff] hover:text-[rgb(255,_0,_0)] transition h-[20px]"
            >
              LogIn
            </div>
          </div>
        )}
      </div>
    </>
  );
}
