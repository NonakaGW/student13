/* ===============================
   AOS
================================ */
AOS.init({
    duration: 1000,
    once: true,
});

/* ===============================
   無限スライド（好きな作品）
   左方向スクロール
================================ */
document.querySelectorAll(".js-marquee").forEach(slider => {
    const track = slider.querySelector(".track");
    const speed = Number(slider.dataset.speed) || 0.5;
    let x = 0;

    function animate() {
        x -= speed;

        const first = track.firstElementChild;
        const width = first.offsetWidth + 24;

        if (-x >= width) {
            x += width;
            track.appendChild(first);
        }

        track.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(animate);
    }

    animate();
});

/* ===============================
   無限スライド（推してる人たち）
   右方向スクロール・固定順
================================ */
document.querySelectorAll(".js-marquee-add").forEach(slider => {
    const track = slider.querySelector(".track");
    const speed = Number(slider.dataset.speed) || -0.6;
    const limit = Number(slider.dataset.limit) || 5;
    let x = 0;

    // HTML順をそのまま生成順に使う
    const order = ["stpr", "mememura", "hololive"];
    const baseItems = order.map(id =>
        track.querySelector(`[data-id="${id}"]`)
    );

    let index = 0;

    function getSameItems(id) {
        return Array.from(track.children).filter(el => el.dataset.id === id);
    }

    function animate() {
        x -= speed; // speedがマイナスなので右に進む

        if (x >= 0) {
            const base = baseItems[index];
            const clone = base.cloneNode(true);

            // ★右スクロールなので左端に追加
            track.prepend(clone);

            const width = clone.offsetWidth + 24;
            x -= width;

            index = (index + 1) % baseItems.length;

            // 同じ推しが多すぎたら、その推しだけ削除
            const sameItems = getSameItems(clone.dataset.id);
            if (sameItems.length > limit) {
                track.removeChild(sameItems[sameItems.length - 1]);
            }
        }

        track.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(animate);
    }

    animate();
});

/* ===============================
   食べもの・飲みものガチャ
================================ */
const foods = [
    { name: "ミートソーススパゲッティ", img: "images/meat_sauce_spaghetti.jpg" },
    { name: "マルゲリータ", img: "images/margherita_pizza.jpg" },
    { name: "麦茶", img: "images/barley_tea.webp" },
];

const gachaImg = document.getElementById("gacha-img");
const gachaName = document.getElementById("gacha-name");
const gachaResult = document.getElementById("gacha-result");
const startBtn = document.getElementById("gacha-start");
const stopBtn = document.getElementById("gacha-stop");

let gachaTimer = null;

startBtn.addEventListener("click", () => {
    gachaResult.textContent = "";
    startBtn.disabled = true;
    stopBtn.disabled = false;

    gachaTimer = setInterval(() => {
        const r = Math.floor(Math.random() * foods.length);
        gachaImg.src = foods[r].img;
        gachaName.textContent = foods[r].name;
    }, 70);
});

stopBtn.addEventListener("click", () => {
    clearInterval(gachaTimer);
    startBtn.disabled = false;
    stopBtn.disabled = true;
    gachaResult.textContent = "🎉 今日のオススメ！";
});

/* ===============================
   画像クリック拡大（イベント委譲）
================================ */
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".modal-close");

// 画像クリック（動的要素もOK）
document.addEventListener("click", e => {
    const img = e.target;

    if (
        img.tagName === "IMG" &&
        img.closest(".slider") &&
        img.closest(".section:nth-of-type(1), .section:nth-of-type(2)")
    ) {
        modalImg.src = img.src;
        modal.classList.remove("hidden");
    }
});

// ×ボタン
closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modalImg.src = "";
});

// 背景クリック
modal.addEventListener("click", e => {
    if (e.target.classList.contains("modal-bg")) {
        modal.classList.add("hidden");
        modalImg.src = "";
    }
});

// ESCキー
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        modal.classList.add("hidden");
        modalImg.src = "";
    }
});


