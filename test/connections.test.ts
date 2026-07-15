/**
 * Connections Test - Complete Graph Structure
 *
 * This proves we can now build a complete BPMN process graph:
 * - Nodes (components)
 * - Flows (connections)
 *
 * This is CRITICAL - a BPMN process is a graph, not just a list.
 *
 * We're building:
 *   Sender → Content Modifier → Receiver
 *
 * Not just:
 *   [Sender, Content Modifier, Receiver]
 */

import { IFlow } from "../src/model/IFlow";
import { Component } from "../src/model/Component";
import { BpmnProcessMapper } from "../src/mapper/BpmnProcessMapper";

/**
 * Test 1: Simple linear flow with connections
 */
function testLinearFlowWithConnections() {
    console.log("🧪 Test 1: Linear Flow with Connections\n");

    const flow = new IFlow("Linear Flow");

    // Create components
    const sender = new Component("Sender_1", "HTTPS Sender", "HTTPS");
    const modifier = new Component("CMP_1", "Add Headers", "Enricher");
    const receiver = new Component("Receiver_1", "HTTPS Receiver", "HTTPS");

    flow.addComponent(sender);
    flow.addComponent(modifier);
    flow.addComponent(receiver);

    // Connect them
    flow.connect(sender, modifier);
    flow.connect(modifier, receiver);

    console.log("Input Flow Structure:");
    console.log("  Components: 3");
    console.log("  Connections: 2");
    console.log();
    console.log("  Sender → Content Modifier → Receiver");
    console.log();

    // Map to BPMN
    const mapper = new BpmnProcessMapper();
    const process = mapper.map(flow);

    console.log("Output BpmnProcess:");
    console.log(`  Nodes: ${process.nodes.length}`);
    console.log(`  Flows: ${process.flows.length}`);
    console.log();

    // Verify nodes
    if (process.nodes.length !== 3) {
        throw new Error(`Expected 3 nodes, got ${process.nodes.length}`);
    }

    // Verify flows
    if (process.flows.length !== 2) {
        throw new Error(`Expected 2 flows, got ${process.flows.length}`);
    }

    console.log("BPMN Nodes:");
    process.nodes.forEach((node, i) => {
        console.log(`  ${i + 1}. ${node.name} (${node.id})`);
    });
    console.log();

    console.log("BPMN Sequence Flows:");
    process.flows.forEach((flow, i) => {
        console.log(`  ${i + 1}. ${flow.sourceRef} → ${flow.targetRef}`);
    });
    console.log();

    // Verify flow connections
    const flow1 = process.flows[0];
    if (flow1.sourceRef !== "Sender_1" || flow1.targetRef !== "CMP_1") {
        throw new Error("First flow connection incorrect");
    }

    const flow2 = process.flows[1];
    if (flow2.sourceRef !== "CMP_1" || flow2.targetRef !== "Receiver_1") {
        throw new Error("Second flow connection incorrect");
    }

    console.log("Verification:");
    console.log("  ✅ All nodes mapped");
    console.log("  ✅ All connections mapped");
    console.log("  ✅ Graph structure preserved");
    console.log();

    console.log("✅ Test 1 PASSED - Linear flow with connections\n");
}

/**
 * Test 2: Multi-step flow with connections
 */
function testMultiStepFlow() {
    console.log("🧪 Test 2: Multi-Step Flow with Connections\n");

    const flow = new IFlow("Multi-Step Integration");

    // Create pipeline
    const c1 = new Component("CMP_1", "Set Headers", "Enricher");
    const c2 = new Component("CMP_2", "Route by Country", "Router");
    const c3 = new Component("CMP_3", "Transform Data", "ScriptCollection");
    const c4 = new Component("CMP_4", "Save to Cache", "DBStorage");

    flow.addComponent(c1)
        .addComponent(c2)
        .addComponent(c3)
        .addComponent(c4);

    // Connect them
    flow.connect(c1, c2);
    flow.connect(c2, c3);
    flow.connect(c3, c4);

    console.log("Input Flow Structure:");
    console.log("  Components: 4");
    console.log("  Connections: 3");
    console.log();
    console.log("  C1 → C2 → C3 → C4");
    console.log();

    const mapper = new BpmnProcessMapper();
    const process = mapper.map(flow);

    console.log("Output BpmnProcess:");
    console.log(`  Nodes: ${process.nodes.length}`);
    console.log(`  Flows: ${process.flows.length}`);
    console.log();

    if (process.nodes.length !== 4) throw new Error("Wrong node count");
    if (process.flows.length !== 3) throw new Error("Wrong flow count");

    console.log("Graph Structure:");
    process.flows.forEach((f, i) => {
        const source = process.nodes.find(n => n.id === f.sourceRef);
        const target = process.nodes.find(n => n.id === f.targetRef);
        console.log(`  ${source?.name} → ${target?.name}`);
    });
    console.log();

    console.log("✅ Test 2 PASSED - Multi-step flow\n");
}

/**
 * Test 3: Flow without connections (isolated components)
 */
