"""Cache-aware cost model for selective frontier routing in multi-turn voice agents.
Reproducible: python3 model.py  -> writes figures/*.pdf and results.json
Prices: Anthropic public list prices retrieved 2026-09-28 (platform.claude.com/docs/en/about-claude/pricing).
"""
import json, numpy as np, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

M = 1e-6
PRICES = {  # $/token: input, output, cache_read, cache_write(5m)=1.25*input, min cacheable tokens
    "Opus 5.5":   dict(i=4*M, o=20*M, r=0.20*M, w=5.00*M, min=512),
    "Sonnet 5.5": dict(i=2*M, o=10*M, r=0.20*M, w=2.50*M, min=512),
    "Haiku 4.5":  dict(i=1*M, o=5*M,  r=0.10*M, w=1.25*M, min=4096),
}
BASE = dict(T=12, S=6000, u=60, o=80, tool=150, pi=0.20, phi=0.5, tpr=0.90, fpr=0.15,
            esc=0.6, turn_sec=20, ttl=300, router_in=200, router_out=5, router="Haiku 4.5")

def call_cost(p, L, cached, O):
    """Cost of one call with prompt length L of which `cached` tokens are a warm prefix."""
    if L < p["min"]:
        return L * p["i"] + O * p["o"], 0
    return cached * p["r"] + (L - cached) * p["w"] + O * p["o"], L

def simulate(big, small, prm, rng, route=True, cache=True, sticky=False):
    P = dict(prm); pb, ps = PRICES[big], PRICES[small]
    T = int(P["T"]); pi, phi = P["pi"], P["phi"]
    q = pi * (1 - phi) / (1 - pi)            # P(hard | prev easy), keeps stationary share = pi
    L = P["S"]; cached = {big: 0, small: 0}; last = {big: -1e9, small: -1e9}
    cost = 0.0; missed = 0; hard_prev = rng.random() < pi; big_calls = 0
    parts = dict(read=0.0, write=0.0, output=0.0, router=0.0)
    for t in range(T):
        now = t * P["turn_sec"]
        hard = rng.random() < (phi if hard_prev else q); hard_prev = hard
        L += P["u"] + (2 * P["tool"] if (t and rng.random() < 0.5) else 0)  # tool result on ~half of turns
        def run(m):
            nonlocal cost
            p = PRICES[m]
            c0 = cached[m] if (cache and now - last[m] <= P["ttl"]) else 0
            c, newc = call_cost(p, L, c0, P["o"]) if cache else (L * p["i"] + P["o"] * p["o"], 0)
            if cache and L >= p["min"]:
                parts["read"] += c0 * p["r"]; parts["write"] += (L - c0) * p["w"]
            else:
                parts["write"] += L * p["i"]
            parts["output"] += P["o"] * p["o"]
            cached[m] = newc if cache else 0; last[m] = now; cost += c
        if not route:
            run(big); big_calls += 1
        elif sticky and big_calls > 0:
            run(big); big_calls += 1   # already escalated: no router call, no classifier cost
        else:
            rp = PRICES[P["router"]]
            rc = P["router_in"] * rp["i"] + P["router_out"] * rp["o"]; cost += rc; parts["router"] += rc
            flag = rng.random() < (P["tpr"] if hard else P["fpr"])
            if flag:
                run(big); big_calls += 1
            else:
                run(small)
                if hard:
                    if rng.random() < P["esc"]:
                        run(big); big_calls += 1
                    else:
                        missed += 1
        L += P["o"]
    return cost, missed, big_calls, parts

def expected(big, small, prm, n=4000, seed=7, **kw):
    rng = np.random.default_rng(seed)
    r = [simulate(big, small, prm, rng, **kw) for _ in range(n)]
    c = np.array([x[0] for x in r]); m = np.array([x[1] for x in r]); b = np.array([x[2] for x in r])
    parts = {k: float(np.mean([x[3][k] for x in r])) for k in r[0][3]}
    return c.mean(), m.mean() / prm["T"], b.mean() / prm["T"], parts

def naive_savings(big, small, pi, tpr, fpr, esc):
    """Closed form (Eq. 3) using list-price ratio, no caching, no router cost."""
    pb, ps = PRICES[big], PRICES[small]
    rho = ps["o"] / pb["o"]  # list-price ratio (identical for input and output in these pairs)
    k = pi * (tpr + (1 - tpr) * (rho + esc)) + (1 - pi) * (fpr + (1 - fpr) * rho)
    return 1 - k

