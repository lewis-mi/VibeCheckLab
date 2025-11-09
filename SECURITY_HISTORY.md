# Repository History Sanitization

To mitigate the previously exposed Gemini API key, the repository history has been rewritten to drop any tracked `.env` artifacts. In environments where `git filter-repo` is available, run the following command to replicate the cleanup:

```
git filter-repo --path .env --path .env.local --invert-paths
```

If `git filter-repo` is not available, the legacy `git filter-branch` command can be used as a fallback:

```
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --tree-filter 'rm -f .env .env.local' --tag-name-filter cat -- --all
```

After running either command, verify that the exposed key is gone from every commit:

```
git log --all -S "AIza" --oneline
```

## Publish the cleaned history to GitHub

Once your local repository is sanitized, replace the hosted history so the leaked key is truly inaccessible:

1. Confirm your working tree is clean and that every collaborator is ready to reset to the rewritten branch.
2. Force-push the sanitized branch, swapping in the appropriate remote and branch names as needed:

   ```
   git push origin main --force
   ```
3. Ask collaborators to update their local repositories so the rewritten history stays in sync:

   * **For the `main` branch:**

     ```bash
     git switch main
     git fetch origin
     git reset --hard origin/main
     ```

   * **For feature branches:** After updating `main`, rebase any in-progress work onto the sanitized history so old
     commits do not leak back in.

     ```bash
     git switch my-feature-branch
     git rebase main
     ```

Finally, rotate the compromised Gemini API key in Google AI Studio and update any dependent services with the new secret.
