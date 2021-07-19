import { parseArray } from "./array_parser.ts";
const BACKSLASH_BYTE_VALUE = 92;
const BC_RE = /BC$/;
const DATE_RE = /^(\d{1,})-(\d{2})-(\d{2})$/;
const DATETIME_RE = /^(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?/;
const HEX = 16;
const HEX_PREFIX_REGEX = /^\\x/;
const TIMEZONE_RE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
export function decodeBigint(value) {
    return BigInt(value);
}
export function decodeBigintArray(value) {
    return parseArray(value, (x) => BigInt(x));
}
export function decodeBoolean(value) {
    return value[0] === "t";
}
export function decodeBooleanArray(value) {
    return parseArray(value, (x) => x[0] === "t");
}
export function decodeBox(value) {
    const [a, b] = value.match(/\(.*?\)/g) || [];
    return {
        a: decodePoint(a),
        b: decodePoint(b),
    };
}
export function decodeBoxArray(value) {
    return parseArray(value, decodeBox);
}
export function decodeBytea(byteaStr) {
    if (HEX_PREFIX_REGEX.test(byteaStr)) {
        return decodeByteaHex(byteaStr);
    }
    else {
        return decodeByteaEscape(byteaStr);
    }
}
export function decodeByteaArray(value) {
    return parseArray(value, decodeBytea);
}
function decodeByteaEscape(byteaStr) {
    const bytes = [];
    let i = 0;
    let k = 0;
    while (i < byteaStr.length) {
        if (byteaStr[i] !== "\\") {
            bytes.push(byteaStr.charCodeAt(i));
            ++i;
        }
        else {
            if (/[0-7]{3}/.test(byteaStr.substr(i + 1, 3))) {
                bytes.push(parseInt(byteaStr.substr(i + 1, 3), 8));
                i += 4;
            }
            else {
                let backslashes = 1;
                while (i + backslashes < byteaStr.length &&
                    byteaStr[i + backslashes] === "\\") {
                    backslashes++;
                }
                for (k = 0; k < Math.floor(backslashes / 2); ++k) {
                    bytes.push(BACKSLASH_BYTE_VALUE);
                }
                i += Math.floor(backslashes / 2) * 2;
            }
        }
    }
    return new Uint8Array(bytes);
}
function decodeByteaHex(byteaStr) {
    const bytesStr = byteaStr.slice(2);
    const bytes = new Uint8Array(bytesStr.length / 2);
    for (let i = 0, j = 0; i < bytesStr.length; i += 2, j++) {
        bytes[j] = parseInt(bytesStr[i] + bytesStr[i + 1], HEX);
    }
    return bytes;
}
export function decodeCircle(value) {
    const [point, radius] = value.substring(1, value.length - 1).split(/,(?![^(]*\))/);
    return {
        point: decodePoint(point),
        radius: radius,
    };
}
export function decodeCircleArray(value) {
    return parseArray(value, decodeCircle);
}
export function decodeDate(dateStr) {
    if (dateStr === "infinity") {
        return Number(Infinity);
    }
    else if (dateStr === "-infinity") {
        return Number(-Infinity);
    }
    const matches = DATE_RE.exec(dateStr);
    if (!matches) {
        throw new Error(`"${dateStr}" could not be parsed to date`);
    }
    const year = parseInt(matches[1], 10);
    const month = parseInt(matches[2], 10) - 1;
    const day = parseInt(matches[3], 10);
    const date = new Date(year, month, day);
    date.setUTCFullYear(year);
    return date;
}
export function decodeDateArray(value) {
    return parseArray(value, decodeDate);
}
export function decodeDatetime(dateStr) {
    const matches = DATETIME_RE.exec(dateStr);
    if (!matches) {
        return decodeDate(dateStr);
    }
    const isBC = BC_RE.test(dateStr);
    const year = parseInt(matches[1], 10) * (isBC ? -1 : 1);
    const month = parseInt(matches[2], 10) - 1;
    const day = parseInt(matches[3], 10);
    const hour = parseInt(matches[4], 10);
    const minute = parseInt(matches[5], 10);
    const second = parseInt(matches[6], 10);
    const msMatch = matches[7];
    const ms = msMatch ? 1000 * parseFloat(msMatch) : 0;
    let date;
    const offset = decodeTimezoneOffset(dateStr);
    if (offset === null) {
        date = new Date(year, month, day, hour, minute, second, ms);
    }
    else {
        const utc = Date.UTC(year, month, day, hour, minute, second, ms);
        date = new Date(utc + offset);
    }
    date.setUTCFullYear(year);
    return date;
}
export function decodeDatetimeArray(value) {
    return parseArray(value, decodeDatetime);
}
export function decodeInt(value) {
    return parseInt(value, 10);
}
export function decodeIntArray(value) {
    if (!value)
        return null;
    return parseArray(value, decodeInt);
}
export function decodeJson(value) {
    return JSON.parse(value);
}
export function decodeJsonArray(value) {
    return parseArray(value, JSON.parse);
}
export function decodeLine(value) {
    const [a, b, c] = value.substring(1, value.length - 1).split(",");
    return {
        a: a,
        b: b,
        c: c,
    };
}
export function decodeLineArray(value) {
    return parseArray(value, decodeLine);
}
export function decodeLineSegment(value) {
    const [a, b] = value
        .substring(1, value.length - 1)
        .match(/\(.*?\)/g) || [];
    return {
        a: decodePoint(a),
        b: decodePoint(b),
    };
}
export function decodeLineSegmentArray(value) {
    return parseArray(value, decodeLineSegment);
}
export function decodePath(value) {
    const points = value.substring(1, value.length - 1).split(/,(?![^(]*\))/);
    return points.map(decodePoint);
}
export function decodePathArray(value) {
    return parseArray(value, decodePath);
}
export function decodePoint(value) {
    const [x, y] = value.substring(1, value.length - 1).split(",");
    if (Number.isNaN(parseFloat(x)) || Number.isNaN(parseFloat(y))) {
        throw new Error(`Invalid point value: "${Number.isNaN(parseFloat(x)) ? x : y}"`);
    }
    return {
        x: x,
        y: y,
    };
}
export function decodePointArray(value) {
    return parseArray(value, decodePoint);
}
export function decodePolygon(value) {
    return decodePath(value);
}
export function decodePolygonArray(value) {
    return parseArray(value, decodePolygon);
}
export function decodeStringArray(value) {
    if (!value)
        return null;
    return parseArray(value);
}
function decodeTimezoneOffset(dateStr) {
    const timeStr = dateStr.split(" ")[1];
    const matches = TIMEZONE_RE.exec(timeStr);
    if (!matches) {
        return null;
    }
    const type = matches[1];
    if (type === "Z") {
        return 0;
    }
    const sign = type === "-" ? 1 : -1;
    const hours = parseInt(matches[2], 10);
    const minutes = parseInt(matches[3] || "0", 10);
    const seconds = parseInt(matches[4] || "0", 10);
    const offset = hours * 3600 + minutes * 60 + seconds;
    return sign * offset * 1000;
}
export function decodeTid(value) {
    const [x, y] = value.substring(1, value.length - 1).split(",");
    return [BigInt(x), BigInt(y)];
}
export function decodeTidArray(value) {
    return parseArray(value, decodeTid);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2RlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJodHRwczovL2Rlbm8ubGFuZC94L3Bvc3RncmVzQHYwLjExLjIvcXVlcnkvZGVjb2RlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBZ0IvQyxNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUNoQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDcEIsTUFBTSxPQUFPLEdBQUcsNEJBQTRCLENBQUM7QUFDN0MsTUFBTSxXQUFXLEdBQ2YsOERBQThELENBQUM7QUFDakUsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxXQUFXLEdBQUcscUNBQXFDLENBQUM7QUFFMUQsTUFBTSxVQUFVLFlBQVksQ0FBQyxLQUFhO0lBQ3hDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBYTtJQUM3QyxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxNQUFNLFVBQVUsYUFBYSxDQUFDLEtBQWE7SUFDekMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQzFCLENBQUM7QUFFRCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsS0FBYTtJQUM5QyxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FBQyxLQUFhO0lBQ3JDLE1BQU0sQ0FBQyxDQUFDLEVBQUUs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