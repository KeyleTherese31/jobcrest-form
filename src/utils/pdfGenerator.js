import html2pdf from "html2pdf.js";

export function generateCVPDF(elementId, fileName = "Jobseeker_CV.pdf") {
  const element = document.getElementById(elementId);
  html2pdf().from(element).save(fileName);
}
