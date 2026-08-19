import { View, Text, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import tw from 'twrnc';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function ScanScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);

  const handleScan = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a URL to scan');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('scans/scan', { url });
      setResult(res.data);
    } catch (err: unknown) {
      console.error(err);
      Alert.alert('Scan Failed', 'Could not scan the URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-slate-950 px-6 py-10`}>
      <Text style={tw`text-3xl font-bold text-white mb-6 mt-10`}>URL Scanner</Text>

      <View style={tw`bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8`}>
        <Text style={tw`text-slate-400 mb-2`}>Enter website URL</Text>
        <TextInput
          style={tw`bg-slate-950 text-white p-4 rounded-lg border border-slate-800 mb-4`}
          placeholder="https://example.com"
          placeholderTextColor="#64748b"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
        />
        <Button
          title="Scan URL"
          onPress={handleScan}
          loading={loading}
          variant="default"
        />
      </View>

      {loading && (
        <View style={tw`items-center py-10`}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={tw`text-slate-400 mt-4`}>Analyzing URL security...</Text>
        </View>
      )}

      {result && (
        <View style={tw`bg-slate-900 p-6 rounded-xl border ${result.riskScore > 50 ? 'border-red-500/50' : 'border-emerald-500/50'}`}>
          <View style={tw`flex-row items-center mb-4`}>
            <MaterialCommunityIcons
              name={result.riskScore > 50 ? "shield-alert" : "shield-check"}
              size={32}
              color={result.riskScore > 50 ? "#ef4444" : "#10b981"}
            />
            <View style={tw`ml-3`}>
              <Text style={tw`text-white font-bold text-lg`}>
                {result.riskScore > 50 ? "High Risk Detected" : "Safe to Visit"}
              </Text>
              <Text style={tw`text-slate-400`}>Risk Score: {result.riskScore}/100</Text>
            </View>
          </View>

          <Text style={tw`text-slate-300`}>
            {result.riskScore > 50
              ? "This website has been flagged for potential security threats. Proceed with caution."
              : "No significant threats were detected on this URL."}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
