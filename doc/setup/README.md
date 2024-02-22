# Setup

## 1. Database Installation

### [Link](https://github.com/matthew-godin/Licode/tree/master/doc/setup/database)

## 2. REST API Server Installation

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Add the following two lines to ~/.bashrc.

```bash
export DENO_INSTALL="/$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
```

Add the following two lines to ~/.profile.

```bash
export DENO_DIR="$HOME/licode/packages"
export LICODE_PORT=3000
```

Start the REST API server with the following command.

```bash
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts
```

In production, use the following command.

```bash
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts -p &
```

## 3. Websocket Server Installation

Download the Go archive at https://go.dev/dl/.

```bash
rm -rf /usr/local/go
tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
go install github.com/gorilla/websocket@latest
```

Start the Websocket server with the following command.

```bash
go run server.go
```

In production, use the following command.

```bash
go run server.go &
```

## 4. Code Execution Sandbox Installation

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker load < py-sandbox.tar
```

## 5. Front-End Application Installation

```bash
sudo apt update
sudo apt install nodejs
udo apt install npm
```

On development machine, start the front-end application with the following command.

```bash
npm run start
```

In production, run the following command and copy the contents of **build/** to the appropriate location.

```bash
npm run build
```
