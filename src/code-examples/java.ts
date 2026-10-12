import type {PatternSlug} from "../data/patterns";

type Stages = [string, string, string, string];
function program(declarations: string, body: string) {
  const indent = (text: string, spaces: number) => text.split("\n").map(line => " ".repeat(spaces) + line).join("\n");
  return `import java.util.*;\nimport java.util.function.*;\nimport static java.lang.System.out;\n\npublic class Main {\n${declarations ? indent(declarations, 2) + "\n\n" : ""}  public static void main(String[] args) {\n${indent(body, 4)}\n  }\n}`;
}
function stages(before: string, change: string, declarations: string, use: string, extend: string, extension = declarations): Stages {
  return [program("", before), program("", change), program(declarations, use), program(extension, extend)];
}

const payment = `interface Payment { String pay(int amount); }
static class CardPayment implements Payment {
  public String pay(int amount) { return "Card payment ¥" + amount; }
}
static class WalletPayment implements Payment {
  public String pay(int amount) { return "Wallet payment ¥" + amount; }
}
static String checkout(Payment payment, int amount) { return payment.pay(amount); }`;
const settings = `static class Settings {
  private Settings() {}
  private static class Holder { static final Settings INSTANCE = new Settings(); }
  static Settings getInstance() { return Holder.INSTANCE; }
  final Map<String, Boolean> flags = new HashMap<>();
}`;
const notification = `interface Sender { String send(String text); }
static class EmailSender implements Sender {
  public String send(String text) { return "email:" + text; }
}
static abstract class Notification {
  abstract Sender createSender();
  final String notifyUser(String text) { return createSender().send(text.trim()); }
}
static class EmailNotification extends Notification {
  Sender createSender() { return new EmailSender(); }
}`;
const widgets = `interface Widget { String render(); }
interface ThemeFactory { Widget createButton(); Widget createCheckbox(); }
static class LightFactory implements ThemeFactory {
  public Widget createButton() { return () -> "light button"; }
  public Widget createCheckbox() { return () -> "light checkbox"; }
}
static class DarkFactory implements ThemeFactory {
  public Widget createButton() { return () -> "dark button"; }
  public Widget createCheckbox() { return () -> "dark checkbox"; }
}
static String renderPage(ThemeFactory factory) {
  return factory.createButton().render() + " / " + factory.createCheckbox().render();
}`;
const builder = `record ExportJob(String format, boolean header, boolean compressed) {}
static class ExportBuilder {
  private String format = "csv";
  private boolean header, compressed;
  ExportBuilder format(String value) { format = value; return this; }
  ExportBuilder header() { header = true; return this; }
  ExportBuilder compress() { compressed = true; return this; }
  ExportJob build() { return new ExportJob(format, header, compressed); }
}`;
const prototype = `static class Card {
  final String title;
  final List<String> tags;
  Card(String title, List<String> tags) { this.title = title; this.tags = tags; }
  Card copy() { return new Card(title, new ArrayList<>(tags)); }
}`;
const adapter = `interface Payment { String pay(int amount); }
static class LegacySdk { String charge(int cents) { return "charged:" + cents; } }
static class PaymentAdapter implements Payment {
  private final LegacySdk sdk = new LegacySdk();
  public String pay(int amount) { return sdk.charge(amount * 100); }
}
static String checkout(Payment payment, int amount) { return payment.pay(amount); }`;
const bridge = `interface Sender { String send(String text); }
static class EmailSender implements Sender {
  public String send(String text) { return "email:" + text; }
}
static class SmsSender implements Sender {
  public String send(String text) { return "sms:" + text; }
}
static class Message {
  protected final Sender sender;
  Message(Sender sender) { this.sender = sender; }
  String send(String text) { return sender.send(text); }
}
static class UrgentMessage extends Message {
  UrgentMessage(Sender sender) { super(sender); }
  String send(String text) { return sender.send("URGENT " + text); }
}`;
const composite = `interface Component { int total(); }
record Item(int price) implements Component { public int total() { return price; } }
record Bundle(List<Component> children) implements Component {
  public int total() { return children.stream().mapToInt(Component::total).sum(); }
}`;
const decorator = `interface Coffee { int cost(); }
static class PlainCoffee implements Coffee { public int cost() { return 5; } }
record Milk(Coffee wrapped) implements Coffee { public int cost() { return wrapped.cost() + 2; } }
record Sugar(Coffee wrapped) implements Coffee { public int cost() { return wrapped.cost() + 1; } }`;
const subsystems = `static class Database { String connect() { return "db"; } }
static class Cache { String start() { return "cache"; } }
static class Logger { String open() { return "log"; } }`;
const facade = `${subsystems}
static class StartupFacade {
  private final Database db = new Database();
  private final Cache cache = new Cache();
  private final Logger log = new Logger();
  String start() { return String.join(">", db.connect(), cache.start(), log.open()); }
}`;
const flyweight = `record TreeType(String species, String color) {}
record Tree(TreeType type, int x) {}
static class TreeTypeFactory {
  private final Map<TreeType, TreeType> types = new HashMap<>();
  TreeType get(String species, String color) {
    TreeType key = new TreeType(species, color);
    return types.computeIfAbsent(key, value -> value);
  }
}`;
const proxy = `static int loads;
interface ImageView { String display(); }
static class RealImage implements ImageView {
  RealImage() { loads++; }
  public String display() { return "image"; }
}
static class ImageProxy implements ImageView {
  private RealImage real;
  public String display() {
    if (real == null) real = new RealImage();
    return real.display();
  }
}`;
const chain = `static class Handler {
  private final String name;
  private final int limit;
  private Handler next;
  Handler(String name, int limit) { this.name = name; this.limit = limit; }
  Handler setNext(Handler next) { this.next = next; return next; }
  String handle(int amount) {
    if (amount <= limit) return name;
    return next == null ? "unhandled" : next.handle(amount);
  }
}`;
const command = `static class Editor { String text = "A"; }
interface Command { void execute(); void undo(); }
static class InsertCommand implements Command {
  private final Editor editor;
  private final String value;
  private String previous;
  InsertCommand(Editor editor, String value) { this.editor = editor; this.value = value; }
  public void execute() { previous = editor.text; editor.text += value; }
  public void undo() { editor.text = previous; }
}`;
const interpreter = `record Context(int age, boolean member) {}
interface Expression { boolean interpret(Context context); }
static class Adult implements Expression {
  public boolean interpret(Context context) { return context.age() > 18; }
}
static class Member implements Expression {
  public boolean interpret(Context context) { return context.member(); }
}
record And(Expression left, Expression right) implements Expression {
  public boolean interpret(Context context) { return left.interpret(context) && right.interpret(context); }
}`;
const iterator = `static class Playlist implements Iterable<String> {
  private final List<String> songs;
  Playlist(List<String> songs) { this.songs = List.copyOf(songs); }
  public Iterator<String> iterator() { return iterate(false); }
  Iterator<String> iterate(boolean reverse) {
    List<String> snapshot = new ArrayList<>(songs);
    if (reverse) Collections.reverse(snapshot);
    return snapshot.iterator();
  }
}
static String visit(Iterator<String> iterator) {
  List<String> visited = new ArrayList<>();
  iterator.forEachRemaining(visited::add);
  return String.join(",", visited);
}`;
const mediator = `static class SearchBox {
  String text = "";
  SearchMediator mediator;
  void type(String text) { this.text = text; mediator.notifyEvent("search"); }
}
static class Results { String items = ""; }
static class ClearButton {
  SearchMediator mediator;
  void click() { mediator.notifyEvent("clear"); }
}
static class SearchMediator {
  private final SearchBox search;
  private final Results results;
  SearchMediator(SearchBox search, Results results, ClearButton clear) {
    this.search = search; this.results = results;
    search.mediator = this; clear.mediator = this;
  }
  void notifyEvent(String event) {
    if (event.equals("clear")) search.text = "";
    results.items = search.text.isEmpty() ? "empty" : "results:" + search.text;
  }
}`;
const memento = `static class Editor {
  private String text = "A";
  private int cursor = 1;
  void edit(String text) { this.text = text; cursor = text.length(); }
  String view() { return text + ":" + cursor; }
  static final class Snapshot {
    private final String text;
    private final int cursor;
    private Snapshot(String text, int cursor) { this.text = text; this.cursor = cursor; }
  }
  Snapshot save() { return new Snapshot(text, cursor); }
  void restore(Snapshot snapshot) { text = snapshot.text; cursor = snapshot.cursor; }
}`;
const observer = `static class Stock {
  private final Set<IntConsumer> listeners = new LinkedHashSet<>();
  Runnable subscribe(IntConsumer listener) {
    listeners.add(listener);
    return () -> listeners.remove(listener);
  }
  void set(int value) {
    for (IntConsumer listener : new ArrayList<>(listeners)) listener.accept(value);
  }
}`;
const state = `interface State { String name(); void click(Player player); }
static class Player {
  State state = new Stopped();
  void click() { state.click(this); }
}
static class Stopped implements State {
  public String name() { return "stopped"; }
  public void click(Player player) { player.state = new Playing(); }
}
static class Playing implements State {
  public String name() { return "playing"; }
  public void click(Player player) { player.state = new Stopped(); }
}`;
const template = `static abstract class Importer {
  final String importData(String source) {
    String read = source.trim();
    String[] rows = transform(read);
    return "saved:" + String.join("|", rows);
  }
  protected abstract String[] transform(String source);
}
static class CsvImporter extends Importer {
  protected String[] transform(String source) { return source.split(","); }
}`;
// Java's standard library has no JSON parser. Use another real format rather than a fake JSON parser.
const pipeImporter = `static class PipeImporter extends Importer {
  protected String[] transform(String source) { return source.split("\\\\|"); }
}`;
const visitor = `interface Visitor<T> { T visitFile(FileNode file); T visitFolder(Folder folder); }
interface ElementNode { <T> T accept(Visitor<T> visitor); }
static class FileNode implements ElementNode {
  final String name = "notes";
  final int size = 10;
  public <T> T accept(Visitor<T> visitor) { return visitor.visitFile(this); }
}
static class Folder implements ElementNode {
  final List<ElementNode> children = List.of(new FileNode());
  public <T> T accept(Visitor<T> visitor) { return visitor.visitFolder(this); }
}
static class SizeVisitor implements Visitor<Integer> {
  public Integer visitFile(FileNode file) { return file.size; }
  public Integer visitFolder(Folder folder) {
    return folder.children.stream().mapToInt(child -> child.accept(this)).sum();
  }
}`;

