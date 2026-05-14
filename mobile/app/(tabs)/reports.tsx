import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import tw, { style as twStyle } from 'twrnc';
import api from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { decodeJwt } from '../../utils/jwt';
import { Shield, ShieldAlert, ShieldCheck, Clock, AlertTriangle } from 'lucide-react-native';

interface ScanReport {
    _id: string;
    url: string;
    threat_score: number;
    risk_level: 'safe' | 'warning' | 'dangerous';
    ai_summary: string;
    created_at: string;
}

export default function ReportsScreen() {
    const { token } = useAuth();
    const [reports, setReports] = useState<ScanReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReports = useCallback(async () => {
        if (!token) return;
        try {
            const decoded = decodeJwt(token);
            if (decoded) {
                const user_id = decoded.user?.id || decoded.id;
                const res = await api.get(`scans/user/${user_id}`);
                setReports(res.data);
            }
        } catch (err) {
            console.error('[Reports] Fetch Error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchReports();
    };

    const getRiskStyles = (level: string) => {
        switch (level) {
            case 'safe':
                return {
                    bg: 'bg-emerald-500/10',
                    text: 'text-emerald-500',
                    border: 'border-emerald-500/20',
                    icon: <ShieldCheck size={16} color="#10b981" />
                };
            case 'warning':
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-500',
                    border: 'border-amber-500/20',
                    icon: <AlertTriangle size={16} color="#f59e0b" />
                };
            case 'dangerous':
                return {
                    bg: 'bg-red-500/10',
                    text: 'text-red-500',
                    border: 'border-red-500/20',
                    icon: <ShieldAlert size={16} color="#ef4444" />
                };
            default:
                return {
                    bg: 'bg-slate-500/10',
                    text: 'text-slate-500',
                    border: 'border-slate-500/20',
                    icon: <Shield size={16} color="#94a3b8" />
                };
        }
    };

    if (loading) {
        return (
            <View style={tw`flex-1 bg-slate-950 items-center justify-center`}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-slate-950 pt-12`}>
            {/* Header */}
            <View style={tw`px-6 mb-6`}>
                <Text style={tw`text-2xl font-bold text-white`}>Security Reports</Text>
                <Text style={tw`text-slate-400 text-sm`}>Your scan history and analysis</Text>
            </View>

            <ScrollView
                style={tw`flex-1 px-6`}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
                }
            >
                {reports.map((report) => {
                    const styles = getRiskStyles(report.risk_level);
                    return (
                        <View key={report._id} style={tw`bg-slate-900 border border-slate-800 rounded-xl mb-4 overflow-hidden`}>
                            <View style={tw`p-4 flex-row items-center justify-between border-b border-slate-800`}>
                                <View style={tw`flex-row items-center flex-1`}>
                                    <View style={tw`p-2 ${styles.bg} rounded-lg mr-3`}>
                                        {styles.icon}
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-white font-semibold`} numberOfLines={1}>{report.url}</Text>
                                        <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1`}>
                                            <Clock size={10} color="#64748b" /> {new Date(report.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={tw`items-end`}>
                                    <View style={tw`px-2 py-1 ${styles.bg} ${styles.border} border rounded-full`}>
                                        <Text style={tw`text-[10px] font-bold ${styles.text} uppercase`}>
                                            {report.risk_level}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={tw`p-4 bg-slate-900/50`}>
                                <View style={tw`flex-row justify-between items-center mb-3`}>
                                    <Text style={tw`text-slate-400 text-xs font-semibold`}>Threat Score</Text>
                                    <Text style={tw`text-white font-bold`}>{report.threat_score}/100</Text>
                                </View>

                                {/* Progress Bar */}
                                <View style={tw`h-1.5 w-full bg-slate-800 rounded-full mb-4`}>
                                    <View
                                        style={twStyle(
                                            `h-full rounded-full ${report.threat_score > 70 ? 'bg-red-500' : report.threat_score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`,
                                            { width: `${report.threat_score}%` }
                                        )}
                                    />
                                </View>

                                <Text style={tw`text-slate-300 text-sm leading-5`}>
                                    {report.ai_summary}
                                </Text>
                            </View>
                        </View>
                    );
                })}

                {reports.length === 0 && (
                    <View style={tw`py-12 items-center bg-slate-900 border border-dashed border-slate-800 rounded-xl`}>
                        <Shield size={48} color="#1e293b" style={tw`mb-4`} />
                        <Text style={tw`text-slate-400 font-medium`}>No reports found</Text>
                        <Text style={tw`text-slate-500 text-sm text-center px-6 mt-2 mb-6`}>
                            Scan a URL or file to see your security reports here.
                        </Text>
                    </View>
                )}
                <View style={tw`h-20`} />
            </ScrollView>
        </View>
    );
}
