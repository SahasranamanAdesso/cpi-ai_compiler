# Architecture

**SAP Integration SDK Compiler Architecture**

This document explains the architecture of the SAP Integration SDK compiler and how it transforms TypeScript models into SAP-compatible Integration Flow artifacts.

---

## Overview

The compiler follows a **clean, layered architecture** based on SOLID principles:

```
┌─────────────────────────────────────────────────────────────┐
│                         Model Layer                         │
│  (TypeScript SDK - What developers write)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Registry Layer                         │
│  (SAP CPI Metadata)                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       Mapper Layer                          │
│  (Model → IR transformation)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Intermediate Representation (IR)               │
│  (Language-neutral BPMN structure)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       Writer Layer                          │
│  (IR → XML transformation)                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Serializer Layer                         │
│  (XML → File system)                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     Packager Layer                          │
│  (Project → .zip artifact)                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
                 HelloWorld.zip
```

---

## Layer 1: Model

**Purpose:** Type-safe TypeScript API for developers to build Integration Flows.

**Key Classes:**
- `IFlow` - Represents a complete Integration Flow
- `Component` - Represents a CPI component (Content Modifier, Router, etc.)
- `Connection` - Represents connections between components

**Example:**
```typescript
const flow = new IFlow("SalesOrderSync");
const contentModifier = new Component("CMP_1", "Set Headers", "Enricher");
flow.addComponent(contentModifier);
```

**Responsibility:** Provide a clean, type-safe API for developers. NO SAP-specific knowledge at this layer.

---

## Layer 2: Registry

**Purpose:** Metadata registry that maps CPI component types to BPMN elements.

**Key Classes:**
- `Registry` - Static registry of component definitions
- `ComponentRegistry` - Definitions for all supported components

**Example:**
```typescript
Registry.getByTechnicalName("Enricher")
// Returns: { bpmnElement: "callActivity", activityType: "Enricher" }
```

**Why this exists:**
- **Separation of Concerns** - SAP knowledge is isolated in one place
- **Extensibility** - Adding new components = adding registry entries (no compiler changes)
- **Metadata-Driven** - Compiler has NO hardcoded component knowledge

---

## Layer 3: Mapper

**Purpose:** Transform Model → IR using metadata from Registry.

**Key Classes:**
- `BpmnProcessMapper` - Orchestrates the complete transformation
- `ComponentMapper` - Maps individual components using Registry lookup

**Example Transformation:**
```
Component("CMP_1", "Content Modifier", "Enricher")
        ↓
Registry.getByTechnicalName("Enricher")
        ↓
{ bpmnElement: "callActivity", activityType: "Enricher" }
        ↓
BpmnNode("CMP_1", "callActivity", "Content Modifier", { activityType: "Enricher" })
```

**Responsibility:** Pure translation. No business logic. No XML generation. Just structure transformation.

---

## Layer 4: Intermediate Representation (IR)

**Purpose:** Language-neutral representation of BPMN structure.

**Key Classes:**
- `BpmnDefinitions` - Root BPMN element
- `BpmnCollaboration` - Participants and message flows
- `BpmnProcess` - Process with nodes and sequence flows
- `BpmnDiagram` - Visual layout (BPMN DI)
- `BpmnNode` - Generic BPMN node (start event, call activity, end event)
- `BpmnParticipant` - Sender/Receiver endpoints
- `BpmnMessageFlow` - Message flows with adapter properties
- `BpmnSequenceFlow` - Process flow connections
- `BpmnShape` - Visual shapes with coordinates
- `BpmnEdge` - Visual edges with waypoints

**Why IR exists:**
- **Decoupling** - Separate concerns (mapping vs. serialization)
- **Testability** - Test mapping logic without XML generation
- **Optimization** - Validate/optimize at IR level before serialization
- **Multiple Backends** - Could generate different output formats from same IR

**Key Insight:** IR knows BPMN structure but NOT XML syntax.

---

## Layer 5: Writer

**Purpose:** Transform IR → XML.

**Key Classes:**
- `BpmnWriter` - Entry point for XML generation
- `DefinitionsWriter` - Writes root `<definitions>` element
- `CollaborationWriter` - Writes `<collaboration>` with participants and message flows
- `ProcessWriter` - Writes `<process>` with nodes and sequence flows
- `BpmnDiagramWriter` - Writes BPMN Diagram Interchange (visual layout)
- `EventWriter` - Writes start/end events
- `CallActivityWriter` - Writes call activities (Content Modifier, Router, etc.)
- `PropertyWriter` - Writes SAP `<ifl:property>` elements

**Responsibility:** 
- Convert IR classes to XML strings
- Apply correct XML formatting
- Add SAP-specific extensions
- Generate BPMN 2.0 compliant XML

**Key Principle:** Writers are PURE functions. No state. No side effects.

---

## Layer 6: Serializer

**Purpose:** Write XML to file system.

**Key Classes:**
- `IflowSerializer` - Writes .iflw file and project structure

**Responsibility:**
- Create directory structure (`META-INF`, `src/main/resources`, etc.)
- Write .iflw file
- Write .project file
- Write MANIFEST.MF
- Write metainfo.prop
- Write parameters.prop / parameters.propdef

---

## Layer 7: Packager

**Purpose:** Package project directory into .zip artifact.

**Key Classes:**
- `IflowPackager` - Creates .zip file using JSZip

