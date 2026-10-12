# 项目开发规范

本文件是开发者与 AI 编码代理共同遵循的项目约定。`CLAUDE.md` 引用本文件，不维护另一份规则。具体需求优先于这里的默认约定；发现冲突时说明原因，不擅自扩大改动范围。

## 1. 项目目标与边界

- 这是通过阅读、图解、交互实验与代码讲解设计模式的网站，不是代码运行平台。
- 当前内容包含 23 种 GoF 设计模式、7 大面向对象设计原则（SOLID + 2）和 10 组模式对比。
- 网站内容支持中文和英文；代码示例支持 TypeScript、Python、Java、Go。两种语言选择彼此独立。
- 教学步骤联动结构图、说明与代码快照。独立实验操作不代表已经实现运行过程逐行追踪，不要在文案中夸大功能。
- 当前只有浅色主题。未经需求确认，不添加暗色模式、账号、数据库、在线编译或新的后台服务。

## 2. 开始工作前

1. 阅读本文件、`package.json` 和任务涉及的现有组件、注册表、语言资源。
2. 使用 `git status --short` 检查已有改动，保留用户工作，不覆盖无关修改。
3. 涉及 Next.js 代码时，先完整阅读 `node_modules/next/dist/docs/` 中与任务相关的指南。以本地安装版本为准，不凭旧版经验写 API。
4. 先说明改动目标与范围；较大的任务先制定小步实施计划。临时计划可放在被 Git 忽略的 `docs/`，不要让公开 README 依赖它。
5. 区分用户请求：解释、检查和诊断不自动授权实施改动；实现请求则包含合理的编码与验证步骤。

## 3. UI 必须使用设计 skill

所有网站 UI 设计、页面重构及视觉调整，必须使用 **`design-taste-frontend`**，不能只凭默认模板生成界面。纯文案校正、数据校验或非视觉逻辑修改不强制触发。

### 安装与发现

来源：[leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill)。官方安装命令：

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

- 安装时选择正在使用的编码工具与需要的作用域，不默认安装整个仓库的所有 skills。
- 优先通过当前编码工具提供的 skill 安装机制安装；上面的命令作为可用的官方安装入口。
- 通过环境的 skill 列表确认安装结果，按其实际路径读取 `SKILL.md`，不要把某位开发者的用户名或绝对路径写进项目配置。
- 历史环境可能安装为 `taste-skill/SKILL.md`，名称以文件 frontmatter 中的 `name: design-taste-frontend` 为准，而不是目录名。
- 已安装时直接使用，不自动更新或覆盖。未安装或无法读取时，先说明情况并请用户安装或确认安装，不假装已经使用。
- Skill 是开发指导，不是网站运行依赖，不加入 `package.json`，也不把第三方 skill 源码直接复制到仓库。

### 使用流程与项目视觉约束

1. 改 UI 前说明为什么使用该 skill，完整阅读 `SKILL.md` 及它要求的相关参考。
2. 给出简短设计判断，并按当前任务明确布局变化、动效强度和内容密度；不要每次默认重做整站。
3. 保留已接受的 Logo、字体、黑白为主的配色和单一蓝色强调，优先优化教学层级与阅读体验。
4. 动画简约且有教学意义，尊重减少动态效果设置。不要添加无意义循环动效、装饰性图表或重复信息。
5. 桌面详情采用左右独立滚动，外层不能再产生空白滚动尾巴；1024px 及以下采用上下排列与整页滚动。
6. 检查手机、长英文、中文字体、控件对齐、键盘焦点和菜单截断。实际打开页面验证，不以构建成功代替视觉检查。
7. 完成后简述设计变化与验证结果。Skill 的通用默认不能覆盖项目明确的浅色主题、SVG 教学图和现有品牌要求。

## 4. 成熟库优先，不重复造轮子

已有成熟框架或库能解决的通用能力，优先使用其官方 API 和现成能力。不要自制 i18n、下拉框、弹窗、搜索引擎、语法高亮或图布局算法。

