import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw, { style as twStyle } from 'twrnc';
import { ReactNode } from 'react';

interface ButtonProps {
    onPress?: () => void;
    title: string;
    variant?: 'default' | 'outline' | 'ghost';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: ReactNode;
}

export function Button({ onPress, title, variant = 'default', loading, disabled, className, icon }: ButtonProps) {
    const baseStyles = "h-10 px-4 py-2 rounded-md flex-row items-center justify-center";
    const variantStyles = {
        default: "bg-blue-500",
        outline: "border border-slate-700 bg-transparent",
        ghost: "bg-transparent",
    };
    const textStyles = {
        default: "text-white font-medium",
        outline: "text-slate-200 font-medium",
        ghost: "text-slate-200 font-medium",
    };

    const buttonStyle = twStyle(
        baseStyles,
        variantStyles[variant],
        disabled && "opacity-50",
        className
    );

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading || disabled}
            style={buttonStyle}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'default' ? 'white' : '#94a3b8'} />
            ) : (
                <View style={tw`flex-row items-center`}>
                    {icon && <View style={tw`mr-2`}>{icon}</View>}
                    <Text style={twStyle(textStyles[variant])}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