def run_all():
    out = {}; B = BASE
    pairs = [("Opus 5.5", "Haiku 4.5"), ("Opus 5.5", "Sonnet 5.5")]
    # 1. Baselines
    for big, small in pairs:
        key = f"{big}|{small}"
        allF_nc, *_ = expected(big, small, B, route=False, cache=False)
        allF_c, _, _, parts_allF = expected(big, small, B, route=False, cache=True)
        rt_c, miss, bfrac, parts_rt = expected(big, small, B, route=True, cache=True)
        rt_nc, _, _, _ = expected(big, small, B, route=True, cache=False)
        out[key] = dict(allF_nocache=allF_nc, allF_cache=allF_c, routed_cache=rt_c, routed_nocache=rt_nc,
                        save_nocache=1 - rt_nc / allF_nc, save_cache=1 - rt_c / allF_c,
                        naive=naive_savings(big, small, B["pi"], B["tpr"], B["fpr"], B["esc"]),
                        missed_per_turn=miss, big_share=bfrac, parts_allF=parts_allF, parts_routed=parts_rt,
                        cache_discount=1 - allF_c / allF_nc)
    # 1b. Sticky-escalation policy (once on frontier, stay there)
    for big, small in pairs:
        key = f"{big}|{small}"
        r = expected(big, small, B, sticky=True)
        out[key]["sticky_save"] = 1 - r[0] / out[key]["allF_cache"]; out[key]["sticky_big_share"] = r[2]; out[key]["sticky_miss"] = r[1]
    # 1c. Share of conversations with no hard turn (ceiling for conversation-level routing).
    # Turn 0 is easy with the stationary probability 1-pi; each later turn stays easy with 1-q.
    q = B["pi"] * (1 - B["phi"]) / (1 - B["pi"])
    out["no_hard_share"] = (1 - B["pi"]) * (1 - q) ** (B["T"] - 1)
    # 2. Savings vs pi (also the validation: simulator with caching off vs closed form)
    pis = np.linspace(0.05, 0.6, 12); curves = {}
    for big, small in pairs:
        sc, sn, nv = [], [], []
        for p in pis:
            P = dict(B, pi=p)
            a = expected(big, small, P, n=1500, route=False)[0]; r = expected(big, small, P, n=1500)[0]
            a2 = expected(big, small, P, n=1500, route=False, cache=False)[0]; r2 = expected(big, small, P, n=1500, cache=False)[0]
            sc.append(1 - r / a); sn.append(1 - r2 / a2); nv.append(naive_savings(big, small, p, B["tpr"], B["fpr"], B["esc"]))
        curves[f"{big}|{small}"] = dict(pi=pis.tolist(), cache=sc, nocache=sn, naive=nv)
    out["curves"] = curves
    out["val_gap"] = max(abs(a - b) for c in curves.values() for a, b in zip(c["nocache"], c["naive"]))
    # 3. TPR x FPR heat map (Opus/Haiku, cache-aware)
    tprs = np.linspace(0.7, 0.99, 7); fprs = np.linspace(0.02, 0.4, 7)
    a = expected(*pairs[0], B, n=1500, route=False)[0]
    H = np.array([[1 - expected(*pairs[0], dict(B, tpr=t, fpr=f), n=800)[0] / a for f in fprs] for t in tprs])
    out["heat"] = dict(tpr=tprs.tolist(), fpr=fprs.tolist(), save=H.tolist())
    # 4. Monte Carlo over parameter uncertainty
    rng = np.random.default_rng(11); mc = []
    for _ in range(600):
        P = dict(B, T=int(rng.integers(6, 21)), S=rng.uniform(4500, 12000), u=rng.uniform(30, 100),
                 o=rng.uniform(40, 150), tool=rng.uniform(0, 400), pi=rng.uniform(0.1, 0.4),
                 phi=rng.uniform(0.2, 0.8), tpr=rng.uniform(0.8, 0.97), fpr=rng.uniform(0.05, 0.3),
                 esc=rng.uniform(0.3, 0.8))
        a = expected(*pairs[0], P, n=60, seed=int(rng.integers(1e9)), route=False)[0]
        r, miss, bf, _ = expected(*pairs[0], P, n=60, seed=int(rng.integers(1e9)))
        mc.append(dict(save=1 - r / a, miss=miss, naive=naive_savings(*pairs[0], P["pi"], P["tpr"], P["fpr"], P["esc"]),
                       S=P["S"], pi=P["pi"], tpr=P["tpr"], fpr=P["fpr"], T=P["T"], o=P["o"]))
    out["mc"] = mc
    sv = np.array([m["save"] for m in mc]); nv = np.array([m["naive"] for m in mc]); ms = np.array([m["miss"] for m in mc])
    out["mc_summary"] = dict(p5=float(np.percentile(sv, 5)), p50=float(np.median(sv)), p95=float(np.percentile(sv, 95)),
                             naive_p50=float(np.median(nv)), gap_p50=float(np.median(nv - sv)),
                             miss_p50=float(np.median(ms)), miss_p95=float(np.percentile(ms, 95)),
                             frac_negative=float((sv < 0).mean()))
    # Sensitivity: rank correlation of inputs with savings
    from scipy.stats import spearmanr
    out["sens"] = {k: float(spearmanr([m[k] for m in mc], sv)[0]) for k in ["pi", "tpr", "fpr", "S", "T", "o"]}
    # 5. Short-prompt case: S below Haiku's 4096 minimum
    out["short_prompt"] = {s: dict(zip(["allF", "routed"], [expected(*pairs[0], dict(B, S=s), route=False)[0],
                           expected(*pairs[0], dict(B, S=s))[0]])) for s in [2000, 3500, 4500, 8000]}
    return out

