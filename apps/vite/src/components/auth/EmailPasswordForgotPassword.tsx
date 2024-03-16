import type { FC } from "react";
import {
  faArrowsRotate,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { useTranslation } from "@acme/client-translations";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input, InputError } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEmailPasswordSendResetEmailMutation } from "~/lib/mutations";

export const EmailPasswordForgotPassword: FC = () => {
  const { t } = useTranslation();

  const mutation = useEmailPasswordSendResetEmailMutation();

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value: { email } }) => {
      mutation.mutate(
        {
          email,
        },
        {
          onSuccess: (data) => {
            if (data.status === "OK") form.reset();
          },
        },
      );
    },
  });

  const mutationError =
    mutation.isError || mutation.data?.status === "FIELD_ERROR"
      ? t("An error occurred. Please try again later.") // Field validation should be handled by the form
      : null;

  const notAllowedError =
    mutation.data?.status === "PASSWORD_RESET_NOT_ALLOWED"
      ? t(
          "You cannot reset your password for this account. Try signing in with a different method.",
        )
      : null;

  const error = mutationError ?? notAllowedError;

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

        {mutation.data?.status === "OK" && (
          <Alert variant="default">
            <FontAwesomeIcon icon={faCheck} />

            <AlertTitle>{t("Success!")}</AlertTitle>
            <AlertDescription>
              {t("A password reset email has been sent to {{email}}.", {
                email: mutation.variables?.email,
              })}
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

          {t("Send password reset email")}
        </Button>
      </form>
    </form.Provider>
  );
};
