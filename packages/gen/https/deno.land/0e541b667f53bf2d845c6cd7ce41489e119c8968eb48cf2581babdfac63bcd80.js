import { parseConnectionUri } from "../utils/utils.ts";
import { ConnectionParamsError } from "../client/error.ts";
import { fromFileUrl, isAbsolute } from "../deps.ts";
function getPgEnv() {
    return {
        database: Deno.env.get("PGDATABASE"),
        hostname: Deno.env.get("PGHOST"),
        port: Deno.env.get("PGPORT"),
        user: Deno.env.get("PGUSER"),
        password: Deno.env.get("PGPASSWORD"),
        applicationName: Deno.env.get("PGAPPNAME"),
    };
}
function formatMissingParams(missingParams) {
    return `Missing connection parameters: ${missingParams.join(", ")}`;
}
function assertRequiredOptions(options, requiredKeys, has_env_access) {
    const missingParams = [];
    for (const key of requiredKeys) {
        if (options[key] === "" ||
            options[key] === null ||
            options[key] === undefined) {
            missingParams.push(key);
        }
    }
    if (missingParams.length) {
        let missing_params_message = formatMissingParams(missingParams);
        if (!has_env_access) {
            missing_params_message +=
                "\nConnection parameters can be read from environment variables only if Deno is run with env permission";
        }
        throw new ConnectionParamsError(missing_params_message);
    }
}
function parseOptionsFromUri(connString) {
    let postgres_uri;
    try {
        const uri = parseConnectionUri(connString);
        postgres_uri = {
            application_name: uri.params.application_name,
            dbname: uri.path || uri.params.dbname,
            driver: uri.driver,
            host: uri.host || uri.params.host,
            password: uri.password || uri.params.password,
            port: uri.port || uri.params.port,
            sslmode: uri.params.ssl === "true"
                ? "require"
                : uri.params.sslmode,
            user: uri.user || uri.params.user,
        };
    }
    catch (e) {
        throw new ConnectionParamsError(`Could not parse the connection string due to ${e}`);
    }
    if (!["postgres", "postgresql"].includes(postgres_uri.driver)) {
        throw new ConnectionParamsError(`Supplied DSN has invalid driver: ${postgres_uri.driver}.`);
    }
    const host_type = postgres_uri.host
        ? (isAbsolute(postgres_uri.host) ? "socket" : "tcp")
        : "socket";
    let tls;
    switch (postgres_uri.sslmode) {
        case undefined: {
            break;
        }
        case "disable": {
            tls = { enabled: false, enforce: false, caCertificates: [] };
            break;
        }
        case "prefer": {
            tls = { enabled: true, enforce: false, caCertificates: [] };
            break;
        }
        case "require": {
            tls = { enabled: true, enforce: true, caCertificates: [] };
            break;
        }
        default: {
            throw new ConnectionParamsError(`Supplied DSN has invalid sslmode '${postgres_uri.sslmode}'. Only 'disable', 'require', and 'prefer' are supported`);
        }
    }
    return {
        applicationName: postgres_uri.application_name,
        database: postgres_uri.dbname,
        hostname: postgres_uri.host,
        host_type,
        password: postgres_uri.password,
        port: postgres_uri.port,
        tls,
        user: postgres_uri.user,
    };
}
const DEFAULT_OPTIONS = {
    applicationName: "deno_postgres",
    connection: {
        attempts: 1,
    },
    host: "127.0.0.1",
    socket: "/tmp",
    host_type: "socket",
    port: 5432,
    tls: {
        enabled: true,
        enforce: false,
        caCertificates: [],
    },
};
export function createParams(params = {}) {
    if (typeof params === "string") {
        params = parseOptionsFromUri(params);
    }
    let pgEnv = {};
    let has_env_access = true;
    try {
        pgEnv = getPgEnv();
    }
    catch (e) {
        if (e instanceof Deno.errors.PermissionDenied) {
            has_env_access = false;
        }
        else {
            throw e;
        }
    }
    const provided_host = params.hostname ?? pgEnv.hostname;
    const host_type = params.host_type ??
        (provided_host ? "tcp" : DEFAULT_OPTIONS.host_type);
    if (!["tcp", "socket"].includes(host_type)) {
        throw new ConnectionParamsError(`"${host_type}" is not a valid host type`);
    }
    let host;
    if (host_type === "socket") {
        const socket = provided_host ?? DEFAULT_OPTIONS.socket;
        try {
            if (!isAbsolute(socket)) {
                const parsed_host = new URL(socket, Deno.mainModule);
                if (parsed_host.protocol === "file:") {
                    host = fromFileUrl(parsed_host);
                }
                else {
                    throw new ConnectionParamsError("The provided host is not a file path");
                }
            }
            else {
                host = socket;
            }
        }
        catch (e) {
            throw new ConnectionParamsError(`Could not parse host "${socket}" due to "${e}"`);
        }
    }
    else {
        host = provided_host ?? DEFAULT_OPTIONS.host;
    }
    let port;
    if (params.port) {
        port = Number(params.port);
    }
    else if (pgEnv.port) {
        port = Number(pgEnv.port);
    }
    else {
        port = DEFAULT_OPTIONS.port;
    }
    if (Number.isNaN(port) || port === 0) {
        throw new ConnectionParamsError(`"${params.port ?? pgEnv.port}" is not a valid port number`);
    }
    if (host_type === "socket" && params?.tls) {
        throw new ConnectionParamsError(`No TLS options are allowed when host type is set to "socket"`);
    }
    const tls_enabled = !!(params?.tls?.enabled ?? DEFAULT_OPTIONS.tls.enabled);
    const tls_enforced = !!(params?.tls?.enforce ?? DEFAULT_OPTIONS.tls.enforce);
    if (!tls_enabled && tls_enforced) {
        throw new ConnectionParamsError("Can't enforce TLS when client has TLS encryption is disabled");
    }
    const connection_options = {
        applicationName: params.applicationName ?? pgEnv.applicationName ??
            DEFAULT_OPTIONS.applicationName,
        connection: {
            attempts: params?.connection?.attempts ??
                DEFAULT_OPTIONS.connection.attempts,
        },
        database: params.database ?? pgEnv.database,
        hostname: host,
        host_type,
        password: params.password ?? pgEnv.password,
        port,
        tls: {
            enabled: tls_enabled,
            enforce: tls_enforced,
            caCertificates: params?.tls?.caCertificates ?? [],
        },
        user: params.user ?? pgEnv.user,
    };
    assertRequiredOptions(connection_options, ["applicationName", "database", "hostname", "host_type", "port", "user"], has_env_access);
    return connection_options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbl9wYXJhbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25uZWN0aW9uX3BhcmFtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLFlBQVksQ0FBQztBQXlCckQsU0FBUyxRQUFRO0lBQ2YsT0FBTztRQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7UUFDcEMsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQzVCLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDNUIsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztRQUNwQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0tBQzNDLENBQUM7QUFDSixDQUFDO0FBb0VELFNBQVMsbUJBQW1CLENBQUMsYUFBdUI7SUFDbEQsT0FBTyxrQ0FDTCxhQUFhLENBQUMsSUFBSSxDQUNoQixJQUFJLENBRVIsRUFBRSxDQUFDO0FBQ0wsQ0FBQztBQVNELFNBQVMscUJBQXFCLENBQzVCLE9BQXFDLEVBQ3JDLFlBQXFDLEVBQ3JDLGNBQXVCO0lBRXZCLE1BQU0sYUFBYSxHQUE0QixFQUFFLENBQUM7SUFDbEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUU7UUFDOUIsSUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtZ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Q0FBQyxlQUFlLElBQUksS0FBSyxDQUFDLGVBQWU7WUFDOUQsZUFBZSxDQUFDLGVBQWU7UUFDakMsVUFBVSxFQUFFO1lBQ1YsUUFBUSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUTtnQkFDcEMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxRQUFRO1NBQ3RDO1FBQ0QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFFBQVE7UUFDM0MsUUFBUSxFQUFFLElBQUk7UUFDZCxTQUFTO1FBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFFBQVE7UUFDM0MsSUFBSTtRQUNKLEdBQUcsRUFBRTtZQUNILE9BQU8sRUFBRSxXQUFXO1lBQ3BCLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLGNBQWMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLGNBQWMsSUFBSSxFQUFFO1NBQ2xEO1FBQ0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUk7S0FDaEMsQ0FBQztJQUVGLHFCQUFxQixDQUNuQixrQkFBa0IsRUFDbEIsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQ3hFLGNBQWMsQ0FDZixDQUFDO0lBRUYsT0FBTyxrQkFBa0IsQ0FBQztBQUM1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcGFyc2VDb25uZWN0aW9uVXJpIH0gZnJvbSBcIi4uL3V0aWxzL3V0aWxzLnRzXCI7XG5pbXBvcnQgeyBDb25uZWN0aW9uUGFyYW1zRXJyb3IgfSBmcm9tIFwiLi4vY2xpZW50L2Vycm9yLnRzXCI7XG5pbXBvcnQgeyBmcm9tRmlsZVVybCwgaXNBYnNvbHV0ZSB9IGZyb20gXCIuLi9kZXBzLnRzXCI7XG5cbi8qKlxuICogVGhlIGNvbm5lY3Rpb24gc3RyaW5nIG11c3QgbWF0Y2ggdGhlIGZvbGxvd2luZyBVUkkgc3RydWN0dXJlLiBBbGwgcGFyYW1ldGVycyBidXQgZGF0YWJhc2UgYW5kIHVzZXIgYXJlIG9wdGlvbmFsXG4gKlxuICogYHBvc3RncmVzOi8vdXNlcjpwYXNzd29yZEBob3N0bmFtZTpwb3J0L2RhdGFiYXNlP3NzbG1vZGU9bW9kZS4uLmBcbiAqXG4gKiBZb3UgY2FuIGFkZGl0aW9uYWxseSBwcm92aWRlIHRoZSBmb2xsb3dpbmcgdXJsIHNlYXJjaCBwYXJhbWV0ZXJzXG4gKlxuICogLSBhcHBsaWNhdGlvbl9uYW1lXG4gKiAtIGRibmFtZVxuICogLSBob3N0XG4gKiAtIHBhc3N3b3JkXG4gKiAtIHBvcnRcbiAqIC0gc3NsbW9kZVxuICogLSB1c2VyXG4gKi9cbmV4cG9ydCB0eXBlIENvbm5lY3Rpb25TdHJpbmcgPSBzdHJpbmc7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiByZXRyaWV2ZXMgdGhlIGNvbm5lY3Rpb24gb3B0aW9ucyBmcm9tIHRoZSBlbnZpcm9ubWVudGFsIHZhcmlhYmxlc1xuICogYXMgdGhleSBhcmUsIHdpdGhvdXQgYW55IGV4dHJhIHBhcnNpbmdcbiAqXG4gKiBJdCB3aWxsIHRocm93IGlmIG5vIGVudiBwZXJtaXNzaW9uIHdhcyBwcm92aWRlZCBvbiBzdGFydHVwXG4gKi9cbmZ1bmN0aW9uIGdldFBnRW52KCk6IENsaWVudE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIGRhdGFiYXNlOiBEZW5vLmVudi5nZXQoXCJQR0RBVEFCQVNFXCIpLFxuICAgIGhvc3RuYW1lOiBEZW5vLmVudi5nZXQoXCJQR0hPU1RcIiksXG4gICAgcG9ydDogRGVuby5lbnYuZ2V0KFwiUEdQT1JUXCIpLFxuICAgIHVzZXI6IERlbm8uZW52LmdldChcIlBHVVNFUlwiKSxcbiAgICBwYXNzd29yZDogRGVuby5lbnYuZ2V0KFwiUEdQQVNTV09SRFwiKSxcbiAgICBhcHBsaWNhdGlvbk5hbWU6IERlbm8uZW52LmdldChcIlBHQVBQTkFNRVwiKSxcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBhbnkgY2xpZW50IHdpbGwgb25seSBhdHRlbXB0IHRvIHN0YWJsaXNoXG4gICAqIGNvbm5lY3Rpb24gd2l0aCB5b3VyIGRhdGFiYXNlIG9uY2UuIFNldHRpbmcgdGhpcyBwYXJhbWV0ZXJcbiAgICogd2lsbCBjYXVzZSB0aGUgY2xpZW50IHRvIGF0dGVtcHQgcmVjb25uZWN0aW9uIGFzIG1hbnkgdGltZXNcbiAgICogYXMgcmVxdWVzdGVkIGJlZm9yZSBlcnJvcmluZ1xuICAgKlxuICAgKiBkZWZhdWx0OiBgMWBcbiAgICovXG4gIGF0dGVtcHRzOiBudW1iZXI7XG59XG5cbnR5cGUgVExTTW9kZXMgPSBcImRpc2FibGVcIiB8IFwicHJlZmVyXCIgfCBcInJlcXVpcmVcIjtcblxuLy8gVE9ET1xuLy8gUmVmYWN0b3IgZW5hYmxlZCBhbmQgZW5mb3JjZSBpbnRvIG9uZSBzaW5nbGUgb3B0aW9uIGZvciAxLjBcbmV4cG9ydCBpbnRlcmZhY2UgVExTT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBJZiBUTFMgc3VwcG9ydCBpcyBlbmFibGVkIG9yIG5vdC4gSWYgdGhlIHNlcnZlciByZXF1aXJlcyBUTFMsXG4gICAqIHRoZSBjb25uZWN0aW9uIHdpbGwgZmFpbC5cbiAgICpcbiAgICogRGVmYXVsdDogYHRydWVgXG4gICAqL1xuICBlbmFibGVkOiBib29sZWFuO1xuICAvKipcbiAgICogVGhpcyB3aWxsIGZvcmNlIHRoZSBjb25uZWN0aW9uIHRvIHJ1biBvdmVyIFRMU1xuICAgKiBJZiB0aGUgc2VydmVyIGRvZXNuJ3Qgc3VwcG9ydCBUTFMsIHRoZSBjb25uZWN0aW9uIHdpbGwgZmFpbFxuICAgKlxuICAgKiBEZWZhdWx0OiBgZmFsc2VgXG4gICAqL1xuICBlbmZvcmNlOiBib29sZWFuO1xuICAvKipcbiAgICogQSBsaXN0IG9mIHJvb3QgY2VydGlmaWNhdGVzIHRoYXQgd2lsbCBiZSB1c2VkIGluIGFkZGl0aW9uIHRvIHRoZSBkZWZhdWx0XG4gICAqIHJvb3QgY2VydGlmaWNhdGVzIHRvIHZlcmlmeSB0aGUgc2VydmVyJ3MgY2VydGlmaWNhdGUuXG4gICAqXG4gICAqIE11c3QgYmUgaW4gUEVNIGZvcm1hdC5cbiAgICpcbiAgICogRGVmYXVsdDogYFtdYFxuICAgKi9cbiAgY2FDZXJ0aWZpY2F0ZXM6IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudE9wdGlvbnMge1xuICBhcHBsaWNhdGlvbk5hbWU/OiBzdHJpbmc7XG4gIGNvbm5lY3Rpb24/OiBQYXJ0aWFsPENvbm5lY3Rpb25PcHRpb25zPjtcbiAgZGF0YWJhc2U/OiBzdHJpbmc7XG4gIGhvc3RuYW1lPzogc3RyaW5nO1xuICBob3N0X3R5cGU/OiBcInRjcFwiIHwgXCJzb2NrZXRcIjtcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIHBvcnQ/OiBzdHJpbmcgfCBudW1iZXI7XG4gIHRscz86IFBhcnRpYWw8VExTT3B0aW9ucz47XG4gIHVzZXI/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50Q29uZmlndXJhdGlvbiB7XG4gIGFwcGxpY2F0aW9uTmFtZTogc3RyaW5nO1xuICBjb25uZWN0aW9uOiBDb25uZWN0aW9uT3B0aW9ucztcbiAgZGF0YWJhc2U6IHN0cmluZztcbiAgaG9zdG5hbWU6IHN0cmluZztcbiAgaG9zdF90eXBlOiBcInRjcFwiIHwgXCJzb2NrZXRcIjtcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIHBvcnQ6IG51bWJlcjtcbiAgdGxzOiBUTFNPcHRpb25zO1xuICB1c2VyOiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1pc3NpbmdQYXJhbXMobWlzc2luZ1BhcmFtczogc3RyaW5nW10pIHtcbiAgcmV0dXJuIGBNaXNzaW5nIGNvbm5lY3Rpb24gcGFyYW1ldGVyczogJHtcbiAgICBtaXNzaW5nUGFyYW1zLmpvaW4oXG4gICAgICBcIiwgXCIsXG4gICAgKVxuICB9YDtcbn1cblxuLyoqXG4gKiBUaGlzIHZhbGlkYXRlcyB0aGUgb3B0aW9ucyBwYXNzZWQgYXJlIGRlZmluZWQgYW5kIGhhdmUgYSB2YWx1ZSBvdGhlciB0aGFuIG51bGxcbiAqIG9yIGVtcHR5IHN0cmluZywgaXQgdGhyb3dzIGEgY29ubmVjdGlvbiBlcnJvciBvdGhlcndpc2VcbiAqXG4gKiBAcGFyYW0gaGFzX2Vudl9hY2Nlc3MgVGhpcyBwYXJhbWV0ZXIgd2lsbCBjaGFuZ2UgdGhlIGVycm9yIG1lc3NhZ2UgaWYgc2V0IHRvIHRydWUsXG4gKiB0ZWxsaW5nIHRoZSB1c2VyIHRvIHBhc3MgZW52IHBlcm1pc3Npb25zIGluIG9yZGVyIHRvIHJlYWQgZW52aXJvbm1lbnRhbCB2YXJpYWJsZXNcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKFxuICBvcHRpb25zOiBQYXJ0aWFsPENsaWVudENvbmZpZ3VyYXRpb24+LFxuICByZXF1aXJlZEtleXM6IChrZXlvZiBDbGllbnRPcHRpb25zKVtdLFxuICBoYXNfZW52X2FjY2VzczogYm9vbGVhbixcbik6IGFzc2VydHMgb3B0aW9ucyBpcyBDbGllbnRDb25maWd1cmF0aW9uIHtcbiAgY29uc3QgbWlzc2luZ1BhcmFtczogKGtleW9mIENsaWVudE9wdGlvbnMpW10gPSBbXTtcbiAgZm9yIChjb25zdCBrZXkgb2YgcmVxdWlyZWRLZXlzKSB7XG4gICAgaWYgKFxuICAgICAgb3B0aW9uc1trZXldID09PSBcIlwiIHx8XG4gICAgICBvcHRpb25zW2tleV0gPT09IG51bGwgfHxcbiAgICAgIG9wdGlvbnNba2V5XSA9PT0gdW5kZWZpbmVkXG4gICAgKSB7XG4gICAgICBtaXNzaW5nUGFyYW1zLnB1c2goa2V5KTtcbiAgICB9XG4gIH1cblxuICBpZiAobWlzc2luZ1BhcmFtcy5sZW5ndGgpIHtcbiAgICBsZXQgbWlzc2luZ19wYXJhbXNfbWVzc2FnZSA9IGZvcm1hdE1pc3NpbmdQYXJhbXMobWlzc2luZ1BhcmFtcyk7XG4gICAgaWYgKCFoYXNfZW52X2FjY2Vzcykge1xuICAgICAgbWlzc2luZ19wYXJhbXNfbWVzc2FnZSArPVxuICAgICAgICBcIlxcbkNvbm5lY3Rpb24gcGFyYW1ldGVycyBjYW4gYmUgcmVhZCBmcm9tIGVudmlyb25tZW50IHZhcmlhYmxlcyBvbmx5IGlmIERlbm8gaXMgcnVuIHdpdGggZW52IHBlcm1pc3Npb25cIjtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgQ29ubmVjdGlvblBhcmFtc0Vycm9yKG1pc3NpbmdfcGFyYW1zX21lc3NhZ2UpO1xuICB9XG59XG5cbi8vIFRPRE9cbi8vIFN1cHBvcnQgbW9yZSBvcHRpb25zIGZyb20gdGhlIHNwZWNcbi8qKiBvcHRpb25zIGZyb20gVVJJIHBlciBodHRwczovL3d3dy5wb3N0Z3Jlc3FsLm9yZy9kb2NzLzE0L2xpYnBxLWNvbm5lY3QuaHRtbCNMSUJQUS1DT05OU1RSSU5HICovXG5pbnRlcmZhY2UgUG9zdGdyZXNVcmkge1xuICBhcHBsaWNhdGlvbl9uYW1lPzogc3RyaW5nO1xuICBkYm5hbWU/OiBzdHJpbmc7XG4gIGRyaXZlcjogc3RyaW5nO1xuICBob3N0Pzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgcG9ydD86IHN0cmluZztcbiAgc3NsbW9kZT86IFRMU01vZGVzO1xuICB1c2VyPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBwYXJzZU9wdGlvbnNGcm9tVXJpKGNvbm5TdHJpbmc6IHN0cmluZyk6IENsaWVudE9wdGlvbnMge1xuICBsZXQgcG9zdGdyZXNfdXJpOiBQb3N0Z3Jlc1VyaTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1cmkgPSBwYXJzZUNvbm5lY3Rpb25VcmkoY29ublN0cmluZyk7XG4gICAgcG9zdGdyZXNfdXJpID0ge1xuICAgICAgYXBwbGljYXRpb25fbmFtZTogdXJpLnBhcmFtcy5hcHBsaWNhdGlvbl9uYW1lLFxuICAgICAgZGJuYW1lOiB1cmkucGF0aCB8fCB1cmkucGFyYW1zLmRibmFtZSxcbiAgICAgIGRyaXZlcjogdXJpLmRyaXZlcixcbiAgICAgIGhvc3Q6IHVyaS5ob3N0IHx8IHVyaS5wYXJhbXMuaG9zdCxcbiAgICAgIHBhc3N3b3JkOiB1cmkucGFzc3dvcmQgfHwgdXJpLnBhcmFtcy5wYXNzd29yZCxcbiAgICAgIHBvcnQ6IHVyaS5wb3J0IHx8IHVyaS5wYXJhbXMucG9ydCxcbiAgICAgIC8vIENvbXBhdGliaWxpdHkgd2l0aCBKREJDLCBub3Qgc3RhbmRhcmRcbiAgICAgIC8vIFRyZWF0IGFzIHNzbG1vZGU9cmVxdWlyZVxuICAgICAgc3NsbW9kZTogdXJpLnBhcmFtcy5zc2wgPT09IFwidHJ1ZVwiXG4gICAgICAgID8gXCJyZXF1aXJlXCJcbiAgICAgICAgOiB1cmkucGFyYW1zLnNzbG1vZGUgYXMgVExTTW9kZXMsXG4gICAgICB1c2VyOiB1cmkudXNlciB8fCB1cmkucGFyYW1zLnVzZXIsXG4gICAgfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFRPRE9cbiAgICAvLyBVc2UgZXJyb3IgY2F1c2VcbiAgICB0aHJvdyBuZXcgQ29ubmVjdGlvblBhcmFtc0Vycm9yKFxuICAgICAgYENvdWxkIG5vdCBwYXJzZSB0aGUgY29ubmVjdGlvbiBzdHJpbmcgZHVlIHRvICR7ZX1gLFxuICAgICk7XG4gIH1cblxuICBpZiAoIVtcInBvc3RncmVzXCIsIFwicG9zdGdyZXNxbFwiXS5pbmNsdWRlcyhwb3N0Z3Jlc191cmkuZHJpdmVyKSkge1xuICAgIHRocm93IG5ldyBDb25uZWN0aW9uUGFyYW1zRXJyb3IoXG4gICAgICBgU3VwcGxpZWQgRFNOIGhhcyBpbnZhbGlkIGRyaXZlcjogJHtwb3N0Z3Jlc191cmkuZHJpdmVyfS5gLFxuICAgICk7XG4gIH1cblxuICAvLyBObyBob3N0IGJ5IGRlZmF1bHQgbWVhbnMgc29ja2V0IGNvbm5lY3Rpb25cbiAgY29uc3QgaG9zdF90eXBlID0gcG9zdGdyZXNfdXJpLmhvc3RcbiAgICA/IChpc0Fic29sdXRlKHBvc3RncmVzX3VyaS5ob3N0KSA/IFwic29ja2V0XCIgOiBcInRjcFwiKVxuICAgIDogXCJzb2NrZXRcIjtcblxuICBsZXQgdGxzOiBUTFNPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBzd2l0Y2ggKHBvc3RncmVzX3VyaS5zc2xtb2RlKSB7XG4gICAgY2FzZSB1bmRlZmluZWQ6IHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiZGlzYWJsZVwiOiB7XG4gICAgICB0bHMgPSB7IGVuYWJsZWQ6IGZhbHNlLCBlbmZvcmNlOiBmYWxzZSwgY2FDZXJ0aWZpY2F0ZXM6IFtdIH07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcInByZWZlclwiOiB7XG4gICAgICB0bHMgPSB7IGVuYWJsZWQ6IHRydWUsIGVuZm9yY2U6IGZhbHNlLCBjYUNlcnRpZmljYXRlczogW10gfTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwicmVxdWlyZVwiOiB7XG4gICAgICB0bHMgPSB7IGVuYWJsZWQ6IHRydWUsIGVuZm9yY2U6IHRydWUsIGNhQ2VydGlmaWNhdGVzOiBbXSB9O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRocm93IG5ldyBDb25uZWN0aW9uUGFyYW1zRXJyb3IoXG4gICAgICAgIGBTdXBwbGllZCBEU04gaGFzIGludmFsaWQgc3NsbW9kZSAnJHtwb3N0Z3Jlc191cmkuc3NsbW9kZX0nLiBPbmx5ICdkaXNhYmxlJywgJ3JlcXVpcmUnLCBhbmQgJ3ByZWZlcicgYXJlIHN1cHBvcnRlZGAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYXBwbGljYXRpb25OYW1lOiBwb3N0Z3Jlc191cmkuYXBwbGljYXRpb25fbmFtZSxcbiAgICBkYXRhYmFzZTogcG9zdGdyZXNfdXJpLmRibmFtZSxcbiAgICBob3N0bmFtZTogcG9zdGdyZXNfdXJpLmhvc3QsXG4gICAgaG9zdF90eXBlLFxuICAgIHBhc3N3b3JkOiBwb3N0Z3Jlc191cmkucGFzc3dvcmQsXG4gICAgcG9ydDogcG9zdGdyZXNfdXJpLnBvcnQsXG4gICAgdGxzLFxuICAgIHVzZXI6IHBvc3RncmVzX3VyaS51c2VyLFxuICB9O1xufVxuXG5jb25zdCBERUZBVUxUX09QVElPTlM6XG4gICYgT21pdDxDbGllbnRDb25maWd1cmF0aW9uLCBcImRhdGFiYXNlXCIgfCBcInVzZXJcIiB8IFwiaG9zdG5hbWVcIj5cbiAgJiB7IGhvc3Q6IHN0cmluZzsgc29ja2V0OiBzdHJpbmcgfSA9IHtcbiAgICBhcHBsaWNhdGlvbk5hbWU6IFwiZGVub19wb3N0Z3Jlc1wiLFxuICAgIGNvbm5lY3Rpb246IHtcbiAgICAgIGF0dGVtcHRzOiAxLFxuICAgIH0sXG4gICAgaG9zdDogXCIxMjcuMC4wLjFcIixcbiAgICBzb2NrZXQ6IFwiL3RtcFwiLFxuICAgIGhvc3RfdHlwZTogXCJzb2NrZXRcIixcbiAgICBwb3J0OiA1NDMyLFxuICAgIHRsczoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGVuZm9yY2U6IGZhbHNlLFxuICAgICAgY2FDZXJ0aWZpY2F0ZXM6IFtdLFxuICAgIH0sXG4gIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYXJhbXMoXG4gIHBhcmFtczogc3RyaW5nIHwgQ2xpZW50T3B0aW9ucyA9IHt9LFxuKTogQ2xpZW50Q29uZmlndXJhdGlvbiB7XG4gIGlmICh0eXBlb2YgcGFyYW1zID09PSBcInN0cmluZ1wiKSB7XG4gICAgcGFyYW1zID0gcGFyc2VPcHRpb25zRnJvbVVyaShwYXJhbXMpO1xuICB9XG5cbiAgbGV0IHBnRW52OiBDbGllbnRPcHRpb25zID0ge307XG4gIGxldCBoYXNfZW52X2FjY2VzcyA9IHRydWU7XG4gIHRyeSB7XG4gICAgcGdFbnYgPSBnZXRQZ0VudigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5QZXJtaXNzaW9uRGVuaWVkKSB7XG4gICAgICBoYXNfZW52X2FjY2VzcyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHByb3ZpZGVkX2hvc3QgPSBwYXJhbXMuaG9zdG5hbWUgPz8gcGdFbnYuaG9zdG5hbWU7XG5cbiAgLy8gSWYgYSBob3N0IGlzIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBjb25uZWN0aW9uIHR5cGUgaXMgVENQXG4gIGNvbnN0IGhvc3RfdHlwZSA9IHBhcmFtcy5ob3N0X3R5cGUgPz9cbiAgICAocHJvdmlkZWRfaG9zdCA/IFwidGNwXCIgOiBERUZBVUxUX09QVElPTlMuaG9zdF90eXBlKTtcbiAgaWYgKCFbXCJ0Y3BcIiwgXCJzb2NrZXRcIl0uaW5jbHVkZXMoaG9zdF90eXBlKSkge1xuICAgIHRocm93IG5ldyBDb25uZWN0aW9uUGFyYW1zRXJyb3IoYFwiJHtob3N0X3R5cGV9XCIgaXMgbm90IGEgdmFsaWQgaG9zdCB0eXBlYCk7XG4gIH1cblxuICBsZXQgaG9zdDogc3RyaW5nO1xuICBpZiAoaG9zdF90eXBlID09PSBcInNvY2tldFwiKSB7XG4gICAgY29uc3Qgc29ja2V0ID0gcHJvdmlkZWRfaG9zdCA/PyBERUZBVUxUX09QVElPTlMuc29ja2V0O1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWlzQWJzb2x1dGUoc29ja2V0KSkge1xuICAgICAgICBjb25zdCBwYXJzZWRfaG9zdCA9IG5ldyBVUkwoc29ja2V0LCBEZW5vLm1haW5Nb2R1bGUpO1xuXG4gICAgICAgIC8vIFJlc29sdmUgcmVsYXRpdmUgcGF0aFxuICAgICAgICBpZiAocGFyc2VkX2hvc3QucHJvdG9jb2wgPT09IFwiZmlsZTpcIikge1xuICAgICAgICAgIGhvc3QgPSBmcm9tRmlsZVVybChwYXJzZWRfaG9zdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IENvbm5lY3Rpb25QYXJhbXNFcnJvcihcbiAgICAgICAgICAgIFwiVGhlIHByb3ZpZGVkIGhvc3QgaXMgbm90IGEgZmlsZSBwYXRoXCIsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9zdCA9IHNvY2tldDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBUT0RPXG4gICAgICAvLyBBZGQgZXJyb3IgY2F1c2VcbiAgICAgIHRocm93IG5ldyBDb25uZWN0aW9uUGFyYW1zRXJyb3IoXG4gICAgICAgIGBDb3VsZCBub3QgcGFyc2UgaG9zdCBcIiR7c29ja2V0fVwiIGR1ZSB0byBcIiR7ZX1cImAsXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBob3N0ID0gcHJvdmlkZWRfaG9zdCA/PyBERUZBVUxUX09QVElPTlMuaG9zdDtcbiAgfVxuXG4gIGxldCBwb3J0OiBudW1iZXI7XG4gIGlmIChwYXJhbXMucG9ydCkge1xuICAgIHBvcnQgPSBOdW1iZXIocGFyYW1zLnBvcnQpO1xuICB9IGVsc2UgaWYgKHBnRW52LnBvcnQpIHtcbiAgICBwb3J0ID0gTnVtYmVyKHBnRW52LnBvcnQpO1xuICB9IGVsc2Uge1xuICAgIHBvcnQgPSBERUZBVUxUX09QVElPTlMucG9ydDtcbiAgfVxuICBpZiAoTnVtYmVyLmlzTmFOKHBvcnQpIHx8IHBvcnQgPT09IDApIHtcbiAgICB0aHJvdyBuZXcgQ29ubmVjdGlvblBhcmFtc0Vycm9yKFxuICAgICAgYFwiJHtwYXJhbXMucG9ydCA/PyBwZ0Vudi5wb3J0fVwiIGlzIG5vdCBhIHZhbGlkIHBvcnQgbnVtYmVyYCxcbiAgICApO1xuICB9XG5cbiAgaWYgKGhvc3RfdHlwZSA9PT0gXCJzb2NrZXRcIiAmJiBwYXJhbXM/LnRscykge1xuICAgIHRocm93IG5ldyBDb25uZWN0aW9uUGFyYW1zRXJyb3IoXG4gICAgICBgTm8gVExTIG9wdGlvbnMgYXJlIGFsbG93ZWQgd2hlbiBob3N0IHR5cGUgaXMgc2V0IHRvIFwic29ja2V0XCJgLFxuICAgICk7XG4gIH1cbiAgY29uc3QgdGxzX2VuYWJsZWQgPSAhIShwYXJhbXM/LnRscz8uZW5hYmxlZCA/PyBERUZBVUxUX09QVElPTlMudGxzLmVuYWJsZWQpO1xuICBjb25zdCB0bHNfZW5mb3JjZWQgPSAhIShwYXJhbXM/LnRscz8uZW5mb3JjZSA/PyBERUZBVUxUX09QVElPTlMudGxzLmVuZm9yY2UpO1xuXG4gIGlmICghdGxzX2VuYWJsZWQgJiYgdGxzX2VuZm9yY2VkKSB7XG4gICAgdGhyb3cgbmV3IENvbm5lY3Rpb25QYXJhbXNFcnJvcihcbiAgICAgIFwiQ2FuJ3QgZW5mb3JjZSBUTFMgd2hlbiBjbGllbnQgaGFzIFRMUyBlbmNyeXB0aW9uIGlzIGRpc2FibGVkXCIsXG4gICAgKTtcbiAgfVxuXG4gIC8vIFRPRE9cbiAgLy8gUGVyaGFwcyB1c2VybmFtZSBzaG91bGQgYmUgdGFrZW4gZnJvbSB0aGUgUEMgdXNlciBhcyBhIGRlZmF1bHQ/XG4gIGNvbnN0IGNvbm5lY3Rpb25fb3B0aW9ucyA9IHtcbiAgICBhcHBsaWNhdGlvbk5hbWU6IHBhcmFtcy5hcHBsaWNhdGlvbk5hbWUgPz8gcGdFbnYuYXBwbGljYXRpb25OYW1lID8/XG4gICAgICBERUZBVUxUX09QVElPTlMuYXBwbGljYXRpb25OYW1lLFxuICAgIGNvbm5lY3Rpb246IHtcbiAgICAgIGF0dGVtcHRzOiBwYXJhbXM/LmNvbm5lY3Rpb24/LmF0dGVtcHRzID8/XG4gICAgICAgIERFRkFVTFRfT1BUSU9OUy5jb25uZWN0aW9uLmF0dGVtcHRzLFxuICAgIH0sXG4gICAgZGF0YWJhc2U6IHBhcmFtcy5kYXRhYmFzZSA/PyBwZ0Vudi5kYXRhYmFzZSxcbiAgICBob3N0bmFtZTogaG9zdCxcbiAgICBob3N0X3R5cGUsXG4gICAgcGFzc3dvcmQ6IHBhcmFtcy5wYXNzd29yZCA/PyBwZ0Vudi5wYXNzd29yZCxcbiAgICBwb3J0LFxuICAgIHRsczoge1xuICAgICAgZW5hYmxlZDogdGxzX2VuYWJsZWQsXG4gICAgICBlbmZvcmNlOiB0bHNfZW5mb3JjZWQsXG4gICAgICBjYUNlcnRpZmljYXRlczogcGFyYW1zPy50bHM/LmNhQ2VydGlmaWNhdGVzID8/IFtdLFxuICAgIH0sXG4gICAgdXNlcjogcGFyYW1zLnVzZXIgPz8gcGdFbnYudXNlcixcbiAgfTtcblxuICBhc3NlcnRSZXF1aXJlZE9wdGlvbnMoXG4gICAgY29ubmVjdGlvbl9vcHRpb25zLFxuICAgIFtcImFwcGxpY2F0aW9uTmFtZVwiLCBcImRhdGFiYXNlXCIsIFwiaG9zdG5hbWVcIiwgXCJob3N0X3R5cGVcIiwgXCJwb3J0XCIsIFwidXNlclwiXSxcbiAgICBoYXNfZW52X2FjY2VzcyxcbiAgKTtcblxuICByZXR1cm4gY29ubmVjdGlvbl9vcHRpb25zO1xufVxuIl19