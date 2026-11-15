// ==========================================================================
// GGPRIME JUDO - Система управления клубом дзюдо (Минск)
// Личный кабинет, баланс в BYN, QR-пропуск и списание за тренировки
// ==========================================================================

export const siteConfig = {
    gymName: "GGPRIME JUDO",
    navLinks: [
        { label: "Главная", url: "#home" },
        { label: "Расписание", url: "#schedule" },
        { label: "Тренеры", url: "#trainers" },
        { label: "Вопросы", url: "#faq" },
        { label: "Контакты", url: "#contact" }
    ],
    hero: {
        title: "Путь гибкости.<br>Твоя победа.",
        subtitle: "Спортивный клуб дзюдо в Минске. Подготовка детей от 4 лет, юношей и взрослых. Олимпийские татами, сертифицированные тренеры и удобная электронная система учета через QR-код.",
        ctaText: "Пробное занятие"
    },
    trainers: [
        { name: "Алексей Новиков", role: "Главный тренер • Черный пояс 3 дан, Мастер спорта РБ", img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&auto=format&fit=crop&q=80" },
        { name: "Мария Ковалева", role: "Детский тренер (4-8 лет) • Мастер спорта", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80" },
        { name: "Денис Богданов", role: "Старший тренер • Черный пояс 2 дан", img: "https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=600&auto=format&fit=crop&q=80" },
        { name: "Светлана Русак", role: "ОФП & Акробатика для дзюдоистов", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80" }
    ],
    faq: [
        { q: "Что нужно взять на первую тренировку по дзюдо?", a: "Для первого раза подойдет удобная спортивная форма: спортивные штаны без замков и футболка (или дзюдоги/кимоно, если уже есть), сменные сланцы для прохода до татами. На самом татами занимаемся босиком." },
        { q: "Как работает оплата тренировок через QR-код?", a: "Никаких бумажных абонементов! Вы пополняете личный счёт в кабинете на любую сумму. Приходя в клуб, показываете персональный QR-код тренеру — с вашего баланса списывается стоимость разовой тренировки (15 BYN)." },
        { q: "С какого возраста можно отдавать ребенка на дзюдо?", a: "В подготовительные группы ОФП с элементами самостраховки и акробатики принимаем детей с 4 лет. В спортивные группы дзюдо — с 7 лет." },
        { q: "Есть ли группы для взрослых новичков?", a: "Да! У нас есть вечерняя группа для взрослых, кто начинает с нуля. Занятия помогают поставить технику, улучшить гибкость, выносливость и снять стресс после рабочего дня." }
    ],
    contact: {
        address: "г. Минск, пр-т Победителей, 20 (Дворец спорта)",
        phone: "+375 (29) 123-45-67",
        email: "judo@ggprime.by",
        hours: "Пн - Вс: 08:00 - 22:00"
    }
};

export const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwhLQ3jjUQtsvXwxT2XWeGXSz97TXOLDP46yHzoyovlfTOGj7UGQYsO4UxIceYVKgk0/exec";
export const WORKOUT_PRICE_BYN = 15; // Стоимость разовой тренировки

// ==========================================================================
// БАЗА ДАННЫХ КЛУБА ДЗЮДО (Хранится в LocalStorage)
// ==========================================================================

const DEFAULT_USERS = [
    {
        id: "usr-owner-1",
        name: "Диана",
        email: "owner@ggprime.by",
        phone: "+375 (29) 111-00-00",
        role: "owner", // owner | trainer | client
        password: "123",
        balance: 150,
        code: "JD-0001",
        transactions: [
            { id: 1, type: "topup", amount: 150, title: "Пополнение баланса (Владелец)", date: "15.11.2026, 09:00" }
        ]
    },
    {
        id: "usr-trainer-1",
        name: "Алексей Новиков",
        email: "alex@ggprime.by",
        phone: "+375 (29) 222-33-44",
        role: "trainer",
        password: "123",
        balance: 90,
        code: "JD-0002",
        transactions: [
            { id: 2, type: "topup", amount: 90, title: "Пополнение баланса", date: "15.11.2026, 09:30" }
        ]
    },
    {
        id: "usr-client-1",
        name: "Денис",
        email: "denis@mail.ru",
        phone: "+375 (29) 777-88-99",
        role: "client",
        password: "123",
        balance: 45, // Хватает на 3 тренировки
        code: "JD-7842",
        transactions: [
            { id: 3, type: "topup", amount: 60, title: "Пополнение счёта через ЕРИП/Карту", date: "14.11.2026, 18:20" },
            { id: 4, type: "charge", amount: 15, title: "Тренировка: Дзюдо (Взрослые) по QR-коду", date: "14.11.2026, 20:00" }
        ]
    }
];

const DEFAULT_WORKOUTS = [
    {
        id: "w-1",
        day: "Пн",
        time: "17:00",
        duration: 60,
        title: "Дзюдо: Дети (4-7 лет)",
        hall: "Татами №2 (Детское додзё)",
        trainerId: "usr-trainer-1",
        trainerName: "Мария Ковалева",
        capacity: 12,
        enrolled: []
    },
    {
        id: "w-2",
        day: "Пн",
        time: "18:30",
        duration: 90,
        title: "Дзюдо: Юноши (8-14 лет)",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Алексей Новиков",
        capacity: 16,
        enrolled: ["usr-client-1"]
    },
    {
        id: "w-3",
        day: "Пн",
        time: "20:00",
        duration: 90,
        title: "Дзюдо: Взрослые (новички)",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Денис Богданов",
        capacity: 16,
        enrolled: []
    },
    {
        id: "w-4",
        day: "Вт",
        time: "18:00",
        duration: 60,
        title: "ОФП & Акробатика для дзюдо",
        hall: "Зона ОФП и кросс-тренинга",
        trainerId: "usr-trainer-1",
        trainerName: "Светлана Русак",
        capacity: 14,
        enrolled: []
    },
    {
        id: "w-5",
        day: "Вт",
        time: "19:30",
        duration: 90,
        title: "Рандори (Учебные спарринги)",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Алексей Новиков",
        capacity: 18,
        enrolled: []
    },
    {
        id: "w-6",
        day: "Ср",
        time: "17:00",
        duration: 60,
        title: "Дзюдо: Дети (4-7 лет)",
        hall: "Татами №2 (Детское додзё)",
        trainerId: "usr-trainer-1",
        trainerName: "Мария Ковалева",
        capacity: 12,
        enrolled: []
    },
    {
        id: "w-7",
        day: "Ср",
        time: "18:30",
        duration: 90,
        title: "Дзюдо: Юноши (8-14 лет)",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Алексей Новиков",
        capacity: 16,
        enrolled: []
    },
    {
        id: "w-8",
        day: "Ср",
        time: "20:00",
        duration: 90,
        title: "Дзюдо: Продвинутые / Мастера",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Денис Богданов",
        capacity: 16,
        enrolled: []
    },
    {
        id: "w-9",
        day: "Чт",
        time: "18:30",
        duration: 90,
        title: "Борьба в партере (Нэвадза)",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Алексей Новиков",
        capacity: 16,
        enrolled: []
    },
    {
        id: "w-10",
        day: "Пт",
        time: "18:30",
        duration: 90,
        title: "Дзюдо: Юноши (8-14 лет)",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Алексей Новиков",
        capacity: 16,
        enrolled: []
    },
    {
        id: "w-11",
        day: "Пт",
        time: "20:00",
        duration: 90,
        title: "Рандори & Бросковая техника",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Денис Богданов",
        capacity: 18,
        enrolled: []
    },
    {
        id: "w-12",
        day: "Сб",
        time: "11:00",
        duration: 90,
        title: "Детский день борьбы (Рандори)",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Мария Ковалева",
        capacity: 20,
        enrolled: []
    },
    {
        id: "w-13",
        day: "Вс",
        time: "12:00",
        duration: 120,
        title: "Открытое додзё / Самоподготовка",
        hall: "Татами №1 (Олимпийское)",
        trainerId: "usr-trainer-1",
        trainerName: "Дежурный тренер",
        capacity: 20,
        enrolled: []
    }
];

class JudoClubStore {
    constructor() {
        this.users = JSON.parse(localStorage.getItem("ggprime_judo_users")) || DEFAULT_USERS;
        this.workouts = JSON.parse(localStorage.getItem("ggprime_judo_workouts")) || DEFAULT_WORKOUTS;
        
        const savedUserId = localStorage.getItem("ggprime_judo_active_user_id");
        this.currentUser = this.users.find(u => u.id === savedUserId) || null;
        
        this.activeDay = "Пн";
        this.save();
    }

    save() {
        localStorage.setItem("ggprime_judo_users", JSON.stringify(this.users));
        localStorage.setItem("ggprime_judo_workouts", JSON.stringify(this.workouts));
        if (this.currentUser) {
            localStorage.setItem("ggprime_judo_active_user_id", this.currentUser.id);
        } else {
            localStorage.removeItem("ggprime_judo_active_user_id");
        }
    }

    login(email, password) {
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) throw new Error("Неверный email или пароль");
        this.currentUser = user;
        this.save();
        return user;
    }

    register(name, phone, email, password) {
        if (this.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("Пользователь с таким email уже зарегистрирован");
        }
        const randomCode = "JD-" + Math.floor(1000 + Math.random() * 9000);
        const newUser = {
            id: "usr-" + Date.now(),
            name,
            phone,
            email,
            password,
            role: "client",
            balance: 15, // Дарим 15 BYN на первую пробную тренировку
            code: randomCode,
            transactions: [
                { id: Date.now(), type: "topup", amount: 15, title: "Приветственный бонус (1 тренировка)", date: new Date().toLocaleString('ru-RU') }
            ]
        };
        this.users.push(newUser);
        this.currentUser = newUser;
        this.save();
        return newUser;
    }

    logout() {
        this.currentUser = null;
        this.save();
    }

    // Пополнение счета клиентом
    topUp(amount) {
        if (!this.currentUser) return;
        const sum = parseFloat(amount);
        if (isNaN(sum) || sum <= 0) return;

        this.currentUser.balance = (this.currentUser.balance || 0) + sum;
        if (!this.currentUser.transactions) this.currentUser.transactions = [];
        
        this.currentUser.transactions.unshift({
            id: Date.now(),
            type: "topup",
            amount: sum,
            title: "Пополнение баланса",
            date: new Date().toLocaleString('ru-RU')
        });

        // Обновляем в общем списке
        const u = this.users.find(x => x.id === this.currentUser.id);
        if (u) {
            u.balance = this.currentUser.balance;
            u.transactions = this.currentUser.transactions;
        }

        this.save();
    }

    // Списание тренером при входе по QR-коду
    chargeClientByTrainer(userId, amount = WORKOUT_PRICE_BYN) {
        const target = this.users.find(u => u.id === userId);
        if (!target) return { error: "Пользователь не найден" };

        if ((target.balance || 0) < amount) {
            return { error: `На балансе ${target.name} недостаточно средств (${target.balance || 0} BYN). Требуется ${amount} BYN.` };
        }

        target.balance -= amount;
        if (!target.transactions) target.transactions = [];
        target.transactions.unshift({
            id: Date.now(),
            type: "charge",
            amount: amount,
            title: "Списание за тренировку по дзюдо (QR-пропуск)",
            date: new Date().toLocaleString('ru-RU')
        });

        if (this.currentUser && this.currentUser.id === target.id) {
            this.currentUser.balance = target.balance;
            this.currentUser.transactions = target.transactions;
        }

        this.save();
        return { success: true, user: target, charged: amount };
    }

    // Назначение роли тренера владельцем клуба
    setUserRole(userId, newRole) {
        const user = this.users.find(u => u.id === userId);
        if (!user || user.role === 'owner') return;
        
        user.role = newRole;
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = user;
        }
        this.save();
    }

    // Добавление тренировки тренером / владельцем
    addWorkout(workoutData) {
        const newWorkout = {
            id: "w-" + Date.now(),
            ...workoutData,
            trainerId: this.currentUser ? this.currentUser.id : "usr-trainer-1",
            trainerName: this.currentUser ? this.currentUser.name : "Тренер клуба",
            enrolled: []
        };
        this.workouts.push(newWorkout);
        this.save();
        return newWorkout;
    }

    deleteWorkout(workoutId) {
        this.workouts = this.workouts.filter(w => w.id !== workoutId);
        this.save();
    }

    // Запись на тренировку
    enrollWorkout(workoutId) {
        if (!this.currentUser) return { error: "AUTH_REQUIRED" };
        const workout = this.workouts.find(w => w.id === workoutId);
        if (!workout) return { error: "NOT_FOUND" };

        if (workout.enrolled.includes(this.currentUser.id)) {
            return { error: "ALREADY_ENROLLED" };
        }

        if (workout.enrolled.length >= workout.capacity) {
            return { error: "FULL" };
        }

        workout.enrolled.push(this.currentUser.id);
        this.save();
        return { success: true, workout };
    }

    cancelEnrollment(workoutId) {
        if (!this.currentUser) return;
        const workout = this.workouts.find(w => w.id === workoutId);
        if (!workout) return;

        workout.enrolled = workout.enrolled.filter(uid => uid !== this.currentUser.id);
        this.save();
    }
}

const store = new JudoClubStore();

// ==========================================================================
// ИНИЦИАЛИЗАЦИЯ И РЕНДЕРИНГ ИНТЕРФЕЙСА
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    renderStaticContent();
    renderAuthHeader();
    renderSchedule();
    setupEventHandlers();
    setupThemeAndAnimations();
});

