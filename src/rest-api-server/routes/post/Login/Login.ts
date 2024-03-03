import { RouterContext, Status } from "https://deno.land/x/oak/mod.ts";
import AuthUser from "../../../interfaces/AuthUser.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/async.ts";
import { crypto } from "https://deno.land/std@0.132.0/crypto/mod.ts";

const login = async (context: RouterContext<any>, client: Client, sids: { [name: string]: string }) => {
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
            context.assert(typeof user?.email?.value === "string" && typeof user?.password?.value === "string", Status.BadRequest);
            let emailLowerCase: string | undefined = user?.email?.value?.toLowerCase();
            context.response.status = Status.OK;
            await client.connect();
            const usernameResult = await client.queryArray("select email, username, hashed_password, salt from users where username='"
                + emailLowerCase + "'");
            if (usernameResult.rows.length < 1) {
                const emailResult = await client.queryArray("select email, username, hashed_password, salt from users where email='"
                    + emailLowerCase + "'");
                if (emailResult.rows.length < 1) {
                    context.response.body = { text: 'Given Email or Username Does Not Exist' };
                } else {
                    let saltHexString = '';
                    for (let i = 0; i < (emailResult.rows[0][3] as Uint8Array).length; ++i) {
                        saltHexString += ((emailResult.rows[0][3] as Uint8Array)[i] < 16 ? "0" : "")
                            + (emailResult.rows[0][3] as Uint8Array)[i].toString(16);
                    }
                    let textEncoder = new TextEncoder();
                    let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512',
                        textEncoder.encode(user?.password?.value + saltHexString)));
                    let hashedPasswordHexString = '';
                    for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                        hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "") + hashedPasswordUint8Array[i].toString(16);
                    }
                    let serverHashedPasswordHexString = '';
                    for (let i = 0; i < (emailResult.rows[0][2] as Uint8Array).length; ++i) {
                        serverHashedPasswordHexString += ((emailResult.rows[0][2] as Uint8Array)[i] < 16 ? "0" : "")
                            + (emailResult.rows[0][2] as Uint8Array)[i].toString(16);
                    }
                    if (hashedPasswordHexString === serverHashedPasswordHexString) {
                        let foundUser = { email: { value: emailResult.rows[0][0] as string }, username: { value: emailResult.rows[0][1] as string } };
                        let sid = await nanoid(40);
                        sids[sid] = foundUser.username.value;
                        await context.cookies.set('sid', sid);
                        context.response.body = foundUser;
                    } else {
                        context.response.body = { text: 'Wrong Password' };
                    }
                }
            } else {
                let saltHexString = '';
                for (let i = 0; i < (usernameResult.rows[0][3] as Uint8Array).length; ++i) {
                    saltHexString += ((usernameResult.rows[0][3] as Uint8Array)[i] < 16 ? "0" : "")
                        + (usernameResult.rows[0][3] as Uint8Array)[i].toString(16);
                }
                let textEncoder = new TextEncoder();
                let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512',
                    textEncoder.encode(user?.password?.value + saltHexString)));
                let hashedPasswordHexString = '';
                for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                    hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "") + hashedPasswordUint8Array[i].toString(16);
                }
                let serverHashedPasswordHexString = '';
                for (let i = 0; i < (usernameResult.rows[0][2] as Uint8Array).length; ++i) {
                    serverHashedPasswordHexString += ((usernameResult.rows[0][2] as Uint8Array)[i] < 16 ? "0" : "")
                        + (usernameResult.rows[0][2] as Uint8Array)[i].toString(16);
                }
                if (hashedPasswordHexString === serverHashedPasswordHexString) {
                    let foundUser = { email: { value: usernameResult.rows[0][0] as string }, username: { value: usernameResult.rows[0][1] as string } };
                    let sid = await nanoid(40);
                    sids[sid] = foundUser.username.value;
                    await context.cookies.set('sid', sid);
                    context.response.body = foundUser;
                } else {
                    context.response.body = { text: 'Wrong Password' };
                }
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

export default login;
