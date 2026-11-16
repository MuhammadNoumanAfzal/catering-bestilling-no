import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function RouteScrollManager() {
 const location = useLocation();
 const navigationType = useNavigationType();
 const positions = useRef(new Map());
 useLayoutEffect(() => {
   const saved = location.state?.__restoreScrollY;
   const target = Number.isFinite(saved) && saved >= 0 ? Math.min(saved,10000000) : navigationType === 'POP' ? positions.current.get(location.key) || 0 : 0;
   let stopped = false;
   let observer;
   function restore() { if (!stopped) window.scrollTo({top:target,left:0,behavior:'instant'}); }
   function stop() { stopped = true; observer?.disconnect(); }
   function remember() { positions.current.set(location.key,window.scrollY); }
   restore();
   const frame=window.requestAnimationFrame(restore);
   // Lists load asynchronously. Retry as content grows, then yield to user scrolling.
   if (target > 0 && typeof ResizeObserver !== 'undefined') {
     observer = new ResizeObserver(restore);
     observer.observe(document.body);
   }
   const timer=window.setTimeout(stop,10000);
   window.addEventListener('scroll',remember,{passive:true});
   for(const event of ['wheel','touchstart','pointerdown','keydown']) window.addEventListener(event,stop,{passive:true});
   return()=>{stop();window.cancelAnimationFrame(frame);window.clearTimeout(timer);window.removeEventListener('scroll',remember);for(const event of ['wheel','touchstart','pointerdown','keydown'])window.removeEventListener(event,stop);};
 },[location.key,location.pathname,location.search,location.state,navigationType]);
 return null;
}
