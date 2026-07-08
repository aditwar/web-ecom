import Image from 'next/image';
import Link from 'next/link';

const feature = [
  {
    src: '/assets/svg/search.svg',
    alt: 'Search Icon',
    link: '/feature/marketplace',
    title: 'Search Tickets',
    description:
      'Do not miss the chance to be part of the excitement—browse events now!',
  },
  {
    src: '/assets/svg/shopping.svg',
    alt: 'Shopping Icon',
    link: '/feature/shopping',
    title: 'Buy Tickets',
    description:
      'Tickets are flying fast, secure yours today before they are gone!',
  },
  {
    src: '/assets/svg/selling.svg',
    alt: 'Selling Icon',
    link: '/feature/selling',
    title: 'Sell Tickets',
    description:
      'Be part of the action! Sell your tickets now and do not miss out!',
  },
];

export const Features = () => {
  return (
    <>
      <div className="bg-black text-white items-center md:h-[500px] flex justify-center py-[72px]">
        <div className="container">
          <h2 className="text-center hover:drop-shadow-[0_0_0.3rem_#ffffff]">
            How to Experience Our New Events
          </h2>
          <div className="max-w-xl mx-auto">
            <p className="text-center mt-4 text-white/70">
              Experience events like never before! Learn how you can be part of
              the excitement in a whole new way!
            </p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-7 ">
            {feature.map(({ src, alt, link, title, description }, index) => (
              <div
                key={index}
                className="border border-white/30 p-10 text-center rounded-xl sm:flex-1"
              >
                <Link href={link}>
                  <div className="inline-flex h-14 w-14 bg-white/20 text-black justify-center items-center rounded-lg hover:drop-shadow-[0_0_0.3rem_#ffffff]">
                    <Image
                      src={src}
                      alt={alt}
                      loading="lazy"
                      width={1000}
                      height={1000}
                      className="h-6 w-auto"
                    />
                  </div>
                </Link>
                <h3 className="mt-6 font-bold">{title}</h3>
                <p className="mt-2 text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
