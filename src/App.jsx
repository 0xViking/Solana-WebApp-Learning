import React, { useEffect, useState  } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TWITTER_HANDLE_VIKING = '0xViking';
const TWITTER_LINK_VIKING = `https://twitter.com/${TWITTER_HANDLE_VIKING}`;
const RUNE_LINK = "http://xahlee.info/comp/unicode_runic.html";
const TEST_GIFS = [
  'https://media0.giphy.com/media/ciwu7KL0A1Q3QdyMKN/200w.webp',
  'https://media1.giphy.com/media/XAVjfYGohoyP8Hr9qI/200w.webp',
  'https://media1.giphy.com/media/Xt1xDkrL4z4B0bSU9O/200w.webp',
	'https://media2.giphy.com/media/y3CYXAlhHO96E/200w.webp',
	'https://media0.giphy.com/media/DrcqyC7RW0Dyu798GJ/200w.webp',
	'https://media0.giphy.com/media/Sdjtz57F2inDJLwufy/200w.webp',
	'https://media4.giphy.com/media/3osBLsZDAb6RoS3dpS/200w.webp',
  'https://media0.giphy.com/media/svPPnC3HDSgMjmt9z1/200w.webp'
  
]

const App = () => {

  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  /* This function holds the logic for deciding if a Phantom Wallet is connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          /*The solana object gives us a function that will allow us to connect directly with the user's wallet!
         */
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );
        /*
          * Set the user's publicKey in state to be used later!
          */
        setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('This is a Solana Project! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  /* fires this function when there is achange in input field */
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  /* on submit this function will be triggered*/
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
    } else {
      console.log('Empty input. Try again.');
    }
  };

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /* Will display GIF after wallet is connected */
  const renderConnectedContainer = () => (
  <div className="connected-container">
    {/* For Input  */}
    <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
      <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange}/>
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {gifList.map(gif => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);


  return (
    <div className="App">
        <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">VIKINGS (ᚡᛁᚴᛁᚿᚵ) Universe</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Render button only if wallet address is not found*/}
          {!walletAddress && renderNotConnectedContainer()}
          {/* Render GIFS only if wallet address is found*/}
          {walletAddress && renderConnectedContainer()}
          <p className="sub-text">
            <a
            className="footer-text"
            href={RUNE_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Get your name in RUNE`}</a>
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text-rune"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with support from @${TWITTER_HANDLE}`}</a>
          <a
            className="footer-text-rune"
            href={TWITTER_LINK_VIKING}
            target="_blank"
            rel="noreferrer"
          >{`BY @${TWITTER_HANDLE_VIKING}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
