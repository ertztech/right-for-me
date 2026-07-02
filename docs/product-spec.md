# RightForMe Product Spec

## Mission

Help people apply to the right jobs faster by entering their career information once and generating tailored application materials from it.

## Core Principle

Enter career information once. Generate everything else.

## Primary User

A job seeker who wants to apply intentionally, not mass apply.

## Core Objects

### Career Vault

The single source of truth for a person's professional life.

The Career Vault contains:

- Personal information
- Work history
- Skills
- Tools & technologies
- Accomplishments
- Projects
- Stories
- Metrics
- Education
- Certifications

### Job Posting
The role description the user wants to evaluate or apply to.

### Resume Persona
A lens for tailoring the same career history toward a specific type of opportunity.

Initial personas:
- Enterprise Transformation
- Operational Excellence
- Builder / Software

### Resume
A tailored output generated from the Master Profile and selected persona.

### Cover Letter
A warm, friendly letter generated from the Master Profile and job posting.

### Application
A tracked job opportunity with status, notes, generated files, and follow-up actions.

## Current Scope

Issue #9 focuses only on Career Vault v1.

## Issue #9 Goals

- Store work history
- Store skills
- Store accomplishments
- Store tools
- Save locally
- Load existing profile

## Out of Scope for Issue #9

- Resume generation
- Cover letter generation
- PDF export
- LinkedIn import
- AI API calls