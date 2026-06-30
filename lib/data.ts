import { Accessory, AppUser, CompanyProfile, Customer, Product, SalesDocument } from "./types";

export const COMPANY: CompanyProfile = {
  name: "Shree Kali Manufacturers",
  tagline: "Technology That Melts Perfection",
  address: ["U-10, Krishna Complex, Vijaynagar, Udyog Nagar", "Vejalpore, Navsari, Gujarat - 396445"],
  mobile: ["9737555196", "9737555169"],
  email: "shreekalimanufacturers@gmail.com",
  website: "www.shreekalimanufacturers.com",
  gstRate: 18,
  warranty: "1 Year",
  delivery: "7-10 Working Days",
  validityDays: 15,
  paymentTerms: "50% Advance",
  bank: {
    name: "Bank of Maharashtra",
    accountName: "Shree Kali Manufacturers",
    accountNumber: "60561840319",
    ifsc: "MAHB0000432",
    branch: "Sayaji Library, Navsari"
  }
};

export const DEMO_USERS: AppUser[] = [
  { id: "usr_ashish", name: "Ashish Gaikwad", username: "ashish", role: "Admin", initials: "AG" },
  { id: "usr_harshal", name: "Harshal Girase", username: "harshal", role: "Admin", initials: "HG" },
  { id: "usr_bhavani", name: "Bhavani", username: "bhavani", role: "Sales", initials: "B" },
  { id: "usr_gauri", name: "Gauri", username: "gauri", role: "Sales", initials: "G" }
];

const shared = {
  family: "NEXON Gold Melting Furnace",
  temperature: "Up to 1150°C",
  powerSupply: "Single Phase",
  bodyMaterial: "Stainless Steel",
  warranty: COMPANY.warranty,
  deliveryTime: COMPANY.delivery,
  specificationPdf: "/assets/shree-kali-manufacturers-brochure.pdf",
  status: "Active" as const
};

export const PRODUCTS: Product[] = [
  { ...shared, id: "SKM-NXN-1E", name: "NEXON 1KG Economic", capacity: "1KG", variant: "Economic", powerConsumption: "2.5 KW (Approx.)", dimensions: "440 x 380 x 300 mm", weight: "18 KG (Approx.)", priceWithoutGst: 28000, priceWithGst: 33040, description: "Compact economic furnace for jewellers and small workshops.", image: "/assets/nexon-1kg.png", brochure: "/assets/nexon-1kg.png" },
  { ...shared, id: "SKM-NXN-1C", name: "NEXON 1KG Commercial", capacity: "1KG", variant: "Commercial", powerConsumption: "3 KW (Approx.)", dimensions: "460 x 400 x 320 mm", weight: "22 KG (Approx.)", priceWithoutGst: 33000, priceWithGst: 38940, description: "Commercial-duty compact furnace with reliable daily output.", image: "/assets/nexon-1kg.png", brochure: "/assets/nexon-1kg.png" },
  { ...shared, id: "SKM-NXN-1T", name: "NEXON 1KG Thyristor", capacity: "1KG", variant: "Thyristor", powerConsumption: "3 KW (Approx.)", dimensions: "480 x 420 x 330 mm", weight: "25 KG (Approx.)", priceWithoutGst: 46000, priceWithGst: 54280, description: "Precision thyristor-controlled furnace for consistent melting.", image: "/assets/nexon-1kg.png", brochure: "/assets/nexon-1kg.png" },
  { ...shared, id: "SKM-NXN-3T", name: "NEXON 3KG Thyristor", capacity: "3KG", variant: "Thyristor", powerConsumption: "3 KW (Approx.)", dimensions: "500 x 500 x 350 mm", weight: "30 KG (Approx.)", priceWithoutGst: 62500, priceWithGst: 73750, description: "High-value furnace for uniform precious-metal melting.", image: "/assets/nexon-3kg.png", brochure: "/assets/nexon-3kg.png" },
  { ...shared, id: "SKM-NXN-5E", name: "NEXON 5KG Economic", capacity: "5KG", variant: "Economic", powerConsumption: "4 KW (Approx.)", dimensions: "600 x 550 x 450 mm", weight: "48 KG (Approx.)", priceWithoutGst: 80500, priceWithGst: 94990, description: "Efficient mid-capacity machine for growing jewellery production.", image: "/assets/nexon-5kg.png", brochure: "/assets/nexon-5kg.png" },
  { ...shared, id: "SKM-NXN-5CH", name: "NEXON 5KG Commercial High Load", capacity: "5KG", variant: "Commercial High Load", powerConsumption: "5 KW (Approx.)", dimensions: "620 x 570 x 470 mm", weight: "55 KG (Approx.)", priceWithoutGst: 97500, priceWithGst: 115050, description: "Heavy-duty commercial furnace for frequent production cycles.", image: "/assets/nexon-5kg.png", brochure: "/assets/nexon-5kg.png" },
  { ...shared, id: "SKM-NXN-10E", name: "NEXON 10KG Economic", capacity: "10KG", variant: "Economic", powerSupply: "3 Phase", powerConsumption: "6 KW (Approx.)", dimensions: "650 x 600 x 600 mm", weight: "82 KG (Approx.)", priceWithoutGst: 130000, priceWithGst: 153400, description: "Industrial-capacity economic furnace with compact floor footprint.", image: "/assets/nexon-10kg.png", brochure: "/assets/nexon-10kg.png" },
  { ...shared, id: "SKM-NXN-10CH", name: "NEXON 10KG Commercial High Load", capacity: "10KG", variant: "Commercial High Load", powerSupply: "3 Phase", powerConsumption: "6 KW (Approx.)", dimensions: "650 x 600 x 600 mm", weight: "90 KG (Approx.)", priceWithoutGst: 150000, priceWithGst: 177000, description: "Commercial high-load furnace for continuous industrial use.", image: "/assets/nexon-10kg.png", brochure: "/assets/nexon-10kg.png" },
  { ...shared, id: "SKM-NXN-20CH", name: "NEXON 20KG Commercial High Load", capacity: "20KG", variant: "Commercial High Load", powerSupply: "3 Phase", powerConsumption: "9 KW (Approx.)", dimensions: "780 x 720 x 780 mm", weight: "135 KG (Approx.)", priceWithoutGst: 145000, priceWithGst: 171100, description: "High-capacity furnace engineered for heavy and continuous operation.", image: "/assets/nexon-20kg.png", brochure: "/assets/nexon-20kg.png" }
];

