export function menuSlug(value) {
  return String(value || "").toLowerCase().replace(/æ/g,"ae").replace(/ø/g,"o").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}
export function menuPath(vendorSlug,item) {
  const slug=menuSlug(item.name||item.title);
  if(!vendorSlug||!slug)return "";
  return "/vendor/"+encodeURIComponent(vendorSlug)+"/menu/"+slug;
}
export function resolveMenuName(items,slug) {
  const matches=[...new Map(items.filter(item=>menuSlug(item.name||item.title)===slug).map(item=>[String(item.id),item])).values()];
  if(matches.length!==1)throw new Error(matches.length?"This menu name is ambiguous. Please open it from the vendor page.":"Product not found.");
  return matches[0].id;
}
