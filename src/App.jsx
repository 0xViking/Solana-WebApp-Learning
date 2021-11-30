import React, { useEffect, useState  } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import Like from './assets/Like.png';
// import dislike from './assets/dislike.png';
import './App.css';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from './idl.json';
import kp from './keypair.json'


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TWITTER_HANDLE_VIKING = '0xViking';
const TWITTER_LINK_VIKING = `https://twitter.com/${TWITTER_HANDLE_VIKING}`;
const RUNE_LINK = "http://xahlee.info/comp/unicode_runic.html";
// const TEST_GIFS = [
//   'https://media0.giphy.com/media/LOanJeOqJ0dITDYEKb/200w.webp',
//   'https://media1.giphy.com/media/XAVjfYGohoyP8Hr9qI/200w.webp',
//   'https://media1.giphy.com/media/Xt1xDkrL4z4B0bSU9O/200w.webp',
// 	'https://media2.giphy.com/media/y3CYXAlhHO96E/200w.webp',
// 	'https://media0.giphy.com/media/DrcqyC7RW0Dyu798GJ/200w.webp',
// 	'https://media0.giphy.com/media/Sdjtz57F2inDJLwufy/200w.webp',
// 	'https://media4.giphy.com/media/3osBLsZDAb6RoS3dpS/200w.webp',
//   'https://media0.giphy.com/media/svPPnC3HDSgMjmt9z1/200w.webp'
  
// ];

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}
 

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

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  const youLikeGif = (gifLinkLiked) => {
    console.log("you liked: ",  gifLinkLiked);
    // sendLike();
  }

  // const youDisLikeGif = (index) => {
  //   console.log("you Disliked: ",  gifList[index]);
  // }

  const sendLike = async () => {
	  try {
		const provider = getProvider();
		const program = new Program(idl, programID, provider);

		await program.rpc.likeGif(inputValue, {
		  accounts: {
			baseAccount: baseAccount.publicKey,
			user: provider.wallet.publicKey,
		  },
		});
		console.log("Like to the GIF successfully sent to program", inputValue);

		await getGifList();
	  } catch (error) {
		console.log("Error sending Like to the GIF:", error)
	  }
	};
  
  const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
    await getGifList();

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}

  /* on submit this function will be triggered*/
  const sendGif = async () => {
	  if (inputValue.length === 0) {
		console.log("No gif link given!")
		return
	  }
	  console.log('Gif link:', inputValue);
	  try {
		const provider = getProvider();
		const program = new Program(idl, programID, provider);

		await program.rpc.addGif(inputValue, {
		  accounts: {
			baseAccount: baseAccount.publicKey,
			user: provider.wallet.publicKey,
		  },
		});
		console.log("GIF successfully sent to program", inputValue);

		await getGifList();
    setInputValue("");
	  } catch (error) {
		console.log("Error sending GIF:", error)
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
 const renderConnectedContainer = () => {
	// If we hit this, it means the program account hasn't be initialized.
  if (gifList === null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    )
  } 
	// Otherwise, we're good! Account exists. User can submit GIFs.
	else {
    return(
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
					{/* We use index as the key instead, also, the src is now item.gifLink */}
          {gifList.map((item, index) => (
            <div className="gif-item" key={index}>
              <img alt="gif sent by users" src={item.gifLink} />
              <img alt="Like Button" className="like-button" src={Like} onClick={() => youLikeGif(item.gifLink)} />
               {/* <img alt="DisLike Button" className="dislike" src={dislike} onClick={() => youDisLikeGif(index)} />} */}
              <p className="AddressDisplayed"> {`This GIF is sent by ${item.userAddress}`} </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}


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

  const getGifList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      console.log("Got the account", account)
      setGifList(account.gifList)
  
    } catch (error) {
      console.log("Error in getGifList: ", error)
      setGifList(null);
    }
  }
  
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      getGifList()
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
          <p>** Like Feature ran into Issues(to be specific buffer issues) will be working on it slowly **</p>
          <p className="sub-text">
            <a
            className="footer-text"
            href={RUNE_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Get your name in RUNE`}</a>
          </p>
          {/* Render button only if wallet address is not found*/}
          {!walletAddress && renderNotConnectedContainer()}
          {/* Render GIFS only if wallet address is found*/}
          {walletAddress && renderConnectedContainer()}
          
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text-rune"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with help of @${TWITTER_HANDLE}`}</a>
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
