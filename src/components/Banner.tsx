import Link from 'next/link';
import { ThemeToggle } from '@/components/theme';

export const Banner = () => {
  return (
    <>
      <div className="fixed top-[calc(100%-36px)] flex w-full z-10">
        <div className="flex py-1 text-center justify-center w-full z-10 backdrop-blur-sm bg-[linear-gradient(to_right,rgba(252,_214,_255,_0.01),rgba(41,_216,_255,_0.5),rgba(255,_69,_184,_0.8),rgb(255,_0,_106),rgba(255,_69,_184,_0.8),rgba(41,_216,_255,_0.5),rgba(252,_214,_255,_0.01))]">
          <div className="font-black text-white">
            <h3 className="hidden sm:inline">
              <Link
                href={'/discount'}
                className="underline underline-offset-[3px] text-lg md:text-xl font-medium"
              >
                PROMO HERE
              </Link>
            </h3>
          </div>
        </div>
      </div>
      <div className="fixed top-[calc(100%-54px)] flex left-[calc(100%-75px)] items-center justify-center z-10">
        <div className="flex">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};
