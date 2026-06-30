// ================================
// Fees Please - main.js
// Shared nav, footer, PostHog init,
// scroll animations & consent banner
// ================================

// ── PostHog Analytics ────────────────────────────────────────
// TODO: Replace 'YOUR_POSTHOG_KEY' with your actual project API key
// from PostHog → Project Settings → Project API Key
const POSTHOG_KEY = 'YOUR_POSTHOG_KEY';
const POSTHOG_HOST = 'https://app.posthog.com';

!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(a!==void 0?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

// Initialise PostHog with opt-out persistence (GDPR friendly)
posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    opt_out_capturing_by_default: true,  // wait for consent
    persistence: 'localStorage'
});

// ── Consent Banner & Google Analytics ───────────────────────
function loadGoogleAnalytics() {
    if (window.ga_loaded) return;
    window.ga_loaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-085XCYD57B';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'G-085XCYD57B');
}

function showConsentBanner() {
    const consent = localStorage.getItem('fp_analytics_consent');
    if (consent === 'accepted') { 
        posthog.opt_in_capturing(); 
        loadGoogleAnalytics();
        return; 
    }
    if (consent === 'declined') return;

    const banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.id = 'consent-banner';
    banner.innerHTML = `
        <p>We use cookies and analytics to improve your experience. <a href="privacy.html">Privacy Policy</a></p>
        <button class="consent-btn decline" id="consent-decline">Decline</button>
        <button class="consent-btn accept" id="consent-accept">Accept</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('consent-accept').addEventListener('click', () => {
        localStorage.setItem('fp_analytics_consent', 'accepted');
        posthog.opt_in_capturing();
        loadGoogleAnalytics();
        posthog.capture('analytics_consent_accepted');
        banner.remove();
    });

    document.getElementById('consent-decline').addEventListener('click', () => {
        localStorage.setItem('fp_analytics_consent', 'declined');
        banner.remove();
    });
}

// ── Navigation HTML ───────────────────────────────────────
function buildNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = [
        { href: 'features.html', label: 'Features' },
        { href: 'pricing.html', label: 'Pricing' },
        { href: 'square.html', label: 'Square' },
        { href: 'index.html#solutions', label: 'Solutions' },
    ];

    const linksHTML = navLinks.map(l => {
        const active = currentPage === l.href ? 'text-white' : 'text-zinc-400 hover:text-white';
        return `<a href="${l.href}" class="text-sm font-medium ${active} transition-colours nav-link" data-ph-event="nav_click" data-ph-label="${l.label}">${l.label}</a>`;
    }).join('');

    return `
    <nav id="main-nav" class="fixed top-0 w-full z-50 transition-all duration-300" style="background: rgba(15,15,17,0); backdrop-filter: blur(0px);">
        <div class="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
            <a href="index.html" id="nav-logo-link">
                <img src="assets/logo-green.png" alt="Fees Please" class="h-10 w-auto" id="nav-logo">
            </a>
            <div class="hidden md:flex space-x-8 items-center">
                ${linksHTML}
                <a href="https://app.feesplease.app" 
                   class="btn-primary text-sm py-2 px-5"
                   data-ph-event="nav_cta_click"
                   id="nav-cta-btn">
                    Get Started Free →
                </a>
            </div>
            <button class="md:hidden text-zinc-400 hover:text-white transition-colours" id="mobile-menu-btn" aria-label="Open menu">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
        </div>
        <!-- Mobile Menu -->
        <div class="hidden md:hidden border-t border-white/5 px-6 py-4 space-y-4" id="mobile-menu" style="background: rgba(15,15,17,0.95);">
            ${navLinks.map(l => `<a href="${l.href}" class="block text-sm font-medium text-zinc-400 hover:text-white transition-colours py-1">${l.label}</a>`).join('')}
            <a href="https://app.feesplease.app" class="btn-primary text-sm py-2.5 w-full justify-center mt-2">Get Started Free →</a>
        </div>
    </nav>`;
}

// ── Footer HTML ────────────────────────────────────────────
function buildFooter() {
    return `
    <footer>
        <div class="container">
            <div style="display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.06);" class="footer-grid">
                <div>
                    <img src="assets/logo-green.png" alt="Fees Please" class="h-10 w-auto mb-4">
                    <p style="font-size:0.875rem; color:#71717a; line-height:1.7; max-width: 280px;">
                        The game-day engine for social sports teams. Track fees, manage the ledger, and automate the banter.
                    </p>
                    <p style="font-size:0.75rem; color:#52525b; margin-top:1rem;">ABN: 62 997 103 770</p>
                </div>
                <div>
                    <p style="font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#52525b; margin-bottom:1rem;">Product</p>
                    <div style="display:flex; flex-direction:column; gap:0.6rem;">
                        <a href="features.html" style="font-size:0.875rem; color:#71717a;" class="footer-link">Features</a>
                        <a href="pricing.html" style="font-size:0.875rem; color:#71717a;" class="footer-link">Pricing</a>
                        <a href="square.html" style="font-size:0.875rem; color:#71717a;" class="footer-link">Square Integration</a>
                        <a href="index.html#solutions" style="font-size:0.875rem; color:#71717a;" class="footer-link">Solutions</a>
                    </div>
                </div>
                <div>
                    <p style="font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#52525b; margin-bottom:1rem;">Resources</p>
                    <div style="display:flex; flex-direction:column; gap:0.6rem;">
                        <a href="index.html#blog" style="font-size:0.875rem; color:#71717a;" class="footer-link">Blog</a>
                        <a href="#" style="font-size:0.875rem; color:#71717a;" class="footer-link">Help Centre</a>
                        <a href="contact.html" style="font-size:0.875rem; color:#71717a;" class="footer-link">Contact</a>
                    </div>
                </div>
                <div>
                    <p style="font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#52525b; margin-bottom:1rem;">Legal</p>
                    <div style="display:flex; flex-direction:column; gap:0.6rem;">
                        <a href="privacy.html" style="font-size:0.875rem; color:#71717a;" class="footer-link">Privacy Policy</a>
                        <a href="terms.html" style="font-size:0.875rem; color:#71717a;" class="footer-link">Terms of Service</a>
                    </div>
                </div>
            </div>
            <div style="padding-top:2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                <p style="font-size:0.8rem; color:#52525b;">© 2026 Fees Please. All rights reserved.</p>
                <div style="display:flex; gap:1.25rem; align-items:center;">
                    <a href="https://www.facebook.com/people/Fees-Please/61591266593079/" target="_blank" rel="noopener" style="color:#52525b; transition:color 0.2s;" onmouseover="this.style.color='#00bc7d'" onmouseout="this.style.color='#52525b'" aria-label="Facebook"><i class="fa-brands fa-facebook-f" style="font-size:1rem;"></i></a>
                    <a href="https://www.instagram.com/feespleaseapp" target="_blank" rel="noopener" style="color:#52525b; transition:color 0.2s;" onmouseover="this.style.color='#00bc7d'" onmouseout="this.style.color='#52525b'" aria-label="Instagram"><i class="fa-brands fa-instagram" style="font-size:1rem;"></i></a>
                    <a href="https://www.youtube.com/@feespleaseapp" target="_blank" rel="noopener" style="color:#52525b; transition:color 0.2s;" onmouseover="this.style.color='#00bc7d'" onmouseout="this.style.color='#52525b'" aria-label="YouTube"><i class="fa-brands fa-youtube" style="font-size:1rem;"></i></a>
                </div>
                <p style="font-size:0.8rem; color:#52525b;">Made in Australia 🇦🇺</p>
            </div>
        </div>
    </footer>`;
}

// ── Scroll-triggered Nav Background ───────────────────────
function initNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.style.background = 'rgba(15,15,17,0.95)';
            nav.style.backdropFilter = 'blur(16px)';
            nav.style.boxShadow = '0 1px 0 rgba(255,255,255,0.05)';
        } else {
            nav.style.background = 'rgba(15,15,17,0)';
            nav.style.backdropFilter = 'blur(0px)';
            nav.style.boxShadow = 'none';
        }
    }, { passive: true });
}

// ── Mobile Menu ───────────────────────────────────────────
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }
}

// ── Scroll Animations ─────────────────────────────────────
function initScrollAnimations() {
    const els = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => observer.observe(el));
}

// ── PostHog Event Tracking ────────────────────────────────
function initTracking() {
    // Track nav clicks
    document.querySelectorAll('[data-ph-event]').forEach(el => {
        el.addEventListener('click', () => {
            const event = el.dataset.phEvent;
            const label = el.dataset.phLabel || el.innerText;
            posthog.capture(event, { label, page: window.location.pathname });
        });
    });

    // Track CTA clicks (capture class name)
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(el => {
        el.addEventListener('click', () => {
            posthog.capture('cta_click', {
                text: el.innerText.trim(),
                href: el.href || null,
                page: window.location.pathname
            });
        });
    });
}

// ── Pricing Toggle (Monthly / Annual) ─────────────────────
function initPricingToggle() {
    const toggle = document.getElementById('billing-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
        const isAnnual = toggle.checked;
        document.querySelectorAll('[data-monthly]').forEach(el => {
            el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
        });
        document.querySelectorAll('[data-annual-note]').forEach(el => {
            el.style.display = isAnnual ? 'block' : 'none';
        });
        posthog.capture('pricing_toggle', { billing: isAnnual ? 'annual' : 'monthly' });
    });
}

// ── Fee Savings Calculator ─────────────────────────────────
function initCalculator() {
    const calcPlayers = document.getElementById('calc-players');
    const calcPlayersDisplay = document.getElementById('calc-players-display');
    const calcFee = document.getElementById('calc-fee');
    const calcFeeDisplay = document.getElementById('calc-fee-display');
    const calcRounds = document.getElementById('calc-rounds');
    const calcRoundsDisplay = document.getElementById('calc-rounds-display');
    const calcDigital = document.getElementById('calc-digital');
    const calcDigitalDisplay = document.getElementById('calc-digital-display');
    
    const calcFreeCost = document.getElementById('calc-free-cost');
    const calcPlusCost = document.getElementById('calc-plus-cost');
    const calcVerdict = document.getElementById('calc-verdict');
    const calcVerdictText = document.getElementById('calc-verdict-text');
    const calcVerdictSub = document.getElementById('calc-verdict-sub');

    if (!calcPlayers || !calcFee || !calcRounds || !calcDigital) return;

    function calculate() {
        const players = parseInt(calcPlayers.value);
        const fee = parseInt(calcFee.value);
        const rounds = parseInt(calcRounds.value);
        const digitalPercent = parseInt(calcDigital.value);

        // Update displays
        if (calcPlayersDisplay) calcPlayersDisplay.textContent = players;
        if (calcFeeDisplay) calcFeeDisplay.textContent = fee;
        if (calcRoundsDisplay) calcRoundsDisplay.textContent = rounds;
        if (calcDigitalDisplay) calcDigitalDisplay.textContent = digitalPercent;

        // Math: Total digital fees collected per season
        const totalDigitalFees = players * fee * rounds * (digitalPercent / 100);
        
        // Free tier has 2.5% clip
        const freeCost = Math.round(totalDigitalFees * 0.025);
        
        // Plus tier has $69 annual sub + 30c flat clip per digital transaction
        const transactions = Math.round(players * rounds * (digitalPercent / 100));
        const plusCost = 69 + Math.round(transactions * 0.30);

        if (calcFreeCost) calcFreeCost.textContent = '$' + freeCost;
        if (calcPlusCost) calcPlusCost.textContent = '$' + plusCost;

        if (!calcVerdict || !calcVerdictText || !calcVerdictSub) return;

        if (freeCost > plusCost) {
            // Plus is cheaper
            const savings = freeCost - plusCost;
            calcVerdictText.textContent = `🎉 Plus saves your team $${savings}/season!`;
            calcVerdictSub.textContent = `At a 2.5% Free clip, you'd pay $${freeCost} in platform fees. Plus (sub + 30¢ flat clips) is only $${plusCost} total.`;
            calcVerdict.style.background = 'rgba(0, 188, 125, 0.08)';
            calcVerdict.style.borderColor = 'rgba(0, 188, 125, 0.2)';
            calcVerdictText.style.color = '#00bc7d';
        } else if (freeCost === plusCost) {
            // Equal cost
            calcVerdictText.textContent = `⚖️ Plus is exactly the same cost as Free!`;
            calcVerdictSub.textContent = `Your transaction fees match the Plus tier cost ($${plusCost} total). Upgrade for availability invites, selection emails & AI summaries for no extra net cost.`;
            calcVerdict.style.background = 'rgba(0, 188, 125, 0.08)';
            calcVerdict.style.borderColor = 'rgba(0, 188, 125, 0.2)';
            calcVerdictText.style.color = '#00bc7d';
        } else {
            // Free is cheaper
            const difference = plusCost - freeCost;
            calcVerdictText.textContent = `📋 Free tier is cost-effective, but Plus is only $${difference} more/yr.`;
            calcVerdictSub.textContent = `Plus unlocks Team Wallet tracking, custom team sponsors (e.g. your local pub), and availability & selected lineup email invitations.`;
            calcVerdict.style.background = 'rgba(255, 255, 255, 0.03)';
            calcVerdict.style.borderColor = 'var(--border)';
            calcVerdictText.style.color = '#fff';
        }
    }

    [calcPlayers, calcFee, calcRounds, calcDigital].forEach(input => {
        input.addEventListener('input', () => {
            calculate();
        });
        
        input.addEventListener('change', () => {
            if (typeof posthog !== 'undefined') {
                posthog.capture('calculator_interacted', {
                    players: calcPlayers.value,
                    fee: calcFee.value,
                    rounds: calcRounds.value,
                    digital: calcDigital.value
                });
            }
        });
    });

    // Init
    calculate();
}

// ── Bootstrap ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const headerEl = document.getElementById('header-placeholder');
    const footerEl = document.getElementById('footer-placeholder');

    if (headerEl) headerEl.innerHTML = buildNav();
    if (footerEl) footerEl.innerHTML = buildFooter();

    // Add footer link hover styles
    document.querySelectorAll('.footer-link').forEach(a => {
        a.addEventListener('mouseover', () => a.style.color = '#00bc7d');
        a.addEventListener('mouseout', () => a.style.color = '#71717a');
    });

    initNavScroll();
    initMobileMenu();
    initScrollAnimations();
    initTracking();
    initPricingToggle();
    initCalculator();
    showConsentBanner();

    // Track page view
    posthog.capture('$pageview');
});