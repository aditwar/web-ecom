import Image from 'next/image';
import Marquee from 'react-fast-marquee';

export const LogoTicker = () => {
  const images = [
    { src: '/assets/png/icons/bookmyshowLogo.png', alt: 'Bookmyshow Logo' },
    { src: '/assets/png/icons/kitaloketLogo.png', alt: 'Kitaloket Logo' },
    { src: '/assets/png/icons/oltixLogo.png', alt: 'Oltix Logo' },
    { src: '/assets/png/icons/tiketeventLogo.png', alt: 'Tiketevent Logo' },
    { src: '/assets/png/icons/tixidLogo.png', alt: 'Tixid Logo' },
    { src: '/assets/png/icons/travelokaLogo.png', alt: 'Traveloka Logo' },
    { src: '/assets/png/icons/xxiLogo.png', alt: 'Xxi Logo' },
  ];
  return (
    <>
      <div className="bg-black text-white flex justify-center items-center h-[200px] md:h-[230px] py-20">
        <div className="container">
          <h3 className="text-center tracking-tighter">
            Trusted by the most popular platform
          </h3>
          <div className="mt-12 flex">
            <Marquee
              speed={20}
              gradient={true}
              gradientColor={'black'}
              gradientWidth={50}
            >
              <div className="flex justify-between mx-[30px] gap-16">
                {images.map(({ src, alt }, index) => {
                  return (
                    <Image
                      key={index}
                      src={src}
                      alt={alt}
                      loading="lazy"
                      width={1000}
                      height={1000}
                      className="h-10 w-auto "
                    />
                  );
                })}
              </div>
            </Marquee>
          </div>
        </div>
      </div>
    </>
  );
};
