import { IFlowDefinition } from "./domain/IFlowDefinition";
import { IFlow } from "./model/IFlow";
import { Component } from "./model/Component";

console.log("=== Step 10: Generic Component Model (Metadata-Driven) ===\n");

// Domain Layer - What developers write
console.log("1️⃣ Domain Layer (Developer API):\n");

const flowDef = new IFlowDefinition("SalesOrderSync")
    .sender("HTTPS")
    .contentModifier({
        headers: {
            Country: "IN",
            CurrentDate: "${date:now:yyyy-MM-dd}"
        }
    })
    .receiver("HTTPS");

console.log("✅ Developer writes clean, CPI-native code");
console.log(`   Flow: ${flowDef.name}`);
console.log(`   Sender: ${flowDef.getSender()?.adapter}`);
console.log(`   Steps: ${flowDef.getProcess().getSteps().length}`);
console.log(`   Receiver: ${flowDef.getReceiver()?.adapter}`);

// Compiler Layer - Internal Representation
console.log("\n2️⃣ Compiler Layer (Internal Representation):\n");

const ir = new IFlow("SalesOrderSync");

// Content Modifier as generic component
const contentModifier = new Component(
    "CMP_1",
    "Set Country Header",
    "Enricher",
    {
        headers: {
            Country: "IN",
            CurrentDate: "${date:now:yyyy-MM-dd}"
        }
    }
);

// Router as generic component
const router = new Component(
    "CMP_2",
    "Route by Country",
    "Router",
    {
        condition: "${header.Country} == 'IN'"
    }
);

// Groovy Script as generic component
const groovy = new Component(
    "CMP_3",
    "Transform Data",
    "GroovyScript",
    {
        script: "transform.groovy"
    }
);

ir.addComponent(contentModifier)
  .addComponent(router)
  .addComponent(groovy)
  .connect(contentModifier, router)
  .connect(router, groovy);

console.log("✅ Compiler uses generic Component metadata:");
console.log(`   Total Components: ${ir.getComponents().length}`);
console.log(`   Total Connections: ${ir.getConnections().length}\n`);

ir.getComponents().forEach((comp, i) => {
    console.log(`   Component ${i + 1}:`);
    console.log(`     ID: ${comp.id}`);
    console.log(`     Name: ${comp.name}`);
    console.log(`     Type: ${comp.componentType}`);
    console.log(`     Props: ${JSON.stringify(comp.properties, null, 6)}\n`);
});

console.log("🎯 Key Insight:");
console.log("   ONE Component class handles ALL CPI element types!");
console.log("   - Content Modifier → componentType: 'Enricher'");
console.log("   - Router → componentType: 'Router'");
console.log("   - Groovy → componentType: 'GroovyScript'");
console.log("\n   Future-proof: New SAP adapters = just new componentType values");
console.log("\n🚀 Next: Generate BPMN <callActivity> from Component metadata");
