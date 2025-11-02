📄 Overview
This project contains a JMeter performance testing script for the JPetStore Demo Application.
The test simulates a user’s end-to-end shopping journey — from login to checkout — to evaluate the system’s performance under concurrent load.
The scenario was built as part of a performance testing task and focuses on measuring response times, throughput, and application stability under increasing user load.

⚙️ Scenario Description
Test Scenario Flow:
Open the JPetStore application homepage.
Log in using a pre-created user account.
Navigate to the Fish category.
Select a product by Product ID.
Add the product to the cart.
Proceed to Checkout.
Fill in checkout details.
Click Continue.
Confirm the order.

Note:
A Regular Expression Extractor is used to capture the dynamically generated Order ID, which is then reused in subsequent requests for validation.

🧰 Test Configuration
Ramp-up: 2 users every 2 seconds
Total Users: 10
Duration: 1 minute
SLA: Average response time ≤ 2 seconds across all transactions
Controller Type: Thread Group with ramp-up configuration
📊 Deliverables
JMeter .jmx test plan
Generated HTML performance report
Scenario designed and parameterized using CSV data (data/users.csv)

Project Structure 
performance-test-final/
├── data/
│   └── users.csv
├── master.jmx
├── README.md
└── .gitignore

🧠 Notes
The test plan was recorded and parameterized for reusability.
Reports and results folders are excluded from the repository to maintain lightweight project structure.
JMeter version: 5.6.3