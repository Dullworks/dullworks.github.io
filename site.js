/* Fills #product-list from products.json. status "live" is a Buy card. */
(function () {
  var root = document.getElementById("product-list");
  if (!root) return;

  fetch("products.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("status " + response.status);
      return response.json();
    })
    .then(function (data) {
      render(root, data);
    })
    .catch(function () {
      root.replaceChildren(paragraph("The product list did not load. Refresh the page."));
      root.setAttribute("aria-busy", "false");
    });

  function render(root, data) {
    if (!Array.isArray(data)) {
      root.replaceChildren(paragraph("The product list did not load. Refresh the page."));
      root.setAttribute("aria-busy", "false");
      return;
    }

    var live = data.filter(isNamed("live"));
    var soon = data.filter(isNamed("coming_soon"));
    var nodes = [];

    if (live.length === 0) {
      nodes.push(paragraph("The first product is dropping soon."));
      soon.forEach(function (item) {
        nodes.push(articleFor(item, "soon"));
      });
    } else {
      live.forEach(function (item) {
        nodes.push(articleFor(item, "live"));
      });
      soon.forEach(function (item) {
        nodes.push(articleFor(item, "soon"));
      });
    }

    root.replaceChildren();
    nodes.forEach(function (node) {
      root.appendChild(node);
    });
    root.setAttribute("aria-busy", "false");
  }

  function isNamed(status) {
    return function (item) {
      return item && item.status === status && typeof item.name === "string" && item.name.trim();
    };
  }

  function paragraph(text) {
    var p = document.createElement("p");
    p.className = "note";
    p.textContent = text;
    return p;
  }

  function articleFor(item, mode) {
    var article = document.createElement("article");
    article.className = "product";
    var id = safeSlug(item.slug);
    if (id) article.id = "product-" + id;

    var title = document.createElement("h3");
    var page = safePage(item.page);
    var image = safeImage(item.image);
    var imageAlt = typeof item.image_alt === "string" ? item.image_alt.trim() : "";
    if (image && imageAlt) {
      var img = document.createElement("img");
      img.className = "product-cover";
      img.src = image;
      img.alt = imageAlt;
      if (page) {
        var imageLink = document.createElement("a");
        imageLink.href = page;
        imageLink.appendChild(img);
        article.appendChild(imageLink);
      } else {
        article.appendChild(img);
      }
    }
    if (page) {
      var titleLink = document.createElement("a");
      titleLink.href = page;
      titleLink.textContent = item.name.trim();
      title.appendChild(titleLink);
    } else {
      title.textContent = item.name.trim();
    }
    article.appendChild(title);

    if (typeof item.description === "string" && item.description.trim()) {
      var description = document.createElement("p");
      description.textContent = item.description.trim();
      article.appendChild(description);
    }

    var foot = document.createElement("div");
    foot.className = "product-foot";

    var price = formatPrice(item.price, item.currency);
    if (price) {
      var priceEl = document.createElement("p");
      priceEl.className = "price";
      priceEl.textContent = price;
      foot.appendChild(priceEl);
    }

    if (mode === "live") {
      var href = safeHttpUrl(item.buy_url);
      if (href) {
        var link = document.createElement("a");
        link.className = "buy";
        link.href = href;
        link.textContent = "Buy";
        link.setAttribute("aria-label", "Buy " + item.name.trim());
        foot.appendChild(link);
      } else {
        foot.appendChild(statusLine("Checkout link is not set yet."));
      }
    } else {
      foot.appendChild(statusLine("Not for sale yet"));
    }

    article.appendChild(foot);
    return article;
  }

  function statusLine(text) {
    var p = document.createElement("p");
    p.className = "status";
    p.textContent = text;
    return p;
  }

  function safeSlug(value) {
    if (typeof value !== "string") return "";
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : "";
  }

  function safePage(value) {
    if (typeof value !== "string") return "";
    if (!/^[a-z0-9][a-z0-9./-]*$/.test(value)) return "";
    if (value.indexOf("..") !== -1 || value.indexOf("//") !== -1) return "";
    if (!/\.html$/.test(value) && !/\/$/.test(value)) return "";
    return value;
  }

  function safeImage(value) {
    if (typeof value !== "string") return "";
    if (!/^[a-z0-9][a-z0-9./-]*\.(?:png|jpe?g|webp|svg)$/.test(value)) return "";
    if (value.indexOf("..") !== -1 || value.indexOf("//") !== -1 || value.indexOf("/d/") !== -1) return "";
    return value;
  }

  function safeHttpUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      var url = new URL(value, window.location.href);
      if (url.protocol === "https:" || url.protocol === "http:") return url.href;
    } catch (e) {
      return "";
    }
    return "";
  }

  function formatPrice(price, currency) {
    if (typeof price !== "number" || !isFinite(price)) return "";
    var code = typeof currency === "string" && /^[A-Za-z]{3}$/.test(currency) ? currency.toUpperCase() : "USD";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        maximumFractionDigits: Number.isInteger(price) ? 0 : 2
      }).format(price);
    } catch (e) {
      return price + " " + code;
    }
  }
})();
