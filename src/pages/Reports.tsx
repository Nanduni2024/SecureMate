import { useEffect, useState } from 'react';
import api from '../lib/api';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileDown, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Scan {
    _id: string;
    url: string;
    risk_level: string;
    threat_score: number;
    created_at: string;
}

interface UserToken {
    user: {
        id: string;
    }
}

export function Reports() {
    const [reports, setReports] = useState<Scan[]>([]);
    const [loading, setLoading] = useState(true);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("SecureMate - Scan Reports", 20, 10);

        const tableData = reports.map(r => [
            r.url,
            new Date(r.created_at).toLocaleDateString(),
            r.risk_level.toUpperCase(),
            r.threat_score
        ]);

        autoTable(doc, {
            head: [['URL', 'Date', 'Risk Level', 'Threat Score']],
            body: tableData,
            startY: 20
        });

        doc.save('SecureMate_Reports.pdf');
    };

    const exportToCSV = () => {
        const headers = ['URL', 'Date', 'Risk Level', 'Threat Score'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + reports.map(r => `${r.url},${new Date(r.created_at).toLocaleDateString()},${r.risk_level},${r.threat_score}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "SecureMate_Reports.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode<UserToken>(token);
                    const user_id = decoded.user.id;
                    const res = await api.get(`/scans/user/${user_id}`);
                    setReports(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Saved Scan Reports</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportToPDF}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export to PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export to CSV
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input placeholder="Search reports..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Scan Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b [&_tr]:border-slate-800">
                                <tr className="border-b transition-colors hover:bg-slate-900/50 data-[state=selected]:bg-slate-900">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">URL</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Risk Level</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Threats</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {reports.map((report) => (
                                    <tr key={report._id} className="border-b border-slate-800 transition-colors hover:bg-slate-900/50">
                                        <td className="p-4 align-middle font-medium truncate max-w-[200px]">{report.url}</td>
                                        <td className="p-4 align-middle">{new Date(report.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={report.risk_level === 'dangerous' ? 'destructive' : report.risk_level === 'warning' ? 'secondary' : 'default'}>{report.risk_level}</Badge>
                                        </td>
                                        <td className="p-4 align-middle">{report.threat_score > 75 ? 'High' : report.threat_score > 40 ? 'Medium' : 'Low'}</td>
                                        <td className="p-4 align-middle text-right">
                                            <Link to={`/reports/${report._id}`}>
                                                <Button variant="ghost" size="sm">View Details</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {reports.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">
                                            No scan reports found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
