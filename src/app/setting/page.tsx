import { Suspense } from 'react';
import LoadingComp from '../loading';
import NavbarSetting from '@/components/NavSetting';
import Wrapper from '@/components/wrapper';
import ProfileSettingForm from '@/components/form/ProfileSettingForm';

export default function SettingPage() {
  return (
    <>
      <Suspense fallback={<LoadingComp />}>
        <div className="flex justify-center items-center w-full h-[calc(100vh-154px)] mb-[50px]">
          <NavbarSetting />
          <div className="flex w-auto justify-center items-center mt-[100px]">
            <div className="container">
              <div className="hidden lg:flex items-center justify-center pb-5">
                <h2>Setting Page</h2>
              </div>
              <Wrapper>
                <ProfileSettingForm />
              </Wrapper>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
