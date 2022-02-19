function charToInt(c: string) {
  // requires c to be in a-z or æøå
  if (RegExp(/^[a-z]+$/).test(c)) {
    return c.charCodeAt(0) - 97;
  } else if (c == "æ") {
    return 26;
  } else if (c == "ø") {
    return 28;
  } else if (c == "å") {
    return 29;
  }
}

export function generateUniqueIdFromString(name: string): number {
  if (name.length == 1) {
    return charToInt(name);
  }

  const number = name.split("").reduce((prev, cur, idx) => {
    let prevnum = parseInt(prev);
    if (idx === 1) {
      prevnum = charToInt(prev);
    }
    return "" + (prevnum + charToInt(cur) * 30 ** idx);
  });
  return parseInt(number);
}

export function removeSpecialChars(navn: string): string {
  return navn
    .split("")
    .filter((c) => RegExp(/^[a-zA-ZæøåÆØÅ]+$/).test(c))
    .join("");
}
