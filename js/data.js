const ENV={
    woods:{n:'Ancient Woods',d:'Colossal trees, tangled roots and soft golden light from forgotten magic.',ph:'ancient woods',r:[
        ['Choose a Landmark',[
        O('w1','🏛️','Forgotten Temple','Moss-covered columns hum with an old, patient magic.','a forgotten temple',[['🏛️',400,338,130,'a']]),
        O('w2','🌳','Ancient Hollow Tree','A door-shaped glow hides inside its enormous trunk.','an ancient hollow tree',[['🌳',400,345,170,'a'],'<ellipse cx="400" cy="300" rx="13" ry="22" fill="#ffd36a" opacity=".9"/>'])
        ]],
        ['Choose a Magical Element',[
        O('w3','💎','Glowing Crystals','Cool blue light pulses between the roots.','glowing crystals',[['💎',95,418,90,'b'],['💎',262,440,52,'b'],['💎',528,444,56,'b']]),
        O('w4','🍄','Giant Moonlit Mushrooms','Silver caps as tall as cottages drink the moonlight.','giant moonlit mushrooms',[['🍄',100,424,100,'b'],['🍄',265,442,62,'b'],['🍄',525,448,52,'b']])
        ]],
        ['Choose a Creature',[
        O('w5','🦌','Ancient Forest Deer','Its antlers hold a thousand years of moss and starlight.','an ancient forest deer',[['🦌',630,425,90,'a']]),
        O('w6','🐺','Mystical Wolf','A quiet guardian whose eyes glow like lanterns.','a mystical wolf',[['🐺',630,425,86,'b']])
        ]],
        ['Choose a Final Touch',[
        O('w7','🌙','Moonlit Canopy','Leaves knit together overhead, strung with sleepy lights.','a moonlit canopy',[['🌙',650,115,72,'a'],canopy]),
        O('w8','✨','Floating Ancient Runes','Glowing symbols drift up from the old stones.','floating ancient runes',[],'run')
        ]]
        ]},

    marsh:{n:'Moonlit Marsh',d:'Glowing waters, drifting mist and whispers beneath a violet moon.',ph:'moonlit marsh',r:[
        ['Choose a Landmark',[
        O('m1','🛖','Witch Hut','A crooked hut on stilts, window lit from within.','a crooked witch hut',[['🛖',400,345,120,'a']]),
        O('m2','🏰','Ancient Ruins','Broken towers sunk halfway into the water.','ancient ruins',[['🏰',400,345,130,'c']])
        ]],
        ['Choose a Magical Element',[
        O('m3','🍄','Giant Mushrooms','Glowing caps tall enough to shelter a witch.','giant mushrooms',[['🍄',95,428,100,'c'],['🍄',300,442,62,'c']]),
        O('m4','🌳','Twisted Trees','Bent trunks that curl like sleeping dragons.','twisted trees',[u=>tw(170,430,230,'#150f2c')+`<circle cx="170" cy="230" r="40" fill="url(#gc${u})"/>`,u=>tw(530,440,150,'#201a45')])
        ]],
        ['Choose a Creature',[
        O('m5','✨','Fireflies','Hundreds of tiny lights, writing slow circles.','drifting fireflies',[],'fire'),
        O('m6','🐸','Frog Spirits','Pale, singing guardians of the still water.','frog spirits',[['🐸',545,432,64,'b'],['🐸',735,446,38,'b']],'fire')
        ]],
        ['Choose a Final Touch',[
        O('m7','💎','Crystal Spires','Pink crystals rise from the mud like frozen lightning.','crystal spires',[cry]),
        O('m8','🌕','Pale Full Moon','A huge cold moon, doubled in the water below.','a pale full moon',[['🌕',640,110,90,'a'],'<ellipse cx="640" cy="400" rx="60" ry="8" fill="#fff6c8" opacity=".35"/>'])
        ]]
        ]},

    garden:{n:'Mythical Garden',d:'Lantern-lit paths, blossoms and tiny wonders at golden dusk.',ph:'mythical garden',r:[
        ['Choose a Landmark',[
        O('g1','🌼','Flower Circle','A ring of blooms that opens when you step inside.','a ring of dancing flowers',[ring]),
        O('g2','🏡','Fairy Village','Tiny cottages tucked among the roots and petals.','a tiny fairy village',[['🏡',310,352,80,'a'],['🏡',485,362,52,'a'],['🍄',405,368,48,'c']])
        ]],
        ['Choose a Magical Element',[
        O('g3','⛲','Glowing Fountain','Water that glimmers with wishes.','a glowing fountain',[['⛲',165,420,110,'b']]),
        O('g4','🏮','Strings of Lanterns','Warm lights that hum when you pass.','strings of lanterns',[lant])
        ]],
        ['Choose a Creature',[
        O('g5','🦋','Butterflies','Wings painted with tiny stained-glass windows.','fluttering butterflies',[],'bf'),
        O('g6','🦌','Gentle Deer','A shy visitor that walks without a sound.','a gentle deer',[['🦌',630,430,88,'a']])
        ]],
        ['Choose a Final Touch',[
        O('g7','🌸','Cherry Blossoms','Petals fall like slow pink snow.','drifting cherry blossoms',[bloom],'pet'),
        O('g8','🌹','Roses','Velvet blooms climbing every stone.','climbing roses',[['🌹',70,420,64,'c'],['🌹',740,430,64,'c']],'rose')
        ]]
        ]}
};

