"use client";

import {forwardRef, useId} from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import {cn} from "@/presentation/lib/cn";

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

type FormFieldInputProps = BaseProps & {
  as?: "input";
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

type FormFieldTextareaProps = BaseProps & {
  as: "textarea";
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

type SelectOption = {value: string; label: string};

type FormFieldSelectProps = BaseProps & {
  as: "select";
  options: SelectOption[];
  placeholder?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">;

export type FormFieldProps =
  | FormFieldInputProps
  | FormFieldTextareaProps
  | FormFieldSelectProps;

type FormFieldRef = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** Gaya form untuk seluruh situs — bagian 1.7 issue.md. */
export const FormField = forwardRef<FormFieldRef, FormFieldProps>(
  function FormField({label, hint, error, wrapperClassName, id, ...rest}, ref) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hintId = `${fieldId}-hint`;
    const errorId = `${fieldId}-error`;
    const describedBy = error ? errorId : hint ? hintId : undefined;

    const fieldClasses = cn(
      "w-full border-0 border-b bg-transparent py-3 text-base outline-none focus:border-b-2",
      error ? "border-b-danger" : "border-ink"
    );

    let control: ReactNode;

    if (rest.as === "textarea") {
      const {as: _tag, ...textareaProps} = rest;
      void _tag;
      control = (
        <textarea
          id={fieldId}
          ref={ref as Ref<HTMLTextAreaElement>}
          className={fieldClasses}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...textareaProps}
        />
      );
    } else if (rest.as === "select") {
      const {as: _tag, options, placeholder, ...selectProps} = rest;
      void _tag;
      control = (
        <select
          id={fieldId}
          ref={ref as Ref<HTMLSelectElement>}
          className={fieldClasses}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...selectProps}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else {
      const {as: _tag, ...inputProps} = rest;
      void _tag;
      control = (
        <input
          id={fieldId}
          ref={ref as Ref<HTMLInputElement>}
          className={fieldClasses}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
      );
    }

    return (
      <div className={wrapperClassName}>
        <label htmlFor={fieldId} className="mb-2 block text-xs uppercase tracking-label text-muted">
          {label}
        </label>
        {control}
        {error ? (
          <p id={errorId} className="mt-1 text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1 text-xs text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
