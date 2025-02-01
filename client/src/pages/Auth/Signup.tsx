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
import { signup } from "@/hooks/useAuth";
import { signupSchema } from "@/lib/schemas/authSchema";
import { useAuthStore } from "@/lib/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const Signup = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { fetchUser } = useAuthStore();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  async function onSignup(values: z.infer<typeof signupSchema>) {
    const { data, success, errors, errorMessage } = await signup(values);

    if (success) {
      toast({
        description: data.message,
      });

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

  return (
    <>
      <Card>
        <CardHeader>
          <Logo className="h-14 mb-6" />
          <CardTitle className="text-xl">Create your account.</CardTitle>
          <CardDescription>
            Join Ping to connect instantly with friends and communities. Create
            your account to start chatting, sharing, and staying in
            touch—anytime, anywhere! 🚀
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSignup)}>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        isError={fieldState.invalid}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        isError={fieldState.invalid}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        isError={fieldState.invalid}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          isError={fieldState.invalid}
                          type={isPasswordVisible ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setIsPasswordVisible((prev) => !prev)}
                          className="absolute right-2 top-2"
                        >
                          {isPasswordVisible ? (
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Re-enter your password"
                          isError={fieldState.invalid}
                          type={isConfirmPasswordVisible ? "text" : "password"}
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
            <CardFooter className="flex-col gap-1">
              <Button className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing up" : "Signup"}
              </Button>
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Button type="button" variant="link" className="ml-1" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default Signup;
