import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const DIST = path.join(process.cwd(), "dist");
const ROUTES = ["/", "/thanks"];

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".ico": "image/x-icon",
      ".txt": "text/plain; charset=utf-8",
      ".map": "application/json; charset=utf-8",
    }[ext] || "application/octet-stream"
  );
}

function safeJoin(root, urlPath) {
  const clean = urlPath.split("?")[0].split("#")[0];
  const p = path.normalize(decodeURIComponent(clean)).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(root, p);
}

function readFileIfExists(p) {
  try {
    return fs.readFileSync(p);
  } catch {
    return null;
  }
}

function createServer() {
  return http.createServer((req, res) => {
    const url = req.url || "/";
    const filePath = safeJoin(DIST, url === "/" ? "/index.html" : url);
    const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;

    // Serve exact files
    if (stat && stat.isFile()) {
      res.writeHead(200, { "content-type": contentType(filePath) });
      res.end(fs.readFileSync(filePath));
      return;
    }

    // Serve directory index.html
    if (stat && stat.isDirectory()) {
      const idx = path.join(filePath, "index.html");
      const buf = readFileIfExists(idx);
      if (buf) {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(buf);
        return;
      }
    }

    // SPA fallback for non-asset routes
    if (!path.extname(url)) {
      const buf = readFileIfExists(path.join(DIST, "index.html"));
      if (buf) {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(buf);
        return;
      }
    }

    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeRouteHtml(route, html) {
  const outPath =
    route === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, route.replace(/^\//, ""), "index.html");
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, html, "utf-8");
  console.log("[prerender] wrote", outPath);
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error("[prerender] dist/ not found. Run build first.");
    process.exit(1);
  }

  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(base + route, { waitUntil: "networkidle0", timeout: 60_000 });

      // Ensure our app mounted
      await page.waitForSelector("#root", { timeout: 15_000 });

      // Give animations a tiny moment (still deterministic)
      await new Promise((r) => setTimeout(r, 150));

      const html = await page.content();
      writeRouteHtml(route, html);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error("[prerender] failed", e);
  process.exit(1);
});

