![Theme Image](docs/images/theme_image.png "")

<h1 align="center">SiLA - Wombat</h1>


Welcome to our website repository! This repo is the implementation of the project SiLA (code: SI), associated with the course COMP90082_2024_SM1 of the University of Melbourne. It currently including the following folders:
1. docs: the documents related to our project are included in the "docs" folder, such as Project Personan, Goal Model and ER disgram.
2. src: the src folder serves as the primary container for our project's codebase, including both the client-side and server-side components.

# Updates
*22/03/2024 (Sprint 1)*

1. create `dev` branch for development environment.

*13/03/2024 (Sprint 1)*

1. Establish the repository's framework. 
2. update the ReadMe file.

# Introduction
This project aims to develop an Online Manuscript Submission and Peer Review Platform for the Studies in Language Assessment (SiLA) journal, operated by the Association for Language Testing and Assessment of Australia and New Zealand (ALTAANZ). The envisioned platform will replace the current email-based manuscript submission and review process with a comprehensive, streamlined, online system. This initiative seeks to enhance the efficiency of manuscript handling, review assignments, editorial decision-making, and communication among authors, reviewers, and editors.

# Stakeholder
| Name            | Role                | Email                         |
|-----------------|---------------------|-------------------------------|
| Dr Eduardo Oliveira | Lecturer            | eduardo.oliveira@unimelb.edu.au |
| Dr Lucy Sparrow    | Subject Coordinator | lucy.sparrow@unimelb.edu.au   |
| Lin Li            | Mentor              | lin.li1@unimelb.edu.au        |
| Jason Fan         | Client              | jinsong.fan@unimelb.edu.au    |

# Development Team
| Name            | Email               |
|-----------------|---------------------|
| Donghong Zhuang            | donghongz@student.unimelb.edu.au               |
| Jiayu Yang            | jiayuy7@student.unimelb.edu.au               |
| Jiajin Yang            | jiajiny@student.unimelb.edu.au               |
| Chuyuan Xu            | chuyuanx@student.unimelb.edu.au               |
| Yuxuan Zeng            | yuxuzeng@student.unimelb.edu.au               |
| Yizhi Liao            | yizliao@student.unimelb.edu.au               |

# Environment
1. React: is a popular JavaScript library for building user interfaces. It will be used to create dynamic and responsive UI components for the submission and review platform.
2. TypeScript: is a statically typed superset of JavaScript, providing enhanced tooling and type safety. It will help catch errors early in the development process and improve code maintainability.
3. C#: is a robust and versatile programming language, well-suited for building scalable and performant backend systems. It will be used to implement the server-side logic and data management for the submission and review platform.
4. Dot Net: is a cross-platform framework for building various types of applications, including web applications. It provides libraries and tools for rapid development and deployment of backend services.

## Additional Tools:
1. Version Control: Git
2. Hosting Service: AWS
3. Database: MySQL
4. Coonfluence: https://comp90082-2024-si-wombat.atlassian.net/wiki/spaces/comp900822/overview
5. Jira: https://wombat123.atlassian.net/jira/software/projects/SW/boards/1/backlog
6. Figma: https://www.figma.com/file/oMbonlnlEyznX9mb0iavh5/Untitled?type=design&node-id=0-1&mode=design&t=eSZnYcrKjV4Nbkrb-0
7. Slack: https://app.slack.com/client/T06MRJ4TK5J/C06MGFE9FHC

# Workflow
- master: The `master` branch is the primary branch where the source code reflects the production-ready state of this project. It is the definitive branch where code is fully tested, stable, and ready to be relseaed to end-users.
- dev: The `dev` branch serves as the active development branch where new features and fixes are integrated and tested. The beanch contains the latest ongooing work and once stable, changes are merged into the `master` branch for release.

## Branch Naming Cnventions
- Task Branches: Prefix with `task/` followed by a brief description of the feature, e.g., "task/login".
- Bug Fixes Branches: Use `bugfix/` along with the a short description, like bugfix/fix-login-error.

<!-- ## Instruction 
(this file must be updated at all times. please, make sure explain the github structure here and generate changelogs for each sprint before you tag it)

At the end of each sprint, generate a BASELINE TAG from your repository (master branch).

Format: COMP90082_2024_SM1_<TwoDigits>_<team>_BL_<sprint>
BL means BASELINE. A baseline is a reference point in the software development life cycle marked by the completion and formal approval of a set of predefined work products

Example of TAG in this subject: COMP90082_2024_SM1_CM_Wombat_BL_SPRINT1 -->