function renderStaticContent() {
    document.title = siteConfig.gymName + " | Клуб дзюдо в Минске";
    const logoEl = document.getElementById("ui-logo");
    const footerLogoEl = document.getElementById("ui-footer-logo");
    const copyrightEl = document.getElementById("ui-copyright");

    if (logoEl) logoEl.textContent = siteConfig.gymName.split(' ')[0];
    if (footerLogoEl) footerLogoEl.textContent = siteConfig.gymName.split(' ')[0];
    if (copyrightEl) {
        copyrightEl.innerHTML = `&copy; ${new Date().getFullYear()} ${siteConfig.gymName}. Все права защищены. г. Минск.`;
    }

    const navDesktop = document.getElementById("ui-nav-desktop");
    const navMobile = document.getElementById("ui-nav-mobile");
    if (navDesktop && navMobile) {
        navDesktop.innerHTML = "";
        navMobile.innerHTML = "";
        siteConfig.navLinks.forEach(link => {
            const html = `<a href="${link.url}" class="hover:text-primary transition-colors py-2">${link.label}</a>`;
            navDesktop.innerHTML += html;
            navMobile.innerHTML += html;
        });
    }

    const heroTitle = document.getElementById("ui-hero-title");
    const heroSubtitle = document.getElementById("ui-hero-subtitle");
    const heroBtn = document.getElementById("ui-hero-btn");

    if (heroTitle) heroTitle.innerHTML = siteConfig.hero.title;
    if (heroSubtitle) heroSubtitle.innerHTML = siteConfig.hero.subtitle;
    if (heroBtn) heroBtn.textContent = siteConfig.hero.ctaText;

    // Тренеры по дзюдо
    const trainersGrid = document.getElementById("ui-trainers-grid");
    if (trainersGrid) {
        trainersGrid.innerHTML = "";
        siteConfig.trainers.forEach(trainer => {
            trainersGrid.innerHTML += `
                <div class="reveal text-center group">
                    <div class="relative overflow-hidden rounded-2xl mb-4 border border-border aspect-[3/4]">
                        <img src="${trainer.img}" alt="${trainer.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                            <span class="text-xs text-primary font-bold uppercase tracking-wider">${trainer.role}</span>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-textMain">${trainer.name}</h3>
                </div>
            `;
        });
    }

    // FAQ
    const faqList = document.getElementById("ui-faq-list");
    if (faqList) {
        faqList.innerHTML = "";
        siteConfig.faq.forEach(item => {
            faqList.innerHTML += `
                <details class="rounded-xl p-4 reveal">
                    <summary class="font-semibold text-base sm:text-lg flex justify-between items-center focus:outline-none">
                        ${item.q}
                        <span class="text-primary text-xl leading-none font-bold">+</span>
                    </summary>
                    <p class="text-textMuted mt-4 text-sm leading-relaxed">${item.a}</p>
                </details>
            `;
        });
    }

    // Контакты (Минск)
    const contactInfo = document.getElementById("ui-contact-info");
    if (contactInfo) {
        contactInfo.innerHTML = `
            <div class="flex items-center"><span class="text-2xl mr-4">📍</span><p>${siteConfig.contact.address}</p></div>
            <div class="flex items-center"><span class="text-2xl mr-4">📞</span><a href="tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}" class="hover:text-primary transition-colors">${siteConfig.contact.phone}</a></div>
            <div class="flex items-center"><span class="text-2xl mr-4">✉️</span><a href="mailto:${siteConfig.contact.email}" class="hover:text-primary transition-colors">${siteConfig.contact.email}</a></div>
            <div class="flex items-center"><span class="text-2xl mr-4">⏱</span><p>${siteConfig.contact.hours}</p></div>
        `;
    }
}

