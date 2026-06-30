from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "sample-professional-quotation.pdf"
LOGO = ROOT / "public" / "assets" / "shree-kali-logo.png"
BROCHURE = ROOT / "public" / "assets" / "nexon-10kg.png"
REFERENCE = ROOT / "public" / "assets" / "approved-quotation-reference.jpg"

NAVY = colors.HexColor("#051B42")
GOLD = colors.HexColor("#D89B16")
GREY = colors.HexColor("#4B535B")
LINE = colors.HexColor("#C4C9CD")


def money(value):
    return f"{value:,.2f}"


def footer(canvas, label, page):
    width, _ = A4
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, width, 27, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(28, 10, "NAVSARI, GUJARAT, INDIA")
    canvas.drawCentredString(width / 2, 10, "shreekalimanufacturers@gmail.com")
    canvas.drawRightString(width - 28, 10, "+91 9737555196")
    canvas.setFillColor(colors.HexColor("#8A949B"))
    canvas.setFont("Helvetica", 6)
    canvas.drawRightString(width - 28, 35, f"{label} | REV 00 | PAGE {page} OF 2")


def genuine_stamp(canvas, x, y, size):
    image = ImageReader(str(REFERENCE))
    image_width, image_height = image.getSize()
    crop_x, crop_y, crop_size = 750, 1308, 132
    scale = size / crop_size
    canvas.saveState()
    clip = canvas.beginPath()
    clip.rect(x, y, size, size)
    canvas.clipPath(clip, stroke=0, fill=0)
    canvas.drawImage(
        image,
        x - crop_x * scale,
        y - (image_height - crop_y - crop_size) * scale,
        image_width * scale,
        image_height * scale,
        mask="auto",
    )
    canvas.restoreState()


def quotation_page(canvas):
    width, height = A4
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.drawImage(str(LOGO), 27, height - 108, 83, 83, preserveAspectRatio=True, mask="auto")

    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 27)
    canvas.drawString(119, height - 54, "SHREE KALI")
    canvas.setFillColor(GOLD)
    canvas.setFont("Helvetica-Bold", 18)
    canvas.drawString(119, height - 78, "MANUFACTURERS")
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 9)
    canvas.drawString(119, height - 96, "Technology That Melts Perfection")

    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(300, height - 28, 300, height - 108)
    canvas.line(438, height - 28, 438, height - 108)
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawString(314, height - 45, "EMAIL")
    canvas.drawString(314, height - 73, "MOBILE")
    canvas.drawString(452, height - 45, "ADDRESS / GSTIN")
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 6.5)
    canvas.drawString(314, height - 57, "shreekalimanufacturers@gmail.com")
    canvas.drawString(314, height - 85, "+91 9737555196 / 9737555169")
    for index, line in enumerate(("U-10, Krishna Complex,", "Vijaynagar, Udyog Nagar,", "Navsari - 396445", "GSTIN: 24ADJPL2109F1ZZ")):
        canvas.drawString(452, height - 57 - index * 11, line)

    canvas.setStrokeColor(NAVY)
    canvas.setLineWidth(2)
    canvas.line(24, height - 121, width - 24, height - 121)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(4)
    canvas.line(42, height - 121, 119, height - 121)

    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 25)
    canvas.drawRightString(width - 25, height - 162, "QUOTATION")
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(24, height - 178, "TO,")
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawString(24, height - 202, "RAJESHWAR GOLDSMITHS")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(GREY)
    for index, line in enumerate(("Rajesh Shah", "123, Sunshine Complex, Ghod Dod Road", "Surat, Gujarat | M: 9876543210", "GST: 24ABCDE1234F1Z5")):
        canvas.drawString(24, height - 218 - index * 11, line)

    meta_x = width - 220
    meta_y = height - 225
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.rect(meta_x, meta_y, 195, 62)
    canvas.line(meta_x + 96, meta_y, meta_x + 96, meta_y + 62)
    canvas.line(meta_x, meta_y + 31, meta_x + 195, meta_y + 31)
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(meta_x + 10, meta_y + 43, "Quotation No.")
    canvas.drawString(meta_x + 10, meta_y + 12, "Date")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREY)
    canvas.drawRightString(meta_x + 185, meta_y + 43, "SKM/26-27/0004")
    canvas.drawRightString(meta_x + 185, meta_y + 12, "19 Jun 2026")

    subject_y = height - 286
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(24, subject_y, "Subject:")
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(69, subject_y, "Quotation for NEXON Gold Melting Machine and Accessories")
    canvas.drawString(24, subject_y - 27, "Dear Sir/Madam,")
    canvas.drawString(24, subject_y - 45, "Thank you for your inquiry. Please find below our best quotation for the required items:")

    rows = [
        ["1", "NEXON 10KG Commercial High Load", "1 Nos.", money(150000), money(150000)],
        ["2", "Additional / Replacement Graphite Crucible", "2 Nos.", money(5500), money(11000)],
        ["3", "Additional / Replacement Crucible Tongs", "1 Nos.", money(1200), money(1200)],
        ["4", "Additional / Replacement Graphite Ingot Mould", "1 Nos.", money(2400), money(2400)],
        ["5", "Additional / Replacement 5KG Carbon Rod", "1 Rod", money(1500), money(1500)],
        ["6", "Additional / Replacement 5KG Sensor", "1 Nos.", money(1100), money(1100)],
        ["7", "Installation and Operator Training", "1 Lot", money(5000), money(5000)],
    ]
    table = Table(
        [["Sr. No.", "Description", "Qty", "Rate (INR)", "Amount (INR)"]] + rows,
        colWidths=[52, 208, 76, 103, 116],
        rowHeights=[25] + [22] * len(rows),
    )
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ("ALIGN", (1, 0), (1, 0), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]))
    table.wrapOn(canvas, width, height)
    table.drawOn(canvas, 24, 325)

    subtotal = 172200
    tax = round(subtotal * 0.18)
    grand = subtotal + tax
    totals = Table(
        [["Sub Total (INR)", money(subtotal)], ["GST @ 18% (INR)", money(tax)], ["Total Amount (INR)", money(grand)]],
        colWidths=[103, 116],
        rowHeights=[23, 23, 25],
    )
    totals.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, 1), "Helvetica"),
        ("FONTNAME", (0, 2), (-1, 2), "Helvetica-Bold"),
        ("BACKGROUND", (0, 2), (-1, 2), NAVY),
        ("TEXTCOLOR", (0, 2), (-1, 2), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    totals.wrapOn(canvas, width, height)
    totals.drawOn(canvas, width - 243, 250)

    canvas.setStrokeColor(LINE)
    canvas.rect(24, 272, 260, 31)
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(33, 288, "NOTE:")
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 7.2)
    canvas.drawString(73, 288, "One complimentary accessory kit is included with the machine at no charge.")

    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(24, 229, "TERMS & CONDITIONS")
    canvas.setStrokeColor(GOLD)
    canvas.line(24, 225, 138, 225)
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 6.7)
    terms = (
        "- GST is calculated at 18% on the taxable amount.",
        "- Delivery: 7-10 working days from order confirmation.",
        "- Validity: 15 days from the date of issue.",
        "- Payment: 50% advance; balance before dispatch.",
        "- Machine ownership remains with the company until full payment.",
        "- Warranty: 1 year as per company policy after payment completion.",
        "- Subject to Navsari jurisdiction.",
    )
    for index, term in enumerate(terms):
        canvas.drawString(24, 213 - index * 10, term)
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 7.2)
    canvas.drawString(24, 145, "BANK DETAILS")
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 6.7)
    canvas.drawString(24, 133, "Bank of Maharashtra | A/C: 60561840319 | IFSC: MAHB0000432")
    canvas.drawString(24, 123, "Branch: Sayaji Library, Navsari")

    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.drawRightString(width - 32, 221, "For SHREE KALI MANUFACTURERS")
    genuine_stamp(canvas, width - 142, 141, 72)
    canvas.line(width - 168, 132, width - 34, 132)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawCentredString(width - 101, 120, "Authorized Signatory")
    footer(canvas, "SKM/26-27/0004", 1)


