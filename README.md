# Dullworks

Static website for [Dullworks](https://dullworks.github.io). GitHub Pages serves the `main` branch at that address. Plain HTML and CSS. No build step.

## Add a product

Edit `products.json` only. It is a JSON array. The shop page loads that file in the browser.

```json
{
  "name": "Family-Photo Grouping Workbook",
  "slug": "family-photo-grouping-workbook",
  "description": "One short paragraph about the product.",
  "price": 12,
  "currency": "USD",
  "buy_url": "https://buy.stripe.com/your-payment-link",
  "status": "live"
}
```

- `status` must be `"live"` for the product to get a Buy button. The button goes to `buy_url`.
- Use `"coming_soon"` until the Stripe link exists. Those items are listed with the price and the words "Not for sale yet". No Buy button.
- Leave `buy_url` as `""` when you do not have a link yet.
- `slug` is lowercase words separated by hyphens. It becomes the card's `id`.
- `price` is a number. `currency` is a three-letter code such as `"USD"`.
- `page` is optional. Set it to the product page file, such as `"family-photo-grouping-workbook.html"`, so the shop card title links there.
- `image` and `image_alt` are optional. When both are set, the shop card shows that image. `image` is a path on this site, such as `"images/family-photo-grouping-workbook/cover.png"`.
- Keep the file valid JSON. A trailing comma will leave the product list blank.

If nothing is `"live"`, the page says the first product is dropping soon, then lists any `"coming_soon"` items.

## Product page

A live product has a page at `{slug}.html`, in the same layout as the other product pages. There is no build step and no shared include, so copy the closing buy section below into every product page.

The page needs two Buy buttons, both to that product's `buy_url`:

- One near the top, with the price, before the details.
- One at the end, after the details and above the footer. This closing section is required. Use a calm line with the product name and price, then a Buy button. No urgency and no hype.

```html
<section class="closing-buy" aria-label="Buy">
  <p>Ready to plan? Get the Product Name, US$12.</p>
  <p><a class="buy" href="https://buy.stripe.com/your-payment-link" aria-label="Buy Product Name">Buy</a></p>
</section>
```

Use the real product name, price, and Stripe link. Keep the line "Digital download. All sales are final, no refunds." Do not link to a hidden download page.

## Preview locally

From this folder:

```bash
python3 -m http.server 8080
```

Open http://127.0.0.1:8080

Opening `index.html` as a file will not load `products.json`. Browsers block that request.

## Pages

- `index.html` — shop
- `privacy.html` — what we collect (Stripe, and email you send us)
- `terms.html` — digital goods, delivery, all sales final
- `styles.css`, `site.js`, `favicon.svg` — layout, product list, icon
