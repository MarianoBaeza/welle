import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { sendDownloadEmail } from '@/lib/email';
import { getDownloadUrls } from '@/lib/r2';

function verifyToken(sendToken: string): { productSlug: string; type: string } | null {
  const parts = sendToken.split('|');
  if (parts.length !== 5) return null;

  const [orderID, productSlug, type, timestamp, receivedSig] = parts;
  const payload = [orderID, productSlug, type, timestamp].join('|');

  const expectedSig = createHmac('sha256', process.env.SEND_TOKEN_SECRET!)
    .update(payload)
    .digest('hex');

  try {
    if (!timingSafeEqual(Buffer.from(receivedSig, 'hex'), Buffer.from(expectedSig, 'hex'))) return null;
  } catch {
    return null;
  }

  if (Date.now() - parseInt(timestamp) > 2 * 60 * 60 * 1000) return null;

  return { productSlug, type };
}

export async function POST(req: NextRequest) {
  const { email, buyerName, productName, sendToken } = await req.json() as {
    email: string;
    buyerName: string;
    productName: string;
    sendToken: string;
  };

  if (!email || !sendToken) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const verified = verifyToken(sendToken);
  if (!verified) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const downloadUrls = await getDownloadUrls(verified.productSlug, verified.type);

  try {
    const result = await sendDownloadEmail(email, buyerName ?? 'there', downloadUrls, productName);
    console.log('[send-download] Resend OK:', result);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[send-download] Resend error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
