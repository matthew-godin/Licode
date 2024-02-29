import { RouterContext, Status } from "https://deno.land/x/oak/mod.ts";
import { validateEmail, validatePassword, validateUsername } from "./methods/Validation/Validation.ts";
import AuthUser from "../../../interfaces/AuthUser.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/async.ts";

const register = async (context: RouterContext<any>, client: Client, sids: { [name: string]: string }) => {
    let sid = await context.cookies.get('sid');
    if (!sid) {
        sid = await nanoid(40);
        context.cookies.set('sid', sid);
    }
    try {
        if (!context.request.hasBody) {
            context.throw(Status.BadRequest, "Bad Request");
        }
        const body = context.request.body;
        let user: Partial<AuthUser> | undefined;
        if (body.type() === "json") {
            user = await body.json();
        }
        if (user) {
            context.assert(
                typeof user?.email?.value === "string"
                && typeof user?.username?.value === "string"
                && typeof user?.password?.value === "string", Status.BadRequest);
            context.response.status = Status.OK;
            var password : string = user?.password?.value ?? "";
            var email : string = user?.email?.value ?? "";
            var username : string = user?.username?.value ?? "";
            var validationMessage = validateUsername(username, true);
            if (validationMessage !== "") {
                context.response.body = { text: validationMessage };
                return;
            }
            validationMessage = validateEmail(email, true);
            if (validationMessage !== "") {
                context.response.body = { text: validationMessage };
                return;
            }
            validationMessage = validatePassword(password, true);
            if (validationMessage !== "") {
                context.response.body = { text: validationMessage };
                return;
            }
            await client.connect();
            const usernameResult = await client.queryArray("select username from users where username='"
                + user?.username?.value + "'");
            if (usernameResult.rows.length < 1) {
                let emailLowerCase: string | undefined = user?.email?.value?.toLowerCase();
                const emailResult = await client.queryArray("select email from users where email='" + emailLowerCase + "'");
                if (emailResult.rows.length < 1) {
                    let saltHexString = '';
                    for (let i = 0; i < 32; ++i) {
                        saltHexString += Math.floor(Math.random() * Math.pow(2, 32)).toString(16);
                    }
                    let saltHexStringLength = saltHexString.length;
                    for (let i = 0; i < 256 - saltHexStringLength; ++i) {
                        saltHexString = "0" + saltHexString;
                    }
                    let textEncoder = new TextEncoder();
                    let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512',
                        textEncoder.encode(user?.password?.value + saltHexString)));
                    let hashedPasswordHexString = '';
                    for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                        hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "")
                            + hashedPasswordUint8Array[i].toString(16);
                    }
                    let hashedPasswordHexStringLength = hashedPasswordHexString.length;
                    for (let i = 0; i < 128 - hashedPasswordHexStringLength; ++i) {
                        hashedPasswordHexString = "0" + hashedPasswordHexString;
                    }
                    await client.queryArray(
                        "insert into public.users(email, username, hashed_password, salt, num_wins, num_losses, created_at, updated_at, elo_rating, has_2400_rating_history)"
                        + " values ('" + emailLowerCase + "', '" + user?.username?.value + "', '"
                        + "\\x" + hashedPasswordHexString + "', '" + "\\x" + saltHexString + "', '0', '0', now(), now(), '1000', 'false')");
                    let sid = await nanoid(40);
                    sids[sid] = user.username.value;
                    await context.cookies.set('sid', sid);
                    context.response.body = user;
                } else {
                    context.response.body = { text: 'Given Email Already Exists' };
                }
            } else {
                context.response.body = { text: 'Given Username Already Exists' };
            }
            await client.end();
            context.response.type = "json";
            return;
        }
        context.throw(Status.BadRequest, "Bad Request");
    } catch (err) {
        console.log(err);
    }
};

export default register;
