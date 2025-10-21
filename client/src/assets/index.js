import placeholder from "./placeholder.png";

// Attempt to auto-detect curated images under ./curated/ using Vite's
// import.meta.globEager. If curated images are present, they will be used
// per-category; otherwise we fall back to the photographic defaults above.
let detectedCurated = {};
try {
	// Glob all image files in the curated folder (png/jpg/jpeg/svg)
	const modules = import.meta.globEager("./curated/*.{png,jpg,jpeg,svg}");
	// modules keys look like './curated/vegetables.svg'
	Object.keys(modules).forEach((path) => {
		const file = path.split('/').pop().toLowerCase();
		detectedCurated[file] = modules[path].default || modules[path];
	});
} catch (e) {
	// import.meta.globEager is a Vite feature; in any environment where it's not
	// available, we'll silently skip detection and use defaults.
	detectedCurated = {};
}

const fallbacks = {
	Vegetables: placeholder,
	Fruits: placeholder,
	Dairy: placeholder,
	Grains: placeholder,
	Herbs: placeholder,
	General: placeholder,
};

// Helper: try to find a curated file matching a list of tokens
const findCuratedFor = (tokens) => {
	const files = Object.keys(detectedCurated);
	for (const token of tokens) {
		const match = files.find((f) => f.includes(token));
		if (match) return detectedCurated[match];
	}
	return null;
};

const CURATED_IMAGES = {
	Vegetables: findCuratedFor(["vegetable", "veg"]) || fallbacks.Vegetables,
	Fruits: findCuratedFor(["fruit"]) || fallbacks.Fruits,
	Dairy: findCuratedFor(["dairy", "milk"]) || fallbacks.Dairy,
	Grains: findCuratedFor(["grain", "wheat", "rice"]) || fallbacks.Grains,
	Herbs: findCuratedFor(["herb"]) || fallbacks.Herbs,
	General: findCuratedFor(["general"]) || fallbacks.General,
};

export { placeholder, CURATED_IMAGES };
