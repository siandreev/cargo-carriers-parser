export default function(number: number | string, precision: number) {
    number = Number(number);
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
}