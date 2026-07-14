# SAP Integration SDK

TypeScript SDK for building SAP Cloud Integration (CPI) iFlows programmatically.

## Overview

This SDK allows you to create SAP Cloud Integration iFlows using TypeScript code instead of the graphical designer. It generates valid BPMN 2.0 XML with SAP-specific extensions that can be imported into Integration Suite.

## Project Status

🚧 **Work in Progress** - This is an early-stage project currently under active development.

## Goal

Enable developers to write code like this:

```typescript
const flow = new IFlow("SalesOrderSync");
flow.addHttpsSender("/orders");
flow.addContentModifier({ headers: { CurrentDate: "${date:now:yyyy-MM-dd}" } });
flow.addDataStoreWrite({ store: "OrdersStore" });
flow.export("SalesOrderSync.zip");
```

And automatically generate a valid CPI iFlow package that can be imported into SAP Integration Suite.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Architecture

- **Model Layer** - Object model representing iFlow components (IFlow, Participant, Process, etc.)
- **Generator Layer** - Converts model objects to BPMN 2.0 XML
- **Parser Layer** - Parses existing iFlow artifacts back to model objects
- **Utils Layer** - Helper functions and utilities

## License

MIT
