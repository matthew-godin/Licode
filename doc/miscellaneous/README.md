# Miscellaneous

## 1. Database

### [Database](https://github.com/matthew-godin/Licode/tree/master/doc/miscellaneous/database)

## 2. REST API Server

### Reload Packages

```bash
rm -rf packages
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts
```

### Make Server Follow Code Changes in Real Time

```bash
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
sudo -E $DENO_INSTALL/bin/denon run --allow-all mod.ts
```

### Security

SHA3-512 is used for encryption.

A salt is randomly generated when the user registers. The salt and a hash using the password and salt is saved.

When the user logs in, the hash is made again with the saved salt and the password provided. If the generated hash matches the one saved, the user logs in successfully.

The hash formula is the following formula.

_Hash_(_password_ || _salt_)

## 3. Websocket Server

### Reload Packages

```bash
go install https://github.com/gorilla/websocket@latest
```

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
