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
  serverInfo,
}: {
  back?: React.ReactNode;
  onNext: (name: string) => void;
  submit?: React.ReactNode;
  initialValue?: string;
  className?: string;
  serverInfo?: { serverPublicKey: string };
}) {
  const FormSchema = z.object({
    url: z.string({
      required_error: "You need to enter a URL for the server.",
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

  const disabled = serverInfo !== null;
  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    required
                    disabled={disabled}
                    placeholder="Server URL"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {serverInfo && (
            <div className="flex flex-col rounded-md border p-4 space-y-2">
              <div>Public key</div>
              <div className="text-sm">
                Only save this server if you trust the public key shown below.
              </div>
              <div className="font-mono text-xs">
                {serverInfo.serverPublicKey}
              </div>
            </div>
          )}
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
