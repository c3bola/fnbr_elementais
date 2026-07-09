// PLANILHA DE DADOS DO DESENVOLVEDOR: Adicione novos sprites, altere raridades ou alterne estados não lançados aqui.
const baseSprites = [
    { id: "water_basic", name: "Água", theme: "Basic", rarity: "Rare", unreleased: false },
    { id: "water_gold", name: "Água de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "water_candy", name: "Água Gelatinosa", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "water_galaxy", name: "Água Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "water_gem", name: "Água de Gema", theme: "Gem", rarity: "Special", unreleased: true },
    { id: "water_holofoil", name: "Água Metalizada", theme: "Holofoil", rarity: "Special", unreleased: false },
    
    { id: "earth_basic", name: "Terra", theme: "Basic", rarity: "Rare", unreleased: false },
    { id: "earth_gold", name: "Terra de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "earth_candy", name: "Terra Gelatinosa", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "earth_galaxy", name: "Terra Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "earth_gem", name: "Terra de Gema", theme: "Gem", rarity: "Special", unreleased: true },
    
    { id: "fire_basic", name: "Fogo", theme: "Basic", rarity: "Rare", unreleased: false },
    { id: "fire_gold", name: "Fogo de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "fire_candy", name: "Fogo Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "fire_galaxy", name: "Fogo Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "fire_holofoil", name: "Fogo Metalizado", theme: "Holofoil", rarity: "Special", unreleased: false },

    { id: "duck_basic", name: "Pato", theme: "Basic", rarity: "Epic", unreleased: false },
    { id: "duck_gold", name: "Pato de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "duck_candy", name: "Pato Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "duck_galaxy", name: "Pato Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "duck_gem", name: "Pato de Gema", theme: "Gem", rarity: "Special", unreleased: true },
	
    { id: "ghost_basic", name: "Fantasma", theme: "Basic", rarity: "Epic", unreleased: false },
    { id: "ghost_gold", name: "Fantasma de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "ghost_candy", name: "Fantasma Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "ghost_galaxy", name: "Fantasma Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "ghost_holofoil", name: "Fantasma Metalizado", theme: "Holofoil", rarity: "Special", unreleased: false },
	
    { id: "dream_basic", name: "Sonho", theme: "Basic", rarity: "Legendary", unreleased: false },
    { id: "dream_gold", name: "Sonho de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "dream_candy", name: "Sonho Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "dream_galaxy", name: "Sonho Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "dream_rift", name: "Sonho da Fenda", theme: "Rift", rarity: "Special", unreleased: true },
	
    { id: "demon_basic", name: "Demônio", theme: "Basic", rarity: "Epic", unreleased: false },
    { id: "demon_gold", name: "Demônio de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "demon_candy", name: "Demônio Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
	{ id: "demon_galaxy", name: "Demônio Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "demon_gem", name: "Demônio de Gema", theme: "Gem", rarity: "Special", unreleased: true },

	{ id: "punk_basic", name: "Punk", theme: "Basic", rarity: "Legendary", unreleased: false },
    { id: "punk_gold", name: "Punk de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "punk_candy", name: "Punk Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "punk_galaxy", name: "Punk Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "punk_gem", name: "Punk de Gema", theme: "Gem", rarity: "Special", unreleased: true },
    { id: "punk_rift", name: "Punk da Fenda", theme: "Rift", rarity: "Special", unreleased: true },

	{ id: "king_basic", name: "Rei", theme: "Basic", rarity: "Epic", unreleased: false },
    { id: "king_gold", name: "Rei de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "king_candy", name: "Rei Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "king_galaxy", name: "Rei Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "king_holofoil", name: "Rei Metalizado", theme: "Holofoil", rarity: "Special", unreleased: false },

    { id: "zeropoint_basic", name: "Ponto Zero", theme: "Basic", rarity: "Mythic", unreleased: false },
    { id: "zeropoint_gold", name: "Ponto Zero de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "zeropoint_candy", name: "Ponto Zero Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "zeropoint_galaxy", name: "Ponto Zero Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "zeropoint_gem", name: "Ponto Zero de Gema", theme: "Gem", rarity: "Special", unreleased: true },
    { id: "zeropoint_holofoil", name: "Ponto Zero Quack", theme: "Holofoil", rarity: "Special", unreleased: false },
	
    { id: "theburntpeanut_basic", name: "Amendoim Queimado", theme: "Basic", rarity: "Mythic", unreleased: false },
	
    { id: "fishy_basic", name: "Peixoto", theme: "Basic", rarity: "Rare", unreleased: false },
    { id: "fishy_gold", name: "Peixoto de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "fishy_candy", name: "Peixoto Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "fishy_galaxy", name: "Peixoto Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },

    { id: "striker_basic", name: "Atacante", theme: "Basic", rarity: "Epic", unreleased: false },
    { id: "striker_gold", name: "Atacante de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "striker_candy", name: "Atacante Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "striker_galaxy", name: "Atacante Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "striker_holofoil", name: "Atacante Metalizado", theme: "Holofoil", rarity: "Special", unreleased: false },

    { id: "aura_basic", name: "Aura", theme: "Basic", rarity: "Epic", unreleased: false },
    { id: "aura_gold", name: "Aura de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "aura_candy", name: "Aura Gelatinosa", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "aura_galaxy", name: "Aura Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },
    { id: "aura_gem", name: "Aura de Gema", theme: "Gem", rarity: "Special", unreleased: true },

    { id: "boss_basic", name: "Chefe", theme: "Basic", rarity: "Legendary", unreleased: false },
    { id: "boss_gold", name: "Chefe de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "boss_candy", name: "Chefe Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "boss_galaxy", name: "Chefe Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },

    { id: "grim_basic", name: "Sinistro", theme: "Basic", rarity: "Mythic", unreleased: false },
    { id: "grim_gold", name: "Sinistro de Ouro", theme: "Gold", rarity: "Special", unreleased: false },
    { id: "grim_candy", name: "Sinistro Gelatinoso", theme: "Candy", rarity: "Special", unreleased: false },
    { id: "grim_galaxy", name: "Sinistro Galáxia", theme: "Galaxy", rarity: "Special", unreleased: false },

    { id: "air_basic", name: "Ar", theme: "Basic", rarity: "Rare", unreleased: true },
    { id: "air_gold", name: "Ar de Ouro", theme: "Gold", rarity: "Special", unreleased: true },
    { id: "air_candy", name: "Ar Gelatinoso", theme: "Candy", rarity: "Special", unreleased: true },
    { id: "air_galaxy", name: "Ar Galáxia", theme: "Galaxy", rarity: "Special", unreleased: true },
    { id: "air_holofoil", name: "Ar Metalizado", theme: "Holofoil", rarity: "Special", unreleased: false },
	
    { id: "seven_basic", name: "Os Sete", theme: "Basic", rarity: "Legendary", unreleased: true },
    { id: "seven_gold", name: "Os Sete de Ouro", theme: "Gold", rarity: "Special", unreleased: true },
    { id: "seven_candy", name: "Os Sete Gelatinoso", theme: "Candy", rarity: "Special", unreleased: true },
    { id: "seven_galaxy", name: "Os Sete Galáxia", theme: "Galaxy", rarity: "Special", unreleased: true },
    { id: "seven_holofoil", name: "Os Sete Metalizado", theme: "Holofoil", rarity: "Special", unreleased: false },

	{ id: "wick_basic", name: "John Wick", theme: "Basic", rarity: "Mythic", unreleased: true },

];