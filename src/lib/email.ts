import { Resend } from 'resend';
import { DownloadLink } from './r2';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDownloadEmail(
  to: string,
  buyerName: string,
  downloads: DownloadLink[],
  productName: string
): Promise<void> {
  const linksHtml = downloads
    .map(
      ({ name, url }) =>
        `<a href="${url}" style="display:block;margin-bottom:12px;padding:14px 20px;background:#1c1c1c;border:1px solid #3f3f46;border-radius:8px;color:#f59e0b;font-weight:700;text-decoration:none;font-size:15px;text-align:center;">Download ${name}</a>`
    )
    .join('');

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `Your Welle download is ready`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0a;color:#fff;padding:48px 32px;max-width:520px;margin:0 auto;border-radius:16px;">
        <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">You're all set, ${buyerName}.</h1>
        <p style="color:#a1a1aa;margin:0 0 32px;font-size:15px;"><strong style="color:#fff">${productName}</strong> is yours.</p>

        <p style="color:#71717a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin:0 0 12px;">Download your files</p>
        ${linksHtml}

        <p style="color:#3f3f46;font-size:12px;margin:28px 0 0;line-height:1.6;">
          These links expire in 48 hours.<br>
          Lost them? Reply to this email and we'll sort it out.
        </p>

        <div style="margin-top:36px;padding-top:24px;border-top:1px solid #1c1c1e;">
          <p style="color:#3f3f46;font-size:12px;margin:0;">Welle · Make your creativity heard.</p>
        </div>
      </div>
    `,
  });

  if (error) throw new Error(JSON.stringify(error));
}
