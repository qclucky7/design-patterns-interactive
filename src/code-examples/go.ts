import type {PatternSlug} from "../data/patterns";

type Stages = [string, string, string, string];
function program(declarations: string, body: string) {
  const code = declarations + body;
  const imports = ["fmt", ...(code.includes("strings.") ? ["strings"] : []), ...(code.includes("json.") ? ["encoding/json"] : []), ...(code.includes("sync.") ? ["sync"] : [])];
  return `package main\n\nimport (\n${imports.map(name => `  "${name}"`).join("\n")}\n)\n\n${declarations ? declarations + "\n\n" : ""}func main() {\n${body.split("\n").map(line => "  " + line).join("\n")}\n}`;
}
function stages(before: string, change: string, declarations: string, use: string, extend: string, extension = declarations): Stages {
  return [program("", before), program("", change), program(declarations, use), program(extension, extend)];
}

const payment = `type Payment interface { Pay(int) string }
type CardPayment struct{}
func (CardPayment) Pay(amount int) string { return fmt.Sprintf("Card payment ¥%d", amount) }
type WalletPayment struct{}
func (WalletPayment) Pay(amount int) string { return fmt.Sprintf("Wallet payment ¥%d", amount) }
func checkout(payment Payment, amount int) string { return payment.Pay(amount) }`;
const singleton = `type settings struct { flags map[string]bool }
var once sync.Once
var instance *settings
func getSettings() *settings {
  once.Do(func() { instance = &settings{flags: make(map[string]bool)} })
  return instance
}`;
// Go has no abstract classes. A creator interface preserves the factory-method seam.
const factory = `type Sender interface { Send(string) string }
type EmailSender struct{}
func (EmailSender) Send(text string) string { return "email:" + text }
type Creator interface { CreateSender() Sender }
type EmailNotification struct{}
func (EmailNotification) CreateSender() Sender { return EmailSender{} }
func notify(creator Creator, text string) string {
  return creator.CreateSender().Send(strings.TrimSpace(text))
}`;
const abstractFactory = `type Widget interface { Render() string }
type widget string
func (w widget) Render() string { return string(w) }
type ThemeFactory interface { CreateButton() Widget; CreateCheckbox() Widget }
type LightFactory struct{}
func (LightFactory) CreateButton() Widget { return widget("light button") }
func (LightFactory) CreateCheckbox() Widget { return widget("light checkbox") }
type DarkFactory struct{}
func (DarkFactory) CreateButton() Widget { return widget("dark button") }
func (DarkFactory) CreateCheckbox() Widget { return widget("dark checkbox") }
func renderPage(factory ThemeFactory) string {
  return factory.CreateButton().Render() + " / " + factory.CreateCheckbox().Render()
}`;
const builder = `type ExportJob struct { Format string; Header, Compressed bool }
type ExportBuilder struct { options ExportJob }
func newBuilder() *ExportBuilder { return &ExportBuilder{options: ExportJob{Format: "csv"}} }
func (b *ExportBuilder) Format(value string) *ExportBuilder { b.options.Format = value; return b }
func (b *ExportBuilder) Header() *ExportBuilder { b.options.Header = true; return b }
func (b *ExportBuilder) Compress() *ExportBuilder { b.options.Compressed = true; return b }
func (b *ExportBuilder) Build() ExportJob { return b.options }`;
const prototype = `type Card struct { Title string; Tags []string }
func (c Card) Clone() Card { return Card{c.Title, append([]string(nil), c.Tags...)} }`;
const adapter = `type Payment interface { Pay(int) string }
type LegacySDK struct{}
func (LegacySDK) Charge(cents int) string { return fmt.Sprintf("charged:%d", cents) }
type PaymentAdapter struct { sdk LegacySDK }
func (a PaymentAdapter) Pay(amount int) string { return a.sdk.Charge(amount * 100) }
func checkout(payment Payment, amount int) string { return payment.Pay(amount) }`;
const bridge = `type Sender interface { Send(string) string }
type EmailSender struct{}
func (EmailSender) Send(text string) string { return "email:" + text }
type SmsSender struct{}
func (SmsSender) Send(text string) string { return "sms:" + text }
type Message struct { sender Sender }
func (m Message) Send(text string) string { return m.sender.Send(text) }
type UrgentMessage struct { Message }
func (m UrgentMessage) Send(text string) string { return m.sender.Send("URGENT " + text) }`;
const composite = `type Component interface { Total() int }
type Item struct { price int }
func (i Item) Total() int { return i.price }
type Bundle struct { children []Component }
func (b Bundle) Total() int {
  total := 0
  for _, child := range b.children { total += child.Total() }
  return total
}`;
const decorator = `type Coffee interface { Cost() int }
type PlainCoffee struct{}
func (PlainCoffee) Cost() int { return 5 }
type Milk struct { wrapped Coffee }
func (m Milk) Cost() int { return m.wrapped.Cost() + 2 }
type Sugar struct { wrapped Coffee }
func (s Sugar) Cost() int { return s.wrapped.Cost() + 1 }`;
const subsystems = `type Database struct{}
func (Database) Connect() string { return "db" }
type Cache struct{}
func (Cache) Start() string { return "cache" }
type Logger struct{}
func (Logger) Open() string { return "log" }`;
const facade = `${subsystems}
type StartupFacade struct { db Database; cache Cache; log Logger }
func (f StartupFacade) Start() string {
  return strings.Join([]string{f.db.Connect(), f.cache.Start(), f.log.Open()}, ">")
}`;
const flyweight = `type TreeType struct { species, color string }
type Tree struct { kind *TreeType; x int }
type TreeTypeFactory struct { types map[TreeType]*TreeType }
func (f *TreeTypeFactory) Get(species, color string) *TreeType {
  key := TreeType{species, color}
  if f.types == nil { f.types = make(map[TreeType]*TreeType) }
  if f.types[key] == nil { f.types[key] = &key }
  return f.types[key]
}`;
const proxy = `var loads int
type ImageView interface { Display() string }
type RealImage struct{}
func newRealImage() *RealImage { loads++; return &RealImage{} }
func (*RealImage) Display() string { return "image" }
type ImageProxy struct { real *RealImage }
func (p *ImageProxy) Display() string {
  if p.real == nil { p.real = newRealImage() }
  return p.real.Display()
}`;
const chain = `type Handler struct { name string; limit int; next *Handler }
func (h *Handler) SetNext(next *Handler) *Handler { h.next = next; return next }
func (h *Handler) Handle(amount int) string {
  if amount <= h.limit { return h.name }
  if h.next != nil { return h.next.Handle(amount) }
  return "unhandled"
}`;
const command = `type Editor struct { text string }
type Command interface { Execute(); Undo() }
type InsertCommand struct { editor *Editor; value, previous string }
func (c *InsertCommand) Execute() { c.previous = c.editor.text; c.editor.text += c.value }
func (c *InsertCommand) Undo() { c.editor.text = c.previous }`;
const interpreter = `type Context struct { age int; member bool }
type Expression interface { Interpret(Context) bool }
type Adult struct{}
func (Adult) Interpret(c Context) bool { return c.age > 18 }
type Member struct{}
func (Member) Interpret(c Context) bool { return c.member }
type And struct { left, right Expression }
func (a And) Interpret(c Context) bool { return a.left.Interpret(c) && a.right.Interpret(c) }`;
const iterator = `type Playlist struct { songs []string }
type SongIterator struct { snapshot []string; index int }
func (p Playlist) Iterate(reverse bool) *SongIterator {
  snapshot := append([]string(nil), p.songs...)
  if reverse {
    for i, j := 0, len(snapshot)-1; i < j; i, j = i+1, j-1 { snapshot[i], snapshot[j] = snapshot[j], snapshot[i] }
  }
  return &SongIterator{snapshot: snapshot}
}
func (i *SongIterator) Next() (string, bool) {
  if i.index >= len(i.snapshot) { return "", false }
  song := i.snapshot[i.index]; i.index++
  return song, true
}
func visit(iterator *SongIterator) string {
  visited := []string{}
  for song, ok := iterator.Next(); ok; song, ok = iterator.Next() { visited = append(visited, song) }
  return strings.Join(visited, ",")
}`;
const mediator = `type SearchBox struct { text string; mediator *SearchMediator }
func (s *SearchBox) Type(text string) { s.text = text; s.mediator.Notify("search") }
type Results struct { items string }
type ClearButton struct { mediator *SearchMediator }
func (c *ClearButton) Click() { c.mediator.Notify("clear") }
type SearchMediator struct { search *SearchBox; results *Results }
func newMediator(search *SearchBox, results *Results, clear *ClearButton) *SearchMediator {
  m := &SearchMediator{search, results}
  search.mediator = m; clear.mediator = m
  return m
}
func (m *SearchMediator) Notify(event string) {
  if event == "clear" { m.search.text = "" }
  m.results.items = "empty"
  if m.search.text != "" { m.results.items = "results:" + m.search.text }
}`;
const memento = `type Editor struct { text string; cursor int }
// An opaque restore closure hides the snapshot's representation from the caretaker.
type Snapshot struct { restore func() }
func (e *Editor) Edit(text string) { e.text = text; e.cursor = len(text) }
func (e *Editor) View() string { return fmt.Sprintf("%s:%d", e.text, e.cursor) }
func (e *Editor) Save() Snapshot {
  text, cursor := e.text, e.cursor
  return Snapshot{restore: func() { e.text, e.cursor = text, cursor }}
}
func (e *Editor) Restore(snapshot Snapshot) { snapshot.restore() }`;
const observer = `type listener struct { id int; callback func(int) }
type Stock struct { listeners []listener; nextID int }
func (s *Stock) Subscribe(callback func(int)) func() {
  id := s.nextID; s.nextID++
  s.listeners = append(s.listeners, listener{id, callback})
  return func() {
    for i, item := range s.listeners {
      if item.id == id { s.listeners = append(s.listeners[:i], s.listeners[i+1:]...); return }
    }
  }
}
func (s *Stock) Set(value int) {
  for _, item := range append([]listener(nil), s.listeners...) { item.callback(value) }
}`;
const state = `type State interface { Name() string; Click(*Player) }
type Player struct { state State }
func (p *Player) Click() { p.state.Click(p) }
type Stopped struct{}
func (Stopped) Name() string { return "stopped" }
func (Stopped) Click(p *Player) { p.state = Playing{} }
type Playing struct{}
func (Playing) Name() string { return "playing" }
func (Playing) Click(p *Player) { p.state = Stopped{} }`;
// Template method is a fixed algorithm with an injected transform hook in Go.
const template = `type Transformer interface { Transform(string) ([]string, error) }
type Importer struct { transformer Transformer }
func (i Importer) ImportData(source string) (string, error) {
  read := strings.TrimSpace(source)
  rows, err := i.transformer.Transform(read)
  if err != nil { return "", err }
  return "saved:" + strings.Join(rows, "|"), nil
}
type CsvTransformer struct{}
func (CsvTransformer) Transform(source string) ([]string, error) { return strings.Split(source, ","), nil }
type JsonTransformer struct{}
func (JsonTransformer) Transform(source string) ([]string, error) {
  var rows []string
  err := json.Unmarshal([]byte(source), &rows)
  return rows, err
}`;
const visitor = `type Visitor interface { VisitFile(FileNode) string; VisitFolder(Folder) string }
type ElementNode interface { Accept(Visitor) string }
type FileNode struct { name string; size int }
func (f FileNode) Accept(v Visitor) string { return v.VisitFile(f) }
type Folder struct { children []ElementNode }
func (f Folder) Accept(v Visitor) string { return v.VisitFolder(f) }
type SizeVisitor struct{}
func (SizeVisitor) VisitFile(f FileNode) string { return fmt.Sprint(f.size) }
func (v SizeVisitor) VisitFolder(f Folder) string {
  total := 0
  for _, child := range f.children { var size int; fmt.Sscan(child.Accept(v), &size); total += size }
  return fmt.Sprint(total)
}`;

