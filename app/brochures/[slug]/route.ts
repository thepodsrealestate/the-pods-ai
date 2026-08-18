import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function createMinimalPdfBuffer(title: string, developer: string, location: string, price: string, plan: string, overview: string): Buffer {
  const textContent = `
${title.toUpperCase()}
DEVELOPER: ${developer}
LOCATION: ${location}
STARTING PRICE: ${price}
PAYMENT PLAN: ${plan}

PROJECT OVERVIEW:
${overview}

Official Prospectus Curated by Minesh Patel (@thepodsrealestate)
The Pods Real Estate — Bluewaters Island & London Desks
`;

  // Standard valid PDF 1.4 binary structure
  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${textContent.length + 100} >>
stream
BT
/F1 14 Tf
40 730 Td
16 TL
(${title.replace(/[()]/g, '')}) Tj
T*
(Developer: ${developer.replace(/[()]/g, '')}) Tj
T*
(Location: ${location.replace(/[()]/g, '')}) Tj
T*
(Starting Price: ${price.replace(/[()]/g, '')}) Tj
T*
(Payment Plan: ${plan.replace(/[()]/g, '')}) Tj
T*
T*
(Project Overview:) Tj
T*
(${overview.substring(0, 150).replace(/[()]/g, '')}) Tj
T*
T*
(The Pods Real Estate - Official Prospectus) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
0000000216 00000 n 
0000000288 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
500
%%EOF`;

  return Buffer.from(pdfString);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cleanSlug = slug.replace('.pdf', '').toLowerCase().trim();

  // 1. Check if a real static PDF file exists in public/brochures/
  const staticPdfPath = path.join(process.cwd(), 'public', 'brochures', `${cleanSlug}.pdf`);
  if (fs.existsSync(staticPdfPath)) {
    const fileBuffer = fs.readFileSync(staticPdfPath);
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${cleanSlug}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // 2. Load knowledge catalog dynamically
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

  // Serve raw PDF binary file
  const pdfBuffer = createMinimalPdfBuffer(
    project.title,
    project.developer,
    project.location,
    project.startingPrice,
    project.plan,
    project.overview
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${cleanSlug}.pdf"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

