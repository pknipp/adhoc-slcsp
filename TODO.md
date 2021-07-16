consider sorting zips and plans async, so that they can work in parallel
prune columns of sorted tables, to save space
eliminate slice steps, by a simple "if" statement in the array method.
to make sorting more efficient, first remove superfluous columns and put into a set
