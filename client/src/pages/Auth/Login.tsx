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
import { login } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/schemas/authSchema";
import { useAuthStore } from "@/lib/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { fetchUser } = useAuthStore();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function onLogin(values: z.infer<typeof loginSchema>) {
    const { success, data, errorMessage, errors } = await login(values);

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

  return (
    <>
      <Card>
        <CardHeader>
          <Logo className="h-14 mb-6" />
          <CardTitle className="text-xl">Login to your account.</CardTitle>
          <CardDescription>
            Welcome back👋! Log in to continue your conversations and stay
            connected with your friends and communities on Ping.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLogin)}>
            <CardContent className="space-y-2">
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
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          type={isPasswordVisible ? "text" : "password"}
                          isError={fieldState.invalid}
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

              <Button
                asChild
                variant="link"
                type="button"
                disabled={form.formState.isSubmitting}
              >
                <Link to="/forgot-password">Forgot Password?</Link>
              </Button>
            </CardContent>
            <CardFooter className="flex-col gap-1">
              <Button className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Loggin in..." : "Login"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't have an account?
                <Button type="button" variant="link" className="ml-1" asChild>
                  <Link to="/signup">Signup</Link>
                </Button>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default Login;
