class Queue {
    #source;
    #queue;
    head;
    done;
    constructor(iterable) {
        this.#source = iterable[Symbol.asyncIterator]();
        this.#queue = {
            value: undefined,
            next: undefined,
        };
        this.head = this.#queue;
        this.done = false;
    }
    async next() {
        const result = await this.#source.next();
        if (!result.done) {
            const nextNode = {
                value: result.value,
                next: undefined,
            };
            this.#queue.next = nextNode;
            this.#queue = nextNode;
        }
        else {
            this.done = true;
        }
    }
}
export function tee(iterable, n = 2) {
    const queue = new Queue(iterable);
    async function* generator() {
        let buffer = queue.head;
        while (true) {
            if (buffer.next) {
                buffer = buffer.next;
                yield buffer.value;
            }
            else if (queue.done) {
                return;
            }
            else {
                await queue.next();
            }
        }
    }
    const branches = Array.from({ length: n }).map(() => generator());
    return branches;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWVBLE1BQU0sS0FBSztJQUNULE9BQU8sQ0FBbUI7SUFDMUIsTUFBTSxDQUFlO0lBQ3JCLElBQUksQ0FBZTtJQUVuQixJQUFJLENBQVU7SUFFZCxZQUFZLFFBQTBCO1FBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDWixLQUFLLEVBQUUsU0FBVTtZQUNqQixJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDO1FBQ0YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtZQUNoQixNQUFNLFFBQVEsR0FBaUI7Z0JBQzdCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztnQkFDbkIsSUFBSSxFQUFFLFNBQVM7YUFDaEIsQ0FBQztZQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztZQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztTQUN4QjthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDbEI7SUFDSCxDQUFDO0NBQ0Y7QUErQkQsTUFBTSxVQUFVLEdBQUcsQ0FDakIsUUFBMEIsRUFDMUIsSUFBTyxDQUFNO0lBRWIsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUksUUFBUSxDQUFDLENBQUM7SUFFckMsS0FBSyxTQUFTLENBQUMsQ0FBQyxTQUFTO1FBQ3ZCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDeEIsT0FBTyxJQUFJLEVBQUU7WUFDWCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ3JCLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQzthQUNwQjtpQkFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQ3JCLE9BQU87YUFDUjtpQkFBTTtnQkFDTCxNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQjtTQUNGO0lBQ0gsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQzVDLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUlsQixDQUFDO0lBQ0YsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjEgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5cbi8vIFV0aWxpdHkgZm9yIHJlcHJlc2VudGluZyBuLXR1cGxlXG50eXBlIFR1cGxlPFQsIE4gZXh0ZW5kcyBudW1iZXI+ID0gTiBleHRlbmRzIE5cbiAgPyBudW1iZXIgZXh0ZW5kcyBOID8gVFtdIDogVHVwbGVPZjxULCBOLCBbXT5cbiAgOiBuZXZlcjtcbnR5cGUgVHVwbGVPZjxULCBOIGV4dGVuZHMgbnVtYmVyLCBSIGV4dGVuZHMgdW5rbm93bltdPiA9IFJbXCJsZW5ndGhcIl0gZXh0ZW5kcyBOXG4gID8gUlxuICA6IFR1cGxlT2Y8VCwgTiwgW1QsIC4uLlJdPjtcblxuaW50ZXJmYWNlIFF1ZXVlTm9kZTxUPiB7XG4gIHZhbHVlOiBUO1xuICBuZXh0OiBRdWV1ZU5vZGU8VD4gfCB1bmRlZmluZWQ7XG59XG5cbmNsYXNzIFF1ZXVlPFQ+IHtcbiAgI3NvdXJjZTogQXN5bmNJdGVyYXRvcjxUPjtcbiAgI3F1ZXVlOiBRdWV1ZU5vZGU8VD47XG4gIGhlYWQ6IFF1ZXVlTm9kZTxUPjtcblxuICBkb25lOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGl0ZXJhYmxlOiBBc3luY0l0ZXJhYmxlPFQ+KSB7XG4gICAgdGhpcy4jc291cmNlID0gaXRlcmFibGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKCk7XG4gICAgdGhpcy4jcXVldWUgPSB7XG4gICAgICB2YWx1ZTogdW5kZWZpbmVkISxcbiAgICAgIG5leHQ6IHVuZGVmaW5lZCxcbiAgICB9O1xuICAgIHRoaXMuaGVhZCA9IHRoaXMuI3F1ZXVlO1xuICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLiNzb3VyY2UubmV4dCgpO1xuICAgIGlmICghcmVzdWx0LmRvbmUpIHtcbiAgICAgIGNvbnN0IG5leHROb2RlOiBRdWV1ZU5vZGU8VD4gPSB7XG4gICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUsXG4gICAgICAgIG5leHQ6IHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgICB0aGlzLiNxdWV1ZS5uZXh0ID0gbmV4dE5vZGU7XG4gICAgICB0aGlzLiNxdWV1ZSA9IG5leHROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJyYW5jaGVzIHRoZSBnaXZlbiBhc3luYyBpdGVyYWJsZSBpbnRvIHRoZSBuIGJyYW5jaGVzLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICAgICBpbXBvcnQgeyB0ZWUgfSBmcm9tIFwiLi90ZWUudHNcIjtcbiAqXG4gKiAgICAgY29uc3QgZ2VuID0gYXN5bmMgZnVuY3Rpb24qIGdlbigpIHtcbiAqICAgICAgIHlpZWxkIDE7XG4gKiAgICAgICB5aWVsZCAyO1xuICogICAgICAgeWllbGQgMztcbiAqICAgICB9XG4gKlxuICogICAgIGNvbnN0IFticmFuY2gxLCBicmFuY2gyXSA9IHRlZShnZW4oKSk7XG4gKlxuICogICAgIChhc3luYyAoKSA9PiB7XG4gKiAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG4gb2YgYnJhbmNoMSkge1xuICogICAgICAgICBjb25zb2xlLmxvZyhuKTsgLy8gPT4gMSwgMiwgM1xuICogICAgICAgfVxuICogICAgIH0pKCk7XG4gKlxuICogICAgIChhc3luYyAoKSA9PiB7XG4gKiAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG4gb2YgYnJhbmNoMikge1xuICogICAgICAgICBjb25zb2xlLmxvZyhuKTsgLy8gPT4gMSwgMiwgM1xuICogICAgICAgfVxuICogICAgIH0pKCk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRlZTxULCBOIGV4dGVuZHMgbnVtYmVyID0gMj4oXG4gIGl0ZXJhYmxlOiBBc3luY0l0ZXJhYmxlPFQ+LFxuICBuOiBOID0gMiBhcyBOLFxuKTogVHVwbGU8QXN5bmNJdGVyYWJsZTxUPiwgTj4ge1xuICBjb25zdCBxdWV1ZSA9IG5ldyBRdWV1ZTxUPihpdGVyYWJsZSk7XG5cbiAgYXN5bmMgZnVuY3Rpb24qIGdlbmVyYXRvcigpOiBBc3luY0dlbmVyYXRvcjxUPiB7XG4gICAgbGV0IGJ1ZmZlciA9IHF1ZXVlLmhlYWQ7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChidWZmZXIubmV4dCkge1xuICAgICAgICBidWZmZXIgPSBidWZmZXIubmV4dDtcbiAgICAgICAgeWllbGQgYnVmZmVyLnZhbHVlO1xuICAgICAgfSBlbHNlIGlmIChxdWV1ZS5kb25lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHF1ZXVlLm5leHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBicmFuY2hlcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IG4gfSkubWFwKFxuICAgICgpID0+IGdlbmVyYXRvcigpLFxuICApIGFzIFR1cGxlPFxuICAgIEFzeW5jSXRlcmFibGU8VD4sXG4gICAgTlxuICA+O1xuICByZXR1cm4gYnJhbmNoZXM7XG59XG4iXX0=