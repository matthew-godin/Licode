import { random } from "./random.ts";
import { urlAlphabet } from "./urlAlphabet.ts";
export const nanoid = (size = 21) => {
    let id = "";
    const bytes = random(size);
    while (size--)
        id += urlAlphabet[bytes[size] & 63];
    return id;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFub2lkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmFub2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRS9DLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFVLEVBQUU7SUFDbEQsSUFBSSxFQUFFLEdBQVcsRUFBRSxDQUFDO0lBQ3BCLE1BQU0sS0FBSyxHQUFlLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQU12QyxPQUFPLElBQUksRUFBRTtRQUFFLEVBQUUsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSBcIi4vcmFuZG9tLnRzXCI7XG5pbXBvcnQgeyB1cmxBbHBoYWJldCB9IGZyb20gXCIuL3VybEFscGhhYmV0LnRzXCI7XG5cbmV4cG9ydCBjb25zdCBuYW5vaWQgPSAoc2l6ZTogbnVtYmVyID0gMjEpOiBzdHJpbmcgPT4ge1xuICBsZXQgaWQ6IHN0cmluZyA9IFwiXCI7XG4gIGNvbnN0IGJ5dGVzOiBVaW50OEFycmF5ID0gcmFuZG9tKHNpemUpO1xuICAvLyBDb21wYWN0IGFsdGVybmF0aXZlIGZvciBgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspYFxuICAvLyBXZSBjYW7igJl0IHVzZSBieXRlcyBiaWdnZXIgdGhhbiB0aGUgYWxwaGFiZXQuIDYzIGlzIDAwMTExMTExIGJpdG1hc2suXG4gIC8vIFRoaXMgbWFzayByZWR1Y2VzIHJhbmRvbSBieXRlIDAtMjU1IHRvIDAtNjMgdmFsdWVzLlxuICAvLyBUaGVyZSBpcyBubyBuZWVkIGluIGB8fCAnJ2AgYW5kIGAqIDEuNmAgaGFja3MgaW4gaGVyZSxcbiAgLy8gYmVjYXVzZSBiaXRtYXNrIHRyaW0gYnl0ZXMgZXhhY3QgdG8gYWxwaGFiZXQgc2l6ZS5cbiAgd2hpbGUgKHNpemUtLSkgaWQgKz0gdXJsQWxwaGFiZXRbYnl0ZXNbc2l6ZV0gJiA2M107XG4gIHJldHVybiBpZDtcbn07Il19