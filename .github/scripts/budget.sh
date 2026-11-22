#!/usr/bin/env bash
# Usage: budget.sh <seconds> <command...>
# Runs the command to completion and keeps its exit code and output. If it
# passed but took longer than <seconds>, fails anyway: a slow check is a bug
# to fix, not a timeout to widen.
set -uo pipefail
budget=$1
shift
start=$(date +%s%N)
"$@"
status=$?
ms=$(( ($(date +%s%N) - start) / 1000000 ))
echo "budget: '$*' took ${ms} ms (budget ${budget} s)"
if [ "$status" -ne 0 ]; then
	exit "$status"
fi
if [ "$ms" -gt $(( budget * 1000 )) ]; then
	echo "::error title=Over budget::'$*' took ${ms} ms; its budget is ${budget} s"
	exit 1
fi
