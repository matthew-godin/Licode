# Setup

The setup assumes you clone the server repository in your home folder ($HOME or ~ on Linux).

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

Start the server with the following command.

```bash
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts
```

In production, use the following command.

```bash
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts -p &
```

## Websocket Server Installation

Download the Go archive at https://go.dev/dl/.

This is probably the best resource, you may have to set GOROOT and/or GOPATH if you
deviate from the install instructions

https://go.dev/doc/install

You also have to install github.com/gorilla/websocket.
I used go get github.com/gorilla/websocket which is deprecated,
maybe try go install instead.


### Server Installation and Execution

#### Cloning the Repository

```bash
git clone git@github.com:matthew-godin/licode.git
```

#### Building the Front-End Application

Make sure you have Node.js and npm installed as React needs them. This seems to take a long time on the server,
try building on your machine and copying the build/ directory onto the server.

```bash
cd licode/react-app
npm run build
```

#### Setting the Environment Variables

```bash
export DENO_DIR="$HOME/licode/packages"
export LICODE_PORT=3000
```

Add the above two lines to ~/.profile (Linux) if you want these environment variables to still be there when you reboot your system (recommended).

Packages will be saved in the licode repository by setting DENO_DIR with the above value. The packages are what we import using URLs at the top of our TypeScript files. For now, our server will be accessed from port 3000. The LICODE_PORT environment variable is what holds the port our server can be accessed from.

#### Setting up the Sandbox

```bash
sudo docker load < py-sandbox.tar
```

#### Setting Deno to the Right Version

```bash
deno version --upgrade 1.20.3
```

#### Running the Server (on development machine)

#### Running the GO Server (on development machine)

(in /goServer)
```bash
go run server.go
```

#### Running the Server (on the server)
```bash
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts
```

If you go to localhost:3000 on a web browser, you should see our React application.

## Useful Things to Know

### How to Reload Packages

All the packages used by our Deno server were saved in the _packages_ folder the first time we ran "deno run ...".
To reload the packages, run the following.

```bash
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts
```

### How to Not Have to Restart the Server Each Time a Change Is Made

#### Installing Denon

```bash
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
```

#### Starting the Server Such That It Doesn’t Have to Be Restarted Each Time a Change Is Made

```bash
sudo -E $DENO_INSTALL/bin/denon run --allow-all mod.ts
```

### How to Quickly Test the Frontend Application Without a Backend

```bash
cd licode/react-app
npm start
```

### Using the Docker Sandbox

#### Accessing the Sandbox

```bash
sudo docker run -it py-sandbox
cd home/TestEnvironment
```

#### Saving an Image of the Sandbox

```bash
sudo docker ps -a
```

Take note of the most recent Docker instance hash.

```bash
sudo docker commit <most-recent-hash> py-sandbox
sudo docker save py-sandbox > py-sandbox.tar
```

#### Terminating a Sandbox Instance

```bash
sudo docker ps -a
```

Take note of the most recent Docker instance hash.

```bash
sudo docker kill <most-recent-hahs>
```

## Security

### Password Encryption

As done with other aspects of the application, we opt for state-of-the-art technologies when it comes to password encryption. As seen in **ECE 458: Computer Security**, MD5 is 100% insecure, SHA-1 is now considered breakable, and SHA-2 is what most applications are currently using. There's also SHA-3 which was released in 2015 and hasn't been used by many companies yet. However, it's definitely more secure than SHA-2 and that's why we should use it. More specifically, we should use SHA3-512, which has 256 bits security against collision attacks (considered military grade). SHA-3 is also much more secure than SHA-2 when it comes to length extension attacks. Most websites use scrypt or bcrypt to store their passwords which doesn't hold to the best security standards and isn't even approved by NIST.

#### User Registration

We generate a random salt. We then save: _Hash_(_password_ || _salt_) and _salt_.

#### User Authentication

We perform Hash(_password_ || _salt_) and compare it with the saved hash. If the two hashes match, the user logs in succesfully.


## Database Management

### Database Migrations

We use a simple Python script called migrations.py. To add or remove database tables or columns, we create a migration file and run it using migrations.py.

Create a new migration file by running the following.

```bash
python migrations/migrations.py make <migration-name>
```

Edit the migration file that just got created (should be printed by the migrations utility).

To run all migration files and update the database accordingly, run the following.

```bash
sudo apt install libpq-dev python3-dev
pip install psycopg2
python migrations/migrations.py migrate
```

For more information about migrations.py, visit:

https://github.com/matthew-godin/migrations
