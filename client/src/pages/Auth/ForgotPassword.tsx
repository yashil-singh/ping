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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onForgotPassword(
    values: z.infer<typeof forgotPasswordSchema>
  ) {
    console.log("🚀 ~ values:", values);
  }

  return (
    <Card>
      <CardHeader>
        <Logo className="h-14 mb-6" />

        <CardTitle className="text-xl">Forgot Password</CardTitle>
        <CardDescription>
          Forgot your password? No worries! Enter your email below, and we’ll
          send you a link to reset it. 🎯
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onForgotPassword)}>
          <CardContent>
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
                  <FormDescription>
                    This is the email the reset link will be sent to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full">Continue</Button>
            <p className="text-muted-foreground text-sm">
              Go back to{" "}
              <Button type="button" variant="link" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ForgotPassword;
