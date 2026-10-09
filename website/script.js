const API_URL =
    "https://hs1g79sp20.execute-api.us-east-1.amazonaws.com/upload-url";

const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const fileInfo = document.getElementById("fileInfo");
const status = document.getElementById("status");

let selectedFile = null;


// File selection
fileInput.addEventListener("change", function () {

    selectedFile = fileInput.files[0];

    if (!selectedFile) {
        fileInfo.textContent = "No file selected";
        uploadButton.disabled = true;
        status.textContent = "Select a file to begin.";
        return;
    }

    fileInfo.textContent =
        `${selectedFile.name} • ${(selectedFile.size / 1024).toFixed(2)} KB`;

    uploadButton.disabled = false;

    status.textContent =
        "File selected. Ready to upload.";
});


// Upload file
uploadButton.addEventListener("click", async function () {

    if (!selectedFile) {
        return;
    }

    try {

        uploadButton.disabled = true;

        status.textContent =
            "Getting secure upload URL...";


        // Step 1: Ask API Gateway for presigned URL
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fileName: selectedFile.name,
                contentType:
                    selectedFile.type ||
                    "application/octet-stream"
            })

        });


        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }


        const data = await response.json();


        // Step 2: Upload directly to S3
        status.textContent =
            "Uploading file to Amazon S3...";


        const uploadResponse = await fetch(
            data.uploadUrl,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        selectedFile.type ||
                        "application/octet-stream"
                },

                body: selectedFile

            }
        );


        if (!uploadResponse.ok) {
            throw new Error(
                `S3 upload failed: ${uploadResponse.status}`
            );
        }


        // Success
        status.textContent =
            "Upload successful! File is being processed.";

        fileInfo.textContent =
            `${selectedFile.name} • Upload complete`;

    }

    catch (error) {

        console.error(error);

        status.textContent =
            `Upload failed: ${error.message}`;

        uploadButton.disabled = false;
    }

});
