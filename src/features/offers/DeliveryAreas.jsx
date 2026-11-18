import { useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';

export default function DeliveryAreas({ areas, text }) {
 const [search, setSearch] = useState('');
 const groups = new Map();
 for (const area of areas) {
  const name = area.name || area.city || text('Other areas', 'Andre omr\u00e5der');
  const code = String(area.postCode || '');
  if (!name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()) && !code.includes(search.trim())) continue;
  if (!groups.has(name)) groups.set(name, new Set());
  if (code) groups.get(name).add(code);
 }
 return <details className="offer-delivery-areas">
  <summary><span><MapPin size={16}/>{text('Delivery areas', 'Leveringsomr\u00e5der')}</span><ChevronDown size={16}/></summary>
  <div className="offer-area-browser">
   <div className="offer-area-search"><Search size={16}/><input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder={text('Search city or postcode', 'S\u00f8k etter sted eller postnummer')} aria-label={text('Search delivery areas', 'S\u00f8k i leveringsomr\u00e5der')}/></div>
   <div className="offer-area-results">
    {[...groups].sort(([a],[b])=>a.localeCompare(b)).map(([name,codes])=><details className="offer-area-group" key={name} open={search.trim()?true:undefined}>
     <summary><span>{name}<small>{codes.size} {text('postcodes','postnumre')}</small></span><ChevronDown size={15}/></summary>
     <div className="offer-area-codes">{[...codes].sort().map(code=><span key={code}>{code}</span>)}</div>
    </details>)}
    {!groups.size&&<p className="offer-area-empty">{text('No matching delivery areas.', 'Ingen leveringsomr\u00e5der funnet.')}</p>}
   </div>
  </div>
 </details>;
}
