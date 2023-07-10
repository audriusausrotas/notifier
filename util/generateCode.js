const SYMBOLS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "M",
  "N",
  "P",
  "R",
  "S",
  "T",
  "U",
  "V",
  "Z",
  "X",
  "W",
];

export default function generateCode() {
  let code = [];
  for (let i = 0; i < 4; i++) {
    const index = Math.round(Math.random() * 31);
    code.push(SYMBOLS[index]);
  }
  return code;
}
