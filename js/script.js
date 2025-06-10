// 配置对象
const CONFIG = {
    // 动画配置
    animation: {
        duration: 1000,
        offset: 100,
        once: true
    },
    // 滚动配置
    scroll: {
        navbarChangePoint: 100,
        backToTopShowPoint: 300
    },
    // 表单配置
    form: {
        resultDisplayTime: 3000
    }
};

// 工具函数
const Utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // 添加类名
    addClass(element, className) {
        if (element && !element.classList.contains(className)) {
            element.classList.add(className);
        }
    },

    // 移除类名
    removeClass(element, className) {
        if (element && element.classList.contains(className)) {
            element.classList.remove(className);
        }
    },

    // 切换类名
    toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    }
};

// DOM 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initBackToTop();
    initPortfolioGallery();
    initImageModal();
    initContactForm();
    initSmoothScroll();
});

// 导航栏功能
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // 汉堡菜单点击事件
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            Utils.toggleClass(hamburger, 'active');
            Utils.toggleClass(navMenu, 'active');
        });

        // 点击导航链接时关闭移动菜单
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                Utils.removeClass(hamburger, 'active');
                Utils.removeClass(navMenu, 'active');
            });
        });
    }

    // 滚动时改变导航栏样式 - 使用节流优化性能
    const handleNavbarScroll = Utils.throttle(() => {
        if (!navbar) return;
        
        if (window.scrollY > CONFIG.scroll.navbarChangePoint) {
            navbar.style.background = 'rgba(250, 249, 247, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(139, 115, 85, 0.15)';
        } else {
            navbar.style.background = 'rgba(250, 249, 247, 0.95)';
            navbar.style.boxShadow = '0 1px 10px rgba(139, 115, 85, 0.1)';
        }
    }, 16); // 约60fps

    window.addEventListener('scroll', handleNavbarScroll);
}

// 返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    // 滚动显示/隐藏按钮
    const handleBackToTopScroll = Utils.throttle(() => {
        if (window.scrollY > CONFIG.scroll.backToTopShowPoint) {
            Utils.addClass(backToTopBtn, 'show');
        } else {
            Utils.removeClass(backToTopBtn, 'show');
        }
    }, 100);

    window.addEventListener('scroll', handleBackToTopScroll);

    // 点击返回顶部
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 作品集画廊功能
function initPortfolioGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    // 作品数据 - 集中管理便于维护
    const ARTWORKS_DATA = [
        {
            filename: '末代皇帝.jpg',
            title: '末代皇帝',
            description: '经典电影海报，历史感与艺术性的完美结合'
        },
        {
            filename: '末路狂花.jpg',
            title: '末路狂花',
            description: '电影海报设计，强烈的视觉冲击与情感表达'
        },
        {
            filename: '燃烧女子的画像.jpg',
            title: '燃烧女子的画像',
            description: '艺术电影海报，细腻的情感与唯美的画面'
        },
        {
            filename: '艾蜜莉的异想世界.jpg',
            title: '艾蜜莉的异想世界',
            description: '温馨浪漫的电影海报，充满想象力的视觉设计'
        },
        {
            filename: '让子弹飞.jpg',
            title: '让子弹飞',
            description: '动作电影海报，动感十足的视觉表现'
        },
        {
            filename: '请以你的名字呼唤我.jpg',
            title: '请以你的名字呼唤我',
            description: '文艺电影海报，诗意而深情的视觉语言'
        },
        {
            filename: '阳光灿烂的日子.jpg',
            title: '阳光灿烂的日子',
            description: '青春电影海报，怀旧与温暖的色彩基调'
        },
        {
            filename: '小丑.jpg',
            title: '小丑',
            description: '心理惊悚电影海报，深刻的人物刻画'
        },
        {
            filename: 'yiyi.jpg',
            title: '一一',
            description: '家庭剧情电影海报，温情而深刻的人生思考'
        },
        {
            filename: '平原上的夏洛克.jpg',
            title: '平原上的夏洛克',
            description: '现实主义电影海报，质朴而感人的故事叙述'
        }
    ];

    // 生成作品HTML的模板函数
    function createArtworkElement(artwork, index) {
        const artworkElement = document.createElement('div');
        artworkElement.className = 'artwork-item';
        artworkElement.setAttribute('data-aos', 'fade-up');
        artworkElement.setAttribute('data-aos-delay', (index * 100).toString());

        artworkElement.innerHTML = `
            <img src="images/portfolio/${artwork.filename}"
                 alt="${artwork.title}"
                 class="artwork-image"
                 loading="lazy"
                 onerror="this.src='images/portfolio/placeholder.jpg'">
            <div class="artwork-info">
                <h3 class="artwork-title">${artwork.title}</h3>
                <p class="artwork-description">${artwork.description}</p>
            </div>
        `;

        // 添加点击事件
        artworkElement.addEventListener('click', () => openImageModal(artwork));
        
        return artworkElement;
    }

    // 渲染所有作品
    function renderArtworks() {
        // 使用文档片段提高性能
        const fragment = document.createDocumentFragment();
        
        ARTWORKS_DATA.forEach((artwork, index) => {
            const artworkElement = createArtworkElement(artwork, index);
            fragment.appendChild(artworkElement);
        });
        
        galleryGrid.appendChild(fragment);
    }

    // 初始化画廊
    renderArtworks();
}

