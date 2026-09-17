# Timothy Li 个人主页

纯静态的个人主页，三个文件：`index.html`（结构+内容）、`style.css`（样式）、`script.js`（交互逻辑）。不依赖任何后端、任何框架，用浏览器直接打开 `index.html` 就能看效果，也可以直接用 GitHub Pages 免费托管成一个别人能访问的网址。

## 怎么改内容

内容都直接写在 `index.html` 里，用文本编辑器（VS Code / 记事本都行）打开搜对应文字直接改：

- **关于我**：搜 `id="about"`，下面 `<div class="lede">` 里的几段 `<p>` 就是自我介绍。
- **技术栈标签**：紧跟在关于我下面的 `<div class="tag-row">`，每个 `<span class="tag">标签文字</span>` 就是一个标签，加/删/改都直接改这一行。
- **经历（工作/教育）**：搜 `id="experience"`，每一段 `<div class="tl-item">...</div>` 是一条经历（公司/学校名、时间、描述、标签），复制一整块 `tl-item` 就能新增一条。
- **项目**：搜 `id="projects"`，每一段 `<div class="proj-card">...</div>` 是一个项目卡片，同样复制整块就能加新项目。
- **邮箱/联系方式**：搜 `mailto:`，把邮箱地址换成你想展示的。要加 GitHub/其他主页链接，照着旁边的 `<a class="icon-btn" ...>` 那一行复制一个，`href` 换成对应链接。

改完直接刷新浏览器看效果（不需要装任何东西、不需要"编译"），改完了再重新推送到 GitHub 仓库网站就会自动更新（见下面部署部分）。

## 关于"AI 问答"这一节

现在是**占位版本**：`script.js` 里的 `FAQ` 数组是几条预设问答，用户提问时按关键词匹配，命中就回答，不命中就提示邮件联系你——**不调用任何外部 AI 服务，免费、无需 API Key，可以直接部署上线**。

以后想让它变成真的能自由问答的 AI（类似 ChatGPT 那种），需要三步：

1. **拿一个大模型的 API Key**：比较便宜好用的选择是 [DeepSeek 开放平台](https://platform.deepseek.com/)（人民币计费，价格很低），注册后在控制台生成一个 API Key。
2. **搭一个很小的中转后端**（⚠️ 这一步不能省，原因见下面的安全提醒）。最简单的方式是用 [Vercel](https://vercel.com/) 的 Serverless Function（免费额度够用）：新建一个 `api/chat.js` 文件，收到前端传来的问题后，用你的 API Key 去调用 DeepSeek 的接口，再把回答传回前端。Vercel 官网有现成的 Node.js Serverless Function 教程，把"调用 OpenAI"的示例代码换成 DeepSeek 的接口地址和参数即可（DeepSeek 接口是兼容 OpenAI 格式的，改动很小）。
3. **改 `script.js`**：把文件里 `callRealAI()` 那段注释放开、`fetch` 地址换成你部署好的中转接口地址，然后把 `askAI()` 函数最后 `return getFaqAnswer(question)` 改成 `return callRealAI(question)`，保存、推送，就接通了。

**⚠️ 安全提醒（一定要看）**：API Key 绝对不能直接写在 `script.js` 或 `index.html` 里就发布出去——网页是纯前端代码，任何打开你网站的人按浏览器的 F12 开发者工具就能看到里面所有源码，包括你写死的 Key，然后拿去盗刷你的账户额度。所以真实 API 必须经过你自己的后端/云函数中转，Key 只存在后端环境变量里，前端永远看不到。第 2 步的 Serverless Function 就是干这个的，不要跳过。

## 部署到 GitHub Pages（免费，别人可以直接访问）

假设你还没用过 GitHub，完整步骤如下：

1. **注册 GitHub 账号**（如果还没有）：打开 https://github.com/signup 按提示注册。
2. **新建一个仓库（repo）**：登录后点右上角 `+` → `New repository`。仓库名随便取，比如 `my-website`（如果想让网址就是 `你的用户名.github.io`，仓库名要精确写成 `你的用户名.github.io`）。选 Public，不要勾"Add a README"（我们已经有文件了），点 `Create repository`。
3. **把这三个文件传上去**：新建仓库后 GitHub 会给一个空仓库页面，点 `uploading an existing file`，把 `index.html`、`style.css`、`script.js`、这份 `README.md` 四个文件一起拖进去，写个提交说明（比如"first commit"），点 `Commit changes`。
   - 如果你更习惯用命令行：
     ```
     cd 这个文件夹的路径
     git init
     git add .
     git commit -m "first commit"
     git branch -M main
     git remote add origin https://github.com/你的用户名/仓库名.git
     git push -u origin main
     ```
4. **开启 GitHub Pages**：进入这个仓库的 `Settings` → 左侧菜单 `Pages` → `Build and deployment` 下的 `Source` 选 `Deploy from a branch` → `Branch` 选 `main` / `/(root)` → 点 `Save`。
5. 等 1-2 分钟，刷新这个 Pages 设置页面，顶部会出现一行绿色提示和一个网址，形如：
   - 仓库名是 `你的用户名.github.io` 的话，网址就是 `https://你的用户名.github.io/`
   - 仓库名是别的（比如 `my-website`）的话，网址是 `https://你的用户名.github.io/my-website/`
6. 打开这个网址——这就是别人也能看到、完全不需要登录任何账号、不依赖 Claude 的公开网站了。

之后每次改了 `index.html`/`style.css`/`script.js`，重新上传（或者 `git add . && git commit -m "update" && git push`）到同一个仓库，一两分钟后网站会自动更新，不需要重新设置。

### 绑定自己的域名（可选）

如果你自己买了域名（比如在阿里云/腾讯云/Namecheap 等平台），可以在 `Settings → Pages` 页面的 `Custom domain` 里填上你的域名，再去域名服务商那边把 DNS 解析指到 GitHub Pages 提供的地址（GitHub 官方文档 "Managing a custom domain for your GitHub Pages site" 有详细的 DNS 配置步骤）。这一步不是必须的，没有自己的域名用 `github.io` 的免费网址完全够用。
