import { TextInput, View, Text, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';

interface InputProps extends TextInputProps {
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, containerStyle, style, ...props }: InputProps) {
    return (
        <View style={[tw`gap-2`, containerStyle]}>
            {label && <Text style={tw`text-sm font-medium text-slate-200`}>{label}</Text>}
            <TextInput
                style={[
                    tw`flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50`,
                    style
                ]}
                placeholderTextColor="#64748b"
                {...props}
            />
        </View>
    );
}
