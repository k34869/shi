#!/bin/bash

. $HOMEBREW_PREFIX/lib/lib.sh

for i in `get_file_all ./ | grep 'index.md'`;do
    node s.js $i
done
