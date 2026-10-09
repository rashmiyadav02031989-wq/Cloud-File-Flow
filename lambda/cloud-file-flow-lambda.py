import json
import boto3
import urllib.parse
from datetime import datetime, timezone

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("Cloud-File-Flow-Dynamo-Table")


def lambda_handler(event, context):

    print("Received event:")
    print(json.dumps(event))

    for record in event["Records"]:

        # SQS message body
        message_body = json.loads(record["body"])

        # S3 event information
        s3_record = message_body["Records"][0]["s3"]

        bucket_name = s3_record["bucket"]["name"]
        object_key = urllib.parse.unquote_plus(
            s3_record["object"]["key"]
        )

        # Get object information from S3
        response = s3.head_object(
            Bucket=bucket_name,
            Key=object_key
        )

        file_size = response["ContentLength"]
        content_type = response.get(
            "ContentType",
            "application/octet-stream"
        )

        # Use the S3 object key as the file ID
        file_id = object_key

        # Store metadata in DynamoDB
        table.put_item(
            Item={
                "fileId": file_id,
                "fileName": object_key.split("/")[-1],
                "bucketName": bucket_name,
                "fileSize": file_size,
                "contentType": content_type,
                "uploadedAt": datetime.now(
                    timezone.utc
                ).isoformat()
            }
        )

        print(
            f"Stored metadata for {object_key} "
            f"in DynamoDB."
        )

    return {
        "statusCode": 200,
        "body": "File metadata processed successfully"
    }