// --------------------------------------------------------------------------
// Шапка: Кнопки авторизации, бейдж роли и личного кабинета
// --------------------------------------------------------------------------
function renderAuthHeader() {
    const wrapper = document.getElementById("ui-auth-header-wrapper");
    if (!wrapper) return;

    if (!store.currentUser) {
        wrapper.innerHTML = `
            <button onclick="openAuthModal()" class="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5">
                <span>👤</span> Войти
            </button>
        `;
    } else {
        const u = store.currentUser;
        let roleBadgeClass = "bg-primary/20 text-primary border border-primary/30";
        let roleTitle = "Участник";

        if (u.role === "owner") {
            roleBadgeClass = "bg-amber-500/20 text-amber-400 border border-amber-500/30";
            roleTitle = "👑 Владелец";
        } else if (u.role === "trainer") {
            roleBadgeClass = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
            roleTitle = "🥋 Тренер";
        }

        let ownerBtn = "";
        if (u.role === "owner") {
            ownerBtn = `
                <button onclick="openAdminModal()" title="Панель владельца" class="p-2 rounded-lg bg-bgCard hover:bg-amber-500/10 text-amber-400 border border-border hover:border-amber-500/30 transition-colors">
                    ⚙️ <span class="hidden lg:inline text-xs font-bold ml-1">Команда</span>
                </button>
            `;
        }

        let trainerBtn = "";
        if (u.role === "owner" || u.role === "trainer") {
            trainerBtn = `
                <button onclick="openTrainerModal()" title="Списание и расписание" class="p-2 rounded-lg bg-bgCard hover:bg-primary/10 text-primary border border-border hover:border-primary/30 transition-colors">
                    🥋 <span class="hidden lg:inline text-xs font-bold ml-1">Тренер</span>
                </button>
            `;
        }

        wrapper.innerHTML = `
            <div class="flex items-center gap-2">
                ${ownerBtn}
                ${trainerBtn}
                <button onclick="openCabinetModal()" class="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-bgCard border border-border hover:border-primary transition-colors text-xs sm:text-sm">
                    <div class="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                        ${u.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="font-medium hidden sm:inline text-textMain">${u.name.split(' ')[0]}</span>
                    <span class="text-xs font-bold text-primary">${(u.balance || 0).toFixed(2)} BYN</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${roleBadgeClass}">${roleTitle}</span>
                </button>
            </div>
        `;
    }
}

