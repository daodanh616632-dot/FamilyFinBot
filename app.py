import os, json, re, subprocess
from datetime import date, datetime
from flask import Flask, render_template_string, request, jsonify, redirect

DATA_FILE = "data.json"
GIT_TOKEN = os.environ.get("GIT_TOKEN", "")
GIT_REPO = os.environ.get("GIT_REPO", "https://github.com/daodanh616632-dot/FamilyFinBot.git")

app = Flask(__name__)

DEFAULT = {
    "wallets": [
        {"id": 1, "name": "Tien mat", "emoji": "💵", "balance": 0},
        {"id": 2, "name": "Ngan hang", "emoji": "🏦", "balance": 0},
        {"id": 3, "name": "The tin dung", "emoji": "💳", "balance": 0},
    ],
    "cats": [
        {"id": 1, "name": "An uong", "emoji": "🍔", "type": "chi"},
        {"id": 2, "name": "Di lai", "emoji": "🚗", "type": "chi"},
        {"id": 3, "name": "Mua sam", "emoji": "🛒", "type": "chi"},
        {"id": 4, "name": "Hoc tap", "emoji": "📚", "type": "chi"},
        {"id": 5, "name": "Giai tri", "emoji": "🎮", "type": "chi"},
        {"id": 6, "name": "Nha cua", "emoji": "🏠", "type": "chi"},
        {"id": 7, "name": "Luong", "emoji": "💰", "type": "thu"},
        {"id": 8, "name": "Thuong", "emoji": "🎁", "type": "thu"},
        {"id": 9, "name": "Thu khac", "emoji": "📥", "type": "thu"},
    ],
    "txns": [], "next_id": 1,
}

def load():
    if os.path.exists(DATA_FILE):
        try: return json.load(open(DATA_FILE, "r", encoding="utf-8"))
        except: pass
    return DEFAULT.copy()

