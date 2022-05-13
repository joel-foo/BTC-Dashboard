#!/usr/bin/env bash

echo "Checking for Bitcoin Core..."

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  DIR="$HOME/.bitcoin/"
  if [ ! -d "$DIR" ]; then
    echo "You do not have Bitcoin Core installed. Please install it at ......"
    exit 1
  fi
  
elif [[ "$OSTYPE" == "darwin"* ]]; then
  DIR="$HOME/Library/Application Support/Bitcoin/"
  if [ ! -d "$DIR" ]; then
    echo "You do not have Bitcoin Core installed. Please install it at ......"
    exit 1
  fi
  
elif [[ "$OSTYPE" == 'msys'* ]]; then
  DIR="$HOME/.bitcoin/"
  if [ ! -d "$DIR" ]; then
    echo "You do not have Bitcoin Core installed. Please install it at ......"
    exit 1
  fi
  
else
  echo "$OSTYPE is not supported"
  exit 1
  
fi


echo "You have bitcoin core installed!"
echo "Starting bitcoin core now........."
bitcoind -server -daemon -rpcuser=minion -rpcpassword=minion 
echo "Waiting for bitcoin node....This process can take a few minutes...."
until bitcoin-cli getblockchaininfo 2>/dev/null; do
  sleep 1
done
echo "Serving up your server and dashboard now..."
node server/index.js & cd client && npm start &

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open http://localhost:3000/
  
elif [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:3000/
  
elif [[ "$OSTYPE" == 'msys'* ]]; then
  start http://localhost:3000/

fi


    
  