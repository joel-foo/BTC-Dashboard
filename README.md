# Your personal Bitcoin Core Dashboard

This dashboard uses nakamotonode (see: https://github.com/joel-foo/nakamoto-node) as its API which will run on localhost:3000.

The aim is to build a block explorer based on your full node, reducing reliance on external block explorers such as blockchain.com or blockstream.info which often track your IP addresses as well as the addresses you are interested in.

The dashboard itself will be available at localhost:8080.

## Installing from source :

    npm i -g typescript serve

    git clone https://github.com/joel-foo/BTC-Dashboard.git

    cd BTC-Dashboard

    bash core_start.sh

Prerequisities:

- Bitcoin full node (approximately 490GB of disk space at time of writing)
- Git
- NodeJS

## If you have not configured bitcoin.conf (or have no idea what this means):

1. Open a text editor/notepad and add your desired username and password:

   rpcuser={your username}

   rpcpassword=password={your password}

   #only required if you want to use certain commands, check out nakamotonode.com to learn more
   txindex=1

Save the file as **bitcoin.conf**.

2. Depending on your OS, navigate to the respective default Bitcoin directory as follows:

  <img width="1025" alt="Screenshot 2022-05-13 at 10 06 39 PM" src="https://user-images.githubusercontent.com/76934561/168301365-4d93cd2c-1c58-4ae6-82c5-9370eaae408b.png">
  
  (Source: https://en.bitcoin.it/wiki/Running_Bitcoin)

3. Copy the newly created **bitcoin.conf** file into the Bitcoin directory.
