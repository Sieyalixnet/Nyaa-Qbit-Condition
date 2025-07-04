export function clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export function round(num: number, digits: number) {
  return Math.round(num * 10 ** digits) / 10 ** digits;
}