**Responsibility:**
- Read project directory
- Create .zip archive
- Ensure SAP-compatible structure

---

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
Each class has one job:
- `ComponentMapper` - Maps components (not XML generation)
- `DefinitionsWriter` - Writes XML (not mapping)
- `IflowSerializer` - Writes files (not XML generation)

### Open/Closed Principle (OCP)
- Adding new components = adding Registry entries (no compiler changes)
- Extensible through metadata, not modification

### Liskov Substitution Principle (LSP)
- IR classes can be used interchangeably
- Writers follow consistent interfaces

### Interface Segregation Principle (ISP)
- Each layer has minimal, focused interfaces
- No fat interfaces with unused methods

### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions (IR), not concrete implementations
- Writers depend on IR classes, not Model classes

---

## Why This Architecture?

### ✅ Clean Separation of Concerns
Each layer has a single, well-defined responsibility.

### ✅ Testable
Every layer can be tested independently:
- Test mapping without XML generation
- Test XML generation without file I/O
- Test packaging without mapping

### ✅ Metadata-Driven
SAP component knowledge is isolated in Registry. Compiler has NO hardcoded component logic.

### ✅ Extensible
Adding new components requires ZERO compiler changes:
1. Add component definition to Registry
2. Done

### ✅ Maintainable
Clear boundaries. Easy to understand. Easy to modify.

### ✅ Future-Proof
- IR can generate multiple output formats (XML, JSON, GraphQL, etc.)
- Mapping logic is independent of serialization format
- Can support multiple SAP CPI versions

---

## Data Flow Example

**Input:** TypeScript SDK code
```typescript
const flow = new IFlow("HelloWorld");
const contentModifier = new Component("CMP_1", "Set Body", "Enricher");
flow.addComponent(contentModifier);
```

**Step 1: Model**
```
IFlow { 
  name: "HelloWorld", 
  components: [ Component { id: "CMP_1", type: "Enricher" } ] 
}
```

**Step 2: Registry Lookup**
```
"Enricher" → { bpmnElement: "callActivity", activityType: "Enricher" }
```

**Step 3: IR**
```
BpmnDefinitions {
  collaboration: BpmnCollaboration {
    participants: [Sender, Receiver, Process],
    messageFlows: [...]
  },
  process: BpmnProcess {
    nodes: [StartEvent, CallActivity, EndEvent],
    flows: [SequenceFlow, SequenceFlow]
  },
  diagram: BpmnDiagram {
    shapes: [...],
    edges: [...]
  }
}
```

**Step 4: XML**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions ...>
  <bpmn2:collaboration id="Collaboration_1">
    <bpmn2:participant id="Participant_1" .../>
    <bpmn2:participant id="Participant_2" .../>
    <bpmn2:messageFlow .../>
  </bpmn2:collaboration>
  <bpmn2:process id="Process_1">
    <bpmn2:startEvent id="StartEvent_2"/>
    <bpmn2:callActivity id="CallActivity_1">
      <bpmn2:extensionElements>
        <ifl:property>
          <key>activityType</key>
          <value>Enricher</value>
        </ifl:property>
      </bpmn2:extensionElements>
    </bpmn2:callActivity>
    <bpmn2:endEvent id="EndEvent_2"/>
  </bpmn2:process>
  <bpmndi:BPMNDiagram ...>
    <bpmndi:BPMNShape .../>
    <bpmndi:BPMNEdge .../>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
```

**Step 5: File System**
```
HelloWorld/
├── META-INF/MANIFEST.MF
├── .project
├── metainfo.prop
└── src/main/resources/
    ├── parameters.prop
    ├── parameters.propdef
    └── scenarioflows/integrationflow/HelloWorld.iflw
```

**Step 6: Package**
```
HelloWorld.zip (ready for SAP import)
```

---

## Key Design Decisions

### Why IR instead of direct XML generation?

**Problem:** Mixing mapping logic with XML generation creates tight coupling.

**Solution:** IR separates concerns:
- Mapper focuses on structure transformation
- Writers focus on XML generation
- Each can be tested independently

### Why Registry instead of hardcoded component knowledge?

**Problem:** Hardcoded component mappings require compiler changes for every new component.

**Solution:** Registry externalizes metadata:
- Adding new components = adding registry entries
- Compiler remains unchanged
- Metadata can be loaded from external sources in future

### Why BPMN DI (Diagram Interchange)?

**Problem:** Without layout information, SAP graphical editor cannot render the flow.

**Solution:** Generate complete BPMN DI with:
- BPMNShape for every element (with x, y, width, height)
- BPMNEdge for every flow (with waypoints)
- Coordinates matching SAP layout expectations

---

## Future Architecture Enhancements

### Version 1.1 - AI Integration
- LLM generates TypeScript SDK code
- Compiler remains unchanged
- AI operates at Model layer, NOT IR/XML layer

### Version 2.0 - Deployment
- Add Deployment layer after Packager
- REST API client for SAP Integration Suite
- Automated upload and deployment

### Version 3.0 - Multi-Format Output
- IR can generate multiple output formats:
  - SAP CPI XML (current)
  - SAP Integration Suite GraphQL
  - OpenAPI specifications
  - Cloud Events schemas

---

**This architecture is now FROZEN for Version 1.0.**

No redesign. No experimental changes. Only bug fixes and component additions through Registry.
