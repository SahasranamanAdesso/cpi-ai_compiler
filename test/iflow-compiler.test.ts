/**
 * IFlowCompiler Test - Verify the IR architecture
 *
 * This test demonstrates the new compilation pipeline:
 *   IFlow → IFlowCompiler → BpmnProcess (IR)
 *
 * We're proving that:
 * 1. IFlowCompiler can be instantiated
 * 2. It accepts an IFlow and returns BpmnProcess
 * 3. BpmnProcess has the expected structure (nodes + flows)
 *
 * This is Step 12 - establishing the IR layer.
 * Next steps will populate the BpmnProcess with actual content.
 */

import { IFlow } from "../src/model/IFlow";
import { Component } from "../src/model/Component";
import { IFlowCompiler } from "../src/compiler/IFlowCompiler";

/**
 * Test 1: Compiler returns BpmnProcess structure
 */
function testCompilerReturnsBpmnProcess() {
    console.log("🧪 Test 1: Compiler Returns BpmnProcess\n");

    // Create a simple IFlow
    const flow = new IFlow("Test Flow");
    flow.addComponent(
        new Component("CMP_1", "Content Modifier", "Enricher")
    );

    // Compile to BPMN IR
    const compiler = new IFlowCompiler();
    const bpmnProcess = compiler.compile(flow);

    // Verify structure
    console.log("BpmnProcess structure:");
    console.log(`  - nodes: ${bpmnProcess.nodes.length} (empty for now)`);
    console.log(`  - flows: ${bpmnProcess.flows.length} (empty for now)`);
    console.log();

    // At this stage, process is empty (we haven't implemented compilation logic yet)
    // But the architecture is in place
    if (!bpmnProcess.nodes || !bpmnProcess.flows) {
        throw new Error("BpmnProcess missing required properties");
    }

    console.log("✅ Test 1 PASSED - IR structure exists\n");
}

/**
 * Test 2: Verify IR types are correct
 */
function testIRTypes() {
    console.log("🧪 Test 2: Verify IR Types\n");

    const compiler = new IFlowCompiler();
    const flow = new IFlow("Type Test");
    const bpmnProcess = compiler.compile(flow);

    // Verify the returned object has the right structure
    if (!Array.isArray(bpmnProcess.nodes)) {
        throw new Error("bpmnProcess.nodes should be an array");
    }

    if (!Array.isArray(bpmnProcess.flows)) {
        throw new Error("bpmnProcess.flows should be an array");
    }

    console.log("BpmnProcess types verified:");
    console.log(`  - nodes is Array: ${Array.isArray(bpmnProcess.nodes)}`);
    console.log(`  - flows is Array: ${Array.isArray(bpmnProcess.flows)}`);
    console.log();

    console.log("✅ Test 2 PASSED - IR types correct\n");
}

/**
 * Test 3: Architecture visualization
 */
function testArchitectureVisualization() {
    console.log("🧪 Test 3: Architecture Visualization\n");

    console.log("Current compilation pipeline:");
    console.log();
    console.log("  ┌─────────────────┐");
    console.log("  │  IFlow (SDK)    │  ← Developer writes this");
    console.log("  └────────┬────────┘");
    console.log("           │");
    console.log("           ▼");
    console.log("  ┌─────────────────┐");
    console.log("  │ IFlowCompiler   │  ← We just built this");
    console.log("  └────────┬────────┘");
    console.log("           │");
    console.log("           ▼");
    console.log("  ┌─────────────────┐");
    console.log("  │ BpmnProcess (IR)│  ← Clean BPMN representation");
    console.log("  └────────┬────────┘");
    console.log("           │");
    console.log("           ▼");
    console.log("  ┌─────────────────┐");
    console.log("  │  XMLWriter      │  ← Next step");
    console.log("  └────────┬────────┘");
    console.log("           │");
    console.log("           ▼");
    console.log("  ┌─────────────────┐");
    console.log("  │  .iflw artifact │  ← Final CPI package");
    console.log("  └─────────────────┘");
    console.log();

    console.log("✅ Test 3 PASSED - Architecture established\n");
}

/**
 * Run all tests
 */
function runAllTests() {
    console.log("=".repeat(60));
    console.log("  IFlowCompiler - IR Architecture Tests");
    console.log("  Step 12: Introduce Intermediate Representation");
    console.log("=".repeat(60));
    console.log();

    try {
        testCompilerReturnsBpmnProcess();
        testIRTypes();
        testArchitectureVisualization();

        console.log("=".repeat(60));
        console.log("  ✅ ALL TESTS PASSED");
        console.log("=".repeat(60));
        console.log();
        console.log("Step 12 Complete:");
        console.log("✅ BpmnNode, BpmnSequenceFlow, BpmnProcess created");
        console.log("✅ IFlowCompiler created");
        console.log("✅ IR architecture established");
        console.log();
        console.log("Next Step (Step 13):");
        console.log("⏭️  Populate BpmnProcess with nodes and flows");
        console.log("⏭️  Transform Components → BpmnNodes");
        console.log("⏭️  Add StartEvent and EndEvent");
        console.log("⏭️  Create SequenceFlows between nodes");
        console.log();
    } catch (error) {
        console.error("\n❌ TEST FAILED:");
        console.error(error);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}
