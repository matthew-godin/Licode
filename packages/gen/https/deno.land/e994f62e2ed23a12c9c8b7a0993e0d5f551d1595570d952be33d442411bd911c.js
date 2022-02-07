import { createHash, isAbsolute, join, normalize, sep, Status, } from "./deps.ts";
import { createHttpError } from "./httpError.ts";
const ENCODE_CHARS_REGEXP = /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g;
const HTAB = "\t".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
const UNMATCHED_SURROGATE_PAIR_REGEXP = /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g;
const UNMATCHED_SURROGATE_PAIR_REPLACE = "$1\uFFFD$2";
export const DEFAULT_CHUNK_SIZE = 16_640;
export const BODY_TYPES = ["string", "number", "bigint", "boolean", "symbol"];
export function decodeComponent(text) {
    try {
        return decodeURIComponent(text);
    }
    catch {
        return text;
    }
}
export function encodeUrl(url) {
    return String(url)
        .replace(UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE)
        .replace(ENCODE_CHARS_REGEXP, encodeURI);
}
export function getRandomFilename(prefix = "", extension = "") {
    return `${prefix}${createHash("sha1").update(crypto.getRandomValues(new Uint8Array(256)))
        .toString("hex")}${extension ? `.${extension}` : ""}`;
}
export function getBoundary() {
    return `oak_${createHash("sha1").update(crypto.getRandomValues(new Uint8Array(256)))
        .toString("hex")}`;
}
export function isAsyncIterable(value) {
    return typeof value === "object" && value !== null &&
        Symbol.asyncIterator in value &&
        typeof value[Symbol.asyncIterator] === "function";
}
export function isRouterContext(value) {
    return "params" in value;
}
export function isReader(value) {
    return typeof value === "object" && value !== null && "read" in value &&
        typeof value.read === "function";
}
function isCloser(value) {
    return typeof value === "object" && value != null && "close" in value &&
        typeof value["close"] === "function";
}
export function isConn(value) {
    return typeof value === "object" && value != null && "rid" in value &&
        typeof value.rid === "number" && "localAddr" in value &&
        "remoteAddr" in value;
}
export function isListenTlsOptions(value) {
    return typeof value === "object" && value !== null && "certFile" in value &&
        "keyFile" in value && "port" in value;
}
export function readableStreamFromReader(reader, options = {}) {
    const { autoClose = true, chunkSize = DEFAULT_CHUNK_SIZE, strategy, } = options;
    return new ReadableStream({
        async pull(controller) {
            const chunk = new Uint8Array(chunkSize);
            try {
                const read = await reader.read(chunk);
                if (read === null) {
                    if (isCloser(reader) && autoClose) {
                        reader.close();
                    }
                    controller.close();
                    return;
                }
                controller.enqueue(chunk.subarray(0, read));
            }
            catch (e) {
                controller.error(e);
                if (isCloser(reader)) {
                    reader.close();
                }
            }
        },
        cancel() {
            if (isCloser(reader) && autoClose) {
                reader.close();
            }
        },
    }, strategy);
}
export function isErrorStatus(value) {
    return [
        Status.BadRequest,
        Status.Unauthorized,
        Status.PaymentRequired,
        Status.Forbidden,
        Status.NotFound,
        Status.MethodNotAllowed,
        Status.NotAcceptable,
        Status.ProxyAuthRequired,
        Status.RequestTimeout,
        Status.Conflict,
        Status.Gone,
        Status.LengthRequired,
        Status.PreconditionFailed,
        Status.RequestEntityTooLarge,
        Status.RequestURITooLong,
        Status.UnsupportedMediaType,
        Status.RequestedRangeNotSatisfiable,
        Status.ExpectationFailed,
        Status.Teapot,
        Status.MisdirectedRequest,
        Status.UnprocessableEntity,
        Status.Locked,
        Status.FailedDependency,
        Status.UpgradeRequired,
        Status.PreconditionRequired,
        Status.TooManyRequests,
        Status.RequestHeaderFieldsTooLarge,
        Status.UnavailableForLegalReasons,
        Status.InternalServerError,
        Status.NotImplemented,
        Status.BadGateway,
        Status.ServiceUnavailable,
        Status.GatewayTimeout,
        Status.HTTPVersionNotSupported,
        Status.VariantAlsoNegotiates,
        Status.InsufficientStorage,
        Status.LoopDetected,
        Status.NotExtended,
        Status.NetworkAuthenticationRequired,
    ].includes(value);
}
export function isRedirectStatus(value) {
    return [
        Status.MultipleChoices,
        Status.MovedPermanently,
        Status.Found,
        Status.SeeOther,
        Status.UseProxy,
        Status.TemporaryRedirect,
        Status.PermanentRedirect,
    ].includes(value);
}
export function isHtml(value) {
    return /^\s*<(?:!DOCTYPE|html|body)/i.test(value);
}
export function skipLWSPChar(u8) {
    const result = new Uint8Array(u8.length);
    let j = 0;
    for (let i = 0; i < u8.length; i++) {
        if (u8[i] === SPACE || u8[i] === HTAB)
            continue;
        result[j++] = u8[i];
    }
    return result.slice(0, j);
}
export function stripEol(value) {
    if (value[value.byteLength - 1] == LF) {
        let drop = 1;
        if (value.byteLength > 1 && value[value.byteLength - 2] === CR) {
            drop = 2;
        }
        return value.subarray(0, value.byteLength - drop);
    }
    return value;
}
const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
export function resolvePath(rootPath, relativePath) {
    let path = relativePath;
    let root = rootPath;
    if (relativePath === undefined) {
        path = rootPath;
        root = ".";
    }
    if (path == null) {
        throw new TypeError("Argument relativePath is required.");
    }
    if (path.includes("\0")) {
        throw createHttpError(400, "Malicious Path");
    }
    if (isAbsolute(path)) {
        throw createHttpError(400, "Malicious Path");
    }
    if (UP_PATH_REGEXP.test(normalize("." + sep + path))) {
        throw createHttpError(403);
    }
    return normalize(join(root, path));
}
export class Uint8ArrayTransformStream extends TransformStream {
    constructor() {
        const init = {
            async transform(chunk, controller) {
                chunk = await chunk;
                switch (typeof chunk) {
                    case "object":
                        if (chunk === null) {
                            controller.terminate();
                        }
                        else if (ArrayBuffer.isView(chunk)) {
                            controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
                        }
                        else if (Array.isArray(chunk) &&
                            chunk.every((value) => typeof value === "number")) {
                            controller.enqueue(new Uint8Array(chunk));
                        }
                        else if (typeof chunk.valueOf === "function" && chunk.valueOf() !== chunk) {
                            this.transform(chunk.valueOf(), controller);
                        }
                        else if ("toJSON" in chunk) {
                            this.transform(JSON.stringify(chunk), controller);
                        }
                        break;
                    case "symbol":
                        controller.error(new TypeError("Cannot transform a symbol to a Uint8Array"));
                        break;
                    case "undefined":
                        controller.error(new TypeError("Cannot transform undefined to a Uint8Array"));
                        break;
                    default:
                        controller.enqueue(this.encoder.encode(String(chunk)));
                }
            },
            encoder: new TextEncoder(),
        };
        super(init);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUNMLFVBQVUsRUFDVixVQUFVLEVBQ1YsSUFBSSxFQUNKLFNBQVMsRUFDVCxHQUFHLEVBQ0gsTUFBTSxHQUNQLE1BQU0sV0FBVyxDQUFDO0FBQ25CLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUlqRCxNQUFNLG1CQUFtQixHQUN2QiwwR0FBMEcsQ0FBQztBQUM3RyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLE1BQU0sK0JBQStCLEdBQ25DLDBFQUEwRSxDQUFDO0FBQzdFLE1BQU0sZ0NBQWdDLEdBQUcsWUFBWSxDQUFDO0FBQ3RELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQztBQUd6QyxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFLOUUsTUFBTSxVQUFVLGVBQWUsQ0FBQyxJQUFZO0lBQzFDLElBQUk7UUFDRixPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pDO0lBQUMsTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDO0tBQ2I7QUFDSCxDQUFDO0FBR0QsTUFBTSxVQUFVLFNBQVMsQ0FBQyxHQUFXO0lBQ25DLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUNmLE9BQU8sQ0FBQywrQkFBK0Is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QUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjEgdGhlIG9hayBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHR5cGUgeyBTdGF0ZSB9IGZyb20gXCIuL2FwcGxpY2F0aW9uLnRzXCI7XG5pbXBvcnQgdHlwZSB7IENvbnRleHQgfSBmcm9tIFwiLi9jb250ZXh0LnRzXCI7XG5pbXBvcnQge1xuICBjcmVhdGVIYXNoLFxuICBpc0Fic29sdXRlLFxuICBqb2luLFxuICBub3JtYWxpemUsXG4gIHNlcCxcbiAgU3RhdHVzLFxufSBmcm9tIFwiLi9kZXBzLnRzXCI7XG5pbXBvcnQgeyBjcmVhdGVIdHRwRXJyb3IgfSBmcm9tIFwiLi9odHRwRXJyb3IudHNcIjtcbmltcG9ydCB0eXBlIHsgUm91dGVQYXJhbXMsIFJvdXRlckNvbnRleHQgfSBmcm9tIFwiLi9yb3V0ZXIudHNcIjtcbmltcG9ydCB0eXBlIHsgRXJyb3JTdGF0dXMsIFJlZGlyZWN0U3RhdHVzIH0gZnJvbSBcIi4vdHlwZXMuZC50c1wiO1xuXG5jb25zdCBFTkNPREVfQ0hBUlNfUkVHRVhQID1cbiAgLyg/OlteXFx4MjFcXHgyNVxceDI2LVxceDNCXFx4M0RcXHgzRi1cXHg1QlxceDVEXFx4NUZcXHg2MS1cXHg3QVxceDdFXXwlKD86W14wLTlBLUZhLWZdfFswLTlBLUZhLWZdW14wLTlBLUZhLWZdfCQpKSsvZztcbmNvbnN0IEhUQUIgPSBcIlxcdFwiLmNoYXJDb2RlQXQoMCk7XG5jb25zdCBTUEFDRSA9IFwiIFwiLmNoYXJDb2RlQXQoMCk7XG5jb25zdCBDUiA9IFwiXFxyXCIuY2hhckNvZGVBdCgwKTtcbmNvbnN0IExGID0gXCJcXG5cIi5jaGFyQ29kZUF0KDApO1xuY29uc3QgVU5NQVRDSEVEX1NVUlJPR0FURV9QQUlSX1JFR0VYUCA9XG4gIC8oXnxbXlxcdUQ4MDAtXFx1REJGRl0pW1xcdURDMDAtXFx1REZGRl18W1xcdUQ4MDAtXFx1REJGRl0oW15cXHVEQzAwLVxcdURGRkZdfCQpL2c7XG5jb25zdCBVTk1BVENIRURfU1VSUk9HQVRFX1BBSVJfUkVQTEFDRSA9IFwiJDFcXHVGRkZEJDJcIjtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NIVU5LX1NJWkUgPSAxNl82NDA7IC8vIDE3IEtpYlxuXG4vKiogQm9keSB0eXBlcyB3aGljaCB3aWxsIGJlIGNvZXJjZWQgaW50byBzdHJpbmdzIGJlZm9yZSBiZWluZyBzZW50LiAqL1xuZXhwb3J0IGNvbnN0IEJPRFlfVFlQRVMgPSBbXCJzdHJpbmdcIiwgXCJudW1iZXJcIiwgXCJiaWdpbnRcIiwgXCJib29sZWFuXCIsIFwic3ltYm9sXCJdO1xuXG4vKiogU2FmZWx5IGRlY29kZSBhIFVSSSBjb21wb25lbnQsIHdoZXJlIGlmIGl0IGZhaWxzLCBpbnN0ZWFkIG9mIHRocm93aW5nLFxuICoganVzdCByZXR1cm5zIHRoZSBvcmlnaW5hbCBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZUNvbXBvbmVudCh0ZXh0OiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHRleHQpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxufVxuXG4vKiogRW5jb2RlcyB0aGUgdXJsIHByZXZlbnRpbmcgZG91YmxlIGVuY29uZGluZyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZVVybCh1cmw6IHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHVybClcbiAgICAucmVwbGFjZShVTk1BVENIRURfU1VSUk9HQVRFX1BBSVJfUkVHRVhQLCBVTk1BVENIRURfU1VSUk9HQVRFX1BBSVJfUkVQTEFDRSlcbiAgICAucmVwbGFjZShFTkNPREVfQ0hBUlNfUkVHRVhQLCBlbmNvZGVVUkkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tRmlsZW5hbWUocHJlZml4ID0gXCJcIiwgZXh0ZW5zaW9uID0gXCJcIik6IHN0cmluZyB7XG4gIHJldHVybiBgJHtwcmVmaXh9JHtcbiAgICBjcmVhdGVIYXNoKFwic2hhMVwiKS51cGRhdGUoY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgyNTYpKSlcbiAgICAgIC50b1N0cmluZyhcImhleFwiKVxuICB9JHtleHRlbnNpb24gPyBgLiR7ZXh0ZW5zaW9ufWAgOiBcIlwifWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGFyeSgpOiBzdHJpbmcge1xuICByZXR1cm4gYG9ha18ke1xuICAgIGNyZWF0ZUhhc2goXCJzaGExXCIpLnVwZGF0ZShjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDI1NikpKVxuICAgICAgLnRvU3RyaW5nKFwiaGV4XCIpXG4gIH1gO1xufVxuXG4vKiogR3VhcmQgZm9yIEFzeW5jIEl0ZXJhYmxlcyAqL1xuLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbmV4cG9ydCBmdW5jdGlvbiBpc0FzeW5jSXRlcmFibGUodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBBc3luY0l0ZXJhYmxlPGFueT4ge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmXG4gICAgU3ltYm9sLmFzeW5jSXRlcmF0b3IgaW4gdmFsdWUgJiZcbiAgICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICAgIHR5cGVvZiAodmFsdWUgYXMgYW55KVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUm91dGVyQ29udGV4dDxQIGV4dGVuZHMgUm91dGVQYXJhbXMsIFMgZXh0ZW5kcyBTdGF0ZT4oXG4gIHZhbHVlOiBDb250ZXh0PFM+LFxuKTogdmFsdWUgaXMgUm91dGVyQ29udGV4dDxQLCBTPiB7XG4gIHJldHVybiBcInBhcmFtc1wiIGluIHZhbHVlO1xufVxuXG4vKiogR3VhcmQgZm9yIGBEZW5vLlJlYWRlcmAuICovXG5leHBvcnQgZnVuY3Rpb24gaXNSZWFkZXIodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBEZW5vLlJlYWRlciB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgXCJyZWFkXCIgaW4gdmFsdWUgJiZcbiAgICB0eXBlb2YgKHZhbHVlIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KS5yZWFkID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIGlzQ2xvc2VyKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgRGVuby5DbG9zZXIge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9IG51bGwgJiYgXCJjbG9zZVwiIGluIHZhbHVlICYmXG4gICAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgICB0eXBlb2YgKHZhbHVlIGFzIFJlY29yZDxzdHJpbmcsIGFueT4pW1wiY2xvc2VcIl0gPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29ubih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIERlbm8uQ29ubiB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT0gbnVsbCAmJiBcInJpZFwiIGluIHZhbHVlICYmXG4gICAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgICB0eXBlb2YgKHZhbHVlIGFzIGFueSkucmlkID09PSBcIm51bWJlclwiICYmIFwibG9jYWxBZGRyXCIgaW4gdmFsdWUgJiZcbiAgICBcInJlbW90ZUFkZHJcIiBpbiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTGlzdGVuVGxzT3B0aW9ucyhcbiAgdmFsdWU6IHVua25vd24sXG4pOiB2YWx1ZSBpcyBEZW5vLkxpc3RlblRsc09wdGlvbnMge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIFwiY2VydEZpbGVcIiBpbiB2YWx1ZSAmJlxuICAgIFwia2V5RmlsZVwiIGluIHZhbHVlICYmIFwicG9ydFwiIGluIHZhbHVlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRhYmxlU3RyZWFtRnJvbVJlYWRlck9wdGlvbnMge1xuICAvKiogSWYgdGhlIGByZWFkZXJgIGlzIGFsc28gYSBgRGVuby5DbG9zZXJgLCBhdXRvbWF0aWNhbGx5IGNsb3NlIHRoZSBgcmVhZGVyYFxuICAgKiB3aGVuIGBFT0ZgIGlzIGVuY291bnRlcmVkLCBvciBhIHJlYWQgZXJyb3Igb2NjdXJzLlxuICAgKlxuICAgKiBEZWZhdWx0cyB0byBgdHJ1ZWAuICovXG4gIGF1dG9DbG9zZT86IGJvb2xlYW47XG5cbiAgLyoqIFRoZSBzaXplIG9mIGNodW5rcyB0byBhbGxvY2F0ZSB0byByZWFkLCB0aGUgZGVmYXVsdCBpcyB+MTZLaUIsIHdoaWNoIGlzXG4gICAqIHRoZSBtYXhpbXVtIHNpemUgdGhhdCBEZW5vIG9wZXJhdGlvbnMgY2FuIGN1cnJlbnRseSBzdXBwb3J0LiAqL1xuICBjaHVua1NpemU/OiBudW1iZXI7XG5cbiAgLyoqIFRoZSBxdWV1aW5nIHN0cmF0ZWd5IHRvIGNyZWF0ZSB0aGUgYFJlYWRhYmxlU3RyZWFtYCB3aXRoLiAqL1xuICBzdHJhdGVneT86IHsgaGlnaFdhdGVyTWFyaz86IG51bWJlciB8IHVuZGVmaW5lZDsgc2l6ZT86IHVuZGVmaW5lZCB9O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGBSZWFkYWJsZVN0cmVhbTxVaW50OEFycmF5PmAgZnJvbSBmcm9tIGEgYERlbm8uUmVhZGVyYC5cbiAqXG4gKiBXaGVuIHRoZSBwdWxsIGFsZ29yaXRobSBpcyBjYWxsZWQgb24gdGhlIHN0cmVhbSwgYSBjaHVuayBmcm9tIHRoZSByZWFkZXJcbiAqIHdpbGwgYmUgcmVhZC4gIFdoZW4gYG51bGxgIGlzIHJldHVybmVkIGZyb20gdGhlIHJlYWRlciwgdGhlIHN0cmVhbSB3aWxsIGJlXG4gKiBjbG9zZWQgYWxvbmcgd2l0aCB0aGUgcmVhZGVyIChpZiBpdCBpcyBhbHNvIGEgYERlbm8uQ2xvc2VyYCkuXG4gKlxuICogQW4gZXhhbXBsZSBjb252ZXJ0aW5nIGEgYERlbm8uRmlsZWAgaW50byBhIHJlYWRhYmxlIHN0cmVhbTpcbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgcmVhZGFibGVTdHJlYW1Gcm9tUmVhZGVyIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZC9pby9tb2QudHNcIjtcbiAqXG4gKiBjb25zdCBmaWxlID0gYXdhaXQgRGVuby5vcGVuKFwiLi9maWxlLnR4dFwiLCB7IHJlYWQ6IHRydWUgfSk7XG4gKiBjb25zdCBmaWxlU3RyZWFtID0gcmVhZGFibGVTdHJlYW1Gcm9tUmVhZGVyKGZpbGUpO1xuICogYGBgXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZGFibGVTdHJlYW1Gcm9tUmVhZGVyKFxuICByZWFkZXI6IERlbm8uUmVhZGVyIHwgKERlbm8uUmVhZGVyICYgRGVuby5DbG9zZXIpLFxuICBvcHRpb25zOiBSZWFkYWJsZVN0cmVhbUZyb21SZWFkZXJPcHRpb25zID0ge30sXG4pOiBSZWFkYWJsZVN0cmVhbTxVaW50OEFycmF5PiB7XG4gIGNvbnN0IHtcbiAgICBhdXRvQ2xvc2UgPSB0cnVlLFxuICAgIGNodW5rU2l6ZSA9IERFRkFVTFRfQ0hVTktfU0laRSxcbiAgICBzdHJhdGVneSxcbiAgfSA9IG9wdGlvbnM7XG5cbiAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbSh7XG4gICAgYXN5bmMgcHVsbChjb250cm9sbGVyKSB7XG4gICAgICBjb25zdCBjaHVuayA9IG5ldyBVaW50OEFycmF5KGNodW5rU2l6ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZWFkID0gYXdhaXQgcmVhZGVyLnJlYWQoY2h1bmspO1xuICAgICAgICBpZiAocmVhZCA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmIChpc0Nsb3NlcihyZWFkZXIpICYmIGF1dG9DbG9zZSkge1xuICAgICAgICAgICAgcmVhZGVyLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRyb2xsZXIuY2xvc2UoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKGNodW5rLnN1YmFycmF5KDAsIHJlYWQpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29udHJvbGxlci5lcnJvcihlKTtcbiAgICAgICAgaWYgKGlzQ2xvc2VyKHJlYWRlcikpIHtcbiAgICAgICAgICByZWFkZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2FuY2VsKCkge1xuICAgICAgaWYgKGlzQ2xvc2VyKHJlYWRlcikgJiYgYXV0b0Nsb3NlKSB7XG4gICAgICAgIHJlYWRlci5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0sXG4gIH0sIHN0cmF0ZWd5KTtcbn1cblxuLyoqIERldGVybWluZXMgaWYgYSBIVFRQIGBTdGF0dXNgIGlzIGFuIGBFcnJvclN0YXR1c2AgKDRYWCBvciA1WFgpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXJyb3JTdGF0dXModmFsdWU6IFN0YXR1cyk6IHZhbHVlIGlzIEVycm9yU3RhdHVzIHtcbiAgcmV0dXJuIFtcbiAgICBTdGF0dXMuQmFkUmVxdWVzdCxcbiAgICBTdGF0dXMuVW5hdXRob3JpemVkLFxuICAgIFN0YXR1cy5QYXltZW50UmVxdWlyZWQsXG4gICAgU3RhdHVzLkZvcmJpZGRlbixcbiAgICBTdGF0dXMuTm90Rm91bmQsXG4gICAgU3RhdHVzLk1ldGhvZE5vdEFsbG93ZWQsXG4gICAgU3RhdHVzLk5vdEFjY2VwdGFibGUsXG4gICAgU3RhdHVzLlByb3h5QXV0aFJlcXVpcmVkLFxuICAgIFN0YXR1cy5SZXF1ZXN0VGltZW91dCxcbiAgICBTdGF0dXMuQ29uZmxpY3QsXG4gICAgU3RhdHVzLkdvbmUsXG4gICAgU3RhdHVzLkxlbmd0aFJlcXVpcmVkLFxuICAgIFN0YXR1cy5QcmVjb25kaXRpb25GYWlsZWQsXG4gICAgU3RhdHVzLlJlcXVlc3RFbnRpdHlUb29MYXJnZSxcbiAgICBTdGF0dXMuUmVxdWVzdFVSSVRvb0xvbmcsXG4gICAgU3RhdHVzLlVuc3VwcG9ydGVkTWVkaWFUeXBlLFxuICAgIFN0YXR1cy5SZXF1ZXN0ZWRSYW5nZU5vdFNhdGlzZmlhYmxlLFxuICAgIFN0YXR1cy5FeHBlY3RhdGlvbkZhaWxlZCxcbiAgICBTdGF0dXMuVGVhcG90LFxuICAgIFN0YXR1cy5NaXNkaXJlY3RlZFJlcXVlc3QsXG4gICAgU3RhdHVzLlVucHJvY2Vzc2FibGVFbnRpdHksXG4gICAgU3RhdHVzLkxvY2tlZCxcbiAgICBTdGF0dXMuRmFpbGVkRGVwZW5kZW5jeSxcbiAgICBTdGF0dXMuVXBncmFkZVJlcXVpcmVkLFxuICAgIFN0YXR1cy5QcmVjb25kaXRpb25SZXF1aXJlZCxcbiAgICBTdGF0dXMuVG9vTWFueVJlcXVlc3RzLFxuICAgIFN0YXR1cy5SZXF1ZXN0SGVhZGVyRmllbGRzVG9vTGFyZ2UsXG4gICAgU3RhdHVzLlVuYXZhaWxhYmxlRm9yTGVnYWxSZWFzb25zLFxuICAgIFN0YXR1cy5JbnRlcm5hbFNlcnZlckVycm9yLFxuICAgIFN0YXR1cy5Ob3RJbXBsZW1lbnRlZCxcbiAgICBTdGF0dXMuQmFkR2F0ZXdheSxcbiAgICBTdGF0dXMuU2VydmljZVVuYXZhaWxhYmxlLFxuICAgIFN0YXR1cy5HYXRld2F5VGltZW91dCxcbiAgICBTdGF0dXMuSFRUUFZlcnNpb25Ob3RTdXBwb3J0ZWQsXG4gICAgU3RhdHVzLlZhcmlhbnRBbHNvTmVnb3RpYXRlcyxcbiAgICBTdGF0dXMuSW5zdWZmaWNpZW50U3RvcmFnZSxcbiAgICBTdGF0dXMuTG9vcERldGVjdGVkLFxuICAgIFN0YXR1cy5Ob3RFeHRlbmRlZCxcbiAgICBTdGF0dXMuTmV0d29ya0F1dGhlbnRpY2F0aW9uUmVxdWlyZWQsXG4gIF0uaW5jbHVkZXModmFsdWUpO1xufVxuXG4vKiogRGV0ZXJtaW5lcyBpZiBhIEhUVFAgYFN0YXR1c2AgaXMgYSBgUmVkaXJlY3RTdGF0dXNgICgzWFgpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUmVkaXJlY3RTdGF0dXModmFsdWU6IFN0YXR1cyk6IHZhbHVlIGlzIFJlZGlyZWN0U3RhdHVzIHtcbiAgcmV0dXJuIFtcbiAgICBTdGF0dXMuTXVsdGlwbGVDaG9pY2VzLFxuICAgIFN0YXR1cy5Nb3ZlZFBlcm1hbmVudGx5LFxuICAgIFN0YXR1cy5Gb3VuZCxcbiAgICBTdGF0dXMuU2VlT3RoZXIsXG4gICAgU3RhdHVzLlVzZVByb3h5LFxuICAgIFN0YXR1cy5UZW1wb3JhcnlSZWRpcmVjdCxcbiAgICBTdGF0dXMuUGVybWFuZW50UmVkaXJlY3QsXG4gIF0uaW5jbHVkZXModmFsdWUpO1xufVxuXG4vKiogRGV0ZXJtaW5lcyBpZiBhIHN0cmluZyBcImxvb2tzXCIgbGlrZSBIVE1MICovXG5leHBvcnQgZnVuY3Rpb24gaXNIdG1sKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIC9eXFxzKjwoPzohRE9DVFlQRXxodG1sfGJvZHkpL2kudGVzdCh2YWx1ZSk7XG59XG5cbi8qKiBSZXR1cm5zIGB1OGAgd2l0aCBsZWFkaW5nIHdoaXRlIHNwYWNlIHJlbW92ZWQuICovXG5leHBvcnQgZnVuY3Rpb24gc2tpcExXU1BDaGFyKHU4OiBVaW50OEFycmF5KTogVWludDhBcnJheSB7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KHU4Lmxlbmd0aCk7XG4gIGxldCBqID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB1OC5sZW5ndGg7IGkrKykge1xuICAgIGlmICh1OFtpXSA9PT0gU1BBQ0UgfHwgdThbaV0gPT09IEhUQUIpIGNvbnRpbnVlO1xuICAgIHJlc3VsdFtqKytdID0gdThbaV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5zbGljZSgwLCBqKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwRW9sKHZhbHVlOiBVaW50OEFycmF5KTogVWludDhBcnJheSB7XG4gIGlmICh2YWx1ZVt2YWx1ZS5ieXRlTGVuZ3RoIC0gMV0gPT0gTEYpIHtcbiAgICBsZXQgZHJvcCA9IDE7XG4gICAgaWYgKHZhbHVlLmJ5dGVMZW5ndGggPiAxICYmIHZhbHVlW3ZhbHVlLmJ5dGVMZW5ndGggLSAyXSA9PT0gQ1IpIHtcbiAgICAgIGRyb3AgPSAyO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUuc3ViYXJyYXkoMCwgdmFsdWUuYnl0ZUxlbmd0aCAtIGRyb3ApO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyohXG4gKiBBZGFwdGVkIGRpcmVjdGx5IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3BpbGxhcmpzL3Jlc29sdmUtcGF0aFxuICogd2hpY2ggaXMgbGljZW5zZWQgYXMgZm9sbG93czpcbiAqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgSm9uYXRoYW4gT25nIDxtZUBqb25nbGViZXJyeS5jb20+XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxOCBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvbiA8ZG91Z0Bzb21ldGhpbmdkb3VnLmNvbT5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbiAqIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuICogJ1NvZnR3YXJlJyksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuICogZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZXG4gKiBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULFxuICogVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcbiAqIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmNvbnN0IFVQX1BBVEhfUkVHRVhQID0gLyg/Ol58W1xcXFwvXSlcXC5cXC4oPzpbXFxcXC9dfCQpLztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYXRoKHJlbGF0aXZlUGF0aDogc3RyaW5nKTogc3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYXRoKHJvb3RQYXRoOiBzdHJpbmcsIHJlbGF0aXZlUGF0aDogc3RyaW5nKTogc3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYXRoKHJvb3RQYXRoOiBzdHJpbmcsIHJlbGF0aXZlUGF0aD86IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBwYXRoID0gcmVsYXRpdmVQYXRoO1xuICBsZXQgcm9vdCA9IHJvb3RQYXRoO1xuXG4gIC8vIHJvb3QgaXMgb3B0aW9uYWwsIHNpbWlsYXIgdG8gcm9vdC5yZXNvbHZlXG4gIGlmIChyZWxhdGl2ZVBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgIHBhdGggPSByb290UGF0aDtcbiAgICByb290ID0gXCIuXCI7XG4gIH1cblxuICBpZiAocGF0aCA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50IHJlbGF0aXZlUGF0aCBpcyByZXF1aXJlZC5cIik7XG4gIH1cblxuICAvLyBjb250YWluaW5nIE5VTEwgYnl0ZXMgaXMgbWFsaWNpb3VzXG4gIGlmIChwYXRoLmluY2x1ZGVzKFwiXFwwXCIpKSB7XG4gICAgdGhyb3cgY3JlYXRlSHR0cEVycm9yKDQwMCwgXCJNYWxpY2lvdXMgUGF0aFwiKTtcbiAgfVxuXG4gIC8vIHBhdGggc2hvdWxkIG5ldmVyIGJlIGFic29sdXRlXG4gIGlmIChpc0Fic29sdXRlKHBhdGgpKSB7XG4gICAgdGhyb3cgY3JlYXRlSHR0cEVycm9yKDQwMCwgXCJNYWxpY2lvdXMgUGF0aFwiKTtcbiAgfVxuXG4gIC8vIHBhdGggb3V0c2lkZSByb290XG4gIGlmIChVUF9QQVRIX1JFR0VYUC50ZXN0KG5vcm1hbGl6ZShcIi5cIiArIHNlcCArIHBhdGgpKSkge1xuICAgIHRocm93IGNyZWF0ZUh0dHBFcnJvcig0MDMpO1xuICB9XG5cbiAgLy8gam9pbiB0aGUgcmVsYXRpdmUgcGF0aFxuICByZXR1cm4gbm9ybWFsaXplKGpvaW4ocm9vdCwgcGF0aCkpO1xufVxuXG4vKiogQSB1dGlsaXR5IGNsYXNzIHRoYXQgdHJhbnNmb3JtcyBcImFueVwiIGNodW5rIGludG8gYW4gYFVpbnQ4QXJyYXlgLiAqL1xuZXhwb3J0IGNsYXNzIFVpbnQ4QXJyYXlUcmFuc2Zvcm1TdHJlYW1cbiAgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJlYW08dW5rbm93biwgVWludDhBcnJheT4ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBpbml0ID0ge1xuICAgICAgYXN5bmMgdHJhbnNmb3JtKFxuICAgICAgICBjaHVuazogdW5rbm93bixcbiAgICAgICAgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8VWludDhBcnJheT4sXG4gICAgICApIHtcbiAgICAgICAgY2h1bmsgPSBhd2FpdCBjaHVuaztcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgY2h1bmspIHtcbiAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICBpZiAoY2h1bmsgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY29udHJvbGxlci50ZXJtaW5hdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGNodW5rKSkge1xuICAgICAgICAgICAgICBjb250cm9sbGVyLmVucXVldWUoXG4gICAgICAgICAgICAgICAgbmV3IFVpbnQ4QXJyYXkoXG4gICAgICAgICAgICAgICAgICBjaHVuay5idWZmZXIsXG4gICAgICAgICAgICAgICAgICBjaHVuay5ieXRlT2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgY2h1bmsuYnl0ZUxlbmd0aCxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgQXJyYXkuaXNBcnJheShjaHVuaykgJiZcbiAgICAgICAgICAgICAgY2h1bmsuZXZlcnkoKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKG5ldyBVaW50OEFycmF5KGNodW5rKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICB0eXBlb2YgY2h1bmsudmFsdWVPZiA9PT0gXCJmdW5jdGlvblwiICYmIGNodW5rLnZhbHVlT2YoKSAhPT0gY2h1bmtcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybShjaHVuay52YWx1ZU9mKCksIGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcInRvSlNPTlwiIGluIGNodW5rKSB7XG4gICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtKEpTT04uc3RyaW5naWZ5KGNodW5rKSwgY29udHJvbGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwic3ltYm9sXCI6XG4gICAgICAgICAgICBjb250cm9sbGVyLmVycm9yKFxuICAgICAgICAgICAgICBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHRyYW5zZm9ybSBhIHN5bWJvbCB0byBhIFVpbnQ4QXJyYXlcIiksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICAgICAgY29udHJvbGxlci5lcnJvcihcbiAgICAgICAgICAgICAgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB0cmFuc2Zvcm0gdW5kZWZpbmVkIHRvIGEgVWludDhBcnJheVwiKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKHRoaXMuZW5jb2Rlci5lbmNvZGUoU3RyaW5nKGNodW5rKSkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW5jb2RlcjogbmV3IFRleHRFbmNvZGVyKCksXG4gICAgfTtcbiAgICBzdXBlcihpbml0KTtcbiAgfVxufVxuIl19