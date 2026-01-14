# Product Guidelines - Housing Project Management System

## Documentation Standards
- **Detailed and Formal Documentation:** All API documentation, technical guides, and internal logic descriptions must be comprehensive. They should include exhaustive examples, edge-case handling, and architectural context to support long-term enterprise maintenance and knowledge transfer.

## Communication Style & Tone
- **Professional and Explicit Messaging:** System-generated messages, error responses, and logs must be clear and explicit. Avoid ambiguity by using standard error codes and providing specific details on what triggered an event or failure, ensuring that administrators and developers can diagnose issues quickly.

## Architectural Principles
- **Data Integrity and Auditability:** The system must enforce strict validation rules. Every sensitive change (financial data, inventory shifts, HR records) must be traceable via a robust audit log to ensure accountability and prevent data corruption.
- **Modularity and Scalability:** The backend should be designed using modular patterns (e.g., Strapi plugins, decoupled services). This ensures that new features—such as additional housing project modules or financial tools—can be integrated without disrupting existing core functionality.

## Access and Security Guidelines
- **Strict Role-Based Access Control (RBAC):** Security and data privacy are paramount. Documentation and system design must emphasize clear boundaries between departments (Finance, HR, Sales, Construction). Access to sensitive data must be explicitly granted based on the user's role to maintain operational security and regulatory compliance.
