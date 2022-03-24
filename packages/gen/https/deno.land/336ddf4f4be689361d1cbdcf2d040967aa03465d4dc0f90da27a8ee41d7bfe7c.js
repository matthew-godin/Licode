import { assert } from "./util.ts";
const encoder = new TextEncoder();
const DEFAULT_KEEP_ALIVE_INTERVAL = 30_000;
class CloseEvent extends Event {
    constructor(eventInit) {
        super("close", eventInit);
    }
}
export class ServerSentEvent extends Event {
    #data;
    #id;
    #type;
    constructor(type, data, eventInit = {}) {
        super(type, eventInit);
        const { replacer, space } = eventInit;
        this.#type = type;
        try {
            this.#data = typeof data === "string"
                ? data
                : JSON.stringify(data, replacer, space);
        }
        catch (e) {
            assert(e instanceof Error);
            throw new TypeError(`data could not be coerced into a serialized string.\n  ${e.message}`);
        }
        const { id } = eventInit;
        this.#id = id;
    }
    get data() {
        return this.#data;
    }
    get id() {
        return this.#id;
    }
    toString() {
        const data = `data: ${this.#data.split("\n").join("\ndata: ")}\n`;
        return `${this.#type === "__message" ? "" : `event: ${this.#type}\n`}${this.#id ? `id: ${String(this.#id)}\n` : ""}${data}\n`;
    }
}
const RESPONSE_HEADERS = [
    ["Connection", "Keep-Alive"],
    ["Content-Type", "text/event-stream"],
    ["Cache-Control", "no-cache"],
    ["Keep-Alive", `timeout=${Number.MAX_SAFE_INTEGER}`],
];
export class SSEStreamTarget extends EventTarget {
    #closed = false;
    #context;
    #controller;
    #keepAliveId;
    #error(error) {
        console.log("error", error);
        this.dispatchEvent(new CloseEvent({ cancelable: false }));
        const errorEvent = new ErrorEvent("error", { error });
        this.dispatchEvent(errorEvent);
        this.#context.app.dispatchEvent(errorEvent);
    }
    #push(payload) {
        if (!this.#controller) {
            this.#error(new Error("The controller has not been set."));
            return;
        }
        if (this.#closed) {
            return;
        }
        this.#controller.enqueue(encoder.encode(payload));
    }
    get closed() {
        return this.#closed;
    }
    constructor(context, { headers, keepAlive = false } = {}) {
        super();
        this.#context = context;
        context.response.body = new ReadableStream({
            start: (controller) => {
                this.#controller = controller;
            },
            cancel: (error) => {
                if (error instanceof Error && error.message.includes("connection closed")) {
                    this.close();
                }
                else {
                    this.#error(error);
                }
            },
        });
        if (headers) {
            for (const [key, value] of headers) {
                context.response.headers.set(key, value);
            }
        }
        for (const [key, value] of RESPONSE_HEADERS) {
            context.response.headers.set(key, value);
        }
        this.addEventListener("close", () => {
            this.#closed = true;
            if (this.#keepAliveId != null) {
                clearInterval(this.#keepAliveId);
                this.#keepAliveId = undefined;
            }
            if (this.#controller) {
                try {
                    this.#controller.close();
                }
                catch {
                }
            }
        });
        if (keepAlive) {
            const interval = typeof keepAlive === "number"
                ? keepAlive
                : DEFAULT_KEEP_ALIVE_INTERVAL;
            this.#keepAliveId = setInterval(() => {
                this.dispatchComment("keep-alive comment");
            }, interval);
        }
    }
    close() {
        this.dispatchEvent(new CloseEvent({ cancelable: false }));
        return Promise.resolve();
    }
    dispatchComment(comment) {
        this.#push(`: ${comment.split("\n").join("\n: ")}\n\n`);
        return true;
    }
    dispatchMessage(data) {
        const event = new ServerSentEvent("__message", data);
        return this.dispatchEvent(event);
    }
    dispatchEvent(event) {
        const dispatched = super.dispatchEvent(event);
        if (dispatched && event instanceof ServerSentEvent) {
            this.#push(String(event));
        }
        return dispatched;
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        return `${this.constructor.name} ${inspect({ "#closed": this.#closed, "#context": this.#context })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1,
        });
        return `${options.stylize(this.constructor.name, "special")} ${inspect({ "#closed": this.#closed, "#context": this.#context }, newOptions)}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyX3NlbnRfZXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2ZXJfc2VudF9ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRW5DLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7QUFFbEMsTUFBTSwyQkFBMkIsR0FBRyxNQUFNLENBQUM7QUErQjNDLE1BQU0sVUFBVyxTQUFRLEtBQUs7SUFDNUIsWUFBWSxTQUFvQjtRQUM5QixLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRjtBQTJCRCxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxLQUFLO0lBQ3hDLEtBQUssQ0FBUztJQUNkLEdBQUcsQ0FBVTtJQUNiLEtBQUssQ0FBUztJQVdkLFlBQ0UsSUFBWSxFQUNaLElBQWEsRUFDYixZQUFpQyxFQUFFO1FBRW5DLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkIsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUTtnQkFDbkMsQ0FBQyxDQUFDLElBQUk7Z0JBQ04sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFFBQStCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEU7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU0sQ0FBQyxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUM7WUFDM0IsTUFBTSxJQUFJLFNBQVMsQ0FDakIsMERBQTBELENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FDdEUsQ0FBQztTQUNIO1FBQ0QsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLFNBQVMs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LEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FDaEUsRUFBRSxDQUFDO0lBQ0wsQ0FBQztJQUVELENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQ3hDLEtBQWEsRUFFYixPQUFZLEVBQ1osT0FBc0Q7UUFFdEQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNqRTtRQUVELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtZQUM1QyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDO1NBQ3pELENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUN6RCxPQUFPLENBQ0wsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUN0RCxVQUFVLENBRWQsRUFBRSxDQUFDO0lBQ0wsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiB0aGUgb2FrIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuXG5pbXBvcnQgdHlwZSB7IENvbnRleHQgfSBmcm9tIFwiLi9jb250ZXh0LnRzXCI7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tIFwiLi91dGlsLnRzXCI7XG5cbmNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcblxuY29uc3QgREVGQVVMVF9LRUVQX0FMSVZFX0lOVEVSVkFMID0gMzBfMDAwO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZlclNlbnRFdmVudEluaXQgZXh0ZW5kcyBFdmVudEluaXQge1xuICAvKiogQW4gb3B0aW9uYWwgYGlkYCB3aGljaCB3aWxsIGJlIHNlbnQgd2l0aCB0aGUgZXZlbnQgYW5kIGV4cG9zZWQgaW4gdGhlXG4gICAqIGNsaWVudCBgRXZlbnRTb3VyY2VgLiAqL1xuICBpZD86IG51bWJlcjtcblxuICAvKiogVGhlIHJlcGxhY2VyIGlzIHBhc3NlZCB0byBgSlNPTi5zdHJpbmdpZnlgIHdoZW4gY29udmVydGluZyB0aGUgYGRhdGFgXG4gICAqIHByb3BlcnR5IHRvIGEgSlNPTiBzdHJpbmcuICovXG4gIHJlcGxhY2VyPzpcbiAgICB8IChzdHJpbmcgfCBudW1iZXIpW11cbiAgICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICAgIHwgKCh0aGlzOiBhbnksIGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiBhbnkpO1xuXG4gIC8qKiBTcGFjZSBpcyBwYXNzZWQgdG8gYEpTT04uc3RyaW5naWZ5YCB3aGVuIGNvbnZlcnRpbmcgdGhlIGBkYXRhYCBwcm9wZXJ0eVxuICAgKiB0byBhIEpTT04gc3RyaW5nLiAqL1xuICBzcGFjZT86IHN0cmluZyB8IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2ZXJTZW50RXZlbnRUYXJnZXRPcHRpb25zIHtcbiAgLyoqIEFkZGl0aW9uYWwgaGVhZGVycyB0byBzZW5kIHRvIHRoZSBjbGllbnQgZHVyaW5nIHN0YXJ0dXAuICBUaGVzZSBoZWFkZXJzXG4gICAqIHdpbGwgb3ZlcndyaXRlIGFueSBvZiB0aGUgZGVmYXVsdCBoZWFkZXJzIGlmIHRoZSBrZXkgaXMgZHVwbGljYXRlZC4gKi9cbiAgaGVhZGVycz86IEhlYWRlcnM7XG4gIC8qKiBLZWVwIGNsaWVudCBjb25uZWN0aW9ucyBhbGl2ZSBieSBzZW5kaW5nIGEgY29tbWVudCBldmVudCB0byB0aGUgY2xpZW50XG4gICAqIGF0IGEgc3BlY2lmaWVkIGludGVydmFsLiAgSWYgYHRydWVgLCB0aGVuIGl0IHBvbGxzIGV2ZXJ5IDMwMDAwIG1pbGxpc2Vjb25kc1xuICAgKiAoMzAgc2Vjb25kcykuIElmIHNldCB0byBhIG51bWJlciwgdGhlbiBpdCBwb2xscyB0aGF0IG51bWJlciBvZlxuICAgKiBtaWxsaXNlY29uZHMuICBUaGUgZmVhdHVyZSBpcyBkaXNhYmxlZCBpZiBzZXQgdG8gYGZhbHNlYC4gIEl0IGRlZmF1bHRzIHRvXG4gICAqIGBmYWxzZWAuICovXG4gIGtlZXBBbGl2ZT86IGJvb2xlYW4gfCBudW1iZXI7XG59XG5cbmNsYXNzIENsb3NlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIGNvbnN0cnVjdG9yKGV2ZW50SW5pdDogRXZlbnRJbml0KSB7XG4gICAgc3VwZXIoXCJjbG9zZVwiLCBldmVudEluaXQpO1xuICB9XG59XG5cbi8qKiBBbiBldmVudCB3aGljaCBjb250YWlucyBpbmZvcm1hdGlvbiB3aGljaCB3aWxsIGJlIHNlbnQgdG8gdGhlIHJlbW90ZVxuICogY29ubmVjdGlvbiBhbmQgYmUgbWFkZSBhdmFpbGFibGUgaW4gYW4gYEV2ZW50U291cmNlYCBhcyBhbiBldmVudC4gQSBzZXJ2ZXJcbiAqIGNyZWF0ZXMgbmV3IGV2ZW50cyBhbmQgZGlzcGF0Y2hlcyB0aGVtIG9uIHRoZSB0YXJnZXQgd2hpY2ggd2lsbCB0aGVuIGJlXG4gKiBzZW50IHRvIGEgY2xpZW50LlxuICpcbiAqIFNlZSBtb3JlIGFib3V0IFNlcnZlci1zZW50IGV2ZW50cyBvbiBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2VydmVyLXNlbnRfZXZlbnRzL1VzaW5nX3NlcnZlci1zZW50X2V2ZW50cylcbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBBcHBsaWNhdGlvbiwgU2VydmVyU2VudEV2ZW50IH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3gvb2FrL21vZC50c1wiO1xuICpcbiAqIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbigpO1xuICpcbiAqIGFwcC51c2UoKGN0eCkgPT4ge1xuICogICBjb25zdCB0YXJnZXQgPSBjdHguc2VuZEV2ZW50cygpO1xuICogICBjb25zdCBldnQgPSBuZXcgU2VydmVyU2VudEV2ZW50KFxuICogICAgIFwibWVzc2FnZVwiLFxuICogICAgIHsgaGVsbG86IFwid29ybGRcIiB9LFxuICogICAgIHsgaWQ6IDEgfSxcbiAqICAgKTtcbiAqICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAqIH0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJTZW50RXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gICNkYXRhOiBzdHJpbmc7XG4gICNpZD86IG51bWJlcjtcbiAgI3R5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogQHBhcmFtIHR5cGUgdGhlIGV2ZW50IHR5cGUgdGhhdCB3aWxsIGJlIGF2YWlsYWJsZSBvbiB0aGUgY2xpZW50LiBUaGUgdHlwZVxuICAgKiAgICAgICAgICAgICBvZiBgXCJtZXNzYWdlXCJgIHdpbGwgYmUgaGFuZGxlZCBzcGVjaWZpY2FsbHkgYXMgYSBtZXNzYWdlXG4gICAqICAgICAgICAgICAgIHNlcnZlci1zaWRlIGV2ZW50LlxuICAgKiBAcGFyYW0gZGF0YSAgYXJiaXRyYXJ5IGRhdGEgdG8gc2VuZCB0byB0aGUgY2xpZW50LCBkYXRhIHRoaXMgaXMgYSBzdHJpbmdcbiAgICogICAgICAgICAgICAgIHdpbGwgYmUgc2VudCB1bm1vZGlmaWVkLCBvdGhlcndpc2UgYEpTT04ucGFyc2UoKWAgd2lsbCBiZSB1c2VkXG4gICAqICAgICAgICAgICAgICB0byBzZXJpYWxpemUgdGhlIHZhbHVlXG4gICAqIEBwYXJhbSBldmVudEluaXQgaW5pdGlhbGl6YXRpb24gb3B0aW9ucyBmb3IgdGhlIGV2ZW50XG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgZGF0YTogdW5rbm93bixcbiAgICBldmVudEluaXQ6IFNlcnZlclNlbnRFdmVudEluaXQgPSB7fSxcbiAgKSB7XG4gICAgc3VwZXIodHlwZSwgZXZlbnRJbml0KTtcbiAgICBjb25zdCB7IHJlcGxhY2VyLCBzcGFjZSB9ID0gZXZlbnRJbml0O1xuICAgIHRoaXMuI3R5cGUgPSB0eXBlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLiNkYXRhID0gdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCJcbiAgICAgICAgPyBkYXRhXG4gICAgICAgIDogSlNPTi5zdHJpbmdpZnkoZGF0YSwgcmVwbGFjZXIgYXMgKHN0cmluZyB8IG51bWJlcilbXSwgc3BhY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGFzc2VydChlIGluc3RhbmNlb2YgRXJyb3IpO1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYGRhdGEgY291bGQgbm90IGJlIGNvZXJjZWQgaW50byBhIHNlcmlhbGl6ZWQgc3RyaW5nLlxcbiAgJHtlLm1lc3NhZ2V9YCxcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHsgaWQgfSA9IGV2ZW50SW5pdDtcbiAgICB0aGlzLiNpZCA9IGlkO1xuICB9XG5cbiAgLyoqIFRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgZXZlbnQsIHdoaWNoIHdpbGwgYmUgc2VudCB0byB0aGUgY2xpZW50IGFuZFxuICAgKiBiZSBtYWRlIGF2YWlsYWJsZSBpbiB0aGUgYEV2ZW50U291cmNlYC4gKi9cbiAgZ2V0IGRhdGEoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jZGF0YTtcbiAgfVxuXG4gIC8qKiBUaGUgb3B0aW9uYWwgSUQgYXNzb2NpYXRlZCB3aXRoIHRoZSBldmVudCB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgY2xpZW50XG4gICAqIGFuZCBiZSBtYWRlIGF2YWlsYWJsZSBpbiB0aGUgYEV2ZW50U291cmNlYC4gKi9cbiAgZ2V0IGlkKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBjb25zdCBkYXRhID0gYGRhdGE6ICR7dGhpcy4jZGF0YS5zcGxpdChcIlxcblwiKS5qb2luKFwiXFxuZGF0YTogXCIpfVxcbmA7XG4gICAgcmV0dXJuIGAke3RoaXMuI3R5cGUgPT09IFwiX19tZXNzYWdlXCIgPyBcIlwiIDogYGV2ZW50OiAke3RoaXMuI3R5cGV9XFxuYH0ke1xuICAgICAgdGhpcy4jaWQgPyBgaWQ6ICR7U3RyaW5nKHRoaXMuI2lkKX1cXG5gIDogXCJcIlxuICAgIH0ke2RhdGF9XFxuYDtcbiAgfVxufVxuXG5jb25zdCBSRVNQT05TRV9IRUFERVJTID0gW1xuICBbXCJDb25uZWN0aW9uXCIsIFwiS2VlcC1BbGl2ZVwiXSxcbiAgW1wiQ29udGVudC1UeXBlXCIsIFwidGV4dC9ldmVudC1zdHJlYW1cIl0sXG4gIFtcIkNhY2hlLUNvbnRyb2xcIiwgXCJuby1jYWNoZVwiXSxcbiAgW1wiS2VlcC1BbGl2ZVwiLCBgdGltZW91dD0ke051bWJlci5NQVhfU0FGRV9JTlRFR0VSfWBdLFxuXSBhcyBjb25zdDtcblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2ZXJTZW50RXZlbnRUYXJnZXQgZXh0ZW5kcyBFdmVudFRhcmdldCB7XG4gIC8qKiBJcyBzZXQgdG8gYHRydWVgIGlmIGV2ZW50cyBjYW5ub3QgYmUgc2VudCB0byB0aGUgcmVtb3RlIGNvbm5lY3Rpb24uXG4gICAqIE90aGVyd2lzZSBpdCBpcyBzZXQgdG8gYGZhbHNlYC5cbiAgICpcbiAgICogKk5vdGUqOiBUaGlzIGZsYWcgaXMgbGF6aWx5IHNldCwgYW5kIG1pZ2h0IG5vdCByZWZsZWN0IGEgY2xvc2VkIHN0YXRlIHVudGlsXG4gICAqIGFub3RoZXIgZXZlbnQsIGNvbW1lbnQgb3IgbWVzc2FnZSBpcyBhdHRlbXB0ZWQgdG8gYmUgcHJvY2Vzc2VkLiAqL1xuICByZWFkb25seSBjbG9zZWQ6IGJvb2xlYW47XG5cbiAgLyoqIENsb3NlIHRoZSB0YXJnZXQsIHJlZnVzaW5nIHRvIGFjY2VwdCBhbnkgbW9yZSBldmVudHMuICovXG4gIGNsb3NlKCk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqIFNlbmQgYSBjb21tZW50IHRvIHRoZSByZW1vdGUgY29ubmVjdGlvbi4gIENvbW1lbnRzIGFyZSBub3QgZXhwb3NlZCB0byB0aGVcbiAgICogY2xpZW50IGBFdmVudFNvdXJjZWAgYnV0IGFyZSB1c2VkIGZvciBkaWFnbm9zdGljcyBhbmQgaGVscGluZyBlbnN1cmUgYVxuICAgKiBjb25uZWN0aW9uIGlzIGtlcHQgYWxpdmUuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3gvb2FrL21vZC50c1wiO1xuICAgKlxuICAgKiBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oKTtcbiAgICpcbiAgICogYXBwLnVzZSgoY3R4KSA9PiB7XG4gICAqICAgIGNvbnN0IHNzZSA9IGN0eC5nZXRTU0VUYXJnZXQoKTtcbiAgICogICAgc3NlLmRpc3BhdGNoQ29tbWVudChcInRoaXMgaXMgYSBjb21tZW50XCIpO1xuICAgKiB9KTtcbiAgICpcbiAgICogYXdhaXQgYXBwLmxpc3RlbigpO1xuICAgKiBgYGBcbiAgICovXG4gIGRpc3BhdGNoQ29tbWVudChjb21tZW50OiBzdHJpbmcpOiBib29sZWFuO1xuXG4gIC8qKiBEaXNwYXRjaCBhIG1lc3NhZ2UgdG8gdGhlIGNsaWVudC4gIFRoaXMgbWVzc2FnZSB3aWxsIGNvbnRhaW4gYGRhdGE6IGAgb25seVxuICAgKiBhbmQgYmUgYXZhaWxhYmxlIG9uIHRoZSBjbGllbnQgYEV2ZW50U291cmNlYCBvbiB0aGUgYG9ubWVzc2FnZWAgb3IgYW4gZXZlbnRcbiAgICogbGlzdGVuZXIgb2YgdHlwZSBgXCJtZXNzYWdlXCJgLiAqL1xuICBkaXNwYXRjaE1lc3NhZ2UoZGF0YTogdW5rbm93bik6IGJvb2xlYW47XG5cbiAgLyoqIERpc3BhdGNoIGEgc2VydmVyIHNlbnQgZXZlbnQgdG8gdGhlIGNsaWVudC4gIFRoZSBldmVudCBgdHlwZWAgd2lsbCBiZVxuICAgKiBzZW50IGFzIGBldmVudDogYCB0byB0aGUgY2xpZW50IHdoaWNoIHdpbGwgYmUgcmFpc2VkIGFzIGEgYE1lc3NhZ2VFdmVudGBcbiAgICogb24gdGhlIGBFdmVudFNvdXJjZWAgaW4gdGhlIGNsaWVudC5cbiAgICpcbiAgICogQW55IGxvY2FsIGV2ZW50IGhhbmRsZXJzIHdpbGwgYmUgZGlzcGF0Y2hlZCB0byBmaXJzdCwgYW5kIGlmIHRoZSBldmVudFxuICAgKiBpcyBjYW5jZWxsZWQsIGl0IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIGNsaWVudC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogaW1wb3J0IHsgQXBwbGljYXRpb24sIFNlcnZlclNlbnRFdmVudCB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC94L29hay9tb2QudHNcIjtcbiAgICpcbiAgICogY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKCk7XG4gICAqXG4gICAqIGFwcC51c2UoKGN0eCkgPT4ge1xuICAgKiAgICBjb25zdCBzc2UgPSBjdHguZ2V0U1NFVGFyZ2V0KCk7XG4gICAqICAgIGNvbnN0IGV2dCA9IG5ldyBTZXJ2ZXJTZW50RXZlbnQoXCJwaW5nXCIsIFwiaGVsbG9cIik7XG4gICAqICAgIHNzZS5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAqIH0pO1xuICAgKlxuICAgKiBhd2FpdCBhcHAubGlzdGVuKCk7XG4gICAqIGBgYFxuICAgKi9cbiAgZGlzcGF0Y2hFdmVudChldmVudDogU2VydmVyU2VudEV2ZW50KTogYm9vbGVhbjtcblxuICAvKiogRGlzcGF0Y2ggYSBzZXJ2ZXIgc2VudCBldmVudCB0byB0aGUgY2xpZW50LiAgVGhlIGV2ZW50IGB0eXBlYCB3aWxsIGJlXG4gICAqIHNlbnQgYXMgYGV2ZW50OiBgIHRvIHRoZSBjbGllbnQgd2hpY2ggd2lsbCBiZSByYWlzZWQgYXMgYSBgTWVzc2FnZUV2ZW50YFxuICAgKiBvbiB0aGUgYEV2ZW50U291cmNlYCBpbiB0aGUgY2xpZW50LlxuICAgKlxuICAgKiBBbnkgbG9jYWwgZXZlbnQgaGFuZGxlcnMgd2lsbCBiZSBkaXNwYXRjaGVkIHRvIGZpcnN0LCBhbmQgaWYgdGhlIGV2ZW50XG4gICAqIGlzIGNhbmNlbGxlZCwgaXQgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgY2xpZW50LlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBpbXBvcnQgeyBBcHBsaWNhdGlvbiwgU2VydmVyU2VudEV2ZW50IH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3gvb2FrL21vZC50c1wiO1xuICAgKlxuICAgKiBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oKTtcbiAgICpcbiAgICogYXBwLnVzZSgoY3R4KSA9PiB7XG4gICAqICAgIGNvbnN0IHNzZSA9IGN0eC5nZXRTU0VUYXJnZXQoKTtcbiAgICogICAgY29uc3QgZXZ0ID0gbmV3IFNlcnZlclNlbnRFdmVudChcInBpbmdcIiwgXCJoZWxsb1wiKTtcbiAgICogICAgc3NlLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICogfSk7XG4gICAqXG4gICAqIGF3YWl0IGFwcC5saXN0ZW4oKTtcbiAgICogYGBgXG4gICAqL1xuICBkaXNwYXRjaEV2ZW50KGV2ZW50OiBDbG9zZUV2ZW50IHwgRXJyb3JFdmVudCk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBTU0VTdHJlYW1UYXJnZXQgZXh0ZW5kcyBFdmVudFRhcmdldFxuICBpbXBsZW1lbnRzIFNlcnZlclNlbnRFdmVudFRhcmdldCB7XG4gICNjbG9zZWQgPSBmYWxzZTtcbiAgI2NvbnRleHQ6IENvbnRleHQ7XG4gICNjb250cm9sbGVyPzogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxVaW50OEFycmF5PjtcbiAgLy8gd2UgYXJlIGlnbm9yaW5nIGFueSBoZXJlLCBiZWNhdXNlIHdoZW4gZXhwb3J0aW5nIHRvIG5wbi9Ob2RlLmpzLCB0aGUgdGltZXJcbiAgLy8gaGFuZGxlIGlzbid0IGEgbnVtYmVyLlxuICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICAja2VlcEFsaXZlSWQ/OiBhbnk7XG5cbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgI2Vycm9yKGVycm9yOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yKTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IENsb3NlRXZlbnQoeyBjYW5jZWxhYmxlOiBmYWxzZSB9KSk7XG4gICAgY29uc3QgZXJyb3JFdmVudCA9IG5ldyBFcnJvckV2ZW50KFwiZXJyb3JcIiwgeyBlcnJvciB9KTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXJyb3JFdmVudCk7XG4gICAgdGhpcy4jY29udGV4dC5hcHAuZGlzcGF0Y2hFdmVudChlcnJvckV2ZW50KTtcbiAgfVxuXG4gICNwdXNoKHBheWxvYWQ6IHN0cmluZykge1xuICAgIGlmICghdGhpcy4jY29udHJvbGxlcikge1xuICAgICAgdGhpcy4jZXJyb3IobmV3IEVycm9yKFwiVGhlIGNvbnRyb2xsZXIgaGFzIG5vdCBiZWVuIHNldC5cIikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy4jY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuI2NvbnRyb2xsZXIuZW5xdWV1ZShlbmNvZGVyLmVuY29kZShwYXlsb2FkKSk7XG4gIH1cblxuICBnZXQgY2xvc2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLiNjbG9zZWQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBjb250ZXh0OiBDb250ZXh0LFxuICAgIHsgaGVhZGVycywga2VlcEFsaXZlID0gZmFsc2UgfTogU2VydmVyU2VudEV2ZW50VGFyZ2V0T3B0aW9ucyA9IHt9LFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy4jY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSBuZXcgUmVhZGFibGVTdHJlYW08VWludDhBcnJheT4oe1xuICAgICAgc3RhcnQ6IChjb250cm9sbGVyKSA9PiB7XG4gICAgICAgIHRoaXMuI2NvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbDogKGVycm9yKSA9PiB7XG4gICAgICAgIC8vIGNvbm5lY3Rpb25zIGNsb3NpbmcgYXJlIGNvbnNpZGVyZWQgXCJub3JtYWxcIiBmb3IgU1NFIGV2ZW50cyBhbmQganVzdFxuICAgICAgICAvLyBtZWFuIHRoZSBmYXIgc2lkZSBoYXMgY2xvc2VkLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiBlcnJvci5tZXNzYWdlLmluY2x1ZGVzKFwiY29ubmVjdGlvbiBjbG9zZWRcIilcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuI2Vycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmIChoZWFkZXJzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBoZWFkZXJzKSB7XG4gICAgICAgIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIFJFU1BPTlNFX0hFQURFUlMpIHtcbiAgICAgIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy4jY2xvc2VkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLiNrZWVwQWxpdmVJZCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy4ja2VlcEFsaXZlSWQpO1xuICAgICAgICB0aGlzLiNrZWVwQWxpdmVJZCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLiNjb250cm9sbGVyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy4jY29udHJvbGxlci5jbG9zZSgpO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAvLyB3ZSBpZ25vcmUgYW55IGVycm9ycyBoZXJlLCBhcyBpdCBpcyBsaWtlbHkgdGhhdCB0aGUgY29udHJvbGxlclxuICAgICAgICAgIC8vIGlzIGFscmVhZHkgY2xvc2VkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChrZWVwQWxpdmUpIHtcbiAgICAgIGNvbnN0IGludGVydmFsID0gdHlwZW9mIGtlZXBBbGl2ZSA9PT0gXCJudW1iZXJcIlxuICAgICAgICA/IGtlZXBBbGl2ZVxuICAgICAgICA6IERFRkFVTFRfS0VFUF9BTElWRV9JTlRFUlZBTDtcbiAgICAgIHRoaXMuI2tlZXBBbGl2ZUlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3BhdGNoQ29tbWVudChcImtlZXAtYWxpdmUgY29tbWVudFwiKTtcbiAgICAgIH0sIGludGVydmFsKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IENsb3NlRXZlbnQoeyBjYW5jZWxhYmxlOiBmYWxzZSB9KSk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgZGlzcGF0Y2hDb21tZW50KGNvbW1lbnQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHRoaXMuI3B1c2goYDogJHtjb21tZW50LnNwbGl0KFwiXFxuXCIpLmpvaW4oXCJcXG46IFwiKX1cXG5cXG5gKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gIGRpc3BhdGNoTWVzc2FnZShkYXRhOiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBTZXJ2ZXJTZW50RXZlbnQoXCJfX21lc3NhZ2VcIiwgZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2ZW50OiBTZXJ2ZXJTZW50RXZlbnQpOiBib29sZWFuO1xuICBkaXNwYXRjaEV2ZW50KGV2ZW50OiBDbG9zZUV2ZW50IHwgRXJyb3JFdmVudCk6IGJvb2xlYW47XG4gIGRpc3BhdGNoRXZlbnQoZXZlbnQ6IFNlcnZlclNlbnRFdmVudCB8IENsb3NlRXZlbnQgfCBFcnJvckV2ZW50KTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGlzcGF0Y2hlZCA9IHN1cGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIGlmIChkaXNwYXRjaGVkICYmIGV2ZW50IGluc3RhbmNlb2YgU2VydmVyU2VudEV2ZW50KSB7XG4gICAgICB0aGlzLiNwdXNoKFN0cmluZyhldmVudCkpO1xuICAgIH1cbiAgICByZXR1cm4gZGlzcGF0Y2hlZDtcbiAgfVxuXG4gIFtTeW1ib2wuZm9yKFwiRGVuby5jdXN0b21JbnNwZWN0XCIpXShpbnNwZWN0OiAodmFsdWU6IHVua25vd24pID0+IHN0cmluZykge1xuICAgIHJldHVybiBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9ICR7XG4gICAgICBpbnNwZWN0KHsgXCIjY2xvc2VkXCI6IHRoaXMuI2Nsb3NlZCwgXCIjY29udGV4dFwiOiB0aGlzLiNjb250ZXh0IH0pXG4gICAgfWA7XG4gIH1cblxuICBbU3ltYm9sLmZvcihcIm5vZGVqcy51dGlsLmluc3BlY3QuY3VzdG9tXCIpXShcbiAgICBkZXB0aDogbnVtYmVyLFxuICAgIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gICAgb3B0aW9uczogYW55LFxuICAgIGluc3BlY3Q6ICh2YWx1ZTogdW5rbm93biwgb3B0aW9ucz86IHVua25vd24pID0+IHN0cmluZyxcbiAgKSB7XG4gICAgaWYgKGRlcHRoIDwgMCkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuc3R5bGl6ZShgWyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfV1gLCBcInNwZWNpYWxcIik7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcbiAgICAgIGRlcHRoOiBvcHRpb25zLmRlcHRoID09PSBudWxsID8gbnVsbCA6IG9wdGlvbnMuZGVwdGggLSAxLFxuICAgIH0pO1xuICAgIHJldHVybiBgJHtvcHRpb25zLnN0eWxpemUodGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBcInNwZWNpYWxcIil9ICR7XG4gICAgICBpbnNwZWN0KFxuICAgICAgICB7IFwiI2Nsb3NlZFwiOiB0aGlzLiNjbG9zZWQsIFwiI2NvbnRleHRcIjogdGhpcy4jY29udGV4dCB9LFxuICAgICAgICBuZXdPcHRpb25zLFxuICAgICAgKVxuICAgIH1gO1xuICB9XG59XG4iXX0=