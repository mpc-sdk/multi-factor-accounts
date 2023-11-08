import { ToasterToast } from "@/components/ui/use-toast";

export default async function guard<T>(
  action: () => Promise<T>,
  toast: (val: ToasterToast) => void,
) {
  try {
    return await action();
  } catch (e) {
    console.error(e);
    toast({
      variant: "destructive",
      title: "Error",
      description: e.message || e.toString(),
    });
  }
}
