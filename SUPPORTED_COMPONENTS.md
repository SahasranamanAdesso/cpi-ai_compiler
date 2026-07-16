# Supported Components

**SAP Integration SDK Component Library**

This document provides detailed documentation for all supported SAP Cloud Integration components in Version 1.0.

---

## Overview

Version 1.0 supports **3 core components** that enable basic Integration Flow development:

| Component | Type | BPMN Element | Version | Status |
|-----------|------|--------------|---------|--------|
| HTTPS Sender | Adapter | Participant + MessageFlow | 1.5 | ✅ Stable |
| HTTP Receiver | Adapter | Participant + MessageFlow | 1.20 | ✅ Stable |
| Content Modifier | Enricher | CallActivity | 1.6 | ✅ Stable |

---

## HTTPS Sender

### Purpose

Receives HTTP/HTTPS requests from external systems. This is the entry point for Integration Flows triggered by HTTP calls.

### Generated BPMN Element

```xml
<bpmn2:participant id="Participant_1" ifl:type="EndpointSender" name="Sender">
  <bpmn2:extensionElements>
    <ifl:property>
      <key>ifl:type</key>
      <value>EndpointSender</value>
    </ifl:property>
  </bpmn2:extensionElements>
</bpmn2:participant>

<bpmn2:messageFlow id="MessageFlow_4" name="HTTPS" 
                   sourceRef="Participant_1" 
                   targetRef="StartEvent_2">
  <bpmn2:extensionElements>
    <ifl:property><key>ComponentType</key><value>HTTPS</value></ifl:property>
    <ifl:property><key>urlPath</key><value>/hello</value></ifl:property>
    <ifl:property><key>componentVersion</key><value>1.5</value></ifl:property>
    <!-- Additional HTTPS adapter properties -->
  </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

### Current Capabilities

✅ **Endpoint Configuration**
- URL path: `/hello` (hardcoded in v1.0)
- Transport protocol: HTTPS
- Message protocol: None

✅ **Authentication**
- Role-based authentication
- User role: `ESBMessaging.send`

✅ **Security**
- XSRF protection enabled
- Maximum body size: 40 MB

### Current Limitations

❌ URL path is hardcoded (cannot be configured)  
❌ No custom authentication configuration  
❌ No custom headers configuration  
❌ No rate limiting  

### Example Usage

```typescript
// HTTPS Sender is automatically added by BpmnProcessMapper
const flow = new IFlow("MyFlow");
// Sender participant with HTTPS adapter is created automatically
```

### SAP Configuration

When opened in SAP Integration Suite graphical editor:

**Adapter Type:** HTTPS  
**Address:** `/hello`  
**Authorization:** User Role (`ESBMessaging.send`)  
**CSRF Protected:** Yes  

---

## HTTP Receiver

### Purpose

Sends HTTP/HTTPS requests to external systems. This is the exit point for Integration Flows that call external APIs.

### Generated BPMN Element

```xml
<bpmn2:participant id="Participant_2" ifl:type="EndpointRecevier" name="Receiver">
  <bpmn2:extensionElements>
    <ifl:property>
      <key>ifl:type</key>
      <value>EndpointRecevier</value>
    </ifl:property>
  </bpmn2:extensionElements>
</bpmn2:participant>

<bpmn2:messageFlow id="MessageFlow_5" name="HTTP" 
                   sourceRef="EndEvent_2" 
                   targetRef="Participant_2">
  <bpmn2:extensionElements>
    <ifl:property><key>ComponentType</key><value>HTTP</value></ifl:property>
    <ifl:property><key>httpMethod</key><value>POST</value></ifl:property>
    <ifl:property><key>authenticationMethod</key><value>Client Certificate</value></ifl:property>
    <ifl:property><key>componentVersion</key><value>1.20</value></ifl:property>
    <!-- Additional HTTP adapter properties -->
  </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

### Current Capabilities

✅ **HTTP Configuration**
- HTTP method: POST
- Transport protocol: HTTP
- Message protocol: None

✅ **Authentication**
- Client certificate authentication

✅ **Reliability**
- Connection timeout: 60000 ms
- Retry on exception: false
- Throw exception on failure: true

✅ **Connection Pooling**
- Pooled connection idle timeout: 300000 ms

### Current Limitations

❌ HTTP method is hardcoded to POST  
❌ Target URL is not configured (must be set in SAP after import)  
❌ No custom authentication configuration  
❌ No custom headers  
❌ No retry configuration  

### Example Usage

```typescript
// HTTP Receiver is automatically added by BpmnProcessMapper
const flow = new IFlow("MyFlow");
// Receiver participant with HTTP adapter is created automatically
```

### SAP Configuration

When opened in SAP Integration Suite graphical editor:

**Adapter Type:** HTTP  
**Method:** POST  
**Authentication:** Client Certificate  
**Address:** (must be configured after import)  
**Timeout:** 60000 ms  

---

## Content Modifier

### Purpose

Modifies message content, headers, or properties during Integration Flow execution. This is the primary component for data transformation and enrichment.

