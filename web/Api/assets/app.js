const API_URL = "https://dragonball-api.com/api";

const CHARACTER_ENDPOINT = `${API_URL}/characters`;
const PLANETS_ENDPOINT = `${API_URL}/planets`;

async function fetchCharacters() {
    try {
        const response = await fetch(CHARACTER_ENDPOINT);
        const data = await response.json();
        console.log("Fetched characters:", data);
        return data;
    } catch (error) {
        console.error("Error fetching characters:", error);
    }
}

async function fetchCharacterById(id) {
    try {
        const response = await fetch(`${CHARACTER_ENDPOINT}/${id}`);
        const data = await response.json();
        console.log("Fetched character:", data);
        return data;
    } catch (error) {
        console.error("Error fetching character:", error);
    }
}

async function fetchPlanets() {
    try {
        const response = await fetch(PLANETS_ENDPOINT);
        const data = await response.json();
        console.log("Fetched planets:", data);
        return data;
    } catch (error) {
        console.error("Error fetching planets:", error);
    }
}

async function fetchPlanetById(id){
    try{
        const response = await fetch(`${PLANETS_ENDPOINT}/${id}`);
        const data = await response.json();
        console.log("Fetched planet:", data);
        return data;
    }
    catch(error){
        console.error("Error fetching planet:", error);
    }
}

fetchCharacterById(1);

/*
Fetched character: {
  id: 1,
  name: 'Goku',
  ki: '60.000.000',
  maxKi: '90 Septillion',
  race: 'Saiyan',
  gender: 'Male',
  description: 'El protagonista de la serie, conocido por su gran poder y personalidad amigable. Originalmente enviado a la Tierra como un infante volador con la misión de conquistarla. Sin embar
go, el caer por un barranco le proporcionó un brutal golpe que si bien casi lo mata, este alteró su memoria y anuló todos los instintos violentos de su especie, lo que lo hizo crecer con un coraz
ón puro y bondadoso, pero conservando todos los poderes de su raza. No obstante, en la nueva continuidad de Dragon Ball se establece que él fue enviado por sus padres a la Tierra con el objetivo 
de sobrevivir a toda costa a la destrucción de su planeta por parte de Freeza. Más tarde, Kakarot, ahora conocido como Son Goku, se convertiría en el príncipe consorte del monte Fry-pan y líder d
e los Guerreros Z, así como el mayor defensor de la Tierra y del Universo 7, logrando mantenerlos a salvo de la destrucción en innumerables ocasiones, a pesar de no considerarse a sí mismo como u
n héroe o salvador.',
  image: 'https://dragonball-api.com/characters/goku_normal.webp',
  affiliation: 'Z Fighter',
  deletedAt: null,
  originPlanet: {
    id: 3,
    name: 'Vegeta',
    isDestroyed: true,
    description: 'El planeta Vegeta, conocido como planeta Plant antes del fin de la Guerra Saiyan-tsufruiana en el año 730, es un planeta rocoso ficticio de la serie de manga y anime Dragon Ball
 y localizado en la Vía Láctea de las Galaxias del Norte del Universo 7 hasta su destrucción a manos de Freezer en los años 737-739. Planeta natal de los Saiyans, destruido por Freezer. Anteriorm
ente conocido como Planeta Plant.',
    image: 'https://dragonball-api.com/planetas/Planeta_Vegeta_en_Dragon_Ball_Super_Broly.webp',
    deletedAt: null
  },
  transformations: [
    {
      id: 1,
      name: 'Goku SSJ',
      image: 'https://dragonball-api.com/transformaciones/goku_ssj.webp',
      ki: '3 Billion',
      deletedAt: null
    },
    {
      id: 2,
      name: 'Goku SSJ2',
      image: 'https://dragonball-api.com/transformaciones/goku_ssj2.webp',
      ki: '6 Billion',
      deletedAt: null
    },
    {
      id: 3,
      name: 'Goku SSJ3',
      image: 'https://dragonball-api.com/transformaciones/goku_ssj3.webp',
      ki: '24 Billion',
      deletedAt: null
    },
    {
      id: 4,
      name: 'Goku SSJ4',
      image: 'https://dragonball-api.com/transformaciones/goku_ssj4.webp',
      ki: '2 Quadrillion',
      deletedAt: null
    },
    {
      id: 5,
      name: 'Goku SSJB',
      image: 'https://dragonball-api.com/transformaciones/goku_ssjb.webp',
      ki: '9 Quintillion',
      deletedAt: null
    },
    {
      id: 44,
      name: 'Goku Ultra Instinc',
      image: 'https://dragonball-api.com/transformaciones/goku_ultra.webp',
      ki: '90 Septillion',
      deletedAt: null
    }
  ]
}
*/