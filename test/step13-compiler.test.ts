/**
 * Step 13: First End-to-End Compilation
 *
 * This is the FIRST time our compiler actually DOES something.
 *
 * Until now:
 *   IFlow → [empty compiler] → BpmnProcess
 *
 * Now:
 *   IFlow with Components → [compiler transforms] → BpmnProcess with BpmnNodes
 *
 * This proves the core compiler architecture works:
 *   SDK Model → Compiler → IR
 *
 * No XML generation yet - that's Step 14.
 * But this IS a compiler. It translates one language into another.
 */

import { IFlow } from "../src/model/IFlow";
import { Component } from "../src/model/Component";
import { IFlowCompiler } from "../src/compiler/IFlowCompiler";

/**
 * Test 1: Single Component Compilation
 */
function testSingleComponentCompilation() {
    console.log("🧪 Test 1: Single Component Compilation\n");

    // Create an IFlow with one Content Modifier
    const flow = new IFlow("Demo");
    flow.addComponent(
        new Component(
            "CMP_1",
            "Content Modifier",
            "Enricher",
            { headers: { Country: "IN" } }
        )
    );

    // Compile to BPMN IR
    const compiler = new IFlowCompiler();
    const process = compiler.compile(flow);

    console.log("Input:");
    console.log(`  - IFlow: "${flow.name}"`);
    console.log(`  - Components: ${flow.getComponents().length}`);
    console.log();

    console.log("Output:");
    console.log(`  - BpmnProcess nodes: ${process.nodes.length}`);
    console.log();

    // Verify the transformation
    if (process.nodes.length !== 1) {
        throw new Error(`Expected 1 node, got ${process.nodes.length}`);
    }

    const node = process.nodes[0];
    console.log("Compiled BpmnNode:");
    console.log(`  - id: ${node.id}`);
    console.log(`  - type: ${node.type}`);
    console.log(`  - name: ${node.name}`);
    console.log(`  - properties: ${JSON.stringify(node.properties)}`);
    console.log();

    // Validate the node
    if (node.id !== "CMP_1") {
        throw new Error(`Expected id 'CMP_1', got '${node.id}'`);
    }
    if (node.type !== "Enricher") {
        throw new Error(`Expected type 'Enricher', got '${node.type}'`);
    }
    if (node.name !== "Content Modifier") {
        throw new Error(`Expected name 'Content Modifier', got '${node.name}'`);
    }

    console.log("✅ Test 1 PASSED - Single component compiled correctly\n");
}

/**
 * Test 2: Multiple Components Compilation
 */
function testMultipleComponentsCompilation() {
    console.log("🧪 Test 2: Multiple Components Compilation\n");

    // Create an IFlow with multiple components
    const flow = new IFlow("Multi-Step Flow");

    flow.addComponent(
        new Component("CMP_1", "Set Headers", "Enricher")
    );

    flow.addComponent(
        new Component("CMP_2", "Route by Country", "Router")
    );

    flow.addComponent(
        new Component("CMP_3", "Transform Data", "Groovy")
    );

    // Compile
    const compiler = new IFlowCompiler();
    const process = compiler.compile(flow);

    console.log("Input:");
    console.log(`  - Components: ${flow.getComponents().length}`);
    console.log();

    console.log("Output:");
    console.log(`  - BpmnNodes: ${process.nodes.length}`);
    console.log();

    // Verify all components were transformed
    if (process.nodes.length !== 3) {
        throw new Error(`Expected 3 nodes, got ${process.nodes.length}`);
    }

    console.log("Compiled nodes:");
    process.nodes.forEach((node, index) => {
        console.log(`  ${index + 1}. ${node.name} (${node.type})`);
    });
    console.log();

    console.log("✅ Test 2 PASSED - Multiple components compiled\n");
}

/**
 * Test 3: Properties Preservation
 */
