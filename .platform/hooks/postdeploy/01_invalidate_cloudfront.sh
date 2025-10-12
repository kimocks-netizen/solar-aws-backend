#!/bin/bash
# Invalidate CloudFront cache after EB deploy

# Replace this with your actual CloudFront distribution ID
DISTRIBUTION_ID="E37L8B0P0DAE5M"

# Create invalidation for all files
aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*"

echo "✅ CloudFront cache invalidated for distribution $DISTRIBUTION_ID"