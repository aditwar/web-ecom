import { Suspense } from 'react';
import LoadingComp from '@/app/loading';
import RegisterForm from '@/components/form/registerForm';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="grid h-[calc(100vh-94px)] grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center bg-transparent text-primary-foreground">
              <Image
                src="/assets/svg/logo.svg"
                alt="LOGO"
                priority={true}
                width={1000}
                height={1000}
                className="size-8"
              />
            </div>
            Event Commerce
          </a>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-xs">
            <Suspense fallback={<LoadingComp />}>
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/assets/png/createform.png"
          alt="Image"
          className="absolute inset-0 object-cover w-full h-full dark:grayscale"
        />
      </div>
    </div>
  );
}
