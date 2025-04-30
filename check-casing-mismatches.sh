#!/bin/bash

echo "🔍 Checking for filename casing mismatches..."

# Find all .ts and .tsx imports in your app directory
grep -rhoP "from ['\"]@/[^'\"]+['\"]" ./app ./components ./utils ./context ./screens ./hooks 2>/dev/null | \
  sed "s/from ['\"]@//g" | sed "s/['\"]//g" | sort | uniq | while read -r path; do
    real_path="./$path.tsx"
    real_path_ts="./$path.ts"

    # Get actual file with any casing
    match=$(find . -type f \( -name "$(basename "$real_path")" -o -name "$(basename "$real_path_ts")" \) | grep -i "$path")

    if [ -n "$match" ] && [ "$match" != "$real_path" ] && [ "$match" != "$real_path_ts" ]; then
        echo "❌ Mismatch found:"
        echo "    Import:   $path"
        echo "    Actual:   ${match#./}"
    fi
done

echo "✅ Done."
