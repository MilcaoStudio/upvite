// inputs:
// - checkbox (bool)
// - colour swatches (string)
// - combobox (string)
// - inputbox (string)
// - override (tri-state) [to implement]
// - radio (string)
// - textarea (string) [to implement]

import type { HTMLButtonAttributes, HTMLSelectAttributes } from "svelte/elements";
import type { CheckBoxProps, ColorSelectProps, InputBoxProps, RadioProps, TextAreaProps } from "./Inputs";
import { setContext, type SvelteComponent } from "svelte";
import type { Action, Modal, ModalProps } from "./Modal";

/**
 * Available input types
 */
export type Type =
    | "text"
    | "checkbox"
    | "colour"
    | "combo"
    | "radio"
    | "textarea"
    | "custom";

/**
 * Get default value
 */
export function emptyValue(type: Type) {
    return type == "custom" ? undefined : type == "checkbox" ? false : "";
}

/**
 * Multi or single-select choice entry
 */
type Choice = {
    value: string,
    name: string
};

/**
 * Metadata for different input types
 */
type Metadata = {
    text: { value: string; props: InputBoxProps };
    checkbox: { value: boolean; props: CheckBoxProps };
    colour: {
        value: string;
        props: ColorSelectProps;
    };
    combo: {
        value: string;
        props: Omit<HTMLSelectAttributes, "children"> & {
            options: Choice[];
        };
    };
    radio: {
        value: string;
        props: {
            choices: (Choice &
                Omit<RadioProps, "title" | "value">)[];
        };
    };
    textarea: { value: string; props: TextAreaProps };
    custom: { value: never; props: { element: SvelteComponent } };
};

/**
 * Actual input value type
 */
export type Value<T extends Type> = Metadata[T]["value"];

export type TypeProps<T extends Type> = Omit<
    Metadata[T]["props"],
    "value" | "onChange"
> & {
    field?: string;
};

/**
 * Component props
 */
export type InputProps<T extends Type> = {
    type: T;
    value: Value<T> | (() => Value<T>);
    onChange: (v: Value<T>) => void;
    disabled?: boolean;
} & TypeProps<T>;

/**
 * Form schema
 */
export type FormTemplate = Record<string, Type>;

/**
 * Generate value object from form schema
 */
export type MapFormToValues<T extends FormTemplate> = {
    [Property in keyof T]: Value<T[Property]>;
};

/**
 * Generate data object from form schema
 */
export type MapFormToData<T extends FormTemplate> = {
    [Property in keyof T]: TypeProps<T[Property]>;
};

/**
 * Form props
 */
export interface FormProps<T extends FormTemplate> {
    /**
     * Form schema
     */
    schema: T;

    /**
     * Props required for rendering form elements
     */
    data: MapFormToData<T>;

    /**
     * Handle changes to the data
     */
    onChange?: (data: MapFormToValues<T>, key: keyof T) => void;

    /**
     * Handle form submission
     */
    onSubmit?: (data: MapFormToValues<T>) => void;

    /**
     * Provide an observable object of values
     */
    observed?: MapFormToValues<T>;

    /**
     * Provide default values for keys
     */
    defaults?: Partial<MapFormToValues<T>>;

    /**
     * Submit button properties
     */
    submitBtn?: Omit<HTMLButtonAttributes, "type">;

    /**
     * Whether all elements are disabled
     */
    disabled?: boolean;

    /**
     * Custom form layout
     */
    children?: SvelteComponent;
}

/**
 * Get initial values to use for the form data
 * @param schema Schema to use
 * @param defaults Defaults to apply
 * @returns Initial values
 */
export function getInitialValues<T extends FormTemplate>(
    schema: T,
    defaults?: Partial<MapFormToValues<T>>,
) {
    const values: Partial<MapFormToValues<T>> = {};

    Object.keys(schema).forEach(
        (key) =>
            (values[key as keyof typeof values] =
                defaults?.[key] ?? emptyValue(schema[key])),
    );

    return values as MapFormToValues<T>;
}

export type FormContext = Pick<FormProps<any>, "schema" | "disabled" | "onChange" | "data"> & {
    values: Record<string, any>;
}

export type ModalFormProps<T extends FormTemplate, M extends Modal["type"]> = Exclude<
    ModalProps<M>,
    "children" | "actions" | "registerOnClose" | "registerOnConfirm"
> &
    Omit<FormProps<T>, "observed" | "onChange" | "onSubmit"> & {
        /**
         * Form submission callback
         */
        callback: (values: MapFormToValues<T>) => Promise<void>;

        /**
         * Submit button properties
         */
        submit?: Omit<HTMLButtonAttributes, "type">;

        /**
         * Custom actions after submit button
         */
        actions?: Action[];
};
