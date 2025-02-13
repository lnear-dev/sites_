---
title: '@lnear/router'
description: 'This repository contains a TypeScript-based router library designed for single-page applications (SPAs). It is built with `lit-html` for template rendering...'
sidebar:
    label: router
---
This repository contains a TypeScript-based router library designed for single-page applications (SPAs). It is built with `lit-html` for template rendering and supports route management with plugins and dynamic path resolution.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
   - [Configuration](#configuration)
   - [Adding Routes](#adding-routes)
   - [Navigation](#navigation)
4. [API Reference](#api-reference)
   - [resolveRouterPath](#resolverouterpath)
   - [Config](#config)
   - [Router](#router)
   - [RouteDefinition](#routedefinition)
   - [RouteEvent](#routeevent)
5. [Contributing](#contributing)
6. [License](#license)

## Features

- **Dynamic Path Resolution**: Resolve paths with the base URL specified at build time.
- **Route Management**: Define and manage routes with dynamic parameters and query strings.
- **Plugin System**: Enhance routing capabilities with plugins.
- **Event Handling**: Listen to route changes with custom events.
- **Fallback Routes**: Specify fallback routes for unmatched paths.

## Installation

To install the router library, you need to have a package manager like npm or yarn:

```sh
npm install @lnear/router
# or
yarn add @lnear/router
```

## Usage

### Configuration

First, you need to create a configuration object for the router. This configuration includes your route definitions and any optional plugins or fallback routes.

```typescript
import { Router, Config } from "@lnear/router";
import { html } from "lit-html";
const router = new Router({
  routes: [
    {
      path: "/",
      title: "Home",
      render: (context) => html`<h1>Home</h1>`,
    },
    {
      path: "/about",
      title: "About",
      render: (context) => html`<h1>About</h1>`,
    },
  ],
  fallback: "/404",
});
```

### Adding Routes

You can dynamically add routes to the router after initialization.

```typescript
router.addRoute({
  path: "/contact",
  title: "Contact",
  render: (context) => html`<h1>Contact</h1>`,
});
```

### Navigation

To navigate programmatically, use the `navigate` method.

```typescript
router.navigate("/about");
```

## API Reference

### resolveRouterPath

This function resolves a given path with the base URL specified at build time.

```typescript
import { resolveRouterPath } from "@lnear/router";

const fullPath = resolveRouterPath("/my-path");
```

### Config

The configuration object for the router.

```typescript
export interface Config {
  fallback?: string;
  plugins?: RouterPluginInterface[];
  routes: RouteDefinition[];
}
```

### Router

The main class for managing routes and navigation.

```typescript
class Router extends EventTarget {
  constructor(config: Config);
  addRoute(route: RouteDefinition): void;
  navigate(
    url: URL | string,
    options?: { backNav?: boolean; replace?: boolean }
  ): Promise<void>;
  render(): TemplateResult<1>;
  uninstall(): void;
}
```

### RouteDefinition

Defines a route in the router.

```typescript
export interface RouteDefinition {
  path: string;
  title: string | ((context: Partial<Context>) => string);
  render(context: Context): TemplateResult<1>;
  plugins?: RouterPluginInterface[];
}
```

### RouteEvent

An event that is dispatched when the route changes.

```typescript
class RouteEvent extends Event {
  constructor(context: Context);
}
```

## Contributing

We welcome contributions to improve the router library. To contribute, please fork the repository, create a new branch, and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

This `README` provides an overview of the router library, its features, and usage instructions. For more detailed documentation and examples, please refer to the source code and comments within the codebase.