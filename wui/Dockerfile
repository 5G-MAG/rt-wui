FROM ubuntu:20.04
RUN apt-get update && \ 
    apt-get install sudo && DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
    tzdata \
    ssh g++ git libboost-atomic-dev \
    libboost-thread-dev libboost-system-dev \
    libboost-date-time-dev libboost-regex-dev \
    libboost-filesystem-dev libboost-random-dev \
    libboost-chrono-dev libboost-serialization-dev \
    libwebsocketpp-dev openssl libssl-dev \
    ninja-build libspdlog-dev libmbedtls-dev \
    libboost-all-dev libconfig++-dev libsctp-dev \
    libfftw3-dev vim libcpprest-dev libusb-1.0-0-dev \
    net-tools smcroute python-psutil python3-pip \
    clang-tidy gpsd gpsd-clients libgps-dev \
    libgmime-3.0-dev libtinyxml2-dev \
    libtinyxml2-6a 
RUN sudo apt-get -y install cmake
RUN sudo pip3 install cpplint && \
    sudo apt-get install -y npm nginx
RUN mkdir -p /home/rt-wui
WORKDIR /home/rt-wui/
RUN git clone https://github.com/5G-MAG/rt-wui .
RUN npm install && \
    npm audit fix
RUN rm -rf app/controllers/api/*
COPY middleware.js modem.js app/controllers/api/
WORKDIR /home/rt-wui/
ENTRYPOINT [ "/usr/bin/node", "app.js" ]