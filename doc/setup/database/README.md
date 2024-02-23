# Database Installation

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

```bash
sudo apt install libpq-dev python3-dev
pip install psycopg2
python migrations/migrations.py migrate
```
