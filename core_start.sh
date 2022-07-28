#!/usr/bin/env bash
kill -9 $(lsof -i:3000 -t)
kill -9 $(lsof -i:8080 -t)

echo "Checking for Bitcoin Core..."

check(){
  if [ ! -d $1 ]; then
    echo "You do not have Bitcoin Core installed. Please install it at https://bitcoin.org/en/download. Ensure you have bitcoind added to your path."
    exit 1
  fi
  which bitcoind
  if [$? != 0 ]; then
    echo "You have Bitcoin Core installed but have not added bitcoind to your path variables."
    exit 1
  fi
}


if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  DIR="$HOME/.bitcoin/"
 
elif [[ "$OSTYPE" == "darwin"* ]]; then
  DIR="$HOME/Library/Application Support/Bitcoin/"

elif [[ "$OSTYPE" == 'msys'* ]]; then
  DIR="$APPDATA/Bitcoin/"
 
else
  echo "$OSTYPE is not supported"
  exit 1

check "$DIR"
fi

read -p "Enter the path to your bitcoin data directory (default is $HOME/.bitcoin/): " datadir
echo "Checking $datadir..."
if [ ! -d $datadir ]; then
  echo "Data directory does not exist."
  exit 1
fi

# Check if bitcoin core is already running. Stop it and re-run with server and daemon.
echo "Starting bitcoin core now........."

blockchainInfo=$(bitcoin-cli -datadir=$datadir getblockchaininfo >/dev/null 2>&1)

if [[ $blockchainInfo != *'Could not connect'* ]]; then
  echo "Stopping current instance of Bitcoin Core and initating reconnection in 15 seconds..."
  sleep 15
fi

bitcoind -server -daemon -datadir=$datadir 

echo "Waiting for bitcoin node....This process can take a few minutes...."

until blockchainInfo
do
  if [[ $blockchainInfo == *'Could not locate RPC credentials'* ]]; then
    echo "Please configure your rpcuser and rpcpassword credentials in bitcoin.conf first."
    exit 1
  fi
  sleep 1
  blockchainInfo=$(bitcoin-cli getblockchaininfo >/dev/null 2>&1)
done

if [[ $blockchainInfo == *'"pruned":true'* ]]; then
  echo "Your node is a pruned one."
  exit 1
fi

echo "Building your dashboard now..."

# Build server then client
(git clone https://github.com/joel-foo/nakamoto-node.git; cd nakamoto-node; echo -e "RPC_USER=user\nRPC_PASSWORD=password" >> .env; npm i; npm run build; nohup npm run start >/dev/null 2>&1 &); (cd client; npm i; npm run build; nohup serve -s build -p 8080 >/dev/null 2>&1 &); xdg-open 'http://localhost:8080'