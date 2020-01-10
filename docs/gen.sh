function generate {
  dot -Gdpi=300 -Tpng -o$1.png $1.gv
}

for g in ./*.gv; do
  generate ${g%.gv}
done
