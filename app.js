import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Инициализация Firebase и Базы Данных
const appId = typeof __app_id !== 'undefined' ? __app_id : 'sports-hall-app';
let app, db, auth, currentUser;

// Глобальный объект для хранения стейта пользователя
let userData = { balance: 0, pass: 'Нет', workouts: 0, phoneVerified: false };

try {
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (e) {
    console.warn("Firebase config not found, database features will be mocked.");
}

async function initAuth() {
    if (!auth) return;
    try {
        if (typeof __initial_auth_token !== 'undefined') {
            const userCredential = await signInWithCustomToken(auth, __initial_auth_token);
            currentUser = userCredential.user;
        } else {
            const userCredential = await signInAnonymously(auth);
            currentUser = userCredential.user;
        }
        loadUserProfile();
    } catch (error) {
        console.error("Auth Error:", error);
    }
}

async function loadUserProfile() {
    if (!currentUser || !db) return;
    try {
        const docRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'data');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            userData = { ...userData, ...data };
            
            document.getElementById('profile-name').value = userData.name || '';
            document.getElementById('profile-email').value = userData.email || '';
            document.getElementById('profile-phone').value = userData.phone || '';
            
            document.getElementById('stat-balance').textContent = `${userData.balance || 0} €`;
            document.getElementById('stat-pass').textContent = userData.pass || 'Нет';
            document.getElementById('stat-workouts').textContent = userData.workouts || 0;
            document.getElementById('profile-stats').classList.remove('hidden');

            if (userData.phoneVerified) {
                document.getElementById('btn-send-sms').style.display = 'none';
                document.getElementById('profile-phone').disabled = true;
                const statusEl = document.getElementById('sms-status');
                statusEl.textContent = 'Телефон подтвержден ✓';
                statusEl.className = 'text-xs mt-2 text-green-500 block';
                document.getElementById('sms-code-group').classList.remove('hidden');
                document.getElementById('sms-code-group').querySelector('.flex').style.display = 'none';
                document.getElementById('sms-code-group').querySelector('label').style.display = 'none';
            }
            
            document.getElementById('booking-name').value = userData.name || '';
            document.getElementById('booking-phone').value = userData.phone || '';
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; 

async function syncToGoogleSheets(action, payload) {
    console.log(`[Google Sheets Sync] Действие: ${action}`, payload);
}

initAuth();

const siteConfig = {
    gymName: "TORQ STUDIO",
    navLinks: [
        { label: "Залы", url: "#halls" },
        { label: "Расписание", url: "#timetable" },
        { label: "Команда", url: "#trainers" },
        { label: "Цены", url: "#pricing" },
        { label: "Контакты", url: "#contact" }
    ],
    hero: {
        title: "Твоя арена.<br>Твои правила.",
        subtitle: "Многофункциональное пространство в центре Амстердама. Аренда залов, топовое оборудование и лучшие тренеры.",
        ctaText: "Забронировать зал"
    },
    gallery: [
        "https://placehold.co/800x600/1F2833/E63946?text=Кроссфит+Зона",
        "https://placehold.co/800x600/1F2833/FFFFFF?text=Ринг",
        "https://placehold.co/800x600/1F2833/9CA3AF?text=Студия+Йоги",
        "https://placehold.co/800x600/1F2833/E63946?text=Баскетбольный+Корт",
        "https://placehold.co/800x600/1F2833/FFFFFF?text=Раздевалки"
    ],
    hallsSectionTitle: "Пространства",
    halls: [
        { id: "boxing", name: "Боксерский Ринг", desc: "Профессиональный ринг, груши, макивары.", icon: "🥊" },
        { id: "crossfit", name: "CrossFit Зона", desc: "Рамы, штанги, гири, гребные тренажеры.", icon: "🏋️‍♂️" },
        { id: "yoga", name: "Студия Йоги", desc: "Гамаки для аэройоги, коврики, релакс-свет.", icon: "🧘‍♀️" },
        { id: "basketball", name: "Баскетбольный Корт", desc: "Паркет, профи-кольца, табло.", icon: "🏀" },
        { id: "mma", name: "Октагон MMA", desc: "Клетка, татами, защитная экипировка.", icon: "🥋" },
        { id: "dance", name: "Dance Класс", desc: "Акустика, зеркала в пол, станки.", icon: "🩰" }
    ],
    timetable: {
        days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        rows: [
            { time: "09:00", classes: ["Йога", "-", "Кроссфит", "-", "Бокс", "Стретчинг", "-"] },
            { time: "12:00", classes: ["-", "Бокс", "-", "Йога", "-", "Кроссфит", "Баскетбол"] },
            { time: "18:00", classes: ["Кроссфит", "ММА", "Йога", "Бокс", "Кроссфит", "-", "-"] },
            { time: "20:00", classes: ["Бокс", "-", "Баскетбол", "-", "ММА", "-", "-"] }
        ]
    },
    trainers: [
        { name: "Алекс", role: "Главный по Кроссфиту", img: "https://placehold.co/300x400/1F2833/FFFFFF?text=Alex" },
        { name: "Мария", role: "Йога & Пилатес", img: "https://placehold.co/300x400/1F2833/FFFFFF?text=Maria" },
        { name: "Джон", role: "Тренер по Боксу", img: "https://placehold.co/300x400/1F2833/FFFFFF?text=John" },
        { name: "Сара", role: "Танцы & Кардио", img: "https://placehold.co/300x400/1F2833/FFFFFF?text=Sarah" }
    ],
    pricing: [
        { id: "single", title: "Разовое", priceNum: 25, price: "€25", period: "/ визит", workouts: 1, features: ["Доступ во все зоны", "Шкафчик и душ", "Групповое занятие"], isPopular: false },
        { id: "month", title: "Pro Месяц", priceNum: 149, price: "€149", period: "/ месяц", workouts: 12, features: ["Безлимитный доступ", "Заморозка на 7 дней", "Скидка на бар", "Полотенца"], isPopular: true },
        { id: "year", title: "Годовой", priceNum: 1200, price: "€1200", period: "/ год", workouts: 144, features: ["Все привилегии Pro", "Персональный шкафчик", "3 индив. тренировки", "Гостевые визиты"], isPopular: false }
    ],
    faq: [
        { q: "Что нужно взять на первую тренировку?", a: "Удобную спортивную форму, чистую сменную обувь и бутылку воды. Полотенца выдаются на ресепшене." },
        { q: "Как отменить бронирование?", a: "Бесплатная отмена возможна за 24 часа до начала." },
        { q: "Есть ли бесплатная парковка?", a: "Да, для клиентов клуба доступна подземная парковка на 50 мест." }
    ],
    contact: {
        address: "Stationplein 15, 1012 AB Amsterdam",
        phone: "+31 20 123 4567",
        email: "hello@torqstudio.nl",
        hours: "Пн - Вс: 06:00 - 23:00"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.title = siteConfig.gymName;
    document.getElementById("ui-logo").textContent = siteConfig.gymName;
    document.getElementById("ui-footer-logo").textContent = siteConfig.gymName;
    document.getElementById("ui-copyright").innerHTML = `&copy; ${new Date().getFullYear()} ${siteConfig.gymName}. Все права защищены.`;

    const navDesktop = document.getElementById("ui-nav-desktop");
    const navMobile = document.getElementById("ui-nav-mobile");
    siteConfig.navLinks.forEach(link => {
        const html = `<a href="${link.url}" class="hover:text-primary transition-colors py-2">${link.label}</a>`;
        navDesktop.innerHTML += html;
        navMobile.innerHTML += html;
    });

    document.getElementById("ui-hero-title").innerHTML = siteConfig.hero.title;
    document.getElementById("ui-hero-subtitle").innerHTML = siteConfig.hero.subtitle;
    document.getElementById("ui-hero-btn").textContent = siteConfig.hero.ctaText;

    const galleryGrid = document.getElementById("ui-gallery-grid");
    siteConfig.gallery.forEach(img => {
        galleryGrid.innerHTML += `
            <div class="gallery-item rounded-2xl overflow-hidden shadow-lg border border-border">
                <img src="${img}" alt="Gallery image" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500">
            </div>
        `;
    });

    document.getElementById("ui-halls-title").textContent = siteConfig.hallsSectionTitle;
    const hallsGrid = document.getElementById("ui-halls-grid");
    const hallSelect = document.getElementById("modal-hall-select");
    
    siteConfig.halls.forEach(hall => {
        hallsGrid.innerHTML += `
            <div class="bg-bgMain p-8 rounded-2xl border border-border text-center hover:-translate-y-2 transition-transform duration-300 reveal">
                <div class="text-5xl mb-4">${hall.icon}</div>
                <h3 class="text-xl font-bold mb-3">${hall.name}</h3>
                <p class="text-textMuted text-sm mb-6">${hall.desc}</p>
                <button onclick="openModal('${hall.id}')" class="text-primary font-semibold hover:text-primaryHover">Забронировать &rarr;</button>
            </div>
        `;
        hallSelect.innerHTML += `<option value="${hall.id}">${hall.name}</option>`;
    });

    const thHead = document.getElementById("ui-timetable-head");
    thHead.innerHTML = `<th class="p-4">Время</th>` + siteConfig.timetable.days.map(d => `<th class="p-4">${d}</th>`).join('');
    
    const tbody = document.getElementById("ui-timetable-body");
    siteConfig.timetable.rows.forEach(row => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-bgMain/50 transition-colors";
        tr.innerHTML = `<td class="p-4 font-bold text-textMain">${row.time}</td>` + 
            row.classes.map(c => `<td class="p-4 text-sm ${c !== '-' ? 'text-primary font-medium' : 'text-border'}">${c}</td>`).join('');
        tbody.appendChild(tr);
    });

    const trainersGrid = document.getElementById("ui-trainers-grid");
    siteConfig.trainers.forEach(trainer => {
        trainersGrid.innerHTML += `
            <div class="reveal text-center">
                <img src="${trainer.img}" alt="${trainer.name}" class="w-full rounded-2xl mb-4 border border-border object-cover">
                <h3 class="text-lg font-bold">${trainer.name}</h3>
                <p class="text-textMuted text-sm">${trainer.role}</p>
            </div>
        `;
    });

    const pricingGrid = document.getElementById("ui-pricing-grid");
    siteConfig.pricing.forEach(plan => {
        const borderClass = plan.isPopular ? 'border-primary shadow-primary/20 shadow-xl scale-105' : 'border-border';
        const bgClass = plan.isPopular ? 'bg-bgCard' : 'bg-bgMain';
        const badge = plan.isPopular ? `<div class="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl uppercase">Популярно</div>` : '';
        
        pricingGrid.innerHTML += `
            <div class="relative ${bgClass} rounded-2xl p-8 border ${borderClass} reveal flex flex-col h-full">
                ${badge}
                <h3 class="text-xl font-bold mb-2">${plan.title}</h3>
                <div class="mb-6"><span class="text-4xl font-bold text-primary">${plan.price}</span><span class="text-textMuted"> ${plan.period}</span></div>
                <ul class="space-y-3 mb-8 flex-grow">
                    ${plan.features.map(f => `<li class="flex items-center text-sm text-textMuted"><svg class="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>${f}</li>`).join('')}
                </ul>
                <button onclick="buyPass('${plan.id}', ${plan.priceNum}, '${plan.title}', ${plan.workouts})" class="w-full ${plan.isPopular ? 'bg-primary hover:bg-primaryHover text-white' : 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white'} py-3 rounded-lg font-bold transition-colors">Купить абонемент</button>
            </div>
        `;
    });

    const faqList = document.getElementById("ui-faq-list");
    siteConfig.faq.forEach(item => {
        faqList.innerHTML += `
            <details class="rounded-lg p-4 reveal">
                <summary class="font-semibold text-lg flex justify-between items-center focus:outline-none">
                    ${item.q}
                    <span class="text-primary text-xl leading-none">+</span>
                </summary>
                <p class="text-textMuted mt-4 text-sm leading-relaxed">${item.a}</p>
            </details>
        `;
    });

    document.getElementById("ui-contact-info").innerHTML = `
        <div class="flex items-center"><span class="text-2xl mr-4">📍</span><p>${siteConfig.contact.address}</p></div>
        <div class="flex items-center"><span class="text-2xl mr-4">📞</span><a href="tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}" class="hover:text-primary transition-colors">${siteConfig.contact.phone}</a></div>
        <div class="flex items-center"><span class="text-2xl mr-4">✉️</span><a href="mailto:${siteConfig.contact.email}" class="hover:text-primary transition-colors">${siteConfig.contact.email}</a></div>
        <div class="flex items-center"><span class="text-2xl mr-4">⏱</span><p>${siteConfig.contact.hours}</p></div>
    `;

    const menuBtn = document.getElementById("mobile-menu-btn");
    menuBtn.addEventListener("click", () => {
        navMobile.classList.toggle("hidden");
    });
    navMobile.addEventListener("click", (e) => {
        if(e.target.tagName === 'A') navMobile.classList.add("hidden");
    });

    const themeToggle = document.getElementById("theme-toggle");
    const htmlTag = document.documentElement;
    const iconMoon = document.getElementById("theme-icon-moon");
    const iconSun = document.getElementById("theme-icon-sun");

    const currentTheme = localStorage.getItem("theme") || "dark";
    htmlTag.setAttribute("data-theme", currentTheme);
    updateThemeIcons(currentTheme);

    themeToggle.addEventListener("click", () => {
        const newTheme = htmlTag.getAttribute("data-theme") === "dark" ? "light" : "dark";
        htmlTag.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcons(newTheme);
    });

    function updateThemeIcons(theme) {
        if (theme === "dark") {
            iconSun.classList.remove("hidden");
            iconMoon.classList.add("hidden");
        } else {
            iconMoon.classList.remove("hidden");
            iconSun.classList.add("hidden");
        }
    }

    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
});

const modal = document.getElementById("booking-modal");

window.openModal = function(hallId = null) {
    modal.classList.remove("hidden");
    if (hallId) {
        document.getElementById("modal-hall-select").value = hallId;
    }
    document.body.style.overflow = "hidden";
};

const closeModal = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
};

const profileModal = document.getElementById("profile-modal");

window.openProfileModal = function() {
    profileModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
};

window.closeProfileModal = function() {
    profileModal.classList.add("hidden");
    document.body.style.overflow = "";
};

window.topUpBalance = async function() {
    if (!currentUser) return openProfileModal();
    userData.balance = (userData.balance || 0) + 100;
    document.getElementById('stat-balance').textContent = `${userData.balance} €`;
    
    if (db) await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'data'), { balance: userData.balance }, { merge: true });
    
    const btn = document.querySelector('button[onclick="topUpBalance()"]');
    btn.textContent = "Успешно!"; setTimeout(() => btn.textContent = "Пополнить", 1500);
    syncToGoogleSheets("topUp", { amount: 100, newBalance: userData.balance });
};

window.buyPass = async function(id, price, title, workouts) {
    if (!currentUser) return openProfileModal();
    
    if ((userData.balance || 0) < price) {
        const msg = document.createElement('div');
        msg.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-lg shadow-xl z-[200] animate-bounce text-center';
        msg.textContent = "Недостаточно средств. Пополните баланс в Личном кабинете (кнопка Пополнить).";
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 4000);
        openProfileModal();
        return;
    }
    
    userData.balance -= price;
    userData.pass = title;
    userData.workouts = (userData.workouts || 0) + workouts;
    
    if (db) {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'data'), { 
            balance: userData.balance, pass: userData.pass, workouts: userData.workouts 
        }, { merge: true });
    }
    loadUserProfile();
    syncToGoogleSheets("buyPass", { passId: id, passTitle: title, price: price, newWorkouts: userData.workouts });
    
    const msg = document.createElement('div');
    msg.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce';
    msg.textContent = `Абонемент "${title}" успешно приобретен! Начислено ${workouts} тренировок.`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
};

document.getElementById('btn-send-sms').addEventListener('click', () => {
    const phoneVal = document.getElementById('profile-phone').value;
    if (phoneVal.length < 5) return;
    document.getElementById('sms-code-group').classList.remove('hidden');
});

document.getElementById('btn-verify-sms').addEventListener('click', async () => {
    const code = document.getElementById('sms-code').value;
    const statusEl = document.getElementById('sms-status');
    statusEl.classList.remove('hidden');
    
    if (code === '1234') { 
        statusEl.textContent = 'Телефон подтвержден ✓';
        statusEl.className = 'text-xs mt-2 text-green-500 block';
        document.getElementById('btn-send-sms').style.display = 'none';
        document.getElementById('profile-phone').disabled = true;
        
        userData.phoneVerified = true;
        userData.phone = document.getElementById('profile-phone').value;
        
        if (currentUser && db) {
            await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'data'), { 
                phoneVerified: true, phone: userData.phone 
            }, { merge: true });
        }
        syncToGoogleSheets("phoneVerified", { phone: userData.phone });
    } else {
        statusEl.textContent = 'Неверный код (используйте 1234)';
        statusEl.className = 'text-xs mt-2 text-red-500 block';
    }
});

document.getElementById("close-modal").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", closeModal);

document.getElementById("booking-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = "Отправка...";
    submitBtn.disabled = true;

    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;
    const hall = document.getElementById('modal-hall-select').value;

    if (currentUser && db) {
        try {
            if (userData.workouts && userData.workouts > 0) {
                userData.workouts -= 1;
                await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'data'), { workouts: userData.workouts }, { merge: true });
                loadUserProfile(); 
            }

            const bookingData = { name, phone, hall, createdAt: new Date().toISOString() };
            await addDoc(collection(db, 'artifacts', appId, 'users', currentUser.uid, 'bookings'), bookingData);
            syncToGoogleSheets("newBooking", bookingData);
        } catch (error) {
            console.error("Error saving booking to DB:", error);
        }
    }
    
    submitBtn.textContent = "✓ Заявка отправлена!";
    submitBtn.classList.remove("bg-primary", "hover:bg-primaryHover");
    submitBtn.classList.add("bg-green-600", "hover:bg-green-700");
    
    setTimeout(() => {
        closeModal();
        e.target.reset();
        loadUserProfile(); 
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        submitBtn.classList.add("bg-primary", "hover:bg-primaryHover");
    }, 2000);
});

document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = "Сохранение...";
    submitBtn.disabled = true;

    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const phone = document.getElementById('profile-phone').value;

    if (currentUser && db) {
        try {
            const profileData = { name, email, phone, updatedAt: new Date().toISOString() };
            await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'data'), profileData, { merge: true });
            
            userData = { ...userData, ...profileData };
            document.getElementById('booking-name').value = name;
            document.getElementById('booking-phone').value = phone;
            
            syncToGoogleSheets("profileUpdate", profileData);
        } catch (error) {
            console.error("Error saving profile to DB:", error);
        }
    }

    submitBtn.textContent = "✓ Сохранено!";
    submitBtn.classList.remove("bg-primary", "hover:bg-primaryHover");
    submitBtn.classList.add("bg-green-600", "hover:bg-green-700");
    
    setTimeout(() => {
        window.closeProfileModal();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        submitBtn.classList.add("bg-primary", "hover:bg-primaryHover");
    }, 2000);
});

console.log("Local app.js loaded successfully.");