def save(d):
    json.dump(d, open(DATA_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    git_push(d)

def git_push(d):
    if not GIT_TOKEN: return
    try:
        for c in [["git","config","user.name","Bot"],["git","config","user.email","b@f"]]:
            subprocess.run(c, capture_output=True, timeout=10)
        subprocess.run(["git","add",DATA_FILE], capture_output=True, timeout=10)
        subprocess.run(["git","commit","--allow-empty","-m",f"bk {datetime.now():%d/%m/%Y %H:%M}"],
                       capture_output=True, timeout=10)
        if "://" in GIT_REPO:
            _, r = GIT_REPO.split("://",1)
            subprocess.run(["git","remote","set-url","origin",f"https://{GIT_TOKEN}@{r}"],
                           capture_output=True, timeout=10)
            subprocess.run(["git","push","origin","main"], capture_output=True, timeout=30)
    except: pass

def fmt(v):
    if v >= 1_000_000: return f"{v/1_000_000:.1f}tr".replace(".0","")
    return f"{v:,}d".replace(",",".")

HTML = """<!DOCTYPE html>
<html lang="vi" data-theme="light">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>Quan ly chi tieu</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f5f5;padding-bottom:80px}
.header{background:#4CAF50;color:#fff;padding:15px;text-align:center;font-size:18px;font-weight:bold;position:sticky;top:0;z-index:10}
.bal-bar{background:#fff;padding:12px;margin:10px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;gap:8px;overflow-x:auto}
.wallet-box{min-width:100px;text-align:center;padding:8px;background:#f0fdf4;border-radius:8px;flex-shrink:0}
.wallet-box .num{font-size:16px;font-weight:bold;color:#333}
.wallet-box .lb{font-size:11px;color:#888}
.form-box{background:#fff;margin:10px;border-radius:12px;padding:12px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.form-box input,.form-box select{width:100%;padding:10px;margin:4px 0;border:1px solid #ddd;border-radius:8px;font-size:16px}
.btn-row{display:flex;gap:8px;margin-top:8px}
.btn{flex:1;padding:12px;border:none;border-radius:8px;font-size:16px;font-weight:bold;cursor:pointer;color:#fff}
.btn-green{background:#4CAF50}
.btn-orange{background:#FF9800}
.btn-red{background:#f44336}
.btn-gray{background:#9e9e9e}
.filter{display:flex;gap:8px;margin:10px}
.filter button{flex:1;padding:8px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:13px}
.filter button.active{background:#4CAF50;color:#fff;border-color:#4CAF50}
.list{margin:10px}
.item{background:#fff;border-radius:8px;padding:10px;margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,.06);display:flex;align-items:center;gap:10px}
.item .info{flex:1}
.item .amt{font-weight:bold;font-size:16px}
.item .date{font-size:11px;color:#999}
.item .note{font-size:13px;color:#555}
.item .del{color:#f44336;font-size:20px;cursor:pointer;padding:5px}
.thu{color:#4CAF50}.chi{color:#f44336}
.tabs{position:fixed;bottom:0;left:0;right:0;background:#fff;display:flex;border-top:1px solid #eee;z-index:10}
.tabs button{flex:1;padding:12px;border:none;background:#fff;font-size:13px;cursor:pointer;color:#888}
.tabs button.active{color:#4CAF50;font-weight:bold;border-top:2px solid #4CAF50}
.chart-box{background:#fff;margin:10px;border-radius:12px;padding:12px;text-align:center}
.chart-box img{max-width:100%;border-radius:8px}
</style>
</head>
<body>
<div class="header">💰 Quan ly chi tieu</div>

<div class="bal-bar" id="balBar"></div>

<div class="filter">
<button class="active" onclick="setFilter('hom_nay')">Hom nay</button>
<button onclick="setFilter('hom_qua')">Hom qua</button>
<button onclick="setFilter('thang_nay')">Thang nay</button>
<button onclick="setFilter('all')">Tat ca</button>
</div>

<div class="form-box">
<input id="note" placeholder="VD: mua rau 50k, luong 15tr..." onkeydown="if(event.key=='Enter')addTxn()">
<div class="btn-row">
<select id="wallet"></select>
<select id="cat"></select>
</div>
<button class="btn btn-green" onclick="addTxn()">+ Them</button>
</div>

<div id="list" class="list"></div>

<div id="chartBox" class="chart-box" style="display:none">
<div style="font-weight:bold;margin-bottom:8px">📊 Bieu do chi tieu</div>
<img id="chartImg" src="">
</div>

<div class="tabs">
<button class="active" onclick="showTab('list')">📋 Giao dich</button>
<button onclick="showTab('chart')">📊 Bieu do</button>
</div>

<script>
let data = {};
let filter = 'hom_nay';

async function api(url, method='GET', body=null) {
    const opt = {method, headers:{'Content-Type':'application/json'}};
    if(body) opt.body = JSON.stringify(body);
    const r = await fetch(url, opt);
    return r.json();
}

async function loadData() {
    data = await api('/api/data');
    render();
}

function fmt(v) {
    if(v >= 1000000) return (v/1000000).toFixed(1).replace('.0','')+'tr';
    return v.toLocaleString('vi-VN')+'d';
}

function render() {
    // Balances
    let html = '';
    for(const w of data.wallets) {
        html += '<div class="wallet-box"><div class="num">'+fmt(w.balance)+'</div><div class="lb">'+w.emoji+' '+w.name+'</div></div>';
    }
    document.getElementById('balBar').innerHTML = html;

    // Wallet select
    let ws = '<option value="">Chon vi</option>';
    for(const w of data.wallets) ws += '<option value="'+w.id+'">'+w.emoji+' '+w.name+'</option>';
    document.getElementById('wallet').innerHTML = ws;

    // Cat select
    let cs = '<option value="">Chon DM</option>';
    for(const c of data.cats) cs += '<option value="'+c.id+'">'+c.emoji+' '+c.name+'</option>';
    document.getElementById('cat').innerHTML = cs;

    // Filter and show list
    renderList();
}

function setFilter(f) {
    filter = f;
    document.querySelectorAll('.filter button').forEach(b=>b.classList.remove('active'));
    document.querySelector('.filter button[onclick*="'+f+'"]').classList.add('active');
    renderList();
}

function renderList() {
    let txns = data.txns;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const yyyy = today.getFullYear();

    if(filter == 'hom_nay') {
        const t = dd+'/'+mm+'/'+yyyy;
        txns = txns.filter(x=>x.date==t);
    } else if(filter == 'hom_qua') {
        const d = new Date(); d.setDate(d.getDate()-1);
        const t = String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();
        txns = txns.filter(x=>x.date==t);
    } else if(filter == 'thang_nay') {
        const p = mm+'/'+yyyy;
        txns = txns.filter(x=>x.date.endsWith(p));
    }
    txns = txns.reverse();

    let html = '';
    let total = 0;
    for(const t of txns.slice(0,50)) {
        const cls = t.type=='thu'?'thu':'chi';
        const sign = t.type=='thu'?'+':'-';
        total += t.type=='thu'?t.amount:-t.amount;
        html += '<div class="item">'+
            '<div class="info">'+
            '<div class="amt '+cls+'">'+sign+fmt(t.amount)+' <span style="font-weight:normal;font-size:12px;color:#888">'+t.cat_name+'</span></div>'+
            '<div class="note">'+t.note+'</div>'+
            '<div class="date">#'+t.id+' | '+t.date+'</div>'+
            '</div>'+
            '<div class="del" onclick="delTxn('+t.id+')">✕</div>'+
            '</div>';
    }
    if(txns.length == 0) html = '<div style="text-align:center;padding:20px;color:#999">Chua co giao dich</div>';
    document.getElementById('list').innerHTML = html;
}

async function addTxn() {
    const note = document.getElementById('note').value.trim();
    if(!note) return;
    const wallet = document.getElementById('wallet').value;
    const cat = document.getElementById('cat').value;

    // Parse amount from note
    const m = note.match(/([\\d.,]+)\\s*(k|tr|triệu|ngàn|nghìn)?/);
    if(!m) { alert('Khong tim thay so tien. VD: mua rau 50k'); return; }
    let amt = parseInt(m[1].replace(/,/g,'').replace(/\./g,''));
    const sfx = (m[2]||'').toLowerCase();
    if(sfx=='k'||sfx=='ngàn'||sfx=='nghìn') amt *= 1000;
    if(sfx=='tr'||sfx=='triệu') amt *= 1000000;

    data = await api('/api/add', 'POST', {note, amount:amt, wallet_id:wallet?parseInt(wallet):1, cat_id:cat?parseInt(cat):null});
    document.getElementById('note').value = '';
    render();
}

async function delTxn(id) {
    if(!confirm('Xoa giao dich #'+id+'?')) return;
    data = await api('/api/del/'+id, 'DELETE');
    render();
}

function showTab(tab) {
    document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
    if(tab=='list') {
        document.querySelector('.tabs button:nth-child(1)').classList.add('active');
        document.getElementById('list').style.display = 'block';
        document.getElementById('chartBox').style.display = 'none';
    } else {
        document.querySelector('.tabs button:nth-child(2)').classList.add('active');
        document.getElementById('list').style.display = 'none';
        document.getElementById('chartBox').style.display = 'block';
        loadChart();
    }
}

async function loadChart() {
    const r = await fetch('/api/chart');
    const d = await r.json();
    if(d.image) document.getElementById('chartImg').src = 'data:image/png;base64,'+d.image;
}

loadData();
</script>
</body>
</html>"""

@app.route("/")
def index(): return HTML

@app.route("/api/data")
def get_data():
    d = load()
    return jsonify(d)

@app.route("/api/add", methods=["POST"])
def add_txn():
    d = load()
    j = request.json
    note = j.get("note","")
    amount = int(j.get("amount", 0))
    wallet_id = int(j.get("wallet_id", 1))
    cat_id = j.get("cat_id")

    # Auto classify
    if not cat_id:
        nl = note.lower()
        for c in d["cats"]:
            if c["name"].lower() in nl: cat_id = c["id"]; break
        if not cat_id: cat_id = 1

    cat = next(c for c in d["cats"] if c["id"] == cat_id)
    wallet = next(w for w in d["wallets"] if w["id"] == wallet_id)

    tx = {
        "id": d["next_id"], "date": date.today().strftime("%d/%m/%Y"),
        "datetime": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "amount": amount, "cat_id": cat_id, "cat_name": cat["name"],
        "wallet_id": wallet_id, "note": note[:120], "type": cat["type"],
    }
    d["txns"].append(tx)
    d["next_id"] += 1
    if cat["type"] == "thu": wallet["balance"] += amount
    else: wallet["balance"] -= amount
    save(d)
    return jsonify(d)

@app.route("/api/del/<int:txn_id>", methods=["DELETE"])
def del_txn(txn_id):
    d = load()
    for i, t in enumerate(d["txns"]):
        if t["id"] == txn_id:
            w = next((x for x in d["wallets"] if x["id"] == t["wallet_id"]), None)
            if w:
                if t["type"] == "thu": w["balance"] -= t["amount"]
                else: w["balance"] += t["amount"]
            d["txns"].pop(i)
            save(d)
            break
    return jsonify(d)

@app.route("/api/chart")
def chart():
    d = load()
    try:
        import matplotlib; matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        import base64
        from collections import defaultdict
        chi = [t for t in d["txns"] if t["type"]=="chi"]
        cats = defaultdict(int)
        for t in chi: cats[t["cat_name"]] += t["amount"]
        if cats:
            plt.figure(figsize=(5,5))
            plt.pie(list(cats.values()), labels=list(cats.keys()), autopct="%1.0f%%", startangle=90)
            plt.title("Chi tieu")
            buf = io.BytesIO()
            plt.savefig(buf, format="png", dpi=100); buf.seek(0)
            img = base64.b64encode(buf.read()).decode()
            plt.close()
            return jsonify({"image": img})
    except: pass
    return jsonify({"image": ""})

if __name__ == "__main__":
    import io
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
