exports.config={

  //other configuration
  rules:{
    name:[
      { pattern: "/shop/.*/.*/.*", name: "/bottleshop/:state/:store/:category" },
      { pattern: "/bottleshop/.*/.*/.*", name: "/bottleshop/:state/:store/:category" },
      { pattern: "/product/.*/", name: "/product/:product_slug" },
      { pattern: "/bottleshop/.*/.*", name: "/bottleshop/:state/:store" },
      { pattern: "/shop/.*/.*", name: "/bottleshop/:state/:store" },
      { pattern: "/content/.*", name: "/content/:page" },
      { pattern: "/contact-us", name: "/contact-us" },
      { pattern: "/cart", name: "/cart" },
      { pattern: "/checkout", name: "/checkout" },
      { pattern: "/order/.*/tracking", name: "/order/:order_id/tracking" },
      { pattern: "/track/.*", name: "/track/:order_id" }
    ]
  }
}
