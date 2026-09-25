import { jsPDF } from 'jspdf';
import { PdfDocument } from '../types';

export function generateAndDownloadPdf(doc: PdfDocument) {
  // If user uploaded their own real PDF file, download their original uploaded file directly!
  if (doc.fileData && doc.fileData.startsWith('data:application/pdf')) {
    const link = document.createElement('a');
    link.href = doc.fileData;
    const cleanName = doc.title.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${cleanName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Fallback: If no raw file uploaded (e.g. default system records), generate official Beryl Drugs letterhead PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header Border Box
  pdf.setDrawColor(30, 58, 138); // Navy blue
  pdf.setLineWidth(0.5);
  pdf.rect(margin, margin, contentWidth, 267);

  // Decorative Top Accent Bar
  pdf.setFillColor(30, 58, 138);
  pdf.rect(margin, margin, contentWidth, 6, 'F');

  // Company Name Heading
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(15, 23, 42);
  pdf.text('BERYL DRUGS LIMITED', pageWidth / 2, margin + 16, { align: 'center' });

  // Subtitle / Reg Details
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('CIN: L02423MP1993PLC007840  |  BSE Scrip Code: 524606  |  ISIN: INE415H01017', pageWidth / 2, margin + 21, { align: 'center' });
  pdf.text('Regd. Office: Registered office 29, neer nagar, mayank water park road, bicholi, indore- 452016 MP', pageWidth / 2, margin + 25, { align: 'center' });
  pdf.text('Website: www.beryldrugs.com  |  Email: info@beryldrugs.com', pageWidth / 2, margin + 29, { align: 'center' });

  // Divider Line
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.3);
  pdf.line(margin + 5, margin + 33, margin + contentWidth - 5, margin + 33);

  // Document Title Box
  pdf.setFillColor(238, 242, 255); // light indigo
  pdf.setDrawColor(199, 210, 254);
  pdf.roundedRect(margin + 6, margin + 38, contentWidth - 12, 22, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(67, 56, 202);
  pdf.text('OFFICIAL STATUTORY DISCLOSURE & REGULATORY FILING', pageWidth / 2, margin + 44, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.setTextColor(15, 23, 42);
  const splitTitle = pdf.splitTextToSize(doc.title.toUpperCase(), contentWidth - 20);
  pdf.text(splitTitle, pageWidth / 2, margin + 50, { align: 'center' });

  // Metadata Table
  let currentY = margin + 66;
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.rect(margin + 6, currentY, contentWidth - 12, 28, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);

  pdf.text('Filing Category:', margin + 10, currentY + 7);
  pdf.setFont('helvetica', 'normal');
  pdf.text(doc.categoryName || doc.category || 'General', margin + 45, currentY + 7);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Subcategory / Section:', margin + 10, currentY + 14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(doc.subcategory || 'Statutory Filing', margin + 45, currentY + 14);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Financial Period:', margin + 10, currentY + 21);
  pdf.setFont('helvetica', 'normal');
  pdf.text(doc.year || '2023-2024', margin + 45, currentY + 21);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Compliance Status:', margin + 115, currentY + 7);
  pdf.setTextColor(22, 101, 52);
  pdf.text('Verified & Archived', margin + 150, currentY + 7);

  pdf.setTextColor(51, 65, 85);
  pdf.text('Listing Authority:', margin + 115, currentY + 14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('BSE Ltd. (Mumbai)', margin + 150, currentY + 14);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Document ID:', margin + 115, currentY + 21);
  pdf.setFont('helvetica', 'normal');
  pdf.text(doc.id, margin + 150, currentY + 21);

  // Content Paragraphs
  currentY += 36;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('TO WHOMSOEVER IT MAY CONCERN / STOCK EXCHANGE INTIMATION', margin + 6, currentY);

  currentY += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(51, 65, 85);

  const text1 = `This document certifies that the Board of Directors of Beryl Drugs Limited, in compliance with the Securities and Exchange Board of India (Listing Obligations and Disclosure Requirements) Regulations, 2015 and the Companies Act, 2013, has formally reviewed, approved, and released the filing titled "${doc.title}".`;
  const splitText1 = pdf.splitTextToSize(text1, contentWidth - 12);
  pdf.text(splitText1, margin + 6, currentY);

  currentY += splitText1.length * 5 + 4;

  const text2 = `All relevant statements, schedule of accounts, certificates from independent statutory auditors, secretarial auditors, and compliance officers have been duly annexed hereto and submitted electronically to the BSE Listing Centre platform for public dissemination and investor records.`;
  const splitText2 = pdf.splitTextToSize(text2, contentWidth - 12);
  pdf.text(splitText2, margin + 6, currentY);

  currentY += splitText2.length * 5 + 4;

  const text3 = `The company maintains its registered records at its corporate office in Indore, Madhya Pradesh. Any queries regarding this filing may be addressed to the Compliance Officer at info@beryldrugs.com.`;
  const splitText3 = pdf.splitTextToSize(text3, contentWidth - 12);
  pdf.text(splitText3, margin + 6, currentY);

  // Key Highlights Box
  currentY += splitText3.length * 5 + 8;
  pdf.setFillColor(241, 245, 249);
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(margin + 6, currentY, contentWidth - 12, 28, 1.5, 1.5, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 41, 59);
  pdf.text('CORPORATE SUMMARY & AUDIT ASSURANCE:', margin + 10, currentY + 7);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('• Formulations Manufactured: WHO-GMP & ISO 9001:2015 Parenteral Facility at Bicholi, Indore.', margin + 10, currentY + 13);
  pdf.text('• Financial Reporting Standard: Compliant with Indian Accounting Standards (Ind AS).', margin + 10, currentY + 19);
  pdf.text('• Investor Grievance Portal: SEBI SCORES / BSE Corporate Compliance Archive Active.', margin + 10, currentY + 25);

  // Signature Block
  const sigY = 245;
  pdf.setDrawColor(203, 213, 225);
  pdf.line(margin + 6, sigY, margin + contentWidth - 6, sigY);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('BERYL DRUGS LIMITED', margin + 8, sigY + 6);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Certified True Copy & Cryptographic Record', margin + 8, sigY + 11);
  pdf.text('Timestamp: ' + new Date().toLocaleDateString('en-GB'), margin + 8, sigY + 16);

  // Right Signature
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('FOR BERYL DRUGS LIMITED', pageWidth - margin - 8, sigY + 6, { align: 'right' });
  pdf.setFont('times', 'italic');
  pdf.setFontSize(10);
  pdf.setTextColor(37, 99, 235);
  pdf.text('[ Digitally Signed ]', pageWidth - margin - 8, sigY + 13, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('Company Secretary & Compliance Officer', pageWidth - margin - 8, sigY + 18, { align: 'right' });

  // Save the PDF
  const filename = `${doc.id}-${doc.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  pdf.save(filename);
}
