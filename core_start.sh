#!/usr/bin/env bash

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

# Check if bitcoin core is already running. Stop it and re-run with server and daemon. 

echo "Starting bitcoin core now........."

blockchainInfo=$(bitcoin-cli getblockchaininfo) 2>/dev/null

if [[ $blockchainInfo != *'Could not connect'* ]]; then
  echo "Stopping current instance of Bitcoin Core and initating reconnection in 10 seconds..."
  bitcoin-cli stop 
  sleep 10
fi

bitcoind -server -daemon

echo "Waiting for bitcoin node....This process can take a few minutes...."

until $blockchainInfo; do
  # Check if rpc credentials are configured correctly
  if [[ $blockchaininfo == *'Could not locate RPC credentials'* ]]; then
    echo "Please configure your rpcuser and rpcpassword credentials in bitcoin.conf first."
    exit 1
  fi
  sleep 1
done

if [[ $blockchainInfo == *'"pruned":true'* ]]; then
  echo "Your node is a pruned one."
  exit 1
fi

echo "Building your dashboard now..."

# Build server
(npm i; npm run build; npm run start) &>/dev/null 2>&1

# Build client
(cd client; npm i; npm run build; serve -s build; xdg-open http://localhost:3000/) &>/dev/null 2>&1; 
# do
#   if [[ "$OSTYPE" == "linux-gnu"* ]]; then
#     xdg-open http://localhost:3000/

  # elif [[ "$OSTYPE" == "darwin"* ]]; then
  #   open http://localhost:3000/

  # elif [[ "$OSTYPE" == "msys"* ]]; then
  #   start http://localhost:3000/
  # fi
  # done &