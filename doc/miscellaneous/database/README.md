# Database

## Create a Migration File to Update the Database Schema

```bash
python migrations/migrations.py make <migration-name>
```

Edit the generated file with changes to be made to the schema.

Perform all changes to the database schema by running the following command.

```bash
python migrations/migrations.py migrate
```

For more information about migrations.py, visit:

https://github.com/matthew-godin/migrations
