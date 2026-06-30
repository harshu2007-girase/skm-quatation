export type Role = "Admin" | "Sales" | "Owner";
export type View = "dashboard" | "customers" | "products" | "accessories" | "quotations" | "orders" | "documents" | "users" | "settings";
export type DocumentKind = "Quotation" | "Proforma Invoice" | "Order Confirmation" | "Warranty Card";

export interface AppUser {
  id: string;
  name: string;
  username: string;
  role: Role;
  initials: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  gst: string;
  remarks: string;
  createdAt: string;
}

export interface Product {
  id: string;
  family: string;
  name: string;
  capacity: string;
  variant: string;
  temperature: string;
  powerSupply: string;
  powerConsumption: string;
  bodyMaterial: string;
  dimensions: string;
  weight: string;
  warranty: string;
  deliveryTime: string;
  priceWithoutGst: number;
  priceWithGst: number;
  description: string;
  image: string;
  brochure: string;
  specificationPdf: string;
  status: "Active" | "Draft" | "Archived";
}

export interface Accessory {
  id: string;
  name: string;
  price: number;
  unit: string;
  status: "Active" | "Inactive";
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  type: "product" | "accessory";
}

export interface SalesDocument {
  id: string;
  kind: DocumentKind;
  number: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  amount: number;
  status: "Draft" | "Sent" | "Accepted" | "Paid" | "Confirmed" | "Active";
  createdAt: string;
  validUntil?: string;
  deliveryDate?: string;
  serialNumber?: string;
  notes?: string;
  lineItems: LineItem[];
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  address: string[];
  mobile: string[];
  email: string;
  website: string;
  gstRate: number;
  warranty: string;
  delivery: string;
  validityDays: number;
  paymentTerms: string;
  bank: {
    name: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
  };
}
