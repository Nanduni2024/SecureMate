import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useApi } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ChevronLeft, Share2, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Scan {
    _id: string;
    url: string;
    link_type: 'official' | 'malicious' | 'suspicious' | 'unknown';
    risk_level: string;
    threat_score: number;
    ai_summary: string;
    created_at: string;
}

export function ReportDetails() {
    const { id } = useParams();
    const [report, setReport] = useState<Scan | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToast } = useToast();
    const api = useApi();

    useEffect(() => {
        const fetchReport = async () => {
            if (!user?.id) return;
            try {
                const res = await api.get(`/scans/${id}`);
                setReport(res.data);
            } catch (err) {
                console.error(err);
                addToast('Failed to load report', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id, user, api, addToast]);

    const downloadPDF = () => {
        if (!report) return;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("SecureMate Security Report", 20, 20);

        doc.setFontSize(14);
        doc.text(`URL: ${report.url}`, 20, 40);
        doc.text(`Risk Level: ${report.risk_level.toUpperCase()}`, 20, 50);
        doc.text(`Threat Score: ${report.threat_score}/100`, 20, 60);
        doc.text(`Scan Date: ${new Date(report.created_at).toLocaleString()}`, 20, 70);

        doc.setFontSize(16);
        doc.text("AI Summary:", 20, 90);
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(report.ai_summary || "No automated summary available.", 170);
        doc.text(splitText, 20, 100);

        doc.save(`SecureMate_Report_${report._id}.pdf`);
        addToast('Report downloaded successfully', 'success');
    };

    const handleShare = async () => {
        if (!report) return;
        const shareText = `SecureMate Security Report\nURL: ${report.url}\nRisk Level: ${report.risk_level.toUpperCase()}\nThreat Score: ${report.threat_score}/100\nScan Date: ${new Date(report.created_at).toLocaleString()}`;

        try {
            await navigator.clipboard.writeText(shareText);
            addToast('Report copied to clipboard', 'success');
        } catch {
            addToast('Failed to copy report', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-bold">Report not found</h3>
                <Link to="/reports" className="text-primary-500 hover:underline mt-4 inline-block">Back to Reports</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/reports" className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Reports
                </Link>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Security Analysis: {report.url}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                            <div className="space-y-1">
                                <p className="text-sm text-slate-400">Risk Assessment</p>
                                <Badge variant={report.risk_level === 'dangerous' ? 'destructive' : report.risk_level === 'warning' ? 'secondary' : 'default'} className="text-lg px-3 py-1 uppercase tracking-wider">
                                    {report.risk_level}
                                </Badge>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-sm text-slate-400">Threat Score</p>
                                <p className={`text-3xl font-bold ${report.threat_score > 75 ? 'text-red-500' : report.threat_score > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {report.threat_score}/100
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                            <p className="text-sm text-slate-400">Link Classification</p>
                            <Badge variant={report.link_type === 'malicious' ? 'destructive' : report.link_type === 'official' ? 'default' : 'secondary'} className="uppercase">
                                {report.link_type}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">AI Security Summary</h3>
                            <div className="p-4 bg-primary-950/20 border border-primary-900/50 rounded-lg text-slate-300 leading-relaxed">
                                {report.ai_summary || "Our AI engine is still analyzing this threat. Please check back in a few minutes."}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Report Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500">Scan Date</p>
                            <p className="text-sm font-medium">{new Date(report.created_at).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500">Scan ID</p>
                            <p className="text-sm font-mono text-slate-400">{report._id}</p>
                        </div>
                        <div className="pt-4">
                            <Button className="w-full" size="lg" onClick={downloadPDF}>
                                <Save className="mr-2 h-4 w-4" /> Save Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
