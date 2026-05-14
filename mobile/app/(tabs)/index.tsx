import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import tw from 'twrnc';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { decodeJwt } from '@/utils/jwt';
import { Button } from '@/components/ui/Button';

interface Scan {
  _id: string;
  url: string;
  risk_level: string;
  threat_score: number;
  created_at: string;
}

export default function DashboardScreen() {
  const { token, signOut } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchScans = useCallback(async () => {
    if (!token) return;
    try {
      const decoded = decodeJwt(token);
      if (decoded && decoded.user && decoded.user.id) {
        const res = await api.get(`scans/user/${decoded.user.id}`);
        setScans(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchScans();
  };

  // Calculate score
  const recentScans = scans.slice(0, 10);
  const avgThreat = recentScans.length > 0
    ? recentScans.reduce((acc, s) => acc + (s.threat_score || 0), 0) / recentScans.length
    : 0;
  const safetyScore = Math.max(0, Math.min(100, 100 - avgThreat));

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <ScrollView
      style={tw`flex-1 bg-slate-950`}
      contentContainerStyle={tw`p-6 pb-24`}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
    >
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <View>
          <Text style={tw`text-2xl font-bold text-white`}>Dashboard</Text>
          <Text style={tw`text-slate-400 text-sm`}>Your security command center</Text>
        </View>
        <MaterialCommunityIcons name="shield-account" size={28} color="#3b82f6" onPress={() => { }} />
      </View>

      {/* Security Score Card */}
      <View style={tw`bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 items-center`}>
        <Text style={tw`text-slate-400 mb-4 font-medium`}>OVERALL SECURITY SCORE</Text>
        <View style={tw`relative items-center justify-center mb-4`}>
          <MaterialCommunityIcons
            name={safetyScore >= 80 ? "shield-check" : safetyScore >= 50 ? "shield-alert" : "shield-remove"}
            size={64}
            style={tw`${getStatusColor(safetyScore)}`}
          />
        </View>
        <Text style={tw`text-4xl font-bold text-white mb-1`}>{Math.round(safetyScore)}%</Text>
        <Text style={tw`${getStatusTextColor(safetyScore)} font-bold tracking-widest uppercase text-xs`}>
          {safetyScore >= 80 ? 'Protected' : safetyScore >= 50 ? 'At Risk' : 'High Risk'}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={tw`flex-row flex-wrap justify-between mb-6`}>
        <View style={tw`w-[48%] bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4`}>
          <View style={tw`flex-row justify-between items-start mb-2`}>
            <Text style={tw`text-slate-400 text-xs font-bold`}>SCANS</Text>
            <MaterialCommunityIcons name="radar" size={16} color="#64748b" />
          </View>
          <Text style={tw`text-2xl font-bold text-white`}>{scans.length}</Text>
          <Text style={tw`text-slate-500 text-xs`}>Total checks</Text>
        </View>
        <View style={tw`w-[48%] bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4`}>
          <View style={tw`flex-row justify-between items-start mb-2`}>
            <Text style={tw`text-slate-400 text-xs font-bold`}>THREATS</Text>
            <MaterialCommunityIcons name="alert-decagram" size={16} color="#ef4444" />
          </View>
          <Text style={tw`text-2xl font-bold text-red-500`}>{scans.filter(s => s.risk_level === 'dangerous').length}</Text>
          <Text style={tw`text-slate-500 text-xs`}>Blocked URLs</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={tw`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden`}>
        <View style={tw`p-4 border-b border-slate-800`}>
          <Text style={tw`text-white font-bold`}>Recent Activity</Text>
        </View>
        <View style={tw`p-4`}>
          {scans.length === 0 ? (
            <Text style={tw`text-slate-500 text-center py-4`}>No activity yet.</Text>
          ) : (
            scans.slice(0, 5).map((scan, index) => (
              <View key={index} style={tw`flex-row justify-between items-center mb-4 last:mb-0`}>
                <View style={tw`flex-1 mr-4`}>
                  <Text style={tw`text-slate-300 font-medium`} numberOfLines={1}>{scan.url}</Text>
                  <Text style={tw`text-slate-600 text-xs`}>{new Date(scan.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={tw`px-2 py-1 rounded-full ${scan.risk_level === 'dangerous' ? 'bg-red-500/10' : scan.risk_level === 'warning' ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                  <Text style={tw`text-xs font-bold capitalize ${scan.risk_level === 'dangerous' ? 'text-red-500' : scan.risk_level === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {scan.risk_level}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={tw`mt-6`}>
        <Button title="Logout" onPress={signOut} variant="outline" />
      </View>
    </ScrollView>
  );
}
