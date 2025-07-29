import type {
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormProps,
} from "react-hook-form";
import type { ZodType, ZodTypeDef } from "zod";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import {
  useForm as __useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import React from "react";
import type { FlexProps, TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

const useForm = <
  TOut extends FieldValues,
  TDef extends ZodTypeDef,
  TIn extends FieldValues,
>(
  props: Omit<UseFormProps<TIn, unknown, TOut>, "resolver"> & {
    schema: ZodType<TOut, TDef, TIn>;
  }
) => {
  const form = __useForm({
    ...props,
    resolver: standardSchemaResolver(props.schema, undefined),
  });

  return form;
};

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  React.HTMLAttributes<HTMLDivElement>,
  FlexProps
>(({ sx, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <Flex
        ref={ref}
        sx={{
          flexDir: "column",
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
          ...sx,
        }}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.HTMLAttributes<HTMLSpanElement>,
  TextProps
>(({ sx, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Text
      ref={ref}
      sx={{ ...(error ? { textColor: "red" } : {}), ...sx }}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.HTMLAttributes<HTMLDivElement>,
  FlexProps
>(({ sx, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Flex
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
      sx={{ flexDir: "column", ...sx }}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ sx, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
      <Text
        ref={ref}
        id={formDescriptionId}
        sx={{ fontSize: "0.8rem", textColor: "215.4 16.3% 46.9%", ...sx }}
        {...props}
      />
    );
  }
);
FormDescription.displayName = "FormDescription";

const FormFieldMessage = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ sx, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error.message) : children;

    if (!body) {
      return null;
    }

    return (
      <Text
        ref={ref}
        id={formMessageId}
        sx={{ fontSize: "0.8rem", fontWeight: 500, textColor: "red", ...sx }}
        {...props}
      >
        {body}
      </Text>
    );
  }
);
FormFieldMessage.displayName = "FormFieldMessage";

const FormMessage = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ sx, children, ...props }, ref) => {
    const { formState } = useFormContext();
    const error = formState.errors.root;
    const body = error ? String(error.message) : children;

    if (!body) {
      return null;
    }
    return (
      <Text
        ref={ref}
        sx={{ fontSize: "0.8rem", fontWeight: 500, textColor: "red", ...sx }}
        {...props}
      >
        {body}
      </Text>
    );
  }
);
FormMessage.displayName = "FormMessage";

export {
  useForm,
  useFormField,
  FormProvider,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormFieldMessage,
  FormField,
};

export { useFieldArray } from "react-hook-form";
export type { SubmitHandler } from "react-hook-form";
