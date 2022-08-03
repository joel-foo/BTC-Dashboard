export const convertNum = (num: string) => {
  const arr = parseFloat(num).toPrecision(3).split('e+')
  return `${arr[0]}x10<sup>${arr[1]}</sup>`
}
