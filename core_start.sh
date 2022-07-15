#!/usr/bin/env bash
kill -9 $(lsof -i:3000 -t)
kill -9 $(lsof -i:3001 -t)

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

blockchainInfo=$(bitcoin-cli getblockchaininfo) &>/dev/null 2>&1

if [[ $blockchainInfo != *'Could not connect'* ]]; then
  echo "Stopping current instance of Bitcoin Core and initating reconnection in 10 seconds..."
  bitcoin-cli stop >/dev/null 2>&1
  sleep 10
fi

bitcoind -server -daemon

echo "Waiting for bitcoin node....This process can take a few minutes...."

until bitcoin-cli getblockchaininfo >/dev/null 2>&1
do
  blockchainInfo=$(bitcoin-cli getblockchaininfo) >/dev/null 2>&1
  if [[ $blockchainInfo == *'Could not locate RPC credentials'* ]]; then
    echo "Please configure your rpcuser and rpcpassword credentials in bitcoin.conf first."
    exit 1
  fi
  sleep 1
done

blockchainInfo=$(bitcoin-cli getblockchaininfo) >/dev/null 2>&1
if [[ $blockchainInfo == *'"pruned":true'* ]]; then
  echo "Your node is a pruned one."
  exit 1
fi

echo "Building your dashboard now..."

# Build server
(npm i; npm run build; npm run start) &>/dev/null 2>&1

# Build client
(cd client; npm i; npm run build; serve -s build) &>/dev/null 2>&1 && { echo "Completed!"; xdg-open http://localhost:3000/}
# do
#   if [[ "$OSTYPE" == "linux-gnu"* ]]; then
#     xdg-open http://localhost:3000/

  # elif [[ "$OSTYPE" == "darwin"* ]]; then
  #   open http://localhost:3000/

  # elif [[ "$OSTYPE" == "msys"* ]]; then
  #   start http://localhost:3000/
  # fi
  # done &