import React from "react";

import Icons from "@/components/Icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function NameAlert() {
  return (
    <Alert>
      <Icons.key className="h-4 w-4" />
      <AlertTitle>Give the key a name</AlertTitle>
      <AlertDescription>
        The key name helps you easily recognize the key and it&apos;s purpose.
      </AlertDescription>
    </Alert>
  );
}

export default function KeyShareNameForm({
  back,
  onNext,
  nameAlert,
  submit,
  initialValue,
  className,
  showLabel,
}: {
  back?: React.ReactNode;
  onNext: (name: string) => void;
  nameAlert?: React.ReactNode;
  submit?: React.ReactNode;
  initialValue?: string;
  className?: string;
  showLabel?: boolean;
}) {
  const FormSchema = z.object({
    keyName: z.string({
      required_error: "You need enter a name for the key.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      keyName: initialValue ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onNext(data.keyName);
  }

  return (
    <div className={className}>
      {nameAlert}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <FormField
            control={form.control}
            name="keyName"
            render={({ field }) => (
              <FormItem>
                {showLabel && <FormLabel>Key name</FormLabel>}
                <FormControl>
                  <Input required placeholder="Key name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className={`flex ${
              back == null ? "justify-end" : "justify-between"
            }`}
          >
            {back}
            {submit}
          </div>
        </form>
      </Form>
    </div>
  );
}
