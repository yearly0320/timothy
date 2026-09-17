# Timothy Li 个人主页 (v2)

纯静态网站，两个页面 + 几个共享文件，不依赖任何后端、任何框架、任何构建工具：

```
index.html   主页：关于 / 经历 / 项目
chat.html    独立的 AI 问答页（对应 xiehaoyu.cn/chat 那种体验）
style.css    两个页面共用的样式（深浅蓝主题、悬停动效、光斑跟随等都在这里）
main.js      两个页面共用的交互逻辑（主题切换、滚动进场动画、鼠标光斑）
chat.js      仅 chat.html 用：问答界面的渲染与占位问答逻辑
data.js      共享的"个人资料摘要"文本 + AI 问答的预设问答库，改内容主要改这个文件
```

用浏览器直接打开 `index.html` 就能看效果（点"AI 问答"会跳到 `chat.html`），也可以用 GitHub Pages 免费托管成一个别人能直接访问的网址。

## 这版做了什么改动

对照 https://xiehaoyu.cn 的效果，这一版加上了：

- **配色改成蓝色基调**：浅色是浅蓝灰背景 + 蓝色强调色，深色是深蓝背景 + 亮蓝强调色（不是完全照抄参考站深色模式的薄荷绿，因为你要的是"深蓝或浅蓝"）。
- **鼠标跟随的光斑效果**：光标移动时，页面背景会有一小片淡蓝色光晕跟着走（`main.js` 里监听 `mousemove`，把坐标写进一个 CSS 变量，`style.css` 里的 `radial-gradient` 背景读这个变量）。触屏设备和开启了"减少动效"系统设置的用户会自动跳过这个效果。
- **导航悬停动效**：侧边栏每个导航项左边有一条小短线，鼠标移上去/点中当前板块时线会变长、文字变色并轻微右移，"AI 问答"那一项还带一个常驻的小圆点呼吸动画（跟参考站一致）。
- **项目卡片的"聚光灯"效果**：鼠标移到项目区域时，没被指到的卡片会整体变暗，只有鼠标正下方那张保持清晰——纯 CSS 实现，不需要 JS。
- **滚动进场动画**：内容区块首次滚动进入视口时会从"稍微下移+透明"淡入到正常状态，经历区的几条时间线卡片还做了依次错开的入场延迟。
- **独立的 AI 问答页面**（`chat.html`）：还原了参考站 `/chat` 那种体验——顶部条（返回按钮/标题/在线状态）、居中的头像和欢迎语、几个"猜你想问"的建议按钮、底部悬浮输入框。

## 关于 AI 问答（仍然是占位版本）

跟上一版一样：`data.js` 里的 `TIMOTHY_FAQ` 是一批关键词到预设回答的映射，用户提问命中关键词就回答，不命中就提示邮件联系你。**不调用任何外部服务，不需要 API Key，可以直接免费部署上线。**

想接真实大模型 API（像 xiehaoyu.cn 那样自由问答），需要三步，跟上一版说明一致：

1. **拿一个大模型 API Key**——比如 [DeepSeek 开放平台](https://platform.deepseek.com/)，价格便宜，接口兼容 OpenAI 格式。
2. **搭一个很小的中转后端**（这一步不能省，见下面的安全提醒）——最简单是用 [Vercel](https://vercel.com/) 的免费 Serverless Function，写一个 `api/chat.js`，收到前端问题后用你的 API Key 调用 DeepSeek 接口，把回答传回来。
3. **改 `chat.js`**：把 `askAI()` 函数里 `return getFaqAnswer(question)` 换成一个 `fetch("你部署好的接口地址", {...})` 的真实请求，解析返回的文本即可。

**⚠️ 安全提醒**：API Key 绝对不能直接写在 `chat.js` / `data.js` / `index.html` 这些前端文件里再发布出去——任何打开你网站的人按 F12 开发者工具就能看到全部源码，包括你写死的 Key。真实 API 必须经过你自己的后端/云函数中转，Key 只存在后端环境变量里，前端永远看不到，第 2 步就是干这个用的，不要跳过。

## 怎么改内容

- **关于我 / 技能标签**：`index.html` 里搜 `id="about"`。
- **经历（工作/教育）**：搜 `id="experience"`，每段 `<div class="tl-item reveal">...</div>` 是一条经历，复制整块就能加新的。
- **项目**：搜 `id="projects"`，每段 `<div class="proj-card reveal">...</div>` 是一张项目卡片。
- **AI 问答的预设问题和回答**：改 `data.js` 里的 `TIMOTHY_FAQ` 数组，每一项是 `{keywords: [...], answer: "..."}`，命中任意一个关键词就用这条回答；`TIMOTHY_SUGGESTIONS` 是 chat 页面顶部那几个建议问题按钮。
- **邮箱/联系方式**：两个 HTML 文件里搜 `mailto:` 替换。
- **配色**：`style.css` 最上面 `:root{...}` 和 `[data-theme="dark"]` 两块，改里面的十六进制颜色值即可，浅色/深色分开改。

改完直接刷新浏览器看效果，不需要装任何东西、不需要"编译"。

## 部署到 GitHub Pages（免费，别人可以直接访问）

1. **注册 GitHub 账号**（如果还没有）：https://github.com/signup
2. **新建仓库**：登录后点右上角 `+` → `New repository`，仓库名随便取（想让网址是 `你的用户名.github.io` 就精确用这个名字），选 Public，不勾"Add a README"，点 `Create repository`。
3. **上传全部 7 个文件**（`index.html`、`chat.html`、`style.css`、`data.js`、`main.js`、`chat.js`、`README.md`）：仓库页面点 `uploading an existing file`，把这几个文件一起拖进去，写个提交说明，点 `Commit changes`。
   - 命令行方式：
     ```
     cd 这个文件夹的路径
     git init
     git add .
     git commit -m "first commit"
     git branch -M main
     git remote add origin https://github.com/你的用户名/仓库名.git
     git push -u origin main
     ```
4. **开启 Pages**：仓库 `Settings` → 左侧 `Pages` → `Build and deployment` 下 `Source` 选 `Deploy from a branch` → `Branch` 选 `main` / `/(root)` → `Save`。
5. 等 1-2 分钟刷新这个设置页，会出现网址：
   - 仓库名是 `你的用户名.github.io` → 网址是 `https://你的用户名.github.io/`
   - 仓库名是别的 → 网址是 `https://你的用户名.github.io/仓库名/`
6. 打开这个网址——别人也能看，不需要登录任何账号，也不依赖 Claude。

之后改了文件重新上传/`git push`，一两分钟后网站自动更新。

### 绑定自己的域名（可选）

`Settings → Pages` 页面的 `Custom domain` 填你的域名，再去域名服务商那边把 DNS 解析指向 GitHub Pages（GitHub 官方文档 "Managing a custom domain for your GitHub Pages site" 有详细步骤）。没有域名用免费的 `github.io` 网址完全够用。
