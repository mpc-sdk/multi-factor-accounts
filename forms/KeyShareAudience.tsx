import React from "react";

import Icons from "@/components/Icons";
import { KeyShareAudience } from "@/app/model";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function KeyShareAudienceForm({
  back,
  onNext,
}: {
  back?: React.ReactNode;
  onNext: (audience: KeyShareAudience) => void;
}) {
  const FormSchema = z.object({
    type: z.enum(["self", "shared"], {
      required_error: "You need to select the audience for this key.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "self",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onNext(data.type as KeyShareAudience);
  }

  return (
    <div className="mt-12">
      <Alert>
        <Icons.key className="h-4 w-4" />
        <AlertTitle>Who is this key for?</AlertTitle>
        <AlertDescription>
          To help us prepare your key please tell us who the key is for.
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Choose the audience for this key</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={KeyShareAudience.self} />
                      </FormControl>
                      <FormLabel className="font-normal">Just for me</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="shared" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Shared with other people
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
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
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
