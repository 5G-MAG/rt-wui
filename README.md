# Installation guide
Installation of OBECA *Webinterface* consists of 4 Steps:
1. Install dependencies
2. Building the *Webinterface*
3. Post installation configuration
4. Run the *Webinterface*

> The build was tested and verified on Ubuntu 20.04 LTS (64 bit).

## Step 1: Install dependencies
For the webinterface an additional package to the dependencies in *Receive Process* (see [here](https://github.com/Austrian-Broadcasting-Services/obeca-receive-process#readme)) has to be installed for building:
````
sudo apt update
sudo apt install npm nginx
````

## Step 2: Building the *Webinterface*
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

## Step 3: Post installation configuration
As a last step you have to enable the obeca nginx site, to allow requests to the OBECA Webinterface over http.

### 3.1 Creating a symbolic link
Change to the sites-enabled directory and create a symbolic link from the obeca file in sites-available. After that, delete the default sym link:

````
cd /etc/nginx/sites-enabled
sudo ln -s ../sites-available/obeca obeca
sudo rm default
````

### 3.2 Restart and enable autostart for nginx
After creating the symbolic links, nginx has to be restarted. To always have the Webinterface available at startup, you can enable autostart via systmctl:
````
sudo systemctl restart nginx.service
sudo systemctl enable nginx.service
````

## Step 4: Run the *Webinterface*
After installing, make sure to follow the instructions in the *OBECA-Info* repository to [run the *OBECA Webinterface*](https://github.com/Austrian-Broadcasting-Services/obeca-info/wiki/Webinterface#run-the-webinterface).
