import { Component } from "../model/Component";

/**
 * Intermediate Representation (IR) Node
 *
 * This is the output of a CompilerRule - a language-neutral representation
 * of a BPMN element that can later be serialized to XML or other formats.
 *
 * The IR separates the compilation logic from the output format, making it
 * possible to generate:
 * - BPMN XML (for CPI)
 * - Documentation
 * - Visual diagrams
 * - Validation reports
 *
 * from the same intermediate representation.
 */
export interface IRNode {
    /**
     * The BPMN element type (e.g., "callActivity", "exclusiveGateway", "scriptTask")
     */
    element: string;

    /**
     * The activity type for callActivity elements (e.g., "Enricher", "Router")
     * Maps to bpmn2:activityType attribute in CPI BPMN
     */
    activityType?: string;

    /**
     * The name/label displayed in CPI
     */
    name: string;

    /**
     * The unique ID for this element
     */
    id: string;

    /**
     * Component-specific properties that will be mapped to extensionElements
     */
    properties?: Record<string, any>;

    /**
     * Child elements (for complex structures)
     */
    children?: IRNode[];
}

/**
 * CompilerRule - Interface for component-to-IR compilation rules
 *
 * Each CPI component type (Content Modifier, Router, Groovy, etc.) has
 * its own CompilerRule that knows how to convert it to IR.
 *
 * This follows the Strategy pattern:
 * - Compiler delegates to the appropriate rule based on componentType
 * - Each rule encapsulates the conversion logic for one component type
 * - Adding a new component type = adding a new rule (no changes to Compiler)
 *
 * Architecture:
 *   Component → CompilerRule → IRNode → XMLWriter → BPMN XML
 *
 * Example flow:
 *   Component{type: "Enricher"} → ContentModifierRule → IRNode{element: "callActivity"}
 *   Component{type: "Router"} → RouterRule → IRNode{element: "exclusiveGateway"}
 */
export interface CompilerRule {
    /**
     * Determines if this rule can compile the given component type
     *
     * @param componentType - The component type from Component.componentType
     * @returns true if this rule handles this component type
     *
     * @example
     * // ContentModifierRule
     * supports(componentType: string): boolean {
     *     return componentType === "Enricher";
     * }
     */
    supports(componentType: string): boolean;

    /**
     * Compiles a Component to its Intermediate Representation (IR)
     *
     * The IR is a structured object that describes the BPMN element without
     * being tied to XML syntax. This allows the same IR to be used for:
     * - XML generation
     * - Documentation
     * - Validation
     * - Visualization
     *
     * @param component - The component to compile
     * @returns IR representation of the BPMN element
     *
     * @example
     * // ContentModifierRule compiling a Content Modifier
     * compile(component: Component): IRNode {
     *     return {
     *         element: "callActivity",
     *         activityType: "Enricher",
     *         name: component.name,
     *         id: component.id,
     *         properties: component.properties
     *     };
     * }
     */
    compile(component: Component): IRNode;
}