// --------------------------------------------------------------------------
// Интерактивное расписание тренировок по дзюдо
// --------------------------------------------------------------------------
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function renderSchedule() {
    const tabsContainer = document.getElementById("schedule-days-tabs");
    if (tabsContainer) {
        tabsContainer.innerHTML = "";
        DAYS.forEach(day => {
            const isActive = store.activeDay === day;
            const btnClass = isActive 
                ? "bg-primary text-white font-bold shadow-lg shadow-primary/30" 
                : "bg-bgMain text-textMuted hover:text-textMain hover:bg-border border border-border";
            
            tabsContainer.innerHTML += `
                <button onclick="selectScheduleDay('${day}')" class="px-5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap ${btnClass}">
                    ${day}
                </button>
            `;
        });
    }

    const actionContainer = document.getElementById("trainer-schedule-action");
    if (actionContainer) {
        if (store.currentUser && (store.currentUser.role === 'trainer' || store.currentUser.role === 'owner')) {
            actionContainer.innerHTML = `
                <button onclick="openTrainerModal()" class="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                    <span>➕</span> Составить тренировку
                </button>
            `;
        } else {
            actionContainer.innerHTML = "";
        }
    }

    const grid = document.getElementById("schedule-grid");
    if (!grid) return;

    const filtered = store.workouts.filter(w => w.day === store.activeDay);
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-textMuted border border-dashed border-border rounded-2xl bg-bgMain">
                <span class="text-4xl block mb-2">🥋</span>
                <p class="font-medium">В этот день тренировок на татами пока не запланировано.</p>
                ${store.currentUser && (store.currentUser.role === 'trainer' || store.currentUser.role === 'owner') ? '<button onclick="openTrainerModal()" class="mt-4 text-xs font-bold text-primary hover:underline">+ Добавить тренировку в расписание</button>' : ''}
            </div>
        `;
        return;
    }

    grid.innerHTML = "";
    filtered.forEach(workout => {
        const isEnrolled = store.currentUser && workout.enrolled.includes(store.currentUser.id);
        const freeSpots = workout.capacity - workout.enrolled.length;
        const isFull = freeSpots <= 0;

        let actionButton = "";
        if (!store.currentUser) {
            actionButton = `<button onclick="openAuthModal()" class="w-full bg-primary/20 hover:bg-primary text-primary hover:text-white font-bold py-2.5 rounded-lg text-xs transition-colors">Войти для записи</button>`;
        } else if (isEnrolled) {
            actionButton = `<button onclick="cancelBooking('${workout.id}')" class="w-full bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 font-bold py-2.5 rounded-lg text-xs transition-colors">✓ Вы записаны (Отменить)</button>`;
        } else if (isFull) {
            actionButton = `<button disabled class="w-full bg-border text-textMuted font-bold py-2.5 rounded-lg text-xs cursor-not-allowed">Мест нет</button>`;
        } else {
            actionButton = `<button onclick="bookWorkout('${workout.id}')" class="w-full bg-primary hover:bg-primaryHover text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-md shadow-primary/20">Записаться на татами</button>`;
        }

        let trainerTools = "";
        if (store.currentUser && (store.currentUser.role === 'trainer' || store.currentUser.role === 'owner')) {
            trainerTools = `
                <div class="mt-3 pt-3 border-t border-border flex justify-between items-center text-xs">
                    <span class="text-textMuted">Записано: <strong class="text-textMain">${workout.enrolled.length} чел.</strong></span>
                    <button onclick="deleteWorkout('${workout.id}')" class="text-red-400 hover:text-red-300 font-medium">Удалить</button>
                </div>
            `;
        }

        grid.innerHTML += `
            <div class="bg-bgMain p-6 rounded-2xl border border-border flex flex-col justify-between hover:border-primary/50 transition-all hover:-translate-y-1">
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                            ⏱ ${workout.time} (${workout.duration} мин)
                        </span>
                        <span class="text-xs text-textMuted font-medium">
                            ${workout.hall}
                        </span>
                    </div>
                    <h3 class="text-lg font-bold text-textMain mb-2">${workout.title}</h3>
                    <p class="text-xs text-textMuted mb-4 flex items-center gap-1.5">
                        <span>Тренер:</span> <span class="font-semibold text-textMain">${workout.trainerName}</span>
                    </p>
                    <div class="mb-5">
                        <div class="flex justify-between text-xs text-textMuted mb-1.5">
                            <span>Свободно мест:</span>
                            <span class="font-bold ${freeSpots <= 3 ? 'text-amber-500' : 'text-green-500'}">${freeSpots} из ${workout.capacity}</span>
                        </div>
                        <div class="w-full bg-bgCard h-1.5 rounded-full overflow-hidden">
                            <div class="bg-primary h-full transition-all" style="width: ${(workout.enrolled.length / workout.capacity) * 100}%"></div>
                        </div>
                    </div>
                </div>
                <div>
                    ${actionButton}
                    ${trainerTools}
                </div>
            </div>
        `;
    });
}

window.selectScheduleDay = function(day) {
    store.activeDay = day;
    renderSchedule();
};

window.bookWorkout = async function(workoutId) {
    if (!store.currentUser) {
        openAuthModal();
        return;
    }

    const res = store.enrollWorkout(workoutId);
    if (res.error === "FULL") {
        alert("К сожалению, все места на татами на это занятие уже заняты.");
        return;
    }

    if (res.success) {
        renderSchedule();
        renderAuthHeader();

        try {
            await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: "JUDO_ENROLLMENT",
                    name: store.currentUser.name,
                    phone: store.currentUser.phone,
                    workout: res.workout.title,
                    time: `${res.workout.day} в ${res.workout.time}`,
                    hall: res.workout.hall,
                    date: new Date().toLocaleString()
                })
            });
        } catch (e) {
            console.error(e);
        }

        showToast(`Вы успешно записаны на занятие «${res.workout.title}»!`);
    }
};

window.cancelBooking = function(workoutId) {
    if (confirm("Отменить вашу запись на эту тренировку?")) {
        store.cancelEnrollment(workoutId);
        renderSchedule();
        renderCabinetModal();
        showToast("Запись отменена.");
    }
};

window.deleteWorkout = function(workoutId) {
    if (confirm("Удалить эту тренировку из расписания клуба?")) {
        store.deleteWorkout(workoutId);
        renderSchedule();
        renderTrainerClassesList();
        showToast("Тренировка удалена.");
    }
};

// --------------------------------------------------------------------------
// 1. Модальное окно Авторизации (Вход / Регистрация)
// --------------------------------------------------------------------------
const authModal = document.getElementById("auth-modal");
window.openAuthModal = function() {
    if (!authModal) return;
    authModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
};
window.closeAuthModal = function() {
    if (!authModal) return;
    authModal.classList.add("hidden");
    document.body.style.overflow = "";
};

const closeAuthBtn = document.getElementById("close-auth-modal");
if (closeAuthBtn) closeAuthBtn.addEventListener("click", closeAuthModal);
const authOverlay = document.getElementById("auth-overlay");
if (authOverlay) authOverlay.addEventListener("click", closeAuthModal);

window.quickLogin = function(role) {
    let target = store.users.find(u => u.role === role);
    if (!target) target = store.users[0];
    store.currentUser = target;
    store.save();
    closeAuthModal();
    renderAuthHeader();
    renderSchedule();
    showToast(`Вы вошли как ${target.name} (${target.role === 'owner' ? 'Владелец' : 'Тренер'})`);
};

// --------------------------------------------------------------------------
// 2. Личный кабинет Участника (Баланс BYN, QR-пропуск, История)
// --------------------------------------------------------------------------
const cabinetModal = document.getElementById("cabinet-modal");
window.openCabinetModal = function() {
    if (!cabinetModal) return;
    renderCabinetModal();
    cabinetModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
};
window.closeCabinetModal = function() {
    if (!cabinetModal) return;
    cabinetModal.classList.add("hidden");
    document.body.style.overflow = "";
};

const closeCabinetBtn = document.getElementById("close-cabinet-modal");
if (closeCabinetBtn) closeCabinetBtn.addEventListener("click", closeCabinetModal);
const cabinetOverlay = document.getElementById("cabinet-overlay");
if (cabinetOverlay) cabinetOverlay.addEventListener("click", closeCabinetModal);

function renderCabinetModal() {
    if (!store.currentUser) return;
    const u = store.currentUser;

    document.getElementById("cabinet-avatar").textContent = u.name.charAt(0).toUpperCase();
    document.getElementById("cabinet-user-name").textContent = u.name;
    document.getElementById("cabinet-user-email").textContent = `${u.email} • ${u.phone || ''}`;

    const badge = document.getElementById("cabinet-user-badge");
    if (u.role === "owner") {
        badge.className = "text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30";
        badge.textContent = "Владелец клуба";
    } else if (u.role === "trainer") {
        badge.className = "text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
        badge.textContent = "Тренер";
    } else {
        badge.className = "text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/20 text-primary border border-primary/30";
        badge.textContent = "Участник";
    }

    // Баланс
    const balanceVal = (u.balance || 0).toFixed(2);
    document.getElementById("cabinet-balance-val").textContent = balanceVal;

    // Персональный QR-код для тренировок
    const userCode = u.code || ("JD-" + u.id.slice(-4));
    document.getElementById("cabinet-user-code").textContent = `ID: ${userCode}`;
    const qrImg = document.getElementById("cabinet-qr-img");
    if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GGPRIME-JUDO:${userCode}&color=0B0C10&bgcolor=FFFFFF`;
    }

    // Записи на татами
    const bookingsContainer = document.getElementById("cabinet-my-bookings");
    const myWorkouts = store.workouts.filter(w => w.enrolled.includes(u.id));

    if (myWorkouts.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="p-4 text-center text-textMuted bg-bgMain rounded-xl border border-border">
                <p class="text-xs">У вас пока нет активных записей на татами.</p>
            </div>
        `;
    } else {
        bookingsContainer.innerHTML = "";
        myWorkouts.forEach(w => {
            bookingsContainer.innerHTML += `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-bgMain rounded-xl border border-border gap-2">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs font-bold text-primary">${w.day} в ${w.time}</span>
                            <span class="text-xs text-textMuted">• ${w.hall}</span>
                        </div>
                        <h5 class="font-bold text-sm text-textMain">${w.title}</h5>
                        <p class="text-xs text-textMuted">Тренер: ${w.trainerName}</p>
                    </div>
                    <button onclick="cancelBooking('${w.id}')" class="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg font-semibold transition-colors self-start sm:self-auto">
                        Отменить запись
                    </button>
                </div>
            `;
        });
    }

    // История транзакций
    const transContainer = document.getElementById("cabinet-transactions");
    if (transContainer) {
        const trans = u.transactions || [];
        if (trans.length === 0) {
            transContainer.innerHTML = `<p class="text-xs text-textMuted">Операций пока не совершалось.</p>`;
        } else {
            transContainer.innerHTML = "";
            trans.forEach(t => {
                const isTopUp = t.type === 'topup';
                const sign = isTopUp ? "+" : "-";
                const color = isTopUp ? "text-green-500" : "text-primary";

                transContainer.innerHTML += `
                    <div class="flex justify-between items-center text-xs p-2.5 bg-bgMain rounded-lg border border-border/70">
                        <div>
                            <span class="font-semibold text-textMain block">${t.title}</span>
                            <span class="text-[10px] text-textMuted">${t.date}</span>
                        </div>
                        <span class="font-bold text-sm ${color}">${sign}${t.amount} BYN</span>
                    </div>
                `;
            });
        }
    }
}

// Пополнение счета
const topUpModal = document.getElementById("topup-modal");
window.openTopUpModal = function() {
    if (!topUpModal) return;
    topUpModal.classList.remove("hidden");
};
window.closeTopUpModal = function() {
    if (!topUpModal) return;
    topUpModal.classList.add("hidden");
};

const topUpOverlay = document.getElementById("topup-overlay");
if (topUpOverlay) topUpOverlay.addEventListener("click", window.closeTopUpModal);

window.confirmTopUp = function(amount) {
    store.topUp(amount);
    closeTopUpModal();
    renderCabinetModal();
    renderAuthHeader();
    showToast(`Баланс пополнен на +${amount} BYN!`);
};

window.submitCustomTopUp = function() {
    const input = document.getElementById("topup-custom-amount");
    const amount = parseFloat(input.value);
    if (isNaN(amount) || amount <= 0) {
        alert("Пожалуйста, введите корректную сумму пополнения в BYN.");
        return;
    }
    window.confirmTopUp(amount);
    input.value = "";
};

window.logout = function() {
    store.logout();
    closeCabinetModal();
    renderAuthHeader();
    renderSchedule();
    showToast("Вы вышли из аккаунта.");
};

// --------------------------------------------------------------------------
// 3. Панель Тренера (Списание по QR-коду и управление расписанием дзюдо)
// --------------------------------------------------------------------------
const trainerModal = document.getElementById("trainer-modal");
window.openTrainerModal = function() {
    if (!trainerModal) return;
    if (!store.currentUser || (store.currentUser.role !== 'trainer' && store.currentUser.role !== 'owner')) {
        alert("Доступ открыт только тренерам клуба дзюдо и владельцу.");
        return;
    }
    renderTrainerUsersSelect();
    renderTrainerClassesList();
    trainerModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
};
window.closeTrainerModal = function() {
    if (!trainerModal) return;
    trainerModal.classList.add("hidden");
    document.body.style.overflow = "";
};

const closeTrainerBtn = document.getElementById("close-trainer-modal");
if (closeTrainerBtn) closeTrainerBtn.addEventListener("click", closeTrainerModal);
const trainerOverlay = document.getElementById("trainer-overlay");
if (trainerOverlay) trainerOverlay.addEventListener("click", closeTrainerModal);

function renderTrainerUsersSelect() {
    const sel = document.getElementById("trainer-charge-user-select");
    if (!sel) return;

    sel.innerHTML = '<option value="">-- Выберите участника для списания по QR / ID --</option>';
    store.users.forEach(u => {
        sel.innerHTML += `
            <option value="${u.id}">${u.name} (Код: ${u.code}) — Баланс: ${(u.balance || 0).toFixed(2)} BYN</option>
        `;
    });
}

window.trainerChargeUser = function() {
    const sel = document.getElementById("trainer-charge-user-select");
    const userId = sel.value;
    if (!userId) {
        alert("Пожалуйста, выберите участника.");
        return;
    }

    const res = store.chargeClientByTrainer(userId, WORKOUT_PRICE_BYN);
    if (res.error) {
        alert(res.error);
        return;
    }

    renderTrainerUsersSelect();
    renderAuthHeader();
    showToast(`✓ Списано 15 BYN с баланса ${res.user.name}. Вход на татами подтвержден!`);
};

function renderTrainerClassesList() {
    const list = document.getElementById("trainer-classes-list");
    if (!list) return;

    list.innerHTML = "";
    store.workouts.forEach(w => {
        list.innerHTML += `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bgMain rounded-xl border border-border gap-3 text-sm">
                <div>
                    <span class="font-bold text-primary mr-2">${w.day} ${w.time}</span>
                    <strong class="text-textMain">${w.title}</strong>
                    <div class="text-xs text-textMuted mt-1">
                        ${w.hall} • Тренер: ${w.trainerName} • Записано: <strong class="text-textMain">${w.enrolled.length} из ${w.capacity}</strong>
                    </div>
                </div>
                <button onclick="deleteWorkout('${w.id}')" class="text-xs bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors self-start sm:self-auto">
                    Удалить
                </button>
            </div>
        `;
    });
}

// --------------------------------------------------------------------------
// 4. Панель Владельца (Управление ролями и назначение статуса "Тренер")
// --------------------------------------------------------------------------
const adminModal = document.getElementById("admin-modal");
window.openAdminModal = function() {
    if (!adminModal) return;
    if (!store.currentUser || store.currentUser.role !== 'owner') {
        alert("Доступ разрешен только владельцу клуба.");
        return;
    }
    renderAdminUsersTable();
    adminModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
};
window.closeAdminModal = function() {
    if (!adminModal) return;
    adminModal.classList.add("hidden");
    document.body.style.overflow = "";
};

const closeAdminBtn = document.getElementById("close-admin-modal");
if (closeAdminBtn) closeAdminBtn.addEventListener("click", closeAdminModal);
const adminOverlay = document.getElementById("admin-overlay");
if (adminOverlay) adminOverlay.addEventListener("click", closeAdminModal);

function renderAdminUsersTable() {
    const tableBody = document.getElementById("admin-users-table");
    if (!tableBody) return;

    const trainersCount = store.users.filter(u => u.role === 'trainer').length;
    document.getElementById("admin-stat-members").textContent = store.users.length;
    document.getElementById("admin-stat-trainers").textContent = trainersCount;
    document.getElementById("admin-stat-classes").textContent = store.workouts.length;

    tableBody.innerHTML = "";
    store.users.forEach(u => {
        let roleBadge = "";
        let actionBtn = "";

        if (u.role === "owner") {
            roleBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">👑 Владелец</span>`;
            actionBtn = `<span class="text-xs text-textMuted italic">Главный администратор</span>`;
        } else if (u.role === "trainer") {
            roleBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🥋 Тренер</span>`;
            actionBtn = `
                <button onclick="toggleTrainerRole('${u.id}', 'client')" class="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
                    Снять статус тренера
                </button>
            `;
        } else {
            roleBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-bgCard text-textMuted border border-border">Участник</span>`;
            actionBtn = `
                <button onclick="toggleTrainerRole('${u.id}', 'trainer')" class="bg-primary hover:bg-primaryHover text-white text-xs px-3.5 py-1.5 rounded-lg font-bold transition-colors shadow-sm shadow-primary/20 flex items-center gap-1.5 ml-auto">
                    <span>🥋</span> Назначить тренером
                </button>
            `;
        }

        tableBody.innerHTML += `
            <tr class="hover:bg-bgMain/60 transition-colors">
                <td class="p-4 font-bold text-textMain flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                        ${u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div>${u.name}</div>
                        <div class="text-[11px] text-textMuted font-mono">Код: ${u.code}</div>
                    </div>
                </td>
                <td class="p-4 text-textMuted text-xs">
                    <div>${u.phone || '-'}</div>
                    <div class="text-[11px]">${u.email}</div>
                </td>
                <td class="p-4 font-bold text-sm text-textMain">${(u.balance || 0).toFixed(2)} BYN</td>
                <td class="p-4">${roleBadge}</td>
                <td class="p-4 text-right">${actionBtn}</td>
            </tr>
        `;
    });
}

