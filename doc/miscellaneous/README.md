# Miscellaneous

## 1. Database

### [Database](https://github.com/matthew-godin/Licode/tree/master/doc/miscellaneous/database)

## 2. REST API Server

### [REST API Server](https://github.com/matthew-godin/Licode/tree/master/doc/miscellaneous/rest-api-server)

## 3. Websocket Server

### [Websocket Server](https://github.com/matthew-godin/Licode/tree/master/doc/miscellaneous/websocket-server)

## 4. Code Execution Sandbox

### Access the Code Execution Sandbox

```bash
sudo docker run -it py-sandbox
cd home/TestEnvironment
```

### Save an Image of the Code Execution Sandbox

```bash
sudo docker ps -a
sudo docker commit <most-recent-hash> py-sandbox
sudo docker save py-sandbox > py-sandbox.tar
```

### Terminate a Code Execution Sandbox Instance

```bash
sudo docker ps -a
sudo docker kill <most-recent-hahs>
```

## 5. Front-End Application

### Reload Packages

```bash
rm -rf node_modules
rm package-lock.json
npm install
```
