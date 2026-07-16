# Changelog

All notable changes to the SAP Integration SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-16

### 🎉 First SAP Integration Suite Editor Compatible Release

This is the first production-quality release of the SAP Integration SDK. Generated Integration Flows can now be imported into SAP Integration Suite and opened successfully in the graphical editor.

### Added

#### Core Compiler Architecture
- **Model Layer** - TypeScript SDK for building Integration Flows (`IFlow`, `Component`, `Connection`)
- **Registry Layer** - Metadata-driven component registry for SAP CPI components
- **Mapper Layer** - Transforms Model → IR using Registry metadata (`BpmnProcessMapper`, `ComponentMapper`)
- **Intermediate Representation (IR)** - Language-neutral BPMN structure (`BpmnDefinitions`, `BpmnProcess`, `BpmnCollaboration`)
- **Writer Layer** - IR → XML transformation (`DefinitionsWriter`, `ProcessWriter`, `CollaborationWriter`)
- **Serializer Layer** - XML → File system (`IflowSerializer`)
- **Packager Layer** - Project → .zip artifact (`IflowPackager`)

#### BPMN Diagram Interchange (Critical for Editor Compatibility)
- `BpmnDiagram` IR class for visual layout
- `BpmnShape` IR class for element shapes (with x, y, width, height)
- `BpmnEdge` IR class for flow edges (with waypoints)
- `BpmnDiagramWriter` for generating BPMN DI XML
- Complete visual layout generation matching SAP Integration Suite expectations

#### Supported Components
- **HTTPS Sender** - Receives HTTP/HTTPS requests (version 1.5)
- **HTTP Receiver** - Sends HTTP/HTTPS requests (version 1.20)
- **Content Modifier** - Modifies message body (version 1.6, Enricher type)

#### Message Flow Structure
- Sender participant (`Participant_1`, type: `EndpointSender`)
- Receiver participant (`Participant_2`, type: `EndpointRecevier` - SAP's exact spelling preserved)
- Integration Process participant (`Participant_Process_1`, type: `IntegrationProcess`)
- Inbound message flow (Sender → StartEvent)
- Outbound message flow (EndEvent → Receiver)
- Bidirectional message routing

#### Process Structure
- Start Event with message event definition
- Call Activity for Content Modifier with all mandatory properties
- End Event with message event definition
- Sequence flows connecting all process elements
- Incoming/outgoing references for all nodes

#### Mandatory SAP Properties
- `cmdVariantUri` on all components (identifies SAP component version)
- `componentVersion` on all components
- `activityType` on CallActivity elements
- Complete HTTP adapter properties (40+ properties on receiver message flow)
- Complete HTTPS adapter properties on sender message flow
- Process-level properties (transactionTimeout, transactionalHandling)

#### Project Structure
- `.project` file with Eclipse project metadata
- `META-INF/MANIFEST.MF` with bundle configuration and package imports
- `metainfo.prop` with artifact metadata
- `src/main/resources/scenarioflows/integrationflow/*.iflw` with BPMN XML
- `src/main/resources/parameters.prop` (empty)
- `src/main/resources/parameters.propdef` (empty)
- Correct directory structure matching SAP Integration Suite expectations

#### Documentation
- **README.md** - Project overview, features, quick start, architecture diagram
- **ARCHITECTURE.md** - Detailed architecture explanation with SOLID principles
- **ROADMAP.md** - Product roadmap (v1.0 → v3.0)
- **SUPPORTED_COMPONENTS.md** - Complete component documentation
- **CHANGELOG.md** - This file

#### Examples
- `examples/helloworld.ts` - Complete working example generating HelloWorld.zip
- npm script `npm run helloworld` for quick testing

#### Testing
- Component mapper tests
- BPMN process mapper tests
- Registry tests
- Connection tests

### Architecture Principles

✅ **SOLID Principles**
- Single Responsibility: Each class has one job
- Open/Closed: Extensible through Registry, not modification
- Liskov Substitution: IR classes are interchangeable
- Interface Segregation: Minimal, focused interfaces
- Dependency Inversion: Depend on abstractions (IR), not implementations

✅ **Metadata-Driven**
- Component definitions in Registry
- NO hardcoded component knowledge in compiler
- Adding new components = Registry entries (no compiler changes)

✅ **Separation of Concerns**
- Model knows domain concepts
- Registry knows SAP metadata
- Mapper knows structure transformation
- Writers know XML generation
- Each layer is independently testable

✅ **Clean Architecture**
- Clear boundaries between layers
- One-way dependencies (Model → Registry → Mapper → IR → Writers)
- Testable without XML generation or file I/O

### Compatibility

✅ **SAP Integration Suite**
- Integration Flows import successfully
- Integration Flows open in graphical editor without errors
- BPMN diagram renders correctly in visual editor
- All elements (Sender, Receiver, Content Modifier) display correctly
- Message flows show correct adapter types
- Sequence flows connect elements properly

✅ **SAP BPMN Extensions**
- `ifl:property` elements for SAP-specific configuration
- `cmdVariantUri` for component version identification
- Correct adapter property structure
- SAP-specific participants and message flows

### Known Limitations

❌ **Limited Component Library**
- Only 3 components supported (HTTPS Sender, HTTP Receiver, Content Modifier)
- No Router, Groovy, Data Store, or other enterprise components
- Planned for Version 1.2

❌ **No Deployment**
- Generated .zip files must be manually imported to SAP Integration Suite
- No automated deployment API
- Planned for Version 2.0

❌ **No Validation**
- No pre-compile validation of flow correctness
- No validation of adapter properties
- No detection of missing connections
- Planned for Version 1.2

❌ **Hardcoded Adapter Properties**
- HTTPS Sender URL path: `/hello` (hardcoded)
- HTTP Receiver method: POST (hardcoded)
- No dynamic configuration
- Planned for Version 1.2

❌ **No Header/Property Configuration**
- Content Modifier only supports body modification
- No header or exchange property configuration
- Planned for Version 1.2

### Breaking Changes

N/A - This is the first release.

### Migration

N/A - This is the first release.

### Deprecations

None.

---

## [Unreleased]

### Planned for Version 1.1 (Q3 2026)
- AI Integration
- LLM generates TypeScript SDK code
- Natural language → Integration Flow
- Prompt templates for common patterns

### Planned for Version 1.2 (Q4 2026)
- Router (Exclusive Gateway)
- Groovy Script
- XML/JSON transformers
- Data Store components
- Validation engine
- Dynamic property configuration

### Planned for Version 2.0 (Q1 2027)
- Deployment API
- Automated deployment to SAP Integration Suite
- CI/CD integration
- Environment configuration management

See [ROADMAP.md](ROADMAP.md) for detailed roadmap.

---

## Version History

- **1.0.0** (2026-07-16) - First SAP Integration Suite Editor Compatible Release
- **1.0.0-editor-compatible** (2026-07-16) - Pre-release tag for Phase 1 implementation

---

**Format:** [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
**Versioning:** [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
