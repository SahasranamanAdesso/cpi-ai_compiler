# HelloWorld Integration Flow - Testing Guide

## MVP Status: ✅ READY FOR TESTING

The compiler MVP is complete. It generates a valid SAP Integration Suite Integration Flow package.

## What Was Built

**Flow Structure:**
```
HTTPS Sender → Content Modifier → HTTPS Receiver
```

**Generated Artifact:**
- `HelloWorld.zip` - Ready to import into SAP Integration Suite
- Complete BPMN 2.0 XML with SAP IFL extensions
- OSGi bundle with MANIFEST.MF
- All required metadata files

## How to Generate

```bash
npm install
npm run build
npm run helloworld
```

This creates `HelloWorld.zip` in the project root.

## How to Test in SAP Integration Suite

### 1. Import the Flow

1. Open SAP Integration Suite
2. Navigate to **Design → Integrations**
3. Click **Import**
4. Upload `HelloWorld.zip`
5. Click **OK**

**Expected Result:** ✅ Import succeeds, HelloWorld flow appears in the list

### 2. Open the Flow

1. Click on **HelloWorld** flow
2. The designer should open

**Expected Result:** ✅ Flow displays with:
- HTTPS Sender adapter (left)
- Content Modifier step (middle)
- HTTPS Receiver adapter (right)
- Connections between all elements

### 3. Verify Flow Configuration

**HTTPS Sender:**
- Address: `/hello`

**Content Modifier:**
- Name: "Set Body"
- Body Type: Constant
- Body: "Hello from SAP Integration Suite!"

**HTTPS Receiver:**
- Address: `https://postman-echo.com/post`

### 4. Deploy the Flow

1. Click **Deploy**
2. Wait for deployment to complete

**Expected Result:** ✅ Deployment succeeds

### 5. Test the Flow

1. Get the endpoint URL from the deployed flow
2. Send a POST request:

```bash
curl -X POST <your-endpoint-url>/hello \
  -H "Authorization: Bearer <your-token>"
```

**Expected Result:** ✅ Postman Echo returns the body we set:
```json
{
  "data": "Hello from SAP Integration Suite!",
  ...
}
```

## Success Criteria

The MVP is successful if:

1. ✅ **Import succeeds** - HelloWorld.zip imports without errors
2. ✅ **Flow displays correctly** - All elements visible and connected
3. ✅ **Configuration is correct** - Sender, modifier, receiver show correct settings
4. ✅ **Deployment succeeds** - Flow deploys without errors
5. ✅ **Runtime works** - Flow executes and transforms message

## If Import Fails

Check the error message. Common issues:

1. **Invalid BPMN structure** - Check namespace declarations
2. **Missing required elements** - Verify collaboration, process, participants
3. **Invalid extension properties** - Check ifl:property format
4. **OSGi bundle issues** - Verify MANIFEST.MF structure

If you encounter errors, capture:
- Full error message
- Error code (if any)
- Which step failed (import, validation, deployment)

## What Comes Next

After successful import:

1. **Test variations** - Try different Content Modifier configurations
2. **Add more components** - Router, Groovy script, etc.
3. **Complex flows** - Multi-step transformations
4. **Error handling** - Exception subprocess

## Generated Files

The ZIP contains:

```
HelloWorld/
├── META-INF/
│   └── MANIFEST.MF          # OSGi bundle manifest
├── .project                  # Eclipse project file
└── src/main/resources/
    ├── metainfo.prop         # Flow metadata
    ├── parameters.prop       # Flow parameters (empty for HelloWorld)
    ├── parameters.propdef    # Parameter definitions
    └── scenarioflows/integrationflow/
        └── HelloWorld.iflw   # BPMN 2.0 XML
```

## Architecture

```
Domain Model (IFlow)
      ↓
Mapper Layer (BpmnProcessMapper)
      ↓
IR (BpmnDefinitions)
      ↓
Writers (XML Generation)
      ↓
Serializer (.iflw file)
      ↓
Packager (ZIP creation)
      ↓
HelloWorld.zip
```

Every layer is working end-to-end for the HelloWorld flow.

## Code Location

- Example: `examples/helloworld.ts`
- Domain Model: `src/model/`
- Mapper: `src/mapper/BpmnProcessMapper.ts`
- IR: `src/ir/`
- Writers: `src/writer/`
- Serializer: `src/serializer/IflowSerializer.ts`
- Packager: `src/packager/IflowPackager.ts`

---

**Last Updated:** 2026-07-15  
**Status:** Ready for SAP Integration Suite import testing
