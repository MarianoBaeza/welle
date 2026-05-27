import { NextRequest, NextResponse } from 'next/server';
import { sendDownloadEmail } from '@/lib/email';
import { DownloadLink } from '@/lib/r2';

export async function POST(req: NextRequest) {
  const { email, buyerName, downloadUrls, productName } = await req.json() as {
    email: string;
    buyerName: string;
    downloadUrls: DownloadLink[];
    productName: string;
  };

  if (!email || !downloadUrls?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await sendDownloadEmail(email, buyerName ?? 'there', downloadUrls, productName);
    console.log('[send-download] Resend OK:', result);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[send-download] Resend error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
