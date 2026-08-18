import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cleanSlug = slug.replace('.pdf', '').toLowerCase();

  const brochures: Record<string, { title: string; developer: string; location: string; startingPrice: string; plan: string; overview: string }> = {
    'danube-bayz101': {
      title: 'BAYZ 101 by Danube Properties',
      developer: 'Danube Properties',
      location: 'Business Bay, Dubai',
      startingPrice: 'AED 650,000',
      plan: '20% Down Payment + 1% Monthly Construction Plan + 40% Post-Handover',
      overview: 'Ultra-luxury 101-level skyscraper offering panoramic views of Burj Khalifa & Dubai Canal. Fully furnished luxury suites with world-class amenities.',
    },
    'danube-diamondz': {
      title: 'DIAMONDZ by Danube Properties',
      developer: 'Danube Properties',
      location: 'Jumeirah Lake Towers (JLT), Dubai',
      startingPrice: 'AED 1,100,000',
      plan: '20% Down Payment + 1% Monthly Terms',
      overview: 'Resort-style luxury living with over 40 exclusive lifestyle amenities, infinity pools, bowling alleys, and private sky decks.',
    },
    'sobha-hartland2': {
      title: 'Sobha Hartland II Waterfront Villas & Apartments',
      developer: 'Sobha Realty',
      location: 'Sobha Hartland II, Ras Al Khor, Dubai',
      startingPrice: 'AED 1,400,000',
      plan: '10% Down Payment + 50/50 Payment Plan',
      overview: 'Luxury waterfront community with crystal lagoons, 50% green open spaces, and world-class international schools.',
    },
  };

  const project = brochures[cleanSlug] || {
    title: 'The Pods Luxury Off-Plan Collection',
    developer: 'The Pods Real Estate',
    location: 'Dubai, UAE',
    startingPrice: 'AED 650,000',
    plan: 'Flexible Developer Terms Available',
    overview: 'Exclusive off-plan luxury real estate inventory in Dubai curated by Minesh Patel.',
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
