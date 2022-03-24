/*!
 * Adapted directly from negotiator at https://github.com/jshttp/negotiator/
 * which is licensed as follows:
 *
 * (The MIT License)
 *
 * Copyright (c) 2012-2014 Federico Romero
 * Copyright (c) 2012-2014 Isaac Z. Schlueter
 * Copyright (c) 2014-2015 Douglas Christopher Wilson
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { compareSpecs, isQuality } from "./common.ts";
const SIMPLE_LANGUAGE_REGEXP = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
function parseLanguage(str, i) {
    const match = SIMPLE_LANGUAGE_REGEXP.exec(str);
    if (!match) {
        return undefined;
    }
    const [, prefix, suffix] = match;
    const full = suffix ? `${prefix}-${suffix}` : prefix;
    let q = 1;
    if (match[3]) {
        const params = match[3].split(";");
        for (const param of params) {
            const [key, value] = param.trim().split("=");
            if (key === "q") {
                q = parseFloat(value);
                break;
            }
        }
    }
    return { prefix, suffix, full, q, i };
}
function parseAcceptLanguage(accept) {
    const accepts = accept.split(",");
    const result = [];
    for (let i = 0; i < accepts.length; i++) {
        const language = parseLanguage(accepts[i].trim(), i);
        if (language) {
            result.push(language);
        }
    }
    return result;
}
function specify(language, spec, i) {
    const p = parseLanguage(language, i);
    if (!p) {
        return undefined;
    }
    let s = 0;
    if (spec.full.toLowerCase() === p.full.toLowerCase()) {
        s |= 4;
    }
    else if (spec.prefix.toLowerCase() === p.prefix.toLowerCase()) {
        s |= 2;
    }
    else if (spec.full.toLowerCase() === p.prefix.toLowerCase()) {
        s |= 1;
    }
    else if (spec.full !== "*") {
        return;
    }
    return { i, o: spec.i, q: spec.q, s };
}
function getLanguagePriority(language, accepted, index) {
    let priority = { i: -1, o: -1, q: 0, s: 0 };
    for (const accepts of accepted) {
        const spec = specify(language, accepts, index);
        if (spec &&
            ((priority.s ?? 0) - (spec.s ?? 0) || priority.q - spec.q ||
                (priority.o ?? 0) - (spec.o ?? 0)) < 0) {
            priority = spec;
        }
    }
    return priority;
}
export function preferredLanguages(accept = "*", provided) {
    const accepts = parseAcceptLanguage(accept);
    if (!provided) {
        return accepts
            .filter(isQuality)
            .sort(compareSpecs)
            .map((spec) => spec.full);
    }
    const priorities = provided
        .map((type, index) => getLanguagePriority(type, accepts, index));
    return priorities
        .filter(isQuality)
        .sort(compareSpecs)
        .map((priority) => provided[priorities.indexOf(priority)]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW5ndWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFlLE1BQU0sYUFBYSxDQUFDO0FBUW5FLE1BQU0sc0JBQXNCLEdBQUcsOENBQThDLENBQUM7QUFFOUUsU0FBUyxhQUFhLENBQ3BCLEdBQVcsRUFDWCxDQUFTO0lBRVQsTUFBTSxLQUFLLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDVixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDakMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBRXJELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1osTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtZQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0MsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFO2dCQUNmLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU07YUFDUDtTQUNGO0tBQ0Y7SUFFRCxPQUFPLEVBQUUsTUFBTSxFQUFF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LE1BQU0sQ0FBQyxDQUFDO0lBRTVDLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDYixPQUFPLE9BQU87YUFDWCxNQUFNLENBQUMsU0FBUyxDQUFDO2FBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDbEIsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7SUFFRCxNQUFNLFVBQVUsR0FBRyxRQUFRO1NBQ3hCLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVuRSxPQUFPLFVBQVU7U0FDZCxNQUFNLENBQUMsU0FBUyxDQUFDO1NBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDbEIsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQWRhcHRlZCBkaXJlY3RseSBmcm9tIG5lZ290aWF0b3IgYXQgaHR0cHM6Ly9naXRodWIuY29tL2pzaHR0cC9uZWdvdGlhdG9yL1xuICogd2hpY2ggaXMgbGljZW5zZWQgYXMgZm9sbG93czpcbiAqXG4gKiAoVGhlIE1JVCBMaWNlbnNlKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMi0yMDE0IEZlZGVyaWNvIFJvbWVyb1xuICogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQgSXNhYWMgWi4gU2NobHVldGVyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvblxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuICogYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4gKiAnU29mdHdhcmUnKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4gKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4gKiBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuICogdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTllcbiAqIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsXG4gKiBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRVxuICogU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0IHsgY29tcGFyZVNwZWNzLCBpc1F1YWxpdHksIFNwZWNpZmljaXR5IH0gZnJvbSBcIi4vY29tbW9uLnRzXCI7XG5cbmludGVyZmFjZSBMYW5hZ3VhZ2VTcGVjaWZpY2l0eSBleHRlbmRzIFNwZWNpZmljaXR5IHtcbiAgcHJlZml4OiBzdHJpbmc7XG4gIHN1ZmZpeD86IHN0cmluZztcbiAgZnVsbDogc3RyaW5nO1xufVxuXG5jb25zdCBTSU1QTEVfTEFOR1VBR0VfUkVHRVhQID0gL15cXHMqKFteXFxzXFwtO10rKSg/Oi0oW15cXHM7XSspKT9cXHMqKD86OyguKikpPyQvO1xuXG5mdW5jdGlvbiBwYXJzZUxhbmd1YWdlKFxuICBzdHI6IHN0cmluZyxcbiAgaTogbnVtYmVyLFxuKTogTGFuYWd1YWdlU3BlY2lmaWNpdHkgfCB1bmRlZmluZWQge1xuICBjb25zdCBtYXRjaCA9IFNJTVBMRV9MQU5HVUFHRV9SRUdFWFAuZXhlYyhzdHIpO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IFssIHByZWZpeCwgc3VmZml4XSA9IG1hdGNoO1xuICBjb25zdCBmdWxsID0gc3VmZml4ID8gYCR7cHJlZml4fS0ke3N1ZmZpeH1gIDogcHJlZml4O1xuXG4gIGxldCBxID0gMTtcbiAgaWYgKG1hdGNoWzNdKSB7XG4gICAgY29uc3QgcGFyYW1zID0gbWF0Y2hbM10uc3BsaXQoXCI7XCIpO1xuICAgIGZvciAoY29uc3QgcGFyYW0gb2YgcGFyYW1zKSB7XG4gICAgICBjb25zdCBba2V5LCB2YWx1ZV0gPSBwYXJhbS50cmltKCkuc3BsaXQoXCI9XCIpO1xuICAgICAgaWYgKGtleSA9PT0gXCJxXCIpIHtcbiAgICAgICAgcSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBwcmVmaXgsIHN1ZmZpeCwgZnVsbCwgcSwgaSB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZUFjY2VwdExhbmd1YWdlKGFjY2VwdDogc3RyaW5nKTogTGFuYWd1YWdlU3BlY2lmaWNpdHlbXSB7XG4gIGNvbnN0IGFjY2VwdHMgPSBhY2NlcHQuc3BsaXQoXCIsXCIpO1xuICBjb25zdCByZXN1bHQ6IExhbmFndWFnZVNwZWNpZmljaXR5W10gPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFjY2VwdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IHBhcnNlTGFuZ3VhZ2UoYWNjZXB0c1tpXS50cmltKCksIGkpO1xuICAgIGlmIChsYW5ndWFnZSkge1xuICAgICAgcmVzdWx0LnB1c2gobGFuZ3VhZ2UpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzcGVjaWZ5KFxuICBsYW5ndWFnZTogc3RyaW5nLFxuICBzcGVjOiBMYW5hZ3VhZ2VTcGVjaWZpY2l0eSxcbiAgaTogbnVtYmVyLFxuKTogU3BlY2lmaWNpdHkgfCB1bmRlZmluZWQge1xuICBjb25zdCBwID0gcGFyc2VMYW5ndWFnZShsYW5ndWFnZSwgaSk7XG4gIGlmICghcCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgbGV0IHMgPSAwO1xuICBpZiAoc3BlYy5mdWxsLnRvTG93ZXJDYXNlKCkgPT09IHAuZnVsbC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgcyB8PSA0O1xuICB9IGVsc2UgaWYgKHNwZWMucHJlZml4LnRvTG93ZXJDYXNlKCkgPT09IHAucHJlZml4LnRvTG93ZXJDYXNlKCkpIHtcbiAgICBzIHw9IDI7XG4gIH0gZWxzZSBpZiAoc3BlYy5mdWxsLnRvTG93ZXJDYXNlKCkgPT09IHAucHJlZml4LnRvTG93ZXJDYXNlKCkpIHtcbiAgICBzIHw9IDE7XG4gIH0gZWxzZSBpZiAoc3BlYy5mdWxsICE9PSBcIipcIikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiB7IGksIG86IHNwZWMuaSwgcTogc3BlYy5xLCBzIH07XG59XG5cbmZ1bmN0aW9uIGdldExhbmd1YWdlUHJpb3JpdHkoXG4gIGxhbmd1YWdlOiBzdHJpbmcsXG4gIGFjY2VwdGVkOiBMYW5hZ3VhZ2VTcGVjaWZpY2l0eVtdLFxuICBpbmRleDogbnVtYmVyLFxuKTogU3BlY2lmaWNpdHkge1xuICBsZXQgcHJpb3JpdHk6IFNwZWNpZmljaXR5ID0geyBpOiAtMSwgbzogLTEsIHE6IDAsIHM6IDAgfTtcbiAgZm9yIChjb25zdCBhY2NlcHRzIG9mIGFjY2VwdGVkKSB7XG4gICAgY29uc3Qgc3BlYyA9IHNwZWNpZnkobGFuZ3VhZ2UsIGFjY2VwdHMsIGluZGV4KTtcbiAgICBpZiAoXG4gICAgICBzcGVjICYmXG4gICAgICAoKHByaW9yaXR5LnMgPz8gMCkgLSAoc3BlYy5zID8/IDApIHx8IHByaW9yaXR5LnEgLSBzcGVjLnEgfHxcbiAgICAgICAgICAocHJpb3JpdHkubyA/PyAwKSAtIChzcGVjLm8gPz8gMCkpIDwgMFxuICAgICkge1xuICAgICAgcHJpb3JpdHkgPSBzcGVjO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJpb3JpdHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVmZXJyZWRMYW5ndWFnZXMoXG4gIGFjY2VwdCA9IFwiKlwiLFxuICBwcm92aWRlZD86IHN0cmluZ1tdLFxuKTogc3RyaW5nW10ge1xuICBjb25zdCBhY2NlcHRzID0gcGFyc2VBY2NlcHRMYW5ndWFnZShhY2NlcHQpO1xuXG4gIGlmICghcHJvdmlkZWQpIHtcbiAgICByZXR1cm4gYWNjZXB0c1xuICAgICAgLmZpbHRlcihpc1F1YWxpdHkpXG4gICAgICAuc29ydChjb21wYXJlU3BlY3MpXG4gICAgICAubWFwKChzcGVjKSA9PiBzcGVjLmZ1bGwpO1xuICB9XG5cbiAgY29uc3QgcHJpb3JpdGllcyA9IHByb3ZpZGVkXG4gICAgLm1hcCgodHlwZSwgaW5kZXgpID0+IGdldExhbmd1YWdlUHJpb3JpdHkodHlwZSwgYWNjZXB0cywgaW5kZXgpKTtcblxuICByZXR1cm4gcHJpb3JpdGllc1xuICAgIC5maWx0ZXIoaXNRdWFsaXR5KVxuICAgIC5zb3J0KGNvbXBhcmVTcGVjcylcbiAgICAubWFwKChwcmlvcml0eSkgPT4gcHJvdmlkZWRbcHJpb3JpdGllcy5pbmRleE9mKHByaW9yaXR5KV0pO1xufVxuIl19