export const goPatternStages: Record<PatternSlug, Stages> = {
  strategy: stages(`checkout := func(amount int, method string) string {\n  if method == "card" { return fmt.Sprintf("Card payment ¥%d", amount) }\n  return fmt.Sprintf("Wallet payment ¥%d", amount)\n}\nfmt.Println(checkout(100, "card"))`, `checkout := func(amount int, method string) string {\n  if method == "card" { return fmt.Sprintf("Card payment ¥%d", amount) }\n  if method == "wallet" { return fmt.Sprintf("Wallet payment ¥%d", amount) }\n  if method == "points" { return fmt.Sprintf("Points redeemed ¥%d", amount) }\n  panic("Unsupported method")\n}\nfmt.Println(checkout(100, "points"))`, payment, `fmt.Println(checkout(CardPayment{}, 100))`, `fmt.Println(checkout(PointsPayment{}, 100))`, `${payment}\ntype PointsPayment struct{}\nfunc (PointsPayment) Pay(amount int) string { return fmt.Sprintf("Points redeemed ¥%d", amount) }`),
  singleton: stages(`cart := map[string]bool{}\njob := map[string]bool{}\ncart["sale"] = true\nfmt.Println(job["sale"])`, `cart := map[string]bool{}\njob := cart\ncart["sale"] = true\nfmt.Println(job["sale"])`, singleton, `cart, job := getSettings(), getSettings()\ncart.flags["sale"] = true\nfmt.Println(job.flags["sale"])`, `cart, job := getSettings(), getSettings()\ncart.flags["sale"] = true\nfmt.Println(job.flags["sale"])\nfmt.Println(cart == job)`),
  "factory-method": stages(`notify := func(text string) string { return "email:" + strings.TrimSpace(text) }\nfmt.Println(notify(" hello "))`, `notify := func(channel, text string) string {\n  if channel == "sms" { return "sms:" + strings.TrimSpace(text) }\n  return "email:" + strings.TrimSpace(text)\n}\nfmt.Println(notify("sms", " hello "))`, factory, `fmt.Println(notify(EmailNotification{}, " hello "))`, `fmt.Println(notify(SmsNotification{}, " hello "))`, `${factory}\ntype SmsSender struct{}\nfunc (SmsSender) Send(text string) string { return "sms:" + text }\ntype SmsNotification struct{}\nfunc (SmsNotification) CreateSender() Sender { return SmsSender{} }`),
  "abstract-factory": stages(`button, checkbox := "light button", "light checkbox"\nfmt.Println(button + " / " + checkbox)`, `button, checkbox := "dark button", "light checkbox"\nfmt.Println(button + " / " + checkbox)`, abstractFactory, `fmt.Println(renderPage(LightFactory{}))`, `fmt.Println(renderPage(DarkFactory{}))`),
  builder: stages(`type ExportJob struct { Format string; Header, Compressed bool }\nexportJob := func(format string, header, compressed bool) ExportJob { return ExportJob{format, header, compressed} }\nfmt.Println(exportJob("csv", false, false))`, `type ExportJob struct { Format string; Header, Compressed bool }\nexportJob := func(format string, header, compressed bool) ExportJob { return ExportJob{format, header, compressed} }\nfmt.Println(exportJob("pdf", true, true))`, builder, `fmt.Println(newBuilder().Format("pdf").Header().Build())`, `builder := newBuilder()\nfirst := reportRecipe(builder)\nbuilder.Format("csv")\nfmt.Println(first)\nfmt.Println(first.Format == "pdf")`, `${builder}\nfunc reportRecipe(builder *ExportBuilder) ExportJob { return builder.Format("pdf").Header().Compress().Build() }`),
  prototype: stages(`type Card struct { Title string; Tags []string }\ntemplate := Card{"Welcome", []string{"base"}}\ncopy := template\nfmt.Println(&copy.Tags[0] == &template.Tags[0])`, `type Card struct { Title string; Tags []string }\ntemplate := Card{"Welcome", make([]string, 1, 2)}\ntemplate.Tags[0] = "base"\ncopy := template\ncopy.Tags = append(copy.Tags, "new")\nfmt.Println(&copy.Tags[0] == &template.Tags[0])\n// Both slices still share the backing array.\nfmt.Println(strings.Join(template.Tags[:2], ","))`, prototype, `template := Card{"Welcome", []string{"base"}}\ncopy := template.Clone()\nfmt.Println(&copy.Tags[0] == &template.Tags[0])`, `template := Card{"Welcome", []string{"base"}}\ncopy := template.Clone()\nfmt.Println(&copy.Tags[0] == &template.Tags[0])\ncopy.Tags = append(copy.Tags, "new")\nfmt.Println(strings.Join(template.Tags, ","))\nfmt.Println(strings.Join(copy.Tags, ","))`),
  adapter: stages(`charge := func(cents int) string { return fmt.Sprintf("charged:%d", cents) }\nfmt.Println(charge(10))`, `charge := func(cents int) string { return fmt.Sprintf("charged:%d", cents) }\nfmt.Println(charge(10 * 100))`, adapter, `fmt.Println(checkout(PaymentAdapter{}, 10))`, `fmt.Println(checkout(PaymentAdapter{}, 20))`),
  bridge: stages(`normalEmail := func(text string) string { return "email:" + text }\nfmt.Println(normalEmail("hello"))`, `normalEmail := func(text string) string { return "email:" + text }\nurgentSms := func(text string) string { return "sms:URGENT " + text }\n_ = normalEmail\nfmt.Println(urgentSms("hello"))`, bridge, `fmt.Println((Message{EmailSender{}}).Send("hello"))`, `fmt.Println((UrgentMessage{Message{SmsSender{}}}).Send("hello"))`),
  composite: stages(`prices := []int{10, 20}\ntotal := 0\nfor _, price := range prices { total += price }\nfmt.Println(total)`, `bundles := [][]int{{10}, {20}}\ntotal := 0\nfor _, nested := range bundles { for _, price := range nested { total += price } }\nfmt.Println(total)`, composite, `basket := Bundle{[]Component{Item{10}, Item{20}}}\nfmt.Println(basket.Total())`, `basket := Bundle{[]Component{Bundle{[]Component{Item{10}}}, Item{20}}}\nfmt.Println(basket.Total())`),
  decorator: [program(`type PlainCoffee struct{}\nfunc (PlainCoffee) Cost() int { return 5 }`, `fmt.Println((PlainCoffee{}).Cost())`), program(`type PlainCoffee struct{}\nfunc (PlainCoffee) Cost() int { return 5 }\ntype MilkCoffee struct { PlainCoffee }\nfunc (m MilkCoffee) Cost() int { return m.PlainCoffee.Cost() + 2 }\ntype MilkSugarCoffee struct { MilkCoffee }\nfunc (m MilkSugarCoffee) Cost() int { return m.MilkCoffee.Cost() + 1 }`, `fmt.Println((MilkSugarCoffee{}).Cost())`), program(decorator, `fmt.Println((Milk{PlainCoffee{}}).Cost())`), program(decorator, `fmt.Println((Sugar{Milk{PlainCoffee{}}}).Cost())`)],
  facade: [program(subsystems, `db, cache, log := Database{}, Cache{}, Logger{}\nfmt.Println(strings.Join([]string{db.Connect(), cache.Start(), log.Open()}, ">"))`), program(subsystems, `db, cache, log := Database{}, Cache{}, Logger{}\nfmt.Println(strings.Join([]string{db.Connect(), cache.Start(), log.Open()}, ">"))\nfmt.Println(strings.Join([]string{db.Connect(), cache.Start(), log.Open()}, ">"))`), program(facade, `fmt.Println((StartupFacade{}).Start())`), program(facade.replace(`return strings.Join([]string{f.db.Connect(), f.cache.Start(), f.log.Open()}, ">")`, `valid := true\n  if !valid { panic("invalid settings") }\n  return strings.Join([]string{"validated", f.db.Connect(), f.cache.Start(), f.log.Open()}, ">")`), `fmt.Println((StartupFacade{}).Start())`)],
  flyweight: stages(`type TreeType struct { species, color string }\na, b := &TreeType{"oak", "green"}, &TreeType{"oak", "green"}\nfmt.Println(a == b)`, `type TreeType struct { species, color string }\na, b, c := &TreeType{"oak", "green"}, &TreeType{"oak", "green"}, &TreeType{"oak", "green"}\nfmt.Println(a == b)\nfmt.Println(b == c)`, flyweight, `factory := &TreeTypeFactory{}\na, b := Tree{factory.Get("oak", "green"), 1}, Tree{factory.Get("oak", "green"), 2}\nfmt.Println(a.kind == b.kind)`, `factory := &TreeTypeFactory{}\na, b, c := Tree{factory.Get("oak", "green"), 1}, Tree{factory.Get("oak", "green"), 2}, Tree{factory.Get("oak", "green"), 3}\nfmt.Println(a.kind == b.kind)\nfmt.Println(a.kind == c.kind)\nfmt.Printf("%d,%d,%d\\n", a.x, b.x, c.x)`),
  proxy: [program(proxy.split("type ImageProxy")[0], `image := newRealImage()\nfmt.Println(image.Display())\nfmt.Printf("loads:%d\\n", loads)`), program(proxy.split("type ImageProxy")[0], `_ = newRealImage()\nfmt.Printf("loads:%d\\n", loads)`), program(proxy, `image := &ImageProxy{}\n_ = image\nfmt.Printf("loads:%d\\n", loads)`), program(proxy, `image := &ImageProxy{}\nfmt.Printf("loads:%d\\n", loads)\nfmt.Println(image.Display(), image.Display())\nfmt.Printf("loads:%d\\n", loads)`)],
  "chain-of-responsibility": stages(`handle := func(amount int) string {\n  if amount <= 100 { return "agent" }; if amount <= 1000 { return "supervisor" }; return "unhandled"\n}\nfmt.Println(handle(800))`, `handle := func(amount int) string {\n  if amount <= 100 { return "agent" }; if amount <= 1000 { return "supervisor" }; if amount <= 5000 { return "manager" }; return "unhandled"\n}\nfmt.Println(handle(3000))`, chain, `agent, supervisor := &Handler{name: "agent", limit: 100}, &Handler{name: "supervisor", limit: 1000}\nagent.SetNext(supervisor)\nfmt.Println(agent.Handle(800))`, `agent, supervisor := &Handler{name: "agent", limit: 100}, &Handler{name: "supervisor", limit: 1000}\nagent.SetNext(supervisor)\nsupervisor.SetNext(&Handler{name: "manager", limit: 5000})\nfmt.Println(agent.Handle(3000))`),
  command: stages(`text := "A"\ntext += "B"\nfmt.Println(text)`, `text := "A"\nprevious := text\ntext += "B"\ntext = previous\nfmt.Println(text)`, command, `editor := &Editor{text: "A"}\nhistory := []Command{}\ncommand := &InsertCommand{editor: editor, value: "B"}\ncommand.Execute()\nhistory = append(history, command)\nfmt.Println(editor.text)`, `editor := &Editor{text: "A"}\nhistory := []Command{}\ncommand := &InsertCommand{editor: editor, value: "B"}\ncommand.Execute()\nhistory = append(history, command)\nfmt.Println(editor.text)\nhistory[len(history)-1].Undo()\nhistory = history[:len(history)-1]\nfmt.Println(editor.text)`),
  interpreter: stages(`age := 21\nfmt.Println(age > 18)`, `age, member := 21, true\nfmt.Println(age > 18 && member)`, interpreter, `context := Context{21, true}\nfmt.Println((Adult{}).Interpret(context))`, `context := Context{21, true}\nfmt.Println((And{Adult{}, Member{}}).Interpret(context))`),
  iterator: stages(`songs := []string{"A", "B", "C"}\nvisited := []string{}\nfor i := 0; i < len(songs); i++ { visited = append(visited, songs[i]) }\nfmt.Println(strings.Join(visited, ","))`, `songs := []string{"A", "B", "C"}\nvisited := []string{}\nfor i := len(songs)-1; i >= 0; i-- { visited = append(visited, songs[i]) }\nfmt.Println(strings.Join(visited, ","))`, iterator, `playlist := Playlist{[]string{"A", "B", "C"}}\nfmt.Println(visit(playlist.Iterate(false)))`, `playlist := Playlist{[]string{"A", "B", "C"}}\nfmt.Println(visit(playlist.Iterate(true)))`),
  mediator: stages(`search := "book"\nresults := "results:" + search\nfmt.Println(results)`, `search := "book"\nresults := "results:" + search\nfmt.Println(results)\nsearch, results = "", "empty"\nfmt.Println(results)`, mediator, `search, results, clear := &SearchBox{}, &Results{}, &ClearButton{}\nnewMediator(search, results, clear)\nsearch.Type("book")\nfmt.Println(results.items)`, `search, results, clear := &SearchBox{}, &Results{}, &ClearButton{}\nnewMediator(search, results, clear)\nsearch.Type("book")\nfmt.Println(results.items)\nclear.Click()\nfmt.Println(results.items)`),
  memento: stages(`text, cursor := "A", 1\nsavedText, savedCursor := text, cursor\nfmt.Printf("%s:%d\\n", savedText, savedCursor)`, `text, cursor := "A", 1\nsavedText, savedCursor := text, cursor\ntext, cursor = "ABC", 3\ntext, cursor = savedText, savedCursor\nfmt.Printf("%s:%d\\n", text, cursor)`, memento, `editor := &Editor{"A", 1}\nsnapshot := editor.Save()\n_ = snapshot\neditor.Edit("ABC")\nfmt.Println(editor.View())`, `editor := &Editor{"A", 1}\nsnapshot := editor.Save()\neditor.Edit("ABC")\nfmt.Println(editor.View())\neditor.Restore(snapshot)\nfmt.Println(editor.View())`),
  observer: stages(`setStock := func(value int) { fmt.Printf("display:%d\\n", value) }\nsetStock(3)`, `setStock := func(value int) { fmt.Printf("display:%d\\nemail:%d\\n", value, value) }\nsetStock(3)`, observer, `stock := &Stock{}\nunsubscribe := stock.Subscribe(func(value int) { fmt.Printf("display:%d\\n", value) })\n_ = unsubscribe\nstock.Subscribe(func(value int) { fmt.Printf("email:%d\\n", value) })\nstock.Set(3)`, `stock := &Stock{}\nunsubscribe := stock.Subscribe(func(value int) { fmt.Printf("display:%d\\n", value) })\nstock.Subscribe(func(value int) { fmt.Printf("email:%d\\n", value) })\nunsubscribe()\nstock.Set(5)`),
  state: stages(`state := "stopped"\nclick := func() { if state == "stopped" { state = "playing" } else { state = "stopped" } }\nclick()\nfmt.Println(state)`, `state := "stopped"\nclick := func() { if state == "playing" { state = "paused" } else { state = "playing" } }\nclick(); click()\nfmt.Println(state)`, state, `player := &Player{Stopped{}}\nplayer.Click()\nfmt.Println(player.state.Name())`, `player := &Player{Stopped{}}\nplayer.Click(); player.Click()\nfmt.Println(player.state.Name())\nplayer.Click()\nfmt.Println(player.state.Name())`, `${state.replace("p.state = Stopped{}", "p.state = Paused{}")}\ntype Paused struct{}\nfunc (Paused) Name() string { return "paused" }\nfunc (Paused) Click(p *Player) { p.state = Playing{} }`),
  "template-method": stages(`importCsv := func(source string) string { return "saved:" + strings.Join(strings.Split(strings.TrimSpace(source), ","), "|") }\nfmt.Println(importCsv(" A,B "))`, `importCsv := func(source string) string { return "saved:" + strings.Join(strings.Split(strings.TrimSpace(source), ","), "|") }\nimportJson := func(source string) (string, error) {\n  var rows []string\n  err := json.Unmarshal([]byte(strings.TrimSpace(source)), &rows)\n  if err != nil { return "", err }; return "saved:" + strings.Join(rows, "|"), nil\n}\nfmt.Println(importCsv(" A,B "))\nresult, err := importJson("[\\\"A\\\",\\\"B\\\"]")\nif err != nil { panic(err) }; fmt.Println(result)`, template, `result, err := (Importer{CsvTransformer{}}).ImportData(" A,B ")\nif err != nil { panic(err) }; fmt.Println(result)`, `result, err := (Importer{JsonTransformer{}}).ImportData("[\\\"A\\\",\\\"B\\\"]")\nif err != nil { panic(err) }; fmt.Println(result)`),
  visitor: [program(`type FileNode struct { name string; size int }\nfunc (f FileNode) Total() int { return f.size }\ntype Folder struct { children []FileNode }\nfunc (f Folder) Total() int { total := 0; for _, child := range f.children { total += child.Total() }; return total }`, `folder := Folder{[]FileNode{{"notes", 10}}}\nfmt.Println(folder.Total())`), program(`type FileNode struct { name string; size int }\nfunc (f FileNode) Total() int { return f.size }\nfunc (f FileNode) ExportName() string { return f.name }\ntype Folder struct { children []FileNode }\nfunc (f Folder) Total() int { total := 0; for _, child := range f.children { total += child.Total() }; return total }\nfunc (f Folder) ExportName() string { names := []string{}; for _, child := range f.children { names = append(names, child.ExportName()) }; return strings.Join(names, ",") }`, `folder := Folder{[]FileNode{{"notes", 10}}}\nfmt.Println(folder.Total())\nfmt.Println(folder.ExportName())`), program(visitor, `folder := Folder{[]ElementNode{FileNode{"notes", 10}}}\nfmt.Println(folder.Accept(SizeVisitor{}))`), program(`${visitor}\ntype NameVisitor struct{}\nfunc (NameVisitor) VisitFile(f FileNode) string { return f.name }\nfunc (v NameVisitor) VisitFolder(f Folder) string {\n  names := []string{}\n  for _, child := range f.children { names = append(names, child.Accept(v)) }\n  return strings.Join(names, ",")\n}`, `folder := Folder{[]ElementNode{FileNode{"notes", 10}}}\nfmt.Println(folder.Accept(NameVisitor{}))`)]
};
