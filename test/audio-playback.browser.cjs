const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

function tone() {
  const samples = 16000;
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write("RIFF");
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24);
  wav.writeUInt32LE(16000, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++)
    wav.writeInt16LE(
      Math.round(Math.sin((i * 2 * Math.PI * 440) / 8000) * 100),
      44 + i * 2,
    );
  return wav;
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_BINARY
      ? { executablePath: process.env.CHROME_BINARY }
      : {}),
  });
  const output = process.env.QA_OUTPUT || "/tmp/orzu-audio-qa";
  fs.mkdirSync(output, { recursive: true, mode: 0o700 });
  try {
    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 360, height: 780 },
    ]) {
      let used = false;
      let plays = 0;
      let statuses = 0;
      const context = await browser.newContext({ viewport });
      await context.route("**/audio-guest/*", async (route) => {
        const headers = {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
        };
        if (route.request().method() === "OPTIONS")
          return route.fulfill({ status: 204, headers });
        const body = route.request().postDataJSON();
        assert.equal(body.token, "a".repeat(43));
        if (route.request().url().endsWith("/status")) {
          statuses++;
          return route.fulfill({
            json: {
              available: !used,
              path: "/archive/v2/feedbacks/22222222-2222-4222-8222-222222222222/evidence/33333333-3333-4333-8333-333333333333",
            },
            headers,
          });
        }
        plays++;
        if (used)
          return route.fulfill({
            status: 403,
            json: { message: "Consumed" },
            headers,
          });
        used = true;
        return route.fulfill({
          status: 201,
          body: tone(),
          contentType: "audio/wav",
          headers,
        });
      });
      const page = await context.newPage();
      const failures = [];
      page.on("pageerror", (error) => failures.push(error.message));
      const url = `${process.env.QA_BASE_URL || "http://127.0.0.1:5188"}/listen#t=${"a".repeat(43)}`;
      await page.goto(url);
      const play = page.getByRole("button", { name: /^(Слушать|Tinglash)$/ });
      await play.waitFor();
      assert.equal(plays, 0, "Preview must not consume guest access");
      assert.ok(statuses > 0);
      assert.equal(new URL(page.url()).hash, "");
      assert.equal(await page.locator("audio, a[download]").count(), 0);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      );
      await page.screenshot({
        path: `${output}/guest-${viewport.width}.png`,
        fullPage: true,
      });
      await play.click();
      await page.getByRole("button", { name: /^(Пауза|Pauza)$/ }).waitFor();
      await page
        .getByRole("link", { name: /Войти в аккаунт|Hisobga kirish/ })
        .waitFor({ timeout: 10000 });
      assert.equal(plays, 1);
      await page.screenshot({
        path: `${output}/consumed-${viewport.width}.png`,
        fullPage: true,
      });
      await page.goto(url);
      await page
        .getByRole("link", { name: /Войти в аккаунт|Hisobga kirish/ })
        .waitFor();
      assert.equal(
        await page
          .getByRole("button", { name: /^(Слушать|Tinglash)$/ })
          .count(),
        0,
      );
      assert.equal(plays, 1, "Reload must not issue another playback");
      assert.deepEqual(failures, []);
      await context.close();
      console.log(
        JSON.stringify({
          viewport,
          previewDidNotConsume: true,
          onePlay: true,
          reloadRequiresLogin: true,
          noDownloadControls: true,
        }),
      );
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
