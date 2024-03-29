const recipes = [
  {
    slug: 'mexican-style-pork-chilli',
    title: 'Mexican-Style Pork Chilli With Apple Salsa',
    description:
      "For a comforting treat, you'll serve smoky pork and chipotle chilli over wholesome bulgur. Top with an apple and red onion salsa to cut through the richness, and plenty of cheddar. Smokin'!"
  },
  {
    slug: 'lamb-pistachio-tagine',
    title: 'Lamb & Pistachio Tagine',
    description:
      "Inspired by the signature North African dish, you'll whip up a speedy tagine in 10 minutes! Our supercharged twist has fragrant ras el hanout, pistachios and dates, and is served over couscous. Yum!"
  }
]

const slugRegex = /\W/gm;

export function getRecipes() {
  return recipes;
}

export function getRecipe(slug: string) {
  return recipes.find(recipe => recipe.slug === slug);
}

export function createRecipe(title: string, description: string) {
  recipes.push({
    slug: createSlug(title),
    title,
    description
  })
}

function createSlug(title: string): string {
  return title.toLowerCase().replace(slugRegex, '-');
}
