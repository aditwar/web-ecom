import Link from 'next/link';

export default function Hero() {
  return (
    <>
      <div className="flex relative overflow-clip w-full md:h-screen justify-center items-center bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[50px] md:py-[60px]">
        <div className="absolute h-[300px] md:h-[700px] 2xl:h-[1000px] w-[750px] md:w-[3500px] 2xl:w-[4000px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-90px)] md:top-[calc(100%-140px)] 2xl:top-[calc(100%-340px)]"></div>
        <div className="container relative">
          <h1 className="text-center mt-20 gap-5 text-5xl md:text-8xl hover:drop-shadow-[0_0_0.3rem_#ffffff]">
            Every Showtime
            <br /> is Here
          </h1>
          <div className="flex item-center justify-center mt-5">
            <Link
              href={'/feature'}
              className="border py-1 px-2 inline-flex items-center gap-2 rounded-lg border-white/30"
            >
              <span className="bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)] text-transparent bg-clip-text [-webkit-background-clip:text] font-black">
                #MakeItSimple
              </span>
              <span>Read More</span>
            </Link>
          </div>
          <div className="flex justify-center">
            <p className="text-center mt-5">
              Ready for your next big night? Explore movies, concerts, and
              sports events happening near you.
              <br />
              Discover whats on, score the best seats, or sell your extras! All
              in one place.
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <button className="bg-white font-bold text-black py-3 px-5 rounded-lg hover:drop-shadow-[0_0_0.3rem_#ffffff]">
              <Link href={'/events'}>DISCOVER NOW</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
