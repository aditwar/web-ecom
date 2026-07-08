import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  const images = [
    {
      src: '/assets/svg/facebook.svg',
      alt: 'Facebook Logo',
      link: 'https://www.facebook.com/adityawardana.wardana',
    },
    {
      src: '/assets/svg/instagram.svg',
      alt: 'Instagram Logo',
      link: 'https://www.instagram.com/adit_war/',
    },
    {
      src: '/assets/svg/twitter.svg',
      alt: 'Twitter Logo',
      link: 'https://x.com/adit_wardna',
    },
    {
      src: '/assets/svg/youtube.svg',
      alt: 'Youtube Logo',
      link: 'https://www.youtube.com/@adityawardana5348/community',
    },
  ];
  return (
    <>
      <footer className="hidden lg:flex w-full pt-5 pb-[50px] font-light text-base justify-center items-center border-t border-gray-20">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-20 max-w-3xl mx-auto">
            <div className="flex items-center justify-center">
              © 2025 adit_war | All rights reserved
            </div>
            <div className="flex flex-row items-center gap-5">
              {images.map(({ src, alt, link }, index) => {
                return (
                  <div key={index}>
                    <Link href={link}>
                      <Image
                        src={src}
                        alt={alt}
                        priority={true}
                        width={1000}
                        height={1000}
                        className="h-5 w-auto drop-shadow-[0_0_0.1rem_#fff] hover:drop-shadow-[0_0_0.5rem_#ff00b3] transition"
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
