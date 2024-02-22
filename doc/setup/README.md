# Setup

## 1. Database Installation

```bash
sudo apt install postgresql
sudo -u postgres psql
CREATE USER licode WITH PASSWORD 'edocil';
CREATE DATABASE licode;
GRANT ALL PRIVILEGES ON DATABASE licode to licode;
ALTER USER postgres with password 'my-password';
\q
sudo systemctl restart postgresql
```

On development environment only, install pgAdmin, a GUI tool for Postgres.

```bash
sudo curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add
sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
sudo apt install pgadmin4
```

Open pgAdmin (by searching it in your programs and starting it). It will ask you to set a master password. Set it to _edocil_ for now.

Click on **Add New Server** at the center of the pgAdmin window. In the new window, set **Name** to _pgServer1_. Switch to the **Connection** tab. Set **Host name/address** to _localhost_, **Username** to _licode_, and **Password** to _edocil_. Leave the remaining fields with their default values. Press **Save**. You should now have **pgServer1** under **Servers**, **Databases**, **Login/Group Roles**, and **Tablespaces** under **pgServer1**, and **licode** and **postgres** under **Databases** on the left panel.

Do the following equivalent steps in production.

```bash
sudo -u postgres psql
CREATE EXTENSION postgres_fdw;
CREATE SERVER pgServer1 FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'localhost');
CREATE USER MAPPING FOR licode SERVER pgServer1 OPTIONS (user 'licode', password 'edocil');
\q
sudo systemctl restart postgresql
```

Edit */etc/postgresql/12/main/pg_hba.conf* and replace the first line with the second one below.

```bash
local   all             postgres                                peer
```

```bash
local   all             postgres                                md5
```

Lastly, update the database to the latest schema.

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
