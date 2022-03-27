export function pooledMap(poolLimit, array, iteratorFn) {
    const res = new TransformStream({
        async transform(p, controller) {
            controller.enqueue(await p);
        },
    });
    (async () => {
        const writer = res.writable.getWriter();
        const executing = [];
        try {
            for await (const item of array) {
                const p = Promise.resolve().then(() => iteratorFn(item));
                p.then((v) => writer.write(Promise.resolve(v))).catch(() => { });
                const e = p.then(() => executing.splice(executing.indexOf(e), 1));
                executing.push(e);
                if (executing.length >= poolLimit) {
                    await Promise.race(executing);
                }
            }
            await Promise.all(executing);
            writer.close();
        }
        catch {
            const errors = [];
            for (const result of await Promise.allSettled(executing)) {
                if (result.status == "rejected") {
                    errors.push(result.reason);
                }
            }
            writer.write(Promise.reject(new AggregateError(errors, "Threw while mapping."))).catch(() => { });
        }
    })();
    return res.readable[Symbol.asyncIterator]();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjEyNS4wL2FzeW5jL3Bvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0JBLE1BQU0sVUFBVSxTQUFTLENBQ3ZCLFNBQWlCLEVBQ2pCLEtBQXFDLEVBQ3JDLFVBQW1DO0lBR25DLE1BQU0sR0FBRyxHQUFHLElBQUksZUFBZSxDQUFnQjtRQUM3QyxLQUFLLENBQUMsU0FBUyxDQUNiLENBQWEsRUFDYixVQUErQztZQUUvQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQztLQUNGLENBQUMsQ0FBQztJQUVILENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDVixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sU0FBUyxHQUE0QixFQUFFLENBQUM7UUFDOUMsSUFBSTtZQUNGLElBQUksS0FBSyxFQUFFLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtnQkFDOUIsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFNekQsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLE1BQU0sQ0FBQyxHQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUN0QyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQzFDLENBQUM7Z0JBQ0YsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRTtvQkFDakMsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUMvQjthQUNGO1lBRUQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNoQjtRQUFDLE1BQU07WUFDTixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDbEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxNQUFNLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3hELElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7b0JBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM1QjthQUNGO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUN6QixJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUUsc0JBQXNCLENBQUMsQ0FDbkQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztTQUNwQjtJQUNILENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5cbi8qKlxuICogcG9vbGVkTWFwIHRyYW5zZm9ybXMgdmFsdWVzIGZyb20gYW4gKGFzeW5jKSBpdGVyYWJsZSBpbnRvIGFub3RoZXIgYXN5bmNcbiAqIGl0ZXJhYmxlLiBUaGUgdHJhbnNmb3JtcyBhcmUgZG9uZSBjb25jdXJyZW50bHksIHdpdGggYSBtYXggY29uY3VycmVuY3lcbiAqIGRlZmluZWQgYnkgdGhlIHBvb2xMaW1pdC5cbiAqXG4gKiBJZiBhbiBlcnJvciBpcyB0aHJvd24gZnJvbSBgaXRlcmFibGVGbmAsIG5vIG5ldyB0cmFuc2Zvcm1hdGlvbnMgd2lsbCBiZWdpbi5cbiAqIEFsbCBjdXJyZW50bHkgZXhlY3V0aW5nIHRyYW5zZm9ybWF0aW9ucyBhcmUgYWxsb3dlZCB0byBmaW5pc2ggYW5kIHN0aWxsXG4gKiB5aWVsZGVkIG9uIHN1Y2Nlc3MuIEFmdGVyIHRoYXQsIHRoZSByZWplY3Rpb25zIGFtb25nIHRoZW0gYXJlIGdhdGhlcmVkIGFuZFxuICogdGhyb3duIGJ5IHRoZSBpdGVyYXRvciBpbiBhbiBgQWdncmVnYXRlRXJyb3JgLlxuICpcbiAqIEBwYXJhbSBwb29sTGltaXQgVGhlIG1heGltdW0gY291bnQgb2YgaXRlbXMgYmVpbmcgcHJvY2Vzc2VkIGNvbmN1cnJlbnRseS5cbiAqIEBwYXJhbSBhcnJheSBUaGUgaW5wdXQgYXJyYXkgZm9yIG1hcHBpbmcuXG4gKiBAcGFyYW0gaXRlcmF0b3JGbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZXZlcnkgaXRlbSBvZiB0aGUgYXJyYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwb29sZWRNYXA8VCwgUj4oXG4gIHBvb2xMaW1pdDogbnVtYmVyLFxuICBhcnJheTogSXRlcmFibGU8VD4gfCBBc3luY0l0ZXJhYmxlPFQ+LFxuICBpdGVyYXRvckZuOiAoZGF0YTogVCkgPT4gUHJvbWlzZTxSPixcbik6IEFzeW5jSXRlcmFibGVJdGVyYXRvcjxSPiB7XG4gIC8vIENyZWF0ZSB0aGUgYXN5bmMgaXRlcmFibGUgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24uXG4gIGNvbnN0IHJlcyA9IG5ldyBUcmFuc2Zvcm1TdHJlYW08UHJvbWlzZTxSPiwgUj4oe1xuICAgIGFzeW5jIHRyYW5zZm9ybShcbiAgICAgIHA6IFByb21pc2U8Uj4sXG4gICAgICBjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPixcbiAgICApIHtcbiAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShhd2FpdCBwKTtcbiAgICB9LFxuICB9KTtcbiAgLy8gU3RhcnQgcHJvY2Vzc2luZyBpdGVtcyBmcm9tIHRoZSBpdGVyYXRvclxuICAoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHdyaXRlciA9IHJlcy53cml0YWJsZS5nZXRXcml0ZXIoKTtcbiAgICBjb25zdCBleGVjdXRpbmc6IEFycmF5PFByb21pc2U8dW5rbm93bj4+ID0gW107XG4gICAgdHJ5IHtcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgaXRlbSBvZiBhcnJheSkge1xuICAgICAgICBjb25zdCBwID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBpdGVyYXRvckZuKGl0ZW0pKTtcbiAgICAgICAgLy8gT25seSB3cml0ZSBvbiBzdWNjZXNzLiBJZiB3ZSBgd3JpdGVyLndyaXRlKClgIGEgcmVqZWN0ZWQgcHJvbWlzZSxcbiAgICAgICAgLy8gdGhhdCB3aWxsIGVuZCB0aGUgaXRlcmF0aW9uLiBXZSBkb24ndCB3YW50IHRoYXQgeWV0LiBJbnN0ZWFkIGxldCBpdFxuICAgICAgICAvLyBmYWlsIHRoZSByYWNlLCB0YWtpbmcgdXMgdG8gdGhlIGNhdGNoIGJsb2NrIHdoZXJlIGFsbCBjdXJyZW50bHlcbiAgICAgICAgLy8gZXhlY3V0aW5nIGpvYnMgYXJlIGFsbG93ZWQgdG8gZmluaXNoIGFuZCBhbGwgcmVqZWN0aW9ucyBhbW9uZyB0aGVtXG4gICAgICAgIC8vIGNhbiBiZSByZXBvcnRlZCB0b2dldGhlci5cbiAgICAgICAgcC50aGVuKCh2KSA9PiB3cml0ZXIud3JpdGUoUHJvbWlzZS5yZXNvbHZlKHYpKSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICBjb25zdCBlOiBQcm9taXNlPHVua25vd24+ID0gcC50aGVuKCgpID0+XG4gICAgICAgICAgZXhlY3V0aW5nLnNwbGljZShleGVjdXRpbmcuaW5kZXhPZihlKSwgMSlcbiAgICAgICAgKTtcbiAgICAgICAgZXhlY3V0aW5nLnB1c2goZSk7XG4gICAgICAgIGlmIChleGVjdXRpbmcubGVuZ3RoID49IHBvb2xMaW1pdCkge1xuICAgICAgICAgIGF3YWl0IFByb21pc2UucmFjZShleGVjdXRpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBXYWl0IHVudGlsIGFsbCBvbmdvaW5nIGV2ZW50cyBoYXZlIHByb2Nlc3NlZCwgdGhlbiBjbG9zZSB0aGUgd3JpdGVyLlxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZXhlY3V0aW5nKTtcbiAgICAgIHdyaXRlci5jbG9zZSgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiBhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQoZXhlY3V0aW5nKSkge1xuICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PSBcInJlamVjdGVkXCIpIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChyZXN1bHQucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd3JpdGVyLndyaXRlKFByb21pc2UucmVqZWN0KFxuICAgICAgICBuZXcgQWdncmVnYXRlRXJyb3IoZXJyb3JzLCBcIlRocmV3IHdoaWxlIG1hcHBpbmcuXCIpLFxuICAgICAgKSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH1cbiAgfSkoKTtcbiAgcmV0dXJuIHJlcy5yZWFkYWJsZVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKTtcbn1cbiJdfQ==