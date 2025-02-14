import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";
import { MedicalReport } from "@/lib/gemini";

interface MedicalReportViewProps {
  report: MedicalReport & { disclaimer: string };
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function MedicalReportView({
  report,
  onPrint,
  onDownload,
  onShare,
}: MedicalReportViewProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Medical Consultation Report</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Preliminary Assessment</h4>
                  <p className="text-sm text-muted-foreground">{report.diagnosis}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {report.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {report.medications.map((med, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{med.name}</h4>
                          <Badge>Over-the-counter</Badge>
                        </div>
                        <dl className="grid gap-2 text-sm">
                          <div>
                            <dt className="font-medium text-muted-foreground">Dosage</dt>
                            <dd>{med.dosage}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-muted-foreground">Duration</dt>
                            <dd>{med.duration}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-muted-foreground">Instructions</dt>
                            <dd>{med.instructions}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lifestyle">
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {report.lifestyle_changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-sm">{change}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followup">
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{report.follow_up}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">{report.disclaimer}</p>
        </div>
      </CardContent>
    </Card>
  );
} 