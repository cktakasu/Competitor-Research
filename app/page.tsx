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
<div class="group relative -ml-4 bg-white rounded-3xl p-8 shadow-scandi flex flex-col overflow-hidden border border-scandi-warm-grey/50">
<div class="absolute inset-0 bg-[url('https://us.mitsubishielectric.com/fa/en/-/media/images/webredesign/products/lvd/lvcb/items/acb/img/air-circuit-breaker-main-banner.ashx?h=496&amp;hash=E34D31108240B951A190629259F8D415&amp;la=en&amp;w=880')] bg-no-repeat opacity-[0.10] grayscale" style="background-size: 330% auto; background-position: center;"></div>
<div class="absolute inset-0 pointer-events-none" style="background-image: repeating-radial-gradient(circle, rgba(45,42,38,0.30) 0 0.5px, transparent 0.5px 2.4px); background-size: 4.8px 4.8px; mix-blend-mode: multiply; opacity: 0.72; -webkit-mask-image: url('https://us.mitsubishielectric.com/fa/en/-/media/images/webredesign/products/lvd/lvcb/items/acb/img/air-circuit-breaker-main-banner.ashx?h=496&amp;hash=E34D31108240B951A190629259F8D415&amp;la=en&amp;w=880'); mask-image: url('https://us.mitsubishielectric.com/fa/en/-/media/images/webredesign/products/lvd/lvcb/items/acb/img/air-circuit-breaker-main-banner.ashx?h=496&amp;hash=E34D31108240B951A190629259F8D415&amp;la=en&amp;w=880'); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-size: 330% auto; mask-size: 330% auto; -webkit-mask-position: center; mask-position: center;"></div>

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
<p class="text-lg font-bold text-text-main font-mono">630-6300A</p>
</div>
<div>
<p class="text-[11px] text-text-muted uppercase font-bold mb-1">Breaking Capacity</p>
<p class="text-lg font-bold text-text-main font-mono">up to 150kA</p>
</div>
</div>
</div>
<div>
<h4 class="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Application</h4>
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
<div class="absolute inset-0 bg-[url('https://us.mitsubishielectric.com/fa/en/-/media/images/webredesign/products/lvd/lvcb/items/mccb/img/molded-case-cb-main-banner.ashx?h=496&amp;hash=968BF4BB4B8C8A3AC661E124672A79F0&amp;la=en&amp;w=880')] bg-no-repeat opacity-[0.10] grayscale" style="background-size: 330% auto; background-position: center;"></div>
<div class="absolute inset-0 pointer-events-none" style="background-image: repeating-radial-gradient(circle, rgba(45,42,38,0.30) 0 0.5px, transparent 0.5px 2.4px); background-size: 4.8px 4.8px; mix-blend-mode: multiply; opacity: 0.72; -webkit-mask-image: url('https://us.mitsubishielectric.com/fa/en/-/media/images/webredesign/products/lvd/lvcb/items/mccb/img/molded-case-cb-main-banner.ashx?h=496&amp;hash=968BF4BB4B8C8A3AC661E124672A79F0&amp;la=en&amp;w=880'); mask-image: url('https://us.mitsubishielectric.com/fa/en/-/media/images/webredesign/products/lvd/lvcb/items/mccb/img/molded-case-cb-main-banner.ashx?h=496&amp;hash=968BF4BB4B8C8A3AC661E124672A79F0&amp;la=en&amp;w=880'); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-size: 330% auto; mask-size: 330% auto; -webkit-mask-position: center; mask-position: center;"></div>

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
<p class="text-lg font-bold text-text-main font-mono">16-3200A</p>
</div>
<div>
<p class="text-[11px] text-text-muted uppercase font-bold mb-1">Breaking Capacity</p>
<p class="text-lg font-bold text-text-main font-mono">up to 200kA</p>
</div>
</div>
</div>
<div>
<h4 class="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Application</h4>
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
<div class="group relative -mr-4 bg-white rounded-3xl p-8 shadow-2xl flex flex-col overflow-hidden border-4 border-accent ring-4 ring-accent/5">
<div class="absolute inset-0 bg-[url('https://www.mitsubishielectric.com/fa/products/lvd/lvcb/items/mcb/img/img_mv-1.png')] bg-no-repeat opacity-[0.10] grayscale mix-blend-multiply" style="background-size: 330% auto; background-position: 48% center;"></div>
<div class="absolute inset-0 pointer-events-none" style="background-image: repeating-radial-gradient(circle, rgba(45,42,38,0.30) 0 0.5px, transparent 0.5px 2.4px); background-size: 4.8px 4.8px; mix-blend-mode: multiply; opacity: 0.72; -webkit-mask-image: url('https://www.mitsubishielectric.com/fa/products/lvd/lvcb/items/mcb/img/img_mv-1.png'); mask-image: url('https://www.mitsubishielectric.com/fa/products/lvd/lvcb/items/mcb/img/img_mv-1.png'); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-size: 330% auto; mask-size: 330% auto; -webkit-mask-position: 48% center; mask-position: 48% center;"></div>

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
<p class="text-[11px] text-text-muted font-bold uppercase mb-1">Breaking Capacity</p>
<p class="text-lg font-black text-text-main font-mono">6-15kA</p>
</div>
<div class="col-span-2 pt-4 border-t border-scandi-warm-grey">
<p class="text-[11px] text-text-muted font-bold uppercase mb-1">Curve Characteristics</p>
<p class="text-sm font-bold text-text-main font-mono">Type B, C, D, K, Z</p>
</div>
</div>
</div>
</div>
<div>
<h4 class="text-xs font-black text-text-muted uppercase tracking-widest mb-4">Application</h4>
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
</main>
<script>
(() => {
  const target = location.pathname.endsWith(".html") ? location.pathname : "/index.html";
  let lastModified = null;

  const check = async () => {
    try {
      const response = await fetch(target, { method: "HEAD", cache: "no-store" });
      const current = response.headers.get("Last-Modified");
      if (!current) return;
      if (lastModified && current !== lastModified) {
        location.reload();
        return;
      }
      lastModified = current;
    } catch (_) {}
  };

  check();
  setInterval(check, 2000);
})();
</script>`;

export default function Home() {
  return <div dangerouslySetInnerHTML={{ __html: portalMarkup }} />;
}
