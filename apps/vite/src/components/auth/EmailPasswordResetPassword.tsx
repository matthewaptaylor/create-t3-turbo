import type { FC } from "react";
import {
  faArrowsRotate,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { useTranslation } from "@acme/translations";
import { validatePassword } from "@acme/validators";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input, InputError } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEmailPasswordNewPasswordMutation } from "~/lib/mutations";

export interface EmailPasswordResetPasswordProps {
  /**
   * The URL to redirect to after a successful sign in.
   */
  redirect?: string;
}

/**
 * A form to create an account with an email and password.
 * @param props
 * @returns
 */
export const EmailPasswordResetPassword: FC<
  EmailPasswordResetPasswordProps
> = ({ redirect }) => {
  const { t } = useTranslation();

  const mutation = useEmailPasswordNewPasswordMutation();

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value: { password } }) => {
      mutation.mutate(
        {
          password,
        },
        {
          onSuccess: (data) => {
            // Navigate to the dashboard if the account was created successfully
            if (data.status === "OK") form.reset();
          },
        },
      );
    },
  });

  const mutationError =
    mutation.isError || mutation.data?.status === "FIELD_ERROR"
      ? t("An error occurred. Please try again later.") // Password validation should be handled by the form
      : null;

  const invalidTokenError =
    mutation.data?.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR" ? (
      <>
        {t("Your password reset link has expired.")}{" "}
        <Link to="/auth/forgot-password" className="underline">
          {t("Send another email.")}
        </Link>
      </>
    ) : null;

  const error = mutationError ?? invalidTokenError;

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
          name="password"
          validators={{
            onSubmit: validatePassword,
          }}
          children={(field) => (
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">{t("Password")}</Label>

              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                id="password"
                type="password"
                autoComplete="new-password"
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

        <form.Field
          name="confirmPassword"
          validators={{
            onSubmit: ({ value, fieldApi }) =>
              value === fieldApi.form.getFieldValue("password")
                ? undefined
                : t("Passwords do not match"),
          }}
          children={(field) => (
            <div className="flex flex-col space-y-2">
              <Label htmlFor="confirm-password">{t("Confirm password")}</Label>

              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={field.state.meta.errors.length > 0}
                aria-required
                aria-describedby="confirm-password-error"
              />

              <InputError id="confirm-password-error" aria-live="assertive">
                {field.state.meta.errors[0]}
              </InputError>
            </div>
          )}
        />

        {mutation.data?.status === "OK" && (
          <Alert variant="default">
            <FontAwesomeIcon icon={faCheck} />

            <AlertTitle>{t("Success!")}</AlertTitle>
            <AlertDescription>
              {t("Your password has been reset.")}{" "}
              <Link to="/auth/sign-in">
                {t("You can now sign in with your new password.")}
              </Link>
            </AlertDescription>
          </Alert>
        )}

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

          {t("Reset password")}
        </Button>
      </form>
    </form.Provider>
  );
};
