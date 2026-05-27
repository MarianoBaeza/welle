import { NextRequest, NextResponse } from 'next/server';
import { libraries, bundle } from '@/data/products';

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { productSlug, type } = await req.json();

  let price: number;
  let description: string;

  if (type === 'bundle') {
    price = bundle.price;
    description = `Welle — ${bundle.name}`;
  } else {
    const library = libraries.find((l) => l.slug === productSlug);
    if (!library) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    price = library.price;
    description = `Welle — ${library.name}`;
  }

  const accessToken = await getAccessToken();

  const res = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: 'USD', value: price.toFixed(2) },
          description,
          custom_id: `${productSlug}:${type}`,
        },
      ],
    }),
  });

  const order = await res.json();
  return NextResponse.json({ orderID: order.id });
}
