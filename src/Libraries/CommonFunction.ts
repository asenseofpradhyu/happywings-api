export function generateDigits() :number {
    let minm = 10000;
    let maxm = 99999;
    return Math.floor(Math
    .random() * (maxm - minm + 1)) + minm;
}