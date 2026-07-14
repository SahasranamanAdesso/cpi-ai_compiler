/**
 * Compiler Test - Verify the compiler architecture works
 *
 * This test demonstrates:
 * 1. Creating Components
 * 2. Building an IFlow
 * 3. Compiling to Intermediate Representation (IR)
 * 4. Validating the IR structure
 *
 * This proves the compiler concept before we build the XML writer.
 */

import { Component } from "../src/model/Component";
import { IFlow } from "../src/model/IFlow";
import { Compiler } from "../src/compiler/Compiler";
import { ContentModifierRule } from "../src/compiler/rules/ContentModifierRule";

/**
 * Test 1: Basic Content Modifier Compilation
 */
function testContentModifierCompilation() {
    console.log("🧪 Test 1: Content Modifier Compilation\n");

    // Create a Content Modifier component
    const contentModifier = new Component(
        "ContentModifier_1",
        "Set Headers",
        "Enricher",
        {
            headers: {
                Country: "IN",
                Source: "SAP"
            }
        }
    );

    // Build an IFlow with this component
    const flow = new IFlow("Test Flow");
    flow.addComponent(contentModifier);

    // Create and configure the compiler
    const compiler = new Compiler();
    compiler.register(new ContentModifierRule());

    // Compile to IR
    const ir = compiler.compile(flow);

    // Verify the IR structure
    console.log("IR Output:");
    console.log(JSON.stringify(ir, null, 2));
    console.log();

    // Assertions
    if (ir.length !== 1) {
        throw new Error(`Expected 1 IR node, got ${ir.length}`);
    }

    const irNode = ir[0];
    if (irNode.element !== "callActivity") {
        throw new Error(`Expected element "callActivity", got "${irNode.element}"`);
    }

    if (irNode.activityType !== "Enricher") {
        throw new Error(`Expected activityType "Enricher", got "${irNode.activityType}"`);
    }

    if (irNode.name !== "Set Headers") {
        throw new Error(`Expected name "Set Headers", got "${irNode.name}"`);
    }

    if (irNode.id !== "ContentModifier_1") {
        throw new Error(`Expected id "ContentModifier_1", got "${irNode.id}"`);
    }

    console.log("✅ Test 1 PASSED\n");
}

/**
 * Test 2: Multiple Components
 */
function testMultipleComponents() {
    console.log("🧪 Test 2: Multiple Components\n");

    // Create multiple Content Modifiers
    const modifier1 = new Component(
        "CMP_1",
        "Set Country",
        "Enricher",
        { headers: { Country: "IN" } }
    );

    const modifier2 = new Component(
        "CMP_2",
        "Set Source",
        "Enricher",
        { headers: { Source: "SAP" } }
    );

    // Build an IFlow with multiple components
    const flow = new IFlow("Multi-Component Flow");
    flow.addComponent(modifier1);
    flow.addComponent(modifier2);

    // Compile
    const compiler = new Compiler();
    compiler.register(new ContentModifierRule());
    const ir = compiler.compile(flow);

    console.log("IR Output:");
    console.log(JSON.stringify(ir, null, 2));
    console.log();

    // Verify
    if (ir.length !== 2) {
        throw new Error(`Expected 2 IR nodes, got ${ir.length}`);
    }

    if (ir[0].id !== "CMP_1" || ir[1].id !== "CMP_2") {
        throw new Error("Component order not preserved");
    }

    console.log("✅ Test 2 PASSED\n");
}

/**
 * Test 3: Unknown Component Type (Error Handling)
 */
function testUnknownComponentType() {
    console.log("🧪 Test 3: Unknown Component Type Error Handling\n");

    // Create a component with an unknown type
    const unknownComponent = new Component(
        "UNKNOWN_1",
        "Unknown Type",
        "UnknownType"
    );

    const flow = new IFlow("Error Test");
    flow.addComponent(unknownComponent);

    const compiler = new Compiler();
    compiler.register(new ContentModifierRule());

    try {
        compiler.compile(flow);
        throw new Error("Expected compilation to fail for unknown type");
    } catch (error) {
        if (error instanceof Error) {
            console.log("Expected error caught:");
            console.log(error.message);
            console.log();

            if (!error.message.includes("No compilation rule found")) {
                throw new Error("Error message doesn't match expected pattern");
            }
        }
    }

    console.log("✅ Test 3 PASSED\n");
}

/**
 * Test 4: Compiler Rule Registration
 */
function testRuleRegistration() {
    console.log("🧪 Test 4: Compiler Rule Registration\n");

    const compiler = new Compiler();

    // Initially no rules
    if (compiler.getRegisteredRules().length !== 0) {
        throw new Error("Expected 0 rules initially");
    }

    // Register a rule
    compiler.register(new ContentModifierRule());

    // Verify registration
    if (compiler.getRegisteredRules().length !== 1) {
        throw new Error("Expected 1 rule after registration");
    }

    console.log("Registered rules:", compiler.getRegisteredRules().length);
    console.log();
    console.log("✅ Test 4 PASSED\n");
}

/**
 * Run all tests
 */
function runAllTests() {
    console.log("=".repeat(60));
    console.log("  SAP Integration SDK - Compiler Tests");
    console.log("=".repeat(60));
    console.log();

    try {
        testContentModifierCompilation();
        testMultipleComponents();
        testUnknownComponentType();
        testRuleRegistration();

        console.log("=".repeat(60));
        console.log("  ✅ ALL TESTS PASSED");
        console.log("=".repeat(60));
        console.log();
        console.log("Next Steps:");
        console.log("1. ✅ Compiler architecture validated");
        console.log("2. ⏭️  Add more CompilerRules (Router, Groovy, etc.)");
        console.log("3. ⏭️  Build XMLWriter to convert IR to BPMN XML");
        console.log("4. ⏭️  Build high-level IFlowDefinition API");
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
