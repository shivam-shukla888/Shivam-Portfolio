import {
  getProductStructuredData,
  YOJNA_SETU_STORE_ITEM,
  SPRING_BOOT_STARTER_ITEM,
  EDITORIAL_PORTFOLIO_ITEM,
  ProductDisplayData,
  ProductReview,
} from "../src/lib/products";

async function runStoreStructuredDataTests() {
  console.log("==================================================");
  console.log("SHIVSASTRA // STORE STRUCTURED DATA (JSON-LD) SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Non-purchasable architectural case study: Yojna Setu
  const yojnaSetuSchema = getProductStructuredData(YOJNA_SETU_STORE_ITEM, "AI Agents");
  assert(
    yojnaSetuSchema === null,
    "1. Yojna Setu case study strictly omits Product/Offer JSON-LD"
  );

  // 2. Upcoming non-purchasable item: Spring Boot Starter
  const springBootSchema = getProductStructuredData(SPRING_BOOT_STARTER_ITEM, "Digital Products");
  assert(
    springBootSchema === null,
    "2. Upcoming Spring Boot Starter strictly omits Product/Offer JSON-LD"
  );

  // 3. Upcoming non-purchasable item: Editorial Portfolio Kit
  const portfolioSchema = getProductStructuredData(EDITORIAL_PORTFOLIO_ITEM, "Design & Templates");
  assert(
    portfolioSchema === null,
    "3. Upcoming Editorial Portfolio strictly omits Product/Offer JSON-LD"
  );

  // 4. Inactive commercial product (isAvailable: false)
  const unavailableProduct: ProductDisplayData = {
    ...SPRING_BOOT_STARTER_ITEM,
    priceInCents: 199900,
    currency: "INR",
    isAvailable: false,
  };
  const unavailableSchema = getProductStructuredData(unavailableProduct, "Digital Products");
  assert(
    unavailableSchema === null,
    "4. Unavailable product (isAvailable: false) strictly omits Product/Offer JSON-LD"
  );

  // 5. Zero-priced or pending product (priceInCents <= 0)
  const zeroPriceProduct: ProductDisplayData = {
    ...SPRING_BOOT_STARTER_ITEM,
    priceInCents: 0,
    currency: "INR",
    isAvailable: true,
  };
  const zeroPriceSchema = getProductStructuredData(zeroPriceProduct, "Digital Products");
  assert(
    zeroPriceSchema === null,
    "5. Zero-priced product strictly omits Product/Offer JSON-LD"
  );

  // 6. Valid commercial purchasable product (InStock + exact numeric price)
  const commercialProduct: ProductDisplayData = {
    id: "prod-commercial-test",
    slug: "commercial-starter",
    releaseCode: "COM-01",
    title: "Production Starter Kit",
    shortDescription: "A purchasable commercial starter kit.",
    description: "Full production code download.",
    priceInCents: 499900,
    currency: "INR",
    category: "digital_products",
    productType: "digital_download",
    features: ["Feature 1", "Feature 2"],
    requirements: "Node.js 20+",
    faq: [],
    previewImageUrl: "/images/starter.png",
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
    formattedPrice: "₹4,999.00",
  };

  const commercialSchema = getProductStructuredData(commercialProduct, "Digital Products");
  assert(
    commercialSchema !== null && commercialSchema["@type"] === "Product",
    "6.1 Commercial product emits valid @type: 'Product'"
  );

  const offer = commercialSchema?.offers as Record<string, unknown> | undefined;
  assert(
    offer !== undefined &&
      offer["@type"] === "Offer" &&
      offer.price === "4999.00" &&
      offer.priceCurrency === "INR" &&
      offer.availability === "https://schema.org/InStock",
    "6.2 Commercial product emits valid Offer with exact decimal price, INR currency, and InStock availability"
  );

  // 7. Commercial product with customer reviews
  const mockReviews: ProductReview[] = [
    {
      id: "rev-1",
      productId: commercialProduct.id,
      authorName: "Sarah M.",
      authorTitle: "Tech Lead",
      rating: 5,
      content: "Excellent starter kit, saved our team weeks.",
      isVerifiedPurchase: true,
      createdAt: "2026-10-15T00:00:00Z",
    },
  ];

  const reviewedSchema = getProductStructuredData(commercialProduct, "Digital Products", mockReviews);
  const reviewsList = reviewedSchema?.review as Array<Record<string, unknown>> | undefined;
  assert(
    Array.isArray(reviewsList) &&
      reviewsList.length === 1 &&
      reviewsList[0]["@type"] === "Review" &&
      (reviewsList[0].reviewRating as Record<string, unknown>).ratingValue === 5 &&
      (reviewsList[0].author as Record<string, unknown>).name === "Sarah M.",
    "7. Customer reviews are correctly serialized when present on a commercial product"
  );

  console.log("--------------------------------------------------");
  console.log(`Structured Data Suite Results: ${passed} PASS, ${failed} FAIL.`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runStoreStructuredDataTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