| 能力 | 项目约定 |
| --- | --- |
| 路由、服务端渲染与 SEO | Next.js App Router |
| 网站多语言 | next-intl，JSON 语言资源与现有路由配置 |
| Select、Dialog、Accordion、Tabs | 已安装的 Radix UI primitives |
| 图节点、连线与交互视图 | React Flow（`@xyflow/react`） |
| 自动图布局 | `@dagrejs/dagre`，沿用服务端布局数据 |
| 代码高亮 | react-syntax-highlighter 的 Prism Light，按需注册 grammar |
| 代码差异 | `diff`，不手写 diff 算法 |
| 代码复制兼容 | `clipboard-polyfill`，沿用现有错误与成功反馈 |
| 正文章节目录 | Tocbot 从真实标题生成 |
| 全站搜索 | Pagefind 和官方 `@pagefind/component-ui` |
| 动画 | Motion；简单 SVG 组合沿用现有组件 |
| 通用界面图标 | 现有 Radix 图标；语言图标沿用 Devicon |

- 先查 `package.json`、现有封装和官方文档，再引入新依赖。确需新增时说明用途、体积和许可，不为一个小组件引入完整 UI 框架。
- 库已提供的功能使用库自带实现。库不提供时才写薄业务适配层，例如代码块的语言工具栏、模式专属操作与反馈。
- 不同时维护两套完成同一任务的库；迁移库时移除真正不再使用的依赖，保留相关许可。
- 本项目自己的教育 SVG、Logo、模式图标与实验逻辑是业务内容，不要求第三方组件覆盖所有教学差异。

## 5. 代码编写约定

- 使用 TypeScript，优先明确的类型与小模块，不用 `any`、类型断言或禁用 lint 掩盖问题。
- 页面和静态教学内容默认是 Server Components；状态、事件、浏览器 API 与动画隔离在带 `"use client"` 的叶子组件。
- 沿用现有 CSS tokens、字体与组件，避免引入第二套主题。局部样式需限定作用域，避免影响其他栏目。
- 页面组件不维护第二份 slug、语言或章节列表；注册表与正文是来源，新增内容应自动进入目录和路由。
- 优先用 `rg` 搜索文件与文本；编辑时使用当前工具支持的补丁机制，尽量小范围修改。
- 定时器、监听、观察器与第三方组件实例必须清理；考虑 Strict Mode、切换语言和重复进入页面。
- 交互需包含必要的禁用、加载、空结果、成功与错误状态，不能仅有理想状态。
- 不将个人机器路径、临时文件、密钥或生产凭据写入源码。测试工具路径用已有环境变量覆盖。
- 不擅自删除文件、重置工作区、提交、推送、创建 PR 或停止用户已经运行的开发服务。

## 6. 内容与扩展的单一来源

### 网站语言

- 所有网站可见文案、SEO 说明及可访问标签放在 `src/i18n/messages/<locale>/`；不要写 `locale === "en" ? 英文 : 中文` 来维护普通文案。
- 语言入口来自 `src/i18n/routing.ts` 的 `localeOptions`，通过 next-intl 导航切换，不能只替换文字而丢失当前路径。
- 新语言复制完整资源并翻译，新增独立消息模块时在 `src/i18n/request.ts` 注册，并接入 `scripts/verify-i18n.mjs`。
- 同一控件在不同栏目保持相同翻译，修改时同步现有语言资源。课程内容可以有差异，共同操作语义不能漂移。

### 模式、原则与对比

- 模式注册：`src/data/patterns.ts`；名称与简介：各语言的 `catalog.json`。
- 通用模式课文：`creational.json`、`structural.json`、`behavioral.json`；策略模式保留专属 `strategy.json` 与页面。
- 结构演变场景：`src/data/pattern-scenes.ts`；模式实验：`src/components/playgrounds/`；实验文案与引导：`playgrounds.json`、`playground-guidance.json`。
- 原则：`src/data/principles.ts` 与 `principles.json`；对比：`src/data/comparisons.ts`、`comparison-scenes.ts` 与 `comparisons.json`。
- 反例与过度设计：`overengineering.json`，字段契约在 `src/data/overengineering.ts`。
- 每个模式必须有自己的问题、思想、操作反馈与误用边界。可以共用章节概念和基础组件，不能用同一套空泛文案和交互冒充所有模式。
- 新增或重命名内容时，同步关联链接、图标、路由、SEO 和检索。不要重新增加外站「延伸阅读」入口，除非用户明确要求。

