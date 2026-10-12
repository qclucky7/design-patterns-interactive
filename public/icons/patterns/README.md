# Pattern marks

23 original geometric SVG marks for the homepage directory. These are visual
mnemonics, not UML diagrams or replacements for the lessons. They extend the
accepted four-block brand; navigation and action icons still use Radix Icons.

Each asset has a 64 × 64 viewBox, a transparent background, a 2.5-unit stroke,
square corners, charcoal `#191d22`, and one blue accent `#315dce`. Avoid text,
external references, embedded raster images, scripts, filters and animations.
The homepage displays them at 40 × 40 CSS pixels, with an empty alt because the
adjacent localized heading names the link. Each SVG includes a descriptive
metadata element for people editing the asset.

The pattern registry in `src/data/patterns.ts` supplies `icon` from the slug.
To add a pattern, register it there and add `<slug>.svg` to this directory.
No locale-specific images or page-level switch statement are needed.

| Pattern | Visual idea |
| --- | --- |
| Singleton | References converge on one instance |
| Factory Method | Creation delegates to different products |
| Abstract Factory | Separate compatible product families |
| Builder | Parts assemble into one finished object |
| Prototype | Original and matching copy |
| Adapter | Different interfaces join through conversion |
| Bridge | Two independently extensible sides |
| Composite | Recursive branches and leaves |
| Decorator | Nested wrappers around a core |
| Facade | One entry point above subsystems |
| Flyweight | Many contexts reuse a shared core |
| Proxy | Access goes through a representative |
| Chain of Responsibility | Linked handlers pass a request onward |
| Command | An action is packaged between invoker and receiver |
| Interpreter | A composite expression tree |
| Iterator | A cursor traverses an enclosed collection |
| Mediator | Peers coordinate through a central hub |
| Memento | A snapshot and a return path |
| Observer | A publisher fans out notifications |
| State | Transitions among possible behaviors |
| Strategy | One selected algorithm, other interchangeable choices |
| Template Method | Fixed sequence with one extension point |
| Visitor | External operations visit different elements |