// 图片模态框功能
function initImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    const modalImage = document.getElementById('modalImage');
    const imageTitle = document.getElementById('imageTitle');
    const imageDescription = document.getElementById('imageDescription');
    const closeModal = document.getElementById('closeModal');

    // 打开模态框
    window.openImageModal = function(artwork) {
        if (!modal || !modalImage) return;

        modalImage.src = `images/portfolio/${artwork.filename}`;
        modalImage.alt = artwork.title;
        
        if (imageTitle) imageTitle.textContent = artwork.title;
        if (imageDescription) imageDescription.textContent = artwork.description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    };

    // 关闭模态框函数
    function closeImageModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 事件监听器
    if (closeModal) {
        closeModal.addEventListener('click', closeImageModal);
    }

    // 点击模态框背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeImageModal();
        }
    });
}

// 联系表单功能
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // 表单验证规则
    const VALIDATION_RULES = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            message: '姓名必须为2-50个字符'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '请输入有效的邮箱地址'
        },
        subject: {
            required: true,
            message: '请选择联系主题'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 500,
            message: '消息内容必须为10-500个字符'
        }
    };

    // 验证单个字段
    function validateField(fieldName, value) {
        const rule = VALIDATION_RULES[fieldName];
        if (!rule) return { valid: true };

        // 必填验证
        if (rule.required && !value.trim()) {
            return { valid: false, message: rule.message };
        }

        // 长度验证
        if (rule.minLength && value.length < rule.minLength) {
            return { valid: false, message: rule.message };
        }

        if (rule.maxLength && value.length > rule.maxLength) {
            return { valid: false, message: rule.message };
        }

        // 正则验证
        if (rule.pattern && !rule.pattern.test(value)) {
            return { valid: false, message: rule.message };
        }

        return { valid: true };
    }

    // 显示错误信息
    function showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // 清除错误信息
    function clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        let isValid = true;
        const errors = {};

        // 验证所有字段
        for (const [fieldName, rule] of Object.entries(VALIDATION_RULES)) {
            const value = formData.get(fieldName) || '';
            const validation = validateField(fieldName, value);
            
            if (!validation.valid) {
                errors[fieldName] = validation.message;
                isValid = false;
            }
        }

        // 显示错误或提交表单
        if (!isValid) {
            Object.entries(errors).forEach(([fieldName, message]) => {
                showFieldError(fieldName, message);
            });
        } else {
            // 清除所有错误
            Object.keys(VALIDATION_RULES).forEach(clearFieldError);
            
            // 模拟表单提交
            simulateFormSubmission(formData);
        }
    });

    // 实时验证
    Object.keys(VALIDATION_RULES).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', () => {
                const validation = validateField(fieldName, field.value);
                if (!validation.valid) {
                    showFieldError(fieldName, validation.message);
                } else {
                    clearFieldError(fieldName);
                }
            });
        }
    });

    // 模拟表单提交
    function simulateFormSubmission(formData) {
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // 显示提交状态
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;
        
        // 模拟网络请求
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // 显示成功消息
            showFormResult(true);
            form.reset();
        }, 2000);
    }
}

// 显示表单结果
function showFormResult(success) {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // 移除现有结果
    const existingResult = form.querySelector('.form-result');
    if (existingResult) {
        existingResult.remove();
    }

    const resultDiv = document.createElement('div');
    resultDiv.className = 'form-result';
    resultDiv.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        transition: opacity 0.3s ease;
        ${success ?
            'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' :
            'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;

    resultDiv.innerHTML = success ?
        '<strong>发送成功！</strong> 感谢您的联系，我会尽快回复。' :
        '<strong>发送失败！</strong> 请检查信息后重试。';

    form.appendChild(resultDiv);

    // 自动移除结果提示
    setTimeout(() => {
        if (resultDiv.parentNode) {
            resultDiv.style.opacity = '0';
            setTimeout(() => resultDiv.remove(), 300);
        }
    }, CONFIG.form.resultDisplayTime);
}

// 平滑滚动 - 优化版本
function initSmoothScroll() {
    // 处理锚点链接
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // 返回顶部
        if (href === '#' || href === '#top') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        // 其他锚点滚动
        else {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // 导航栏高度偏移
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// AOS初始化 - 延迟加载优化
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: CONFIG.animation.duration,
        offset: CONFIG.animation.offset,
        once: CONFIG.animation.once,
        easing: 'ease-out-cubic'
    });
}

// 性能监控和错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
});

// 页面可见性API - 优化性能
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停某些功能
        console.log('页面隐藏，暂停非关键功能');
    } else {
        // 页面显示时恢复功能
        console.log('页面显示，恢复所有功能');
    }
});

// 响应式图片懒加载优化
if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src || lazyImage.src;
                lazyImage.classList.remove('lazy');
                lazyImageObserver.unobserve(lazyImage);
            }
        });
    });

    // 观察所有懒加载图片
    document.querySelectorAll('img[loading="lazy"]').forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
    });
}



