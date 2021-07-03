# licode

A confrontational coding platform.

## Setup

#### To Install Deno

##### Linux and Mac

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

##### Windows

```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

### Initial Setup

```
git clone https://github.com/matthew-godin/licode
cd licode
export DENO_DIR=<path-to-licode>/licode/packages
deno run --allow-net src/main.ts 
```
### To Reload Packages

```
deno run --allow-net --reload src/main.ts 
```

### To Not Have to Restart the Server Each Time a Change Is Made

#### To Install Denon

```
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
```

```
denon run --allow-net --reload src/main.ts 
```
