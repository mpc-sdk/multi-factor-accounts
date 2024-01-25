import React from "react";
import Icons from "@/components/Icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function ServerUrlForm({
  back,
  onNext,
  submit,
  initialValue,
  className,
  showLabel,
}: {
  back?: React.ReactNode;
  onNext: (name: string) => void;
  submit?: React.ReactNode;
  initialValue?: string;
  className?: string;
  showLabel?: boolean;
}) {
  const FormSchema = z.object({
    url: z.string({
      required_error: "You need enter a URL for the server.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: initialValue ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onNext(data.url);
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                {showLabel && <FormLabel>Key name</FormLabel>}
                <FormControl>
                  <Input required placeholder="Server URL" {...field} />
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
