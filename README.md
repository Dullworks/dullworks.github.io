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
- Keep the file valid JSON. A trailing comma will leave the product list blank.

If nothing is `"live"`, the page says the first product is dropping soon, then lists any `"coming_soon"` items.

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
- `terms.html` — digital goods, delivery, 14-day refund
- `styles.css`, `site.js`, `favicon.svg` — layout, product list, icon
