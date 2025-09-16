#!/bin/bash

# First, fetch all existing secrets and delete them
#existing_secrets=$(gh secret list --json name --jq '.[].name')
#
#for secret in $existing_secrets; do
#  gh secret delete "$secret"
#done

# Now, read the .env.prod file and set new secrets
while IFS='=' read -r key value; do
  if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
    gh secret set "$key" --body "$value"
  fi
done < .env.prod
