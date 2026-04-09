document.addEventListener("DOMContentLoaded", () => {
    // 1. Define the Navigation Header
    const headerHTML = `
    <nav class="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="index.html" class="text-2xl font-black italic tracking-tighter text-white">
                FEES <span class="text-[#00bc7d]">PLEASE.</span>
            </a>
            <div class="hidden md:flex space-x-8 items-center">
                <a href="index.html#features" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
                <a href="index.html#tech" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Technology</a>
                <a href="mailto:hello@feesplease.app" class="bg-[#00bc7d] hover:bg-[#009767] px-5 py-2 rounded-full text-sm font-bold text-white transition-all">Contact</a>
            </div>
        </div>
    </nav>
    `;

    // 2. Define the Footer with correct Legal Entity (Ashley Graeme Pitt)
    const footerHTML = `
    <footer class="py-12 border-t border-zinc-800 bg-zinc-950 mt-auto">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <p class="text-white font-bold italic mb-2">FEES PLEASE.</p>
            <p class="text-zinc-500 mb-2 text-sm">
                © 2026 Fees Please. All Rights Reserved.
            </p>
            <p class="text-zinc-600 mb-6 text-xs tracking-wide">
                ABN: 62 997 103 770
            </p>
            <div class="flex justify-center gap-8 text-sm">
                <a href="privacy.html" class="text-zinc-400 hover:text-[#00bc7d] transition-colors">Privacy Policy</a>
                <a href="terms.html" class="text-zinc-400 hover:text-[#00bc7d] transition-colors">Terms of Service</a>
                <a href="mailto:hello@feesplease.app" class="text-zinc-400 hover:text-[#00bc7d] transition-colors">Contact Support</a>
            </div>
        </div>
    </footer>
    `;

    // 3. Inject into the DOM
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;
});