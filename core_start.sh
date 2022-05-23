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

echo "You have bitcoin core installed!"

echo "Starting bitcoin core now........."
bitcoind -server -daemon
echo "Waiting for bitcoin node....This process can take a few minutes...."
until bitcoin-cli getblockchaininfo 2>/dev/null; do
  sleep 1
done

blockchainInfo=$(bitcoin-cli getblockchaininfo)
if [[ $blockchainInfo == *'"pruned":true'* ]]; then
  echo "Your node is a pruned one."
  exit 1
fi

echo "Serving up your server and dashboard now..."
npm i && npm run build && npm run start & cd client && npm i && npm run build && serve -s build &

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open http://localhost:3000/

elif [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:3000/

elif [[ "$OSTYPE" == "msys"* ]]; then
  start http://localhost:3000/

fi