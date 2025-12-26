import React from "react";
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Footer,
  ShadingType,
  Header
} from "docx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";


const RED = "CC0000";
const GRAY_BORDER = "A0A0A0";
const LIGHT_GRAY_HEADER = "E6E6E6";
const MODULE_GRAY = "F0F0F0";
const DARK_HEADER = "282828";
const FOOTER_BLUE = "0000B4";

export default function DocxRender({ courseData }) {
  // Normalize weird math alphabets
  function normalizeMathText(str) {
    if (!str) return "";
    try {
      return String(str)
        .normalize("NFKD")
        .replace(/[\u{1D400}-\u{1D7FF}]/gu, (ch) =>
          ch.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
        )
        .replace(/\u00B2/g, "^2")
        .replace(/\u00B3/g, "^3");
    } catch {
      return String(str);
    }
  }

  // Add spacing around math symbols
  function sanitizeModuleText(text) {
    if (!text) return "";
    return String(text)
      .replace(/([=+\-*/^])/g, " $1 ")
      .replace(/([()])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function shouldRenderModule(mod) {
    if (!mod) return false;
    return (
      (mod.title && String(mod.title).trim()) ||
      (mod.content && String(mod.content).trim())
    );
  }

  function shouldRenderTextbooks(arr) {
    if (!Array.isArray(arr)) return false;
    return arr.some(
      (tb) =>
        tb.slNo?.trim() ||
        tb.author?.trim() ||
        tb.bookTitle?.trim() ||
        tb.publisher?.trim()
    );
  }

  // ✨ CREATE BORDERED BOX (Objectives, TLP, Outcomes)
  function createBorderedBox(title, content) {
    const normalized = sanitizeModuleText(normalizeMathText(content || ""));
    const lines = normalized
      .split(/\. |\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    return [
      new Paragraph({
        text: title,
        alignment: AlignmentType.CENTER,
        bold: true,
        spacing: { before: 200, after: 200 },
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          left: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          right: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
                  left: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
                  right: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
                },

                children: lines.map(
                  (line, idx) =>
                    new Paragraph({
                      text: `${idx + 1}. ${line}`,
                      spacing: { before: 100, after: 100 },
                    })
                ),
              }),
            ],
          }),
        ],
      }),

      new Paragraph({ text: "", spacing: { after: 300 } }),
    ];
  }

  // ✨ MODULE BOX (Border + Content + Horizontal Table)
  function createModuleBox(title, content, meta) {
    const normalized = sanitizeModuleText(normalizeMathText(content || ""));
    const lines = normalized
      .split(/\.(?:\s+|\n)|\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    return [
      // 🔵 Title
      new Paragraph({
        text: title,
        alignment: AlignmentType.CENTER,
        bold: true,
        spacing: { before: 200, after: 200 },
      }),

      // 🔳 CONTENT BOX
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          left: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          right: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: lines.map(
                  (line) =>
                    new Paragraph({
                      text: "• " + line,
                      spacing: { before: 100, after: 100 },
                    })
                ),
              }),
            ],
          }),
        ],
      }),

      new Paragraph({ text: "", spacing: { after: 200 } }),

      // 🔥 HORIZONTAL META TABLE (matches PDF)
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          left: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          right: { style: BorderStyle.SINGLE, size: 6, color: GRAY_BORDER },
          insideHorizontal: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: GRAY_BORDER,
          },
          insideVertical: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: GRAY_BORDER,
          },
        },

        rows: [
          // header
          new TableRow({
            children: ["Text Book", "Chapter", "RBT"].map(
              (label) =>
                new TableCell({
                  shading: { fill: MODULE_GRAY, type: ShadingType.CLEAR },
                  children: [
                    new Paragraph({
                      text: label,
                      alignment: AlignmentType.CENTER,
                      bold: true,
                    }),
                  ],
                })
            ),
          }),

          // values
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(meta.textbook || "")],
              }),
              new TableCell({
                children: [new Paragraph(meta.chapter || "")],
              }),
              new TableCell({
                children: [new Paragraph(meta.rbt || "")],
              }),
            ],
          }),
        ],
      }),

      new Paragraph({ text: "", spacing: { after: 300 } }),
    ];
  }

  function buildHeader() {
  return new Paragraph({
    children: [
      new TextRun({
        text: "BANGALORE INSTITUTE OF TECHNOLOGY",
        bold: true,
        size: 28,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
  });
}

function buildSubHeader() {
  return new Paragraph({
    text: "An Autonomous Institution Under VTU, Belagavi",
    italics: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 150 },
  });
}

function buildRedLine() {
  return new Paragraph({
    border: {
      bottom: {
        color: "CC0000",
        size: 40,
        style: BorderStyle.SINGLE,
      },
    },
    spacing: { after: 250 },
  });
}

  async function generateSyllabusDocx() {
    const data = courseData || {};
    const children = [];

    // 🔥 COURSE INFO TABLE (with light gray header)
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          insideHorizontal: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: "000000",
          },
          insideVertical: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: "000000",
          },
        },
        rows: [
          // HEADER (colored)
          new TableRow({
            children: [
              "Title",
              "Code",
              "Credits",
              "Hours of Pedagogy",
              "L-T-P-S",
              "Exam Hours",
              "CIE",
              "SEE",
              "Exam Type",
            ].map(
              (label) =>
                new TableCell({
                  shading: { fill: LIGHT_GRAY_HEADER, type: "clear" },
                  children: [
                    new Paragraph({
                      text: label,
                      bold: true,
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                })
            ),
          }),

          // ROW 2
          new TableRow({
            children: [
              data.course_title,
              data.course_code,
              data.credits,
              data.pedagogy_hours,
              data.ltps,
              data.exam_hours,
              data.cie,
              data.see,
              data.course_type,
            ].map(
              (val) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      text: String(val || "-"),
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                })
            ),
          }),
        ],
      })
    );

    children.push(new Paragraph({ text: "", spacing: { after: 300 } }));

    // 🔥 OBJECTIVES
    const objectivesArr = Array.isArray(data.course_objectives)
      ? data.course_objectives
      : [data.course_objectives];
    if (objectivesArr[0]) {
      children.push(
        ...createBorderedBox(
          "Course Objectives",
          objectivesArr.join(". ")
        )
      );
    }

    // 🔥 TLP
    const tlArr = Array.isArray(data.teaching_learning)
      ? data.teaching_learning
      : [data.teaching_learning];
    if (tlArr[0]) {
      children.push(
        ...createBorderedBox("Teaching-Learning Process", tlArr.join(". "))
      );
    }

    // 🔥 MODULES
    if (Array.isArray(data.modules)) {
      data.modules.forEach((mod, idx) => {
        if (shouldRenderModule(mod)) {
          children.push(
            ...createModuleBox(
              `Module ${idx + 1}: ${mod.title}`,
              mod.content,
              mod
            )
          );
        }
      });
    }

    // 🔥 TEXTBOOKS (dark PDF header)
    if (shouldRenderTextbooks(data.textbooks || [])) {
      children.push(
        new Paragraph({
          text: "Textbooks",
          alignment: AlignmentType.CENTER,
          bold: true,
          spacing: { before: 200, after: 150 },
        })
      );

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            insideHorizontal: {
              style: BorderStyle.SINGLE,
              size: 6,
              color: "000000",
            },
            insideVertical: {
              style: BorderStyle.SINGLE,
              size: 6,
              color: "000000",
            },
          },
          rows: [
            // Header dark
            new TableRow({
              children: ["Sl.No", "Author", "Book Title", "Publisher"].map(
                (h) =>
                  new TableCell({
                    shading: { fill: DARK_HEADER, type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        text: h,
                        bold: true,
                        alignment: AlignmentType.CENTER,
                        color: "FFFFFF",
                      }),
                    ],
                  })
              ),
            }),

            // Rows
            ...data.textbooks
              .filter(
                (tb) =>
                  tb.slNo ||
                  tb.author ||
                  tb.bookTitle ||
                  tb.publisher
              )
              .map(
                (tb) =>
                  new TableRow({
                    children: [
                      tb.slNo,
                      tb.author,
                      tb.bookTitle,
                      tb.publisher,
                    ].map(
                      (v) =>
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: String(v || ""),
                            }),
                          ],
                        })
                    ),
                  })
              ),
          ],
        })
      );

      children.push(new Paragraph({ text: "", spacing: { after: 350 } }));
    }

    // 🔵 Outcomes
    const outArr = Array.isArray(data.course_outcomes)
      ? data.course_outcomes
      : [data.course_outcomes];
    if (outArr[0]) {
      children.push(
        ...createBorderedBox(
          "Course Outcomes",
          "At the end of the course, the student will be able to:\n" +
            outArr.join(". ")
        )
      );
    }

    // 🔵 Web links
    const linksArr = Array.isArray(data.referral_links)
      ? data.referral_links
      : [data.referral_links];
    if (linksArr[0]) {
      children.push(
        ...createBorderedBox(
          "Web Links",
          linksArr.join("\n")
        )
      );
    }

    // ================= FOOTER (COLOR MATCHES PDF) =================
    const doc = new DocxDocument({
  sections: [
    {
      headers: {
        default: new Header({
          children: [
            buildHeader(),
            buildSubHeader(),
            buildRedLine(),
          ],
        }),
      },

      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: {
                top: { color: "CC0000", size: 20, style: BorderStyle.SINGLE },
              },
              spacing: { after: 150 },
            }),
            new Paragraph({
              text: "K.R. Road, V. V. Pura, Bengaluru – 560 004",
              alignment: AlignmentType.CENTER,
              bold: true,
            }),
            new Paragraph({
              text: "Phone: +91(080) 26613237, 26615865 | Website: www.bit-bangalore.edu.in",
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "E-mail : principalbit4@gmail.com, principal@bit-bangalore.edu.in",
                  color: "0000B4",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              text: "Accredited by NBA: 9 UG Programs, NAAC A+ and QS-I Gauge (Gold Rating)",
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },

      properties: {
        page: {
          margin: { top: 1800, right: 1440, bottom: 1800, left: 1440 },
        },
      },

      children,
    },
  ],
});


    // SAVE DOC
    const fileName = courseData.course_code || "syllabus";
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, fileName + ".docx");
    });
  }

  return (
    <button
      onClick={generateSyllabusDocx}
      className="flex gap-1 items-center px-4 py-1.5 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-800 transition font-medium shadow-sm text-xs md:text-[15px]"
    >
      <Download size={20} />
      {/* <p className="text-xs md:text-[15px] hidden md:block">Download DOCX</p> */}
      <p className="text-[15px]">Download DOCX</p>
    </button>
  );
}
