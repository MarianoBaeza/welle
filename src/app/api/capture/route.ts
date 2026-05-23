import { NextRequest, NextResponse } from 'next/server';

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
  const { orderID } = await req.json();

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

  return NextResponse.json({ success: true });
}
