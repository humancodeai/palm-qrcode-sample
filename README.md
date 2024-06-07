**README**

## Project Description

This project provides a dual-platform experience, tailored separately for mobile devices and desktop computers, ensuring optimized user interfaces for each platform while maintaining a consistent server interaction flow for session validation and real-time palm authentication.

### Desktop Interface Workflow

#### Step 1: Session ID Validation
Initiates by sending a request to the server to validate the **session ID**. Upon receiving confirmation of its legitimacy, the process progresses to the next phase.

#### Step 2: QR Code Generation & Display
A **QR code** is dynamically generated, incorporating the validated session ID alongside pertinent **requester information**. This QR code is promptly displayed on the interface, ready for scanning.

#### Step 3: Real-Time Palm Verification Updates
Establishes a recurrent query to the server, at intervals of no less than **2 seconds**, to fetch the latest status of the palm verification process. Once the result is obtained, the querying ceases, and the outcome is promptly exhibited on the desktop interface.

### Mobile Interface Workflow

#### Step 1: Session ID Authentication
Similarly to the desktop flow, begins with a request to authenticate the **session ID** from the server. On validation, transitions to the subsequent step.

#### Step 2: App Launch Prompt & URL Scheme Handoff
Instead of displaying a QR code, presents options to either launch the associated app directly or download it if not installed. Tapping to launch the app employs a **URL scheme**, activating the installed app while passing along the session ID and requester details.

#### Step 3: Continuous Palm Verification Query
Similarly to the desktop flow, implements a continuous querying mechanism to the server, checking for palm verification results every **2 seconds** minimum. Upon reception of the verification outcome, halts further queries and exhibits the result within the mobile interface.

### Conclusion

By implementing distinct yet harmonious workflows for desktop and mobile platforms, this project caters to the unique requirements of each environment while maintaining a cohesive back-end process for secure session handling and real-time biometric authentication feedback. Whether accessing services via a computer or a mobile device, users can expect a seamless and secure experience tailored to their device's capabilities.