def brochure_page(canvas):
    width, height = A4
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 42, width, 42, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawCentredString(width / 2, height - 26, "NEXON 10KG COMMERCIAL HIGH LOAD - PRODUCT & KIT SCHEDULE")
    image = ImageReader(str(BROCHURE))
    image_width, image_height = image.getSize()
    max_width, max_height = width - 92, height - 190
    ratio = min(max_width / image_width, max_height / image_height)
    draw_width, draw_height = image_width * ratio, image_height * ratio
    image_y = 145
    canvas.setStrokeColor(LINE)
    canvas.rect((width - draw_width) / 2 - 2, image_y - 2, draw_width + 4, draw_height + 4)
    canvas.drawImage(image, (width - draw_width) / 2, image_y, draw_width, draw_height, preserveAspectRatio=True, mask="auto")

    canvas.setFillColor(NAVY)
    canvas.rect(24, 42, width - 48, 88, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(36, 112, "COMPLIMENTARY ACCESSORY KIT")
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawRightString(width - 36, 112, "INCLUDED WITH MACHINE | INR 0.00")
    kit = (
        "1 Nos. Graphite Crucible",
        "1 Nos. Crucible Tongs",
        "1 Nos. Graphite Ingot Mould",
        "1 Nos. Pouring Rod",
        "1 Rod 5KG Carbon Rod",
        "1 Nos. 5KG Sensor",
        "1 Copy User Manual",
    )
    canvas.setFont("Helvetica", 6.7)
    for index, item in enumerate(kit):
        column = 0 if index < 4 else 1
        row = index if index < 4 else index - 4
        x = 38 + column * 260
        y = 95 - row * 13
        canvas.setFillColor(GOLD)
        canvas.circle(x, y + 1, 2, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.drawString(x + 8, y - 1, item)
    canvas.setFillColor(colors.HexColor("#CCD7DF"))
    canvas.setFont("Helvetica", 6)
    canvas.drawString(36, 49, "Additional or replacement parts are charged separately on Page 1.")
    footer(canvas, "SKM/26-27/0004 - Product & Kit", 2)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas = Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    quotation_page(canvas)
    canvas.showPage()
    brochure_page(canvas)
    canvas.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
