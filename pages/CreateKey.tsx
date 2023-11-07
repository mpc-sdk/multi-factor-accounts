import React, { useState } from "react";
import Heading from "@/components/Heading";
import Icons from "@/components/Icons";

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

enum KeyShareAudience {
  self = "self",
  shared = "shared",
}

type CreateKeyState = {
  audience: KeyShareAudience;
};

function CreateKeyHeading() {
  return <Heading>Create Key</Heading>;
}

function CreateKeyContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CreateKeyHeading />
      {children}
    </>
  );
}

function ForWhomForm({
  onNext,
}: {
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
                        <RadioGroupItem value="self" />
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
          <Button type="submit">Next</Button>
        </form>
      </Form>
    </div>
  );
}

export default function CreateKey() {
  const [step, setStep] = useState(0);
  const [createKeyState, setCreateKeyState] = useState<CreateKeyState>(null);

  const onKeyAudience = (audience: KeyShareAudience) => {
    setCreateKeyState({ audience });
    setStep(step + 1);
  };

  if (step == 0) {
    return (
      <CreateKeyContent>
        <ForWhomForm onNext={onKeyAudience} />
      </CreateKeyContent>
    );
  } else if (step == 1) {
    return <p>Get parameters {createKeyState.audience}</p>;
  }

  return null;
}
