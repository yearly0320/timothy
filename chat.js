(function () {
  "use strict";

  var scrollArea = document.getElementById("scrollArea");
  var heroBlock = document.getElementById("heroBlock");
  var thread = document.getElementById("thread");
  var suggestGrid = document.getElementById("suggestGrid");
  var input = document.getElementById("chatInput");
  var sendBtn = document.getElementById("chatSend");
  var busy = false;
  var started = false;

  // 渲染建议问题按钮
  (window.TIMOTHY_SUGGESTIONS || []).forEach(function (q) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "suggest-pill";
    btn.textContent = q;
    btn.addEventListener("click", function () { ask(q); });
    suggestGrid.appendChild(btn);
  });

  // 输入框随内容自适应高度
  input.addEventListener("input", function () {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(input.value.trim());
    }
  });
  sendBtn.addEventListener("click", function () { ask(input.value.trim()); });

  function addMsg(text, cls) {
    var div = document.createElement("div");
    div.className = "msg " + cls;
    div.textContent = text;
    thread.appendChild(div);
    scrollArea.scrollTop = scrollArea.scrollHeight;
    return div;
  }

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    input.disabled = state;
  }

  function getFaqAnswer(question) {
    var q = question.toLowerCase();
    var faq = window.TIMOTHY_FAQ || [];
    for (var i = 0; i < faq.length; i++) {
      var hit = faq[i].keywords.some(function (kw) { return q.indexOf(kw) !== -1; });
      if (hit) return faq[i].answer;
    }
    return window.TIMOTHY_FAQ_FALLBACK || "这个问题暂时还没有预设回答。";
  }

  async function askAI(question) {
    await new Promise(function (resolve) { setTimeout(resolve, 450); });
    return getFaqAnswer(question);
  }

  async function ask(question) {
    if (!question || busy) return;
    if (!started) {
      started = true;
      heroBlock.style.display = "none";
    }
    addMsg(question, "user");
    input.value = "";
    input.style.height = "auto";
    setBusy(true);
    var botDiv = addMsg("思考中…", "bot");
    try {
      var answer = await askAI(question);
      botDiv.textContent = answer;
    } catch (e) {
      botDiv.textContent = "这个问题暂时没能回答上，可以邮件联系我：13576203570@163.com。";
    }
    setBusy(false);
    scrollArea.scrollTop = scrollArea.scrollHeight;
  }
})();
