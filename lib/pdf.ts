"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { COMPANY, TERMS } from "./data";
import { Accessory, Customer, DocumentKind, Product } from "./types";

export interface DocumentPayload {
  kind: DocumentKind;
  number: string;
  date: string;
  customer: Customer;
  product: Product;
  accessories: Accessory[];
  quantities?: Record<string, number>;
  notes?: string;
  serialNumber?: string;
  purchaseDate?: string;
  deliveryDate?: string;
}

const NAVY: [number, number, number] = [4, 25, 43];
const GOLD: [number, number, number] = [211, 151, 19];
const GREY: [number, number, number] = [82, 91, 99];

const money = (value: number) => `INR ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

async function imageData(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function addPageFrame(doc: jsPDF, label: string) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.line(8, 7, 202, 7);
  doc.setFillColor(...NAVY);
  doc.rect(0, 289, 210, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text("SHREE KALI MANUFACTURERS", 10, 294);
  doc.text(`${label}  |  ${COMPANY.website}`, 200, 294, { align: "right" });
}

async function addHeader(doc: jsPDF, title: string, number: string) {
  addPageFrame(doc, number);
  const logo = await imageData("/assets/shree-kali-logo.png");
  if (logo) doc.addImage(logo, "PNG", 10, 11, 20, 20, undefined, "FAST");
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(COMPANY.name.toUpperCase(), 34, 18);
  doc.setTextColor(...GOLD);
  doc.setFontSize(9);
  doc.text(COMPANY.tagline, 34, 25);
  doc.setTextColor(...GREY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(`+91 ${COMPANY.mobile.join("  |  +91 ")}`, 199, 13, { align: "right" });
  doc.text(COMPANY.email, 199, 18, { align: "right" });
  doc.text(COMPANY.address, 199, 23, { align: "right" });
  doc.setDrawColor(205, 211, 216);
  doc.line(10, 34, 200, 34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...NAVY);
  doc.text(title.toUpperCase(), 10, 44);
  doc.setFillColor(...GOLD);
  doc.rect(10, 47, 23, 1.5, "F");
}

function addCustomerAndMeta(doc: jsPDF, payload: DocumentPayload, validUntil: string) {
  doc.setFillColor(247, 248, 249);
  doc.roundedRect(10, 54, 119, 38, 2, 2, "F");
  doc.setFontSize(7);
  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 15, 62);
  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  doc.text(payload.customer.company || payload.customer.name, 15, 69);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  const address = `${payload.customer.name}\n${payload.customer.address}, ${payload.customer.city}, ${payload.customer.state}\nM: ${payload.customer.mobile}  |  ${payload.customer.email || "Email not provided"}\nGST: ${payload.customer.gst || "Unregistered"}`;
  doc.text(address, 15, 75, { maxWidth: 108, lineHeightFactor: 1.35 });

  doc.setDrawColor(220, 223, 226);
  doc.roundedRect(135, 54, 65, 38, 2, 2, "S");
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  const rows = [
    ["Document No.", payload.number],
    ["Date", payload.date],
    ["Valid Until", validUntil],
    ["Delivery", payload.deliveryDate || COMPANY.delivery],
    ["Payment", COMPANY.paymentTerms]
  ];
  rows.forEach(([label, value], index) => {
    const y = 61 + index * 6;
    doc.text(label, 139, y);
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.text(String(value), 197, y, { align: "right", maxWidth: 37 });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
  });
}

function getAmounts(payload: DocumentPayload) {
  const productAmount = payload.product.priceWithoutGst;
  const accessories = payload.accessories.reduce((sum, item) => sum + item.price * (payload.quantities?.[item.id] || 1), 0);
  const subtotal = productAmount + accessories;
  const gst = subtotal * (COMPANY.gstRate / 100);
  return { subtotal, gst, total: subtotal + gst };
}

function addCommercialBody(doc: jsPDF, payload: DocumentPayload, title: string) {
  const items = [
    [payload.product.name, "1 Nos.", money(payload.product.priceWithoutGst), money(payload.product.priceWithoutGst)],
    ...payload.accessories.map((item) => {
      const quantity = payload.quantities?.[item.id] || 1;
      return [item.name, `${quantity} ${item.unit}`, money(item.price), money(item.price * quantity)];
    })
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text(title === "QUOTATION" ? "Thank you for your enquiry. Please find our best commercial offer below." : "Please find the transaction details below.", 10, 101);

  autoTable(doc, {
    startY: 106,
    head: [["DESCRIPTION", "QTY.", "UNIT PRICE", "AMOUNT"]],
    body: items,
    theme: "grid",
    margin: { left: 10, right: 10 },
    styles: { font: "helvetica", fontSize: 7.5, cellPadding: 3, lineColor: [220, 223, 226], textColor: NAVY },
    headStyles: { fillColor: NAVY, textColor: [244, 188, 39], fontStyle: "bold", halign: "center" },
    columnStyles: { 0: { cellWidth: 91 }, 1: { cellWidth: 25, halign: "center" }, 2: { cellWidth: 37, halign: "right" }, 3: { cellWidth: 37, halign: "right", fontStyle: "bold" } }
  });

  const amounts = getAmounts(payload);
  const tableEnd = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 135;
  const totalY = Math.min(tableEnd + 5, 164);
  doc.setFillColor(248, 249, 250);
  doc.rect(126, totalY, 74, 20, "F");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text("Subtotal", 131, totalY + 6);
  doc.text(`GST @ ${COMPANY.gstRate}%`, 131, totalY + 12);
  doc.setTextColor(...NAVY);
  doc.text(money(amounts.subtotal), 196, totalY + 6, { align: "right" });
  doc.text(money(amounts.gst), 196, totalY + 12, { align: "right" });
  doc.setFillColor(...GOLD);
  doc.rect(126, totalY + 20, 74, 13, "F");
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("GRAND TOTAL", 131, totalY + 28);
  doc.setFontSize(11);
  doc.text(money(amounts.total), 196, totalY + 28, { align: "right" });

  const detailY = totalY + 39;
  doc.setDrawColor(218, 222, 226);
  doc.roundedRect(10, detailY, 112, 36, 2, 2, "S");
  doc.setTextColor(...NAVY);
  doc.setFontSize(8.5);
  doc.text(payload.product.name.toUpperCase(), 15, detailY + 7, { maxWidth: 102 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...GREY);
  const specs = [
    `Capacity: ${payload.product.capacity}`,
    `Variant: ${payload.product.variant}`,
    `Temperature: ${payload.product.temperature}`,
    `Power: ${payload.product.powerSupply} / ${payload.product.powerConsumption}`,
    `Body: ${payload.product.bodyMaterial}`,
    `Warranty: ${payload.product.warranty}`
  ];
  specs.forEach((line, i) => doc.text(line, i < 3 ? 15 : 69, detailY + 15 + (i % 3) * 6));

  doc.setFillColor(247, 248, 249);
  doc.roundedRect(128, detailY, 72, 36, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("COMMERCIAL TERMS", 133, detailY + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...GREY);
  doc.text(`Warranty: ${COMPANY.warranty}\nDelivery: ${COMPANY.delivery}\nPayment: ${COMPANY.paymentTerms}\nValidity: ${COMPANY.validityDays} Days`, 133, detailY + 14, { lineHeightFactor: 1.45 });

  const footerY = detailY + 44;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.text("TERMS & CONDITIONS", 10, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...GREY);
  doc.text(TERMS.slice(0, 4).map((term) => `- ${term}`).join("\n"), 10, footerY + 6, { maxWidth: 112, lineHeightFactor: 1.35 });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("BANK DETAILS", 10, footerY + 30);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.text(`${COMPANY.bank.name}  |  A/C: ${COMPANY.bank.accountNumber}\nIFSC: ${COMPANY.bank.ifsc}  |  ${COMPANY.bank.branch}`, 10, footerY + 36, { lineHeightFactor: 1.35 });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.text("For SHREE KALI MANUFACTURERS", 199, footerY + 4, { align: "right" });
  doc.setFontSize(12);
  doc.setTextColor(...GOLD);
  doc.text("Authorized Signatory", 199, footerY + 22, { align: "right" });
  doc.setDrawColor(...GOLD);
  doc.line(145, footerY + 26, 199, footerY + 26);
  doc.setTextColor(...GREY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(payload.notes || "System-generated document from the approved master template.", 199, footerY + 34, { align: "right", maxWidth: 67 });
}

async function addBrochurePage(doc: jsPDF, payload: DocumentPayload) {
  doc.addPage("a4", "portrait");
  addPageFrame(doc, `${payload.number} - Product Brochure`);
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`${payload.product.name} | Approved Product Brochure`, 105, 9.5, { align: "center" });
  const brochure = await imageData(payload.product.brochure);
  if (!brochure) return;
  const ratio = 1054 / 1492;
  const maxWidth = 194;
  const maxHeight = 267;
  let width = maxWidth;
  let height = width / ratio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }
  doc.addImage(brochure, "PNG", (210 - width) / 2, 18, width, height, undefined, "FAST");
}

function addAccessoryPage(doc: jsPDF, payload: DocumentPayload) {
  doc.addPage("a4", "portrait");
  addPageFrame(doc, `${payload.number} - Accessories`);
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 31, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ACCESSORY KIT", 12, 16);
  doc.setTextColor(...GOLD);
  doc.setFontSize(8);
  doc.text("Approved items selected with this machine", 12, 24);
  const cols = 2;
  payload.accessories.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = 12 + col * 95;
    const y = 42 + row * 42;
    doc.setFillColor(247, 248, 249);
    doc.roundedRect(x, y, 88, 34, 2, 2, "F");
    doc.setFillColor(...GOLD);
    doc.circle(x + 10, y + 11, 5, "F");
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(String(index + 1).padStart(2, "0"), x + 10, y + 13, { align: "center" });
    doc.text(item.name, x + 19, y + 10, { maxWidth: 62 });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.setFontSize(7.5);
    doc.text(`Quantity: ${payload.quantities?.[item.id] || 1} ${item.unit}`, x + 19, y + 19);
    doc.text(`Unit price: ${money(item.price)}`, x + 19, y + 26);
  });
  const y = 42 + Math.ceil(payload.accessories.length / 2) * 42 + 8;
  doc.setDrawColor(...GOLD);
  doc.line(12, y, 198, y);
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Kit Notes", 12, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.setFontSize(8);
  doc.text("Accessories are packed after inspection and supplied according to the quantities shown in the commercial document. Images are indicative; specifications follow the approved product master.", 12, y + 20, { maxWidth: 186, lineHeightFactor: 1.5 });
}

async function addWarrantyPage(doc: jsPDF, payload: DocumentPayload) {
  addPageFrame(doc, payload.number);
  const logo = await imageData("/assets/shree-kali-logo.png");
  if (logo) doc.addImage(logo, "PNG", 85, 17, 40, 40, undefined, "FAST");
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("WARRANTY CERTIFICATE", 105, 69, { align: "center" });
  doc.setTextColor(...GOLD);
  doc.setFontSize(9);
  doc.text(COMPANY.tagline, 105, 77, { align: "center" });
  doc.setDrawColor(...GOLD);
  doc.roundedRect(18, 88, 174, 105, 3, 3, "S");
  const purchase = new Date(payload.purchaseDate || payload.date);
  const expiry = new Date(purchase);
  expiry.setFullYear(expiry.getFullYear() + 1);
  const details = [
    ["Customer", payload.customer.company || payload.customer.name],
    ["Machine", payload.product.name],
    ["Capacity / Variant", `${payload.product.capacity} / ${payload.product.variant}`],
    ["Serial Number", payload.serialNumber || "To be assigned at dispatch"],
    ["Purchase Date", purchase.toLocaleDateString("en-GB")],
    ["Warranty Expiry", expiry.toLocaleDateString("en-GB")]
  ];
  details.forEach(([label, value], index) => {
    const y = 102 + index * 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.setFontSize(8);
    doc.text(label, 27, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.setFontSize(9);
    doc.text(value, 72, y, { maxWidth: 82 });
    doc.setDrawColor(230, 232, 234);
    doc.line(27, y + 4, 154, y + 4);
  });
  const qr = await QRCode.toDataURL(`SKM-WARRANTY|${payload.number}|${payload.serialNumber || "PENDING"}|${payload.customer.mobile}`);
  doc.addImage(qr, "PNG", 158, 105, 25, 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...GREY);
  doc.text("Scan to verify", 170.5, 135, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.setFontSize(9);
  doc.text("WARRANTY CONDITIONS", 18, 211);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.setFontSize(7.5);
  doc.text("Warranty covers manufacturing defects under normal use for one year from the purchase date. Coverage activates after payment completion. Consumables, accidental damage, misuse, unauthorized repair, transport, and voltage-related damage are excluded. Subject to company policy and Navsari jurisdiction.", 18, 221, { maxWidth: 174, lineHeightFactor: 1.5 });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("For SHREE KALI MANUFACTURERS", 192, 261, { align: "right" });
  doc.setTextColor(...GOLD);
  doc.setFontSize(12);
  doc.text("Authorized Signatory", 192, 277, { align: "right" });
}

export async function createDocumentPdf(payload: DocumentPayload) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  if (payload.kind === "Warranty Card") {
    await addWarrantyPage(doc, payload);
    return doc;
  }
  const title = payload.kind === "Order Confirmation" ? "ORDER CONFIRMATION" : payload.kind.toUpperCase();
  await addHeader(doc, title, payload.number);
  const validDate = new Date(payload.date);
  validDate.setDate(validDate.getDate() + COMPANY.validityDays);
  addCustomerAndMeta(doc, payload, payload.kind === "Quotation" ? validDate.toLocaleDateString("en-GB") : "As agreed");
  addCommercialBody(doc, payload, title);
  if (payload.kind === "Quotation") {
    await addBrochurePage(doc, payload);
    if (payload.accessories.length) addAccessoryPage(doc, payload);
  }
  return doc;
}

export async function downloadDocument(payload: DocumentPayload) {
  const pdf = await createDocumentPdf(payload);
  pdf.save(`${payload.number.replaceAll("/", "-")}-${payload.customer.company || payload.customer.name}.pdf`);
}

export async function previewDocument(payload: DocumentPayload) {
  const pdf = await createDocumentPdf(payload);
  const url = URL.createObjectURL(pdf.output("blob"));
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function shareDocument(payload: DocumentPayload) {
  const pdf = await createDocumentPdf(payload);
  const filename = `${payload.number.replaceAll("/", "-")}.pdf`;
  const file = new File([pdf.output("blob")], filename, { type: "application/pdf" });
  const message = `Dear ${payload.customer.name}, please find ${payload.kind.toLowerCase()} ${payload.number} from Shree Kali Manufacturers. Total: ${money(getAmounts(payload).total)}.`;
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: payload.kind, text: message, files: [file] });
    return "shared";
  }
  pdf.save(filename);
  window.open(`https://wa.me/91${payload.customer.mobile.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`${message}\n\nThe PDF has been downloaded. Please attach it in WhatsApp.`)}`, "_blank", "noopener,noreferrer");
  return "downloaded";
}
