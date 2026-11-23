import test from 'node:test';
import assert from 'node:assert/strict';
import { mapOfferNotification, OFFER_NOTIFICATION_PREFIX } from './offerNotifications.js';

test('backend offer events open the client offer and preserve unread status',()=>{
  const result=mapOfferNotification({id:'n1',type:'MENU_OFFER_RECEIVED',title:'Offer received',message:'New price',isRead:false,createdAt:'2026-11-23T10:00:00Z',entity:{entityType:'MENU_OFFER_REQUEST',entityId:'5',actionUrl:'https://untrusted.example'}});
  assert.equal(result.id,OFFER_NOTIFICATION_PREFIX+'n1');assert.equal(result.actionUrl,'/account/my-offers/5');assert.equal(result.unread,true);
});
test('other event types and archived events are not duplicated into offers',()=>{
  assert.equal(mapOfferNotification({id:'n',type:'PAYMENT_PAID'}),null);
  assert.equal(mapOfferNotification({id:'n',type:'OFFER_RECEIVED',isArchived:true}),null);
  assert.equal(mapOfferNotification({id:'n',type:'OFFER_RECEIVED',entity:{entityType:'ORDER',entityId:'22'}}).actionUrl,'/account/my-offers');
});