def figs(o):
    import os; os.makedirs("figures", exist_ok=True)
    plt.rcParams.update({"font.size": 9, "font.family": "serif"})
    fig, ax = plt.subplots(1, 2, figsize=(7, 2.8), sharey=True)
    for a, (k, t) in zip(ax, [("Opus 5.5|Haiku 4.5", "Opus 5.5 / Haiku 4.5"), ("Opus 5.5|Sonnet 5.5", "Opus 5.5 / Sonnet 5.5")]):
        c = o["curves"][k]
        a.plot(c["pi"], np.array(c["naive"]) * 100, "k--", label="Naive list-price model (Eq. 1)")
        a.plot(c["pi"], np.array(c["nocache"]) * 100, color="#9aa", marker="s", ms=3, label="Simulated, no caching")
        a.plot(c["pi"], np.array(c["cache"]) * 100, color="#1f4e79", marker="o", ms=3, label="Simulated, cache-aware")
        a.axhline(0, color="grey", lw=.5); a.set_title(t); a.set_xlabel(r"Hard-turn share $\pi$")
    ax[0].set_ylabel("Cost savings vs. frontier-only (%)"); ax[0].legend(fontsize=7, frameon=False)
    fig.tight_layout(); fig.savefig("figures/savings_vs_pi.pdf")
    h = o["heat"]; fig, a = plt.subplots(figsize=(3.6, 3))
    im = a.imshow(np.array(h["save"]) * 100, origin="lower", aspect="auto", cmap="Blues",
                  extent=[h["fpr"][0], h["fpr"][-1], h["tpr"][0], h["tpr"][-1]])
    fig.colorbar(im, label="Savings (%)"); a.set_xlabel("Router false-positive rate"); a.set_ylabel("Router true-positive rate")
    fig.tight_layout(); fig.savefig("figures/heat.pdf")
    sv = np.array([m["save"] for m in o["mc"]]) * 100; nv = np.array([m["naive"] for m in o["mc"]]) * 100
    fig, a = plt.subplots(figsize=(3.6, 2.8))
    a.hist(nv, bins=30, color="#bbb", label="Naive model"); a.hist(sv, bins=30, color="#1f4e79", alpha=.8, label="Cache-aware sim")
    a.set_xlabel("Savings vs. frontier-only (%)"); a.set_ylabel("Scenarios"); a.legend(frameon=False, fontsize=7)
    fig.tight_layout(); fig.savefig("figures/mc.pdf")
    fig, a = plt.subplots(figsize=(3.6, 2.6)); k = "Opus 5.5|Haiku 4.5"; a.set_xlim(-0.5, 2.6)
    labs = ["read", "write", "output", "router"]; cols = ["#9ecae1", "#4292c6", "#08306b", "#fdae6b"]
    for x, key in enumerate(["parts_allF", "parts_routed"]):
        b = 0
        for l, c in zip(labs, cols):
            v = o[k][key][l] * 100; a.bar(x, v, bottom=b, color=c, label=l if x == 0 else None); b += v
    a.set_xticks([0, 1]); a.set_xticklabels(["Frontier-only", "Routed"]); a.set_ylabel("Cents per conversation")
    a.legend(frameon=False, fontsize=6, loc="upper right", labels=["cache read", "cache write /\nuncached input", "output", "router"])
    fig.tight_layout(); fig.savefig("figures/decomp.pdf")

if __name__ == "__main__":
    o = run_all(); figs(o)
    json.dump({k: v for k, v in o.items() if k != "mc"} | {"mc_n": len(o["mc"])}, open("results.json", "w"), indent=1, default=float)
    print(json.dumps({k: o[k] for k in ["Opus 5.5|Haiku 4.5", "Opus 5.5|Sonnet 5.5", "mc_summary", "sens", "short_prompt"]}, indent=1, default=float))
    c=o["curves"]["Opus 5.5|Haiku 4.5"]; print("max |sim_nocache-naive|", max(abs(a-b) for a,b in zip(c["nocache"],c["naive"])))
    print("heat range", min(map(min,o["heat"]["save"])), max(map(max,o["heat"]["save"])))
