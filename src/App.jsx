import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TWITTER_HANDLE_VIKING = '0xViking';
const TWITTER_LINK_VIKING = `https://twitter.com/${TWITTER_HANDLE_VIKING}`;
const RUNE_LINK = "http://xahlee.info/comp/unicode_runic.html";

const App = () => {
  /* This function holds the logic for deciding if a Phantom Wallet is connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
        }
      } else {
        alert('This is a Solana Project! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

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


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">VIKINGS (ᚡᛁᚴᛁᚿᚵ) Universe</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
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
