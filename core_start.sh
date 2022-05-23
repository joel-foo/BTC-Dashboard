#!/usr/bin/env bash

echo "Checking for Bitcoin Core..."

displayMessage() {
  echo "You do not have Bitcoin Core installed. Please install it at https://bitcoin.org/en/download"
  exit 1
}

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  DIR="$HOME/.bitcoin/"
  if [ ! -d "$DIR" ]; then
    displayMessage
  fi
  
elif [[ "$OSTYPE" == "darwin"* ]]; then
  DIR="$HOME/Library/Application Support/Bitcoin/"
  if [ ! -d "$DIR" ]; then
    displayMessage
  fi
  
elif [[ "$OSTYPE" == 'msys'* ]]; then
  DIR="$APPDATA/Bitcoin/"
  if [ ! -d "$DIR" ]; then
    displayMessage
  fi
  
else
  echo "$OSTYPE is not supported"
  exit 1
  
fi

# Check if bitcoin core is already running. Stop it and re-run with server and daemon. 

echo "Starting bitcoin core now........."

blockchainInfo=$(bitcoin-cli getblockchaininfo) 2>/dev/null

if [[ $blockchainInfo != *'Could not connect'* ]]; then
  bitcoin-cli stop 
  sleep 5
fi

bitcoind -server -daemon

echo "Waiting for bitcoin node....This process can take a few minutes...."

until $blockchainInfo; do
  # Check if rpc credentials are configured correctly
  if [[ $blockchaininfo == *'Could not locate RPC credentials'* ]]; then
    echo "Please configure your rpcuser and rpcpassword credentials in bitcoin.conf first!"
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
npm i 2>/dev/null && npm run build 2>/dev/null && npm run start 2>/dev/null & 

# Build client
until cd client && npm i 2>/dev/null && npm run build 2>/dev/null && serve -s build; do
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000/

  elif [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000/

  elif [[ "$OSTYPE" == "msys"* ]]; then
    start http://localhost:3000/
  fi
  done &