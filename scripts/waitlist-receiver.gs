// Waitlist receiver: paste into the Google Sheet's Extensions → Apps Script,
// then Deploy → New deployment → Web app (Execute as: Me, Who has access:
// Anyone). Put the /exec URL in launch.forms.interest in src/lib/site.ts.
//
// Each sign-up from the launching-soon page becomes one row on the first tab:
// Signed up (ET) | Email | I'm a… | Repeat sign-up | Page | Referrer

const ROLES = { interested: "Shopper", traveler: "Traveler", seller: "Seller" };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    // Honeypot field: hidden from people, so anything in it is a bot. Pretend it worked.
    if (data.website) return reply({ ok: true });

    const email = String(data.email || "").trim().toLowerCase().slice(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ ok: false, error: "invalid email" });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const last = sheet.getLastRow();
    const repeat =
      last > 1 &&
      sheet
        .getRange(2, 2, last - 1, 1)
        .getValues()
        .some((row) => String(row[0]).toLowerCase() === email);

    sheet.appendRow([
      Utilities.formatDate(new Date(), "America/New_York", "yyyy-MM-dd HH:mm"),
      safe(email),
      ROLES[data.role] || "Shopper",
      repeat ? "yes" : "",
      safe(String(data.page || "").slice(0, 200)),
      safe(String(data.referrer || "").slice(0, 300)),
    ]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the /exec URL in a browser shows this, which confirms the deploy is live.
function doGet() {
  return reply({ ok: true, service: "waitlist receiver" });
}

// Stops visitor-typed text from being run as a spreadsheet formula.
function safe(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
