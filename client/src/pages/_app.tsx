"use client"

import React, { useEffect } from 'react';
import type { AppProps } from 'next/app'; // Import AppProps for typing
import '../styles/globals.css'; // Import global CSS
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import Header from '@/components/WebsitePage/Header';
import { Appbar } from '@/components/Appbar';
import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/WebsitePage/Footer';

function MyApp({ Component, pageProps }: AppProps) {


  return (
    <SessionProvider session={pageProps.session}>
    <Provider store={store}>
      <Header />
      <Appbar />
      <Component {...pageProps} />
      <div className='h-64'>
      <Footer />
      </div>
    </Provider>
    </SessionProvider>
  );
}

export default MyApp;