# Applications Tracker (React Version)

To track internship applications and placement applications

## Specification

- Track applications and store info about them
- Track tasks required for applications
- Track files attached to applications

### Database Specification

#### Applications
id, name, orgID, stage, info, link, locations, deadline_type, deadline, files

#### Organisations
orgID, name, logoURL

#### Tasks
id, applicationID, name, deadline, complete


## Tasks
1. Allow user to add applications
2. Allow user to edit applications
3. Allow user to add tasks
4. Allow user to edit tasks
5. Allow user to mark tasks as done