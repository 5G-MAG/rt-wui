#!/bin/bash
docker stop wuic && docker rm wuic
docker run -it --rm \
    --privileged \
    --name wuic \
    wuiimg
docker logs -f wuic