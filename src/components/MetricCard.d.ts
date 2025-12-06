import type { ComponentType } from "react";
export interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: ComponentType<{
        className?: string;
    }>;
    color: 'nexlytix' | 'green' | 'red' | 'yellow' | 'blue';
    onClick?: () => void;
}
export default function MetricCard({ title, value, change, changeType, icon: Icon, color, onClick }: MetricCardProps): import("react/jsx-runtime").JSX.Element;
