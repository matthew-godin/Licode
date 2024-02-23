# Code Execution Sandbox

## Access the Code Execution Sandbox

```bash
sudo docker run -it py-sandbox
cd home/TestEnvironment
```

## Save an Image of the Code Execution Sandbox

```bash
sudo docker ps -a
sudo docker commit <most-recent-hash> py-sandbox
sudo docker save py-sandbox > py-sandbox.tar
```

## Terminate a Code Execution Sandbox Instance

```bash
sudo docker ps -a
sudo docker kill <most-recent-hahs>
```

## Terminate All Exited Instances

```bash
sudo docker ps --filter status=exited -q | sudo xargs docker rm
```

## List All Docker Images

```bash
sudo docker images
```
