"use client";

import {
  Bell,
  Boxes,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  FileBadge,
  FileCheck2,
  FilePlus2,
  FileText,
  Gauge,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PackageCheck,
  Pencil,
  Plus,
  ReceiptIndianRupee,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  UserPlus,
  Users,
  Wrench,
  X
} from "lucide-react";
import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { ACCESSORIES, COMPANY, CUSTOMERS, DEMO_USERS, DOCUMENTS, PRODUCTS, ROLE_ACCESS } from "@/lib/data";
import { downloadDocument, DocumentPayload, previewDocument, shareDocument } from "@/lib/pdf";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { uploadProductAsset } from "@/lib/storage";
import { Accessory, AppUser, Customer, DocumentKind, Product, SalesDocument, View } from "@/lib/types";

const NAV_ITEMS = [
  { id: "dashboard" as View, label: "Command Center", icon: LayoutDashboard },
  { id: "customers" as View, label: "Customers", icon: Users },
  { id: "products" as View, label: "Product Master", icon: Boxes },
  { id: "accessories" as View, label: "Accessories", icon: Wrench },
  { id: "quotations" as View, label: "Quotation Studio", icon: FilePlus2 },
  { id: "orders" as View, label: "Orders", icon: PackageCheck },
  { id: "documents" as View, label: "Documents", icon: FileText },
  { id: "users" as View, label: "Users & Roles", icon: ShieldCheck },
  { id: "settings" as View, label: "Master Settings", icon: Settings }
];

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const today = (() => {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
})();

const newProduct = (): Product => ({
  id: `SKM-NXN-${Date.now().toString().slice(-5)}`,
  family: "NEXON Gold Melting Furnace",
  name: "New NEXON Machine",
  capacity: "1KG",
  variant: "Economic",
  temperature: "Up to 1150°C",
  powerSupply: "Single Phase",
  powerConsumption: "3 KW (Approx.)",
  bodyMaterial: "Stainless Steel",
  dimensions: "To be confirmed",
  weight: "To be confirmed",
  warranty: COMPANY.warranty,
  deliveryTime: COMPANY.delivery,
  priceWithoutGst: 0,
  priceWithGst: 0,
  description: "Approved product description pending.",
  image: "/assets/nexon-1kg.png",
  brochure: "/assets/nexon-1kg.png",
  specificationPdf: "/assets/shree-kali-manufacturers-brochure.pdf",
  status: "Draft"
});

const newAccessory = (): Accessory => ({ id: `ACC-${String(Date.now()).slice(-4)}`, name: "New Accessory", price: 0, unit: "Nos.", status: "Active" });

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) setValue(JSON.parse(stored));
  }, [key]);
  useEffect(() => window.localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}

function LoginScreen({ onLogin }: { onLogin: (user: AppUser) => void }) {
  const [username, setUsername] = useState("ashish");
  const [password, setPassword] = useState("SHREEKALI@100CR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email: `${username.toLowerCase()}@skm.internal`, password });
        if (authError) throw authError;
        const { data: profile } = await supabase.from("profiles").select("id, full_name, username, role").eq("id", data.user.id).single();
        if (!profile) throw new Error("User profile is not configured.");
        onLogin({ id: profile.id, name: profile.full_name, username: profile.username, role: profile.role, initials: profile.full_name.split(" ").map((part: string) => part[0]).join("") });
      } else {
        const response = await fetch("/api/demo-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Login service is temporarily unavailable. Please refresh and try again.");
        }
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        onLogin(result.user);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-brand">
          <Image src="/assets/shree-kali-logo.png" alt="Shree Kali Manufacturers" width={86} height={86} priority />
          <div><strong>SHREE KALI</strong><span>MANUFACTURERS</span></div>
        </div>
        <div className="login-machine">
          <Image src="/assets/machine-cutout.webp" alt="NEXON industrial gold melting machine" fill sizes="50vw" priority />
        </div>
        <div className="login-message">
          <span>SALES OPERATIONS SYSTEM</span>
          <h1>Built for every enquiry, quote and machine order.</h1>
          <p>Technology That Melts Perfection</p>
        </div>
        <div className="login-trust"><span><ShieldCheck size={17} /> Controlled access</span><span><FileCheck2 size={17} /> Fixed document templates</span><span><Gauge size={17} /> Live sales visibility</span></div>
      </section>
      <section className="login-form-side">
        <form className="login-form" onSubmit={submit}>
          <div className="mobile-login-brand"><Image src="/assets/shree-kali-logo.png" alt="" width={56} height={56} /><strong>SHREE KALI<br /><span>MANUFACTURERS</span></strong></div>
          <div className="login-kicker"><span /><b>AUTHORIZED ACCESS</b></div>
          <h2>Welcome to Sales OS</h2>
          <p>Use your assigned company credentials to continue.</p>
          <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-action login-submit" disabled={loading}>{loading ? "Verifying access..." : "Sign in securely"}<ChevronRight size={18} /></button>
          <div className="login-support"><ShieldCheck size={16} /><span><b>{isSupabaseConfigured ? "Supabase secured" : "Local demonstration"}</b><small>Role-based access and protected sessions</small></span></div>
        </form>
        <footer>© 2026 Shree Kali Manufacturers · Navsari, Gujarat</footer>
      </section>
    </main>
  );
}

function Modal({ title, subtitle, onClose, children, wide = false }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return <div className="modal-layer" role="dialog" aria-modal="true"><div className={`modal ${wide ? "wide" : ""}`}><div className="modal-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><div className="modal-body">{children}</div></div></div>;
}

