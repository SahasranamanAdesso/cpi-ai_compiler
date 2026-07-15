# IR Enhancement Checklist
## Required Before Backend Implementation

**Goal:** Complete IR to represent 100% of SAP Integration Suite .iflw structure  
**Estimated Time:** 10-12 hours  
**Priority:** CRITICAL - Blocks all backend work

---

## New Classes to Build

### 1. Extension Properties (1 hour)
**File:** `src/ir/IflProperty.ts`

```typescript
export class IflProperty {
    constructor(
        public readonly key: string,
        public readonly value: string
    ) {}
}
```

**Used By:** Collaboration, Participants, MessageFlows, Process, Events, CallActivities

---

### 2. Collaboration (2 hours)
**File:** `src/ir/BpmnCollaboration.ts`

```typescript
export class BpmnCollaboration {
    public readonly participants: BpmnParticipant[] = [];
    public readonly messageFlows: BpmnMessageFlow[] = [];
    public readonly properties: IflProperty[] = [];

    constructor(
        public readonly id: string,
        public readonly name: string
    ) {}
}
```

**SAP Example:** 14 properties, 2+ participants, 1+ message flows

---

### 3. Participant (1 hour)
**File:** `src/ir/BpmnParticipant.ts`

```typescript
export class BpmnParticipant {
    public readonly properties: IflProperty[] = [];

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly iflType: string,  // "EndpointSender" | "IntegrationProcess"
        public readonly processRef?: string
    ) {}
}
```

**SAP Example:** Sender participant with type="EndpointSender", Process participant with processRef="Process_1"

---

### 4. Message Flow (2 hours)
**File:** `src/ir/BpmnMessageFlow.ts`

```typescript
export class BpmnMessageFlow {
    public readonly properties: IflProperty[] = [];

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly sourceRef: string,
        public readonly targetRef: string
    ) {}
}
```

**SAP Example:** HTTPS adapter with 20+ properties (urlPath, authentication, etc.)

---

### 5. Definitions (2 hours)
**File:** `src/ir/BpmnDefinitions.ts`

```typescript
export class BpmnDefinitions {
    public readonly namespaces: Map<string, string>;

    constructor(
        public readonly id: string,
        public readonly collaboration: BpmnCollaboration,
        public readonly process: BpmnProcess,
        public readonly diagram?: BpmnDiagram
    ) {
        this.namespaces = new Map([
            ['bpmn2', 'http://www.omg.org/spec/BPMN/20100524/MODEL'],
            ['bpmndi', 'http://www.omg.org/spec/BPMN/20100524/DI'],
            ['dc', 'http://www.omg.org/spec/DD/20100524/DC'],
            ['di', 'http://www.omg.org/spec/DD/20100524/DI'],
            ['ifl', 'http:///com.sap.ifl.model/Ifl.xsd'],
            ['xsi', 'http://www.w3.org/2001/XMLSchema-instance']
        ]);
    }
}
```

**Root element of every .iflw file**

---

### 6. Diagram Classes (3 hours)
**Files:** `src/ir/diagram/`

```typescript
// BpmnDiagram.ts
export class BpmnDiagram {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly plane: BpmnPlane
    ) {}
}

// BpmnPlane.ts
export class BpmnPlane {
    public readonly shapes: BpmnShape[] = [];
    public readonly edges: BpmnEdge[] = [];

    constructor(
        public readonly id: string,
        public readonly bpmnElement: string
    ) {}
}

// BpmnShape.ts
export class BpmnShape {
    constructor(
        public readonly id: string,
        public readonly bpmnElement: string,
        public readonly bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    ) {}
}

// BpmnEdge.ts
export class BpmnEdge {
    public readonly waypoints: Array<{ x: number; y: number }> = [];

    constructor(
        public readonly id: string,
        public readonly bpmnElement: string
    ) {}
}
```

**SAP Requirement:** Every element must have visual position

---

## Existing Classes to Enhance

### 7. BpmnProcess (1 hour)
**File:** `src/ir/BpmnProcess.ts`

**Add:**
```typescript
export class BpmnProcess {
    public readonly nodes: BpmnNode[] = [];
    public readonly flows: BpmnSequenceFlow[] = [];
    public readonly properties: IflProperty[] = [];  // ← ADD

    constructor(
        public readonly id: string,          // ← ADD
        public readonly name: string         // ← ADD
    ) {}
}
```

**SAP Example:** Process with 4 properties (transaction settings, etc.)

---

### 8. BpmnSequenceFlow (30 min)
**File:** `src/ir/BpmnSequenceFlow.ts`

**Add:**
```typescript
export class BpmnSequenceFlow {
    constructor(
        public readonly id: string,          // ← ADD
        public readonly sourceRef: string,
        public readonly targetRef: string,
        public readonly name?: string        // ← ADD
    ) {}
}
```

---

### 9. BpmnNode Enhancement (30 min)
**File:** `src/ir/BpmnNode.ts`

**Add:**
```typescript
export class BpmnNode {
    public readonly properties: Record<string, any>;  // Keep for backward compat
    public readonly iflProperties: IflProperty[] = [];  // ← ADD for typed properties

    constructor(
        public readonly id: string,
        public readonly type: string,
        public readonly name: string,
        properties: Record<string, any> = {}
    ) {
        this.properties = properties;
    }
}
```

---

## Testing Checklist

After implementing all classes, verify:

- [ ] Can create `BpmnDefinitions` with all namespaces
- [ ] Can create `BpmnCollaboration` with 14 properties
- [ ] Can create `BpmnParticipant` for sender
- [ ] Can create `BpmnParticipant` for integration process
- [ ] Can create `BpmnMessageFlow` with 20+ properties
- [ ] Can create `BpmnProcess` with id, name, properties
- [ ] Can create `BpmnSequenceFlow` with id
- [ ] Can create complete `BpmnDiagram` with shapes/edges
- [ ] Can represent the "Agg Test" artifact in IR
- [ ] No compilation errors
- [ ] All existing tests still pass

---

## Mapper Updates Required

After IR enhancement, update:

**File:** `src/mapper/BpmnProcessMapper.ts`

**Changes:**
1. Generate `BpmnDefinitions` (not just `BpmnProcess`)
2. Create `BpmnCollaboration`
3. Add participants for adapters
4. Generate message flows
5. Generate diagram with layout
6. Generate IDs using `IdGenerator`

**Estimated:** 4-6 hours after IR is complete

---

## Documentation Required

After implementation:

1. **`docs/architecture/ir-specification.md`**
   - Document all IR classes
   - Show example object graphs
   - Explain relationships

2. **`docs/sap-analysis/property-catalog.md`**
   - List all known `<ifl:property>` keys
   - Document which elements use which properties
   - Provide examples

3. **Update `README.md`**
   - Reflect new architecture
   - Update examples

**Estimated:** 3 hours

---

## Priority Order

**Day 1 (4 hours):**
1. ✅ IflProperty (1h)
2. ✅ BpmnParticipant (1h)
3. ✅ BpmnCollaboration (2h)

**Day 2 (4 hours):**
4. ✅ BpmnMessageFlow (2h)
5. ✅ BpmnDefinitions (2h)

**Day 3 (4 hours):**
6. ✅ Diagram classes (3h)
7. ✅ Update existing classes (1h)

**Day 4 (3 hours):**
8. ✅ Test all classes
9. ✅ Document
10. ✅ Update mappers

---

## Success Criteria

✅ All 9 classes implemented  
✅ Can represent "Agg Test.iflw" in IR completely  
✅ All tests pass  
✅ Documentation complete  
✅ Ready to build XML writers  

---

**After this:** Backend implementation can begin with confidence
