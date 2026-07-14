import { Component } from "../../model/Component";
import { CompilerRule, IRNode } from "../CompilerRule";

/**
 * ContentModifierRule - Compiles Content Modifier components to IR
 *
 * In CPI, a Content Modifier is represented in BPMN as a callActivity
 * with activityType="Enricher".
 *
 * From the .iflw artifact analysis, we know that Content Modifiers:
 * - Use <callActivity> element in BPMN
 * - Have bpmn2:activityType="Enricher"
 * - Store configuration in <extensionElements>
 * - Support headers, body, and exchange properties
 *
 * Example BPMN structure this rule targets:
 *
 * <callActivity id="CallActivity_1" name="Content Modifier">
 *   <extensionElements>
 *     <ifl:property>
 *       <key>activityType</key>
 *       <value>Enricher</value>
 *     </ifl:property>
 *     <!-- Headers, body modifications, etc. -->
 *   </extensionElements>
 * </callActivity>
 *
 * This rule compiles a Component with type "Enricher" to an IRNode
 * representing that structure (but not yet in XML form).
 */
export class ContentModifierRule implements CompilerRule {
    /**
     * This rule supports components of type "Enricher"
     *
     * @param componentType - The component type from Component.componentType
     * @returns true if componentType is "Enricher"
     */
    supports(componentType: string): boolean {
        return componentType === "Enricher";
    }

    /**
     * Compiles a Content Modifier component to its Intermediate Representation
     *
     * The IR describes the BPMN structure without being XML:
     * - element: "callActivity" (the BPMN element type)
     * - activityType: "Enricher" (CPI-specific activity type)
     * - name: display name in CPI
     * - id: unique identifier
     * - properties: configuration (headers, body, etc.)
     *
     * Later, an XMLWriter will convert this IR to actual BPMN XML.
     *
     * @param component - The Component to compile (must have type "Enricher")
     * @returns IRNode representing the Content Modifier in BPMN
     *
     * @example
     * const component = new Component(
     *     "CMP_1",
     *     "Set Country Header",
     *     "Enricher",
     *     { headers: { Country: "IN" } }
     * );
     *
     * const rule = new ContentModifierRule();
     * const ir = rule.compile(component);
     *
     * // ir = {
     * //     element: "callActivity",
     * //     activityType: "Enricher",
     * //     name: "Set Country Header",
     * //     id: "CMP_1",
     * //     properties: { headers: { Country: "IN" } }
     * // }
     */
    compile(component: Component): IRNode {
        // Validate that this is actually an Enricher component
        if (!this.supports(component.componentType)) {
            throw new Error(
                `ContentModifierRule cannot compile component type: ${component.componentType}. ` +
                `Expected: "Enricher"`
            );
        }

        // Build the Intermediate Representation
        const irNode: IRNode = {
            element: "callActivity",
            activityType: "Enricher",
            name: component.name,
            id: component.id,
            properties: component.properties
        };

        return irNode;
    }
}

/**
 * Usage example:
 *
 * // Create a Content Modifier component
 * const contentModifier = new Component(
 *     "ContentModifier_1",
 *     "Add Headers",
 *     "Enricher",
 *     {
 *         headers: {
 *             Country: "IN",
 *             Source: "SAP"
 *         },
 *         body: {
 *             type: "constant",
 *             value: '{"status": "processed"}'
 *         }
 *     }
 * );
 *
 * // Compile to IR
 * const compiler = new Compiler();
 * compiler.register(new ContentModifierRule());
 *
 * const flow = new IFlow("Test Flow");
 * flow.addComponent(contentModifier);
 *
 * const ir = compiler.compile(flow);
 * console.log(ir[0]);
 * // {
 * //   element: "callActivity",
 * //   activityType: "Enricher",
 * //   name: "Add Headers",
 * //   id: "ContentModifier_1",
 * //   properties: {
 * //     headers: { Country: "IN", Source: "SAP" },
 * //     body: { type: "constant", value: '{"status": "processed"}' }
 * //   }
 * // }
 *
 * Next step: Create an XMLWriter that converts IRNode[] to BPMN XML
 */
