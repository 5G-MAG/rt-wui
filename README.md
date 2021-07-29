# Installation guide
Installation of OBECA *Webinterface* consists of 2 Steps:
1. Install dependencies
2. Building the *Webinterface*

> The build was tested and verified on Ubuntu 20.04 LTS (64 bit).

## Step 1: Install dependencies
For the webinterface an additional package to the dependencies in *Receive Process* (see [here](https://github.com/Austrian-Broadcasting-Services/obeca-receive-process#readme)) has to be installed for building:
````
sudo apt update
sudo apt install npm
````

## Step 2: Building the Webinterface
### 2.1 Getting the source code
````
cd ~
git clone --recurse-submodules git@github.com:Austrian-Broadcasting-Services/obeca-web-interface.git
````
> **_NOTE:_** You need to have a GitHub user with a private/public key pair to clone the repository. For more details on private/public key go to your GitHub account -> Settings -> SSH and GPG keys 

### 2.2 Installing
````
cd obeca-web-interface
npm install 
````
