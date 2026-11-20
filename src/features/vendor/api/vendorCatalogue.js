export async function readVendorCatalogue(fetchPage) {
 const products=new Map(),seen=new Set();let after=null;
 for (;;) {
  const page=await fetchPage(after);
  if(!Array.isArray(page?.edges)||!page.pageInfo)throw new Error('Incomplete vendor catalogue response');
  for(const edge of page.edges)if(edge?.node?.id)products.set(String(edge.node.id),edge.node);
  if(!page.pageInfo.hasNextPage)return [...products.values()];
  const cursor=page.pageInfo.endCursor;
  if(!cursor||seen.has(cursor))throw new Error('Vendor catalogue pagination did not advance');
  seen.add(cursor);after=cursor;
 }
}
export function mergeVendorCatalogue(vendor,products) {
 const categories=(vendor.menuCategories||[]).map(c=>({...c,vendorProducts:[...(c.vendorProducts||[])]}));
 const known=new Set(categories.flatMap(c=>c.vendorProducts.map(p=>String(p.id))));
 for(const product of products){
  if(known.has(String(product.id)))continue;
  if(String(product.menuStatus).toLowerCase()!=='active')continue;
  const single=String(product.addOnType).toUpperCase()==='INDEPENDENT';
  if(!single&&String(product.productType).toLowerCase()!=='menu')continue;
  const name=single?'Enkeltprodukter':'Menyer';
  let category=categories.find(c=>c.name===name);
  if(!category){category={id:'catalogue-'+(single?'single-products':'menus'),name,description:'',vendorProducts:[]};categories.push(category);}
  category.vendorProducts.push(product);known.add(String(product.id));
 }
 return {...vendor,menuCategories:categories};
}
