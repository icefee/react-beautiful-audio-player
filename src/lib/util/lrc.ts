function toPrecision(n: number) {
    return Math.round((n * 100)) / 100;
}

function parseDuration(time: string) {
    const timeStamp = time.match(/^\d{1,2}:\d{1,2}/)!
    const [m, s] = timeStamp[0].split(':')
    const millsMatch = time.match(/\.\d*/)!
    const mills = parseFloat(millsMatch[0])
    return toPrecision(parseInt(m) * 60 + parseInt(s) + (Number.isNaN(mills) ? 0 : mills))
}

export function parseLrc(lrc: string) {
    return lrc.split(/\n/).filter(
        s => s.trim().length > 0
    ).map(
        line => {
            const timeMatch = line.match(/\d{1,2}:\d{1,2}\.\d*/)!
            const textMatch = line.match(/(?<=]).+(?=($|\r))/)
            return {
                time: parseDuration(timeMatch[0]),
                text: textMatch ? textMatch[0] : ''
            }
        }
    )
}