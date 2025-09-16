# Now, read the .env.prod file and set new secrets
while IFS='=' read -r key value; do
  if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
    gh secret set "$key" --body "$value"
  fi
done < .env.prod
