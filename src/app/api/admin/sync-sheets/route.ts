import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { users, artworks, b2bInquiries, subscriptions, payments, analytics } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syncSheetData } from '@/lib/google/sheets';

/**
 * 어드민 데이터를 Google Sheets로 동기화하는 API
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- 1. 각 시트별 데이터 수집 ---

    // [Sheet 1: Summary]
    const userCount = await db.select({ count: sql`count(*)` }).from(users);
    const artworkCount = await db.select({ count: sql`count(*)` }).from(artworks);
    const subCount = await db.select({ count: sql`count(*)` }).from(subscriptions);
    const totalRevenue = await db.select({ sum: sql`sum(${payments.amount})` }).from(payments).where(eq(payments.status, 'paid'));

    const summaryData = [
      {
        'Timestamp': new Date().toLocaleString(),
        'Total Users': userCount[0]?.count || 0,
        'Total Artworks': artworkCount[0]?.count || 0,
        'Active Subscriptions': subCount[0]?.count || 0,
        'Total Revenue': totalRevenue[0]?.sum || 0,
      }
    ];

    // [Sheet 2: B2B_Inquiries]
    const inquiriesList = await db.query.b2bInquiries.findMany({
      orderBy: [desc(b2bInquiries.createdAt)]
    });
    
    const inquiryRows = inquiriesList.map(inq => ({
      'ID': inq.id,
      'Company Name': inq.companyName,
      'Manager Name': inq.managerName,
      'Email': inq.email,
      'Phone': inq.phone,
      'Status': inq.status,
      'Created At': inq.createdAt
    }));

    // [Sheet 3: Artworks_List]
    const artworksList = await db.query.artworks.findMany({
      orderBy: [desc(artworks.createdAt)]
    });

    const artworkRows = artworksList.map(art => ({
      'ID': art.id,
      'Title': art.title,
      'Artist': art.artist,
      'Category': art.category,
      'Price Rental': art.priceRental,
      'Width(mm)': art.widthMm,
      'Height(mm)': art.heightMm,
      'Created At': art.createdAt
    }));

    // --- 2. Google Sheets 동기화 실행 ---

    await syncSheetData('Summary', ['Timestamp', 'Total Users', 'Total Artworks', 'Active Subscriptions', 'Total Revenue'], summaryData);
    await syncSheetData('B2B_Inquiries', ['ID', 'Company Name', 'Manager Name', 'Email', 'Phone', 'Status', 'Created At'], inquiryRows);
    await syncSheetData('Artworks_List', ['ID', 'Title', 'Artist', 'Category', 'Price Rental', 'Width(mm)', 'Height(mm)', 'Created At'], artworkRows);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully synced with Google Sheets',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Sheet Sync Error:', error);
    return NextResponse.json({ 
      error: 'Failed to sync with Google Sheets', 
      details: error.message 
    }, { status: 500 });
  }
}
