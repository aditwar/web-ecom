import Image from "next/image";

export default function LoadingComp() {
  return (
    <div className="flex w-screen h-screen justify-center items-center bg-black text-white">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/assets/svg/logo.svg"
          alt="LOGO"
          priority={true}
          width={1000}
          height={1000}
          className="h-[230px] w-auto"
        />
        <h2 className="text-center pt-14">Event Commerce by adit_war</h2>
      </div>
    </div>
  );
}
