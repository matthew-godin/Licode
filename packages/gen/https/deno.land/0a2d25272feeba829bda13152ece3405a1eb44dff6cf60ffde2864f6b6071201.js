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
const { core } = Deno;
function structuredClone(value) {
    return core ? core.deserialize(core.serialize(value)) : cloneValue(value);
}
export function cloneState(state) {
    const clone = {};
    for (const [key, value] of Object.entries(state)) {
        try {
            const clonedValue = structuredClone(value);
            clone[key] = clonedValue;
        }
        catch {
        }
    }
    return clone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJlZF9jbG9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cnVjdHVyZWRfY2xvbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBd0NBLE1BQU0sZUFBZSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFdEMsU0FBUyxnQkFBZ0IsQ0FDdkIsU0FBc0IsRUFDdEIsYUFBcUIsRUFDckIsU0FBaUIsRUFFakIsaUJBQXNCO0lBR3RCLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FDcEIsYUFBYSxFQUNiLGFBQWEsR0FBRyxTQUFTLENBQzFCLENBQUM7QUFDSixDQUFDO0FBS0QsU0FBUyxVQUFVLENBQUMsS0FBVTtJQUM1QixRQUFRLE9BQU8sS0FBSyxFQUFFO1FBQ3BCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFNBQVMsQ0FBQztRQUNmLEtBQUssV0FBVyxDQUFDO1FBQ2pCLEtBQUssUUFBUTtZQUNYLE9BQU8sS0FBSyxDQUFDO1FBQ2YsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNiLElBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDOUIsT0FBTyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO2dCQUNsQixPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsSUFBSSxLQUFLLFlBQVksSUFBSSxFQUFFO2dCQUN6QixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQ2xDO1lBQ0QsSUFBSSxLQUFLLFlBQVksTUFBTSxFQUFFO2dCQUMzQixPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzFCO1lBQ0QsSUFBSSxLQUFLLFlBQVksaUJBQWlCLEVBQUU7Z0JBQ3RDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFDRCxJQUFJLEtBQUssWUFBWSxX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QUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDaEQsSUFBSTtZQUNGLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxLQUFLLENBQUMsR0FBYyxDQUFDLEdBQUcsV0FBVyxDQUFDO1NBQ3JDO1FBQUMsTUFBTTtTQUVQO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIxIHRoZSBvYWsgYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5cbmV4cG9ydCB0eXBlIFN0cnVjdHVyZWRDbG9uYWJsZSA9XG4gIHwgeyBba2V5OiBzdHJpbmddOiBTdHJ1Y3R1cmVkQ2xvbmFibGUgfVxuICB8IEFycmF5PFN0cnVjdHVyZWRDbG9uYWJsZT5cbiAgfCBBcnJheUJ1ZmZlclxuICB8IEFycmF5QnVmZmVyVmlld1xuICB8IEJpZ0ludFxuICB8IGJpZ2ludFxuICB8IEJsb2JcbiAgLy8gZGVuby1saW50LWlnbm9yZSBiYW4tdHlwZXNcbiAgfCBCb29sZWFuXG4gIHwgYm9vbGVhblxuICB8IERhdGVcbiAgfCBFcnJvclxuICB8IEV2YWxFcnJvclxuICB8IE1hcDxTdHJ1Y3R1cmVkQ2xvbmFibGUsIFN0cnVjdHVyZWRDbG9uYWJsZT5cbiAgLy8gZGVuby1saW50LWlnbm9yZSBiYW4tdHlwZXNcbiAgfCBOdW1iZXJcbiAgfCBudW1iZXJcbiAgfCBSYW5nZUVycm9yXG4gIHwgUmVmZXJlbmNlRXJyb3JcbiAgfCBSZWdFeHBcbiAgfCBTZXQ8U3RydWN0dXJlZENsb25hYmxlPlxuICAvLyBkZW5vLWxpbnQtaWdub3JlIGJhbi10eXBlc1xuICB8IFN0cmluZ1xuICB8IHN0cmluZ1xuICB8IFN5bnRheEVycm9yXG4gIHwgVHlwZUVycm9yXG4gIHwgVVJJRXJyb3I7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgbmFtZXNwYWNlIERlbm8ge1xuICAgIHZhciBjb3JlOiB7XG4gICAgICBkZXNlcmlhbGl6ZSh2YWx1ZTogdW5rbm93bik6IFN0cnVjdHVyZWRDbG9uYWJsZTtcbiAgICAgIHNlcmlhbGl6ZSh2YWx1ZTogU3RydWN0dXJlZENsb25hYmxlKTogdW5rbm93bjtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IG9iamVjdENsb25lTWVtbyA9IG5ldyBXZWFrTWFwKCk7XG5cbmZ1bmN0aW9uIGNsb25lQXJyYXlCdWZmZXIoXG4gIHNyY0J1ZmZlcjogQXJyYXlCdWZmZXIsXG4gIHNyY0J5dGVPZmZzZXQ6IG51bWJlcixcbiAgc3JjTGVuZ3RoOiBudW1iZXIsXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gIF9jbG9uZUNvbnN0cnVjdG9yOiBhbnksXG4pIHtcbiAgLy8gdGhpcyBmdW5jdGlvbiBmdWRnZXMgdGhlIHJldHVybiB0eXBlIGJ1dCBTaGFyZWRBcnJheUJ1ZmZlciBpcyBkaXNhYmxlZCBmb3IgYSB3aGlsZSBhbnl3YXlcbiAgcmV0dXJuIHNyY0J1ZmZlci5zbGljZShcbiAgICBzcmNCeXRlT2Zmc2V0LFxuICAgIHNyY0J5dGVPZmZzZXQgKyBzcmNMZW5ndGgsXG4gICk7XG59XG5cbi8qKiBBIGxvb3NlIGFwcHJveGltYXRpb24gZm9yIHN0cnVjdHVyZWQgY2xvbmluZywgdXNlZCB3aGVuIHRoZSBgRGVuby5jb3JlYFxuICogQVBJcyBhcmUgbm90IGF2YWlsYWJsZS4gKi9cbi8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG5mdW5jdGlvbiBjbG9uZVZhbHVlKHZhbHVlOiBhbnkpOiBhbnkge1xuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGNhc2UgXCJvYmplY3RcIjoge1xuICAgICAgaWYgKG9iamVjdENsb25lTWVtby5oYXModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RDbG9uZU1lbW8uZ2V0KHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZS52YWx1ZU9mKCkpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFNoYXJlZEFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIGNvbnN0IGNsb25lZCA9IGNsb25lQXJyYXlCdWZmZXIoXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgMCxcbiAgICAgICAgICB2YWx1ZS5ieXRlTGVuZ3RoLFxuICAgICAgICAgIEFycmF5QnVmZmVyLFxuICAgICAgICApO1xuICAgICAgICBvYmplY3RDbG9uZU1lbW8uc2V0KHZhbHVlLCBjbG9uZWQpO1xuICAgICAgICByZXR1cm4gY2xvbmVkO1xuICAgICAgfVxuICAgICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICAgICAgY29uc3QgY2xvbmVkQnVmZmVyID0gY2xvbmVWYWx1ZSh2YWx1ZS5idWZmZXIpO1xuICAgICAgICAvLyBVc2UgRGF0YVZpZXdDb25zdHJ1Y3RvciB0eXBlIHB1cmVseSBmb3IgdHlwZS1jaGVja2luZywgY2FuIGJlIGFcbiAgICAgICAgLy8gRGF0YVZpZXcgb3IgVHlwZWRBcnJheS4gIFRoZXkgdXNlIHRoZSBzYW1lIGNvbnN0cnVjdG9yIHNpZ25hdHVyZSxcbiAgICAgICAgLy8gb25seSBEYXRhVmlldyBoYXMgYSBsZW5ndGggaW4gYnl0ZXMgYW5kIFR5cGVkQXJyYXlzIHVzZSBhIGxlbmd0aCBpblxuICAgICAgICAvLyB0ZXJtcyBvZiBlbGVtZW50cywgc28gd2UgYWRqdXN0IGZvciB0aGF0LlxuICAgICAgICBsZXQgbGVuZ3RoO1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRhVmlldykge1xuICAgICAgICAgIGxlbmd0aCA9IHZhbHVlLmJ5dGVMZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgICAgICAgICBsZW5ndGggPSAodmFsdWUgYXMgYW55KS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgICAgICAgcmV0dXJuIG5ldyAodmFsdWUuY29uc3RydWN0b3IgYXMgYW55KShcbiAgICAgICAgICBjbG9uZWRCdWZmZXIsXG4gICAgICAgICAgdmFsdWUuYnl0ZU9mZnNldCxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgY29uc3QgY2xvbmVkTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBvYmplY3RDbG9uZU1lbW8uc2V0KHZhbHVlLCBjbG9uZWRNYXApO1xuICAgICAgICB2YWx1ZS5mb3JFYWNoKCh2LCBrKSA9PiB7XG4gICAgICAgICAgY2xvbmVkTWFwLnNldChjbG9uZVZhbHVlKGspLCBjbG9uZVZhbHVlKHYpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjbG9uZWRNYXA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgLy8gYXNzdW1lcyB0aGF0IGNsb25lVmFsdWUgc3RpbGwgdGFrZXMgb25seSBvbmUgYXJndW1lbnRcbiAgICAgICAgY29uc3QgY2xvbmVkU2V0ID0gbmV3IFNldChbLi4udmFsdWVdLm1hcChjbG9uZVZhbHVlKSk7XG4gICAgICAgIG9iamVjdENsb25lTWVtby5zZXQodmFsdWUsIGNsb25lZFNldCk7XG4gICAgICAgIHJldHVybiBjbG9uZWRTZXQ7XG4gICAgICB9XG5cbiAgICAgIC8vIGRlZmF1bHQgZm9yIG9iamVjdHNcbiAgICAgIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gICAgICBjb25zdCBjbG9uZWRPYmo6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcbiAgICAgIG9iamVjdENsb25lTWVtby5zZXQodmFsdWUsIGNsb25lZE9iaik7XG4gICAgICBjb25zdCBzb3VyY2VLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2Ygc291cmNlS2V5cykge1xuICAgICAgICBjbG9uZWRPYmpba2V5XSA9IGNsb25lVmFsdWUodmFsdWVba2V5XSk7XG4gICAgICB9XG4gICAgICBSZWZsZWN0LnNldFByb3RvdHlwZU9mKGNsb25lZE9iaiwgUmVmbGVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSkpO1xuICAgICAgcmV0dXJuIGNsb25lZE9iajtcbiAgICB9XG4gICAgY2FzZSBcInN5bWJvbFwiOlxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKFwiVW5jbG9uZWFibGUgdmFsdWUgaW4gc3RyZWFtXCIsIFwiRGF0YUNsb25lRXJyb3JcIik7XG4gIH1cbn1cblxuY29uc3QgeyBjb3JlIH0gPSBEZW5vO1xuXG4vKipcbiAqIFByb3ZpZGVzIHN0cnVjdHVyZWQgY2xvbmluZ1xuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBzdHJ1Y3R1cmVkQ2xvbmU8VCBleHRlbmRzIFN0cnVjdHVyZWRDbG9uYWJsZT4odmFsdWU6IFQpOiBUIHtcbiAgcmV0dXJuIGNvcmUgPyBjb3JlLmRlc2VyaWFsaXplKGNvcmUuc2VyaWFsaXplKHZhbHVlKSkgOiBjbG9uZVZhbHVlKHZhbHVlKTtcbn1cblxuLyoqIENsb25lcyBhIHN0YXRlIG9iamVjdCwgc2tpcHBpbmcgYW55IHZhbHVlcyB0aGF0IGNhbm5vdCBiZSBjbG9uZWQuICovXG4vLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lU3RhdGU8UyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4+KHN0YXRlOiBTKTogUyB7XG4gIGNvbnN0IGNsb25lID0ge30gYXMgUztcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc3RhdGUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb25lZFZhbHVlID0gc3RydWN0dXJlZENsb25lKHZhbHVlKTtcbiAgICAgIGNsb25lW2tleSBhcyBrZXlvZiBTXSA9IGNsb25lZFZhbHVlO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gd2UganVzdCBuby1vcCB2YWx1ZXMgdGhhdCBjYW5ub3QgYmUgY2xvbmVkXG4gICAgfVxuICB9XG4gIHJldHVybiBjbG9uZTtcbn1cbiJdfQ==