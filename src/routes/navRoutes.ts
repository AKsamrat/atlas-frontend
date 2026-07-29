export interface NavItem {
  name: string;
  path?: string;
  children?: NavItem[];
}

export const navRoutes: NavItem[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "We Care",
    path: "/WeCare",
  },
  {
    name: "Our Brand",
    path: "/OurBrand",
  },
  {
    name: "Busines & Value",
    path: "/BusinessValue",
  },
  {
    name: "Domain & Hosting",
    path: "/domain-hosting",
  },
  {
    name: "Web Development",
    path: "/web-development",
  },
  {
    name: "About Us",
    path: "/about-us",
  },
  {
    name: "Shop",
    children: [
      { name: "All Products", path: "/shop" },
      { name: "Skin Care", path: "/category/skin-care" },
      { name: "Hair Care", path: "/category/hair-care" },
    ],
  },
  {
    name: "News Feed",
    path: "/NewsFeed",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];
