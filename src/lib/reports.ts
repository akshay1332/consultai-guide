import { supabase } from './supabase';
import type { ReportData } from './gemini';
import { jsPDF } from 'jspdf';

export interface StoredReport {
  id: string;
  session_id: string;
  report_data: ReportData;
  generated_at: string;
  user_id?: string;
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export async function generateReportPDF(report: StoredReport): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set initial position
  let yPos = 20;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (2 * margin);

  // Helper function to add text and return the new Y position
  const addText = (text: string, size: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(size);
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, yPos);
    yPos += (lines.length * size * 0.3527) + 5;
    
    // Add new page if needed
    if (yPos > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPos = margin;
    }
  };

  // Header
  pdf.setTextColor(4, 114, 77); // #04724D
  addText('Medical Consultation Report', 24, true);
  
  pdf.setTextColor(102, 102, 102); // #666666
  addText(`Generated on ${formatDate(report.generated_at)}`, 12);
  addText(`Report ID: ${report.id}`, 10);
  yPos += 10;

  // Estimated Condition
  pdf.setTextColor(4, 114, 77);
  addText('Estimated Condition', 18, true);
  pdf.setTextColor(51, 51, 51);
  addText(report.report_data.estimatedCondition);
  yPos += 5;

  // Symptoms Analysis
  pdf.setTextColor(4, 114, 77);
  addText('Symptoms Analysis', 18, true);
  pdf.setTextColor(51, 51, 51);
  addText(report.report_data.symptomsAnalysis);
  yPos += 5;

  // Diagnosis
  pdf.setTextColor(4, 114, 77);
  addText('Diagnosis', 18, true);
  pdf.setTextColor(51, 51, 51);
  addText(report.report_data.diagnosis);
  yPos += 5;

  // Treatment Plan
  pdf.setTextColor(4, 114, 77);
  addText('Treatment Plan', 18, true);
  pdf.setTextColor(51, 51, 51);
  report.report_data.treatment.forEach(item => {
    addText(`• ${item}`);
  });
  yPos += 5;

  // Medications
  pdf.setTextColor(4, 114, 77);
  addText('Medications', 18, true);
  pdf.setTextColor(51, 51, 51);
  report.report_data.medications.forEach(med => {
    addText(`${med.name}`, 14, true);
    addText(`Dosage: ${med.dosage}`);
    addText(`Duration: ${med.duration}`);
    addText(`Instructions: ${med.instructions}`);
    yPos += 5;
  });

  // Recommendations
  pdf.setTextColor(4, 114, 77);
  addText('Recommendations', 18, true);
  pdf.setTextColor(51, 51, 51);
  report.report_data.recommendations.forEach(item => {
    addText(`• ${item}`);
  });
  yPos += 5;

  // Precautions
  pdf.setTextColor(4, 114, 77);
  addText('Precautions & Warning Signs', 18, true);
  pdf.setTextColor(51, 51, 51);
  addText(report.report_data.precautions);
  yPos += 5;

  // Follow-up Plan
  pdf.setTextColor(4, 114, 77);
  addText('Follow-up Plan', 18, true);
  pdf.setTextColor(51, 51, 51);
  addText(report.report_data.followUp);
  yPos += 15;

  // Footer with disclaimer
  pdf.setTextColor(102, 102, 102);
  const disclaimer = 'This report was generated by ConsultAI Medical System. This is an AI-generated assessment and should not be considered as professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.';
  pdf.setFontSize(10);
  const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth);
  pdf.text(disclaimerLines, margin, pdf.internal.pageSize.getHeight() - 20);

  // Save the PDF
  pdf.save(`medical-report-${formatDate(report.generated_at)}.pdf`);
}

export function downloadReport(report: StoredReport) {
  generateReportPDF(report).catch(error => {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  });
} 