import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  const src = 'C:/Users/adr/.gemini/antigravity/brain/4a6ec73d-6ea4-44ef-8558-c8f54540b01a/career_coach_banner_1773570741681.png';
  const dest = path.join(process.cwd(), 'public', 'career_new.png');
  
  try {
    const buf = fs.readFileSync(src);
    fs.writeFileSync(dest, buf);
    return NextResponse.json({ success: true, bytes: buf.length, dest });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
