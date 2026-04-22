import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Google Sheets API 인증 및 초기화 유틸리티
export const getGoogleSheet = async () => {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  // \n 처리된 프라이빗 키 복원
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error('Google Sheets environment variables are missing.');
  }

  // 서비스 계정 인증 설정
  const serviceAccountAuth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  
  await doc.loadInfo(); // 스프레드시트 정보 로드
  return doc;
};

/**
 * 데이터를 시트 형식에 맞게 동기화 (기존 데이터 삭제 후 재생성 방식)
 * @param sheetName 연동할 시트 이름
 * @param header 데이터의 헤더 행
 * @param rows 데이터 행들
 */
export const syncSheetData = async (sheetName: string, header: string[], rows: any[]) => {
  const doc = await getGoogleSheet();
  let sheet = doc.sheetsByTitle[sheetName];

  // 시트가 없으면 생성
  if (!sheet) {
    sheet = await doc.addSheet({ title: sheetName, headerValues: header });
  } else {
    // 기존 데이터 초기화 (헤더 유지)
    await sheet.clear();
    await sheet.setHeaderRow(header);
  }

  // 100개 단위로 행 추가 (성능 최적화)
  if (rows.length > 0) {
    await sheet.addRows(rows);
  }
};
