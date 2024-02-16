import type { HTMLAttributes } from "svelte/elements";

export interface InputBoxProps {
    readonly palette?: "primary" | "secondary";
}

export type CheckBoxProps = {
    readonly disabled?: boolean;

    readonly title?: string;
    readonly description?: string;

    readonly value: boolean;
    readonly onChange: (state: boolean) => void;
} & Omit<
    HTMLAttributes<HTMLLabelElement>,
    "value" | "children" | "onChange" | "title"
>;

export interface ColorSelectProps {
    readonly presets?: string[][];

    readonly value: string;
    readonly onChange: (value: string) => void;
}

const DEFAULT_PRESETS = [
    [
        "#7B68EE",
        "#3498DB",
        "#1ABC9C",
        "#F1C40F",
        "#FF7F50",
        "#FD6671",
        "#E91E63",
        "#D468EE",
    ],
    [
        "#594CAD",
        "#206694",
        "#11806A",
        "#C27C0E",
        "#CD5B45",
        "#FF424F",
        "#AD1457",
        "#954AA8",
    ],
];

export interface RadioProps {
    title?: string;
    description?: string;
    disabled?: boolean;
    value?: boolean;
    onSelect?: () => void;
}

export interface TextAreaProps {
    code?: boolean;
    padding?: string;
    lineHeight?: string;
    hideBorder?: boolean;
}