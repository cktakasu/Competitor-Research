const portalMarkup = `<aside class="w-16 flex flex-col items-center bg-white border-r border-scandi-warm-grey py-8 z-20 shadow-sm flex-shrink-0">
<div class="mb-10">
<div class="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-scandi-wood">
<span class="material-symbols-outlined text-2xl">electric_bolt</span>
</div>
</div>
<nav class="flex-1 flex flex-col gap-6 w-full px-2">
<a class="h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-text-muted hover:bg-scandi-wood hover:text-text-main transition-all group" href="#" title="Dashboard">
<span class="material-symbols-outlined">dashboard</span>
</a>
<a class="h-10 w-10 mx-auto flex items-center justify-center rounded-lg bg-scandi-wood text-primary relative group" href="#" title="Product Selection">
<span class="material-symbols-outlined icon-filled">category</span>
</a>
<a class="h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-text-muted hover:bg-scandi-wood hover:text-text-main transition-all" href="#" title="Status Monitor">
<span class="material-symbols-outlined">monitoring</span>
</a>
<a class="h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-text-muted hover:bg-scandi-wood hover:text-text-main transition-all" href="#" title="Analytics">
<span class="material-symbols-outlined">analytics</span>
</a>
</nav>
<div class="mt-auto flex flex-col gap-6 w-full px-2">
<a class="h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-text-muted hover:bg-scandi-wood hover:text-text-main transition-all" href="#" title="Settings">
<span class="material-symbols-outlined">settings</span>
</a>
<div class="h-8 w-8 mx-auto rounded-full bg-scandi-warm-grey flex items-center justify-center text-[10px] font-bold text-text-main ring-2 ring-white shadow-sm cursor-pointer">
            JD
        </div>
</div>
</aside>
<main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
<header class="px-8 py-8 relative z-10 flex justify-between items-end">
<div>
<p class="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">System Configuration</p>
<h1 class="text-4xl font-bold text-text-main tracking-tight">Select Breaker Category</h1>
</div>
<div class="flex items-center gap-3">
<span class="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-scandi-warm-grey shadow-sm text-xs font-semibold text-text-main">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
</span>
                System Online
            </span>
</div>
</header>
<div class="flex-1 overflow-y-auto px-8 pb-10 relative z-10">
<div class="max-w-[1800px] mx-auto h-full flex flex-col">
<div class="grid grid-cols-3 gap-4 h-full min-h-[700px]">
<div class="group relative bg-white rounded-3xl p-8 shadow-scandi flex flex-col overflow-hidden border border-scandi-warm-grey/50">
<div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&amp;w=2070&amp;auto=format&amp;fit=crop')] bg-cover bg-center opacity-[0.04] grayscale"></div>
<div class="relative z-10 flex justify-between items-start mb-4">
<span class="px-3 py-1 rounded-full bg-scandi-warm-grey text-text-muted text-[10px] font-bold uppercase tracking-widest">Locked</span>
<span class="material-symbols-outlined text-scandi-warm-grey">lock</span>
</div>
<div class="relative z-10">
<h3 class="text-6xl font-black text-text-main mb-1 tracking-tighter">ACB</h3>
<p class="text-lg text-text-muted font-medium">Air Circuit Breaker</p>
</div>
<div class="relative z-10 mt-8 space-y-7 flex-1">
<div class="bg-scandi-light/80 rounded-2xl p-5 border border-scandi-warm-grey">
<h4 class="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Key Specifications</h4>
<div class="grid grid-cols-2 gap-5">
<div>
<p class="text-[11px] text-text-muted uppercase font-bold mb-1">Current</p>
<p class="text-lg font-bold text-text-main font-mono">800-6300A</p>
</div>
<div>
<p class="text-[11px] text-text-muted uppercase font-bold mb-1">Capacity</p>
<p class="text-lg font-bold text-text-main font-mono">100kA</p>
</div>
</div>
</div>
<div>
<h4 class="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Industrial Applications</h4>
<ul class="text-base text-text-main space-y-2 font-medium">
<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-scandi-warm-grey"></span> Main distribution</li>
<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-scandi-warm-grey"></span> Industrial plants</li>
</ul>
</div>
</div>
<div class="relative z-10 mt-auto">
<button class="w-full py-4 rounded-2xl bg-scandi-warm-grey/50 text-text-muted text-sm font-bold border border-dashed border-scandi-warm-grey" disabled="">
                            Available Q4 2024
                        </button>
</div>
</div>
<div class="group relative bg-white rounded-3xl p-8 shadow-scandi flex flex-col overflow-hidden border border-scandi-warm-grey/50">
<div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563770095-39d46baa2c7c?q=80&amp;w=2070&amp;auto=format&amp;fit=crop')] bg-cover bg-center opacity-[0.04] grayscale"></div>
<div class="relative z-10 flex justify-between items-start mb-4">
<span class="px-3 py-1 rounded-full bg-scandi-warm-grey text-text-muted text-[10px] font-bold uppercase tracking-widest">Waitlist</span>
<span class="material-symbols-outlined text-scandi-warm-grey">hourglass_empty</span>
</div>
<div class="relative z-10">
<h3 class="text-6xl font-black text-text-main mb-1 tracking-tighter">MCCB</h3>
<p class="text-lg text-text-muted font-medium">Molded Case Circuit Breaker</p>
</div>
<div class="relative z-10 mt-8 space-y-7 flex-1">
<div class="bg-scandi-light/80 rounded-2xl p-5 border border-scandi-warm-grey">
<h4 class="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Key Specifications</h4>
<div class="grid grid-cols-2 gap-5">
<div>
<p class="text-[11px] text-text-muted uppercase font-bold mb-1">Current</p>
<p class="text-lg font-bold text-text-main font-mono">100-2500A</p>
</div>
<div>
<p class="text-[11px] text-text-muted uppercase font-bold mb-1">Capacity</p>
<p class="text-lg font-bold text-text-main font-mono">85kA</p>
</div>
</div>
</div>
<div>
<h4 class="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Typical Applications</h4>
<ul class="text-base text-text-main space-y-2 font-medium">
<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-scandi-warm-grey"></span> Sub-distribution</li>
<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-scandi-warm-grey"></span> Motor protection</li>
</ul>
</div>
</div>
<div class="relative z-10 mt-auto">
<button class="w-full py-4 rounded-2xl bg-scandi-warm-grey/50 text-text-muted text-sm font-bold border border-dashed border-scandi-warm-grey" disabled="">
                            Coming Soon
                        </button>
</div>
</div>
<div class="group relative bg-white rounded-3xl p-8 shadow-2xl flex flex-col overflow-hidden border-4 border-accent ring-4 ring-accent/5">
<div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&amp;w=2069&amp;auto=format&amp;fit=crop')] bg-cover bg-center opacity-[0.08] grayscale mix-blend-multiply"></div>
<div class="relative z-10 flex justify-between items-start mb-4">
<span class="px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
<span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Active Selection
                        </span>
<span class="material-symbols-outlined text-accent icon-filled">bolt</span>
</div>
<div class="relative z-10">
<h3 class="text-6xl font-black text-text-main mb-1 tracking-tighter">MCB</h3>
<p class="text-lg text-text-main font-bold">Miniature Circuit Breaker</p>
</div>
<div class="relative z-10 mt-8 space-y-7 flex-1">
<div class="bg-white rounded-2xl overflow-hidden border-2 border-scandi-warm-grey shadow-sm">
<div class="px-5 py-3 border-b border-scandi-warm-grey bg-scandi-light">
<h4 class="text-xs font-black text-text-main uppercase tracking-widest">Specifications</h4>
</div>
<div class="p-5">
<div class="grid grid-cols-2 gap-y-5 gap-x-6">
<div>
<p class="text-[11px] text-text-muted font-bold uppercase mb-1">Rated Current</p>
<p class="text-lg font-black text-text-main font-mono">0.5-125A</p>
</div>
<div>
<p class="text-[11px] text-text-muted font-bold uppercase mb-1">Poles</p>
<p class="text-lg font-black text-text-main font-mono">1P-4P</p>
</div>
<div class="col-span-2 pt-4 border-t border-scandi-warm-grey">
<p class="text-[11px] text-text-muted font-bold uppercase mb-1">Curve Characteristics</p>
<p class="text-sm font-bold text-text-main font-mono">Type B, C, D, K, Z</p>
</div>
</div>
</div>
</div>
<div>
<h4 class="text-xs font-black text-text-muted uppercase tracking-widest mb-4">Supported Use Cases</h4>
<div class="flex flex-wrap gap-2">
<span class="px-3 py-1.5 rounded-lg bg-scandi-wood text-text-main text-xs font-bold border border-scandi-warm-grey">Residential</span>
<span class="px-3 py-1.5 rounded-lg bg-scandi-wood text-text-main text-xs font-bold border border-scandi-warm-grey">Commercial</span>
<span class="px-3 py-1.5 rounded-lg bg-scandi-wood text-text-main text-xs font-bold border border-scandi-warm-grey">Final Distribution</span>
</div>
</div>
</div>
<div class="relative z-10 mt-auto pt-4">
<button class="w-full py-5 rounded-2xl bg-accent hover:bg-red-600 text-white text-base font-black shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-3">
                            Proceed to Configuration
                            <span class="material-symbols-outlined text-xl font-bold">arrow_forward</span>
</button>
</div>
</div>
</div>
<footer class="mt-auto py-10 flex justify-between items-center border-t border-scandi-warm-grey">
<p class="text-text-muted text-xs font-medium uppercase tracking-widest">© 2024 LV Breaker Intelligence Systems.</p>
<div class="flex gap-10">
<a class="text-text-muted hover:text-text-main text-xs font-bold uppercase tracking-widest transition-colors" href="#">Privacy Policy</a>
<a class="text-text-muted hover:text-text-main text-xs font-bold uppercase tracking-widest transition-colors" href="#">Terms of Service</a>
</div>
</footer>
</div>
</div>
</main>`;

export default function Home() {
  return <div dangerouslySetInnerHTML={{ __html: portalMarkup }} />;
}
