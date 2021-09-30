# Installation guide
Installation of 5G-MAG Reference Tools *Webinterface* consists of 4 Steps:
1. Install dependencies
2. Building the *Webinterface*
3. Post installation configuration
4. Run the *Webinterface*

> The build was tested and verified on Ubuntu 20.04 LTS (64 bit).

## Step 1: Install dependencies
For the webinterface an additional package to the dependencies in *MBMS Modem* (see [here](https://github.com/5G-MAG/rt-mbms-modem#readme)) has to be installed for building:
````
sudo apt update
sudo apt install npm nginx
````

## Step 2: Building the *Webinterface*
### 2.1 Getting the source code
````
cd ~
git clone https://github.com/5G-MAG/rt-wui
````

### 2.2 Installing
````
cd rt-wui
npm install 
````

## Step 3: Post installation configuration
As a last step you have to enable the nginx site, to allow requests to the 5G-MAG Reference Tools Webinterface over http.

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
After installing, make sure to follow the instructions in the *Documentation and Architecture* repository to [run the *5G-MAG Reference Tools Webinterface*](https://github.com/5G-MAG/Documentation-and-Architecture/wiki/Webinterface#Run-the-Webinterface).
