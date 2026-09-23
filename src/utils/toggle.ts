export function toggle(lista: string[], valore: string): string[] {
  return lista.includes(valore)
    ? lista.filter(v => v !== valore)
    : [...lista, valore];
}