function PageHead({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{actions && <div className="page-actions">{actions}</div>}</div>;
}

function Status({ value }: { value: string }) {
  return <span className={`status status-${value.toLowerCase().replaceAll(" ", "-")}`}><i />{value}</span>;
}

function Empty({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return <div className="empty-state">{icon}<strong>{title}</strong><p>{detail}</p></div>;
}

export default function SalesOS() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [customers, setCustomers] = useStoredState("skm_customers", CUSTOMERS);
  const [products, setProducts] = useStoredState("skm_products", PRODUCTS);
  const [accessories, setAccessories] = useStoredState("skm_accessories", ACCESSORIES);
  const [documents, setDocuments] = useStoredState("skm_documents", DOCUMENTS);
  const [teamUsers, setTeamUsers] = useStoredState("skm_users", DEMO_USERS);
  const [customerModal, setCustomerModal] = useState(false);
  const [productModal, setProductModal] = useState<Product | null>(null);
  const [accessoryModal, setAccessoryModal] = useState<Accessory | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<Customer | null>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("skm_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function login(nextUser: AppUser) {
    setUser(nextUser);
    window.sessionStorage.setItem("skm_user", JSON.stringify(nextUser));
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    else await fetch("/api/demo-auth", { method: "DELETE" });
    window.sessionStorage.removeItem("skm_user");
    setUser(null);
    setView("dashboard");
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  if (!user) return <LoginScreen onLogin={login} />;
  const role = user.role;
  const access = ROLE_ACCESS[role];
  const canManage = role === "Admin";
  const readOnly = role === "Owner";

  function navigate(nextView: View) {
    if (!access.includes(nextView)) {
      notify(`${role} access does not include this module.`);
      return;
    }
    setView(nextView);
    setSidebarOpen(false);
    setSearch("");
  }

  const heading = NAV_ITEMS.find((item) => item.id === view)?.label || "Sales OS";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand-lockup"><Image src="/assets/shree-kali-logo.png" width={46} height={46} alt="Shree Kali Manufacturers" /><span><strong>SHREE KALI</strong><small>MANUFACTURERS</small><em>Sales OS</em></span><button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={19} /></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>{NAV_ITEMS.map((item) => { const Icon = item.icon; const allowed = access.includes(item.id); return <button key={item.id} className={`${view === item.id ? "active" : ""} ${!allowed ? "locked" : ""}`} onClick={() => navigate(item.id)} title={!allowed ? `Not available to ${user.role}` : item.label}><Icon size={18} /><span>{item.label}</span>{view === item.id && <ChevronRight size={15} className="nav-chevron" />}</button>; })}</nav>
        <div className="sidebar-signal"><div><span className="signal-dot" /><b>Systems operational</b></div><small>{isSupabaseConfigured ? "Cloud database connected" : "Demo data mode"}</small></div>
        <button className="sidebar-user" onClick={logout}><span className="avatar">{user.initials}</span><span><strong>{user.name}</strong><small>{user.role}</small></span><LogOut size={17} /></button>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button><div><span>SALES OPERATIONS</span><h2>{heading}</h2></div></div>
          <div className="global-search"><Search size={18} /><input placeholder="Search current workspace..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></div>
          <div className="topbar-actions"><button className="icon-button notification" title="Notifications"><Bell size={19} /><i /></button><div className="user-summary"><span className="avatar">{user.initials}</span><span><strong>{user.name}</strong><small>{user.role}</small></span><ChevronDown size={15} /></div></div>
        </header>
        <div className="workspace">
          {view === "dashboard" && <Dashboard customers={customers} documents={documents} onNavigate={navigate} user={user} />}
          {view === "customers" && <CustomersView customers={customers} documents={documents} search={search} readOnly={readOnly} onAdd={() => setCustomerModal(true)} onOpen={setCustomerDetail} />}
          {view === "products" && <ProductsView products={products} search={search} canManage={canManage} onEdit={setProductModal} onAdd={() => setProductModal(newProduct())} />}
          {view === "accessories" && <AccessoriesView accessories={accessories} search={search} canManage={canManage} onEdit={setAccessoryModal} onAdd={() => setAccessoryModal(newAccessory())} notify={notify} />}
          {view === "quotations" && <QuotationStudio customers={customers} products={products} accessories={accessories} documents={documents} setDocuments={setDocuments} readOnly={readOnly} notify={notify} />}
          {view === "orders" && <OrdersView documents={documents} search={search} onCreate={() => navigate("quotations")} readOnly={readOnly} />}
          {view === "documents" && <DocumentsView documents={documents} search={search} onCreate={() => navigate("quotations")} />}
          {view === "users" && <UsersView users={teamUsers} onAdd={() => setUserModal(true)} />}
          {view === "settings" && <SettingsView />}
        </div>
      </main>

      {customerModal && <CustomerForm customers={customers} onClose={() => setCustomerModal(false)} onSave={(customer) => { setCustomers([customer, ...customers]); setCustomerModal(false); notify(`${customer.company || customer.name} added to customer master.`); }} />}
      {customerDetail && <CustomerDetail customer={customerDetail} documents={documents.filter((doc) => doc.customerId === customerDetail.id)} onClose={() => setCustomerDetail(null)} />}
      {productModal && <ProductForm product={productModal} onClose={() => setProductModal(null)} onSave={(product) => { setProducts(products.some((item) => item.id === product.id) ? products.map((item) => item.id === product.id ? product : item) : [product, ...products]); setProductModal(null); notify(`${product.name} master saved.`); }} />}
      {accessoryModal && <AccessoryForm accessory={accessoryModal} onClose={() => setAccessoryModal(null)} onSave={(accessory) => { setAccessories(accessories.some((item) => item.id === accessory.id) ? accessories.map((item) => item.id === accessory.id ? accessory : item) : [accessory, ...accessories]); setAccessoryModal(null); notify(`${accessory.name} pricing saved.`); }} />}
      {userModal && <UserForm users={teamUsers} onClose={() => setUserModal(false)} onSave={(nextUser) => { setTeamUsers([...teamUsers, nextUser]); setUserModal(false); notify(`${nextUser.name} added as ${nextUser.role}.`); }} />}
      {toast && <div className="toast"><Check size={18} />{toast}</div>}
    </div>
  );
}

function Dashboard({ customers, documents, onNavigate, user }: { customers: Customer[]; documents: SalesDocument[]; onNavigate: (view: View) => void; user: AppUser }) {
  const quotes = documents.filter((doc) => doc.kind === "Quotation");
  const orders = documents.filter((doc) => doc.kind === "Order Confirmation");
  const accepted = quotes.filter((doc) => doc.status === "Accepted").length;
  const revenue = orders.reduce((sum, doc) => sum + doc.amount, 0);
  const conversion = quotes.length ? Math.round((accepted / quotes.length) * 100) : 0;
  return <>
    <PageHead eyebrow="Thursday · 19 June 2026" title={`Welcome, ${user.name.split(" ")[0]}`} description="Here is the current commercial picture across enquiries, quotations and machine orders." actions={<><span className="role-chip"><ShieldCheck size={15} />{user.role}</span><button className="primary-action" onClick={() => onNavigate("quotations")}><Plus size={17} />New quotation</button></>} />
    <div className="kpi-grid">
      <Kpi label="Total Customers" value={String(customers.length)} note="+2 this month" icon={<Users />} tone="navy" onClick={() => onNavigate("customers")} />
      <Kpi label="Total Quotations" value={String(quotes.length)} note="2 awaiting response" icon={<FileText />} tone="gold" onClick={() => onNavigate("quotations")} />
      <Kpi label="Confirmed Orders" value={String(orders.length)} note="1 in production" icon={<PackageCheck />} tone="green" onClick={() => onNavigate("orders")} />
      <Kpi label="Conversion Rate" value={`${conversion}%`} note="Accepted quotations" icon={<Gauge />} tone="blue" />
      <Kpi label="Order Revenue" value={money(revenue)} note="Confirmed value" icon={<IndianRupee />} tone="red" />
    </div>
    <div className="dashboard-grid">
      <section className="panel revenue-panel"><div className="panel-head"><div><span className="panel-kicker">SALES VALUE</span><h3>Commercial pipeline</h3></div><select><option>Last 6 months</option></select></div><div className="chart-wrap"><div className="chart-scale"><span>₹4L</span><span>₹3L</span><span>₹2L</span><span>₹1L</span><span>₹0</span></div><div className="bar-chart">{[38, 54, 46, 71, 62, 88].map((height, index) => <div className="bar-column" key={index}><div className="bar-value" style={{ height: `${height}%` }}><span>{index === 5 ? "₹3.5L" : ""}</span></div><small>{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}</small></div>)}</div></div><div className="chart-legend"><span><i className="gold" /> Quotation value</span><b>+18.4% <small>vs previous period</small></b></div></section>
      <section className="panel quick-panel"><div className="panel-head"><div><span className="panel-kicker">SHORTCUTS</span><h3>Quick actions</h3></div></div><button onClick={() => onNavigate("customers")}><span><UserPlus /></span><div><strong>Create customer</strong><small>Add an enquiry or buyer</small></div><ChevronRight /></button><button onClick={() => onNavigate("quotations")}><span><FilePlus2 /></span><div><strong>Generate quotation</strong><small>Use the fixed master template</small></div><ChevronRight /></button><button onClick={() => onNavigate("quotations")}><span><ReceiptIndianRupee /></span><div><strong>Generate invoice</strong><small>Create proforma from customer data</small></div><ChevronRight /></button><button onClick={() => onNavigate("documents")}><span><FileBadge /></span><div><strong>Document register</strong><small>Open all generated PDFs</small></div><ChevronRight /></button></section>
    </div>
    <div className="dashboard-lower">
      <section className="panel"><div className="panel-head"><div><span className="panel-kicker">LATEST ACTIVITY</span><h3>Recent quotations</h3></div><button className="text-button" onClick={() => onNavigate("documents")}>View register <ChevronRight size={15} /></button></div><DocumentTable documents={documents.slice(0, 5)} compact /></section>
      <section className="panel followups"><div className="panel-head"><div><span className="panel-kicker">FOLLOW-UP QUEUE</span><h3>Today&apos;s priorities</h3></div><span className="count-badge">3</span></div><Followup time="10:30" company="Rajeshwar Goldsmiths" note="Quotation response" tone="gold" /><Followup time="14:00" company="Soni Jewels" note="3KG machine demo" tone="blue" /><Followup time="16:30" company="Kuber Refinery" note="Confirm delivery window" tone="green" /></section>
    </div>
  </>;
}

function Kpi({ label, value, note, icon, tone, onClick }: { label: string; value: string; note: string; icon: ReactNode; tone: string; onClick?: () => void }) {
  return <button className="kpi" onClick={onClick}><span className={`kpi-icon ${tone}`}>{icon}</span><div><small>{label}</small><strong>{value}</strong><em>{note}</em></div><ChevronRight size={16} /></button>;
}

function Followup({ time, company, note, tone }: { time: string; company: string; note: string; tone: string }) {
  return <div className="followup"><span className={`followup-mark ${tone}`} /><time>{time}</time><div><strong>{company}</strong><small>{note}</small></div><button className="icon-button"><MoreHorizontal size={17} /></button></div>;
}

function CustomersView({ customers, documents, search, readOnly, onAdd, onOpen }: { customers: Customer[]; documents: SalesDocument[]; search: string; readOnly: boolean; onAdd: () => void; onOpen: (customer: Customer) => void }) {
  const filtered = customers.filter((customer) => [customer.name, customer.company, customer.mobile, customer.city].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <>
    <PageHead eyebrow="CUSTOMER RELATIONSHIP MASTER" title="Customers" description="Search buyer records, open transaction history, or start a new enquiry." actions={!readOnly && <button className="primary-action" onClick={onAdd}><UserPlus size={17} />Create customer</button>} />
    <section className="panel table-panel"><div className="list-toolbar"><div className="inline-search"><Search size={17} /><span>{search ? `Matching “${search}”` : "All active customer records"}</span></div><div className="toolbar-stats"><span><b>{customers.length}</b> Total</span><span><b>{new Set(customers.map((item) => item.city)).size}</b> Cities</span></div></div><div className="table-scroll"><table><thead><tr><th>Customer ID</th><th>Customer / Company</th><th>Contact</th><th>Location</th><th>GST</th><th>History</th><th /></tr></thead><tbody>{filtered.map((customer) => { const count = documents.filter((doc) => doc.customerId === customer.id).length; return <tr key={customer.id} onClick={() => onOpen(customer)}><td><code>{customer.id}</code></td><td><span className="table-identity"><span className="avatar pale">{customer.name.split(" ").map((part) => part[0]).join("")}</span><span><strong>{customer.company || customer.name}</strong><small>{customer.name}</small></span></span></td><td><strong>{customer.mobile}</strong><small>{customer.email}</small></td><td><strong>{customer.city}</strong><small>{customer.state}</small></td><td>{customer.gst || "Unregistered"}</td><td><span className="history-count">{count} docs</span></td><td><button className="icon-button"><ChevronRight size={17} /></button></td></tr>; })}</tbody></table></div>{!filtered.length && <Empty icon={<Users />} title="No matching customers" detail="Try a company name, mobile number, or city." />}</section>
  </>;
}

function CustomerForm({ customers, onClose, onSave }: { customers: Customer[]; onClose: () => void; onSave: (customer: Customer) => void }) {
  const [form, setForm] = useState<Omit<Customer, "id" | "createdAt">>({ name: "", company: "", mobile: "", email: "", address: "", city: "", state: "Gujarat", gst: "", remarks: "" });
  function update(key: keyof typeof form, value: string) { setForm({ ...form, [key]: value }); }
  return <Modal title="Create customer" subtitle="This record will be reusable across every sales document." onClose={onClose} wide><form className="record-form" onSubmit={(event) => { event.preventDefault(); onSave({ ...form, id: `CUS-${String(customers.length + 1).padStart(4, "0")}`, createdAt: today }); }}><div className="form-section"><h3>Primary details</h3><div className="form-grid"><label>Customer name<input value={form.name} onChange={(event) => update("name", event.target.value)} required /></label><label>Company name<input value={form.company} onChange={(event) => update("company", event.target.value)} /></label><label>Mobile number<input value={form.mobile} onChange={(event) => update("mobile", event.target.value)} inputMode="tel" required /></label><label>Email address<input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} /></label></div></div><div className="form-section"><h3>Billing address</h3><div className="form-grid"><label className="span-2">Address<textarea value={form.address} onChange={(event) => update("address", event.target.value)} required /></label><label>City<input value={form.city} onChange={(event) => update("city", event.target.value)} required /></label><label>State<input value={form.state} onChange={(event) => update("state", event.target.value)} required /></label><label>GST number<input value={form.gst} onChange={(event) => update("gst", event.target.value.toUpperCase())} /></label><label>Remarks<input value={form.remarks} onChange={(event) => update("remarks", event.target.value)} /></label></div></div><div className="modal-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancel</button><button className="primary-action"><Check size={17} />Save customer</button></div></form></Modal>;
}

function CustomerDetail({ customer, documents, onClose }: { customer: Customer; documents: SalesDocument[]; onClose: () => void }) {
  return <Modal title={customer.company || customer.name} subtitle={`${customer.id} · Created ${customer.createdAt}`} onClose={onClose} wide><div className="customer-summary"><span className="avatar large">{customer.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{customer.name}</strong><p>{customer.mobile} · {customer.email}</p><p>{customer.address}, {customer.city}, {customer.state}</p></div><Status value="Active" /></div><div className="detail-grid"><div><span>GST Number</span><strong>{customer.gst || "Unregistered"}</strong></div><div><span>Remarks</span><strong>{customer.remarks || "No remarks"}</strong></div></div><div className="section-heading"><div><span className="panel-kicker">CUSTOMER HISTORY</span><h3>Quotations, orders and invoices</h3></div></div>{documents.length ? <DocumentTable documents={documents} /> : <Empty icon={<FileText />} title="No document history" detail="The customer is ready for their first quotation." />}</Modal>;
}

function ProductsView({ products, search, canManage, onEdit, onAdd }: { products: Product[]; search: string; canManage: boolean; onEdit: (product: Product) => void; onAdd: () => void }) {
  const filtered = products.filter((product) => [product.name, product.capacity, product.variant, product.id].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <><PageHead eyebrow="APPROVED PRODUCT DATABASE" title="Product Master" description="Specifications, pricing and brochure mapping used by every generated document." actions={canManage && <><span className="master-lock"><ShieldCheck size={15} />Admin controlled</span><button className="primary-action" onClick={onAdd}><Plus size={16} />Add product</button></>} /><div className="product-master-grid">{filtered.map((product) => <article className="product-master-card" key={product.id}><div className="product-image"><Image src={product.image} alt={product.name} fill sizes="260px" /></div><div className="product-card-body"><div className="product-title-row"><span>{product.capacity}</span><Status value={product.status} /></div><h3>{product.name}</h3><p>{product.description}</p><div className="product-spec-line"><span><small>Variant</small><b>{product.variant}</b></span><span><small>Power</small><b>{product.powerConsumption}</b></span></div><div className="product-price"><span><small>Price without GST</small><strong>{money(product.priceWithoutGst)}</strong></span><span><small>With 18% GST</small><strong>{money(product.priceWithGst)}</strong></span></div><div className="product-card-actions"><button className="secondary-action" onClick={() => onEdit(product)}><Eye size={16} />Specifications</button>{canManage && <button className="icon-button" onClick={() => onEdit(product)} title="Edit product"><Pencil size={16} /></button>}</div></div></article>)}</div></>;
}

function ProductForm({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (product: Product) => void }) {
  const [form, setForm] = useState(product);
  const [uploading, setUploading] = useState("");
  function set<K extends keyof Product>(key: K, value: Product[K]) { setForm({ ...form, [key]: value }); }
  async function upload(kind: "main" | "brochure" | "specification", file?: File) { if (!file) return; setUploading(kind); try { const url = await uploadProductAsset(file, product.id, kind); set(kind === "main" ? "image" : kind === "brochure" ? "brochure" : "specificationPdf", url); } finally { setUploading(""); } }
  return <Modal title="Edit product master" subtitle={`${product.id} · Changes affect future documents only.`} onClose={onClose} wide><form className="record-form" onSubmit={(event) => { event.preventDefault(); onSave({ ...form, priceWithGst: Math.round(form.priceWithoutGst * 1.18) }); }}><div className="form-section"><h3>Commercial identity</h3><div className="form-grid"><label>Product name<input value={form.name} onChange={(event) => set("name", event.target.value)} /></label><label>Product family<input value={form.family} onChange={(event) => set("family", event.target.value)} /></label><label>Capacity<input value={form.capacity} onChange={(event) => set("capacity", event.target.value)} /></label><label>Variant<input value={form.variant} onChange={(event) => set("variant", event.target.value)} /></label><label>Price without GST<input type="number" value={form.priceWithoutGst} onChange={(event) => set("priceWithoutGst", Number(event.target.value))} /></label><label>Calculated price with GST<input value={money(Math.round(form.priceWithoutGst * 1.18))} disabled /></label></div></div><div className="form-section"><h3>Technical specification</h3><div className="form-grid"><label>Temperature<input value={form.temperature} onChange={(event) => set("temperature", event.target.value)} /></label><label>Power supply<input value={form.powerSupply} onChange={(event) => set("powerSupply", event.target.value)} /></label><label>Power consumption<input value={form.powerConsumption} onChange={(event) => set("powerConsumption", event.target.value)} /></label><label>Body material<input value={form.bodyMaterial} onChange={(event) => set("bodyMaterial", event.target.value)} /></label><label>Dimensions<input value={form.dimensions} onChange={(event) => set("dimensions", event.target.value)} /></label><label>Weight<input value={form.weight} onChange={(event) => set("weight", event.target.value)} /></label><label>Warranty<input value={form.warranty} onChange={(event) => set("warranty", event.target.value)} /></label><label>Delivery time<input value={form.deliveryTime} onChange={(event) => set("deliveryTime", event.target.value)} /></label><label className="span-2">Description<textarea value={form.description} onChange={(event) => set("description", event.target.value)} /></label></div></div><div className="form-section"><h3>Approved assets</h3><div className="asset-upload-grid"><label><Image src={form.image} alt="" width={64} height={64} /><span><b>Main product image</b><small>{uploading === "main" ? "Uploading..." : "PNG, JPG or WEBP"}</small></span><Upload size={17} /><input type="file" accept="image/*" onChange={(event) => upload("main", event.target.files?.[0])} /></label><label><FileBadge size={27} /><span><b>Brochure image</b><small>{uploading === "brochure" ? "Uploading..." : "Full-page artwork"}</small></span><Upload size={17} /><input type="file" accept="image/*" onChange={(event) => upload("brochure", event.target.files?.[0])} /></label><label><FileText size={27} /><span><b>Specification PDF</b><small>{uploading === "specification" ? "Uploading..." : "Technical reference"}</small></span><Upload size={17} /><input type="file" accept="application/pdf" onChange={(event) => upload("specification", event.target.files?.[0])} /></label></div></div><div className="modal-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancel</button><button className="primary-action"><Check size={17} />Update product</button></div></form></Modal>;
}

function AccessoriesView({ accessories, search, canManage, onEdit, onAdd, notify }: { accessories: Accessory[]; search: string; canManage: boolean; onEdit: (accessory: Accessory) => void; onAdd: () => void; notify: (message: string) => void }) {
  const filtered = accessories.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  return <><PageHead eyebrow="CONFIGURABLE ADD-ONS" title="Accessory Master" description="Approved accessories and prices available to the smart quotation engine." actions={canManage && <><label className="secondary-action file-action"><Upload size={16} />Upload kit image<input type="file" accept="image/*" onChange={(event) => { if (event.target.files?.[0]) notify(`Accessory kit image ${event.target.files[0].name} selected for upload.`); }} /></label><button className="primary-action" onClick={onAdd}><Plus size={16} />Add accessory</button></>} /><section className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Accessory ID</th><th>Accessory</th><th>Unit</th><th>Price</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><code>{item.id}</code></td><td><span className="table-identity"><span className="square-icon"><Wrench size={18} /></span><strong>{item.name}</strong></span></td><td>{item.unit}</td><td><strong>{money(item.price)}</strong></td><td><Status value={item.status} /></td><td>{canManage && <button className="icon-button" onClick={() => onEdit(item)}><Pencil size={16} /></button>}</td></tr>)}</tbody></table></div></section></>;
}

function AccessoryForm({ accessory, onClose, onSave }: { accessory: Accessory; onClose: () => void; onSave: (accessory: Accessory) => void }) {
  const [form, setForm] = useState(accessory);
  return <Modal title="Edit accessory" subtitle={accessory.id} onClose={onClose}><form className="record-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}><div className="form-grid single"><label>Accessory name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Unit<input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} /></label><label>Unit price<input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} /></label><label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Accessory["status"] })}><option>Active</option><option>Inactive</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancel</button><button className="primary-action">Save accessory</button></div></form></Modal>;
}

function QuotationStudio({ customers, products, accessories, documents, setDocuments, readOnly, notify }: { customers: Customer[]; products: Product[]; accessories: Accessory[]; documents: SalesDocument[]; setDocuments: (docs: SalesDocument[]) => void; readOnly: boolean; notify: (message: string) => void }) {
  const [kind, setKind] = useState<DocumentKind>("Quotation");
  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [busy, setBusy] = useState("");
  const customer = customers.find((item) => item.id === customerId) || customers[0];
  const product = products.find((item) => item.id === productId) || products[0];
  const selectedAccessories = accessories.filter((item) => selected.includes(item.id));
  const prefix: Record<DocumentKind, string> = { "Quotation": "SKM/26-27", "Proforma Invoice": "PI/26-27", "Order Confirmation": "OC/26-27", "Warranty Card": "WC/26-27" };
  const nextSequence = (documentKind: DocumentKind) => Math.max(0, ...documents.filter((doc) => doc.kind === documentKind).map((doc) => Number(doc.number.split("/").at(-1)) || 0)) + 1;
  const number = `${prefix[kind]}/${String(nextSequence(kind)).padStart(4, "0")}`;
  const subtotal = product.priceWithoutGst + selectedAccessories.reduce((sum, item) => sum + item.price * (quantities[item.id] || 1), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;
  const payload: DocumentPayload = { kind, number, date: today, customer, product, accessories: selectedAccessories, quantities, notes, serialNumber, purchaseDate: today, deliveryDate };

  async function run(action: "preview" | "download" | "share") {
    if (!customer || !product) return;
    setBusy(action);
    try {
      if (action === "preview") await previewDocument(payload);
      if (action === "download") await downloadDocument(payload);
      if (action === "share") { const result = await shareDocument(payload); notify(result === "shared" ? "Document shared from your device." : "PDF downloaded and WhatsApp opened."); }
    } catch (error) { notify(error instanceof Error ? error.message : "Document generation failed."); }
    finally { setBusy(""); }
  }

  function save(oneKind = kind) {
    const nextNumber = oneKind === kind ? number : `${prefix[oneKind]}/${String(nextSequence(oneKind)).padStart(4, "0")}`;
    const record: SalesDocument = { id: crypto.randomUUID(), kind: oneKind, number: nextNumber, customerId: customer.id, customerName: customer.company || customer.name, productId: product.id, productName: product.name, amount: Math.round(total), status: oneKind === "Order Confirmation" ? "Confirmed" : oneKind === "Warranty Card" ? "Active" : "Draft", createdAt: today, deliveryDate, serialNumber, notes, lineItems: [{ id: product.id, description: product.name, quantity: 1, unit: "Nos.", unitPrice: product.priceWithoutGst, type: "product" }, ...selectedAccessories.map((item) => ({ id: item.id, description: item.name, quantity: quantities[item.id] || 1, unit: item.unit, unitPrice: item.price, type: "accessory" as const }))] };
    return record;
  }

  function saveRecord() { const record = save(); setDocuments([record, ...documents]); notify(`${kind} ${record.number} saved to the document register.`); }
  function createSuite() { const suite: DocumentKind[] = ["Quotation", "Proforma Invoice", "Order Confirmation", "Warranty Card"]; const records = suite.map(save); setDocuments([...records, ...documents]); notify("Customer document suite created from one entry."); }

  return <><PageHead eyebrow="FIXED MASTER TEMPLATE ENGINE" title="Quotation Studio" description="Select customer, machine and accessories. Branding, terms, bank details and GST remain controlled." actions={<span className="master-lock"><ShieldCheck size={15} />Template locked</span>} />
    <div className="studio-layout"><section className="panel studio-form"><div className="document-tabs">{(["Quotation", "Proforma Invoice", "Order Confirmation", "Warranty Card"] as DocumentKind[]).map((item) => <button key={item} className={kind === item ? "active" : ""} onClick={() => setKind(item)}>{item}</button>)}</div><div className="studio-step"><span>01</span><div><h3>Select customer</h3><p>Existing data auto-fills every customer field.</p></div></div><label className="select-label">Customer<select value={customerId} onChange={(event) => setCustomerId(event.target.value)}>{customers.map((item) => <option value={item.id} key={item.id}>{item.company || item.name} · {item.mobile}</option>)}</select></label>{customer && <div className="autofill-card"><span className="avatar pale">{customer.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{customer.company || customer.name}</strong><small>{customer.address}, {customer.city}, {customer.state}</small><small>{customer.mobile} · {customer.gst || "GST unregistered"}</small></div><Check size={17} /></div>}<div className="studio-step"><span>02</span><div><h3>Select machine</h3><p>Specifications, image and brochure map automatically.</p></div></div><label className="select-label">Product / Variant<select value={productId} onChange={(event) => setProductId(event.target.value)}>{products.map((item) => <option value={item.id} key={item.id}>{item.capacity} · {item.variant} · {money(item.priceWithoutGst)}</option>)}</select></label><div className="selected-product"><Image src={product.image} alt="" width={92} height={108} /><div><span>{product.id}</span><strong>{product.name}</strong><small>{product.temperature} · {product.powerConsumption}</small><small>{product.warranty} warranty · {product.deliveryTime}</small></div><b>{money(product.priceWithoutGst)}</b></div><div className="studio-step"><span>03</span><div><h3>Add accessories</h3><p>Optional items appear on the quotation and accessory page.</p></div></div><div className="accessory-picker">{accessories.map((item) => <label key={item.id} className={selected.includes(item.id) ? "selected" : ""}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected(selected.includes(item.id) ? selected.filter((id) => id !== item.id) : [...selected, item.id])} /><span><strong>{item.name}</strong><small>{money(item.price)} / {item.unit}</small></span>{selected.includes(item.id) && <input className="qty-input" type="number" min="1" value={quantities[item.id] || 1} onClick={(event) => event.stopPropagation()} onChange={(event) => setQuantities({ ...quantities, [item.id]: Math.max(1, Number(event.target.value)) })} />}</label>)}</div>{kind === "Warranty Card" && <div className="studio-extra"><label>Serial number<input value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} placeholder="e.g. SKM-NXN-260412" /></label></div>}{kind === "Order Confirmation" && <div className="studio-extra"><label>Expected delivery date<input type="date" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} /></label></div>}<label className="notes-field">Special notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional transaction-specific note" /></label></section>
      <aside className="panel document-summary"><div className="summary-head"><span><Sparkles size={15} />LIVE DOCUMENT</span><Status value="Draft" /></div><div className="summary-company"><Image src="/assets/shree-kali-logo.png" width={42} height={42} alt="" /><div><strong>SHREE KALI</strong><small>MANUFACTURERS</small></div></div><div className="summary-title"><span>{kind}</span><strong>{number}</strong><small>{new Date(today).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</small></div><div className="summary-block"><small>BILL TO</small><strong>{customer.company || customer.name}</strong><span>{customer.city}, {customer.state} · {customer.mobile}</span></div><div className="summary-machine"><small>MACHINE</small><strong>{product.name}</strong><span>{product.capacity} · {product.variant}</span></div>{selectedAccessories.length > 0 && <div className="summary-accessories"><small>ACCESSORIES ({selectedAccessories.length})</small>{selectedAccessories.map((item) => <span key={item.id}>{quantities[item.id] || 1} × {item.name}<b>{money(item.price * (quantities[item.id] || 1))}</b></span>)}</div>}<div className="summary-totals"><span>Subtotal <b>{money(subtotal)}</b></span><span>GST @ 18% <b>{money(gst)}</b></span><strong>Grand total <b>{money(total)}</b></strong></div><div className="autofill-list"><span><Check />Company & bank details</span><span><Check />Approved terms & warranty</span><span><Check />Product specifications</span><span><Check />Mapped brochure page</span></div><div className="document-actions"><button className="secondary-action" onClick={() => run("preview")} disabled={Boolean(busy)}><Eye size={16} />{busy === "preview" ? "Building..." : "Preview PDF"}</button><button className="secondary-action" onClick={() => run("download")} disabled={Boolean(busy)}><Download size={16} />Download</button><button className="whatsapp-action" onClick={() => run("share")} disabled={Boolean(busy)}><MessageCircle size={17} />WhatsApp</button></div>{!readOnly && <><button className="primary-action full" onClick={saveRecord}><FileCheck2 size={17} />Save {kind}</button><button className="suite-action" onClick={createSuite}><Sparkles size={16} />Generate complete document suite</button></>}</aside>
    </div></>;
}

function OrdersView({ documents, search, onCreate, readOnly }: { documents: SalesDocument[]; search: string; onCreate: () => void; readOnly: boolean }) {
  const orders = documents.filter((doc) => doc.kind === "Order Confirmation" && [doc.customerName, doc.number, doc.productName].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <><PageHead eyebrow="ORDER EXECUTION" title="Orders" description="Confirmed machine orders, delivery commitments and commercial values." actions={!readOnly && <button className="primary-action" onClick={onCreate}><Plus size={17} />Create confirmation</button>} /><div className="order-summary"><span><PackageCheck /><div><small>Active orders</small><strong>{orders.length}</strong></div></span><span><Clock3 /><div><small>Due this month</small><strong>{orders.filter((order) => order.deliveryDate).length}</strong></div></span><span><CircleDollarSign /><div><small>Confirmed value</small><strong>{money(orders.reduce((sum, order) => sum + order.amount, 0))}</strong></div></span></div><section className="panel table-panel"><DocumentTable documents={orders} /></section></>;
}

function DocumentsView({ documents, search, onCreate }: { documents: SalesDocument[]; search: string; onCreate: () => void }) {
  const filtered = documents.filter((doc) => [doc.kind, doc.number, doc.customerName, doc.productName].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <><PageHead eyebrow="CONTROLLED DOCUMENT REGISTER" title="Documents" description="A single register for quotations, proforma invoices, orders and warranty cards." actions={<button className="primary-action" onClick={onCreate}><FilePlus2 size={17} />New document</button>} /><div className="document-type-grid"><DocType icon={<FileText />} label="Quotations" count={documents.filter((item) => item.kind === "Quotation").length} /><DocType icon={<ReceiptIndianRupee />} label="Proforma invoices" count={documents.filter((item) => item.kind === "Proforma Invoice").length} /><DocType icon={<ClipboardCheck />} label="Order confirmations" count={documents.filter((item) => item.kind === "Order Confirmation").length} /><DocType icon={<FileBadge />} label="Warranty cards" count={documents.filter((item) => item.kind === "Warranty Card").length} /></div><section className="panel table-panel"><DocumentTable documents={filtered} /></section></>;
}

function DocType({ icon, label, count }: { icon: ReactNode; label: string; count: number }) { return <div className="doc-type"><span>{icon}</span><div><strong>{count}</strong><small>{label}</small></div></div>; }

function DocumentTable({ documents, compact = false }: { documents: SalesDocument[]; compact?: boolean }) {
  if (!documents.length) return <Empty icon={<FileText />} title="No records yet" detail="Create the first document from Quotation Studio." />;
  return <div className="table-scroll"><table className={compact ? "compact-table" : ""}><thead><tr><th>Document</th><th>Customer</th>{!compact && <th>Product</th>}<th>Date</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>{documents.map((doc) => <tr key={doc.id}><td><span className="doc-cell"><span><FileText size={17} /></span><span><strong>{doc.number}</strong><small>{doc.kind}</small></span></span></td><td><strong>{doc.customerName}</strong></td>{!compact && <td><strong>{doc.productName}</strong></td>}<td>{new Date(doc.createdAt).toLocaleDateString("en-GB")}</td><td><strong>{money(doc.amount)}</strong></td><td><Status value={doc.status} /></td><td><button className="icon-button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>;
}

function UsersView({ users, onAdd }: { users: AppUser[]; onAdd: () => void }) {
  return <><PageHead eyebrow="ACCESS CONTROL" title="Users & Roles" description="Manage team access across administration, sales operations and owner reporting." actions={<button className="primary-action" onClick={onAdd}><UserPlus size={17} />Add user</button>} /><div className="role-overview"><RoleCard role="Admin" count={users.filter((item) => item.role === "Admin").length} description="Full control over masters, customers, documents, orders and users." /><RoleCard role="Sales" count={users.filter((item) => item.role === "Sales").length} description="Create customers and generate controlled sales documents." /><RoleCard role="Owner" count={users.filter((item) => item.role === "Owner").length} description="Read-only access to reports, customers, quotations and orders." /></div><section className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>User</th><th>Username</th><th>Role</th><th>Access scope</th><th>Status</th><th /></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td><span className="table-identity"><span className="avatar pale">{item.initials}</span><strong>{item.name}</strong></span></td><td><code>{item.username}</code></td><td><span className={`role-chip role-${item.role.toLowerCase()}`}>{item.role}</span></td><td>{item.role === "Admin" ? "Full system access" : item.role === "Owner" ? "Read-only reporting" : "Sales documents & customers"}</td><td><Status value="Active" /></td><td><button className="icon-button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></section></>;
}

function UserForm({ users, onClose, onSave }: { users: AppUser[]; onClose: () => void; onSave: (user: AppUser) => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<AppUser["role"]>("Sales");
  return <Modal title="Add team user" subtitle="Supabase Auth provisions the production login after this profile is created." onClose={onClose}><form className="record-form" onSubmit={(event) => { event.preventDefault(); const clean = username.toLowerCase().trim(); if (users.some((item) => item.username === clean)) return; onSave({ id: crypto.randomUUID(), name, username: clean, role, initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() }); }}><div className="form-grid single"><label>Full name<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} required /></label><label>Role<select value={role} onChange={(event) => setRole(event.target.value as AppUser["role"])}><option>Admin</option><option>Sales</option><option>Owner</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancel</button><button className="primary-action"><UserPlus size={16} />Add user</button></div></form></Modal>;
}

function RoleCard({ role, count, description }: { role: string; count: number; description: string }) { return <div><span className={`role-symbol ${role.toLowerCase()}`}><ShieldCheck /></span><strong>{role}</strong><b>{count} users</b><p>{description}</p></div>; }

function SettingsView() {
  return <><PageHead eyebrow="SYSTEM CONFIGURATION" title="Master Settings" description="Admin-controlled company records and document templates used across Sales OS." actions={<span className="master-lock"><ShieldCheck size={15} />Restricted to Admin</span>} /><div className="settings-layout"><section className="panel settings-company"><div className="panel-head"><div><span className="panel-kicker">LEGAL IDENTITY</span><h3>Company master</h3></div><button className="secondary-action"><Pencil size={15} />Edit</button></div><div className="company-master"><Image src="/assets/shree-kali-logo.png" width={72} height={72} alt="" /><div><h2>{COMPANY.name}</h2><p>{COMPANY.tagline}</p></div></div><div className="settings-fields"><span><small>Registered address</small><strong>{COMPANY.address.join(", ")}</strong></span><span><small>Contact numbers</small><strong>+91 {COMPANY.mobile.join(" · +91 ")}</strong></span><span><small>Email</small><strong>{COMPANY.email}</strong></span><span><small>Website</small><strong>{COMPANY.website}</strong></span></div></section><section className="panel connection-panel"><div className="panel-head"><div><span className="panel-kicker">INFRASTRUCTURE</span><h3>Backend connection</h3></div></div><div className={`connection-state ${isSupabaseConfigured ? "connected" : ""}`}><span><i /><b>{isSupabaseConfigured ? "Supabase connected" : "Demonstration mode"}</b></span><p>{isSupabaseConfigured ? "Authentication, PostgreSQL and Storage are configured." : "Add Supabase environment variables to activate cloud persistence, Auth and Storage."}</p></div><div className="connection-list"><span><Building2 />PostgreSQL database <b>{isSupabaseConfigured ? "Online" : "Schema ready"}</b></span><span><ShieldCheck />Row-level security <b>Defined</b></span><span><Upload />Product asset storage <b>{isSupabaseConfigured ? "Online" : "Ready"}</b></span></div></section></div><section className="panel templates-panel"><div className="panel-head"><div><span className="panel-kicker">DOCUMENT GOVERNANCE</span><h3>Master template system</h3></div><button className="secondary-action"><Settings size={15} />Template controls</button></div><div className="template-grid"><TemplateCard icon={<FileText />} title="Quotation" pages="2-3 pages" detail="Corporate offer + mapped brochure + optional accessories" /><TemplateCard icon={<ReceiptIndianRupee />} title="Proforma Invoice" pages="1 page" detail="Tax invoice calculation with controlled bank details" /><TemplateCard icon={<ClipboardCheck />} title="Order Confirmation" pages="1 page" detail="Confirmed product, delivery and commercial terms" /><TemplateCard icon={<FileBadge />} title="Warranty Card" pages="1 page" detail="Serial number, expiry, QR verification and policy" /></div></section><section className="panel defaults-panel"><div className="panel-head"><div><span className="panel-kicker">COMMERCIAL DEFAULTS</span><h3>Locked calculation rules</h3></div></div><div><span><small>GST</small><strong>18%</strong></span><span><small>Payment</small><strong>50% Advance</strong></span><span><small>Delivery</small><strong>7-10 Working Days</strong></span><span><small>Validity</small><strong>15 Days</strong></span><span><small>Warranty</small><strong>1 Year</strong></span></div></section></>;
}

function TemplateCard({ icon, title, pages, detail }: { icon: ReactNode; title: string; pages: string; detail: string }) { return <div><span>{icon}</span><Status value="Active" /><h3>{title}</h3><b>{pages}</b><p>{detail}</p><button className="text-button">View master <ChevronRight size={15} /></button></div>; }
