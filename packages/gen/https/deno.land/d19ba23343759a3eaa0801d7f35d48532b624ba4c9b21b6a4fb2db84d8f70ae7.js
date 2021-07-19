import { byteFormat } from "../../deps.ts";
import { BufferReader, BufferWriter } from "../buffer.ts";
import { WriteError } from "../constant/errors.ts";
import { debug, log } from "../logger.ts";
import { PacketType } from "../../src/constant/packet.ts";
export class SendPacket {
    body;
    header;
    constructor(body, no) {
        this.body = body;
        this.header = { size: body.length, no };
    }
    async send(conn) {
        const body = this.body;
        const data = new BufferWriter(new Uint8Array(4 + body.length));
        data.writeUints(3, this.header.size);
        data.write(this.header.no);
        data.writeBuffer(body);
        log.debug(`send: ${data.length}B \n${byteFormat(data.buffer)}\n`);
        try {
            let wrote = 0;
            do {
                wrote += await conn.write(data.buffer.subarray(wrote));
            } while (wrote < data.length);
        }
        catch (error) {
            throw new WriteError(error.message);
        }
    }
}
export class ReceivePacket {
    header;
    body;
    type;
    async parse(reader) {
        const header = new BufferReader(new Uint8Array(4));
        let readCount = 0;
        let nread = await this.read(reader, header.buffer);
        if (nread === null)
            return null;
        readCount = nread;
        const bodySize = header.readUints(3);
        this.header = {
            size: bodySize,
            no: header.readUint8(),
        };
        this.body = new BufferReader(new Uint8Array(bodySize));
        nread = await this.read(reader, this.body.buffer);
        if (nread === null)
            return null;
        readCount += nread;
        const { OK_Packet, ERR_Packet, EOF_Packet, Result } = PacketType;
        switch (this.body.buffer[0]) {
            case OK_Packet:
                this.type = OK_Packet;
                break;
            case 0xff:
                this.type = ERR_Packet;
                break;
            case 0xfe:
                this.type = EOF_Packet;
                break;
            default:
                this.type = Result;
                break;
        }
        debug(() => {
            const data = new Uint8Array(readCount);
            data.set(header.buffer);
            data.set(this.body.buffer, 4);
            log.debug(`receive: ${readCount}B, size = ${this.header.size}, no = ${this.header.no} \n${byteFormat(data)}\n`);
        });
        return this;
    }
    async read(reader, buffer) {
        const size = buffer.length;
        let haveRead = 0;
        while (haveRead < size) {
            const nread = await reader.read(buffer.subarray(haveRead));
            if (nread === null)
                return null;
            haveRead += nread;
        }
        return haveRead;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cHM6Ly9kZW5vLmxhbmQveC9teXNxbEB2Mi45LjAvc3JjL3BhY2tldHMvcGFja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQVMxRCxNQUFNLE9BQU8sVUFBVTtJQUdBO0lBRnJCLE1BQU0sQ0FBZTtJQUVyQixZQUFxQixJQUFnQixFQUFFLEVBQVU7UUFBNUIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBZTtRQUN4QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBa0IsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixHQUFHLENB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