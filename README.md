# Cloud-File-Flow
## Overview

Cloud File Flow is an AWS serverless project that accepts file uploads through a web interface and automatically processes file metadata using an event-driven architecture.

The project demonstrates how AWS services can work together to build a scalable file-ingestion workflow, with Terraform used to manage infrastructure as code..

---

## Features

* Secure File Uploads

* Automated Event Notifications

* Asynchronous Processing

* Metadata Storage

* API Integration

* End-to-End Testing

---

## Architecture Diagram

```mermaid
flowchart TD
    A[User / Web Browser] --> B[Website]
    B --> C[API Gateway]
    C --> D[AWS Lambda - Generate Presigned URL]
    D --> E[Amazon S3 - Presigned URL]
    B -->|Upload file using URL| E

    E -->|Object Created Event| F[Amazon SQS]
    F --> G[AWS Lambda - Process File Event]
    G --> H[Amazon DynamoDB - File Metadata]

    style A fill:#E8F1FF,stroke:#3973AC,color:#111
    style B fill:#E8F1FF,stroke:#3973AC,color:#111
    style C fill:#FCE8D5,stroke:#C77724,color:#111
    style D fill:#FCE8D5,stroke:#C77724,color:#111
    style E fill:#DDF4E4,stroke:#27834A,color:#111
    style F fill:#FCE8D5,stroke:#C77724,color:#111
    style G fill:#FCE8D5,stroke:#C77724,color:#111
    style H fill:#DDF4E4,stroke:#27834A,color:#111
```

