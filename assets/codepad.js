/* Python Space Quest: Code Pad
   A Python editor that runs real Python in the browser (Pyodide, hosted in assets/pyodide).
   Adds a floating "Code Pad" button, a slide-up editor with symbol keys, and a
   "Try it" button on every code example. input() answers are typed into a pop-up box. */
(function(){
  const PAD_KEY = "pyquest-pad";
  const base = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/codepad\.js.*$/,"") : "assets/";
  const PYODIDE_URL = base + "pyodide/";

  // ---------- build the UI ----------
  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "pad-fab"; fab.setAttribute("aria-controls","codepad");
  fab.innerHTML = '<span aria-hidden="true">▶</span> Code Pad';

  const pad = document.createElement("section");
  pad.id = "codepad"; pad.className = "pad"; pad.hidden = true;
  pad.setAttribute("aria-label","Code Pad: write and run Python");
  pad.innerHTML = `
    <div class="pad-inner">
      <div class="pad-head">
        <h3>Code Pad</h3>
        <span class="pad-status" id="pad-status" aria-live="polite">Python starts when you tap Run</span>
        <button type="button" class="pad-close" id="pad-close" aria-label="Close Code Pad">✕</button>
      </div>
      <label for="pad-code" class="sr-only">Your Python code</label>
      <textarea id="pad-code" class="pad-code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" placeholder='Type your code here, like:  print("Hello!")'></textarea>
      <div class="pad-keys" role="group" aria-label="Symbol keys"></div>
      <div class="pad-actions">
        <button type="button" class="btn pad-run" id="pad-run">▶ Run</button>
        <button type="button" class="btn ghost small" id="pad-clear">Clear code</button>
        <button type="button" class="btn ghost small" id="pad-undo" hidden>Undo clear</button>
      </div>
      <pre class="out pad-out" id="pad-out" aria-live="polite"></pre>
    </div>`;
  document.body.appendChild(fab);
  document.body.appendChild(pad);

  const $ = id => document.getElementById(id);
  const code = $("pad-code"), out = $("pad-out"), status = $("pad-status"), runBtn = $("pad-run");

  try{ code.value = localStorage.getItem(PAD_KEY) || ""; }catch(e){}
  code.addEventListener("input", ()=>{ try{ localStorage.setItem(PAD_KEY, code.value); }catch(e){} });

  function openPad(){ pad.hidden = false; fab.hidden = true; document.body.classList.add("pad-open"); warmUp(); }
  function closePad(){ pad.hidden = true; fab.hidden = false; document.body.classList.remove("pad-open"); fab.focus(); }
  fab.addEventListener("click", ()=>{ openPad(); code.focus(); });
  $("pad-close").addEventListener("click", closePad);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && !pad.hidden) closePad(); });

  // Symbol keys (like the extra key row in coding apps)
  const KEYS = [["(",")"],['"','"'],[":"],["="],["+"],["-"],["*"],["/"],["#"],["_"],[","],["[","]"],["'","'"],["Tab","    "]];
  const keyRow = pad.querySelector(".pad-keys");
  KEYS.forEach(k=>{
    const b=document.createElement("button"); b.type="button"; b.textContent=k[0];
    b.setAttribute("aria-label", k[0]==="Tab" ? "Indent (4 spaces)" : "Insert "+k[0]+(k[1]&&k[0]!=="Tab"?k[1]:""));
    b.addEventListener("pointerdown", e=>e.preventDefault()); // keep the keyboard open
    b.addEventListener("click", ()=>{
      const s=code.selectionStart, en=code.selectionEnd;
      if(k[0]==="Tab"){ code.setRangeText(k[1], s, en, "end"); }
      else if(k.length===2){ const inner=code.value.slice(s,en); code.setRangeText(k[0]+inner+k[1], s, en, "end"); if(!inner){ code.selectionStart=code.selectionEnd=s+1; } }
      else code.setRangeText(k[0], s, en, "end");
      code.focus(); code.dispatchEvent(new Event("input"));
    });
    keyRow.appendChild(b);
  });

  // Enter keeps the indent, and adds 4 spaces after a line ending in ":"
  code.addEventListener("keydown", e=>{
    if(e.key==="Enter" && !e.shiftKey){
      const s=code.selectionStart, line=code.value.slice(0,s).split("\n").pop();
      let indent=(line.match(/^ */)||[""])[0]; if(/:\s*$/.test(line)) indent+="    ";
      if(indent){ e.preventDefault(); code.setRangeText("\n"+indent, s, code.selectionEnd, "end"); code.dispatchEvent(new Event("input")); }
    } else if(e.key==="Tab"){ e.preventDefault(); code.setRangeText("    ", code.selectionStart, code.selectionEnd, "end"); code.dispatchEvent(new Event("input")); }
  });

  let lastCleared = "";
  $("pad-clear").addEventListener("click", ()=>{ if(!code.value) return; lastCleared=code.value; code.value=""; code.dispatchEvent(new Event("input")); out.textContent=""; $("pad-undo").hidden=false; code.focus(); });
  $("pad-undo").addEventListener("click", ()=>{ code.value=lastCleared; code.dispatchEvent(new Event("input")); $("pad-undo").hidden=true; });

  // "Try it" buttons on code examples
  document.querySelectorAll(".codebox").forEach(box=>{
    const pre = box.querySelector("pre.code"); if(!pre) return;
    const b=document.createElement("button"); b.type="button"; b.className="tryit"; b.textContent="▶ Try it";
    b.addEventListener("click", ()=>{
      openPad(); code.value = pre.textContent.replace(/\s+$/,"") + "\n"; code.dispatchEvent(new Event("input"));
      out.textContent=""; $("pad-undo").hidden=true; code.focus(); code.setSelectionRange(code.value.length, code.value.length);
    });
    box.appendChild(b);
  });

  // ---------- Python ----------
  let pyReady = null, py = null;
  let echo = ""; // text printed since the last newline, used as the input() question
  function write(text, cls){
    if(cls){ const s=document.createElement("span"); s.className=cls; s.textContent=text; out.appendChild(s); }
    else out.appendChild(document.createTextNode(text));
    out.scrollTop = out.scrollHeight;
  }
  function warmUp(){
    if(pyReady) return pyReady;
    status.textContent = "Getting Python ready… (slow only the first time)";
    pyReady = new Promise((resolve, reject)=>{
      const s=document.createElement("script"); s.src=PYODIDE_URL+"pyodide.js";
      s.onload = ()=> window.loadPyodide({indexURL: PYODIDE_URL}).then(resolve, reject);
      s.onerror = ()=> reject(new Error("download"));
      document.head.appendChild(s);
    }).then(p=>{
      py = p;
      const dec = new TextDecoder();
      p.setStdout({ write: buf=>{ const t=dec.decode(buf); write(t); echo = (echo + t).split("\n").pop(); return buf.length; } });
      p.setStderr({ write: buf=>{ write(dec.decode(buf), "pad-err"); return buf.length; } });
      p.setStdin({ stdin: ()=>{
        const question = echo.trim() || "Py-Bot is asking you something:";
        let ans = window.prompt(question, "");
        if(ans === null) ans = "";
        write(ans + "\n", "typed"); echo = "";
        return ans;
      }});
      status.textContent = "Python is ready";
      return p;
    }).catch(err=>{
      pyReady = null;
      status.textContent = "Python couldn't load. Check the internet connection, then tap Run again.";
      throw err;
    });
    return pyReady;
  }

  function friendlyError(msg){
    // Keep only the part about the learner's code, not Pyodide's internals.
    const lines = msg.split("\n");
    let start = lines.findIndex(l=>l.includes('File "<exec>"'));
    if(start<0) start = Math.max(0, lines.length-2);
    const kept = lines.slice(start).filter(l=>l.trim()!=="")
      .map(l=>l.replace('File "<exec>", ',"").replace(/^\s{2}/,""))
      .filter(l=>!/^\s*line \d+(, in <module>)?\s*$/.test(l));
    const last = kept[kept.length-1] || msg;
    const lineNo = (msg.match(/File "<exec>", line (\d+)(?![\s\S]*File "<exec>")/)||[])[1];
    return {detail: kept.join("\n"), last, lineNo};
  }

  runBtn.addEventListener("click", async ()=>{
    let src = code.value;
    if(!src.trim()){ out.textContent=""; write("Type some code first, then tap ▶ Run.\n","pad-note"); return; }
    if(/[“”‘’]/.test(src)){ src = src.replace(/[“”]/g,'"').replace(/[‘’]/g,"'"); code.value = src; code.dispatchEvent(new Event("input")); }
    runBtn.disabled = true; out.textContent = ""; echo = "";
    try{
      await warmUp();
      status.textContent = "Running…";
      await new Promise(r=>setTimeout(r,30)); // let the screen update first
      const globals = py.globals.get("dict")();
      try{
        py.runPython(src, {globals});
        status.textContent = "Done ✓";
        if(!out.textContent) write("(Your program ran, but it didn't print anything.)\n","pad-note");
      }catch(err){
        const e = friendlyError(String(err && err.message || err));
        write((out.textContent && !out.textContent.endsWith("\n")) ? "\n" : "");
        write("🐛 Bug clue" + (e.lineNo ? " on line " + e.lineNo : "") + ":\n", "pad-err-title");
        write(e.detail + "\n", "pad-err");
        status.textContent = "Found a bug clue. Read the red text!";
      }finally{ globals.destroy(); }
    }catch(e){ /* status already explains the download problem */ }
    runBtn.disabled = false;
  });
})();
