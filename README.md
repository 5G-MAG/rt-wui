# MBMS Web User Interface

This repository holds the Web User Interface for the MBMS Modem, MBMS Middleware and Applicaiton within the 5G-MAG Reference Tools.

## Introduction

The 5G-MAG Reference Tools Webinterface (rt-wui) provides an optional graphical webinterface with a control display for each 5G-MAG Reference Tools process (MBMS Modem, MBMS Middleware, Application). Its main purpose is to collect and display useful information from the MBMS Modem, MBMS Middleware and Application Process. It also enables use cases where the 5G-MAG Reference Tools can be used for simple measurements (e.g., mobile measurements) or as a standalone device (e.g., set-top box, mobile phone/tablet showcase).

### About the implementation

The *rt-wui* consists of three tabs, one for each process. Data from the processes are collected using their respective RestAPI.

![Architecture](https://github.com/5G-MAG/Documentation-and-Architecture/blob/main/media/architecture/5G-MAG%20RT%20Architecture%20Current%20Architecture%205G%20Media%20Client%20v8.drawio.png)

Being accessible over http(s) makes *rt-wui* ideal for remote monitoring related 5G-MAG Reference Tools processes.

## Install dependencies
For the webinterface an additional package to the dependencies in *MBMS Modem* (see [here](https://github.com/5G-MAG/rt-mbms-modem)) has to be installed for building:
````
sudo apt update
sudo apt install npm nginx
````

## Downloading
````
cd ~
git clone https://github.com/5G-MAG/rt-wui
````

## Installing
````
cd rt-wui
npm install 
````

As a last step you have to enable the nginx site, to allow requests to the 5G-MAG Reference Tools Webinterface over http.

### Creating a symbolic link
Change to the sites-enabled directory and create a symbolic link from the rt-wui file in sites-available. After that, delete the default sym link:

````
cd /etc/nginx/sites-enabled
sudo ln -s ../sites-available/5gmag-rt-wui 5gmag-rt-wui
sudo rm default
````

### Restart and enable autostart for nginx
After creating the symbolic links, nginx has to be restarted. To always have the Webinterface available at startup, you can enable autostart via systemctl:
````
sudo systemctl restart nginx.service
sudo systemctl enable nginx.service
````
## Running

### Manual start/stop

````
cd ~
cd rt-wui
node app.js 
````

You can access the *rt-wui* interface through the nginx server on port 80 in your browser: `` http://<ip address> ``. If *rt-modem* is running.
Click [here](https://github.com/5G-MAG/rt-wui/main/README.md#running-example) for an
example screenshot.

### Background process (**recommended**)

The *rt-wui* can also be configured to run in background (as a daemon). Therefore, the ExecStart path needs to
be adjusted to the right app.js application.

**Step 1:** Get the right path to your app.js file

Go to your 5G-MAG Reference Tools Webinterface repo:

````
cd ~
cd rt-wui
pwd
````

This will output you the path to your folder. For example:

````
/home/my-user-name/rt-wui
````

**Step 2:** Change the ExecStart path

Navigate to the ``rt-wui.service`` file:

````
cd ~
cd rt-wui/supporting_files/
````

open the ``rt-wui.service`` file with an editor, it should look like this:

````
[Service]
< ... >
ExecStart=/usr/bin/node /home/user-name/rt-wui/app.js
< ... >
````

Replace the path to the app.js file with the path from the first step, e.g.:

````
[Service]
< ... >
ExecStart=/usr/bin/node /home/my-user-name/rt-wui/app.js
< ... >
````

save and exit.

**Step 3:** Copy to systemd

Copy the file to the systemd folder:

````
sudo cp rt-wui.service /lib/systemd/system/
````

**Step 4:** Reload the daemon

````
sudo systemctl daemon-reload
````

You can now run the Webinterface in the background. The standard systemd mechanisms can be used to control the
webinterface:

| Command | Result |
| ------------- |-------------|
|  `` systemctl start rt-wui.service `` | Manually start the process in background |
|  `` systemctl stop rt-wui.service `` | Manually stop the process in background |
|  `` systemctl status rt-wui.service `` | Show process status |
|  `` systemctl disable rt-wui.service `` | Disable autostart, *rt-wui* will no be started after reboot |
|  `` systemctl enable rt-wui.service `` | Enable autostart, *rt-wui* will be started automatically after reboot |

### Running example
![Architecture](https://github.com/5G-MAG/Documentation-and-Architecture/blob/main/media/wiki/Webiface_rp.PNG)

## Docker Implementation

An easy to use docker Implentation is also available. The `wui` and `nginx` folder contains all the essential files for running the process in independent containers. Please check into the [wiki](https://github.com/5G-MAG/Documentation-and-Architecture/wiki/5G-MAG-Reference-Tools:-Docker-Implementation-of-RT-MBMS-processes) page for a detailed description on how to run the processes in docker containers. 