window.toggleTrainerRole = function(userId, newRole) {
    store.setUserRole(userId, newRole);
    renderAdminUsersTable();
    renderAuthHeader();
    renderSchedule();
    const roleName = newRole === 'trainer' ? 'Тренер' : 'Участник';
    showToast(`Пользователю выдан статус «${roleName}»!`);
};

// --------------------------------------------------------------------------
// Обработчики форм и переключателей
// --------------------------------------------------------------------------
function setupEventHandlers() {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener("click", () => {
            tabLogin.className = "flex-1 pb-3 font-bold text-center border-b-2 border-primary text-primary transition-colors";
            tabRegister.className = "flex-1 pb-3 font-semibold text-center text-textMuted hover:text-textMain border-b-2 border-transparent transition-colors";
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");
        });

        tabRegister.addEventListener("click", () => {
            tabRegister.className = "flex-1 pb-3 font-bold text-center border-b-2 border-primary text-primary transition-colors";
            tabLogin.className = "flex-1 pb-3 font-semibold text-center text-textMuted hover:text-textMain border-b-2 border-transparent transition-colors";
            registerForm.classList.remove("hidden");
            loginForm.classList.add("hidden");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const errEl = document.getElementById("login-error");
            errEl.classList.add("hidden");

            const email = document.getElementById("login-email").value;
            const pass = document.getElementById("login-password").value;

            try {
                store.login(email, pass);
                closeAuthModal();
                loginForm.reset();
                renderAuthHeader();
                renderSchedule();
                showToast(`С возвращением в додзё, ${store.currentUser.name}!`);
            } catch (err) {
                errEl.textContent = err.message;
                errEl.classList.remove("hidden");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const errEl = document.getElementById("register-error");
            errEl.classList.add("hidden");

            const name = document.getElementById("reg-name").value;
            const phone = document.getElementById("reg-phone").value;
            const email = document.getElementById("reg-email").value;
            const pass = document.getElementById("reg-password").value;

            try {
                store.register(name, phone, email, pass);
                closeAuthModal();
                registerForm.reset();
                renderAuthHeader();
                renderSchedule();
                showToast(`Добро пожаловать в клуб, ${name}! Вам начислен бонус 15 BYN на первую тренировку.`);
            } catch (err) {
                errEl.textContent = err.message;
                errEl.classList.remove("hidden");
            }
        });
    }

    const addWorkoutForm = document.getElementById("add-workout-form");
    if (addWorkoutForm) {
        addWorkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("workout-title").value;
            const day = document.getElementById("workout-day").value;
            const time = document.getElementById("workout-time").value;
            const duration = parseInt(document.getElementById("workout-duration").value) || 90;
            const hall = document.getElementById("workout-hall").value;
            const capacity = parseInt(document.getElementById("workout-capacity").value) || 16;

            store.addWorkout({ title, day, time, duration, hall, capacity });
            addWorkoutForm.reset();
            renderTrainerClassesList();
            renderSchedule();
            showToast(`Тренировка по дзюдо добавлена на ${day}!`);
        });
    }

    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Отправка...";
            submitBtn.disabled = true;

            const name = document.getElementById('booking-name').value;
            const phone = document.getElementById('booking-phone').value;

            try {
                await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, type: "JUDO_LEAD_BY", date: new Date().toISOString() })
                });
            } catch (error) {
                console.error("Webhook error:", error);
            }

            submitBtn.textContent = "✓ Вы записаны!";
            submitBtn.classList.add("bg-green-600");

            setTimeout(() => {
                window.closeModal();
                bookingForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove("bg-green-600");
            }, 2000);
        });
    }

    const menuBtn = document.getElementById("mobile-menu-btn");
    const navMobile = document.getElementById("ui-nav-mobile");
    if (menuBtn && navMobile) {
        menuBtn.addEventListener("click", () => {
            navMobile.classList.toggle("hidden");
        });
        navMobile.addEventListener("click", (e) => {
            if (e.target.tagName === 'A') navMobile.classList.add("hidden");
        });
    }

    const modal = document.getElementById("booking-modal");
    window.openModal = function() {
        if (!modal) return;
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    };
    window.closeModal = function() {
        if (!modal) return;
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    };
    const closeBtn = document.getElementById("close-modal");
    if (closeBtn) closeBtn.addEventListener("click", window.closeModal);
    const modalOverlay = document.getElementById("modal-overlay");
    if (modalOverlay) modalOverlay.addEventListener("click", window.closeModal);
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-6 right-6 bg-primary text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl z-[300] animate-bounce flex items-center gap-2";
    toast.innerHTML = `<span>🥋</span> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function setupThemeAndAnimations() {
    const themeToggle = document.getElementById("theme-toggle");
    const htmlTag = document.documentElement;
    const iconMoon = document.getElementById("theme-icon-moon");
    const iconSun = document.getElementById("theme-icon-sun");

    function updateThemeIcons(theme) {
        if (!iconSun || !iconMoon) return;
        if (theme === "dark") {
            iconSun.classList.remove("hidden");
            iconMoon.classList.add("hidden");
        } else {
            iconMoon.classList.remove("hidden");
            iconSun.classList.add("hidden");
        }
    }

    const currentTheme = localStorage.getItem("theme") || "dark";
    htmlTag.setAttribute("data-theme", currentTheme);
    updateThemeIcons(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const newTheme = htmlTag.getAttribute("data-theme") === "dark" ? "light" : "dark";
            htmlTag.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateThemeIcons(newTheme);
        });
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
}
