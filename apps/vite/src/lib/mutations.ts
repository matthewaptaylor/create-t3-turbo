import { useMutation } from "@tanstack/react-query";
import {
  sendPasswordResetEmail,
  signIn,
  signUp,
  submitNewPassword,
} from "supertokens-web-js/recipe/emailpassword";
import Session from "supertokens-web-js/recipe/session";

export enum Mutations {
  SIGN_OUT,
  EMAIL_PASSWORD_SIGN_IN,
  EMAIL_PASSWORD_CREATE_ACCOUNT,
  EMAIL_PASSWORD_PASSWORD_RESET,
  EMAIL_PASSWORD_NEW_PASSWORD,
}

interface UseEmailPasswordSignInMutationVariables {
  email: string;
  password: string;
}

/**
 * Mutation hook to sign out.
 * @returns
 */
export const useSignOutMutation = () =>
  useMutation({
    mutationKey: [Mutations.SIGN_OUT],
    mutationFn: () => Session.signOut(),
  });

/**
 * Mutation hook to sign in with email and password.
 * @returns
 */
export const useEmailPasswordSignInMutation = () =>
  useMutation({
    mutationKey: [Mutations.EMAIL_PASSWORD_SIGN_IN],
    mutationFn: ({
      email,
      password,
    }: UseEmailPasswordSignInMutationVariables) =>
      signIn({
        formFields: [
          {
            id: "email",
            value: email,
          },
          {
            id: "password",
            value: password,
          },
        ],
      }),
  });

interface UseEmailPasswordCreateAccountMutationVariables {
  email: string;
  password: string;
}

/**
 * Mutation hook to create an account with email and password.
 * @returns
 */
export const useEmailPasswordCreateAccountMutation = () =>
  useMutation({
    mutationKey: [Mutations.EMAIL_PASSWORD_CREATE_ACCOUNT],
    mutationFn: ({
      email,
      password,
    }: UseEmailPasswordCreateAccountMutationVariables) =>
      signUp({
        formFields: [
          {
            id: "email",
            value: email,
          },
          {
            id: "password",
            value: password,
          },
        ],
      }),
  });

interface UseEmailPasswordSendResetEmailMutationVariables {
  email: string;
}

/**
 * Mutation hook to send a password reset email.
 * @returns
 */
export const useEmailPasswordSendResetEmailMutation = () => {
  return useMutation({
    mutationKey: [Mutations.EMAIL_PASSWORD_PASSWORD_RESET],
    mutationFn: ({ email }: UseEmailPasswordSendResetEmailMutationVariables) =>
      sendPasswordResetEmail({
        formFields: [
          {
            id: "email",
            value: email,
          },
        ],
      }),
  });
};

interface UseEmailPasswordNewPasswordMutationVariables {
  password: string;
}

/**
 * Mutation hook to submit a new password.
 * @returns
 */
export const useEmailPasswordNewPasswordMutation = () => {
  return useMutation({
    mutationKey: [Mutations.EMAIL_PASSWORD_NEW_PASSWORD],
    mutationFn: ({ password }: UseEmailPasswordNewPasswordMutationVariables) =>
      submitNewPassword({
        formFields: [
          {
            id: "password",
            value: password,
          },
        ],
      }),
  });
};
