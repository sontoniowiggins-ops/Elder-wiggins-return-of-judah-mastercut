# HOW TO SET UP GOOGLE DRIVE UPLOAD
# Do this ONE TIME. Then videos upload automatically.

================================================================
PART 1 — GET THE KEY FILE FROM GOOGLE (5 steps)
================================================================

STEP 1: Open this link in your browser
   https://console.cloud.google.com

   Sign in with your Google account.

----------------------------------------------------------------

STEP 2: Create a project
   - At the very top of the page, click where it says "Select a project"
   - Click "NEW PROJECT"
   - In the Name box type:  Return of Judah
   - Click CREATE
   - Wait a few seconds, then click "Select a project" again and pick "Return of Judah"

----------------------------------------------------------------

STEP 3: Turn on Google Drive
   - On the left side, click "APIs & Services"
   - Click "Enable APIs and Services"
   - In the search box type:  Google Drive API
   - Click it, then click the blue ENABLE button

----------------------------------------------------------------

STEP 4: Create a service account (this is like a robot account that uploads files)
   - On the left side click "APIs & Services" then "Credentials"
   - Click "Create Credentials" near the top
   - Choose "Service Account"
   - In the name box type:  uploader
   - Click CREATE AND CONTINUE
   - Click CONTINUE again
   - Click DONE

----------------------------------------------------------------

STEP 5: Download the key file
   - You are still on the Credentials page
   - Under "Service Accounts" you will see "uploader@..."  — click that
   - Click the KEYS tab
   - Click "ADD KEY" → "Create new key"
   - Make sure JSON is selected → click CREATE
   - A file downloads to your computer automatically

   NOW:
   - Find that downloaded file (it will have a long name like "return-of-judah-12345.json")
   - Rename it to:  service-account.json
   - Move it into this folder:  credentials/
     (the same folder where this README file lives)

================================================================
PART 2 — SHARE A DRIVE FOLDER WITH THE ROBOT ACCOUNT (3 steps)
================================================================

STEP 6: Open the service-account.json file you just put in credentials/
   (Open it with Notepad)
   Find the line that says "client_email" — it looks like this:
      "client_email": "uploader@return-of-judah-12345.iam.gserviceaccount.com"
   
   Copy that email address (everything between the quote marks, not the quotes).

----------------------------------------------------------------

STEP 7: Share a Google Drive folder with that email
   - Go to drive.google.com in your browser
   - Create a new folder called "Return of Judah Videos"
     (Right-click empty space → New Folder)
   - Right-click that folder → Share
   - Paste the email you copied in STEP 6
   - Change the role from "Viewer" to "Editor"
   - Click SEND

----------------------------------------------------------------

STEP 8: Copy the folder ID
   - Double-click your "Return of Judah Videos" folder to open it
   - Look at the browser address bar. The URL will look like:
     https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ
   - Copy everything AFTER the last /
     That long string of letters and numbers is your FOLDER ID.
     Example:  1aBcDeFgHiJkLmNoPqRsTuVwXyZ

================================================================
PART 3 — SAVE YOUR FOLDER ID (1 step)
================================================================

STEP 9: Open the .env file in Notepad
   (It is in the main ai-video folder. If it does not exist,
    copy .env.example and rename the copy to .env)

   Find this line:
      GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id

   Replace  your-google-drive-folder-id  with the ID you copied in STEP 8.

   Example after editing:
      GOOGLE_DRIVE_FOLDER_ID=1aBcDeFgHiJkLmNoPqRsTuVwXyZ

   Save the file.

================================================================
YOU ARE DONE WITH SETUP
================================================================

To upload a video to Drive, just double-click:
   UPLOAD-TO-DRIVE.bat

That's it.
