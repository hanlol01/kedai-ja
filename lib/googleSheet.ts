import { google } from 'googleapis';

// Konfigurasi Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Inisialisasi Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    : { keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || './service-account.json' },
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

// Konfigurasi Spreadsheet
export const SPREADSHEET_CONFIG = {
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '1BBdNJ6BlDfftCmZxj8sq_tXaMO3t-Y8Qt3jP8bRJICw',
  sheetName: 'Sheet1',
  range: 'A:C', // Kolom A (Nama menu), B (Harga), C (Stok)
};

// Interface untuk data spreadsheet
export interface SpreadsheetRow {
  name: string;
  price: number;
  available: boolean;
}

// Interface untuk mapping data
export interface MenuItemMapping {
  name: string;
  price: number;
  available: boolean;
  description?: string;
  category?: 'Makanan' | 'Minuman';
  image?: string;
}

// Fungsi untuk membaca data dari spreadsheet
export const readSpreadsheetData = async (): Promise<SpreadsheetRow[]> => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_CONFIG.spreadsheetId,
      range: `${SPREADSHEET_CONFIG.sheetName}!${SPREADSHEET_CONFIG.range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in spreadsheet');
      return [];
    }

    // Skip header row dan parse data
    const dataRows = rows.slice(1);
    const parsedData: SpreadsheetRow[] = [];

    for (const row of dataRows) {
      if (row.length >= 3) {
        const [name, priceStr, stockStr] = row;
        
        // Parse price (hapus karakter non-numeric)
        const price = parseInt(priceStr.toString().replace(/[^\d]/g, '')) || 0;
        
        // Parse available status
        const available = stockStr.toString().toLowerCase().includes('tersedia');
        
        parsedData.push({
          name: name.toString().trim(),
          price,
          available,
        });
      }
    }

    console.log(`Successfully read ${parsedData.length} rows from spreadsheet`);
    return parsedData;
  } catch (error) {
    console.error('Error reading spreadsheet:', error);
    throw error;
  }
};

// Fungsi untuk menulis data ke spreadsheet
export const writeSpreadsheetData = async (data: SpreadsheetRow[]): Promise<void> => {
  try {
    // Prepare data untuk spreadsheet (header + data)
    const spreadsheetData = [
      ['Nama menu', 'Harga', 'Stok'], // Header
      ...data.map(row => [
        row.name,
        row.price.toString(),
        row.available ? 'Tersedia' : 'Habis'
      ])
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_CONFIG.spreadsheetId,
      range: `${SPREADSHEET_CONFIG.sheetName}!${SPREADSHEET_CONFIG.range}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: spreadsheetData,
      },
    });

    console.log(`Successfully wrote ${data.length} rows to spreadsheet`);
  } catch (error) {
    console.error('Error writing to spreadsheet:', error);
    throw error;
  }
};

// Fungsi untuk menambahkan baris baru ke spreadsheet
export const appendSpreadsheetRow = async (data: SpreadsheetRow): Promise<void> => {
  try {
    const rowData = [
      data.name,
      data.price.toString(),
      data.available ? 'Tersedia' : 'Habis'
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_CONFIG.spreadsheetId,
      range: `${SPREADSHEET_CONFIG.sheetName}!A:C`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    console.log(`Successfully appended row: ${data.name}`);
  } catch (error) {
    console.error('Error appending to spreadsheet:', error);
    throw error;
  }
};

// Fungsi untuk mencari dan update baris berdasarkan nama menu
export const updateSpreadsheetRow = async (name: string, data: Partial<SpreadsheetRow>): Promise<void> => {
  try {
    // Baca semua data untuk mencari index baris
    const allData = await readSpreadsheetData();
    const rowIndex = allData.findIndex(row => row.name.toLowerCase() === name.toLowerCase());
    
    if (rowIndex === -1) {
      throw new Error(`Menu "${name}" not found in spreadsheet`);
    }

    // Update data yang ada
    const updatedData = { ...allData[rowIndex], ...data };
    allData[rowIndex] = updatedData;

    // Tulis kembali semua data
    await writeSpreadsheetData(allData);
    
    console.log(`Successfully updated row for: ${name}`);
  } catch (error) {
    console.error('Error updating spreadsheet row:', error);
    throw error;
  }
};

export default sheets; 