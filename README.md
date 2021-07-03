# licode

A confrontational coding platform.

## Setup

### Initial Setup

#### Install Deno

##### Linux and Mac

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

##### Windows

```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

#### Server Installation and Execution

```
git clone https://github.com/matthew-godin/licode
cd licode
export DENO_DIR=<path-to-licode>/licode/packages
deno run --allow-net src/main.ts 
```

#### Have DENO_DIR Permanently Set On Your System

Add the following line to ~/.profile (on Linux).
```
export DENO_DIR=<path-to-licode>/licode/packages
```

### Reload Packages

```
deno run --allow-net --reload src/main.ts 
```

### Not Have to Restart the Server Each Time a Change Is Made

#### Install Denon

```
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
```

#### Start Server That Doesn't Need to Be Restarted When a Change Is Made

```
denon run --allow-net src/main.ts 
```
