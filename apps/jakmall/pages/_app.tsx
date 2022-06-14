// import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
// import { useRouter } from 'next/router'
import { ThemeProvider } from 'styled-components'
import './styles.css';
import './styles.styl';

const theme = {
  bgColor: {
    main: "#FF8A00",
    secondary: "#FFFAE6",
    green: '#1BD97B',
    red: '#f2300c',
    orange: '#FF8A00',
    placeholder: 'rgba(0, 0, 0, 0.6)',
    greyBorder: '#cbcbcb',
  }
};

function CustomApp({ Component, pageProps }: AppProps) {
  /* const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? 'with' : 'without'
        } shallow routing`
      )
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, []) */

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Transaction Inquiry</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon-32x32.png"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}

export default CustomApp;
