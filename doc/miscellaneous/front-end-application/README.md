# Front-End Application

## Reload Packages

Run the following commands to reload the React packages.

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Reload Nginx Front End

Run the following command to reload the front end build into Nginx and have the latest front end application be reflected at **localhost/licode**.

```bash
sudo ./update.sh
```
