#!/bin/bash

# Fetch all secret names as plain list
gh secret list --json name -q '.[].name' | xargs -n1 gh secret remove
