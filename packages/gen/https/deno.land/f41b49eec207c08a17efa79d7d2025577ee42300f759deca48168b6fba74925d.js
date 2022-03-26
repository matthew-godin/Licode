const objectCloneMemo = new WeakMap();
function cloneArrayBuffer(srcBuffer, srcByteOffset, srcLength, _cloneConstructor) {
    return srcBuffer.slice(srcByteOffset, srcByteOffset + srcLength);
}
function cloneValue(value) {
    switch (typeof value) {
        case "number":
        case "string":
        case "boolean":
        case "undefined":
        case "bigint":
            return value;
        case "object": {
            if (objectCloneMemo.has(value)) {
                return objectCloneMemo.get(value);
            }
            if (value === null) {
                return value;
            }
            if (value instanceof Date) {
                return new Date(value.valueOf());
            }
            if (value instanceof RegExp) {
                return new RegExp(value);
            }
            if (value instanceof SharedArrayBuffer) {
                return value;
            }
            if (value instanceof ArrayBuffer) {
                const cloned = cloneArrayBuffer(value, 0, value.byteLength, ArrayBuffer);
                objectCloneMemo.set(value, cloned);
                return cloned;
            }
            if (ArrayBuffer.isView(value)) {
                const clonedBuffer = cloneValue(value.buffer);
                let length;
                if (value instanceof DataView) {
                    length = value.byteLength;
                }
                else {
                    length = value.length;
                }
                return new value.constructor(clonedBuffer, value.byteOffset, length);
            }
            if (value instanceof Map) {
                const clonedMap = new Map();
                objectCloneMemo.set(value, clonedMap);
                value.forEach((v, k) => {
                    clonedMap.set(cloneValue(k), cloneValue(v));
                });
                return clonedMap;
            }
            if (value instanceof Set) {
                const clonedSet = new Set([...value].map(cloneValue));
                objectCloneMemo.set(value, clonedSet);
                return clonedSet;
            }
            const clonedObj = {};
            objectCloneMemo.set(value, clonedObj);
            const sourceKeys = Object.getOwnPropertyNames(value);
            for (const key of sourceKeys) {
                clonedObj[key] = cloneValue(value[key]);
            }
            Reflect.setPrototypeOf(clonedObj, Reflect.getPrototypeOf(value));
            return clonedObj;
        }
        case "symbol":
        case "function":
        default:
            throw new DOMException("Uncloneable value in stream", "DataCloneError");
    }
}
const core = Deno?.core;
const structuredClone = globalThis.structuredClone;
function sc(value) {
    return structuredClone
        ? structuredClone(value)
        : core
            ? core.deserialize(core.serialize(value))
            : cloneValue(value);
}
export function cloneState(state) {
    const clone = {};
    for (const [key, value] of Object.entries(state)) {
        try {
            const clonedValue = sc(value);
            clone[key] = clonedValue;
        }
        catch {
        }
    }
    return clone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJlZF9jbG9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cnVjdHVyZWRfY2xvbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUNBLE1BQU0sZUFBZSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFdEMsU0FBUyxnQkFBZ0IsQ0FDdkIsU0FBc0IsRUFDdEIsYUFBcUIsRUFDckIsU0FBaUIsRUFFakIsaUJBQXNCO0lBR3RCLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FDcEIsYUFBYSxFQUNiLGFBQWEsR0FBRyxTQUFTLENBQzFCLENBQUM7QUFDSixDQUFDO0FBS0QsU0FBUyxVQUFVLENBQUMsS0FBVTtJQUM1QixRQUFRLE9BQU8sS0FBSyxFQUFFO1FBQ3BCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFNBQVMsQ0FBQztRQUNmLEtBQUssV0FBVyxDQUFDO1FBQ2pCLEtBQUssUUFBUTtZQUNYLE9BQU8sS0FBSyxDQUFDO1FBQ2YsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNiLElBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDOUIsT0FBTyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO2dCQUNsQixPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsSUFBSSxLQUFLLFlBQVksSUFBSSxFQUFFO2dCQUN6QixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQ2xDO1lBQ0QsSUFBSSxLQUFLLFlBQVksTUFBTSxFQUFFO2dCQUMzQixPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzFCO1lBQ0QsSUFBSSxLQUFLLFlBQVksaUJBQWlCLEVBQUU7Z0JBQ3RDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFDRCxJQUFJLEtBQUssWUFBWSxX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QixDQUFDO0FBSUQsTUFBTSxVQUFVLFVBQVUsQ0FBZ0MsS0FBUTtJQUNoRSxNQUFNLEtBQUssR0FBRyxFQUFPLENBQUM7SUFDdEIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDaEQsSUFBSTtZQUNGLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixLQUFLLENBQUMsR0FBYyxDQUFDLEdBQUcsV0FBVyxDQUFDO1NBQ3JDO1FBQUMsTUFBTTtTQUVQO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBvYWsgYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5cbmV4cG9ydCB0eXBlIFN0cnVjdHVyZWRDbG9uYWJsZSA9XG4gIHwgeyBba2V5OiBzdHJpbmddOiBTdHJ1Y3R1cmVkQ2xvbmFibGUgfVxuICB8IEFycmF5PFN0cnVjdHVyZWRDbG9uYWJsZT5cbiAgfCBBcnJheUJ1ZmZlclxuICB8IEFycmF5QnVmZmVyVmlld1xuICB8IEJpZ0ludFxuICB8IGJpZ2ludFxuICB8IEJsb2JcbiAgLy8gZGVuby1saW50LWlnbm9yZSBiYW4tdHlwZXNcbiAgfCBCb29sZWFuXG4gIHwgYm9vbGVhblxuICB8IERhdGVcbiAgfCBFcnJvclxuICB8IEV2YWxFcnJvclxuICB8IE1hcDxTdHJ1Y3R1cmVkQ2xvbmFibGUsIFN0cnVjdHVyZWRDbG9uYWJsZT5cbiAgLy8gZGVuby1saW50LWlnbm9yZSBiYW4tdHlwZXNcbiAgfCBOdW1iZXJcbiAgfCBudW1iZXJcbiAgfCBSYW5nZUVycm9yXG4gIHwgUmVmZXJlbmNlRXJyb3JcbiAgfCBSZWdFeHBcbiAgfCBTZXQ8U3RydWN0dXJlZENsb25hYmxlPlxuICAvLyBkZW5vLWxpbnQtaWdub3JlIGJhbi10eXBlc1xuICB8IFN0cmluZ1xuICB8IHN0cmluZ1xuICB8IFN5bnRheEVycm9yXG4gIHwgVHlwZUVycm9yXG4gIHwgVVJJRXJyb3I7XG5cbi8qKiBJbnRlcm5hbCBmdW5jdGlvbnMgb24gdGhlIGBEZW5vLmNvcmVgIG5hbWVzcGFjZSAqL1xuaW50ZXJmYWNlIERlbm9Db3JlIHtcbiAgZGVzZXJpYWxpemUodmFsdWU6IHVua25vd24pOiBTdHJ1Y3R1cmVkQ2xvbmFibGU7XG4gIHNlcmlhbGl6ZSh2YWx1ZTogU3RydWN0dXJlZENsb25hYmxlKTogdW5rbm93bjtcbn1cblxuY29uc3Qgb2JqZWN0Q2xvbmVNZW1vID0gbmV3IFdlYWtNYXAoKTtcblxuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihcbiAgc3JjQnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgc3JjQnl0ZU9mZnNldDogbnVtYmVyLFxuICBzcmNMZW5ndGg6IG51bWJlcixcbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgX2Nsb25lQ29uc3RydWN0b3I6IGFueSxcbikge1xuICAvLyB0aGlzIGZ1bmN0aW9uIGZ1ZGdlcyB0aGUgcmV0dXJuIHR5cGUgYnV0IFNoYXJlZEFycmF5QnVmZmVyIGlzIGRpc2FibGVkIGZvciBhIHdoaWxlIGFueXdheVxuICByZXR1cm4gc3JjQnVmZmVyLnNsaWNlKFxuICAgIHNyY0J5dGVPZmZzZXQsXG4gICAgc3JjQnl0ZU9mZnNldCArIHNyY0xlbmd0aCxcbiAgKTtcbn1cblxuLyoqIEEgbG9vc2UgYXBwcm94aW1hdGlvbiBmb3Igc3RydWN0dXJlZCBjbG9uaW5nLCB1c2VkIHdoZW4gdGhlIGBEZW5vLmNvcmVgXG4gKiBBUElzIGFyZSBub3QgYXZhaWxhYmxlLiAqL1xuLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbmZ1bmN0aW9uIGNsb25lVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XG4gIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgIGNhc2UgXCJ1bmRlZmluZWRcIjpcbiAgICBjYXNlIFwiYmlnaW50XCI6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgY2FzZSBcIm9iamVjdFwiOiB7XG4gICAgICBpZiAob2JqZWN0Q2xvbmVNZW1vLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdENsb25lTWVtby5nZXQodmFsdWUpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlLnZhbHVlT2YoKSk7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodmFsdWUpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU2hhcmVkQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgY29uc3QgY2xvbmVkID0gY2xvbmVBcnJheUJ1ZmZlcihcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAwLFxuICAgICAgICAgIHZhbHVlLmJ5dGVMZW5ndGgsXG4gICAgICAgICAgQXJyYXlCdWZmZXIsXG4gICAgICAgICk7XG4gICAgICAgIG9iamVjdENsb25lTWVtby5zZXQodmFsdWUsIGNsb25lZCk7XG4gICAgICAgIHJldHVybiBjbG9uZWQ7XG4gICAgICB9XG4gICAgICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSkge1xuICAgICAgICBjb25zdCBjbG9uZWRCdWZmZXIgPSBjbG9uZVZhbHVlKHZhbHVlLmJ1ZmZlcik7XG4gICAgICAgIC8vIFVzZSBEYXRhVmlld0NvbnN0cnVjdG9yIHR5cGUgcHVyZWx5IGZvciB0eXBlLWNoZWNraW5nLCBjYW4gYmUgYVxuICAgICAgICAvLyBEYXRhVmlldyBvciBUeXBlZEFycmF5LiAgVGhleSB1c2UgdGhlIHNhbWUgY29uc3RydWN0b3Igc2lnbmF0dXJlLFxuICAgICAgICAvLyBvbmx5IERhdGFWaWV3IGhhcyBhIGxlbmd0aCBpbiBieXRlcyBhbmQgVHlwZWRBcnJheXMgdXNlIGEgbGVuZ3RoIGluXG4gICAgICAgIC8vIHRlcm1zIG9mIGVsZW1lbnRzLCBzbyB3ZSBhZGp1c3QgZm9yIHRoYXQuXG4gICAgICAgIGxldCBsZW5ndGg7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGFWaWV3KSB7XG4gICAgICAgICAgbGVuZ3RoID0gdmFsdWUuYnl0ZUxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICAgICAgICAgIGxlbmd0aCA9ICh2YWx1ZSBhcyBhbnkpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICAgICAgICByZXR1cm4gbmV3ICh2YWx1ZS5jb25zdHJ1Y3RvciBhcyBhbnkpKFxuICAgICAgICAgIGNsb25lZEJ1ZmZlcixcbiAgICAgICAgICB2YWx1ZS5ieXRlT2Zmc2V0LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICBjb25zdCBjbG9uZWRNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIG9iamVjdENsb25lTWVtby5zZXQodmFsdWUsIGNsb25lZE1hcCk7XG4gICAgICAgIHZhbHVlLmZvckVhY2goKHYsIGspID0+IHtcbiAgICAgICAgICBjbG9uZWRNYXAuc2V0KGNsb25lVmFsdWUoayksIGNsb25lVmFsdWUodikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNsb25lZE1hcDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICAvLyBhc3N1bWVzIHRoYXQgY2xvbmVWYWx1ZSBzdGlsbCB0YWtlcyBvbmx5IG9uZSBhcmd1bWVudFxuICAgICAgICBjb25zdCBjbG9uZWRTZXQgPSBuZXcgU2V0KFsuLi52YWx1ZV0ubWFwKGNsb25lVmFsdWUpKTtcbiAgICAgICAgb2JqZWN0Q2xvbmVNZW1vLnNldCh2YWx1ZSwgY2xvbmVkU2V0KTtcbiAgICAgICAgcmV0dXJuIGNsb25lZFNldDtcbiAgICAgIH1cblxuICAgICAgLy8gZGVmYXVsdCBmb3Igb2JqZWN0c1xuICAgICAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgICAgIGNvbnN0IGNsb25lZE9iajogUmVjb3JkPGFueSwgYW55PiA9IHt9O1xuICAgICAgb2JqZWN0Q2xvbmVNZW1vLnNldCh2YWx1ZSwgY2xvbmVkT2JqKTtcbiAgICAgIGNvbnN0IHNvdXJjZUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBzb3VyY2VLZXlzKSB7XG4gICAgICAgIGNsb25lZE9ialtrZXldID0gY2xvbmVWYWx1ZSh2YWx1ZVtrZXldKTtcbiAgICAgIH1cbiAgICAgIFJlZmxlY3Quc2V0UHJvdG90eXBlT2YoY2xvbmVkT2JqLCBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKSk7XG4gICAgICByZXR1cm4gY2xvbmVkT2JqO1xuICAgIH1cbiAgICBjYXNlIFwic3ltYm9sXCI6XG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBET01FeGNlcHRpb24oXCJVbmNsb25lYWJsZSB2YWx1ZSBpbiBzdHJlYW1cIiwgXCJEYXRhQ2xvbmVFcnJvclwiKTtcbiAgfVxufVxuXG4vLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuY29uc3QgY29yZSA9IChEZW5vIGFzIGFueSk/LmNvcmUgYXMgRGVub0NvcmUgfCB1bmRlZmluZWQ7XG5jb25zdCBzdHJ1Y3R1cmVkQ2xvbmU6ICgodmFsdWU6IHVua25vd24pID0+IHVua25vd24pIHwgdW5kZWZpbmVkID1cbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgKGdsb2JhbFRoaXMgYXMgYW55KS5zdHJ1Y3R1cmVkQ2xvbmU7XG5cbi8qKlxuICogUHJvdmlkZXMgc3RydWN0dXJlZCBjbG9uaW5nXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHNjPFQgZXh0ZW5kcyBTdHJ1Y3R1cmVkQ2xvbmFibGU+KHZhbHVlOiBUKTogVCB7XG4gIHJldHVybiBzdHJ1Y3R1cmVkQ2xvbmVcbiAgICA/IHN0cnVjdHVyZWRDbG9uZSh2YWx1ZSlcbiAgICA6IGNvcmVcbiAgICA/IGNvcmUuZGVzZXJpYWxpemUoY29yZS5zZXJpYWxpemUodmFsdWUpKVxuICAgIDogY2xvbmVWYWx1ZSh2YWx1ZSk7XG59XG5cbi8qKiBDbG9uZXMgYSBzdGF0ZSBvYmplY3QsIHNraXBwaW5nIGFueSB2YWx1ZXMgdGhhdCBjYW5ub3QgYmUgY2xvbmVkLiAqL1xuLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbmV4cG9ydCBmdW5jdGlvbiBjbG9uZVN0YXRlPFMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+PihzdGF0ZTogUyk6IFMge1xuICBjb25zdCBjbG9uZSA9IHt9IGFzIFM7XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHN0YXRlKSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjbG9uZWRWYWx1ZSA9IHNjKHZhbHVlKTtcbiAgICAgIGNsb25lW2tleSBhcyBrZXlvZiBTXSA9IGNsb25lZFZhbHVlO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gd2UganVzdCBuby1vcCB2YWx1ZXMgdGhhdCBjYW5ub3QgYmUgY2xvbmVkXG4gICAgfVxuICB9XG4gIHJldHVybiBjbG9uZTtcbn1cbiJdfQ==