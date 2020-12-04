export default function(number: number, precision: number) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
}