export CONTAINER=27ca61238c86
export HOST_PORT=4200
export CONTAINER_PORT=4200
export CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${CONTAINER})

docker run --rm -p ${HOST_PORT}:${CONTAINER_PORT} alpine/socat TCP-LISTEN:${CONTAINER_PORT},fork TCP-CONNECT:${CONTAINER_IP}:${CONTAINER_PORT}


