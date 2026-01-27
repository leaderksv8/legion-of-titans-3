import fs from "node:fs";
import path from "node:path";

const src = path.join(process.cwd(), "public", ".htaccess");
const out = path.join(process.cwd(), "dist", ".htaccess");

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.copyFileSync(src, out);
console.log("[copy-htaccess] copied", src, "->", out);

