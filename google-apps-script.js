/**
 * TARA TECH — Google Apps Script (GET version)
 * Replace your existing Apps Script code with this, then redeploy.
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Commandes") || ss.getActiveSheet();

    // Add headers on first row if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = ["التاريخ", "الاسم", "الهاتف", "المدينة", "الكمية", "الثمن", "الحالة", "ملاحظة", "المصدر"];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setBackground("#1a1a1a").setFontColor("#ffffff").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const p = e.parameter;
    const now = new Date();
    const date = p.date || Utilities.formatDate(now, "Africa/Casablanca", "dd/MM/yyyy HH:mm");

    sheet.appendRow([
      date,
      p.full_name  || "",
      p.phone      || "",
      p.city       || "",
      p.quantity   || "1",
      p.price      || "699",
      p.status     || "جديد",
      p.note       || "",
      p.source     || "direct",
    ]);

    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function doPost(e) {
  return doGet(e);
}
