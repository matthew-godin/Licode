# REST API Server

## Reload Packages

Run the following commands to reload the Deno packages.

```bash
rm -rf packages
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts
```

## Make Server Follow Code Changes in Real Time

Run the following commands to be able to edit the Deno codebase and have the changes be reflected in real time.

```bash
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
sudo -E $DENO_INSTALL/bin/denon run --allow-all mod.ts
```

## Update Deno

Run the following command to update Deno to the latest version.

```bash
deno upgrade
```

## Security

SHA3-512 is used for encryption.

A salt is randomly generated when the user registers. The salt and a hash using the password and salt is saved.

When the user logs in, the hash is made again with the saved salt and the password provided. If the generated hash matches the one saved, the user logs in successfully.

The hash formula is the following formula.

_Hash_(_password_ || _salt_)
