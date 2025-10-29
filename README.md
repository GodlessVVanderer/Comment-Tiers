# Comment Tiers: On-Page YouTube Comment Analyzer

**Comment Tiers** is an intelligent Chrome extension that integrates directly into the YouTube interface. It adds a simple "Analyze" button that takes the video's comments, filters out spam, and categorizes them into forum-like tiers. This allows you to easily understand the key discussion topics without leaving the video page.

Powered by the Google Gemini API, this extension provides a high-level overview of comment sections, saving you from endlessly scrolling through noise and low-effort replies.

![Screenshot of the extension in action](assets/screenshot-1.png)
*(Replace with a real screenshot)*

## ✨ Why You'll Love It

- **Save Time:** Get the gist of a thousand comments in seconds. No more endless scrolling.
- **Discover Key Topics:** Instantly see the main themes, questions, and sentiments of the community.
- **Focus on Quality:** Smart filtering removes spam, bot comments, and low-effort replies so you only see what matters.
- **Seamless On-Page Experience:** An "Analyze" button appears directly on the YouTube video page. No more copy-pasting URLs.
- **Secure & Private:** Your API keys are stored securely in your browser and are never sent to us.

## 🚀 How to Install & Use

1.  **Download:** Download this repository as a ZIP file and unzip it to a permanent location on your computer.
2.  **Open Chrome Extensions:** Open Google Chrome, navigate to `chrome://extensions`, and turn on "Developer mode" in the top-right corner.
3.  **Load the Extension:** Click "Load unpacked" and select the `dist` folder that was created after you ran the build process. The "Comment Tiers" icon should now appear in your extension toolbar.
4.  **Set API Keys:** Click the Comment Tiers extension icon in your toolbar. This will open the **Settings page**. You will need two API keys:
    *   A **YouTube Data API v3 Key**. Get one from the [Google Cloud Console](https://console.cloud.google.com/).
    *   A **Google Gemini API Key**. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
5.  **Save Keys:** Paste your keys into the appropriate fields on the Settings page and click "Save".
6.  **Analyze!** Navigate to any YouTube video page. An "Analyze with Comment Tiers" button will appear above the comment section. Click it to begin.

## 🔒 Security Best Practices

To protect your API keys from misuse, we strongly recommend restricting them.

-   **For your YouTube API Key:** In the Google Cloud Console, under "API Restrictions," select "HTTP referrers (web sites)" and add an entry for `https://www.youtube.com/*`.
-   **For your Gemini API Key:** In the Google Cloud Console, navigate to your project and set up "Billing Alerts" to be notified of any unexpected usage.

## ✍️ Author

This application was created by **AI Studio**. We build tools to demonstrate the power and utility of modern AI.

## ⭐ Show Your Support

If you find this tool useful, please consider giving it a star on GitHub! Your support helps motivate us to build more amazing open-source projects.

[![GitHub stars](https://img.shields.io/github/stars/google/aistudio-web?style=social)](https://github.com/google/aistudio-web)

---

*This is a sample application and not an official Google product.*
