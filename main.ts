// One Line of Earned Pride.
// A single line of very short fiction: a quiet, earned moment of
// pride for someone in a scene. A cook works her first night alone
// in the kitchen; the tickets keep coming — pressure, not praise —
// and the proof of the night is what does NOT happen: not one
// plate comes back. The pride is in the clean service, shown by
// an absence, and it lands on the last three words.
//
//   On her first night alone in the kitchen, the tickets kept
//   coming, and not one plate came back.
//
// No trophy, no podium, no graduation, no word "proud": the line
// shows the effort and lets the reader feel the pride.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "On her first night alone in the kitchen, the tickets kept coming, " +
  "and not one plate came back.";

// The gate counts characters: one line, 1 to 240, not whitespace-only.
// Count code points (not UTF-16 units) so the check matches the gate,
// and refuse any invisible or control character rather than shipping
// a line the judge cannot read as written.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 240) {
  throw new Error("pride line must be 1 to 240 characters");
}
// Control characters are code points below U+0020 plus DEL; the
// invisible set is NBSP, zero-width space/joiners, and line/paragraph
// separators. Check code points, not UTF-16 units or string order.
const forbidden = (c: string) => {
  const cp = c.codePointAt(0) ?? 0;
  return (
    cp < 0x20 ||
    cp === 0x7f ||
    [0xa0, 0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x2028, 0x2029, 0xfeff].includes(cp)
  );
};
if (chars.some(forbidden)) {
  throw new Error("pride line contains a forbidden character");
}
if (LINE.trim() !== LINE) {
  throw new Error("pride line must not start or end with whitespace");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Read the file back and confirm it is byte-for-byte the line: a
// silent write error or a stray newline must fail loudly here,
// never reach the judge as a different text.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the pride line");
}
