/**
 * Layer Intelligence - SVG Icons
 * Clean, professional icons for the plugin UI
 */

import { memo } from 'react';

interface IconProps {
    className?: string;
    size?: number;
}

// Severity Icons
export const ErrorIcon = memo(function ErrorIcon({ className, size = 16 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
            <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="currentColor" />
        </svg>
    );
});

export const WarningIcon = memo(function WarningIcon({ className, size = 16 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
            <path d="M8 6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="currentColor" />
        </svg>
    );
});

export const InfoIcon = memo(function InfoIcon({ className, size = 16 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
            <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.75" fill="currentColor" />
        </svg>
    );
});

export const SuccessIcon = memo(function SuccessIcon({ className, size = 16 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
});

// Category Icons
export const LayoutIcon = memo(function LayoutIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 6h12M6 6v8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
});

export const SpacingIcon = memo(function SpacingIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M3 5v6M13 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
});

export const HierarchyIcon = memo(function HierarchyIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <rect x="5" y="1" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="11" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="11" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3M8 8H3.5v3M8 8h4.5v3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
});

export const AccessibilityIcon = memo(function AccessibilityIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="5" r="1.5" fill="currentColor" />
            <path d="M4 7.5h8M8 7.5v5M6 14l2-3.5 2 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
});

export const PerformanceIcon = memo(function PerformanceIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M2 12l4-3 3 2 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 5h3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
});

// Action Icons
export const SearchIcon = memo(function SearchIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
});

export const FileIcon = memo(function FileIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M4 2h5l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
});

export const SparklesIcon = memo(function SparklesIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3 3l2 2M11 11l2 2M11 3l2 2M3 11l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
});

export const EyeIcon = memo(function EyeIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
});

// Proper gear cog icon
export const SettingsIcon = memo(function SettingsIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M6.5 1.5h3l.5 2 1.5.5 1.5-1 2 2-1 1.5.5 1.5 2 .5v3l-2 .5-.5 1.5 1 1.5-2 2-1.5-1-1.5.5-.5 2h-3l-.5-2-1.5-.5-1.5 1-2-2 1-1.5-.5-1.5-2-.5v-3l2-.5.5-1.5-1-1.5 2-2 1.5 1 1.5-.5.5-2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
        </svg>
    );
});

// Layers icon for selection
export const LayersIcon = memo(function LayersIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M1 8l7-4 7 4-7 4-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M1 11l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
});

export const CloseIcon = memo(function CloseIcon({ className, size = 14 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
});

export const ChevronDownIcon = memo(function ChevronDownIcon({ className, size = 12 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
});

export const ChevronRightIcon = memo(function ChevronRightIcon({ className, size = 12 }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none">
            <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
});
