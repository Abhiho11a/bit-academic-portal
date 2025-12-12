import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import '../../assets/fonts/Lato-Bold-bold.js'; // The font import 
import '../../assets/fonts/Lato-Light-normal.js'; // The font import
import '../../assets/fonts/Tinos-Regular-normal.js'; // The font import
import '../../assets/fonts/PTSerif-Bold-bold.js'; // The font import
import headerFull from "../../assets/images/header_img.png";


export default function PdfRender({ courseData }) {
  // Helpers
  const safeList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

  // Convert unicode math alphabets to ASCII (robust approach)
  function normalizeMathText(str) {
    if (!str) return "";
    // Normalize and strip fancy math-letter codepoints
    try {
      // This reduces mathematical alphabets to base forms where possible
      return String(str)
        .normalize("NFKD")
        .replace(/[\u{1D400}-\u{1D7FF}]/gu, (ch) =>
          ch.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
        )
        .replace(/\u00B2/g, "^2") // superscript 2
        .replace(/\u00B3/g, "^3"); // superscript 3
    } catch (e) {
      return String(str);
    }
  }

  // Add spaces around math operators so splitTextToSize can wrap
  function sanitizeModuleText(text) {
    if (!text) return "";
    return String(text)
      .replace(/([=+\-*/^])/g, " $1 ")
      .replace(/([()])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Decide whether to render a module
  function shouldRenderModule(mod) {
    if (!mod) return false;
    const hasTitle = mod.title && String(mod.title).trim().length > 0;
    const hasContent = mod.content && String(mod.content).trim().length > 0;
    return hasTitle || hasContent;
  }

  // Decide whether to render textbook table
  function shouldRenderTextbooks(arr) {
    if (!Array.isArray(arr)) return false;
    return arr.some(
      (tb) =>
        (tb.slNo && String(tb.slNo).trim()) ||
        (tb.author && String(tb.author).trim()) ||
        (tb.bookTitle && String(tb.bookTitle).trim()) ||
        (tb.publisher && String(tb.publisher).trim())
    );
  }

  function getDeptName(dept){
    switch(dept){
      case "CSE":
        return "Computer Science And Engineering";
      case "ISE":
        return "Information Science And Engineering";
      case "EEE":
        return "Electrical and Electronics Engineering";
      case "ECE":
        return "Electronics and Communication Engineering";
      case "EIE":
        return "Electronics and Instrumentation Engineering";
      case "ETE":
        return "Electronics and Telecommunication Engineering";
      case "AIML":
        return "Artificial Intelligence and Machine Learning";
      case "CSE(IOT)":
        return "CSE (IOT & Cyber Security, Blockchain Technology)";
      case "RAI":
        return "Robotics & Artificial Intelligence";
      case "VLSI":
        return "Electronics Engineering (VLSI Design & Technology)";
      case "CIVIL":
        return "Civil Engineering";
      case "ME":
        return "Mechanical Engineering";
      default:
        return "Engineering"
    }
  }

  async function generateSyllabusPDF() {
    const data = courseData || {};
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // loadKannadaFont(doc)
    // Margins
    const M = { left: 55, right: 55, top: 38, bottom: 60 };
    let curY = M.top;

    const FONT = {
      regular: "Times-Roman",
      bold: "Times-Bold",
      italic: "Times-Italic",
    };

    const RED = [204, 0, 0];
    const BLUE = [0, 40, 180];
    const FOOTER_BLUE = [0, 0, 180];
    const GRAY_BORDER = [160, 160, 160];

    const centerX = () => pageWidth / 2;

    function addFooter(pageNum) {
  const footerTop = pageHeight - M.bottom + 2;
  const mid = centerX();

  // Red line
  doc.setDrawColor(...RED);
  doc.setLineWidth(1.6);
  doc.line(M.left - 4, footerTop - 6, pageWidth - M.right + 4, footerTop - 6);

  // LINE 1
  doc.setFont("Cambria", "bold");
  doc.setFontSize(10.2);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "K.R. Road, V. V. Pura, Bengaluru – 560 004",
    mid,
    footerTop + 10,
    { align: "center" }
  );

  // LINE 2
  doc.setFont("Cambria", "normal");
  doc.setFontSize(10);
  doc.text(
    "Phone: +91(080) 26613237, 26615865 | Website: www.bit-bangalore.edu.in",
    mid,
    footerTop + 24,
    { align: "center" }
  );

  // LINE 3 (email line in BLUE + bold)
  doc.setFont("Cambria", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 180);
  doc.text(
    "E-mail : principalbit4@gmail.com, principal@bit-bangalore.edu.in",
    mid,
    footerTop + 38,
    { align: "center" }
  );

  // LINE 4 (NBA line)
  doc.setFont("Cambria", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "Accredited by NBA: 9 UG Programs, NAAC A+ and QS-I Gauge (Gold Rating)",
    mid,
    footerTop + 52,
    { align: "center" }
  );

  //Generated Date
  doc.setFont("Cambria","normal");
  doc.setFontSize(10);
  const now = new Date();
  const formatted = now.toLocaleString("en-IN", {
   day: "2-digit",
   month: "short",
   year: "numeric",
   hour: "2-digit",
   minute: "2-digit"
});
  doc.text(String(` | Generated on:${formatted}`),pageWidth-M.right+10,pageHeight-48,{align:"right"});

  
  // Page number
  doc.setFont("Cambria", "normal");
  doc.setFontSize(10);
  doc.text(
    String(pageNum),
    pageWidth - M.right + 6,
    pageHeight - 10,
    { align: "right" }
  );
}

function addHeader() {
    curY = M.top;
    const pageWidth = doc.internal.pageSize.getWidth();

    // === HEADER IMAGE DETAILS ===
    const headerWidth = pageWidth - M.left - M.right;   // full width but respecting margins
    const headerHeight = (headerWidth * 120) / 1000;    // adjust this based on your image ratio

    const x = M.left;
    const y = M.top - 10;

    try {
      doc.addImage(headerFull, "PNG", x, y, headerWidth, headerHeight);
    }catch (e) {
      console.error("Header image error:", e);
    }

    curY = y + headerHeight + 5;

    //Header Font
    doc.setFont('PTSerif-Bold', 'bold'); 
    doc.setFontSize(8);
    doc.setTextColor(0, 102, 200);
    doc.text("An Autonomous Institution Under VTU, Belagum", centerX(), curY-9, { align: "center" });

    //Red Line under Header
    doc.setDrawColor(204, 0, 0);
    doc.setLineWidth(2.8);
    doc.line(M.left - 4, curY, pageWidth - M.right + 4, curY );

    // Reset Y and text color for body content
    // Reset text color
    doc.setTextColor(0, 0, 0);
  }
  
  
  
  // auto add header on new page
  doc.internal.events.subscribe("addPage", () => {
    addHeader();
    curY = M.top + 70;
  });
  
  addHeader();
  
  curY += 22;
  doc.setFont('PTSerif-Bold', 'bold'); 
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Department of ${getDeptName(courseData.department)}`, centerX(), curY, { align: "center" });
  
    // --- TOP HORIZONTAL COURSE INFO TABLE (unchanged) ---
    curY += 18  ;
    autoTable(doc, {
      startY: curY,
      head: [
        [
          "Title",
          "Code",
          "Credits",
          "Hours of Pedagogy",
          "L-T-P-S",
          "Exam Hours",
          "CIE",
          "SEE",
          "Exam Type",
        ],
      ],
      body: [
        [
          data.course_title || "-",
          data.course_code || "-",
          data.credits || "-",
          data.pedagogy_hours || "-",
          data.ltps || "-",
          data.exam_hours || "-",
          data.cie || "-",
          data.see || "-",
          data.course_type || "-",
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: "bold" },
      styles: { fontSize: 8, halign: "center", valign: "middle" },
      margin: { left: M.left, right: M.right },
      tableWidth: pageWidth - M.left - M.right,
    });

    curY = doc.lastAutoTable.finalY + 22;

    

    // --- Objectives box (bullet points) ---
    function drawLabeledBox(title, content, yStart) {
      const left = M.left;
      const width = pageWidth - M.left - M.right;
      const pad = 10;
      let y = Number(yStart)+5 || M.top;

      // Title - centered like sample
      // Title - centered like sample
doc.setFont('Lato-Bold', 'bold'); // Correct usage
doc.setFontSize(12);
title = String(title || "");

doc.text(title, centerX(), y, { align: "center" });

// reset for body text
doc.setFont("Tinos-Regular","normal");
doc.setFontSize(11);


      y += 8;

      // Normalize + sanitize
      content = normalizeMathText(String(content || ""));
      content = sanitizeModuleText(content);

      // Split into points by full stop or newline
      let parts = content
        .replace(/\n+/g, "\n")
        .split(/\. |\n/)
        .map((p) => p.trim())
        .filter((p) => p.length);

      // If no parts, show empty small box (better than nothing) - but we'll skip entire box if no content at higher level
      if (parts.length === 0) {
        parts = [];
      }

      // Wrap each point
      let bulletLines = [];
      let count = 1;
      parts.forEach((p) => {
        const wrapped = doc.splitTextToSize(count+'. ' + p, width - pad * 2 );
        count+=1; 
        bulletLines.push(...wrapped);
      });

      const boxHeight = Math.max(30, bulletLines.length * 12 + pad *2);

      // Draw box
      doc.setDrawColor(...GRAY_BORDER);
      doc.setLineWidth(1.1);
      doc.rect(left, y, width, boxHeight);

      // Draw text
      let ty = y + pad + 4;
      bulletLines.forEach((ln) => {
        ln = String(ln);
        if (ln.startsWith("•")) {
          doc.circle(left + pad, ty - 4, 2, "F");
          doc.text(ln.replace("•", ""), left + pad + 5, ty);
        } else {
          doc.text(ln, left + pad, ty);
        }
        ty += 14;
      });

      

      return y + boxHeight + 18;
    }

    function drawLabeledBoxWebLinks(title, content, yStart) {
  const left = M.left;
  const width = pageWidth - M.left - M.right;
  const pad = 10;
  let y = Number(yStart) + 5 || M.top;

  // Title
  doc.setFont('Lato-Bold', 'bold');
  doc.setFontSize(12);
  doc.text(String(title || ""), centerX(), y, { align: "center" });

  doc.setFont("Tinos-Regular", "normal");
  doc.setFontSize(11);

  y += 10;

  // Split links by newline
  let links = String(content || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (links.length === 0) return y + 15;

  // Calculate height (simple)
  const lineHeight = 12;
  const boxHeight = links.length * lineHeight + pad * 1;

  // Draw the box
  doc.setDrawColor(...GRAY_BORDER);
  doc.setLineWidth(1.1);
  doc.rect(left, y, width, boxHeight);

  // Draw each link inside
  let ty = y + pad + 4;
  let count = 1;
  links.forEach((ln) => {
    // Draw blue text (like <a>)
    doc.setTextColor(0, 0, 255);
    doc.text(count+". "+ln, left + pad, ty, { maxWidth: width - pad * 2, underline: true });
    count+=1;
    // Make the text clickable
    const textWidth = doc.getTextWidth(ln);
    doc.link(left + pad, ty - 6, textWidth, 10, { url: ln });

    // Reset color for next
    doc.setTextColor(0, 0, 0);

    ty += lineHeight;
  });

  return y + boxHeight + 18;
}


    // Prepare objectives and TLP using safeList (works if string or array)
    const objectivesArr = Array.isArray(data.course_objectives)
      ? data.course_objectives
      : data.course_objectives
      ? [data.course_objectives]
      : [];
    const objectivesText = objectivesArr.map((s) => String(s)).join(". ");

    if (objectivesText.trim().length > 0) {
      curY = drawLabeledBox(
        "Course objectives",
        objectivesText,
        curY
      );
    }

    const tlArr = Array.isArray(data.teaching_learning)
      ? data.teaching_learning
      : data.teaching_learning
      ? [data.teaching_learning]
      : [];
    const tlText = tlArr.map((s) => String(s)).join(". ");

    if (tlText.trim().length > 0) {
      curY = drawLabeledBox("Teaching-Learning Process", tlText, curY + 6);
    }

    // --- Modules (Option B: module content as bullet points) ---
    function drawExperimentsTable(doc, yStart, experiments) {
  const rows = experiments.map(exp => {
    return [
      exp.slno.toString(),
      exp.cont // Multi-line cell
    ];
  });

  autoTable(doc, {
    startY: yStart,
    head: [
      ["Sl. No.", "Experiments"]
    ],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: 10,
      valign: "top",
      cellPadding: 4,
      textColor: [0, 0, 0],
      font: "Tinos-Regular"
    },
    headStyles: {
      fillColor: [240, 240, 240],
      fontStyle: "bold",
      textColor: 0
    },
    columnStyles: {
      0: { cellWidth: 40, halign: "center" },
      1: { cellWidth: "auto" } // auto-wrap text
    },
    margin: { 
      left: M.left, 
      right: M.right,
      top: M.top + 80,
      bottom: M.bottom + 10 // IMPORTANT: Reserve space for footer
    },
    tableWidth: "auto",
    // ✅ Add header on new pages if table spans multiple pages
    showHead: 'everyPage', // Show header on every page
    
    // ✅ KEY FIX: Add header AND footer on each page
    didDrawPage: function(data) {
      // If this is NOT the first page of the table, add header
      if (data.pageNumber > 1 || doc.internal.getCurrentPageInfo().pageNumber > 1) {
        addHeader(); // Add your header
        curY = M.top + 100; // Start table below header

      }
      
      // Always add footer
      addFooter(doc.getNumberOfPages());
      
      // Update curY after the table on each page
      curY = data.cursor.y;
    }
    
    
  });

  return doc.lastAutoTable.finalY + 20;
}

    function drawModuleBox(title, content, meta, yStart) {
  // content normalization + sanitize
  content = normalizeMathText(String(content || ""));
  content = sanitizeModuleText(content);

  const left = M.left;
  const width = pageWidth - M.left - M.right;
  const pad = 10;

  // Split content into points by full stop OR newline
  let parts = content
    .replace(/\n+/g, "\n")
    .split(/\.(?:\s+|\n)|\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (parts.length === 0) {
    parts = [];
  }

  // Helper function to wrap text with word breaking and hyphenation
  function wrapTextWithHyphenation(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = doc.getTextWidth(testLine);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        // Check if single word is too long
        const wordWidth = doc.getTextWidth(word);
        
        if (wordWidth > maxWidth && currentLine === '') {
          // Break the long word with hyphen
          let remainingWord = word;
          while (remainingWord.length > 0) {
            let fitLength = remainingWord.length;
            
            // Find how many characters fit with hyphen
            for (let i = 1; i <= remainingWord.length; i++) {
              const chunk = remainingWord.substring(0, i) + '-';
              if (doc.getTextWidth(chunk) > maxWidth) {
                fitLength = Math.max(1, i - 1);
                break;
              }
            }
            
            const chunk = remainingWord.substring(0, fitLength);
            lines.push(chunk + '-');
            remainingWord = remainingWord.substring(fitLength);
          }
          
          // Remove hyphen from last chunk
          if (lines.length > 0) {
            lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
          }
        } else {
          // Push current line and start new one
          if (currentLine) {
            lines.push(currentLine);
          }
          
          // Check if new word itself is too long
          if (wordWidth > maxWidth) {
            let remainingWord = word;
            while (remainingWord.length > 0) {
              let fitLength = remainingWord.length;
              
              for (let i = 1; i <= remainingWord.length; i++) {
                const chunk = remainingWord.substring(0, i) + '-';
                if (doc.getTextWidth(chunk) > maxWidth) {
                  fitLength = Math.max(1, i - 1);
                  break;
                }
              }
              
              const chunk = remainingWord.substring(0, fitLength);
              if (remainingWord.length > fitLength) {
                lines.push(chunk + '-');
              } else {
                currentLine = chunk;
              }
              remainingWord = remainingWord.substring(fitLength);
            }
          } else {
            currentLine = word;
          }
        }
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  // Wrap each point with hyphenation support
  let bulletLines = [];
  const maxTextWidth = width - (pad * 4) - 20;
  
  parts.forEach((p) => {
    const bulletText = "• " + p;
    
    // Use custom wrapping with hyphenation
    const wrapped = wrapTextWithHyphenation(bulletText, maxTextWidth);
    
    wrapped.forEach((line, index) => {
      if (index === 0) {
        bulletLines.push({ text: line, hasBullet: true });
      } else {
        bulletLines.push({ text: line.trim(), hasBullet: false });
      }
    });
  });

  const lineHeight = 14;
  const contentHeight = Math.max(30, bulletLines.length * lineHeight + pad * 2);

  // Page-break guard
  const approxTableHeight = 90;
  if (yStart + contentHeight + approxTableHeight > pageHeight - M.bottom) {
    addFooter(doc.getNumberOfPages());
    doc.addPage();
    yStart = M.top + 80;
  }

  // Module title (centered)
  doc.setFont('Lato-Bold', 'bold');
  doc.setFontSize(12);
  doc.text(title, centerX(), yStart, { align: "center" });
  
  yStart += 16;
  
  doc.setFont("Tinos-Regular", "normal");
  doc.setFontSize(11);
  
  // Draw outer box for content
  doc.setDrawColor(...GRAY_BORDER);
  doc.setLineWidth(1.1);
  doc.rect(left, yStart, width, contentHeight);

  // Draw content lines with proper indentation
  let ty = yStart + pad + 4;
  const bulletIndent = 15;
  
  bulletLines.forEach((item) => {
    if (item.hasBullet) {
      doc.text(item.text, left + pad, ty);
    } else {
      doc.text(item.text, left + pad + bulletIndent, ty);
    }
    ty += lineHeight;
  });

  // ========== HORIZONTAL TABLE FOR METADATA ==========
  autoTable(doc, {
    startY: yStart + contentHeight + 6,
    margin: { left: left + 4, right: M.right + 4},
    theme: "grid",
    head: [["Text Book", "Chapter", "RBT"]],
    body: [
      [meta.textbook || "", meta.chapter || "", meta.rbt || ""]
    ],
    styles: {
      fontSize: 10,
      cellPadding: 6,
      font: "Tinos-Regular",
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [240, 240, 240],
      fontStyle: "bold",
      textColor: 0,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: (width - 8) / 3 },
      1: { cellWidth: (width - 8) / 3 },
      2: { cellWidth: (width - 8) / 3 },
    },
    tableWidth: width - 8,
  });

  // Draw final outer border including table bottom
  const bottom = doc.lastAutoTable.finalY + 6;
  doc.setDrawColor(...GRAY_BORDER);
  doc.setLineWidth(1.2);
  doc.rect(left, yStart, width, bottom - yStart);

  return bottom + 18;
}

    
    // Render modules only if present AND not empty
    if (Array.isArray(data.modules) && data.modules.length > 0) {
      for (let i = 0; i < data.modules.length; i++) {
        const mod = data.modules[i];
        if (!shouldRenderModule(mod)) continue;

        // page break guard before module header
        if (curY > pageHeight - M.bottom - 200) {
          addFooter(doc.getNumberOfPages());
          doc.addPage();
          curY = M.top + 80;
        }


        const title = `Module ${i + 1} ${mod.title?': '+mod.title:""}`;
        curY = drawModuleBox(title, mod.content || "", mod, curY + 8);
      }
    }

    //Experiments
    if (Array.isArray(data.experiments) && data.experiments.length > 0) {
    const spaceLeft = pageHeight - M.bottom - curY;
    
    // If not enough space for title + some rows, move to new page
    if (spaceLeft < 100) {
        addFooter(doc.getNumberOfPages());
        doc.addPage();
        addHeader(); // ✅ Add header on new page
        curY = M.top + 95; // Start below header
    }

    // Title
    doc.setFont('Lato-Bold', 'bold');
    doc.setFontSize(12);
    doc.text("PRACTICAL COMPONENT OF IPCC", centerX(), curY + 8, { align: "center" });
    curY += 18;

    // Table will handle its own page breaks with headers
    curY = drawExperimentsTable(doc, curY, data.experiments);
}

    // --- Textbooks
    if (shouldRenderTextbooks(data.textbooks || [])) {
      
      // place a small gap
      const approxTableHeight = 90;
      if (curY + 100 + approxTableHeight > pageHeight - M.bottom) {
        addFooter(doc.getNumberOfPages());
        doc.addPage();
        // curY = M.top + 0;
      }
      // curY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 24 : curY + 10;
      
      curY += 13;
      
      doc.setFont('Lato-Bold', 'bold');
doc.setFontSize(13);
doc.setTextColor(0, 0, 0);        // pure black title
doc.text("Textbooks", centerX(), curY, { align: "center" });

// Move down after title
curY += 10;

      autoTable(doc, {
        startY: curY,
        head: [["Sl.No", "Author", "Book Title", "Publisher"]],
        body: (data.textbooks || [])
          .filter(
            (tb) =>
              (tb.slNo && String(tb.slNo).trim()) ||
              (tb.author && String(tb.author).trim()) ||
              (tb.bookTitle && String(tb.bookTitle).trim()) ||
              (tb.publisher && String(tb.publisher).trim())
          )
          .map((tb) => [
            tb.slNo || "",
            tb.author || "",
            tb.bookTitle || "",
            tb.publisher || "",
          ]),
        theme: "grid",
        headStyles: { fillColor: [40, 40, 40], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: M.left, right: M.right },
        tableWidth: pageWidth - M.left - M.right,
      });

      curY = doc.lastAutoTable.finalY + 20;
    }

    const outComes = Array.isArray(data.course_outcomes)
      ? data.course_outcomes
      : data.course_outcomes
      ? [data.course_outcomes]
      : [];
    const outComes_text = outComes.map((s) => String(s)).join(". ");

    if (outComes_text.trim().length > 0) {
      const te = "At the end of the course, the student will be able to:\n"
      curY = drawLabeledBox("Course Outcomes", te+outComes_text, curY + 6);
    }

    const weblinks = Array.isArray(data.referral_links)
      ? data.referral_links
      : data.referral_links
      ? [data.referral_links]
      : [];
    const weblinks_text = weblinks.map((s) => String(s)).join(". ");

    if (weblinks_text.trim().length > 0) {
      curY = drawLabeledBoxWebLinks("Web Links", weblinks_text, curY + 6);
    }



    const activity_based = Array.isArray(data.activity_based)
      ? data.activity_based
      : data.activity_based
      ? [data.activity_based]
      : [];
    const activity_text = activity_based.map((s) => String(s)).join(". ");

    const spaceLeft = pageHeight - M.bottom - curY;
    
    // If not enough space for title + some rows, move to new page
    if (spaceLeft < 100) {
        addFooter(doc.getNumberOfPages());
        doc.addPage();
        addHeader(); // ✅ Add header on new page
        curY = M.top + 95; // Start below header
    }

    if (activity_text.trim().length > 0) {
      curY = drawLabeledBox("Activity-Based Learning (Suggested Activities in Class)/Practical-Based Learning", activity_text, curY + 6);
    }
    // ================== CO–PO MAPPING TABLE ==================
if (data.copoMapping && Array.isArray(data.copoMapping.rows)) {
    const spaceLeft = pageHeight - M.bottom - curY;

  if (spaceLeft < 100) {
        addFooter(doc.getNumberOfPages());
        doc.addPage();
        addHeader(); // ✅ Add header on new page
        curY = M.top + 60; // Start below header
    }
  
  // Title
  // doc.setFont('Lato-Bold', 'bold'); // Correct usage
  // doc.setFontSize(12);
  // doc.text("CO–PO Mapping Table", centerX(), curY + 12, { align: "center" });
  // curY += 13;
  
  doc.setFont("Tinos-Regular","normal");
  // HEADERS (POs + PSOs)
  const psoHeaders = data.copoMapping.rows[0]?.pso.map((_, i) => `PSO${i + 1}`) || [];
const poHeaders = ["CO", ...data.copoMapping.headers, ...psoHeaders];


  // BODY ROWS (CO rows)
  const copoRows = data.copoMapping.rows.map((row) => {
    return [
      row.co,
      ...row.vals,          // existing PO values
      ...row.pso       // new PSO2 column
    ];
  });

  // TOTAL ROW
  const totalRow = [
  "Total",
  ...Array(poHeaders.length - 1).fill(0).map((_, colIndex) =>
    copoRows.reduce((sum, row) => {
      const val = Number(row[colIndex + 1]);
      return sum + (isNaN(val) ? 0 : val);
    }, 0)
  )
];


// AVG ROW
const avgRow = [
  "AVG",
  ...totalRow.slice(1).map((v) =>
    v === 0 ? "" : (v / data.copoMapping.rows.length).toFixed(1)
  )
];


autoTable(doc, {
  startY: curY + 10,
  head: [poHeaders],
  body: [...copoRows, avgRow],
    theme: "grid",
    
    styles: {
      fontSize: 9,
      halign: "center",
      valign: "middle",
    },
    
    headStyles: {
      fillColor: [230, 180, 140],  // BIT light brown
      textColor: 0,
      fontStyle: "bold",
    },
    
    margin: { left: M.left, right: M.right },
    tableWidth: pageWidth - M.left - M.right,
  });

  curY = doc.lastAutoTable.finalY + 20;
}






    // Final footer
    
    // ================== EXPERIMENT TABLE ==================
    // In your main PDF generation code:


//FOOTER
    addFooter(doc.getNumberOfPages());

    // Save
    const fileName = `${courseData.course_code}`
    doc.save((fileName || "syllabus") + ".pdf");
  }

  return (
    <button
      onClick={generateSyllabusPDF}
      className="flex gap-1 items-center px-4 py-1.5 rounded-md bg-green-600 text-white cursor-pointer hover:bg-green-800 transition font-medium shadow-sm text-xs md:text-[15px]"
    >
      <Download size={20} />
      {/* <p className="text-xs md:text-[15px] hidden md:block">Download PDF</p> */}
      <p className="text-[15px]">Download PDF</p>
    </button>
  );
}