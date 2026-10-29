export const BROWSE_PAGE_SIZE = 100;
// Fill a display batch even if the server caps each individual request.
export async function fetchBrowseBatch(fetchPage, variables) {
  const items=[],seen=new Set();
  let after=variables.after||null, payload;
  const cursors=new Set();
  do {
    payload=await fetchPage({...variables,first:BROWSE_PAGE_SIZE-items.length,after});
    for(const item of payload.items||[]) {const key=String(item.id);if(!seen.has(key)){seen.add(key);items.push(item);}}
    if(!payload.pageInfo?.hasNextPage||items.length>=BROWSE_PAGE_SIZE)break;
    const cursor=payload.pageInfo.endCursor;
    if(!cursor||cursor===after||cursors.has(cursor))throw new Error("Unable to load the next menu page. Please try again.");
    cursors.add(cursor);after=cursor;
  }while(items.length<BROWSE_PAGE_SIZE);
  return {...payload,items};
}
