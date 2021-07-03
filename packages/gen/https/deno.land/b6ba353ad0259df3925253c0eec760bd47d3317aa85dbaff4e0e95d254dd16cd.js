import { buildFlags, } from "./scripts.ts";
import { merge } from "./merge.ts";
const reDenoAction = new RegExp(/^(deno +\w+) *(.*)$/);
const reCompact = new RegExp(/^'(?:\\'|.)*?\.(ts|js)'|^"(?:\\"|.)*?\.(ts|js)"|^(?:\\ |\S)+\.(ts|js)$/);
const reCliCompact = new RegExp(/^(run|test|fmt|lint) *(.*)$/);
export class Runner {
    #config;
    #args;
    constructor(config, args = []) {
        this.#config = config;
        this.#args = args;
    }
    cmd(cmd, options) {
        const command = {
            cmd,
            options,
            exe: () => {
                return this.execute(command);
            },
        };
        return command;
    }
    buildCliCommand(args, global) {
        const cmd = args.join(" ");
        let out;
        if (reCompact.test(cmd)) {
            out = ["deno", "run"];
            out = out.concat(stdCmd(cmd));
        }
        else if (reCliCompact.test(cmd)) {
            out = ["deno"];
            out = out.concat(stdCmd(cmd));
        }
        else {
            out = stdCmd(cmd);
        }
        return this.cmd(out, global);
    }
    buildCommands(script, global, args) {
        if (typeof script === "object") {
            const options = Object.assign({}, merge(global, script));
            return this.buildStringCommands(script.cmd, options, args);
        }
        return this.buildStringCommands(script, global, args);
    }
    buildStringCommands(script, global, args) {
        if (script.includes("&&")) {
            const commands = [];
            script.split("&&").map((s) => {
                commands.push(this.buildCommand(s, global, args));
            });
            return commands;
        }
        return [this.buildCommand(script, global, args)];
    }
    buildCommand(cmd, options, cli) {
        let out = [];
        cmd = stdCmd(cmd).join(" ");
        const denoAction = reDenoAction.exec(cmd);
        if (denoAction && denoAction.length === 3) {
            const action = denoAction[1];
            const args = denoAction[2];
            out = out.concat(stdCmd(action));
            out = out.concat(buildFlags(options));
            if (args)
                out = out.concat(stdCmd(args));
        }
        else if (reCompact.test(cmd)) {
            out = ["deno", "run"];
            out = out.concat(buildFlags(options));
            out = out.concat(stdCmd(cmd));
        }
        else {
            out = stdCmd(cmd);
        }
        if (cli)
            out = out.concat(cli);
        return this.cmd(out, options);
    }
    build(script) {
        const g = Object.assign({
            watch: true,
        }, this.#config);
        g.scripts = {};
        const s = this.#config.scripts[script];
        if (!s) {
            if (this.#args.length > 0) {
                return [this.buildCliCommand(this.#args, g)];
            }
            else {
                throw new Error("Script does not exist and CLI args are not provided.");
            }
        }
        const args = this.#args.slice(1);
        let commands = [];
        if (Array.isArray(s)) {
            s.forEach((ss) => {
                commands = commands.concat(this.buildCommands(ss, g, args));
            });
        }
        else {
            commands = commands.concat(this.buildCommands(s, g, args));
        }
        return commands;
    }
    execute(command) {
        const options = {
            cmd: command.cmd,
            env: command.options.env ?? {},
            stdin: command.options.stdin ?? "inherit",
            stdout: command.options.stdout ?? "inherit",
            stderr: command.options.stderr ?? "inherit",
        };
        return Deno.run(options);
    }
}
function stdCmd(cmd) {
    return cmd.trim().replace(/\s\s+/g, " ").split(" ");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cHM6Ly9kZW5vLmxhbmQveC9kZW5vbkAyLjQuOC9zcmMvcnVubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFDTCxVQUFVLEdBS1gsTUFBTSxjQUFjLENBQUM7QUFFdEIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQVVuQyxNQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3ZELE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxDQUMxQix3RUFBd0UsQ0FDekUsQ0FBQztBQUNGLE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFNL0QsTUFBTSxPQUFPLE1BQU07SUFDakIsT0FBTyxDQUFlO0lBQ3RCLEtBQUssQ0FBVztJQUVoQixZQUFZLE1BQW9CLEVBQUUsT0FBaUIsRUFBRTtRQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBRU8sR0FBRyxDQUFDLEdBQWEsRUFBRSxPQUFzQjtRQUMvQyxNQUFNLE9BQU8sR0FBRztZQUNkLEdBQUc7WUFDSCxPQUFPO1lBQ1AsR0FBRyxFQUFFLEdBQWlCLEVBQUU7Z0JBQ3RCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixDQUFDO1NBQ0YsQ0FBQztRQUNGLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxlQUFlLENBQUMsSUFBYyxFQUFFLE1BQXFCO1FBQzNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsSUFBSSxHQUFhLENBQUM7UUFDbEIsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLEdB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