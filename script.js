(function () {
  "use strict";

  // ================== 主题切换 ==================
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");

  function applyStoredTheme() {
    try {
      var saved = localStorage.getItem("timothy-theme");
      if (saved === "dark" || saved === "light") {
        root.setAttribute("data-theme", saved);
      }
    } catch (e) {}
  }
  applyStoredTheme();

  themeBtn.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var isDark =
      current === "dark" ||
      (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("timothy-theme", next);
    } catch (e) {}
  });

  // ================== 导航高亮（滚动监听）==================
  var navLinks = document.querySelectorAll("nav.sections a, .mobile-nav a");
  var sections = document.querySelectorAll("main section");

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-target") === id);
    });
  }

  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      obs.observe(s);
    });
  }

  // ================== AI 问答（占位版本）==================
  //
  // 当前是纯前端关键词匹配的占位问答，不请求任何外部服务，可以直接部署。
  // 之后要接真实大模型 API（比如 DeepSeek / OpenAI / Kimi 等），把下面
  // callRealAI() 里注释掉的示例代码打开、填上你自己的 API Key 和 endpoint，
  // 再把 askAI() 末尾那行 return getFaqAnswer(question) 换成
  // return callRealAI(question) 即可。
  //
  // 【重要安全提醒】API Key 千万不要直接写在这个前端 JS 文件里再发布出去——
  // 任何打开网页的人按 F12 都能看到并盗用你的 Key。真要接真实 API，正确做法是：
  // 自己搭一个很小的后端/云函数（Vercel Serverless Function、Cloudflare
  // Worker 都可以免费用），把 API Key 放在后端环境变量里，前端只调用你自己
  // 这个中转接口。README.md 里有更详细的说明。

  var PROFILE_TEXT = [
    "我是李烨（Timothy Li），香港城市大学数据科学硕士在读，预计2027年2月毕业；本科中南大学地理信息科学(GIS)专业。",
    "AfterShip实习(2026.05至今，Engineering-Operations Intern，Carrier团队)：核心工作是把全球物流商的原始轨迹消息翻译成标准化事件体系。",
    "主要项目包括：跨Source规则库复用分析(自建MCR/CWCR指标，USPS规则库从8套精简到2套，BigQuery查询成本降低6倍)；",
    "YunExpress Raw Tag语义分析(处理近2亿条checkpoint数据，产出5条可执行修正建议)；",
    "独立完成20+个物流商的标注与系统集成，并作为eBay/OC紧急需求的唯一对接人；",
    "自建Python自动化工具链和2个内部HTML小工具替代重复人工操作。",
    "个人项目方面做过抖音电商用户行为分析(RFM模型)、支付宝AB测试效果分析(260万+行数据)、优衣库销售数据分析、英国交通事故K-Means聚类分析。",
    "技术栈：Python、SQL、BigQuery、Tableau、Excel、HTML/JS，并习惯用AI辅助编程(vibe coding)提效。"
  ].join("");

  var FAQ = [
    {
      keywords: ["aftership", "实习", "工作", "carrier"],
      answer:
        "在 AfterShip Carrier 团队做数据分析实习：核心是把物流商杂乱的原始状态信息，翻译、验证成统一的标准事件体系。做过的主要事情包括——自建指标分析多个物流商跨接入渠道的规则复用性（推动维护成本大幅下降，查询成本降低约6倍）；对平台 Top5 大 carrier 做过近2亿条数据的语义分析；独立完成20+个物流商的标注与系统集成；还自己写了一套 Python 工具链和2个内部小工具替代重复人工操作。"
    },
    {
      keywords: ["技术栈", "擅长", "技能", "工具"],
      answer:
        "主要技术栈是 Python（Pandas/NumPy）、SQL、BigQuery，日常也用 Tableau、Excel 做可视化分析；写过 Google Sheets 自动化脚本和几个内部 HTML 小工具。习惯借助 AI 辅助编程（vibe coding）来加速开发，但会自己把核心逻辑和取数口径过一遍。"
    },
    {
      keywords: ["时间序列", "机器学习", "rnn", "建模", "预测"],
      answer:
        "目前公开的项目里还没有专门的时间序列/深度学习项目，这块是我在校课程里覆盖到的方向（时间序列与循环神经网络课程），计划后续再补一个完整的建模项目。已完成的项目更偏经营分析、A/B 测试和聚类分析这类。"
    },
    {
      keywords: ["教育", "学校", "学历", "专业", "大学"],
      answer:
        "本科在中南大学读地理信息科学（GIS），2021-2025；目前在香港城市大学读数据科学硕士，预计2027年2月毕业，核心课程包括统计机器学习、数据挖掘、时间序列与RNN、数据探索性分析与可视化、数据库系统等。"
    },
    {
      keywords: ["项目", "作品"],
      answer:
        "公开项目包括：抖音电商用户行为分析（RFM模型8类分层）、支付宝营销AB测试效果分析（260万+行数据）、优衣库全维度销售数据分析、英国道路交通事故统计分析（K-Means聚类）——具体可以翻上面「项目」这一节，每个都有量化指标。"
    }
  ];

  function getFaqAnswer(question) {
    var q = question.toLowerCase();
    for (var i = 0; i < FAQ.length; i++) {
      var hit = FAQ[i].keywords.some(function (kw) {
        return q.indexOf(kw) !== -1;
      });
      if (hit) return FAQ[i].answer;
    }
    return (
      "这个问题目前还没有预设回答（占位版本只覆盖了几个常见问题）。" +
      "可以直接邮件联系我：13576203570@163.com，或者接入真实的大模型 API 之后我就能自由回答任何问题了。"
    );
  }

  // 真实 API 接入示例（默认不启用，仅供参考）：
  //
  // async function callRealAI(question) {
  //   const resp = await fetch("https://你自己的后端地址/api/chat", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       system: "你是李烨的个人主页问答助手，用第一人称回答，仅依据以下资料：" + PROFILE_TEXT,
  //       question: question
  //     })
  //   });
  //   const data = await resp.json();
  //   return data.answer;
  // }

  async function askAI(question) {
    // 模拟一点点"思考"延迟，体验上更像真的在回答
    await new Promise(function (resolve) {
      setTimeout(resolve, 500);
    });
    return getFaqAnswer(question);
  }

  var log = document.getElementById("chatLog");
  var input = document.getElementById("chatInput");
  var sendBtn = document.getElementById("chatSend");
  var suggestWrap = document.getElementById("chatSuggest");
  var busy = false;

  function addMsg(text, cls) {
    var div = document.createElement("div");
    div.className = "msg " + cls;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    input.disabled = state;
  }

  async function ask(question) {
    if (!question || busy) return;
    addMsg(question, "user");
    input.value = "";
    setBusy(true);
    var botDiv = addMsg("思考中…", "bot");

    try {
      var answer = await askAI(question);
      botDiv.textContent = answer;
    } catch (err) {
      botDiv.textContent =
        "这个问题暂时没能回答上，可以邮件联系我：13576203570@163.com。";
    }
    setBusy(false);
    log.scrollTop = log.scrollHeight;
  }

  sendBtn.addEventListener("click", function () {
    ask(input.value.trim());
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") ask(input.value.trim());
  });
  suggestWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-q]");
    if (btn) ask(btn.getAttribute("data-q"));
  });
})();
