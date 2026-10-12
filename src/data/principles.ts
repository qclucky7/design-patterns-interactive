import type {PatternSlug} from "./patterns";

export const principleGroups = ["solid", "structure"] as const;
const principleDefinitions = [
  {slug:"single-responsibility", acronym:"SRP", group:"solid", patterns:["facade", "strategy"],
    before:`class Invoice {
  total(items: number[]) { return items.reduce((a, b) => a + b, 0); }
  render(total: number) { return "Invoice: " + total; }
  save(text: string) { localStorage.setItem("invoice", text); }
}`,
    after:`const total = (items: number[]) => items.reduce((a, b) => a + b, 0);
const renderInvoice = (amount: number) => "Invoice: " + amount;
const saveInvoice = (text: string) => localStorage.setItem("invoice", text);

// Calculation, presentation, and storage can change independently.
saveInvoice(renderInvoice(total([20, 30])));`},
  {slug:"open-closed", acronym:"OCP", group:"solid", patterns:["strategy", "decorator", "observer"],
    before:`function pay(method: string, amount: number) {
  if (method === "card") return "Card: " + amount;
  if (method === "wallet") return "Wallet: " + amount;
  throw new Error("Unsupported method");
}`,
    after:`type Payment = (amount: number) => string;
const pay = (payment: Payment, amount: number) => payment(amount);

const card: Payment = amount => "Card: " + amount;
const points: Payment = amount => "Points: " + amount;

// Add a strategy without editing pay.
pay(points, 100);`},
  {slug:"liskov-substitution", acronym:"LSP", group:"solid", patterns:["strategy", "proxy"],
    before:`interface Store { read(key: string): string | undefined; write(key: string, value: string): void; }
class ReadOnlyStore implements Store {
  read(key: string) { return localStorage.getItem(key) ?? undefined; }
  write(_key: string, _value: string) { throw new Error("Read only"); }
}
// A caller expecting Store cannot safely use ReadOnlyStore.`,
    after:`interface Reader { read(key: string): string | undefined; }
interface Writer { write(key: string, value: string): void; }
class ReadOnlyStore implements Reader {
  read(key: string) { return localStorage.getItem(key) ?? undefined; }
}
function load(store: Reader, key: string) { return store.read(key); }
// Only writable implementations promise Writer.`},
  {slug:"interface-segregation", acronym:"ISP", group:"solid", patterns:["adapter", "bridge"],
    before:`interface Device { print(): void; scan(): void; fax(): void; }
class BasicPrinter implements Device {
  print() { console.log("Printed"); }
  scan() { throw new Error("No scanner"); }
  fax() { throw new Error("No fax"); }
}`,
    after:`interface Printer { print(): void; }
interface Scanner { scan(): void; }
class BasicPrinter implements Printer {
  print() { console.log("Printed"); }
}
function printDocument(device: Printer) { device.print(); }
// A multifunction device may implement Printer and Scanner.`},
  {slug:"dependency-inversion", acronym:"DIP", group:"solid", patterns:["strategy", "bridge", "abstract-factory"],
    before:`class EmailSender {
  send(message: string) { console.log("Email: " + message); }
}
class OrderService {
  private sender = new EmailSender();
  complete() { this.sender.send("Order complete"); }
}`,
    after:`interface Notifier { send(message: string): void; }
class OrderService {
  constructor(private notifier: Notifier) {}
  complete() { this.notifier.send("Order complete"); }
}
const email: Notifier = {send: message => console.log("Email: " + message)};
new OrderService(email).complete();`},
  {slug:"composition-over-inheritance", acronym:"Composition", group:"structure", patterns:["decorator", "strategy", "bridge"],
    before:`class Report { build() { return "report"; } }
class CachedReport extends Report {}
class SignedReport extends Report {}
class CachedSignedReport extends CachedReport {}
// Each new combination adds another subclass.`,
    after:`type Report = () => string;
const buildReport: Report = () => "report";
const signed = (report: Report): Report => () => "signed(" + report() + ")";
const cached = (report: Report): Report => {
  let value: string | undefined;
  return () => value ??= report();
};
const report = cached(signed(buildReport));`},
  {slug:"law-of-demeter", acronym:"LoD", group:"structure", patterns:["facade", "mediator"],
    before:`type Customer = {profile: {address: {city: string}}};
const shippingCity = (customer: Customer) => customer.profile.address.city;
// The caller knows the entire internal object structure.`,
    after:`interface ShippingDestination { city(): string; }
const shippingCity = (destination: ShippingDestination) => destination.city();
// The destination owns how its city is obtained.`},
] as const satisfies readonly {slug:string;acronym:string;group:typeof principleGroups[number];patterns:readonly PatternSlug[];before:string;after:string}[];

// Icons follow the same slug convention as the design-pattern directory.
export const principles = principleDefinitions.map(principle=>({...principle,icon:`/icons/principles/${principle.slug}.svg`}));
export type PrincipleSlug = typeof principles[number]["slug"];
export function findPrinciple(slug:string) {return principles.find(principle => principle.slug === slug);}
export function principlesForPattern(slug:PatternSlug) {
  return principles.filter(principle => (principle.patterns as readonly PatternSlug[]).includes(slug));
}
