import type { FC } from "react";
import {
  faArrowsRotate,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { doesEmailExist } from "supertokens-web-js/recipe/thirdpartyemailpassword";
import { z } from "zod";

import { useTranslation } from "@acme/translations";
import { validatePassword } from "@acme/validators";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input, InputError } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEmailPasswordCreateAccountMutation } from "~/lib/mutations";
import { router } from "~/lib/router";

export interface EmailPasswordCreateAccountProps {
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
export const EmailPasswordCreateAccount: FC<
  EmailPasswordCreateAccountProps
> = ({ redirect }) => {
  const { t } = useTranslation();

  const mutation = useEmailPasswordCreateAccountMutation();
  const navigate = useNavigate();

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value: { email, password } }) => {
      mutation.mutate(
        {
          email,
          password,
        },
        {
          onSuccess: (data) => {
            // Navigate to the dashboard if the account was created successfully
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
    mutation.isError ||
    (mutation.data?.status === "FIELD_ERROR" &&
      mutation.data.formFields.some((f) => f.id === "password"))
      ? t("An error occurred. Please try again later.") // Password validation should be handled by the form
      : null;

  const accountExistsError =
    mutation.data?.status === "SIGN_UP_NOT_ALLOWED" ||
    (mutation.data?.status === "FIELD_ERROR" &&
      mutation.data.formFields.some((f) => f.id === "email"))
      ? t("An account already exists with this email address.")
      : null;

  const error = mutationError ?? accountExistsError;

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
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) =>
              doesEmailExist({
                email: value,
              })
                .then((res) =>
                  res.doesExist
                    ? undefined
                    : t("An account already exists with this email address."),
                )
                .catch(() => undefined),
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

          {t("Create account")}
        </Button>
      </form>
    </form.Provider>
  );
};
