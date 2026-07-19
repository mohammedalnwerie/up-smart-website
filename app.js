/* ==========================================================================
   UP-Smart Showcase Landing Page JavaScript (Vanilla JS)
   Interactive Features: Device Simulator Sync, Gated Content Modal, Scroll Reveals
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Representational/Showcase Data
// --------------------------------------------------------------------------

const trainingResources = [
    {
        "provider": "Harvard University",
        "category": "أساسيات برمجة",
        "title": "CS50: مقدمة علوم الحاسوب",
        "level": "beginner",
        "hours": 120
    },
    {
        "provider": "Elzero Web School",
        "category": "تطوير الويب",
        "title": "HTML & CSS من الصفر",
        "level": "beginner",
        "hours": 30
    },
    {
        "provider": "Elzero Web School",
        "category": "تطوير الويب",
        "title": "JavaScript من الصفر للاحتراف",
        "level": "intermediate",
        "hours": 45
    },
    {
        "provider": "freeCodeCamp",
        "category": "برمجة عامة",
        "title": "The Odin Project (Full Stack)",
        "level": "intermediate",
        "hours": 150
    },
    {
        "provider": "Corey Schafer",
        "category": "بايثون",
        "title": "بايثون للمبتدئين",
        "level": "beginner",
        "hours": 20
    },
    {
        "provider": "Google Developers",
        "category": "الذكاء الاصطناعي",
        "title": "Machine Learning Crash Course",
        "level": "advanced",
        "hours": 40
    }
];

const academicCourses = [
    {
        "code": "BSAI 1210",
        "name": "برمجة 2",
        "instructor": "أ. سامح أبو حصيرة",
        "credits": 2,
        "videoCount": 12
    },
    {
        "code": "BSAI 1301",
        "name": "الرياضيات العامة",
        "instructor": "د. بنان كلاب",
        "credits": 3,
        "videoCount": 27
    },
    {
        "code": "BSAI 1106",
        "name": "مقدمة في الشبكات - عملي",
        "instructor": "أ. أحمد أبو مسامح",
        "credits": 1,
        "videoCount": 12
    }
];

// --------------------------------------------------------------------------
// 2. Initialization & Modal Setup
// --------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Scroll Reveal Observer
    initScrollReveal();

    // Drawer Navigation (Mobile Menu)
    initNavigation();
    
    // Modal controls for Gated Content
    initGatedModal();

    // Render showcase elements
    renderTrainings("all");
    renderCourses();

    // Category Tabs click listeners
    const categoryTabs = document.querySelectorAll("#trainingCategoryTabs .filter-btn");
    categoryTabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            categoryTabs.forEach(btn => btn.classList.remove("active"));
            e.currentTarget.classList.add("active");
            
            const selectedCategory = e.currentTarget.getAttribute("data-category");
            renderTrainings(selectedCategory);
        });
    });

    // Mobile Device Simulator View Controller
    initDeviceSimulator();

    // New Features: Scroll Progress, Back to Top, FAQ
    initScrollProgress();
    initBackToTop();
    initFAQAccordion();
});

// --------------------------------------------------------------------------
// 3. Scroll Reveal & Nav Drawer Controls
// --------------------------------------------------------------------------
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(r => revealObserver.observe(r));
}

function initNavigation() {
    const menuToggle = document.getElementById("menuToggle");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const closeDrawer = document.getElementById("closeDrawer");
    const drawerLinks = document.querySelectorAll(".drawer-link");

    const toggleIcon = menuToggle.querySelector("i");

    menuToggle.addEventListener("click", () => {
        mobileDrawer.classList.add("open");
        toggleIcon.classList.remove("fa-bars");
        toggleIcon.classList.add("fa-xmark");
    });

    closeDrawer.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        toggleIcon.classList.remove("fa-xmark");
        toggleIcon.classList.add("fa-bars");
    });

    drawerLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileDrawer.classList.remove("open");
            toggleIcon.classList.remove("fa-xmark");
            toggleIcon.classList.add("fa-bars");
        });
    });
}

// --------------------------------------------------------------------------
// 4. Modal Setup for Gated Links (Exclusivity Gating)
// --------------------------------------------------------------------------
let openGatedModal; // Expose globally for dynamic renders

function initGatedModal() {
    const modal = document.getElementById("gatedModal");
    const closeModalBtn = document.getElementById("closeModal");
    const modalDownloadTrigger = document.getElementById("modalDownloadTrigger");

    openGatedModal = function() {
        modal.classList.add("open");
    };

    closeModalBtn.addEventListener("click", () => {
        modal.classList.remove("open");
    });

    // Close on background click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("open");
        }
    });

    modalDownloadTrigger.addEventListener("click", () => {
        modal.classList.remove("open");
    });
}

// --------------------------------------------------------------------------
// 5. Render Curated Trainings
// --------------------------------------------------------------------------
function renderTrainings(categoryFilter) {
    const grid = document.getElementById("trainingGrid");
    grid.innerHTML = ""; // Clear existing

    const filtered = categoryFilter === "all" 
        ? trainingResources 
        : trainingResources.filter(r => r.category === categoryFilter);

    filtered.forEach((res, index) => {
        const card = document.createElement("div");
        card.className = "training-card glass-card reveal";
        
        // Let the reveal transition trigger
        setTimeout(() => card.classList.add("active"), index * 80);
        
        const isYoutube = res.provider.includes("School") || res.provider.includes("Media") || res.provider.includes("Schafer");
        const platformIconClass = isYoutube ? "fa-brands fa-youtube youtube-color" : "fa-solid fa-graduation-cap other-platform-color";

        // Translate difficulty key to Arabic
        const levelLabels = {
            "beginner": "مبتدئ",
            "intermediate": "متوسط",
            "advanced": "متقدم"
        };
        const levelLabel = levelLabels[res.level] || "عام";

        card.innerHTML = `
            <div class="tr-badge-row">
                <span class="tr-category">${res.category}</span>
                <i class="${platformIconClass} tr-platform-icon"></i>
            </div>
            <h3>${res.title}</h3>
            <p class="tr-provider">${res.provider}</p>
            <div class="tr-meta-pills">
                <span class="tr-pill tr-pill-free">مجاني بالفولدر</span>
                <span class="tr-pill tr-pill-level">${levelLabel}</span>
                ${res.hours > 0 ? `<span class="tr-pill tr-pill-level">~${res.hours} ساعة</span>` : ''}
            </div>
            <button class="tr-link-btn trigger-gated-btn">
                <i class="fa-solid fa-up-right-from-square"></i>
                ابدأ التصفح والتعلم
            </button>
        `;
        
        // Add click listener to open the gated download popup
        card.querySelector(".trigger-gated-btn").addEventListener("click", (e) => {
            e.preventDefault();
            openGatedModal();
        });

        grid.appendChild(card);
    });
}

// --------------------------------------------------------------------------
// 6. Render Academic Courses
// --------------------------------------------------------------------------
function renderCourses() {
    const grid = document.getElementById("coursesGrid");
    grid.innerHTML = ""; // Clear existing

    academicCourses.forEach((c, index) => {
        const card = document.createElement("div");
        card.className = "course-card glass-card reveal";
        
        setTimeout(() => card.classList.add("active"), index * 100);

        card.innerHTML = `
            <span class="course-code-badge">${c.code}</span>
            <h3>${c.name}</h3>
            <p class="course-instructor">${c.instructor}</p>
            
            <div class="course-stats-row">
                <span><i class="fa-solid fa-graduation-cap"></i> ${c.credits} ساعات معتمدة</span>
                <span><i class="fa-solid fa-video"></i> ${c.videoCount} محاضرة</span>
            </div>
            
            <div class="course-actions-row">
                <button class="btn btn-youtube trigger-gated-btn">
                    <i class="fa-solid fa-play"></i>
                    قناة محاضرات يوتيوب
                </button>
                <button class="btn btn-materials trigger-gated-btn">
                    <i class="fa-regular fa-folder-open"></i>
                    تحميل ملخصات ومجلد المادة
                </button>
                <button class="btn btn-instructor-chat trigger-gated-btn">
                    <i class="fa-brands fa-whatsapp"></i>
                    اتصال سريع مع الدكتور
                </button>
            </div>
        `;
        
        // Add click listeners to all button tags to open the gated download popup
        card.querySelectorAll(".trigger-gated-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                openGatedModal();
            });
        });

        grid.appendChild(card);
    });
}

// --------------------------------------------------------------------------
// 7. Mobile Device Simulator View Controller
// --------------------------------------------------------------------------
let resetPhoneChat;
let stopPhoneChat;

function initDeviceSimulator() {
    const navItems = document.querySelectorAll(".phone-nav-item");
    const mobileTabs = document.querySelectorAll(".sim-mobile-tab");
    const views = document.querySelectorAll(".phone-view");
    const phoneScreen = document.getElementById("phoneScreen");
    const phoneHeader = document.querySelector(".phone-header");
    const panels = document.querySelectorAll(".sim-panel");

    // Unified tab switcher function
    function switchSimulatorTab(target) {
        // Toggle side interactive panel active classes (Desktop Panels)
        panels.forEach(p => p.classList.remove("active"));
        const matchingPanel = document.querySelector(`.sim-panel[data-target="${target}"]`);
        if (matchingPanel) {
            matchingPanel.classList.add("active");
        }

        // Toggle mobile navigation tabs active classes (Mobile Tabs)
        mobileTabs.forEach(t => t.classList.remove("active"));
        const matchingMobileTab = document.querySelector(`.sim-mobile-tab[data-target="${target}"]`);
        if (matchingMobileTab) {
            matchingMobileTab.classList.add("active");
        }

        // Toggle bottom navigation active classes inside phone mockup screen
        navItems.forEach(i => i.classList.remove("active"));
        const matchingNavItem = document.querySelector(`.phone-nav-item[data-target="${target}"]`);
        if (matchingNavItem) {
            matchingNavItem.classList.add("active");
        }

        // Toggle screen views
        views.forEach(v => v.classList.remove("active"));
        const targetView = document.getElementById(`view-${target}`);
        if (targetView) {
            targetView.classList.add("active");
        }

        // Handle phone header visibility
        if (target === "chat" || target === "courses" || target === "profile") {
            phoneHeader.style.display = "none";
            phoneScreen.style.paddingTop = "20px";
        } else {
            phoneHeader.style.display = "flex";
            phoneScreen.style.paddingTop = "28px";
        }

        // Trigger typing simulator on Chat tab
        if (target === "chat") {
            resetPhoneChat();
        } else {
            stopPhoneChat();
        }
    }

    // Side panel (Desktop) click events
    panels.forEach(panel => {
        panel.addEventListener("click", () => {
            const target = panel.getAttribute("data-target");
            switchSimulatorTab(target);
        });
    });

    // Mobile tabs click events
    mobileTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-target");
            switchSimulatorTab(target);
        });
    });

    // Bottom phone nav item click events
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            const target = item.getAttribute("data-target");
            switchSimulatorTab(target);
        });
    });

    // Gated events inside simulator elements
    phoneScreen.querySelectorAll(".btn-mock-action, .mock-action-pill, .mock-menu-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            openGatedModal();
        });
    });

    // --------------------------------------------------------------------------
    // 8. Chat Simulator inside Mobile Frame
    // --------------------------------------------------------------------------
    const chatBody = document.getElementById("phoneChatBody");
    const chatReset = document.getElementById("phoneChatReset");
    const chatPlaceholder = document.getElementById("phoneChatPlaceholder");
    
    const dialogueScript = [
        { sender: "user", text: "مرحبا، كيف أدفع رسوم الساعات؟" },
        { sender: "bot", text: "أهلاً بك! يمكنك دفع الرسوم الفصلية عبر خدمة **eSadad** من بنك فلسطين أو محفظة **جوال باي**.\n\nفقط افتح خيار دفع الفواتير بالخدمة، أدخل رقمك الجامعي، وسيظهر لك المبلغ المطلوب وتُسدد تلقائياً في نفس اللحظة." },
        { sender: "user", text: "كم لازم أدفع للتسجيل؟" },
        { sender: "bot", text: "التسجيل متراكم ولا يُشترط تصفير الحساب:\n\n*   **منحة 100%:** تدفع **30 ديناراً** فقط للفصل.\n*   **باقي الطلاب:** تدفع قيمة **6 ساعات** للدخول (Mid + Final) وتسجيل الفصل بالكامل." },
        { sender: "user", text: "رائع جداً، شكراً" },
        { sender: "bot", text: "بخدمتك دائماً! يمكنك أيضاً استخدام حاسبة المعدل من تبويب حسابي 😉" }
    ];

    let currentStep = 0;
    let typingTimer = null;

    function runDialogue() {
        if (currentStep >= dialogueScript.length) return;
        
        const message = dialogueScript[currentStep];
        
        if (message.sender === "user") {
            chatPlaceholder.textContent = "";
            let text = message.text;
            let typed = "";
            let index = 0;
            
            function typeChar() {
                if (index < text.length) {
                    typed += text[index];
                    chatPlaceholder.textContent = typed;
                    index++;
                    typingTimer = setTimeout(typeChar, 80);
                } else {
                    setTimeout(() => {
                        chatPlaceholder.textContent = "اسأل المساعد...";
                        appendMockMessage("user", text);
                        currentStep++;
                        typingTimer = setTimeout(runDialogue, 1000);
                    }, 500);
                }
            }
            typeChar();
        } else {
            const indicator = showMockTypingIndicator();
            
            typingTimer = setTimeout(() => {
                removeMockTypingIndicator(indicator);
                const text = message.text;
                const bubble = appendMockMessage("bot", "");
                let currentText = "";
                let index = 0;
                
                function streamText() {
                    if (index < text.length) {
                        currentText += text.substring(index, index + 3);
                        bubble.innerHTML = formatMockMarkdown(currentText);
                        index += 3;
                        chatBody.scrollTop = chatBody.scrollHeight;
                        typingTimer = setTimeout(streamText, 30);
                    } else {
                        currentStep++;
                        typingTimer = setTimeout(runDialogue, 2500);
                    }
                }
                streamText();
            }, 1000);
        }
    }

    function appendMockMessage(sender, text) {
        const bubble = document.createElement("div");
        bubble.className = `mock-chat-msg mock-chat-msg-${sender}`;
        bubble.innerHTML = formatMockMarkdown(text);
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight;
        return bubble;
    }

    function showMockTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.className = "mock-chat-msg mock-chat-msg-bot";
        indicator.id = "mockTypingIndicator";
        indicator.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        return indicator;
    }

    function removeMockTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    function formatMockMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•\s(.*?)(<br>|$)/g, '<li>$1</li>');
    }

    resetPhoneChat = function() {
        clearTimeout(typingTimer);
        chatBody.innerHTML = "";
        currentStep = 0;
        chatPlaceholder.textContent = "اسأل المساعد...";
        
        appendMockMessage("bot", "مرحباً! أنا مساعد UP-Smart الذكي 🤖 اسألني أي سؤال عن الرسوم، التسجيل، الإجراءات أو تواصل الإدارات بالجامعة.");
        
        typingTimer = setTimeout(runDialogue, 1800);
    };

    stopPhoneChat = function() {
        clearTimeout(typingTimer);
    };

    chatReset.addEventListener("click", (e) => {
        e.stopPropagation();
        resetPhoneChat();
    });
}

// --------------------------------------------------------------------------
// 9. Scroll Progress, Back to Top, FAQ Accordion
// --------------------------------------------------------------------------
function initScrollProgress() {
    const progressBar = document.getElementById("scrollProgressBar");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrolled + "%";
    });
}

function initBackToTop() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll(".faq-question");
    
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            // Close other open answers
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.classList.remove("active");
                    q.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current answer
            question.classList.toggle("active");
            const answer = question.nextElementSibling;
            
            if (question.classList.contains("active")) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}
