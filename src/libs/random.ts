import round from "libs/round";

export default function(min: number, max: number, precision: number = Number(process.env.PRECISION) || 2): number {
    const rand = Math.random() * (max - min) + min;
    return round(rand, precision);
}
