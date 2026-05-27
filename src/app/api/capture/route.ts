import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { libraries, bundle } from '@/data/products';
import { getDownloadUrls } from '@/lib/r2';

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
  const { orderID, productSlug, type } = await req.json();

  const accessToken = await getAccessToken();

  const res = await fetch(
    `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();

  if (data.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
  }

  const buyerName: string = data.payer?.name?.given_name ?? 'there';

  let productName = 'your library';
  if (type === 'bundle') {
    productName = bundle.name;
  } else {
    const library = libraries.find((l) => l.slug === productSlug);
    if (library) productName = library.name;
  }

  const downloadUrls = await getDownloadUrls(productSlug, type);

  const payload = `${orderID}|${productSlug}|${type}|${Date.now()}`;
  const sendToken = `${payload}|${createHmac('sha256', process.env.SEND_TOKEN_SECRET!).update(payload).digest('hex')}`;

  return NextResponse.json({ success: true, downloadUrls, buyerName, productName, sendToken });
}
