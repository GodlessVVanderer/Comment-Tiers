# Privacy Policy for Comment Tiers Extension

**Last Updated:** [Date]

Thank you for using Comment Tiers. This privacy policy explains what information the extension handles and why.

## 1. No Data Collection

Comment Tiers is designed with your privacy in mind. The extension **does not collect, store, transmit, or sell any of your personal information or browsing data.**

- We do not track your browsing history.
- We do not know what videos you analyze.
- We do not have access to your YouTube or Google account.

## 2. API Key Storage

The extension requires you to provide your own API keys for the YouTube Data API and the Google Gemini API to function.

- **Local Storage Only:** These keys are stored exclusively in your browser's local, secure storage (`chrome.storage.local`).
- **No Transmission:** Your API keys are **never** sent to any server other than the official Google APIs they are intended for (YouTube and Google AI). They are not visible to us or any other third party.

## 3. Permissions

The extension requests the minimum permissions necessary to function:

- **`storage`**: To save your API keys locally on your device.
- **`activeTab`**: To know which YouTube video you are currently watching so it can inject the analysis tool.
- **`notifications`**: To inform you when a long analysis is complete.
- **`host_permissions` ("https://www.youtube.com/*")**: To inject the "Analyze" button and UI onto YouTube pages.

## 4. Changes to This Policy

We may update this privacy policy in the future. Any changes will be reflected in a new version of the extension.

## 5. Contact Us

If you have any questions about this privacy policy, please open an issue on our [GitHub repository](https://github.com/google/aistudio-web).
