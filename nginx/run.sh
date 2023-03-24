#!/bin/bash
docker stop nginxc && docker rm nginxc
docker run -d \
    --privileged \
    --name nginxc \
    nginximg
docker logs -f nginxc