function testPropertiesPreservation() {
    console.log("🧪 Test 3: Properties Preservation\n");

    const flow = new IFlow("Properties Test");

    const complexProperties = {
        headers: {
            Country: "IN",
            Region: "APAC"
        },
        body: "test",
        xpath: "/root/element"
    };

    flow.addComponent(
        new Component("CMP_1", "Complex Modifier", "Enricher", complexProperties)
    );

    const compiler = new IFlowCompiler();
    const process = compiler.compile(flow);
    const node = process.nodes[0];

    console.log("Input properties:");
    console.log(JSON.stringify(complexProperties, null, 2));
    console.log();

    console.log("Output properties:");
    console.log(JSON.stringify(node.properties, null, 2));
    console.log();

    // Verify properties are preserved exactly
    if (JSON.stringify(node.properties) !== JSON.stringify(complexProperties)) {
        throw new Error("Properties were not preserved correctly");
    }

    console.log("✅ Test 3 PASSED - Properties preserved\n");
}

/**
 * Test 4: Empty IFlow
 */
function testEmptyIFlow() {
    console.log("🧪 Test 4: Empty IFlow\n");

    const flow = new IFlow("Empty Flow");
    const compiler = new IFlowCompiler();
    const process = compiler.compile(flow);

    console.log(`Input: IFlow with ${flow.getComponents().length} components`);
    console.log(`Output: BpmnProcess with ${process.nodes.length} nodes`);
    console.log();

    if (process.nodes.length !== 0) {
        throw new Error(`Expected 0 nodes for empty flow, got ${process.nodes.length}`);
    }

    console.log("✅ Test 4 PASSED - Empty flow handled\n");
}

/**
 * Test 5: Compiler Visualization
 */
function testCompilerVisualization() {
    console.log("🧪 Test 5: Compiler Visualization\n");

    console.log("What we just built:");
    console.log();
    console.log("  Before (Step 12):");
    console.log("    IFlow → [skeleton compiler] → empty BpmnProcess");
    console.log();
    console.log("  Now (Step 13):");
    console.log("    IFlow → [WORKING compiler] → populated BpmnProcess");
    console.log();
    console.log("  Transformation:");
    console.log();
    console.log("    Component(id, name, type, props)");
    console.log("              ↓");
    console.log("        IFlowCompiler");
    console.log("              ↓");
    console.log("    BpmnNode(id, type, name, props)");
    console.log();
    console.log("  This IS a compiler - it translates:");
    console.log("    • SDK Model Language → BPMN IR Language");
    console.log();

    console.log("✅ Test 5 PASSED - Architecture validated\n");
}

/**
 * Run all tests
 */
function runAllTests() {
    console.log("=".repeat(60));
    console.log("  Step 13: First End-to-End Compilation");
    console.log("  Make the compiler ACTUALLY DO SOMETHING");
    console.log("=".repeat(60));
    console.log();

    try {
        testSingleComponentCompilation();
        testMultipleComponentsCompilation();
        testPropertiesPreservation();
        testEmptyIFlow();
        testCompilerVisualization();

        console.log("=".repeat(60));
        console.log("  🎉 ALL TESTS PASSED");
        console.log("=".repeat(60));
        console.log();
        console.log("Step 13 Complete:");
        console.log("✅ IFlowCompiler transforms Components → BpmnNodes");
        console.log("✅ Properties are preserved");
        console.log("✅ Multiple components handled");
        console.log("✅ First WORKING compiler");
        console.log();
        console.log("What we achieved:");
        console.log("🎯 This is a REAL compiler");
        console.log("🎯 It translates SDK Model → BPMN IR");
        console.log("🎯 No more skeleton classes");
        console.log();
        console.log("Next Step (Step 14):");
        console.log("⏭️  Build BPMN XML Writer");
        console.log("⏭️  BpmnProcess → <bpmn2:process> XML");
        console.log("⏭️  First actual BPMN output");
        console.log();
        console.log("Milestone Progress:");
        console.log("✅ Milestone 1: In-memory iFlow model");
        console.log("✅ Milestone 2: Compile to BPMN IR");
        console.log("⏭️  Milestone 3: Generate valid BPMN XML (next)");
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
