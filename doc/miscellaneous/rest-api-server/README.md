# REST API Server

## Security

SHA-512 is used for encryption.

A salt is randomly generated when the user registers. The salt and a hash using the password and salt is saved.

When the user logs in, the hash is made again with the saved salt and the password provided. If the generated hash matches the one saved, the user logs in successfully.

The hash formula is the following formula.

_Hash_(_password_ || _salt_)
