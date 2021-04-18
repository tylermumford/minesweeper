package logic

import "math/rand"

type randomizer struct {
	index      int
	boolValues []bool
}

func (r *randomizer) next() bool {
	if r.index == 0 {
		r.boolValues = make([]bool, defaultColCount*defaultRowCount)
		for i := range r.boolValues {
			if i < numberOfMinesToCreate {
				r.boolValues[i] = true
			} else {
				break
			}
		}

		rand.Shuffle(len(r.boolValues), func(i, j int) {
			r.boolValues[i], r.boolValues[j] = r.boolValues[j], r.boolValues[i]
		})
	}

	if r.index >= len(r.boolValues) {
		panic("randomizer.next called too many times.")
	}

	result := r.boolValues[r.index]
	r.index++
	return result
}
