import type { AppProps } from 'next/app';
import "../styles/globals.css";
import 'prismjs/themes/prism-tomorrow.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;