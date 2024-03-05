# Code Execution Sandbox

## Access the Code Execution Sandbox

Run the following commands to access the code execution sandbox environment.

```bash
sudo docker run -it py-sandbox
cd home/pysandbox/TestEnvironment
```

## Save an Image of the Code Execution Sandbox

Run the following commands to save an archive containing an image of the latest code execution sandbox container.

```bash
sudo docker ps -a
sudo docker commit <most-recent-hash> py-sandbox
sudo docker save py-sandbox > py-sandbox.tar
```

## Terminate a Code Execution Sandbox Instance

Run the following commands to terminate a Docker container.

```bash
sudo docker ps -a
sudo docker kill <most-recent-hash>
```

## Remove All Exited Instances

Run the following commands to remove all the Docker instances that have exited.

```bash
sudo docker ps --filter status=exited -q | sudo xargs docker rm
```

## Remove an Image

Run the following command to remove a Docker image.

```bash
sudo docker images
sudo docker image rm <image-hash>
```
