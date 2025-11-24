export const $ = (sel) => document.querySelector(sel);
export const fmt = (n,d=3)=> (n==null||Number.isNaN(n))? "-" : Number(n).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d});
export function percentile(values,p){ if(!values||values.length===0) return null; const s=[...values].sort((a,b)=>a-b); if(s.length===1) return s[0]; const k=(s.length-1)*(p/100); const f=Math.floor(k),c=Math.ceil(k); if(f===c) return s[f]; return s[f]*(c-k)+s[c]*(k-f); }
export function csvEscape(s){ const t=String(s??""); return (t.includes(",")||t.includes("\n")||t.includes('"'))? '"'+t.replaceAll('"','""')+'"' : t; }

const KEY_FAV = "poe2_favs";
export function getFavs(){ try{ return JSON.parse(localStorage.getItem(KEY_FAV))||[]; }catch{ return []; } }
export function toggleFav(name){
  const list = getFavs();
  const i = list.indexOf(name);
  if(i>=0) list.splice(i,1); else list.push(name);
  localStorage.setItem(KEY_FAV, JSON.stringify(list));
  return list.includes(name);
}
export function isFav(name){ return getFavs().includes(name); }
