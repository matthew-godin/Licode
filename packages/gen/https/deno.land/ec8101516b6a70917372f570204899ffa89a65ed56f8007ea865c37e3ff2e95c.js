import { assert } from "../_util/assert.ts";
const DEFAULT_BUFFER_SIZE = 32 * 1024;
export async function copyN(r, dest, size) {
    let bytesRead = 0;
    let buf = new Uint8Array(DEFAULT_BUFFER_SIZE);
    while (bytesRead < size) {
        if (size - bytesRead < DEFAULT_BUFFER_SIZE) {
            buf = new Uint8Array(size - bytesRead);
        }
        const result = await r.read(buf);
        const nread = result ?? 0;
        bytesRead += nread;
        if (nread > 0) {
            let n = 0;
            while (n < nread) {
                n += await dest.write(buf.slice(n, nread));
            }
            assert(n === nread, "could not write");
        }
        if (result === null) {
            break;
        }
    }
    return bytesRead;
}
export async function readShort(buf) {
    const high = await buf.readByte();
    if (high === null)
        return null;
    const low = await buf.readByte();
    if (low === null)
        throw new Deno.errors.UnexpectedEof();
    return (high << 8) | low;
}
export async function readInt(buf) {
    const high = await readShort(buf);
    if (high === null)
        return null;
    const low = await readShort(buf);
    if (low === null)
        throw new Deno.errors.UnexpectedEof();
    return (high << 16) | low;
}
const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
export async function readLong(buf) {
    const high = await readInt(buf);
    if (high === null)
        return null;
    const low = await readInt(buf);
    if (low === null)
        throw new Deno.errors.UnexpectedEof();
    const big = (BigInt(high) << 32n) | BigInt(low);
    if (big > MAX_SAFE_INTEGER) {
        throw new RangeError("Long value too big to be represented as a JavaScript number.");
    }
    return Number(big);
}
export function sliceLongToBytes(d, dest = new Array(8)) {
    let big = BigInt(d);
    for (let i = 0; i < 8; i++) {
        dest[7 - i] = Number(big & 0xffn);
        big >>= 8n;
    }
    return dest;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QyxNQUFNLG1CQUFtQixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFRdEMsTUFBTSxDQUFDLEtBQUssVUFBVSxLQUFLLENBQ3pCLENBQVMsRUFDVCxJQUFZLEVBQ1osSUFBWTtJQUVaLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNsQixJQUFJLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzlDLE9BQU8sU0FBUyxHQUFHLElBQUksRUFBRTtRQUN2QixJQUFJLElBQUksR0FBRyxTQUFTLEdBQUcsbUJBQW1CLEVBQUU7WUFDMUMsR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQztTQUN4QztRQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBQzFCLFNBQVMsSUFBSSxLQUFLLENBQUM7UUFDbkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsT0FBTyxDQUFDLEdBQUcsS0FBSyxFQUFFO2dCQUNoQixDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDNUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ25CLE1BQU07U0FDUDtLQUNGO0lBQ0QsT0FBTyxTQUFT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