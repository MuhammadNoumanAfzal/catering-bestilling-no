# Testing Data

## How filtering works right now

- Postal code matching is prefix-based.
- `5003` works, but `500` also works because the code checks `startsWith(...)`.
- Location matching is text-based against `city`, `addressLine`, and `vendor.name`.
- Delivery time matching checks weekday plus `deliveryStart <= selectedTime <= deliveryEnd`.

## Working postal codes

`5003`, `5004`, `5005`, `5006`, `5007`, `5008`, `5009`, `5010`, `5011`, `5012`, `5013`, `5014`, `5015`, `5016`, `5017`, `5018`, `5052`, `5053`, `5054`, `5055`, `5056`, `5057`, `5058`, `5059`, `5063`, `5067`, `5070`

## Non-working postal code examples

`0000`, `1234`, `4000`, `4999`, `5000`, `5019`, `5050`, `5060`, `5071`, `9999`

## Prefix postal codes that also work

These work in the current code even though they are not full 4-digit codes:

`5`, `50`, `500`, `501`, `505`, `506`, `507`

## Working location examples

- `Bergen`
- `Storgata`
- `Strandgaten`
- `Sentrum`
- `Main Street`
- `Bryggen`
- `Frognerveien`
- `Harbour Street`
- `Marken`
- `Torget`
- `Nygardsgaten`
- `Strandkaien`
- `City Center`
- `Egertorget`
- `Steen`
- `Storo`
- `Flint's Grill`
- `Pizza Corner`
- `Oslo Wrap House`

## Non-working location examples

- `Trondheim`
- `Stavanger`
- `Kristiansand`
- `London`
- `Karachi`
- `Airport`
- `Downtown Oslo`
- `Random Street 99`

## Recommended client test data

### Easy valid tests

1. Postal code: `5004`
   Date: any Monday
   Time: `12:00`
   Expected: multiple vendors available

2. Postal code: `5008`
   Date: any Saturday
   Time: `12:30`
   Expected: weekend-capable vendors available

3. Location: `Bergen`
   Date: any Tuesday
   Time: `14:00`
   Expected: many vendors available

4. Location: `Main Street`
   Date: any Sunday
   Time: `13:00`
   Expected: `McDonald's Main Street`

5. Location: `Storo`
   Date: any Friday
   Time: `19:00`
   Expected: `Domino's Pizza Storo`

### Easy invalid tests

1. Postal code: `9999`
   Date: any Tuesday
   Time: `12:00`
   Expected: no vendors

2. Location: `Trondheim`
   Date: any Tuesday
   Time: `12:00`
   Expected: no vendors

3. Postal code: `5004`
   Date: any Sunday
   Time: `07:00`
   Expected: no vendors for most cases

## Vendor delivery availability

### Weekday only

- `Flint's Grill`: Mon-Fri, `09:00-18:00`
- `The Queen's Kebab`: Mon-Fri, `10:00-19:00`
- `Talormade Bispevika`: Mon-Fri, `08:30-17:30`
- `Eckers Frogner`: Mon-Fri, `09:30-17:00`
- `Nordic Lunch House`: Mon-Fri, `07:30-16:30`
- `Morning Bite Cafe`: Mon-Fri, `07:00-15:00`
- `Oslo Wrap House`: Mon-Fri, `10:30-19:30`

### Monday to Saturday

- `Brobekk Grill & Pizza`: Mon-Sat, `09:00-20:00`
- `Urban Salad Kitchen`: Mon-Sat, `08:00-18:30`
- `Golden Fork Kitchen`: Mon-Sat, `09:00-19:00`

### Daily

- `McDonald's Main Street`: Sun-Sat, `08:00-23:00`
- `Pizza Corner`: Sun-Sat, `11:00-22:00`
- `Max - Egertorget`: Sun-Sat, `10:00-22:00`
- `Fly Chicken - Steen`: Sun-Sat, `11:00-22:30`
- `Domino's Pizza Storo`: Sun-Sat, `11:00-22:00`

## Good vendor-specific tests

1. `Morning Bite Cafe`
   Use postal code: `5007`
   Working time: Monday `08:00`
   Not working time: Monday `16:00`

2. `Nordic Lunch House`
   Use postal code: `5010`
   Working time: Tuesday `08:00`
   Not working time: Tuesday `17:00`

3. `The Queen's Kebab`
   Use postal code: `5006`
   Working time: Wednesday `12:00`
   Not working time: Wednesday `09:00`

4. `Pizza Corner`
   Use postal code: `5018`
   Working time: Sunday `12:00`
   Not working time: Sunday `10:00`

5. `Fly Chicken - Steen`
   Use postal code: `5067`
   Working time: Saturday `21:30`
   Not working time: Saturday `23:00`

6. `McDonald's Main Street`
   Use postal code: `5053`
   Working time: Sunday `09:00`
   Not working time: Sunday `23:30`

## Vendor to postal code map

- `Flint's Grill`: `5003`, `5004`, `5005`, `5010`, `5011`
- `The Queen's Kebab`: `5004`, `5006`, `5007`, `5014`
- `Brobekk Grill & Pizza`: `5008`, `5009`, `5010`, `5052`
- `McDonald's Main Street`: `5003`, `5004`, `5008`, `5015`, `5053`
- `Talormade Bispevika`: `5006`, `5007`, `5013`, `5015`
- `Eckers Frogner`: `5009`, `5011`, `5012`, `5052`
- `Nordic Lunch House`: `5003`, `5005`, `5010`, `5017`, `5054`
- `Urban Salad Kitchen`: `5007`, `5008`, `5012`, `5014`, `5055`
- `Pizza Corner`: `5004`, `5009`, `5011`, `5018`, `5056`
- `Morning Bite Cafe`: `5007`, `5008`, `5015`, `5057`
- `Oslo Wrap House`: `5006`, `5009`, `5013`, `5016`, `5058`
- `Golden Fork Kitchen`: `5005`, `5010`, `5014`, `5053`, `5059`
- `Max - Egertorget`: `5003`, `5004`, `5005`, `5063`
- `Fly Chicken - Steen`: `5008`, `5009`, `5012`, `5067`
- `Domino's Pizza Storo`: `5007`, `5011`, `5018`, `5070`