### 开发语言示例

- 语言定义：`src/code-examples/languages.ts`；通用模式快照：`src/code-examples/patterns/registry.ts`；策略模式：`src/code-examples/registry.ts`。
- 新语言需要真实代码快照、文件扩展名、图标、Prism grammar、输出与执行验证；不展示尚无实现的选项。
- UI 从当前模式实际拥有的示例派生语言下拉，不写固定四种语言的按钮列表。
- Java 与 Go 示例保持可运行文件名（`Main.java`、`main.go`），代码输出与网站显示一致；不能把未经执行的期望结果称为实测结果。

## 7. SEO、搜索与资源

- 保留 HTML `lang`、canonical、hreflang、结构化数据、robots.txt 和 sitemap，正式域名由 `NEXT_PUBLIC_SITE_URL` 提供。
- 公开默认中文路径不带前缀，英文使用 `/en`；不要硬编码一份与 next-intl 配置冲突的 URL 规则。
- `npm run build` 包含搜索索引生成，不用单独的 `next build` 代替完整交付检查。
- `public/pagefind/` 是构建资源，不提交 Git，但必须包含在部署产物中。修改正文后需重新构建或执行 `npm run search:dev`。
- Logo 源文件为 `public/brand/logo.svg`，衍生 favicon 使用 `npm run build:logo` 生成。
- 展示图放在 `assets/screenshots/`，README 不引用被忽略的 `docs/`。中英文 README 内容保持对应。
- 保留 MIT 协议与第三方资源原始声明，尤其是 `public/icons/languages/LICENSE`；不要默认所有外部内容均可重新按 MIT 发布。

## 8. 验证与交付流程

先执行与改动相关的验证，较大的功能执行完整基础检查：

```bash
npm run lint
npx tsc --noEmit
npm run verify:i18n
npm run build
```

再按改动范围选择：

| 改动 | 对应检查 |
| --- | --- |
| TypeScript / Python 示例 | `npm run verify:examples`、`npm run verify:patterns` |
| Java / Go 示例 | `npm run verify:java-go` |
| 模式正文、步骤、页面 | `npm run smoke`、`npm run smoke:patterns` |
| 独立模式实验 | `npm run smoke:playgrounds` |
| 原则页面 | `npm run smoke:principles` |
| 模式对比 | `npm run verify:comparisons`、`npm run smoke:comparisons` |
| 反例与过度设计 | `npm run verify:overengineering`、`npm run smoke:overengineering` |
| 子目录或标题 | `npm run smoke:chapters` |
| 代码展示器 | `npm run smoke:code` |
| 分屏、页面高度或溢出 | `npm run smoke:scroll` |
| 首页 SVG 动画 | `npm run smoke:composition` |
| 模式 / 原则图标 | `npm run smoke:icons`、`npm run smoke:principle-icons` |
| 搜索 | `npm run smoke:search` |

- 浏览器测试需要本地服务与 Chrome；非默认位置用 `CHROME_PATH`。部分脚本支持 `PATTERN_ATLAS_URL`，其他仍使用 3000 端口，运行前查看脚本。
- Python 校验需要 `python` 命令。Java / Go 校验需要对应工具链，可用 `JAVA_BIN`、`GO_BIN` 指定路径。
- 修改 UI 时至少查看中文、英文、桌面与手机；涉及滚动时同时检查短视口、面板底部与路由切换。
- 测试失败先诊断真实原因，不删测试或放宽断言来伪造通过。无法运行的检查明确说明缺少的条件。
- 结束前检查 diff，确认没有无关修改、私密资料或失效链接。交付说明包含改了什么、哪些检查通过、哪些未验证。

## 9. Git 与本地材料

- `AGENTS.md` 与 `CLAUDE.md` 是公开开发约定，应提交到仓库。
- `docs/` 中的临时计划、superpowers 记录和本地维护材料不提交；它们不是项目安装、运行或贡献的前置条件。
- `node_modules/`、`.next/`、`public/pagefind/`、环境文件与缓存按 `.gitignore` 保持忽略。
- 仅改动用户要求的内容；未经明确请求不发布仓库、生成提交或调整他人工作。

以下 Next.js 区块由框架管理，更新本文件时保留原文。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
