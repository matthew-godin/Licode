import { MYSQL_TYPE_DATE, MYSQL_TYPE_DATETIME, MYSQL_TYPE_DATETIME2, MYSQL_TYPE_DECIMAL, MYSQL_TYPE_DOUBLE, MYSQL_TYPE_FLOAT, MYSQL_TYPE_INT24, MYSQL_TYPE_LONG, MYSQL_TYPE_LONGLONG, MYSQL_TYPE_NEWDATE, MYSQL_TYPE_NEWDECIMAL, MYSQL_TYPE_SHORT, MYSQL_TYPE_STRING, MYSQL_TYPE_TIME, MYSQL_TYPE_TIME2, MYSQL_TYPE_TIMESTAMP, MYSQL_TYPE_TIMESTAMP2, MYSQL_TYPE_TINY, MYSQL_TYPE_VAR_STRING, MYSQL_TYPE_VARCHAR, } from "../../constant/mysql_types.ts";
export function parseField(reader) {
    const catalog = reader.readLenCodeString();
    const schema = reader.readLenCodeString();
    const table = reader.readLenCodeString();
    const originTable = reader.readLenCodeString();
    const name = reader.readLenCodeString();
    const originName = reader.readLenCodeString();
    reader.skip(1);
    const encoding = reader.readUint16();
    const fieldLen = reader.readUint32();
    const fieldType = reader.readUint8();
    const fieldFlag = reader.readUint16();
    const decimals = reader.readUint8();
    reader.skip(1);
    const defaultVal = reader.readLenCodeString();
    return {
        catalog,
        schema,
        table,
        originName,
        fieldFlag,
        originTable,
        fieldLen,
        name,
        fieldType,
        encoding,
        decimals,
        defaultVal,
    };
}
export function parseRow(reader, fields) {
    const row = {};
    for (const field of fields) {
        const name = field.name;
        const val = reader.readLenCodeString();
        row[name] = val === null ? null : convertType(field, val);
    }
    return row;
}
function convertType(field, val) {
    const { fieldType, fieldLen } = field;
    switch (fieldType) {
        case MYSQL_TYPE_DECIMAL:
        case MYSQL_TYPE_DOUBLE:
        case MYSQL_TYPE_FLOAT:
        case MYSQL_TYPE_DATETIME2:
            return parseFloat(val);
        case MYSQL_TYPE_NEWDECIMAL:
            return val;
        case MYSQL_TYPE_TINY:
        case MYSQL_TYPE_SHORT:
        case MYSQL_TYPE_LONG:
        case MYSQL_TYPE_INT24:
            return parseInt(val);
        case MYSQL_TYPE_LONGLONG:
            if (Number(val) < Number.MIN_SAFE_INTEGER ||
                Number(val) > Number.MAX_SAFE_INTEGER) {
                return BigInt(val);
            }
            else {
                return parseInt(val);
            }
        case MYSQL_TYPE_VARCHAR:
        case MYSQL_TYPE_VAR_STRING:
        case MYSQL_TYPE_STRING:
        case MYSQL_TYPE_TIME:
        case MYSQL_TYPE_TIME2:
            return val;
        case MYSQL_TYPE_DATE:
        case MYSQL_TYPE_TIMESTAMP:
        case MYSQL_TYPE_DATETIME:
        case MYSQL_TYPE_NEWDATE:
        case MYSQL_TYPE_TIMESTAMP2:
        case MYSQL_TYPE_DATETIME2:
            return new Date(val);
        default:
            return val;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdWx0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cHM6Ly9kZW5vLmxhbmQveC9teXNxbEB2Mi45LjAvc3JjL3BhY2tldHMvcGFyc2Vycy9yZXN1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUNMLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3BCLGtCQUFrQixFQUNsQixpQkFBaUIsRUFDakIsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLGtCQUFrQixFQUNsQixxQkFBcUIsRUFDckIsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLG9CQUFvQixFQUNwQixxQkFBcUIsRUFDckIsZUFBZSxFQUNmLHFCQUFxQixFQUNyQixrQkFBa0IsR0FDbkIsTUFBTSwrQkFBK0IsQ0FBQztBQW1CdkMsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFvQjtJQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztJQUM1QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztJQUMzQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztJQUMxQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztJQUNoRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztJQUN6QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztJQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRyxDQUFDO0lBQ3RDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUcsQ0FBQztJQUN0QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFHLENBQUM7SUFDdEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRyxDQUFDO0lBQ3ZDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUcsQ0FBQztJQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixFQUFHLENBQUM7SUFDL0MsT0FBTztRQUNMLE9BQU87UUFDUCxNQUFNO1FBQ04sS0FBSztRQUNMLFVBQVU7UUFDVixTQUFTO1FBQ1QsV0FBVztRQUNYLFFBQVE7UUFDUixJQUFJO1FBQ0osU0FBUztRQUNULFFBQVE7UUFDUixRQUFRO1FBQ1IsVUFBVTtLQUNYLENBQUM7QUFDSixDQUFDO0FBR0QsTUFBTSxVQUFVLFFBQVEsQ0FBQyxNQUFvQixFQUFFLE1BQW1CO0lBQ2hFLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztJQUNwQixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtRQUMxQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDM0Q7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFHRCxTQUFTLFdBQVcsQ0FBQyxLQUFnQixFQUFFLEdBQVc7SUFDaEQsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDdEMsUUFBUSxTQUFTLEVBQUU7UUFDakIsS0FBSyxrQkFBa0IsQ0FBQztRQUN4QixLQUFLLGlCQUFpQixDQUFDO1FBQ3ZCLEtBQUssZ0JBQWdCLENBQUM7UUFDdEIsS0FBSyxvQkFBb0I7WUFDdkIsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsS0FBSyxxQkFBcUI7WUFDeEIsT0FBTyxHQUFHLENBQUM7UUFDYixLQUFLLGVBQWUsQ0FBQztRQUNyQixLQUFLLGdCQUFnQixDQUFDO1FBQ3RCLEtBQUssZUFBZSxDQUFDO1FBQ3JCLEtBQUssZ0JBQWdCO1lBQ25CLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLEtBQUssbUJBQW1CO1lBQ3RCLElBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0I7Z0JBQ3JDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLEVBQ3JDO2dCQUNBLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RCO1FBQ0gsS0FBSyxrQkFBa0IsQ0FBQztRQUN4QixLQUFLLHFCQUFxQixDQUFDO1FBQzNCLEtBQUssaUJBQWlCLENBQUM7UUFDdkIsS0FBSyxlQUFlLENBQUM7UUFDckIsS0FBSyxnQkFBZ0I7WUFDbkIsT0FBTyxHQUFHLENBQUM7UUFDYixLQUFLLGVBQWUsQ0FBQztRQUNyQixLQUFLLG9CQUFvQixDQUFDO1FBQzFCLEtBQUssbUJBQW1CLENBQUM7UUFDekIsS0FBSyxrQkFBa0IsQ0FBQztRQUN4QixLQUFLLHFCQUFxQixDQUFDO1FBQzNCLEtBQUssb0JBQW9CO1lBQ3ZCLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkI7WUFDRSxPQUFPLEdBQUcsQ0FBQztLQUNkO0FBQ0gsQ0FBQyJ9