### Generated BPMN Element

```xml
<bpmn2:callActivity id="CallActivity_1" name="Set Body">
  <bpmn2:extensionElements>
    <ifl:property><key>bodyType</key><value>constant</value></ifl:property>
    <ifl:property><key>componentVersion</key><value>1.6</value></ifl:property>
    <ifl:property><key>activityType</key><value>Enricher</value></ifl:property>
    <ifl:property><key>cmdVariantUri</key>
      <value>ctype::FlowstepVariant/cname::Enricher/version::1.6.3</value>
    </ifl:property>
    <ifl:property><key>body</key>
      <value>Hello from SAP Integration Suite!</value>
    </ifl:property>
  </bpmn2:extensionElements>
  <bpmn2:incoming>SequenceFlow_3</bpmn2:incoming>
  <bpmn2:outgoing>SequenceFlow_4</bpmn2:outgoing>
</bpmn2:callActivity>
```

### Current Capabilities

✅ **Message Body**
- Set constant body content
- Body type: constant

✅ **Properties**
- activityType: Enricher
- componentVersion: 1.6
- cmdVariantUri: Identifies component version in SAP

### Current Limitations

❌ No header configuration  
❌ No property configuration  
❌ No dynamic body (expressions not supported)  
❌ No XML/JSON manipulation  

### Example Usage

```typescript
import { IFlow, Component } from 'sap-integration-sdk';

const flow = new IFlow("MyFlow");

const contentModifier = new Component(
    "CallActivity_1",
    "Set Body",
    "Enricher"
);

// Configure body
contentModifier.properties.bodyType = "constant";
contentModifier.properties.body = "Hello from SAP Integration Suite!";

flow.addComponent(contentModifier);
```

### SAP Configuration

When opened in SAP Integration Suite graphical editor:

**Activity Type:** Content Modifier  
**Message Body:** Constant  
**Value:** Hello from SAP Integration Suite!  
**Message Header:** (not configured)  
**Exchange Property:** (not configured)  

---

## Planned Components (Version 1.2+)

The following components are planned for future releases:

### Routing & Orchestration
- 🔲 Router (Exclusive Gateway)
- 🔲 Multicast (Parallel Gateway)
- 🔲 Join

### Transformation
- 🔲 Groovy Script
- 🔲 JavaScript
- 🔲 XSLT
- 🔲 XML to JSON Converter
- 🔲 JSON to XML Converter
- 🔲 CSV to XML Converter

### Integration Patterns
- 🔲 Splitter (General, Iterating, EDI)
- 🔲 Gatherer
- 🔲 Aggregator
- 🔲 Content Enricher

### Data Persistence
- 🔲 Data Store Write
- 🔲 Data Store Read
- 🔲 Data Store Delete

### Error Handling
- 🔲 Exception Subprocess
- 🔲 Error Start Event
- 🔲 Error End Event

### Additional Adapters
- 🔲 SOAP Sender
- 🔲 SOAP Receiver
- 🔲 OData Sender
- 🔲 OData Receiver
- 🔲 SFTP Sender
- 🔲 SFTP Receiver
- 🔲 Mail Sender
- 🔲 Mail Receiver

See [ROADMAP.md](ROADMAP.md) for planned release schedule.

---

## Adding New Components

New components can be added through the Component Registry without modifying the compiler:

### Step 1: Add Registry Entry

```typescript
// src/registry/ComponentRegistry.ts
{
    technicalName: "Router",
    displayName: "Router",
    category: "routing",
    bpmnElement: "exclusiveGateway",
    activityType: undefined, // Not needed for gateways
    version: "1.0"
}
```

### Step 2: Use in SDK

```typescript
const router = new Component(
    "Gateway_1",
    "Route by Country",
    "Router"
);

router.properties.condition = "${header.Country} == 'IN'";
flow.addComponent(router);
```

### Step 3: Compile

The compiler automatically handles the new component using Registry metadata.

**No compiler changes required.**

---

## Component Versioning

All components follow SAP's versioning scheme:

| Component | SAP Version | SDK Version |
|-----------|-------------|-------------|
| HTTPS Sender | 1.5 | 1.0.0 |
| HTTP Receiver | 1.20 | 1.0.0 |
| Content Modifier | 1.6 | 1.0.0 |

SDK version compatibility is maintained across SAP Integration Suite updates.

---

## Troubleshooting

### Component not found error

```
Error: Unsupported component: XYZ. Add it to ComponentRegistry.
```

**Solution:** Component `XYZ` is not in the Registry. Either:
1. The component name is misspelled
2. The component is not yet supported (check planned components)
3. You need to add it to the Registry

### Generated flow doesn't open in SAP editor

**Possible causes:**
1. Missing mandatory properties
2. Incorrect cmdVariantUri
3. Missing BPMN Diagram Interchange

**Solution:** Check that the generated XML includes all required properties from this documentation.

---

**Last Updated:** 2026-07-16  
**SDK Version:** 1.0.0  
**Supported Components:** 3