export const javaPatternStages: Record<PatternSlug, Stages> = {
  strategy: stages(
    `Function<String, String> checkout = method -> method.equals("card") ? "Card payment ¥100" : "Wallet payment ¥100";\nout.println(checkout.apply("card"));`,
    `Function<String, String> checkout = method -> {\n  if (method.equals("card")) return "Card payment ¥100";\n  if (method.equals("wallet")) return "Wallet payment ¥100";\n  if (method.equals("points")) return "Points redeemed ¥100";\n  throw new IllegalArgumentException(method);\n};\nout.println(checkout.apply("points"));`, payment,
    `out.println(checkout(new CardPayment(), 100));`, `out.println(checkout(new PointsPayment(), 100));`,
    `${payment}\nstatic class PointsPayment implements Payment {\n  public String pay(int amount) { return "Points redeemed ¥" + amount; }\n}`),
  singleton: stages(
    `var cart = new HashMap<String, Boolean>();\nvar job = new HashMap<String, Boolean>();\ncart.put("sale", true);\nout.println(job.getOrDefault("sale", false));`,
    `var cart = new HashMap<String, Boolean>();\nvar job = cart;\ncart.put("sale", true);\nout.println(job.getOrDefault("sale", false));`, settings,
    `var cart = Settings.getInstance();\nvar job = Settings.getInstance();\ncart.flags.put("sale", true);\nout.println(job.flags.get("sale"));`,
    `var cart = Settings.getInstance();\nvar job = Settings.getInstance();\ncart.flags.put("sale", true);\nout.println(job.flags.get("sale"));\nout.println(cart == job);`),
  "factory-method": stages(
    `Function<String, String> notify = text -> "email:" + text.trim();\nout.println(notify.apply(" hello "));`,
    `BiFunction<String, String, String> notify = (channel, text) -> (channel.equals("sms") ? "sms:" : "email:") + text.trim();\nout.println(notify.apply("sms", " hello "));`, notification,
    `out.println(new EmailNotification().notifyUser(" hello "));`, `out.println(new SmsNotification().notifyUser(" hello "));`,
    `${notification}\nstatic class SmsSender implements Sender {\n  public String send(String text) { return "sms:" + text; }\n}\nstatic class SmsNotification extends Notification {\n  Sender createSender() { return new SmsSender(); }\n}`),
  "abstract-factory": stages(`String button = "light button", checkbox = "light checkbox";\nout.println(button + " / " + checkbox);`, `String button = "dark button", checkbox = "light checkbox";\nout.println(button + " / " + checkbox);`, widgets, `out.println(renderPage(new LightFactory()));`, `out.println(renderPage(new DarkFactory()));`),
  builder: stages(`record ExportJob(String format, boolean header, boolean compressed) {}\nout.println(new ExportJob("csv", false, false));`, `record ExportJob(String format, boolean header, boolean compressed) {}\nout.println(new ExportJob("pdf", true, true));`, builder,
    `out.println(new ExportBuilder().format("pdf").header().build());`, `var builder = new ExportBuilder();\nvar first = reportRecipe(builder);\nbuilder.format("csv");\nout.println(first);\nout.println(first.format().equals("pdf"));`, `${builder}\nstatic ExportJob reportRecipe(ExportBuilder builder) {\n  return builder.format("pdf").header().compress().build();\n}`),
  prototype: stages(`var template = new ArrayList<>(List.of("base"));\nvar copy = template;\nout.println(copy == template);`, `var template = new ArrayList<>(List.of("base"));\nvar copy = template;\ncopy.add("new");\nout.println(copy == template);\nout.println(String.join(",", template));`, prototype,
    `var template = new Card("Welcome", new ArrayList<>(List.of("base")));\nvar copy = template.copy();\nout.println(copy.tags == template.tags);`, `var template = new Card("Welcome", new ArrayList<>(List.of("base")));\nvar copy = template.copy();\nout.println(copy.tags == template.tags);\ncopy.tags.add("new");\nout.println(String.join(",", template.tags));\nout.println(String.join(",", copy.tags));`),
  adapter: stages(`IntFunction<String> charge = cents -> "charged:" + cents;\nout.println(charge.apply(10));`, `IntFunction<String> charge = cents -> "charged:" + cents;\nout.println(charge.apply(10 * 100));`, adapter, `out.println(checkout(new PaymentAdapter(), 10));`, `out.println(checkout(new PaymentAdapter(), 20));`),
  bridge: stages(`Function<String, String> normalEmail = text -> "email:" + text;\nFunction<String, String> normalSms = text -> "sms:" + text;\nout.println(normalEmail.apply("hello"));`, `Function<String, String> normalEmail = text -> "email:" + text;\nFunction<String, String> normalSms = text -> "sms:" + text;\nFunction<String, String> urgentEmail = text -> "email:URGENT " + text;\nFunction<String, String> urgentSms = text -> "sms:URGENT " + text;\nout.println(urgentSms.apply("hello"));`, bridge, `out.println(new Message(new EmailSender()).send("hello"));`, `out.println(new UrgentMessage(new SmsSender()).send("hello"));`),
  composite: stages(`var prices = List.of(10, 20);\nout.println(prices.stream().mapToInt(Integer::intValue).sum());`, `var bundle = List.of(List.of(10), List.of(20));\nint total = 0;\nfor (var nested : bundle) for (int price : nested) total += price;\nout.println(total);`, composite, `out.println(new Bundle(List.of(new Item(10), new Item(20))).total());`, `out.println(new Bundle(List.of(new Bundle(List.of(new Item(10))), new Item(20))).total());`),
  decorator: stages(`class PlainCoffee { int cost() { return 5; } }\nout.println(new PlainCoffee().cost());`, `class PlainCoffee { int cost() { return 5; } }\nclass MilkCoffee extends PlainCoffee { int cost() { return super.cost() + 2; } }\nclass MilkSugarCoffee extends MilkCoffee { int cost() { return super.cost() + 1; } }\nout.println(new MilkSugarCoffee().cost());`, decorator, `out.println(new Milk(new PlainCoffee()).cost());`, `out.println(new Sugar(new Milk(new PlainCoffee())).cost());`),
  facade: [program(subsystems, `var db = new Database(); var cache = new Cache(); var log = new Logger();\nout.println(String.join(">", db.connect(), cache.start(), log.open()));`), program(subsystems, `var db = new Database(); var cache = new Cache(); var log = new Logger();\nout.println(String.join(">", db.connect(), cache.start(), log.open()));\nout.println(String.join(">", db.connect(), cache.start(), log.open()));`), program(facade, `out.println(new StartupFacade().start());`), program(facade.replace(`return String.join(">", db.connect(), cache.start(), log.open());`, `boolean valid = true;\n    if (!valid) throw new IllegalStateException("invalid settings");\n    return String.join(">", "validated", db.connect(), cache.start(), log.open());`), `out.println(new StartupFacade().start());`)],
  flyweight: stages(`record TreeType(String species, String color) {}\nvar a = new TreeType("oak", "green");\nvar b = new TreeType("oak", "green");\nout.println(a == b);`, `record TreeType(String species, String color) {}\nvar a = new TreeType("oak", "green");\nvar b = new TreeType("oak", "green");\nvar c = new TreeType("oak", "green");\nout.println(a == b);\nout.println(b == c);`, flyweight,
    `var factory = new TreeTypeFactory();\nvar a = new Tree(factory.get("oak", "green"), 1);\nvar b = new Tree(factory.get("oak", "green"), 2);\nout.println(a.type() == b.type());`, `var factory = new TreeTypeFactory();\nvar a = new Tree(factory.get("oak", "green"), 1);\nvar b = new Tree(factory.get("oak", "green"), 2);\nvar c = new Tree(factory.get("oak", "green"), 3);\nout.println(a.type() == b.type());\nout.println(a.type() == c.type());\nout.println(a.x() + "," + b.x() + "," + c.x());`),
  proxy: [program(proxy.split("static class ImageProxy")[0], `var image = new RealImage();\nout.println(image.display());\nout.println("loads:" + loads);`), program(proxy.split("static class ImageProxy")[0], `var image = new RealImage();\nout.println("loads:" + loads);`), program(proxy, `ImageView image = new ImageProxy();\nout.println("loads:" + loads);`), program(proxy, `ImageView image = new ImageProxy();\nout.println("loads:" + loads);\nout.println(image.display() + " " + image.display());\nout.println("loads:" + loads);`)],
  "chain-of-responsibility": stages(`IntFunction<String> handle = amount -> amount <= 100 ? "agent" : amount <= 1000 ? "supervisor" : "unhandled";\nout.println(handle.apply(800));`, `IntFunction<String> handle = amount -> amount <= 100 ? "agent" : amount <= 1000 ? "supervisor" : amount <= 5000 ? "manager" : "unhandled";\nout.println(handle.apply(3000));`, chain, `var agent = new Handler("agent", 100);\nvar supervisor = new Handler("supervisor", 1000);\nagent.setNext(supervisor);\nout.println(agent.handle(800));`, `var agent = new Handler("agent", 100);\nvar supervisor = new Handler("supervisor", 1000);\nagent.setNext(supervisor);\nsupervisor.setNext(new Handler("manager", 5000));\nout.println(agent.handle(3000));`),
  command: stages(`String text = "A";\ntext += "B";\nout.println(text);`, `String text = "A";\nString previous = text;\ntext += "B";\ntext = previous;\nout.println(text);`, command, `var editor = new Editor();\nDeque<Command> history = new ArrayDeque<>();\nCommand command = new InsertCommand(editor, "B");\ncommand.execute();\nhistory.push(command);\nout.println(editor.text);`, `var editor = new Editor();\nDeque<Command> history = new ArrayDeque<>();\nCommand command = new InsertCommand(editor, "B");\ncommand.execute();\nhistory.push(command);\nout.println(editor.text);\nhistory.pop().undo();\nout.println(editor.text);`),
  interpreter: stages(`int age = 21;\nout.println(age > 18);`, `int age = 21; boolean member = true;\nout.println(age > 18 && member);`, interpreter, `var context = new Context(21, true);\nout.println(new Adult().interpret(context));`, `var context = new Context(21, true);\nout.println(new And(new Adult(), new Member()).interpret(context));`),
  iterator: stages(`var songs = List.of("A", "B", "C");\nvar visited = new ArrayList<String>();\nfor (int i = 0; i < songs.size(); i++) visited.add(songs.get(i));\nout.println(String.join(",", visited));`, `var songs = List.of("A", "B", "C");\nvar visited = new ArrayList<String>();\nfor (int i = songs.size() - 1; i >= 0; i--) visited.add(songs.get(i));\nout.println(String.join(",", visited));`, iterator, `var playlist = new Playlist(List.of("A", "B", "C"));\nout.println(visit(playlist.iterator()));`, `var playlist = new Playlist(List.of("A", "B", "C"));\nout.println(visit(playlist.iterate(true)));`),
  mediator: stages(`String search = "book";\nString results = "results:" + search;\nout.println(results);`, `String search = "book";\nString results = "results:" + search;\nout.println(results);\nsearch = ""; results = "empty";\nout.println(results);`, mediator, `var search = new SearchBox(); var results = new Results(); var clear = new ClearButton();\nnew SearchMediator(search, results, clear);\nsearch.type("book");\nout.println(results.items);`, `var search = new SearchBox(); var results = new Results(); var clear = new ClearButton();\nnew SearchMediator(search, results, clear);\nsearch.type("book");\nout.println(results.items);\nclear.click();\nout.println(results.items);`),
  memento: stages(`String text = "A"; int cursor = 1;\nString savedText = text; int savedCursor = cursor;\nout.println(savedText + ":" + savedCursor);`, `String text = "A"; int cursor = 1;\nString savedText = text; int savedCursor = cursor;\ntext = "ABC"; cursor = 3;\ntext = savedText; cursor = savedCursor;\nout.println(text + ":" + cursor);`, memento, `var editor = new Editor();\nvar snapshot = editor.save();\neditor.edit("ABC");\nout.println(editor.view());`, `var editor = new Editor();\nvar snapshot = editor.save();\neditor.edit("ABC");\nout.println(editor.view());\neditor.restore(snapshot);\nout.println(editor.view());`),
  observer: stages(`IntConsumer setStock = value -> out.println("display:" + value);\nsetStock.accept(3);`, `IntConsumer setStock = value -> {\n  out.println("display:" + value);\n  out.println("email:" + value);\n};\nsetStock.accept(3);`, observer, `var stock = new Stock();\nRunnable unsubscribe = stock.subscribe(value -> out.println("display:" + value));\nstock.subscribe(value -> out.println("email:" + value));\nstock.set(3);`, `var stock = new Stock();\nRunnable unsubscribe = stock.subscribe(value -> out.println("display:" + value));\nstock.subscribe(value -> out.println("email:" + value));\nunsubscribe.run();\nstock.set(5);`),
  state: stages(`String state = "stopped";\nstate = state.equals("stopped") ? "playing" : "stopped";\nout.println(state);`, `String state = "stopped";\nfor (int clicks = 0; clicks < 2; clicks++) state = state.equals("playing") ? "paused" : "playing";\nout.println(state);`, state, `var player = new Player();\nplayer.click();\nout.println(player.state.name());`, `var player = new Player();\nplayer.click(); player.click();\nout.println(player.state.name());\nplayer.click();\nout.println(player.state.name());`, `${state.replace("player.state = new Stopped();", "player.state = new Paused();")}\nstatic class Paused implements State {\n  public String name() { return "paused"; }\n  public void click(Player player) { player.state = new Playing(); }\n}`),
  "template-method": stages(`Function<String, String> importCsv = source -> "saved:" + String.join("|", source.trim().split(","));\nout.println(importCsv.apply(" A,B "));`, `Function<String, String> importCsv = source -> "saved:" + String.join("|", source.trim().split(","));\nFunction<String, String> importPipe = source -> "saved:" + String.join("|", source.trim().split("\\\\|"));\nout.println(importCsv.apply(" A,B "));\nout.println(importPipe.apply(" A|B "));`, `${template}\n${pipeImporter}`, `out.println(new CsvImporter().importData(" A,B "));`, `out.println(new PipeImporter().importData(" A|B "));`),
  visitor: stages(`class FileNode { String name = "notes"; int size = 10; int total() { return size; } }\nclass Folder { List<FileNode> children = List.of(new FileNode()); int total() { return children.stream().mapToInt(FileNode::total).sum(); } }\nout.println(new Folder().total());`, `class FileNode { String name = "notes"; int size = 10; int total() { return size; } String exportName() { return name; } }\nclass Folder { List<FileNode> children = List.of(new FileNode()); int total() { return children.stream().mapToInt(FileNode::total).sum(); } String exportName() { return String.join(",", children.stream().map(FileNode::exportName).toList()); } }\nout.println(new Folder().total());\nout.println(new Folder().exportName());`, visitor, `out.println(new Folder().accept(new SizeVisitor()));`, `out.println(new Folder().accept(new NameVisitor()));`, `${visitor}\nstatic class NameVisitor implements Visitor<String> {\n  public String visitFile(FileNode file) { return file.name; }\n  public String visitFolder(Folder folder) { return String.join(",", folder.children.stream().map(child -> child.accept(this)).toList()); }\n}`)
};
