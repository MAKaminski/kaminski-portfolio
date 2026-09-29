import json, math
from model import *
r=json.load(open("results.json"))
H,S=r["Opus 5.5|Haiku 4.5"],r["Opus 5.5|Sonnet 5.5"]; m=r["mc_summary"]; sn=r["sens"]
a=expected('Opus 5.5','Haiku 4.5',BASE,route=False)[0]; h=expected('Haiku 4.5','Haiku 4.5',BASE,route=False)[0]; so=expected('Sonnet 5.5','Haiku 4.5',BASE,route=False)[0]
pc=lambda x:("$-$" if x<0 else "")+f"{abs(100*x):.1f}\\%"
D=dict(allFnc=f"\\${H['allF_nocache']:.4f}",allFc=f"\\${H['allF_cache']:.4f}",cachedisc=pc(H['cache_discount']),
 hNaive=pc(H['naive']),hNoCache=pc(H['save_nocache']),hCache=pc(H['save_cache']),hRouted=f"\\${H['routed_cache']:.4f}",hRoutedNc=f"\\${H['routed_nocache']:.4f}",
 sNaive=pc(S['naive']),sNoCache=pc(S['save_nocache']),sCache=pc(S['save_cache']),sRouted=f"\\${S['routed_cache']:.4f}",sRoutedNc=f"\\${S['routed_nocache']:.4f}",
 bigShare=pc(H['big_share']),missTurn=pc(H['missed_per_turn']),hSticky=pc(H['sticky_save']),sSticky=pc(S['sticky_save']),stickyShare=pc(H['sticky_big_share']),
 mcFive=pc(m['p5']),mcMed=pc(m['p50']),mcNinetyFive=pc(m['p95']),mcNaive=pc(m['naive_p50']),mcGap=f"{100*m['gap_p50']:.1f}",mcNeg=pc(m['frac_negative']),
 mcMiss=pc(m['miss_p50']),mcMissHi=pc(m['miss_p95']),mcN=str(r['mc_n']),
 allHaiku=pc(1-h/a),allSonnet=pc(1-so/a),allHaikuCost=f"\\${h:.4f}",allSonnetCost=f"\\${so:.4f}",
 noHard=pc(r['no_hard_share']),convCeiling=pc(r['no_hard_share']*(1-h/a)),valGap=f"{math.ceil(1000*r['val_gap'])/10:.1f}",
 heatLo=pc(min(map(min,r['heat']['save']))),heatHi=pc(max(map(max,r['heat']['save']))))
for k,v in sn.items(): D["rho"+k.upper()]=f"${v:+.2f}$"
for s,v in r["short_prompt"].items(): D["sp"+{"2000":"A","3500":"B","4500":"C","8000":"D"}[s]]=pc(1-v['routed']/v['allF'])
open("numbers.tex","w").write("\n".join(f"\\newcommand{{\\{k}}}{{{v}}}" for k,v in D.items())+"\n")
print(open("numbers.tex").read())
