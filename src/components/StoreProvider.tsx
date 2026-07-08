'use client';

import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionProvider } from 'next-auth/react';
import { AppStore, makeStore } from '@/redux/store';
import LoadingComp from '@/app/loading';
import AuthProvider from '@/components/AuthProvider';

export default function StoreProviders({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        persistor={persistStore(storeRef.current)}
        loading={<LoadingComp />}
      >
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}
