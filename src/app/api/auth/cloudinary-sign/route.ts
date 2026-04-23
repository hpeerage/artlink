import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { paramsToSign } = await request.json();

    if (!process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary API Secret is missing' }, { status: 500 });
    }

    let apiKey = process.env.CLOUDINARY_API_KEY || '';
    if (apiKey.includes('cloudinary://')) {
      const match = apiKey.match(/cloudinary:\/\/([^:]+):/);
      if (match) apiKey = match[1];
    } else if (apiKey.includes('CLOUDINARY_URL=')) {
      const match = apiKey.match(/cloudinary:\/\/([^:]+):/);
      if (match) apiKey = match[1];
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ 
      signature,
      apiKey,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    });
  } catch (error: any) {
    console.error('Cloudinary signing error:', error);
    return NextResponse.json({ error: 'Failed to sign cloudinary params' }, { status: 500 });
  }
}
