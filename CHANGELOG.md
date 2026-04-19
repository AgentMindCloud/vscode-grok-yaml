# Changelog

All notable changes to the **GrokInstall YAML** VS Code extension are
documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-04-19

### Added
- Initial public release.
- Language contribution for `grok-yaml` with YAML-derived grammar and
  highlighting of Grok top-level keys and kinds.
- JSON-schema-backed validation for 14 GrokInstall spec kinds: Agent,
  Workflow, Tool, Prompt, Model, Memory, MCPServer, Task, Pipeline,
  Policy, Dataset, Evaluation, Environment, Deployment.
- Commands: `Grok YAML: Validate Current File`,
  `Grok YAML: Scan Workspace for Grok Specs`,
  `Grok YAML: Generate New Agent Spec`.
- Brand-locked extension icon and marketplace gallery banner.
- Configuration: `grokYaml.validation.enabled`, `grokYaml.scan.exclude`.
