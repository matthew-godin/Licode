import { Application, Router, Status, send, } from "https://deno.land/x/oak/mod.ts";
const env = Deno.env.toObject();
const app = new Application();
const router = new Router();
const port = +env.LICODE_PORT || 3000;
app.addEventListener("error", (evt) => {
    console.log(evt.error);
});
router.get("/api/hello-world", (context) => {
    context.response.body = "Hello World";
});
router.post("/api/users", async (context) => {
    if (!context.request.hasBody) {
        context.throw(Status.BadRequest, "Bad Request");
    }
    const body = context.request.body();
    let user;
    if (body.type === "json") {
        user = await body.value;
    }
    if (user) {
        context.assert(user.email &&
            typeof user.email === "string" &&
            user.username &&
            typeof user.username === "string" &&
            user.password &&
            typeof user.password === "string", Status.BadRequest);
        context.response.status = Status.OK;
        context.response.body = user;
        context.response.type = "json";
        return;
    }
    context.throw(Status.BadRequest, "Bad Request");
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
    await send(context, "/", {
        root: `${Deno.cwd()}/react-app/build`,
        index: "index.html",
    });
});
console.log("Running on port", port);
await app.listen({ port });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxXQUFXLEVBQ1gsTUFBTSxFQUVOLE1BQU0sRUFDTixJQUFJLEdBQ1AsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7QUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQVM1QixNQUFNLElBQUksR0FBVyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO0FBQzlDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtJQUN2QyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7QUFDMUMsQ0FBQyxDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBc0IsRUFBRSxFQUFFO0lBQ3ZELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtRQUMxQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7S0FDbkQ7SUFDRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BDLElBQUksSUFBK0IsQ0FBQztJQUNwQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ3RCLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDM0I7SUFDRCxJQUFJLElBQUksRUFBRTtRQUNOLE9BQU8sQ0FBQyxNQUFNLENBQ1YsSUFBSSxDQUFDLEtBQUs7WUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUTtZQUM5QixJQUFJLENBQUMsUUFBUTtZQUNiLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRO1lBQ2pDLElBQUksQ0FBQyxRQUFRO1lBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFDckMsTUFBTSxDQUFDLFVBQVUsQ0FDcEIsQ0FBQztRQUVGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDcEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUMvQixPQUFPO0tBQ1Y7SUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDcEQsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFDakMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDdEIsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLGtCQUFrQjtRQUNyQyxLQUFLLEVBQUUsWUFBWTtLQUN0QixDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQztBQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQXBwbGljYXRpb24sXG4gICAgUm91dGVyLFxuICAgIFJvdXRlckNvbnRleHQsXG4gICAgU3RhdHVzLFxuICAgIHNlbmQsXG59IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC94L29hay9tb2QudHNcIjtcbmNvbnN0IGVudiA9IERlbm8uZW52LnRvT2JqZWN0KCk7XG5jb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oKTtcbmNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuaW50ZXJmYWNlIFVzZXIge1xuICAgIGlkOiBudW1iZXI7XG4gICAgZW1haWw6IHN0cmluZztcbiAgICB1c2VybmFtZTogc3RyaW5nO1xuICAgIHBhc3N3b3JkOiBzdHJpbmc7XG59XG5cbmNvbnN0IHBvcnQ6IG51bWJlciA9ICtlbnYuTElDT0RFX1BPUlQgfHwgMzAwMDtcbmFwcC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGV2dCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGV2dC5lcnJvcik7XG59KTtcbnJvdXRlci5nZXQoXCIvYXBpL2hlbGxvLXdvcmxkXCIsIChjb250ZXh0KSA9PiB7XG4gICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gXCJIZWxsbyBXb3JsZFwiO1xufSk7XG5yb3V0ZXIucG9zdChcIi9hcGkvdXNlcnNcIiwgYXN5bmMgKGNvbnRleHQ6IFJvdXRlckNvbnRleHQpID0+IHtcbiAgICBpZiAoIWNvbnRleHQucmVxdWVzdC5oYXNCb2R5KSB7XG4gICAgICAgIGNvbnRleHQudGhyb3coU3RhdHVzLkJhZFJlcXVlc3QsIFwiQmFkIFJlcXVlc3RcIik7XG4gICAgfVxuICAgIGNvbnN0IGJvZHkgPSBjb250ZXh0LnJlcXVlc3QuYm9keSgpO1xuICAgIGxldCB1c2VyOiBQYXJ0aWFsPFVzZXI+IHwgdW5kZWZpbmVkO1xuICAgIGlmIChib2R5LnR5cGUgPT09IFwianNvblwiKSB7XG4gICAgICAgIHVzZXIgPSBhd2FpdCBib2R5LnZhbHVlO1xuICAgIH1cbiAgICBpZiAodXNlcikge1xuICAgICAgICBjb250ZXh0LmFzc2VydChcbiAgICAgICAgICAgIHVzZXIuZW1haWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdXNlci5lbWFpbCA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdXNlci51c2VybmFtZSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIHVzZXIucGFzc3dvcmQgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdXNlci5wYXNzd29yZCA9PT0gXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFN0YXR1cy5CYWRSZXF1ZXN0XG4gICAgICAgICk7XG4gICAgICAgIC8vIFNhdmUgdGhlIGJvb2sgaW4gdGhlIERCXG4gICAgICAgIGNvbnRleHQucmVzcG9uc2Uuc3RhdHVzID0gU3RhdHVzLk9LO1xuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB1c2VyO1xuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLnR5cGUgPSBcImpzb25cIjtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb250ZXh0LnRocm93KFN0YXR1cy5CYWRSZXF1ZXN0LCBcIkJhZCBSZXF1ZXN0XCIpO1xufSk7XG5hcHAudXNlKHJvdXRlci5yb3V0ZXMoKSk7XG5hcHAudXNlKHJvdXRlci5hbGxvd2VkTWV0aG9kcygpKTtcbmFwcC51c2UoYXN5bmMgKGNvbnRleHQpID0+IHtcbiAgICBhd2FpdCBzZW5kKGNvbnRleHQsIFwiL1wiLCB7XG4gICAgICAgIHJvb3Q6IGAke0Rlbm8uY3dkKCl9L3JlYWN0LWFwcC9idWlsZGAsXG4gICAgICAgIGluZGV4OiBcImluZGV4Lmh0bWxcIixcbiAgICB9KTtcbn0pO1xuY29uc29sZS5sb2coXCJSdW5uaW5nIG9uIHBvcnRcIiwgcG9ydCk7XG5hd2FpdCBhcHAubGlzdGVuKHsgcG9ydCB9KTtcbiJdfQ==