export default function(number: number | string, precision: number = Number(process.env.PRECISION) || 2): number {
    if (typeof number === "string") {
        number = number.replace(/ /g, "").replace(/,/g, ".");
    }
    number = Number(number);
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
}
