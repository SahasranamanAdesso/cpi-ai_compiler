/**
 * PromptBuilder - Constructs prompts for AI-generated Integration Flow code
 *
 * This class builds the system prompt that instructs the LLM to generate
 * valid TypeScript using the SAP Integration SDK.
 *
 * Responsibilities:
 * - Document supported SDK components
 * - Provide examples of valid SDK usage
 * - Instruct LLM to ONLY generate TypeScript (never XML/BPMN)
 * - Ensure output is executable TypeScript code
 *
 * Non-Responsibilities:
 * - Validating generated code (SDKValidator handles this)
 * - Invoking the LLM (AIProvider handles this)
 * - Compiling the code (Compiler handles this)
 *
 * The prompt is designed to minimize hallucinations and ensure
 * the LLM generates code that will compile successfully.
 */
export class PromptBuilder {

    /**
     * Builds a complete prompt for generating Integration Flow TypeScript
     *
     * The prompt includes:
     * - Instructions to generate ONLY TypeScript (no XML/BPMN)
     * - Documentation of supported components
     * - Example code patterns
     * - User's natural language requirement
     *
     * @param userRequest - Natural language description of desired Integration Flow
     * @returns Complete prompt ready to send to LLM
     *
     * @example
     * const builder = new PromptBuilder();
     * const prompt = builder.build("Create a flow that receives HTTPS requests and logs the body");
     * // Returns complete prompt with system instructions + user request
     */
    build(userRequest: string): string {
        return `${this.getSystemInstructions()}

${this.getSupportedComponents()}

${this.getExamples()}

${this.getUserInstructions(userRequest)}`;
    }

    /**
     * System-level instructions for the LLM
     *
     * Critical constraints:
     * - Generate ONLY TypeScript
     * - Use ONLY the SAP Integration SDK classes
     * - Never generate XML, BPMN, or ZIP files
     * - Never use Markdown code blocks
     * - Return executable TypeScript only
     */
    private getSystemInstructions(): string {
        return `You are a TypeScript code generator for SAP Cloud Integration.

CRITICAL RULES:
1. Generate ONLY TypeScript code using the SAP Integration SDK
2. NEVER generate XML, BPMN, or ZIP files
3. NEVER use Markdown code blocks (\`\`\`typescript)
4. NEVER add explanations or comments outside the code
5. Return ONLY executable TypeScript that can be directly compiled
6. Use ONLY the components documented below (no others exist)

The TypeScript you generate will be compiled by a separate compiler.
Your ONLY job is to generate valid TypeScript using the SDK.`;
    }

    /**
     * Documents all currently supported components
     *
     * Version 1.0 supports:
     * - IFlow (main flow container)
     * - Component (generic component with type)
     * - Connection (connects components)
     *
     * Version 1.0 component types:
     * - "Enricher" (Content Modifier)
     *
     * HTTPS Sender and HTTP Receiver are automatically added by the compiler.
     */
    private getSupportedComponents(): string {
        return `SUPPORTED SDK CLASSES (Version 1.0):

1. IFlow - Main Integration Flow container
   Constructor: new IFlow(name: string)
   Methods:
   - addComponent(component: Component): IFlow
   - connect(from: Component, to: Component): IFlow
   - getComponents(): Component[]
   - getConnections(): Connection[]

2. Component - Generic CPI component
   Constructor: new Component(id: string, name: string, componentType: string)
   Properties:
   - id: string (unique identifier, e.g., "CallActivity_1")
   - name: string (display name, e.g., "Set Body")
   - componentType: string (technical type)
   - properties: Record<string, any> (component-specific properties)

SUPPORTED COMPONENT TYPES (Version 1.0):

1. "Enricher" - Content Modifier
   Used for: Modifying message body, headers, properties
   Properties:
   - bodyType: "constant" (only supported type in v1.0)
   - body: string (message body content)

   Example:
   const modifier = new Component("CallActivity_1", "Set Body", "Enricher");
   modifier.properties.bodyType = "constant";
   modifier.properties.body = "Hello from SAP Integration Suite!";

AUTOMATICALLY ADDED (do NOT create these):
- HTTPS Sender (added by compiler)
- HTTP Receiver (added by compiler)
- Start Event (added by compiler)
- End Event (added by compiler)

The compiler automatically adds sender and receiver adapters.
You only need to add processing components (Content Modifier, etc.).`;
    }

    /**
     * Provides example patterns for common Integration Flows
     */
    private getExamples(): string {
        return `EXAMPLE PATTERNS:

Example 1: Simple message modification
const flow = new IFlow("MessageModifier");
const modifier = new Component("CallActivity_1", "Set Body", "Enricher");
modifier.properties.bodyType = "constant";
modifier.properties.body = "Modified message content";
flow.addComponent(modifier);
export default flow;

Example 2: Multiple processing steps
const flow = new IFlow("MultiStep");

const step1 = new Component("CallActivity_1", "Add Timestamp", "Enricher");
step1.properties.bodyType = "constant";
step1.properties.body = "Step 1 completed";

const step2 = new Component("CallActivity_2", "Add Metadata", "Enricher");
step2.properties.bodyType = "constant";
step2.properties.body = "Step 2 completed";

flow.addComponent(step1);
flow.addComponent(step2);
flow.connect(step1, step2);

export default flow;

IMPORTANT:
- Always export default flow
- Component IDs must be unique
- Use "CallActivity_X" naming convention for component IDs
- componentType must be one of the supported types above`;
    }

    /**
     * Formats the user's request into the prompt
     */
    private getUserInstructions(userRequest: string): string {
        return `USER REQUEST:
${userRequest}

Generate the TypeScript code using the SAP Integration SDK.
Return ONLY the TypeScript code, no explanations.`;
    }
}
