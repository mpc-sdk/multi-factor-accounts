import React from "react";

import Icons from "@/components/Icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function KeyShareNumberForm({
  message,
  label,
  min,
  max,
  defaultValue,
  back,
  onNext,
}: {
  message: React.ReactNode;
  label: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  back?: React.ReactNode;
  onNext: (num: number) => void;
}) {
  const minValue = min ?? 2;
  const maxValue = max ?? 16;
  const defaultAmount = defaultValue ?? 2;

  const FormSchema = z.object({
    amount: z.coerce
      .number({
        required_error: "You need to choose the number of key shares.",
      })
      .min(minValue)
      .max(maxValue),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: defaultAmount,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onNext(data.amount);
  }

  return (
    <div className="mt-12">
      {message}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-4">
                    <Input
                      pattern="[0-9]+"
                      min={minValue}
                      max={maxValue}
                      required
                      type="number"
                      {...field}
                    />
                    <Slider
                      defaultValue={[defaultAmount]}
                      value={[field.value]}
                      min={minValue}
                      max={maxValue}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className={`flex ${back == null ? 'justify-end' : 'justify-between'}`}>
            {back}
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
