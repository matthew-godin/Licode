# Front-End Application Installation

Run the following commands to install Node.js and npm.

```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

Run the following commands to install Nginx.

```bash
sudo apt update
sudo apt install nginx
sudo rm /var/www/html/index.html
sudo rm /var/www/html/index.nginx-debian.html
sudo mkdir /var/www/html/licode
```

Run the following commands to build the front end and send it to Nginx.

```bash
sudo ./update.sh i
```

Replace the contents of __/etc/nginx/sites-enabled/default__ with the following.

```
map $uri $webroot {
	"index.html" "/var/www/html";
	default "/var/www/html";
}

server {
	location /api {
		proxy_pass http://localhost:8000;
	}
	location /homePage {
		proxy_pass http://localhost:5000;
	}
	location /registerPair {
		proxy_pass http://localhost:5000;
	}
	location /ws {
		proxy_pass http://localhost:5000;
	}

	root $webroot;

	listen 80 default_server;
	listen [::]:80 default_server;

	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location /licode {
		alias /var/www/html/licode;
		try_files $uri $uri/ /licode/index.html;
	}
}
```

Run the following commands to start Nginx.

```bash
sudo /etc/init.d/apache2 stop
sudo service nginx restart
```

By now, you should be able to access Licode by navigating to **localhost/licode** on your browser.
