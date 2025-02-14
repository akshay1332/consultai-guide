import { supabase } from './supabase';
import type { ReportData } from './gemini';

export interface StoredReport {
  id: string;
  session_id: string;
  report_data: ReportData;
  generated_at: string;
}

export async function storeReport(
  sessionId: string, 
  reportData: ReportData
): Promise<StoredReport | null> {
  try {
    // Convert sessionId to UUID format if it's not already
    const formattedSessionId = sessionId.includes('-') ? sessionId : 
      `${sessionId.slice(0,8)}-${sessionId.slice(8,12)}-${sessionId.slice(12,16)}-${sessionId.slice(16,20)}-${sessionId.slice(20)}`;

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          session_id: formattedSessionId,
          report_data: reportData
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error storing report:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in storeReport:', error);
    throw error;
  }
}

export async function getUserReports(): Promise<StoredReport[]> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserReports:', error);
    throw error;
  }
}

export async function getReportById(reportId: string): Promise<StoredReport | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getReportById:', error);
    throw error;
  }
}

export function generateReportPDF(report: StoredReport): string {
  const reportContent = JSON.stringify(report.report_data, null, 2);
  return reportContent;
}

export function downloadReport(report: StoredReport) {
  const reportContent = generateReportPDF(report);
  const blob = new Blob([reportContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `medical-report-${report.generated_at}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 