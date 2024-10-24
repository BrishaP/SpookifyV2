# Spookify

Spookify is a Halloween-themed web application that helps users discover spooky recipes, fun DIY activities, and effortless party planning tips. The app features tailored suggestions based on user input.

## Links to:
- **Deployed app:** https://vercel.com/api/toolbar/link/spookify-v2.vercel.app?via=project-dashboard-alias-list&p=1&page=/

**If you encounter any issues with the deployed app, please note that it may be due to the API key usage or subscription having expired, instead login using the details:   
email: demo2@gmail.com  
 Password: password  
  and have a look at the saved searches section instead while I work on fixing the AI API Key**

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Database Schemas](#database-schemas)
- [Contributing](#contributing)
- [License](#license)

## Features

- **AI-Powered Suggestions**: Get Halloween-themed recipes, DIY projects, and party ideas based on your input.
- **User Authentication**: Secure login and signup using Firebase.
- **Save Searches**: Save your favorite searches for easy access later.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/spookify.git
    cd spookify
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Set up your Firebase account and create the necessary configuration.
4. Create two Supabase tables with the following schemas:
    - **Users Table**:
      ```json
      [
        {
          "id": "UUID",
          "email": "String",
          "created_at": "Timestamp",
          "firebase_uid": "String"
        }
      ]
      ```
    - **Saved_searches**:
      ```json
      [
        {
          "id": "UUID",
          "user_id": "UUID (Foreign Key)",
          "search_date": "Timestamp",
          "title": "String",
          "items_needed": "String",
          "response_instructions": "String"
        }
      ]
      ```

## Usage

Once the installation is complete, you can run the application locally:

```bash
npm start
