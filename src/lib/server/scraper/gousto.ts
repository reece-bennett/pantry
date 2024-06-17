import { parse } from 'node-html-parser';

const apiUrl = 'https://production-api.gousto.co.uk/cmsreadbroker/v1/recipe';

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
  original: string;
};

type Recipe = {
  name: string;
  description: string;
  servings: number;
  time: number;
  ingredients: Ingredient[];
  steps: string[];
};

async function parseGousto(url: string): Promise<Recipe> {
  const slug = url.split('/').at(-1);
  const response = await fetch(`${apiUrl}/${slug}`);
  const data = (await response.json()).data.entry;
  console.log(data);
  const portionsString = Object.keys(data.prep_times).sort()[0];
  return {
    name: data.title,
    description: data.description,
    servings: Number(portionsString.substring(4)),
    time: data.prep_times[portionsString],
    ingredients: data.ingredients.map((ingredient: { label: string }) =>
      parseIngredient(ingredient.label)
    ),
    steps: data.cooking_instructions.map(
      (cookingInstruction: { instruction: string }) => parse(cookingInstruction.instruction).structuredText
    )
  };
}

const unitMap = new Map([
  ['pcs', 'x']
]);

function parseIngredient(original: string): Ingredient {
  original = original.replace('x0', '');

  // Parse with amount and unit
  const result = original.match(/\(?([0-9./]+)\s?(g|kg|ml|l|tbsp|tsp|x|pcs)\)?(?:\s|$)/i);
  if (result) {
    return {
      amount: convertAmountToNumber(result[1]),
      unit: unitMap.get(result[2]) ?? result[2],
      name: original.replace(result[0], '').trim(),
      original
    };
  }

  // Parse with just amount
  const result2 = original.match(/(?:\s|^)\(?([0-9./]+)\s?/);
  if (result2) {
    return {
      amount: convertAmountToNumber(result2[1]),
      unit: 'x',
      name: original.replace(result2[0], '').trim(),
      original
    };
  }

  // Parse x<amount>
  const result3 = original.match(/(?:\s|^)\(?x([0-9./]+)(?:\s|$)/i);
  if (result3) {
    return {
      amount: convertAmountToNumber(result3[1]),
      unit: 'x',
      name: original.replace(result3[0], '').trim(),
      original
    };
  }

  // When no unit/amount found assume just 1 x
  return {
    amount: 1,
    unit: 'x',
    name: original,
    original
  };
}

function convertAmountToNumber(amount: string) {
  // Handle fractions
  if (amount.includes('/')) {
    const parts = amount.split('/');
    return Number(parts[0]) / Number(parts[1]);
  } else {
    return Number(amount);
  }
}

export default parseGousto;
