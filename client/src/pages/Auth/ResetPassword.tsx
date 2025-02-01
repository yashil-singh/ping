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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { resetPassword } from "@/hooks/useAuth";
import { resetPasswordSchema } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      token: token,
    },
  });

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  async function onChangePassword(values: z.infer<typeof resetPasswordSchema>) {
    const { success, data, errorMessage, errors } = await resetPassword(values);

    if (success) {
      toast({ description: data.message });
      navigate("/login");
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
  return (
    <Card>
      <CardHeader>
        <Logo className="h-14 mb-6" />

        <CardTitle className="text-xl">Change Password</CardTitle>
        <CardDescription>
          Set a new password for your account. Make sure to choose a strong and
          secure password. 🔒
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onChangePassword)}>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your new password"
                        type={isNewPasswordVisible ? "text" : "password"}
                        isError={fieldState.invalid}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                        className="absolute right-2 top-2"
                      >
                        {isNewPasswordVisible ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Confrim Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Re-enter your password"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        isError={fieldState.invalid}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setIsConfirmPasswordVisible((prev) => !prev)
                        }
                        className="absolute right-2 top-2"
                      >
                        {isConfirmPasswordVisible ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? "Resetting" : "Reset"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ResetPassword;
