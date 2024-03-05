import type { FC } from "react";
import {
  faArrowsRotate,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { useTranslation } from "@acme/translations";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input, InputError } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEmailPasswordSignInMutation } from "~/lib/mutations";
import { router } from "~/lib/router";

export interface EmailPasswordSignInProps {
  /**
   * The URL to redirect to after a successful sign in.
   */
  redirect?: string;
}

/**
 * A form to sign in with an email and password.
 * @param props
 * @returns
 */
export const EmailPasswordSignIn: FC<EmailPasswordSignInProps> = ({
  redirect,
}) => {
  const { t } = useTranslation();

  const mutation = useEmailPasswordSignInMutation();
  const navigate = useNavigate();

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value: { email, password } }) => {
      mutation.mutate(
        {
          email,
          password,
        },
        {
          onSuccess: (data) => {
            // Navigate to the dashboard if the sign in was successful
            if (data.status === "OK")
              redirect
                ? router.history.push(redirect)
                : void navigate({ to: "/dashboard" });
          },
        },
      );
    },
  });

  const mutationError =
    mutation.isError || mutation.data?.status === "FIELD_ERROR" // Field validation should be handled by the form
      ? t("An error occurred. Please try again later.")
      : null;

  const credentialsError =
    mutation.data?.status === "WRONG_CREDENTIALS_ERROR" ||
    mutation.data?.status === "SIGN_IN_NOT_ALLOWED" // Sign in not allowed should be handled by the forgot password flow
      ? t("Incorrect email or password")
      : null;

  const error = mutationError ?? credentialsError;

  return (
    <form.Provider>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onSubmit: z.string().email(t("Invalid email address")),
          }}
          children={(field) => (
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">{t("Email")}</Label>

              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                id="email"
                placeholder="john@example.com"
                type="email"
                autoComplete="email"
                aria-invalid={field.state.meta.errors.length > 0}
                aria-required
                aria-describedby="email-error"
              />

              <InputError id="email-error" aria-live="assertive">
                {field.state.meta.errors[0]}
              </InputError>
            </div>
          )}
        />

        <form.Field
          name="password"
          validators={{
            onSubmit: z.string().min(1, t("This is required")),
          }}
          children={(field) => (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("Password")}</Label>
                <Link className="text-sm underline" to="/auth/forgot-password">
                  {t("Forgot your password?")}
                </Link>
              </div>

              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={field.state.meta.errors.length > 0}
                aria-required
                aria-describedby="password-error"
              />

              <InputError id="password-error" aria-live="assertive">
                {field.state.meta.errors[0]}
              </InputError>
            </div>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <FontAwesomeIcon icon={faExclamationTriangle} />

            <AlertTitle>{t("Oops!")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full">
          {mutation.isPending && (
            <FontAwesomeIcon
              icon={faArrowsRotate}
              role="status"
              aria-label={t("Loading...")}
              className="me-2 animate-spin"
            />
          )}

          {t("Sign in")}
        </Button>
      </form>
    </form.Provider>
  );
};
