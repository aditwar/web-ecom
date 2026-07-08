'use client';

import { verifyAuth } from '@/lib/auth';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function verifyTokenPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const onVerify = async () => {
    try {
      const { result, ok } = await verifyAuth(params.token);
      if (!ok) throw result.msg;
      toast.success(result.msg);

      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? err);
    }
  };

  useEffect(() => {
    onVerify();
  }, []);

  return (
    <>
      <div>
        <h1 className="flex h-screen justify-center items-center">
          VERIFY TOKEN PAGE
        </h1>
        <p>{params.token}</p>
      </div>
    </>
  );
}
