# Your personal Bitcoin Core Dashboard

This dashboard uses nakamotonode (see: https://github.com/joel-foo/nakamoto-node) as its API which will run on localhost:3000.

The aim is to build a block explorer based on your full node, without relying on external block explorers such as blockchain.com or blockstream.info.

The dashboard itself will be available at localhost:8080.

## Installing from source :

    npm i -g typescript serve

    git clone https://github.com/joel-foo/BTC-Dashboard.git

    cd BTC-Dashboard

    bash core_start.sh

Prerequisities:

- Bitcoin full node
- Git
- NodeJS

# If you have not configured bitcoin.conf (or have no idea what this means):

1. Open a text editor/notepad and add the following:

   rpcuser=user

   rpcpassword=password

Save the file as **bitcoin.conf**.

Sample bitcoin.conf:
server=1
listen=1
rpcuser=user
rpcpassword=password
txindex=1
datadir=/mnt/bitcoin
zmqpubrawblock=tcp://127.0.0.1:28332
zmqpubrawtx=tcp://127.0.0.1:28333

2. Depending on your OS, navigate to the respective default Bitcoin directory as follows:

  <img width="1025" alt="Screenshot 2022-05-13 at 10 06 39 PM" src="https://user-images.githubusercontent.com/76934561/168301365-4d93cd2c-1c58-4ae6-82c5-9370eaae408b.png">
  
  (Source: https://en.bitcoin.it/wiki/Running_Bitcoin)

3. Copy the newly created **bitcoin.conf** file into the Bitcoin directory.
