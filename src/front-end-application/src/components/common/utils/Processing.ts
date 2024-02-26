export const processOpponentField = (field: string): string => {
    var r = 0
    var randomChars : string = "#!$*?~"
    var ret = field.replace(/[^\s]/g, (substr: string, ..._args: any[]) : string => {
        const oldR = r
        r = (r + 1) % randomChars.length
        return randomChars[oldR]
    })  

    return ret
}