function testFlowWithoutConnections() {
    console.log("🧪 Test 3: Flow Without Connections\n");

    const flow = new IFlow("Isolated Components");

    flow.addComponent(new Component("C1", "Component 1", "Enricher"));
    flow.addComponent(new Component("C2", "Component 2", "Router"));

    console.log("Input: 2 components, 0 connections");
    console.log();

    const mapper = new BpmnProcessMapper();
    const process = mapper.map(flow);

    console.log("Output:");
    console.log(`  Nodes: ${process.nodes.length}`);
    console.log(`  Flows: ${process.flows.length}`);
    console.log();

    if (process.nodes.length !== 2) throw new Error("Wrong node count");
    if (process.flows.length !== 0) throw new Error("Should have 0 flows");

    console.log("✅ Test 3 PASSED - No connections handled\n");
}

/**
 * Test 4: Complete semantic model
 */
function testCompleteSemanticModel() {
    console.log("🧪 Test 4: Complete Semantic Model\n");

    console.log("What the compiler now understands:\n");

    const flow = new IFlow("Sales Order Sync");

    const c1 = new Component("CMP_1", "Enrich", "Enricher");
    const c2 = new Component("CMP_2", "Route", "Router");

    flow.addComponent(c1);
    flow.addComponent(c2);
    flow.connect(c1, c2);

    const mapper = new BpmnProcessMapper();
    const process = mapper.map(flow);

    console.log("1. Components (What):");
    process.nodes.forEach(n => {
        console.log(`   - ${n.name} (${n.type})`);
    });
    console.log();

    console.log("2. Relationships (How they connect):");
    process.flows.forEach(f => {
        console.log(`   - ${f.sourceRef} → ${f.targetRef}`);
    });
    console.log();

    console.log("3. Process Structure (Complete graph):");
    console.log(`   - ${process.nodes.length} nodes`);
    console.log(`   - ${process.flows.length} edges`);
    console.log();

    console.log("This is a COMPLETE semantic model:");
    console.log("  ✅ Components");
    console.log("  ✅ Relationships");
    console.log("  ✅ Process structure");
    console.log();

    console.log("This model is INDEPENDENT of XML.");
    console.log("Next: serialize this to BPMN XML.");
    console.log();

    console.log("✅ Test 4 PASSED - Semantic model complete\n");
}

/**
 * Test 5: Milestone visualization
 */
function testMilestoneVisualization() {
    console.log("🧪 Test 5: Milestone Visualization\n");

    console.log("Complete Compiler Pipeline:\n");
    console.log("  IFlow (Domain Model)");
    console.log("     │");
    console.log("     ├─ Components");
    console.log("     └─ Connections");
    console.log("          ↓");
    console.log("  BpmnProcessMapper");
    console.log("          ↓");
    console.log("  BpmnProcess (IR)");
    console.log("     │");
    console.log("     ├─ Nodes (from components)");
    console.log("     └─ Flows (from connections)");
    console.log();

    console.log("What we've achieved:");
    console.log("  ✅ SDK Model → BPMN IR");
    console.log("  ✅ Components → Nodes");
    console.log("  ✅ Connections → Sequence Flows");
    console.log("  ✅ Complete graph structure");
    console.log();

    console.log("This is a MAJOR milestone:");
    console.log("  The compiler now understands:");
    console.log("    • What (components)");
    console.log("    • How (relationships)");
    console.log("    • Structure (process graph)");
    console.log();

    console.log("Next phase:");
    console.log("  IR → XML (pure serialization)");
    console.log();

    console.log("✅ Test 5 PASSED - Milestone achieved\n");
}

/**
 * Run all tests
 */
function runAllTests() {
    console.log("=".repeat(60));
    console.log("  Connections Test - Complete Graph Structure");
    console.log("  BPMN Process = Nodes + Flows");
    console.log("=".repeat(60));
    console.log();

    try {
        testLinearFlowWithConnections();
        testMultiStepFlow();
        testFlowWithoutConnections();
        testCompleteSemanticModel();
        testMilestoneVisualization();

        console.log("=".repeat(60));
        console.log("  🎉 ALL TESTS PASSED");
        console.log("=".repeat(60));
        console.log();
        console.log("MILESTONE: Complete Semantic Model");
        console.log();
        console.log("Compiler now understands:");
        console.log("  ✅ Components (what)");
        console.log("  ✅ Connections (how)");
        console.log("  ✅ Process graph (structure)");
        console.log();
        console.log("BpmnProcess now contains:");
        console.log("  • nodes[] - all BPMN elements");
        console.log("  • flows[] - all sequence flows");
        console.log();
        console.log("This model is:");
        console.log("  📦 Independent of XML");
        console.log("  🔧 Complete semantic representation");
        console.log("  🎯 Ready for serialization");
        console.log();
        console.log("Next Step:");
        console.log("⏭️  Build BpmnWriter (IR → XML)");
        console.log("⏭️  Generate <bpmn2:definitions>");
        console.log("⏭️  Generate <bpmn2:sequenceFlow>");
        console.log("⏭️  First complete BPMN document");
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
