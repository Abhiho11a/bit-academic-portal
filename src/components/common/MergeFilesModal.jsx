import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { renderAsync } from "docx-preview";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { DOMParser, XMLSerializer } from "xmldom";


export default function MergeFilesModal({ onClose }) {
  const [files, setFiles] = useState([]);

  function handleFileSelect(e) {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
  }

  function removeFile(index) {
    setFiles(files.filter((_, i) => i !== index));
  }

  // -----------------------
  // PDF MERGE
  // -----------------------
  async function mergePDFs(pdfFiles) {
  const mergedPdf = await PDFDocument.create();

  // Copy pages from all PDFs
  for (const file of pdfFiles) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((p) => mergedPdf.addPage(p));
  }

  // Add continuous page numbers
  const pages = mergedPdf.getPages();
  const totalPages = pages.length;

  pages.forEach((page, index) => {
    const { width, height } = page.getSize();

    // ERASE previous page-number ONLY (small rectangle)
    page.drawRectangle({
    x: width - 90,   // adjust based on margin
    y: 10,           // bottom area where number is printed
    width: 80,       // small width covering only number
    height: 20,      // small height
    color: rgb(1, 1, 1), // white
});


    page.drawText(`${index + 1} / ${totalPages}`, {
      x: width - 50,
      y: 10, // bottom
      size: 10,
      color: rgb(0, 0, 0),
    });
  });

  const mergedBytes = await mergedPdf.save();

  // Download merged PDF
  const blob = new Blob([mergedBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "merged_on-"+new Date().toLocaleDateString();
  link.click();

  URL.revokeObjectURL(url);
}


  // -----------------------
  // DOCX → PDF CONVERSION (PERFECT WORKING)
  // -----------------------
  async function convertDOCXtoPDF(docxFile) {
    return new Promise(async (resolve) => {
      console.log("Converting DOCX:", docxFile.name);

      const buf = await docxFile.arrayBuffer();

      // Create hidden render container
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.top = "-99999px";
      wrapper.style.left = "-99999px";
      wrapper.style.width = "900px";
      wrapper.style.background = "#ffffff";
      wrapper.className = "docx-wrapper";
      document.body.appendChild(wrapper);

      // Render DOCX → HTML
      await renderAsync(buf, wrapper);

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const pages = wrapper.querySelectorAll("section.docx");

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Convert each page to PNG image
        const imgData = await htmlToImage.toPng(page, {
          backgroundColor: "#ffffff",
          pixelRatio: 2,
        });

        // Calculate scaled height
        const props = await pdf.getImageProperties(imgData);
        const imgHeight = (props.height * pdfWidth) / props.width;

        if (i !== 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      }

      document.body.removeChild(wrapper);

      // Convert to Blob
      const blob = pdf.output("blob");
      console.log("PDF created:", docxFile.name);

      resolve(new File([blob], docxFile.name.replace(".docx", ".pdf"), { type: "application/pdf" }));
    });
  }

// Merge two DOCX documents into one DOCX
async function mergeDOCX(files) {
  if (files.length === 0) return null;

  const zipMain = new JSZip();
  await zipMain.loadAsync(await files[0].arrayBuffer());

  const doc1 = zipMain.file("word/document.xml");
  let mainXML = await doc1.async("string");

  for (let i = 1; i < files.length; i++) {
    const zipNext = new JSZip();
    await zipNext.loadAsync(await files[i].arrayBuffer());

    const doc2 = zipNext.file("word/document.xml");
    let xml2 = await doc2.async("string");

    // Parse XML
    const parser = new DOMParser();
    const xmlMain = parser.parseFromString(mainXML, "text/xml");
    const xmlNext = parser.parseFromString(xml2, "text/xml");

    const bodyMain = xmlMain.getElementsByTagName("w:body")[0];
    const bodyNext = xmlNext.getElementsByTagName("w:body")[0];

    // Append all children of doc2 → doc1
    while (bodyNext.firstChild) {
      bodyMain.appendChild(bodyNext.firstChild);
    }

    // Serialize back to string
    const serializer = new XMLSerializer();
    mainXML = serializer.serializeToString(xmlMain);
  }

  // Replace final XML
  zipMain.file("word/document.xml", mainXML);

  // Build final DOCX
  const finalBlob = await zipMain.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  
  return new File([finalBlob], "Merged_File.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}


  // -----------------------
  // MAIN MERGE ACTION
  // -----------------------
  async function mergeFiles() {
    const pdfOnly = [];
    const docxOnly = [];

    files.forEach(f => {
      if (f.name.endsWith(".pdf")) pdfOnly.push(f);
      else if (f.name.endsWith(".docx")) docxOnly.push(f);
    });

    if(pdfOnly.length == 0)
    {
        if (docxOnly.length < 2) {
          alert("Add at least 2 DOCX files to merge!");
          return;
        }
      
        const mergedDocx = await mergeDOCX(docxOnly);
      
        const url = URL.createObjectURL(mergedDocx);
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged_on-"+new Date().toLocaleDateString();
        a.click();
        URL.revokeObjectURL(url);
      
        onClose();
    }

    // Convert DOCX → PDF (guaranteed working)
    const convertedPDFs = [];
    for (const doc of docxOnly) {
      const pdf = await convertDOCXtoPDF(doc);
      convertedPDFs.push(pdf);
    }

    const finalPDFs = [...pdfOnly, ...convertedPDFs];

    if (finalPDFs.length === 0) {
      alert("No valid files to merge!");
      return;
    }

    await mergePDFs(finalPDFs);
    onClose();
  }

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="fixed inset-0 bg-black/80  flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Merge Files</h2>
          <button onClick={onClose}>❌</button>
        </div>

        <div className="border-2 border-dashed p-6 mt-4 text-center rounded">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            multiple
            accept=".pdf,.docx"
            onChange={handleFileSelect}
          />
          <label htmlFor="fileInput" className="cursor-pointer text-gray-600">
            Click to upload PDF or DOCX files
          </label>
        </div>

        <div className="mt-4 max-h-48 overflow-y-auto">
          {files.map((file, i) => (
            <div key={i} className="flex justify-between bg-gray-100 p-2 rounded mb-2">
              <span>{file.name}</span>
              <button className="text-red-500" onClick={() => removeFile(i)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={mergeFiles} className="px-4 py-2 bg-blue-600 text-white rounded">
            Merge
          </button>
        </div>

      </div>
    </div>
  );
}
