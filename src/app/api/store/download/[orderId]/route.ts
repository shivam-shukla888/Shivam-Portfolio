import { NextRequest, NextResponse } from "next/server";
import { getOrderById, verifyDeliveryToken, createShortLivedStorageUrl, logStoreEvent } from "@/lib/orders";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { orderId } = await params;
    if (!orderId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
      return NextResponse.json({ error: "Invalid order identifier" }, { status: 400 });
    }

    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    // 1. Fetch internal order
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Verify order status is PAID
    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Access denied: Order is unpaid or pending verification" },
        { status: 403 }
      );
    }

    // 3. Verify digital delivery authorization token
    if (!token || !verifyDeliveryToken(token, order.delivery_token_hash)) {
      return NextResponse.json(
        { error: "Access denied: Missing or invalid delivery authorization token" },
        { status: 403 }
      );
    }

    logStoreEvent("DELIVERY_STARTED", {
      orderId: order.id,
      productId: order.product_id,
      note: "Authorized digital asset download initiated",
    });

    // 4. Fetch product's private storage asset path from server
    const client = getSupabaseServerClient();
    if (!client) {
      return NextResponse.json(
        {
          error: "Storage service is currently unavailable",
          status: "PENDING_STORAGE_ACCESS",
        },
        { status: 503 }
      );
    }

    const { data: product, error: productError } = await client
      .from("products")
      .select("id, title, product_type, storage_asset_path")
      .eq("id", order.product_id)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json({ error: "Product reference error" }, { status: 404 });
    }

    if (!product.storage_asset_path) {
      return NextResponse.json(
        { error: "This product does not have a downloadable digital asset archive" },
        { status: 404 }
      );
    }

    // 5. Generate short-lived signed storage URL (10 minutes = 600 seconds)
    const signedUrl = await createShortLivedStorageUrl(product.storage_asset_path, 600);

    if (!signedUrl) {
      return NextResponse.json(
        {
          error: "Failed to generate temporary signed download URL",
          status: "PENDING_STORAGE_ACCESS",
        },
        { status: 502 }
      );
    }

    // Support direct download redirect or JSON response
    const acceptHeader = req.headers.get("accept") || "";
    if (acceptHeader.includes("application/json") || searchParams.get("format") === "json") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        productTitle: order.product_title_snapshot,
        downloadUrl: signedUrl,
        expiresInSeconds: 600,
      });
    }

    return NextResponse.redirect(signedUrl, 302);
  } catch (err) {
    console.error("[DOWNLOAD ENDPOINT ERROR]", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json(
      { error: "An unexpected error occurred while resolving digital delivery" },
      { status: 500 }
    );
  }
}
