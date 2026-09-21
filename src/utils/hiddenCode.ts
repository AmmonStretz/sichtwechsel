export function generateCode(partyCode: number): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const rand2 = () => Math.floor(Math.random() * 90) + 10  // 10–99
  return `${rand2()}-${pad(partyCode)}-${rand2()}-${rand2()}`
}
