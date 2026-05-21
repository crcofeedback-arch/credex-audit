\# Tests for Audit Engine



\## Test 1: Cursor Business downgrade

\- \*\*Input\*\*: Business plan, 2 seats, $80/month

\- \*\*Expected\*\*: Suggest Pro plan, save $40/month

\- \*\*Result\*\*: ✅ PASS - Recommendation shows "Switch to Pro plan"



\## Test 2: GitHub Copilot Business downgrade  

\- \*\*Input\*\*: Business plan, 2 seats, $38/month

\- \*\*Expected\*\*: Suggest Individual plan, save $18/month

\- \*\*Result\*\*: ✅ PASS - Recommendation shows "Individual plan"



\## Test 3: Claude Team downgrade

\- \*\*Input\*\*: Team plan, 2 seats, $60/month

\- \*\*Expected\*\*: Suggest Pro plan, save $20/month

\- \*\*Result\*\*: ✅ PASS - Recommendation shows "Pro plan"



\## Test 4: Total spend calculation

\- \*\*Input\*\*: Multiple tools with different spends

\- \*\*Expected\*\*: Correct sum of all tool costs

\- \*\*Result\*\*: ✅ PASS - Total shows correct sum



\## Test 5: Zero spend tools

\- \*\*Input\*\*: All tools set to $0

\- \*\*Expected\*\*: Total spend $0, no false savings

\- \*\*Result\*\*: ✅ PASS - Shows $0 total



\## How to run tests manually:

1\. Open the app at http://localhost:3000

2\. Fill form with test data

3\. Click "Run Audit"

4\. Verify results match expected output

