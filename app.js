// ==========================================
// КОНФИГУРАЦИЯ САЙТА GGPRIME
// ==========================================
export const siteConfig = {
    gymName: "GGPRIME",
    navLinks: [
        { label: "Команда", url: "#trainers" },
        { label: "Вопросы", url: "#faq" },
        { label: "Контакты", url: "#contact" }
    ],
    hero: {
        title: "Твоя арена.<br>Твои правила.",
        subtitle: "Многофункциональное пространство для спорта, развития и новых достижений.",
        ctaText: "Оставить заявку"
    },
    trainers: [
        { name: "Алекс", role: "Главный Тренер", img: "https://placehold.co/300x400/1F2833/FFFFFF?text=Alex" },
        { name: "Мария", role: "Пилатес & Стретчинг", img: "https://placehold.co/300x400/1F2833/FFFFFF?text=Maria" },
        { name: "Джон", role: "Силовой Тренинг", img: "https://placehold.co/300x400/1F2833/FFFFFF?text=John" },
        { name: "Сара", role: "Кардио", img: "https://placehold.co/300x400/1F2833/FFFFFF?text=Sarah" }
    ],
    faq: [
        { q: "Что нужно взять на первую тренировку?", a: "Удобную спортивную форму, чистую сменную обувь и бутылку воды. Полотенца выдаются на ресепшене." },
        { q: "Как отменить бронирование?", a: "Бесплатная отмена возможна за 24 часа до начала. Сделайте это по телефону." },
        { q: "Есть ли бесплатная парковка?", a: "Да, для клиентов доступна подземная парковка на 50 мест (первые 3 часа бесплатно)." }
    ],
    contact: {
        address: "Stationplein 15, 1012 AB Amsterdam",
        phone: "+31 20 123 4567",
        email: "hello@ggprime.com",
        hours: "Пн - Вс: 06:00 - 23:00"
    }
};

// URL Google Apps Script для сохранения лидов в Google Таблицу
export const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwhLQ3jjUQtsvXwxT2XWeGXSz97TXOLDP46yHzoyovlfTOGj7UGQYsO4UxIceYVKgk0/exec";

// ==========================================
// ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Бренд и копирайт
    document.title = siteConfig.gymName;
    const logoEl = document.getElementById("ui-logo");
    const footerLogoEl = document.getElementById("ui-footer-logo");
    const copyrightEl = document.getElementById("ui-copyright");

    if (logoEl) logoEl.textContent = siteConfig.gymName;
    if (footerLogoEl) footerLogoEl.textContent = siteConfig.gymName;
    if (copyrightEl) {
        copyrightEl.innerHTML = `&copy; ${new Date().getFullYear()} ${siteConfig.gymName}. Все права защищены.`;
    }

    // Навигация
    const navDesktop = document.getElementById("ui-nav-desktop");
    const navMobile = document.getElementById("ui-nav-mobile");
    if (navDesktop && navMobile) {
        siteConfig.navLinks.forEach(link => {
            const html = `<a href="${link.url}" class="hover:text-primary transition-colors py-2">${link.label}</a>`;
            navDesktop.innerHTML += html;
            navMobile.innerHTML += html;
        });
    }

    // Hero-секция
    const heroTitle = document.getElementById("ui-hero-title");
    const heroSubtitle = document.getElementById("ui-hero-subtitle");
    const heroBtn = document.getElementById("ui-hero-btn");

    if (heroTitle) heroTitle.innerHTML = siteConfig.hero.title;
    if (heroSubtitle) heroSubtitle.innerHTML = siteConfig.hero.subtitle;
    if (heroBtn) heroBtn.textContent = siteConfig.hero.ctaText;

    // Тренеры
    const trainersGrid = document.getElementById("ui-trainers-grid");
    if (trainersGrid) {
        siteConfig.trainers.forEach(trainer => {
            trainersGrid.innerHTML += `
                <div class="reveal text-center">
                    <img src="${trainer.img}" alt="${trainer.name}" class="w-full rounded-2xl mb-4 border border-border object-cover">
                    <h3 class="text-lg font-bold">${trainer.name}</h3>
                    <p class="text-textMuted text-sm">${trainer.role}</p>
                </div>
            `;
        });
    }

    // FAQ
    const faqList = document.getElementById("ui-faq-list");
    if (faqList) {
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
    }

    // Контакты
    const contactInfo = document.getElementById("ui-contact-info");
    if (contactInfo) {
        contactInfo.innerHTML = `
            <div class="flex items-center"><span class="text-2xl mr-4">📍</span><p>${siteConfig.contact.address}</p></div>
            <div class="flex items-center"><span class="text-2xl mr-4">📞</span><a href="tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}" class="hover:text-primary transition-colors">${siteConfig.contact.phone}</a></div>
            <div class="flex items-center"><span class="text-2xl mr-4">✉️</span><a href="mailto:${siteConfig.contact.email}" class="hover:text-primary transition-colors">${siteConfig.contact.email}</a></div>
            <div class="flex items-center"><span class="text-2xl mr-4">⏱</span><p>${siteConfig.contact.hours}</p></div>
        `;
    }

    // Мобильное меню
    const menuBtn = document.getElementById("mobile-menu-btn");
    if (menuBtn && navMobile) {
        menuBtn.addEventListener("click", () => {
            navMobile.classList.toggle("hidden");
        });
        navMobile.addEventListener("click", (e) => {
            if (e.target.tagName === 'A') {
                navMobile.classList.add("hidden");
            }
        });
    }

    // Переключатель темной / светлой темы
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

    // Scroll Reveal Анимации
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

// ==========================================
// УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ
// ==========================================
const modal = document.getElementById("booking-modal");

export function openModal() {
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

export function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
}

// Делаем доступным для inline-атрибутов onclick в разметке
window.openModal = openModal;
window.closeModal = closeModal;

const closeBtn = document.getElementById("close-modal");
if (closeBtn) closeBtn.addEventListener("click", closeModal);

const overlay = document.getElementById("modal-overlay");
if (overlay) overlay.addEventListener("click", closeModal);

// ==========================================
// ОТПРАВКА ДАННЫХ В GOOGLE ТАБЛИЦУ
// ==========================================
const bookingForm = document.getElementById("booking-form");
if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Отправка...";
        submitBtn.disabled = true;

        const nameInput = document.getElementById('booking-name');
        const phoneInput = document.getElementById('booking-phone');

        const bookingData = {
            name: nameInput ? nameInput.value : '',
            phone: phoneInput ? phoneInput.value : ''
        };

        try {
            await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            console.log("Успешно отправлено в Google Таблицу:", bookingData);
        } catch (error) {
            console.error("Ошибка при отправке в Google Таблицу:", error);
        }

        submitBtn.textContent = "✓ Заявка отправлена!";
        submitBtn.classList.remove("bg-primary", "hover:bg-primaryHover");
        submitBtn.classList.add("bg-green-600", "hover:bg-green-700");

        setTimeout(() => {
            closeModal();
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove("bg-green-600", "hover:bg-green-700");
            submitBtn.classList.add("bg-primary", "hover:bg-primaryHover");
        }, 2000);
    });
}
