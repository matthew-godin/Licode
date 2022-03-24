export class BytesList {
    len = 0;
    chunks = [];
    constructor() { }
    size() {
        return this.len;
    }
    add(value, start = 0, end = value.byteLength) {
        if (value.byteLength === 0 || end - start === 0) {
            return;
        }
        checkRange(start, end, value.byteLength);
        this.chunks.push({
            value,
            end,
            start,
            offset: this.len,
        });
        this.len += end - start;
    }
    shift(n) {
        if (n === 0) {
            return;
        }
        if (this.len <= n) {
            this.chunks = [];
            this.len = 0;
            return;
        }
        const idx = this.getChunkIndex(n);
        this.chunks.splice(0, idx);
        const [chunk] = this.chunks;
        if (chunk) {
            const diff = n - chunk.offset;
            chunk.start += diff;
        }
        let offset = 0;
        for (const chunk of this.chunks) {
            chunk.offset = offset;
            offset += chunk.end - chunk.start;
        }
        this.len = offset;
    }
    getChunkIndex(pos) {
        let max = this.chunks.length;
        let min = 0;
        while (true) {
            const i = min + Math.floor((max - min) / 2);
            if (i < 0 || this.chunks.length <= i) {
                return -1;
            }
            const { offset, start, end } = this.chunks[i];
            const len = end - start;
            if (offset <= pos && pos < offset + len) {
                return i;
            }
            else if (offset + len <= pos) {
                min = i + 1;
            }
            else {
                max = i - 1;
            }
        }
    }
    get(i) {
        if (i < 0 || this.len <= i) {
            throw new Error("out of range");
        }
        const idx = this.getChunkIndex(i);
        const { value, offset, start } = this.chunks[idx];
        return value[start + i - offset];
    }
    *iterator(start = 0) {
        const startIdx = this.getChunkIndex(start);
        if (startIdx < 0)
            return;
        const first = this.chunks[startIdx];
        let firstOffset = start - first.offset;
        for (let i = startIdx; i < this.chunks.length; i++) {
            const chunk = this.chunks[i];
            for (let j = chunk.start + firstOffset; j < chunk.end; j++) {
                yield chunk.value[j];
            }
            firstOffset = 0;
        }
    }
    slice(start, end = this.len) {
        if (end === start) {
            return new Uint8Array();
        }
        checkRange(start, end, this.len);
        const result = new Uint8Array(end - start);
        const startIdx = this.getChunkIndex(start);
        const endIdx = this.getChunkIndex(end - 1);
        let written = 0;
        for (let i = startIdx; i < endIdx; i++) {
            const chunk = this.chunks[i];
            const len = chunk.end - chunk.start;
            result.set(chunk.value.subarray(chunk.start, chunk.end), written);
            written += len;
        }
        const last = this.chunks[endIdx];
        const rest = end - start - written;
        result.set(last.value.subarray(last.start, last.start + rest), written);
        return result;
    }
    concat() {
        const result = new Uint8Array(this.len);
        let sum = 0;
        for (const { value, start, end } of this.chunks) {
            result.set(value.subarray(start, end), sum);
            sum += end - start;
        }
        return result;
    }
}
function checkRange(start, end, len) {
    if (start < 0 || len < start || end < 0 || len < end || end < start) {
        throw new Error("invalid range");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnl0ZXNfbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ5dGVzX2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsTUFBTSxPQUFPLFNBQVM7SUFDWixHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ1IsTUFBTSxHQUtSLEVBQUUsQ0FBQztJQUNULGdCQUFlLENBQUM7SUFLaEIsSUFBSTtRQUNGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsQixDQUFDO0lBSUQsR0FBRyxDQUFDLEtBQWlCLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVU7UUFDdEQsSUFBSSxLQUFLLENBQUMsVUFBVSxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUMvQyxPQUFPO1NBQ1I7UUFDRCxVQUFVLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixLQUFLO1lBQ0wsR0FBRztZQUNILEtBQUs7WUFDTCxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUc7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFLRCxLQUFLLENBQUMsQ0FBUztRQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNYLE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDYixPQUFPO1NBQ1I7UUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMs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YXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG4vLyBUaGlzIG1vZHVsZSBpcyBicm93c2VyIGNvbXBhdGlibGUuXG5cbi8qKlxuICogQW4gYWJzdHJhY3Rpb24gb2YgbXVsdGlwbGUgVWludDhBcnJheXNcbiAqL1xuZXhwb3J0IGNsYXNzIEJ5dGVzTGlzdCB7XG4gIHByaXZhdGUgbGVuID0gMDtcbiAgcHJpdmF0ZSBjaHVua3M6IHtcbiAgICB2YWx1ZTogVWludDhBcnJheTtcbiAgICBzdGFydDogbnVtYmVyOyAvLyBzdGFydCBvZmZzZXQgZnJvbSBoZWFkIG9mIGNodW5rXG4gICAgZW5kOiBudW1iZXI7IC8vIGVuZCBvZmZzZXQgZnJvbSBoZWFkIG9mIGNodW5rXG4gICAgb2Zmc2V0OiBudW1iZXI7IC8vIG9mZnNldCBvZiBoZWFkIGluIGFsbCBieXRlc1xuICB9W10gPSBbXTtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIC8qKlxuICAgKiBUb3RhbCBzaXplIG9mIGJ5dGVzXG4gICAqL1xuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLmxlbjtcbiAgfVxuICAvKipcbiAgICogUHVzaCBieXRlcyB3aXRoIGdpdmVuIG9mZnNldCBpbmZvc1xuICAgKi9cbiAgYWRkKHZhbHVlOiBVaW50OEFycmF5LCBzdGFydCA9IDAsIGVuZCA9IHZhbHVlLmJ5dGVMZW5ndGgpIHtcbiAgICBpZiAodmFsdWUuYnl0ZUxlbmd0aCA9PT0gMCB8fCBlbmQgLSBzdGFydCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGVja1JhbmdlKHN0YXJ0LCBlbmQsIHZhbHVlLmJ5dGVMZW5ndGgpO1xuICAgIHRoaXMuY2h1bmtzLnB1c2goe1xuICAgICAgdmFsdWUsXG4gICAgICBlbmQsXG4gICAgICBzdGFydCxcbiAgICAgIG9mZnNldDogdGhpcy5sZW4sXG4gICAgfSk7XG4gICAgdGhpcy5sZW4gKz0gZW5kIC0gc3RhcnQ7XG4gIH1cblxuICAvKipcbiAgICogRHJvcCBoZWFkIGBuYCBieXRlcy5cbiAgICovXG4gIHNoaWZ0KG46IG51bWJlcikge1xuICAgIGlmIChuID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmxlbiA8PSBuKSB7XG4gICAgICB0aGlzLmNodW5rcyA9IFtdO1xuICAgICAgdGhpcy5sZW4gPSAwO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpZHggPSB0aGlzLmdldENodW5rSW5kZXgobik7XG4gICAgdGhpcy5jaHVua3Muc3BsaWNlKDAsIGlkeCk7XG4gICAgY29uc3QgW2NodW5rXSA9IHRoaXMuY2h1bmtzO1xuICAgIGlmIChjaHVuaykge1xuICAgICAgY29uc3QgZGlmZiA9IG4gLSBjaHVuay5vZmZzZXQ7XG4gICAgICBjaHVuay5zdGFydCArPSBkaWZmO1xuICAgIH1cbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBmb3IgKGNvbnN0IGNodW5rIG9mIHRoaXMuY2h1bmtzKSB7XG4gICAgICBjaHVuay5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICBvZmZzZXQgKz0gY2h1bmsuZW5kIC0gY2h1bmsuc3RhcnQ7XG4gICAgfVxuICAgIHRoaXMubGVuID0gb2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgY2h1bmsgaW5kZXggaW4gd2hpY2ggYHBvc2AgbG9jYXRlcyBieSBiaW5hcnktc2VhcmNoXG4gICAqIHJldHVybnMgLTEgaWYgb3V0IG9mIHJhbmdlXG4gICAqL1xuICBnZXRDaHVua0luZGV4KHBvczogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBsZXQgbWF4ID0gdGhpcy5jaHVua3MubGVuZ3RoO1xuICAgIGxldCBtaW4gPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBpID0gbWluICsgTWF0aC5mbG9vcigobWF4IC0gbWluKSAvIDIpO1xuICAgICAgaWYgKGkgPCAwIHx8IHRoaXMuY2h1bmtzLmxlbmd0aCA8PSBpKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgb2Zmc2V0LCBzdGFydCwgZW5kIH0gPSB0aGlzLmNodW5rc1tpXTtcbiAgICAgIGNvbnN0IGxlbiA9IGVuZCAtIHN0YXJ0O1xuICAgICAgaWYgKG9mZnNldCA8PSBwb3MgJiYgcG9zIDwgb2Zmc2V0ICsgbGVuKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfSBlbHNlIGlmIChvZmZzZXQgKyBsZW4gPD0gcG9zKSB7XG4gICAgICAgIG1pbiA9IGkgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWF4ID0gaSAtIDE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBpbmRleGVkIGJ5dGUgZnJvbSBjaHVua3NcbiAgICovXG4gIGdldChpOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmIChpIDwgMCB8fCB0aGlzLmxlbiA8PSBpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvdXQgb2YgcmFuZ2VcIik7XG4gICAgfVxuICAgIGNvbnN0IGlkeCA9IHRoaXMuZ2V0Q2h1bmtJbmRleChpKTtcbiAgICBjb25zdCB7IHZhbHVlLCBvZmZzZXQsIHN0YXJ0IH0gPSB0aGlzLmNodW5rc1tpZHhdO1xuICAgIHJldHVybiB2YWx1ZVtzdGFydCArIGkgLSBvZmZzZXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdG9yIG9mIGJ5dGVzIGZyb20gZ2l2ZW4gcG9zaXRpb25cbiAgICovXG4gICppdGVyYXRvcihzdGFydCA9IDApOiBJdGVyYWJsZUl0ZXJhdG9yPG51bWJlcj4ge1xuICAgIGNvbnN0IHN0YXJ0SWR4ID0gdGhpcy5nZXRDaHVua0luZGV4KHN0YXJ0KTtcbiAgICBpZiAoc3RhcnRJZHggPCAwKSByZXR1cm47XG4gICAgY29uc3QgZmlyc3QgPSB0aGlzLmNodW5rc1tzdGFydElkeF07XG4gICAgbGV0IGZpcnN0T2Zmc2V0ID0gc3RhcnQgLSBmaXJzdC5vZmZzZXQ7XG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SWR4OyBpIDwgdGhpcy5jaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNodW5rID0gdGhpcy5jaHVua3NbaV07XG4gICAgICBmb3IgKGxldCBqID0gY2h1bmsuc3RhcnQgKyBmaXJzdE9mZnNldDsgaiA8IGNodW5rLmVuZDsgaisrKSB7XG4gICAgICAgIHlpZWxkIGNodW5rLnZhbHVlW2pdO1xuICAgICAgfVxuICAgICAgZmlyc3RPZmZzZXQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHN1YnNldCBvZiBieXRlcyBjb3BpZWRcbiAgICovXG4gIHNsaWNlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyID0gdGhpcy5sZW4pOiBVaW50OEFycmF5IHtcbiAgICBpZiAoZW5kID09PSBzdGFydCkge1xuICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgfVxuICAgIGNoZWNrUmFuZ2Uoc3RhcnQsIGVuZCwgdGhpcy5sZW4pO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KGVuZCAtIHN0YXJ0KTtcbiAgICBjb25zdCBzdGFydElkeCA9IHRoaXMuZ2V0Q2h1bmtJbmRleChzdGFydCk7XG4gICAgY29uc3QgZW5kSWR4ID0gdGhpcy5nZXRDaHVua0luZGV4KGVuZCAtIDEpO1xuICAgIGxldCB3cml0dGVuID0gMDtcbiAgICBmb3IgKGxldCBpID0gc3RhcnRJZHg7IGkgPCBlbmRJZHg7IGkrKykge1xuICAgICAgY29uc3QgY2h1bmsgPSB0aGlzLmNodW5rc1tpXTtcbiAgICAgIGNvbnN0IGxlbiA9IGNodW5rLmVuZCAtIGNodW5rLnN0YXJ0O1xuICAgICAgcmVzdWx0LnNldChjaHVuay52YWx1ZS5zdWJhcnJheShjaHVuay5zdGFydCwgY2h1bmsuZW5kKSwgd3JpdHRlbik7XG4gICAgICB3cml0dGVuICs9IGxlbjtcbiAgICB9XG4gICAgY29uc3QgbGFzdCA9IHRoaXMuY2h1bmtzW2VuZElkeF07XG4gICAgY29uc3QgcmVzdCA9IGVuZCAtIHN0YXJ0IC0gd3JpdHRlbjtcbiAgICByZXN1bHQuc2V0KGxhc3QudmFsdWUuc3ViYXJyYXkobGFzdC5zdGFydCwgbGFzdC5zdGFydCArIHJlc3QpLCB3cml0dGVuKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiBDb25jYXRlbmF0ZSBjaHVua3MgaW50byBzaW5nbGUgVWludDhBcnJheSBjb3BpZWQuXG4gICAqL1xuICBjb25jYXQoKTogVWludDhBcnJheSB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW4pO1xuICAgIGxldCBzdW0gPSAwO1xuICAgIGZvciAoY29uc3QgeyB2YWx1ZSwgc3RhcnQsIGVuZCB9IG9mIHRoaXMuY2h1bmtzKSB7XG4gICAgICByZXN1bHQuc2V0KHZhbHVlLnN1YmFycmF5KHN0YXJ0LCBlbmQpLCBzdW0pO1xuICAgICAgc3VtICs9IGVuZCAtIHN0YXJ0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrUmFuZ2Uoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGxlbjogbnVtYmVyKSB7XG4gIGlmIChzdGFydCA8IDAgfHwgbGVuIDwgc3RhcnQgfHwgZW5kIDwgMCB8fCBsZW4gPCBlbmQgfHwgZW5kIDwgc3RhcnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHJhbmdlXCIpO1xuICB9XG59XG4iXX0=