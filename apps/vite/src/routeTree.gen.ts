/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as AuthLayoutImport } from './routes/_auth-layout'
import { Route as AuthLayoutAuthSignOutImport } from './routes/_auth-layout/auth/sign-out'
import { Route as AuthLayoutAuthSignInImport } from './routes/_auth-layout/auth/sign-in'
import { Route as AuthLayoutAuthResetPasswordImport } from './routes/_auth-layout/auth/reset-password'
import { Route as AuthLayoutAuthForgotPasswordImport } from './routes/_auth-layout/auth/forgot-password'
import { Route as AuthLayoutAuthCreateAccountImport } from './routes/_auth-layout/auth/create-account'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const AuthLayoutRoute = AuthLayoutImport.update({
  id: '/_auth-layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AuthLayoutAuthSignOutRoute = AuthLayoutAuthSignOutImport.update({
  path: '/auth/sign-out',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutAuthSignInRoute = AuthLayoutAuthSignInImport.update({
  path: '/auth/sign-in',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutAuthResetPasswordRoute =
  AuthLayoutAuthResetPasswordImport.update({
    path: '/auth/reset-password',
    getParentRoute: () => AuthLayoutRoute,
  } as any)

const AuthLayoutAuthForgotPasswordRoute =
  AuthLayoutAuthForgotPasswordImport.update({
    path: '/auth/forgot-password',
    getParentRoute: () => AuthLayoutRoute,
  } as any)

const AuthLayoutAuthCreateAccountRoute =
  AuthLayoutAuthCreateAccountImport.update({
    path: '/auth/create-account',
    getParentRoute: () => AuthLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/_auth-layout': {
      preLoaderRoute: typeof AuthLayoutImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/_auth-layout/auth/create-account': {
      preLoaderRoute: typeof AuthLayoutAuthCreateAccountImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth-layout/auth/forgot-password': {
      preLoaderRoute: typeof AuthLayoutAuthForgotPasswordImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth-layout/auth/reset-password': {
      preLoaderRoute: typeof AuthLayoutAuthResetPasswordImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth-layout/auth/sign-in': {
      preLoaderRoute: typeof AuthLayoutAuthSignInImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth-layout/auth/sign-out': {
      preLoaderRoute: typeof AuthLayoutAuthSignOutImport
      parentRoute: typeof AuthLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  AuthLayoutRoute.addChildren([
    AuthLayoutAuthCreateAccountRoute,
    AuthLayoutAuthForgotPasswordRoute,
    AuthLayoutAuthResetPasswordRoute,
    AuthLayoutAuthSignInRoute,
    AuthLayoutAuthSignOutRoute,
  ]),
  DashboardRoute,
])

/* prettier-ignore-end */
