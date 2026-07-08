import Link from 'next/link';

export const CallAction = () => {
  return (
    <>
      <div className="relative bg-black text-white py-[36px] md:py-[50px] justify-center items-center flex w-full min-h-[200px]">
        <div>
          <div className="">
          </div>
          <div className="relative container max-w-[800px]">
            <span className="font-black text-3xl md:text-4xl flex justify-center bg-[linear-gradient(to_right,#ff0000,#1900ff,#8400ff,#f700ff,#d400ff,#8c00ff,#3700ff,#1900ff,#8400ff,#f700ff,#d400ff,#8c00ff,#3700ff,#ff0000)] text-transparent bg-clip-text [-webkit-background-clip:text] hover:drop-shadow-[0_0_0.3rem_#ffffff] hover:text-[rgb(255,255,255)] transition">
              Get Instant Updates
            </span>
            <p className="text-center text-white/70 mt-5">
              Do not miss out! Subscribe now for instant updates and early
              access to special events!
            </p>
            <form className="flex flex-col md:flex-row items-center justify-center mt-10 gap-2.5 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex sm:flex-1 h-12 max-w-[230px] text-center bg-white/20 rounded-lg px-5 py-4 font-medium placeholder:text-[#9CA3AF]"
              />
              <button className="font-black text-base bg-white text-black h-12 w-[210px] rounded-lg px-5 justify-center items-center hover:drop-shadow-[0_0_0.3rem_#ffffff]">
                <Link href="/discount">Get Access</Link>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
