import { API_BASE, CATS } from './constants.js';

export function categoryToEndpoints(s){
  const endpoints=[];
  const pushCurrency=(apiId)=>{ if(apiId==="ritual") endpoints.push("/items/currency/ritual","/items/omen/omen"); else endpoints.push(`/items/currency/${apiId}`); };
  const pushUnique=(apiId)=> endpoints.push(`/items/unique/${apiId}`);
  if(s.catValue==="all"){
    if(s.includeCurrency) CATS.currency_categories.forEach(c=>pushCurrency(c.apiId));
//     if(s.includeUnique)   CATS.unique_categories.forEach(c=>pushUnique(c.apiId));
    return endpoints;
  }
  const [group,apiId]=s.catValue.split(":");
  if(group==="currency"){ pushCurrency(apiId); return endpoints; }
//   if(group==="unique"){ pushUnique(apiId); return endpoints; }
  return ["/items/currency/currency"];
}

export async function fetchOneEndpoint(ep,s){
  let page=1; const out=[];
  while(true){
    const url=`${API_BASE}${ep}?referenceCurrency=${encodeURIComponent(s.ref)}&page=${page}&perPage=${s.perPage}&league=${encodeURIComponent(s.league)}`;
    const res=await fetch(url,{headers:{Accept:"application/json"}});
    if(!res.ok) throw new Error(res.status+" "+res.statusText);
    const data=await res.json(); const list=(data&&data.items)?data.items:[];
    out.push(...list); if(list.length < s.perPage) break; page++;
  }
  return out;
}

export async function fetchPairHistory(league, oneId, twoId, limit=300, endEpoch=null){
  const q = new URLSearchParams({
    league, currencyOneItemId: String(oneId), currencyTwoItemId: String(twoId), limit: String(limit)
  });
  if (endEpoch != null) q.set("endEpoch", String(endEpoch));
  const url = `${API_BASE}/currencyExchange/PairHistory?` + q.toString();
  const r = await fetch(url, { headers: {Accept:"application/json"} });
  if (!r.ok) throw new Error(r.status+" "+r.statusText);
  const data = await r.json();
  return (data && Array.isArray(data.History)) ? data.History : [];
}

export async function fetchLeagues(){
  const url = `${API_BASE}/leagues`;
  const res = await fetch(url, { headers: {Accept:"application/json"} });
  if (!res.ok) throw new Error(res.status + " " + res.statusText);
  return await res.json();
}
