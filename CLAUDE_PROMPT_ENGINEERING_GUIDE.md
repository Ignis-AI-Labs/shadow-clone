# Claude Prompt Engineering Guide
*A comprehensive reference for creating effective prompts for Claude and other LLMs*

## 🎯 Core Principles

### 1. **Sequential Processing & Structure**
- Claude reads prompts **top-to-bottom sequentially**
- Place context/documents **FIRST**, queries **LAST**
- For 20K+ token contexts, early placement improves quality by up to 30%

### 2. **Be Explicitly Clear**
- Write as if instructing a "brilliant but new employee with amnesia"
- Provide **step-by-step instructions**
- Include **context** about purpose, audience, and desired outcome
- **Golden Rule**: If a human colleague would be confused, so will Claude

### 3. **Provide Motivation & Context**
```
❌ BAD:  "Never use ellipses"
✅ GOOD: "Avoid ellipses because the output will be read by a text-to-speech engine that cannot pronounce them"
```

### 4. **Use Positive Framing**
- Tell Claude what **TO DO**, not what to avoid
- Focus on desired behaviors, not restrictions

## 📋 Optimal Prompt Structure

```xml
<task>
  <context>
    Background information about the task
    Why this task is important
    Who will use the output
  </context>
  
  <documents>
    <document index="1">
      <source>filename.pdf</source>
      <content>Document content here</content>
    </document>
  </documents>
  
  <instructions>
    1. First step with clear action
    2. Second step with expected outcome
    3. Third step with specific details
  </instructions>
  
  <examples>
    <example>
      <input>Sample input</input>
      <output>Expected output format</output>
    </example>
  </examples>
  
  <query>Your specific question or request</query>
</task>
```

## 🛠️ Essential Techniques

### 1. **Multishot Prompting**
Provide 2-5 examples demonstrating the exact format and style you want:
```xml
<examples>
  <example>
    <scenario>User asks about pricing</scenario>
    <response>Our pricing starts at $99/month for the basic plan...</response>
  </example>
</examples>
```

### 2. **Chain of Thought (CoT)**
For complex tasks requiring reasoning:
```xml
<instructions>
  Think through this step-by-step:
  1. First, analyze the requirements
  2. Then, identify potential solutions
  3. Evaluate each solution's pros and cons
  4. Finally, recommend the best approach
</instructions>
```

### 3. **Response Prefilling**
Guide output format by starting Claude's response:
```
Human: Generate a JSON configuration file for the database.
Assistant: ```json
{
  "database": {
```

### 4. **Role Assignment**
Give Claude a specific persona when it helps:
```xml
<role>
You are an experienced Python developer with expertise in Django and REST APIs.
Focus on clean, maintainable code following PEP 8 standards.
</role>
```

## 🚀 Claude 4 Specific Optimizations

### 1. **Be More Explicit**
Claude 4 requires more detailed instructions than previous versions:
```
❌ BAD: "Create an analytics dashboard"
✅ GOOD: "Create an analytics dashboard. Include as many relevant features and interactions as possible. Add hover states, transitions, and data filtering options."
```

### 2. **Use Motivational Language**
For code generation and creative tasks:
- "Don't hold back. Give it your all."
- "Be comprehensive and thorough"
- "Include all relevant features and edge cases"

### 3. **Parallel Tool Execution**
```xml
<instructions>
For maximum efficiency, invoke all relevant tools simultaneously rather than sequentially.
</instructions>
```

## ❌ Common Mistakes to Avoid

1. **Placing queries before context** - Always put documents/context first
2. **Being vague** - Replace "improve this" with specific requirements
3. **Using negative instructions** - Say what to do, not what to avoid
4. **Missing context** - Always explain why and for whom
5. **Assuming knowledge** - Provide all necessary information explicitly
6. **Over-optimization** - Avoid prompts that encourage test-specific solutions
7. **Ignoring structure** - Use XML tags to organize complex prompts
8. **Forgetting examples** - Show, don't just tell

## 🔧 Advanced Techniques

### 1. **Quote Extraction for Long Documents**
```xml
<instructions>
First, extract relevant quotes from the documents that relate to [topic].
Place these quotes in <quotes> tags.
Then, use these quotes to answer the question.
</instructions>
```

### 2. **Prompt Chaining**
Break complex tasks into sequential prompts:
```
Prompt 1: Analyze requirements and create plan
Prompt 2: Implement based on the plan
Prompt 3: Review and optimize the implementation
```

### 3. **Temperature Control**
- Lower temperature (0.0-0.3): Factual, deterministic tasks
- Medium temperature (0.4-0.7): Balanced creativity and accuracy
- Higher temperature (0.8-1.0): Creative, varied outputs

## 📊 Output Control Techniques

### For Structured Data:
```xml
<output_format>
Return results as a JSON object with the following structure:
{
  "summary": "Brief overview",
  "details": ["item1", "item2"],
  "confidence": 0.95
}
</output_format>
```

### For Analysis Tasks:
```xml
<analysis_structure>
1. Executive Summary (2-3 sentences)
2. Key Findings (bullet points)
3. Supporting Evidence (with citations)
4. Recommendations (actionable items)
</analysis_structure>
```

## 🧪 Testing & Iteration

### 1. **Define Success Criteria**
- What makes a good response?
- What edge cases need handling?
- What format is required?

### 2. **Test Systematically**
```
1. Start with a basic prompt
2. Test with diverse inputs
3. Identify failure patterns
4. Refine based on results
5. Document what works
```

### 3. **Version Control Your Prompts**
- Save working versions
- Document changes and why
- Track performance improvements

## 💻 Task-Specific Guidelines

### For Code Generation:
```xml
<code_requirements>
- Language: Python 3.11+
- Style: PEP 8 compliant
- Include: Type hints, docstrings, error handling
- Testing: Include unit tests with pytest
- Performance: Optimize for readability first, then speed
</code_requirements>
```

### For Analysis:
```xml
<analysis_guidelines>
- Be objective and data-driven
- Consider multiple perspectives
- Cite sources when referencing documents
- Acknowledge uncertainties
- Provide actionable insights
</analysis_guidelines>
```

### For Creative Tasks:
```xml
<creative_guidelines>
- Target audience: [specific demographic]
- Tone: [professional/casual/friendly]
- Length: [word/character count]
- Include: [specific elements]
- Avoid: [specific elements]
</creative_guidelines>
```

## ✅ Quick Reference Checklist

Before finalizing any prompt, verify:

- [ ] Context/documents placed before queries
- [ ] Clear, step-by-step instructions provided
- [ ] Purpose and audience explained
- [ ] Examples included (if helpful)
- [ ] XML tags used for structure
- [ ] Positive framing used
- [ ] Output format specified
- [ ] Success criteria defined
- [ ] Edge cases considered
- [ ] Tested with minimal context

## 📈 Performance Tips

1. **Front-load important information** - Critical context in first 1000 tokens
2. **Use consistent formatting** - Same structure across similar prompts
3. **Batch related queries** - Combine when logical
4. **Leverage Claude's memory** - Reference earlier parts of conversation
5. **Be specific about length** - "Write 200-300 words" vs "Write a brief summary"

## 🔄 When to Use Prompt Engineering vs Fine-Tuning

**Use Prompt Engineering when you need:**
- Rapid iteration and testing
- Flexibility to change requirements
- General knowledge preservation
- Cost-effective solution
- Transparent, debuggable process

**Consider Fine-Tuning when you have:**
- Large amounts of specialized data
- Very specific output requirements
- Performance constraints
- Repetitive, narrow tasks

---

*Remember: Good prompts are clear, structured, and purposeful. When in doubt, be more explicit!*