export function addSignalListener(...args) {
    if (typeof Deno.addSignalListener == "function") {
        return Deno.addSignalListener(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function createHttpClient(...args) {
    if (typeof Deno.createHttpClient == "function") {
        return Deno.createHttpClient(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function consoleSize(...args) {
    if (typeof Deno.consoleSize == "function") {
        return Deno.consoleSize(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function futime(...args) {
    if (typeof Deno.futime == "function") {
        return Deno.futime(...args);
    }
    else {
        return Promise.reject(new TypeError("Requires --unstable"));
    }
}
export function futimeSync(...args) {
    if (typeof Deno.futimeSync == "function") {
        return Deno.futimeSync(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function getUid(...args) {
    if (typeof Deno.getUid == "function") {
        return Deno.getUid(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function hostname(...args) {
    if (typeof Deno.hostname == "function") {
        return Deno.hostname(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function loadavg(...args) {
    if (typeof Deno.loadavg == "function") {
        return Deno.loadavg(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function osRelease(...args) {
    if (typeof Deno.osRelease == "function") {
        return Deno.osRelease(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function removeSignalListener(...args) {
    if (typeof Deno.removeSignalListener == "function") {
        return Deno.removeSignalListener(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function setRaw(...args) {
    if (typeof Deno.setRaw == "function") {
        return Deno.setRaw(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function systemMemoryInfo(...args) {
    if (typeof Deno.systemMemoryInfo == "function") {
        return Deno.systemMemoryInfo(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function utime(...args) {
    if (typeof Deno.utime == "function") {
        return Deno.utime(...args);
    }
    else {
        return Promise.reject(new TypeError("Requires --unstable"));
    }
}
export function utimeSync(...args) {
    if (typeof Deno.utimeSync == "function") {
        return Deno.utimeSync(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
export function networkInterfaces(...args) {
    if (typeof Deno.networkInterfaces == "function") {
        return Deno.networkInterfaces(...args);
    }
    else {
        throw new TypeError("Requires --unstable");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2Rlbm9fdW5zdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJfZGVub191bnN0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxNQUFNLFVBQVUsaUJBQWlCLENBQy9CLEdBQUcsSUFBK0M7SUFFbEQsSUFBSSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxVQUFVLEVBQUU7UUFDL0MsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUN4QztTQUFNO1FBQ0wsTUFBTSxJQUFJLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FDOUIsR0FBRyxJQUE4QztJQUVqRCxJQUFJLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixJQUFJLFVBQVUsRUFBRTtRQUM5QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ3ZDO1NBQU07UUFDTCxNQUFNLElBQUksU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDNUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FDekIsR0FBRyxJQUF5QztJQUU1QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxVQUFVLEVBQUU7UUFDekMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDbEM7U0FBTTtRQUNMLE1BQU0sSUFBSSxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQztLQUM1QztBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsTUFBTSxDQUNwQixHQUFHLElBQW9DO0lBRXZDLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLFVBQVUsRUFBRTtRQUNwQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUM3QjtTQUFNO1FBQ0wsT0FBTyxPQUFPLENBQUMsTUFB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S0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDNUI7U0FBTTtRQUNMLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7S0FDN0Q7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FDdkIsR0FBRyxJQUF1QztJQUUxQyxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxVQUFVLEVBQUU7UUFDdkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDaEM7U0FBTTtRQUNMLE1BQU0sSUFBSSxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQztLQUM1QztBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQy9CLEdBQUcsSUFBK0M7SUFFbEQsSUFBSSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxVQUFVLEVBQUU7UUFDL0MsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUN4QztTQUFNO1FBQ0wsTUFBTSxJQUFJLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG4vLyBAdHMtbm9jaGVjayBCeXBhc3Mgc3RhdGljIGVycm9ycyBmb3IgbWlzc2luZyAtLXVuc3RhYmxlLlxuXG5leHBvcnQgdHlwZSBIdHRwQ2xpZW50ID0gRGVuby5IdHRwQ2xpZW50O1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkU2lnbmFsTGlzdGVuZXIoXG4gIC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIERlbm8uYWRkU2lnbmFsTGlzdGVuZXI+XG4pOiBSZXR1cm5UeXBlPHR5cGVvZiBEZW5vLmFkZFNpZ25hbExpc3RlbmVyPiB7XG4gIGlmICh0eXBlb2YgRGVuby5hZGRTaWduYWxMaXN0ZW5lciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gRGVuby5hZGRTaWduYWxMaXN0ZW5lciguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUmVxdWlyZXMgLS11bnN0YWJsZVwiKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSHR0cENsaWVudChcbiAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgRGVuby5jcmVhdGVIdHRwQ2xpZW50PlxuKTogUmV0dXJuVHlwZTx0eXBlb2YgRGVuby5jcmVhdGVIdHRwQ2xpZW50PiB7XG4gIGlmICh0eXBlb2YgRGVuby5jcmVhdGVIdHRwQ2xpZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBEZW5vLmNyZWF0ZUh0dHBDbGllbnQoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlJlcXVpcmVzIC0tdW5zdGFibGVcIik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnNvbGVTaXplKFxuICAuLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBEZW5vLmNvbnNvbGVTaXplPlxuKTogUmV0dXJuVHlwZTx0eXBlb2YgRGVuby5jb25zb2xlU2l6ZT4ge1xuICBpZiAodHlwZW9mIERlbm8uY29uc29sZVNpemUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIERlbm8uY29uc29sZVNpemUoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlJlcXVpcmVzIC0tdW5zdGFibGVcIik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZ1dGltZShcbiAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgRGVuby5mdXRpbWU+XG4pOiBSZXR1cm5UeXBlPHR5cGVvZiBEZW5vLmZ1dGltZT4ge1xuICBpZiAodHlwZW9mIERlbm8uZnV0aW1lID09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBEZW5vLmZ1dGltZSguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlJlcXVpcmVzIC0tdW5zdGFibGVcIikpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmdXRpbWVTeW5jKFxuICAuLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBEZW5vLmZ1dGltZVN5bmM+XG4pOiBSZXR1cm5UeXBlPHR5cGVvZiBEZW5vLmZ1dGltZVN5bmM+IHtcbiAgaWYgKHR5cGVvZiBEZW5vLmZ1dGltZVN5bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIERlbm8uZnV0aW1lU3luYyguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUmVxdWlyZXMgLS11bnN0YWJsZVwiKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VWlkKFxuICAuLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBEZW5vLmdldFVpZD5cbik6IFJldHVyblR5cGU8dHlwZW9mIERlbm8uZ2V0VWlkPiB7XG4gIGlmICh0eXBlb2YgRGVuby5nZXRVaWQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIERlbm8uZ2V0VWlkKC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJSZXF1aXJlcyAtLXVuc3RhYmxlXCIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBob3N0bmFtZShcbiAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgRGVuby5ob3N0bmFtZT5cbik6IFJldHVyblR5cGU8dHlwZW9mIERlbm8uaG9zdG5hbWU+IHtcbiAgaWYgKHR5cGVvZiBEZW5vLmhvc3RuYW1lID09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBEZW5vLmhvc3RuYW1lKC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJSZXF1aXJlcyAtLXVuc3RhYmxlXCIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkYXZnKFxuICAuLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBEZW5vLmxvYWRhdmc+XG4pOiBSZXR1cm5UeXBlPHR5cGVvZiBEZW5vLmxvYWRhdmc+IHtcbiAgaWYgKHR5cGVvZiBEZW5vLmxvYWRhdmcgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIERlbm8ubG9hZGF2ZyguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUmVxdWlyZXMgLS11bnN0YWJsZVwiKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3NSZWxlYXNlKFxuICAuLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBEZW5vLm9zUmVsZWFzZT5cbik6IFJldHVyblR5cGU8dHlwZW9mIERlbm8ub3NSZWxlYXNlPiB7XG4gIGlmICh0eXBlb2YgRGVuby5vc1JlbGVhc2UgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIERlbm8ub3NSZWxlYXNlKC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJSZXF1aXJlcyAtLXVuc3RhYmxlXCIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTaWduYWxMaXN0ZW5lcihcbiAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgRGVuby5yZW1vdmVTaWduYWxMaXN0ZW5lcj5cbik6IFJldHVyblR5cGU8dHlwZW9mIERlbm8ucmVtb3ZlU2lnbmFsTGlzdGVuZXI+IHtcbiAgaWYgKHR5cGVvZiBEZW5vLnJlbW92ZVNpZ25hbExpc3RlbmVyID09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBEZW5vLnJlbW92ZVNpZ25hbExpc3RlbmVyKC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJSZXF1aXJlcyAtLXVuc3RhYmxlXCIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRSYXcoXG4gIC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIERlbm8uc2V0UmF3PlxuKTogUmV0dXJuVHlwZTx0eXBlb2YgRGVuby5zZXRSYXc+IHtcbiAgaWYgKHR5cGVvZiBEZW5vLnNldFJhdyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gRGVuby5zZXRSYXcoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlJlcXVpcmVzIC0tdW5zdGFibGVcIik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5c3RlbU1lbW9yeUluZm8oXG4gIC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIERlbm8uc3lzdGVtTWVtb3J5SW5mbz5cbik6IFJldHVyblR5cGU8dHlwZW9mIERlbm8uc3lzdGVtTWVtb3J5SW5mbz4ge1xuICBpZiAodHlwZW9mIERlbm8uc3lzdGVtTWVtb3J5SW5mbyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gRGVuby5zeXN0ZW1NZW1vcnlJbmZvKC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJSZXF1aXJlcyAtLXVuc3RhYmxlXCIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1dGltZShcbiAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgRGVuby51dGltZT5cbik6IFJldHVyblR5cGU8dHlwZW9mIERlbm8udXRpbWU+IHtcbiAgaWYgKHR5cGVvZiBEZW5vLnV0aW1lID09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBEZW5vLnV0aW1lKC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiUmVxdWlyZXMgLS11bnN0YWJsZVwiKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHV0aW1lU3luYyhcbiAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgRGVuby51dGltZVN5bmM+XG4pOiBSZXR1cm5UeXBlPHR5cGVvZiBEZW5vLnV0aW1lU3luYz4ge1xuICBpZiAodHlwZW9mIERlbm8udXRpbWVTeW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBEZW5vLnV0aW1lU3luYyguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUmVxdWlyZXMgLS11bnN0YWJsZVwiKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV0d29ya0ludGVyZmFjZXMoXG4gIC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIERlbm8ubmV0d29ya0ludGVyZmFjZXM+XG4pOiBSZXR1cm5UeXBlPHR5cGVvZiBEZW5vLm5ldHdvcmtJbnRlcmZhY2VzPiB7XG4gIGlmICh0eXBlb2YgRGVuby5uZXR3b3JrSW50ZXJmYWNlcyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gRGVuby5uZXR3b3JrSW50ZXJmYWNlcyguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUmVxdWlyZXMgLS11bnN0YWJsZVwiKTtcbiAgfVxufVxuIl19