export const ACCESSORIES: Accessory[] = [
  { id: "ACC-001", name: "Graphite Crucible", price: 5500, unit: "Nos.", status: "Active" },
  { id: "ACC-002", name: "Crucible Tongs", price: 1200, unit: "Nos.", status: "Active" },
  { id: "ACC-003", name: "Graphite Ingot Mould", price: 2400, unit: "Nos.", status: "Active" },
  { id: "ACC-004", name: "Pouring Rod", price: 850, unit: "Nos.", status: "Active" },
  { id: "ACC-005", name: "Carbon Stirring Rod", price: 450, unit: "Nos.", status: "Active" },
  { id: "ACC-006", name: "K-Type Sensor", price: 1500, unit: "Nos.", status: "Active" },
  { id: "ACC-007", name: "User Manual", price: 0, unit: "Copy", status: "Active" }
];

export const CUSTOMERS: Customer[] = [
  { id: "CUS-0001", name: "Rajesh Shah", company: "Rajeshwar Goldsmiths", mobile: "9876543210", email: "rajeshwar.gold@gmail.com", address: "123, Sunshine Complex, Ghod Dod Road", city: "Surat", state: "Gujarat", gst: "24ABCDE1234F1Z5", remarks: "Interested in 10KG high-load model", createdAt: "2026-06-17" },
  { id: "CUS-0002", name: "Mehul Jain", company: "Arihant Bullion", mobile: "9825011442", email: "purchase@arihantbullion.in", address: "Zaveri Bazar", city: "Mumbai", state: "Maharashtra", gst: "27AAECA4421G1ZP", remarks: "Repeat customer", createdAt: "2026-06-14" },
  { id: "CUS-0003", name: "Pooja Soni", company: "Soni Jewels", mobile: "9909912770", email: "pooja@sonijewels.com", address: "CG Road", city: "Ahmedabad", state: "Gujarat", gst: "24AAQFS8810L1Z2", remarks: "Requested 3KG demo", createdAt: "2026-06-11" },
  { id: "CUS-0004", name: "Kunal Patil", company: "Kuber Refinery", mobile: "9765518930", email: "kunal@kuberrefinery.in", address: "MIDC Industrial Area", city: "Nashik", state: "Maharashtra", gst: "27AAHCK5902F1Z8", remarks: "Needs delivery before July", createdAt: "2026-06-08" }
];

export const DOCUMENTS: SalesDocument[] = [
  { id: "doc_1", kind: "Quotation", number: "SKM/26-27/0003", customerId: "CUS-0001", customerName: "Rajeshwar Goldsmiths", productId: "SKM-NXN-10CH", productName: "NEXON 10KG Commercial High Load", amount: 190860, status: "Sent", createdAt: "2026-06-18", validUntil: "2026-07-03", lineItems: [] },
  { id: "doc_2", kind: "Quotation", number: "SKM/26-27/0002", customerId: "CUS-0003", customerName: "Soni Jewels", productId: "SKM-NXN-3T", productName: "NEXON 3KG Thyristor", amount: 75278, status: "Accepted", createdAt: "2026-06-15", validUntil: "2026-06-30", lineItems: [] },
  { id: "doc_3", kind: "Order Confirmation", number: "OC/26-27/0001", customerId: "CUS-0002", customerName: "Arihant Bullion", productId: "SKM-NXN-5CH", productName: "NEXON 5KG Commercial High Load", amount: 115050, status: "Confirmed", createdAt: "2026-06-13", deliveryDate: "2026-06-27", lineItems: [] }
];

export const TERMS = [
  "50% advance payment is required to confirm the order.",
  "Machine ownership remains with the company until payment completion.",
  "Warranty is provided as per company policy and activates after payment completion.",
  "Prices exclude transportation charges unless specifically included.",
  "Goods once sold will not be taken back or exchanged.",
  "Subject to Navsari jurisdiction."
];

export const ROLE_ACCESS: Record<string, string[]> = {
  Admin: ["dashboard", "customers", "products", "accessories", "quotations", "orders", "documents", "users", "settings"],
  Sales: ["dashboard", "customers", "quotations", "orders", "documents"],
  Owner: ["dashboard", "customers", "quotations", "orders", "documents"]
};
