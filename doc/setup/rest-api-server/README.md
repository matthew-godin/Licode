# REST API Server Installation

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
export LICODE_PORT=8000
```

Start the REST API server with the following command.

```bash
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts
```

In production, use the following command.

```bash
sudo -E $DENO_INSTALL/bin/deno run --allow-all mod.ts -p &
```
