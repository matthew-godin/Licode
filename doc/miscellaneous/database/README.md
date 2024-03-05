# Database

## Create a Migration File to Update the Database Schema

Perform the following command to generate an empty migration file. This file will contain the SQL code performing the changes to the schema.

```bash
python migrations/migrations.py make <migration-name>
```

Edit the generated file with changes to be made to the schema.

Perform all changes to the database schema by running the following command.

```bash
python migrations/migrations.py migrate
```
