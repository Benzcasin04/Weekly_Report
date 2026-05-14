import { WeeklyReport } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFilename(ext: string) {
  const d = new Date().toISOString().split("T")[0];
  return `weekly-report-${d}.${ext}`;
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return `${mon.toLocaleDateString("en-PH", { month: "long", day: "numeric" })} – ${sun.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}`;
}

// ─── EXCEL EXPORT ────────────────────────────────────────────────────────────
export async function exportToExcel(rows: WeeklyReport[]) {
  const XLSX = await import("xlsx");
  const data = rows.map((r, i) => ({
    "#": i + 1,
    Name: r.name,
    Note: r.note,
    "Created At": formatDate(r.created_at),
    "Updated At": formatDate(r.updated_at),
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [{ wch: 4 }, { wch: 22 }, { wch: 60 }, { wch: 22 }, { wch: 22 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Weekly Report");
  XLSX.writeFile(wb, getFilename("xlsx"));
}

// ─── PDF EXPORT ──────────────────────────────────────────────────────────────
export async function exportToPDF(rows: WeeklyReport[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const weekRange = getWeekRange();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("B1G WEEKLY REPORT", 14, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Week of ${weekRange}`, 14, 19);
  doc.text(`Generated: ${new Date().toLocaleString("en-PH")}`, 14, 25);
  doc.text(`Total Entries: ${rows.length}`, pageWidth - 14, 25, { align: "right" });

  autoTable(doc, {
    startY: 34,
    head: [["#", "Name", "Note", "Created At", "Updated At"]],
    body: rows.map((r, i) => [
      i + 1,
      r.name,
      r.note,
      formatDate(r.created_at),
      formatDate(r.updated_at),
    ]),
    styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 35 },
      2: { cellWidth: 110 },
      3: { cellWidth: 38 },
      4: { cellWidth: 38 },
    },
    didDrawPage: (data: { pageNumber: number }) => {
      const pg = doc.internal.pages.length - 1;
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(`Page ${data.pageNumber}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" });
    },
  });

  doc.save(getFilename("pdf"));
}

// ─── WORD EXPORT ─────────────────────────────────────────────────────────────
export async function exportToWord(rows: WeeklyReport[]) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    AlignmentType,
    BorderStyle,
    WidthType,
    ShadingType,
    HeadingLevel,
    PageOrientation,
  } = await import("docx");

  const weekRange = getWeekRange();
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cellPad = { top: 80, bottom: 80, left: 120, right: 120 };

  const headerCell = (text: string, width: number) =>
    new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      shading: { fill: "1E2937", type: ShadingType.CLEAR },
      margins: cellPad,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text, bold: true, color: "FFFFFF", size: 18, font: "Arial" }),
          ],
        }),
      ],
    });

  const dataCell = (text: string, width: number, center = false) =>
    new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      margins: cellPad,
      children: [
        new Paragraph({
          alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
          children: [new TextRun({ text, size: 16, font: "Arial" })],
        }),
      ],
    });

  // Column widths (landscape A4 content width ~13800 DXA)
  const cols = [600, 2400, 6200, 2300, 2300];
  const tableWidth = cols.reduce((a, b) => a + b, 0);

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell("#", cols[0]),
      headerCell("Name", cols[1]),
      headerCell("Note", cols[2]),
      headerCell("Created At", cols[3]),
      headerCell("Updated At", cols[4]),
    ],
  });

  const dataRows = rows.map(
    (r, i) =>
      new TableRow({
        children: [
          dataCell(String(i + 1), cols[0], true),
          dataCell(r.name, cols[1]),
          dataCell(r.note, cols[2]),
          dataCell(formatDate(r.created_at), cols[3], true),
          dataCell(formatDate(r.updated_at), cols[4], true),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE },
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "B1G WEEKLY REPORT",
                bold: true,
                font: "Arial",
                size: 36,
                color: "111827",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Week of ${weekRange}`, size: 20, font: "Arial", color: "6B7280" }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated: ${new Date().toLocaleString("en-PH")}   |   Total Entries: ${rows.length}`,
                size: 18,
                font: "Arial",
                color: "9CA3AF",
              }),
            ],
            spacing: { after: 300 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "E5E7EB" } },
          }),
          new Table({
            width: { size: tableWidth, type: WidthType.DXA },
            columnWidths: cols,
            rows: [headerRow, ...dataRows],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `\nWeeklog — B1G Weekly Report System`,
                size: 16,
                font: "Arial",
                color: "D1D5DB",
                italics: true,
              }),
            ],
            spacing: { before: 300 },
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  const a = document.createElement("a");
  a.href = url;
  a.download = getFilename("docx");
  a.click();
  URL.revokeObjectURL(url);
}
