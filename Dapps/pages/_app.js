import '../styles/globals.css';
import { WalletContextProvider } from '../store/wallet-context';
import Navigator from '../components/Navigation/Navigation';

function MyApp({ Component, pageProps }) {
  return (
    <WalletContextProvider>
      <Navigator />
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

export default MyApp;
