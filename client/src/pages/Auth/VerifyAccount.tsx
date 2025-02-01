import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { resendVerificationCode, verifyAccount } from "@/hooks/useAuth";
import { verifyAccountSchema } from "@/lib/schemas/authSchema";
import { useAuthStore } from "@/lib/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const VerifyAccount = () => {
  const { fetchUser, logout } = useAuthStore();

  const form = useForm<z.infer<typeof verifyAccountSchema>>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      token: "",
    },
  });

  const [isResending, setIsResending] = useState(false);

  async function onVerifyAccount(values: z.infer<typeof verifyAccountSchema>) {
    const { success, data, errorMessage, errors } = await verifyAccount(values);

    if (success) {
      toast({ description: data.message });
      fetchUser();
    } else {
      if (errors) {
        errors.map((error) => {
          toast({
            description: error,
            variant: "destructive",
          });
        });
      } else {
        toast({
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  }

  async function onResendVerificationCode() {
    setIsResending(true);

    const { success, data, errorMessage, errors } =
      await resendVerificationCode();

    if (success) {
      toast({ description: data.message });
    } else {
      if (errors) {
        errors.map((error) => {
          toast({
            description: error,
            variant: "destructive",
          });
        });
      } else {
        toast({
          description: errorMessage,
          variant: "destructive",
        });
      }
    }

    setIsResending(false);
  }

  return (
    <Card>
      <CardHeader>
        <Logo className="h-14 mb-6" />

        <CardTitle className="text-xl">Verify your account</CardTitle>
        <CardDescription>
          Enter the verification code sent to your email to activate your
          account. If you haven’t received the code, you can request a new one.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onVerifyAccount)}>
          <CardContent>
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="w-full">
                        <InputOTPSlot
                          className="w-full h-16 text-lg"
                          index={0}
                        />
                        <InputOTPSlot
                          className="w-full h-16 text-lg"
                          index={1}
                        />
                        <InputOTPSlot
                          className="w-full h-16 text-lg"
                          index={2}
                        />
                        <InputOTPSlot
                          className="w-full h-16 text-lg"
                          index={3}
                        />
                        <InputOTPSlot
                          className="w-full h-16 text-lg"
                          index={4}
                        />
                        <InputOTPSlot
                          className="w-full h-16 text-lg"
                          index={5}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-center">
                    Enter the 6-digit verification code sent to your email.
                  </FormDescription>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <div className="flex justify-end mt-2">
              <Button
                type="button"
                variant="link"
                disabled={form.formState.isSubmitting || isResending}
                onClick={onResendVerificationCode}
              >
                {isResending ? "Resending Code" : "Resend Code"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting || isResending}
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={logout}
              disabled={form.formState.isSubmitting || isResending}
            >
              Logout
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default VerifyAccount;
