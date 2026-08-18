import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cleanSlug = slug.replace('.pdf', '').toLowerCase().trim();

  // Load knowledge catalog dynamically
  let projectInfo: any = null;
  try {
    const catalogPath = path.join(process.cwd(), 'knowledge', 'published', 'offplan_catalog.json');
    if (fs.existsSync(catalogPath)) {
      const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
      for (const dev of catalogData.developers || []) {
        for (const proj of dev.projects || []) {
          const pId = proj.id ? proj.id.toLowerCase() : '';
          const pName = proj.projectName ? proj.projectName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
          if (pId.includes(cleanSlug) || cleanSlug.includes(pId) || pName.includes(cleanSlug.replace(/[^a-z0-9]/g, ''))) {
            projectInfo = {
              title: `${proj.projectName} by ${dev.name}`,
              developer: dev.name,
              location: proj.location,
              startingPrice: proj.startingPriceAed ? `AED ${proj.startingPriceAed.toLocaleString()}` : 'AED 650,000',
              plan: proj.paymentPlan || 'Flexible Developer Payment Plan Available',
              overview: Array.isArray(proj.keyFacts) ? proj.keyFacts.join('. ') : 'Luxury off-plan development in prime Dubai location.',
            };
            break;
          }
        }
        if (projectInfo) break;
      }
    }
  } catch (e) {
    console.error('Error reading catalog for brochure:', e);
  }

  const project = projectInfo || {
    title: `${cleanSlug.toUpperCase().replace(/-/g, ' ')} — Luxury Off-Plan Collection`,
    developer: 'The Pods Real Estate Preferred Developer',
    location: 'Dubai, UAE',
    startingPrice: 'AED 650,000',
    plan: 'Flexible Developer Payment Plan Available',
    overview: 'Exclusive luxury off-plan real estate prospectus curated by Minesh Patel at The Pods Real Estate.',
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${project.title} - Official Prospectus</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B192C; color: #FFFFFF; margin: 0; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; background: #151824; border: 1px solid #C5A059; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { text-align: center; border-bottom: 1px solid #1E2230; padding-bottom: 20px; margin-bottom: 30px; }
    .gold { color: #C5A059; }
    .title { font-size: 28px; font-weight: 800; margin-bottom: 10px; }
    .subtitle { color: #94A3B8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
    .card { background: #0D0F17; border: 1px solid #1E2230; padding: 20px; border-radius: 12px; }
    .label { color: #94A3B8; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
    .value { font-size: 18px; font-weight: 700; color: #FFFFFF; }
    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #64748B; border-top: 1px solid #1E2230; padding-top: 20px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #C5A059, #D4B06A); color: #000; font-weight: bold; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="subtitle">The Pods Real Estate — Official Property Prospectus</div>
      <h1 class="title gold">${project.title}</h1>
      <p style="color: #CBD5E1;">Developer: <strong>${project.developer}</strong> | Location: <strong>${project.location}</strong></p>
    </div>

    <div class="grid">
      <div class="card">
        <div class="label">Starting Price</div>
        <div class="value gold">${project.startingPrice}</div>
      </div>
      <div class="card">
        <div class="label">Official Payment Plan</div>
        <div class="value">${project.plan}</div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 20px;">
      <div class="label">Project Highlights & Overview</div>
      <p style="line-height: 1.6; color: #E2E8F0; margin-top: 10px;">${project.overview}</p>
    </div>

    <div style="text-align: center;">
      <a href="https://wa.me/447404097586?text=Hi%20Minesh,%20I%20am%20viewing%20the%20${encodeURIComponent(project.title)}%20prospectus%20and%20would%20like%20to%20schedule%20a%20private%20consultation" class="btn">Connect with Minesh Patel on WhatsApp →</a>
    </div>

    <div class="footer">
      Curated by Minesh Patel (@thepodsrealestate) | Bluewaters Island & London Desks
    </div>
  </div>
</body>
</html>`;



  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
