# YouTube Comment Forum Extension

This Chrome Extension analyzes YouTube comments using the Google Gemini API and presents them in an interactive, forum-style interface. It uses a secure Google Sign-In (OAuth 2.0) flow to handle authentication, so users do not need to manage API keys manually.

## 🚨 Critical Setup: Google Cloud OAuth 2.0 Client ID

Before this extension will work, you **MUST** create a Google Cloud project and generate an OAuth 2.0 Client ID.

### Step-by-Step Guide:

1.  **Go to the Google Cloud Console:**
    *   Navigate to [https://console.cloud.google.com/](https://console.cloud.google.com/).

2.  **Create a New Project:**
    *   Click the project dropdown at the top of the page and click **"New Project"**.
    *   Give it a name (e.g., "YouTube Forum Extension") and click **"Create"**.

3.  **Enable the Gemini API:**
    *   In the search bar at the top, search for **"Generative Language API"** and select it.
    *   Click the **"Enable"** button. Wait for it to finish.

4.  **Configure the OAuth Consent Screen:**
    *   In the search bar, search for **"OAuth consent screen"** and select it.
    *   Choose **"External"** for the User Type and click **"Create"**.
    *   Fill out the required fields:
        *   **App name:** "YouTube Comment Forum"
        *   **User support email:** Your email address.
        *   **Developer contact information:** Your email address.
    *   Click **"Save and Continue"** on the Scopes, Test Users, and Summary pages. You do not need to add scopes or test users here.
    *   Finally, click **"Publish App"** and confirm. This makes the consent screen available to any Google user.

5.  **Create the OAuth 2.0 Client ID:**
    *   In the search bar, search for **"Credentials"** and select it.
    *   Click **"+ CREATE CREDENTIALS"** at the top and choose **"OAuth client ID"**.
    *   For **"Application type"**, select **"Chrome App"**.
    *   Give it a name (e.g., "YouTube Forum Client").
    *   For **"Application ID"**, you need your extension's ID. To get it:
        *   Load the unpacked extension into Chrome (with your current code).
        *   Go to `chrome://extensions`.
        *   Find your extension and copy the **ID** (it's a long string of letters).
        *   Paste this ID into the "Application ID" field.
    *   Click **"Create"**.

6.  **Update the `manifest.json` file:**
    *   A popup will show your **Client ID**. Copy it.
    *   Open the `manifest.json` file in your project.
    *   Replace the placeholder `YOUR_GOOGLE_CLOUD_CLIENT_ID.apps.googleusercontent.com` with the Client ID you just copied.

    ```json
    "oauth2": {
      "client_id": "PASTE_YOUR_CLIENT_ID_HERE.apps.googleusercontent.com",
      // ...
    }
    ```

7.  **Reload the Extension:**
    *   Go back to `chrome://extensions`.
    *   Click the "reload" icon for your extension.

The extension should now be fully functional.

## How to Use

1.  Navigate to any YouTube video page.
2.  Click the extension icon in your Chrome toolbar.
3.  Click **"Sign In with Google"** and complete the authentication flow.
4.  Once signed in, click **"Analyze / Toggle Forum"**.
5.  The extension will extract the comments, send them for analysis, and then replace the standard YouTube comment section with an interactive, categorized forum view.
