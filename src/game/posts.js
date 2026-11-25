// Game-over "posts": the internet reacting to your launch. All accounts are fictional.
// Pools are picked by how and where you died (see pickPost). Tokens in the text:
//   {alt}  altitude at death in m     {peak}  highest altitude reached in m     {km}  peak in km
//   {deaths}  total runs ended (attempt number)     {best}  best altitude ever in m

// avatar: frame in ui/gameover/avatars.png (accounts.json order). Accounts without one get a
// generated initial tile in the same style.
export const AUTHORS = {
  shiftx: { name: "ShiftX", handle: "ShiftX", color: 0xff6a3d, verified: true, avatar: 0 },
  intern: { name: "ShiftX Social Intern", handle: "shiftx_intern", color: 0xff9a3d },
  ceo: { name: "Max Shift", handle: "ShiftX_CEO", color: 0x3d8bff, verified: true, avatar: 22 },
  mom: { name: "Linda (pilot's mum)", handle: "ProudMum_Linda", color: 0xff7eb6, avatar: 2 },
  gulls: { name: "Gull Workers Union", handle: "GullUnion", color: 0xe8e8e8, verified: true, avatar: 4 },
  faa: { name: "Sky Safety Bureau", handle: "skysafetybureau", color: 0x5a6b8c, verified: true },
  insurance: { name: "Dale | Orbit Insurance", handle: "DaleFromClaims", color: 0x6b8f71, avatar: 9 },
  stan: { name: "rocket stan", handle: "launchgremlin", color: 0xb36bff },
  hater: { name: "HotTakeBot 3000", handle: "hot_take_bot", color: 0x8c3d3d, avatar: 20 },
  news: { name: "Channel 7 News", handle: "Channel7Now", color: 0xd8342c, verified: true, avatar: 5 },
  physics: { name: "Physics", handle: "newton_was_right", color: 0x3dd8c4, verified: true },
  ground: { name: "The Ground", handle: "the_ground", color: 0x5c4a3d },
  local: { name: "Local Man", handle: "guy_near_launchpad", color: 0x9c8f6b },
  drone: { name: "DeliveryBot 3000", handle: "droneboi", color: 0x4a4660 },
  airline: { name: "Skyways Airlines", handle: "SkywaysAir", color: 0x2f6fd8, verified: true, avatar: 11 },
  pilot: { name: "Weekend Pilot Dave", handle: "dave_flies_sundays", color: 0xd8b03d },
  sat: { name: "SatNet-7", handle: "satnet7", color: 0x8c9cb3 },
  astro: { name: "Rocky", handle: "RockyTheAsteroid", color: 0x7a6a5c, avatar: 21 },
  meteo: { name: "Wendy Storm", handle: "WeatherWendy", color: 0x3db0d8, verified: true, avatar: 6 },
  balloon: { name: "Hot Air Harold", handle: "harold_balloons", color: 0xd84a8c, avatar: 12 },
  cloud: { name: "Storm Cell #9", handle: "stormcell9", color: 0x4a4a6b },
  gravity: { name: "Gravity", handle: "gravity", color: 0x16142a, verified: true },
  rival: { name: "Orbital Rivals Inc.", handle: "orbitalrivals", color: 0x3dd86b, verified: true },
  dev: { name: "the ShiftX dev", handle: "made_this_game", color: 0x6bd8ff },
  chat: { name: "live chat", handle: "chat", color: 0x9146ff },
  lshift: { name: "Your Left Shift Key", handle: "left_shift", color: 0xc8ccd8 },
  rshift: { name: "Your Right Shift Key", handle: "right_shift", color: 0xc8ccd8 },
  speedrun: { name: "Speedrun Community", handle: "any_percent", color: 0xffe066 },
  therapist: { name: "Your Therapist", handle: "therapy_hours", color: 0xa8d8b0 },
  reviewer: { name: "Game Critic", handle: "three_out_of_ten", color: 0xd8a03d },
};

const POSTS = {
  // never really got off the pad (peak under PAD_PEAK_M)
  pad: [
    ["shiftx", "we're calling it a hop"],
    ["intern", "ok who's telling the ceo. not me. i'm literally the intern"],
    ["ceo", "that wasn't a failure that was a really short success"],
    ["mom", "my baby went up!!! a little!!! 🥹"],
    ["ground", "ain't no way you tried to leave me"],
    ["physics", "lmao"],
    ["local", "nobody:\nShiftX: *explodes at ankle height*"],
    ["insurance", "not even mad. just gonna deny it"],
    ["hater", "{peak}m 💀💀 my cat jumps higher than that and he's 14"],
    ["news", "BREAKING: ShiftX rocket reaches altitude of 'basically nothing'"],
    ["stan", "he's so small and so on fire. protect him at all costs"],
    ["gravity", "no"],
    ["faa", "we're gonna need you to fill out form 27B/6 ('what was that')"],
    ["rival", "first time?"],
    ["intern", "the 'WE HAVE LIFTOFF 🚀' post was scheduled. i'm so sorry. i'm crying in the disabled toilet"],
    ["ceo", "the rocket is in a better place now. that place is the launchpad. it never left"],
    ["local", "drove 4 hours for this. the hot dog was decent"],
    ["shiftx", "pov: you skipped the tutorial"],
    ["ground", "get back here 😡"],
    ["physics", "you had one job and the job was 'up'"],
    ["mom", "the firemen were very handsome so honestly not a wasted trip"],
    ["hater", "average ShiftX launch"],
    ["insurance", "sir this is a car park"],
    ["stan", "{peak}m is a personal best if you don't think about it"],
    ["news", "Launchpad 'a bit crispy but in good spirits' say sources"],
    ["shiftx", "rocket has been successfully installed into the ground"],
    ["intern", "chat is this a launch or a barbecue"],
    ["hater", "the rocket said 'nah'"],
    ["local", "i blinked and missed the whole flight. i also blinked and lost my eyebrows"],
    ["mom", "he gets stage fright 😭"],
    ["physics", "you didn't even give me a chance to do anything"],
    ["ground", "you thought 😂"],
    ["ceo", "we are pivoting to underground rockets"],
    ["news", "ShiftX achieves new record low"],
    ["stan", "he's not ready yet. let him cook"],
    ["gravity", "didn't even have to try"],
    ["insurance", "launch? that wasn't a launch that was a sneeze"],
    ["faa", "do you need a hug"],
    ["rival", "lmaooooooo"],
    ["gulls", "we didn't even get to attack it 😔 it attacked itself"],
    ["local", "sir that's a firework"],
    ["intern", "rocket has entered the 'staying here' phase of the mission"],
    ["shiftx", "mission duration: 2 seconds. mission vibes: immaculate"],
    ["hater", "a potato with a sparkler taped to it would've gone higher"],
    ["mom", "it's not about how high you go. it's about. hm. i actually don't know"],
    ["physics", "you can't hold one button and expect to go to space"],
    ["ceo", "we've decided the launchpad is our new orbit"],
    ["news", "Launch described as 'brief', 'loud', and 'mostly sideways'"],
    ["stan", "he tipped over like a toddler learning to walk and i will not hear any slander"],
    ["ground", "i'm not letting go 🫂"],
    ["insurance", "that's a parking fine at best"],
    ["local", "my dog launched higher off the sofa this morning"],
    ["meteo", "conditions were perfect. the pilot was not"],
    ["intern", "rocket fell over. like. just fell over. like a wheelie bin"],
    ["gravity", "you weren't even in my territory yet. you were in the lobby"],
    ["rival", "honestly feel bad. no i don't"],
    ["shiftx", "T-minus 0... T-plus 1... T-plus kaboom"],
    ["hater", "the rocket TRIPPED. rockets can TRIP??"],
    ["faa", "launch licence revoked. it was a learner's permit anyway"],
    ["mom", "everyone's a critic. none of you have ever built a rocket. ok he didn't build it either"],
    ["physics", "the tilt is coming from inside the cockpit"],
    ["local", "shortest flight i've seen since my uncle tried a jet ski"],
    ["ceo", "that was a tech demo. the tech was falling over"],
    ["news", "Witnesses describe launch as 'over before it started' and 'genuinely sad'"],
    ["stan", "{peak}m is a stepping stone. literally. it's about one step"],
    ["intern", "the rocket fell sideways like a cow tipping itself"],
    ["gulls", "watched it fall over from the bin. kevin cried laughing"],
    ["ground", "welcome to my house ☕"],
    ["insurance", "the rocket had a little lie down. claim denied"],
    ["shiftx", "we would like to clarify that the rocket was meant to go up"],
    ["hater", "built like a jenga tower in an earthquake"],
    ["local", "came for the launch, stayed for the fire extinguisher"],
    ["gravity", "first try? cute"],
    ["mom", "he's always been clumsy. he once fell UP the stairs"],
    ["physics", "the centre of mass is supposed to be ABOVE the bit holding it up"],
    ["news", "Launch window closes 0.8 seconds after opening"],
    ["ceo", "every rocket is grounded until it isn't. ours just hasn't gotten to the 'isn't' yet"],
    ["rival", "we watched this on loop at the office party"],
    ["intern", "pressing F to pay respects. pressing shift to apparently do nothing useful"],
    ["stan", "baby's first faceplant 🥹📸"],
    ["local", "i've seen shopping trolleys with better balance"],
    ["faa", "please read the manual. it's two pages. one says 'left' and one says 'right'"],
    ["ground", "you could've at least warned me"],
    ["hater", "rocket said 'i'm good here actually'"],
    ["shiftx", "today we tested the rocket's ability to lie down. results: excellent"],
    ["insurance", "the rocket has filed a claim against the ground. the ground has counter-sued"],
    ["mom", "i'm bringing orange slices next time. he needs the energy"],
    ["physics", "that's not thrust that's a strongly worded suggestion"],
    ["news", "ShiftX rocket briefly airborne, mostly ashamed"],
    ["gravity", "didn't even get out of bed for that one"],
    ["local", "i've watched toddlers on ice with more control"],
    ["intern", "launch status: no"],
    ["ceo", "we're not calling it a crash. we're calling it aggressive parking"],
    ["stan", "he just wanted to stay home with us 🥺"],
    ["hater", "pathetic. anyway what time's the next one i'm watching"],
    ["rival", "sorry who launched? must've missed it. so did they"],
    ["gulls", "free chips in the debris field 🍟 thank u ShiftX"],
    ["ground", "😏"],
    ["faa", "noise complaint received. from the launchpad itself"],
    ["physics", "nice try. but no"],
  ],

  // flew, then came back down the hard way
  ground: [
    ["gravity", "and i oop"],
    ["ground", "he's back 😍"],
    ["intern", "good news: it went up. that's all the good news"],
    ["shiftx", "rocket has returned to earth (all of it) (at once)"],
    ["physics", "what goes up must come down. that's the whole joke"],
    ["ceo", "this was a lithobraking test. lithobraking means using the ground as brakes. it worked. the brakes worked"],
    ["local", "saw it go up and went 'woah'. saw it come down and went 'WOAH'"],
    ["mom", "he went up {peak} metres and came down even faster which shows he's efficient"],
    ["news", "Rocket lands. Ground disagrees."],
    ["insurance", "that's not a landing that's a delivery"],
    ["hater", "imagine going all the way to {peak}m just to become a hole"],
    ["stan", "he came back for us 🥺"],
    ["faa", "landing tip: go slower than a meteor"],
    ["rival", "we land ours btw. not saying anything. just saying"],
    ["gravity", "you can run but you can't hide (you also can't run)"],
    ["ground", "i'm always here. you KNOW i'm always here"],
    ["intern", "boss said post something positive. ok. the crater is very round 👍"],
    ["physics", "F = ma and the a was a LOT"],
    ["local", "it landed in my neighbour's garden. first thing in there that isn't a gnome"],
    ["ceo", "{peak}m up, {peak}m down. net zero. we're basically carbon neutral"],
    ["mom", "the hole is very big which means he was very brave"],
    ["news", "Seismologists confirm earthquake was 'just ShiftX being ShiftX'"],
    ["hater", "touched grass. at mach 2"],
    ["stan", "the comeback nobody asked for 😭"],
    ["local", "bro yeeted himself back into the earth's crust"],
  ],

  // spun out below 1,500 m
  lost_low: [
    ["physics", "that's not a rocket that's a ceiling fan"],
    ["intern", "why is it spinning. who told it it could spin"],
    ["local", "BEYBLADE BEYBLADE LET IT RIP 🌀"],
    ["ceo", "helicopter mode is still in beta"],
    ["mom", "he was doing TRICKS. the news keeps saying 'loss of control' they were TRICKS"],
    ["stan", "the spin at {alt}m was so unnecessary and so iconic"],
    ["hater", "bro pressed one shift key and forgot the other one existed"],
    ["insurance", "you get 3 rotations. you did 14. i counted. i had time"],
    ["faa", "rockets go up. not around. up."],
    ["news", "Rocket observed doing 'the worm' at {alt}m"],
    ["shiftx", "the rocket has TWO buttons. you pressed ONE. we are begging you"],
    ["gulls", "we were gonna peck it but it looked like it was going through something"],
    ["gravity", "spin all you want babe i'll be here"],
    ["rival", "me watching ShiftX: 🍿"],
    ["local", "spun like my nan's washing machine right before it gives up forever"],
    ["intern", "it's doing the spinny thing again"],
    ["local", "rocket turned into a lawn sprinkler"],
    ["physics", "you pressed left so hard you invented a new kind of torque"],
    ["hater", "bro is playing beyblade with a rocket"],
    ["stan", "the spin is literally choreography. y'all aren't ready"],
    ["mom", "he's dancing!!! my baby is dancing!!! oh no"],
    ["ceo", "the spin is a feature. it'll be in the premium version"],
    ["gravity", "spinning won't save you. spinning NEVER saves you"],
    ["faa", "please keep the pointy end pointed up"],
    ["news", "Rocket spins out at {alt}m; local kids call it 'the coolest thing they've ever seen'"],
    ["gulls", "it spun so fast we got dizzy watching. kevin threw up"],
    ["insurance", "rotation cover is extra. you went with the basic plan"],
    ["local", "spun like a dog trying to lie down"],
    ["shiftx", "whoever's holding left shift, you can let go now"],
    ["intern", "the rocket did a 360. then another one. then another one. then a 0"],
    ["physics", "the topple force is designed to do this to you. it's in the code"],
    ["hater", "rocket said 'i'm the main character' and started spinning in the rain"],
    ["stan", "he's not out of control he's EXPRESSING himself"],
    ["rival", "we put stabilisers on ours. like a kid's bike. no shame"],
    ["ground", "spin your way down here baby 🌀"],
    ["mom", "the other mums at school keep sending me this video"],
    ["ceo", "we've been told the word 'balance' is important. we're looking into it"],
    ["news", "ShiftX rocket becomes small tornado; meteorologists 'deeply confused'"],
    ["meteo", "sorry what is that on my radar. why is it spinning. why is it on fire"],
    ["local", "got the whole thing on video and it looks like a toilet flushing"],
    ["intern", "pilot held one shift and went full washing machine on spin cycle"],
    ["physics", "equal thrust = straight. unequal thrust = this. it's not complicated. ok it's a bit complicated"],
    ["hater", "imagine losing a fight to your own steering"],
    ["gravity", "dizzy? lie down. on me. forever"],
    ["faa", "you are not cleared for barrel rolls"],
    ["stan", "the way he spun... cinema"],
    ["insurance", "i have reviewed the spin. i have also reviewed my life choices"],
    ["shiftx", "flight tip: let go of one key BEFORE you become a frisbee"],
    ["news", "Rocket at {alt}m 'just started spinning', witnesses say, 'like it had somewhere to be'"],
    ["mom", "he spun so many times. he gets the dizziness from his father"],
  ],

  // spun out between 1,500 m and space
  lost_high: [
    ["airline", "folks if you look out the left window you'll see a rocket losing its entire mind"],
    ["meteo", "forecast update: one (1) small tornado. on fire. shaped like a rocket"],
    ["physics", "angular momentum is conserved. the rocket was not"],
    ["intern", "rocket got to {km}km and started spiralling. relatable tbh"],
    ["ceo", "that wasn't a failure that was a 360° panorama. several actually"],
    ["stan", "he got too high and got the spins. we've all been there king"],
    ["news", "Rocket briefly mistaken for 'a really angry sparkler'"],
    ["insurance", "not covered if it's doing donuts. read the policy"],
    ["hater", "{km}km up and still fumbled. generational fumble"],
    ["mom", "i filmed it vertically and it's my lock screen now"],
    ["shiftx", "it was going great and then it was going round"],
    ["faa", "please stop doing cartwheels in our airspace we're asking nicely"],
    ["local", "looked like a cat chasing its tail. a cat made of money"],
    ["rival", "thoughts and prayers to whoever's holding the shift keys"],
    ["gravity", "you got cocky"],
  ],

  // spun out in space
  lost_space: [
    ["sat", "bro is spinning in front of everyone 😭 we can all see you"],
    ["shiftx", "WE MADE IT TO SPACE (and then into pieces)"],
    ["physics", "no air up here so it'd spin forever. would have. would have spun forever"],
    ["intern", "the rocket reached space and had a breakdown. same rocket. same"],
    ["astro", "and they call ME a hazard"],
    ["ceo", "{km}km. we touched space. space touched back. hard"],
    ["stan", "dying IN SPACE is the most aura move ever. no notes"],
    ["news", "ShiftX puts first fidget spinner in orbit (for 3 seconds)"],
    ["mom", "my son is an astronaut!!! was!!! still counts!!!"],
    ["hater", "you get to space ONE time and immediately become space junk. kinda respect it"],
  ],

  bird: [
    ["gulls", "kevin did that 🫡"],
    ["intern", "a bird. one bird. one (1) bird"],
    ["physics", "1 seagull > 1 rocket. checks out"],
    ["ceo", "we're suing the bird"],
    ["local", "one seagull did what the entire government couldn't"],
    ["news", "Rocket destroyed by seagull who 'just wanted a chip'"],
    ["stan", "rip to the bird but also why was the bird there"],
    ["hater", "lost a 1v1 to a pigeon 💀"],
    ["insurance", "act of god: covered. act of gull: absolutely not"],
    ["mom", "i TOLD him to look both ways"],
    ["shiftx", "we respect wildlife so much and wildlife respects us zero"],
    ["gulls", "kevin was off the clock. kevin just saw something shiny. legend"],
    ["gulls", "another one for the wall 🐦🔥"],
    ["intern", "lost to a bird again. the birds are winning. are we the baddies"],
    ["hater", "imagine being a multi-million pound rocket and getting jumped by a seagull"],
    ["local", "the seagull just kept flying like nothing happened. legend behaviour"],
    ["stan", "the bird and the rocket had a moment and then the rocket had a moment"],
    ["physics", "bird strike. it's a famously known thing. you knew this"],
    ["ceo", "we're adding bird repellent. it's a scarecrow. we're taping a scarecrow to the rocket"],
    ["mom", "the bird started it"],
    ["news", "Seagull named employee of the month at rival company"],
    ["faa", "please yield to birds. they were here first. like, dinosaur first"],
    ["gulls", "that was for every chip you've ever dropped. every single chip"],
    ["insurance", "you can't sue a bird. we checked. we really wanted to"],
    ["shiftx", "statement: we have no beef with birds. statement update: we have beef with one bird"],
  ],

  bird_flock: [
    ["gulls", "5v1. unions work 🕊️"],
    ["intern", "we hit a 'flock'. turns out a flock is 'a lot of birds'. learning so much at this job"],
    ["news", "Birds form union, immediately win first dispute"],
    ["physics", "that's five birds"],
    ["ceo", "five birds at {alt}m? coordinated. we've hired investigators. they're also birds"],
    ["local", "they were in a V formation and the V stood for VICTORY"],
    ["stan", "the birds said 'not in our sky' and honestly? valid"],
    ["hater", "imagine the bird group chat rn 💀"],
    ["faa", "birds travel in groups. this has been true for millions of years"],
    ["mom", "five birds against my one son is BULLYING"],
    ["insurance", "policy covers one bird. you owe us four birds"],
    ["gulls", "pay the bread tax ShiftX"],
    ["gulls", "the flock always wins 🕊️🕊️🕊️🕊️🕊️"],
    ["local", "that wasn't a flock that was a coordinated military operation"],
    ["hater", "five birds. you had five chances to dodge"],
    ["intern", "how do you not see five birds. they're FIVE birds"],
    ["stan", "the birds were in formation. the rocket was not"],
    ["physics", "flocking behaviour: birds follow each other. today they followed each other into a rocket"],
    ["ceo", "we reached out to the birds' union for comment. they replied 'caw'"],
    ["mom", "five birds?? that's not a fair fight. where were THEIR parents"],
    ["news", "Flock claims rocket; demands are 'bread, and more bread'"],
    ["faa", "it's called a murmuration. it's beautiful. it's also not something you fly through"],
    ["gulls", "we've been training for this since the egg"],
    ["insurance", "multi-bird incidents count as multiple claims. each one is denied separately"],
    ["rival", "our rockets fly around birds. we have a guy who shouts BIRD"],
  ],

  drone: [
    ["drone", "PACKAGE DELIVERED ✅ (i was the package)"],
    ["intern", "a delivery drone hit us at {alt}m. it was carrying a pizza. the pizza is fine. everyone keeps asking about the pizza"],
    ["ceo", "that drone hunted us like a dog. a dog with four propellers and no conscience"],
    ["local", "drone came out of nowhere with pure murder in its eyes"],
    ["news", "Drone owner insists drone 'just wanted to say hi'"],
    ["physics", "small. fast. chose violence"],
    ["stan", "that drone was SO locked in. we stan a focused queen"],
    ["hater", "lost a dogfight to a flying webcam 💀💀"],
    ["insurance", "drone strike exclusion. yes even this one. especially this one"],
    ["drone", "TARGET ACQUIRED. TARGET ELIMINATED. RATE YOUR DELIVERY ⭐⭐⭐⭐⭐"],
    ["mom", "who lets their drone fly around unsupervised. where are its parents"],
    ["faa", "every single party involved here did something wrong"],
    ["drone", "your order has arrived ✅ (sign here: 🖊️💥)"],
    ["local", "the drone chased him like a wasp at a picnic"],
    ["hater", "imagine getting hunted by a delivery drone. a DELIVERY drone"],
    ["intern", "the drone followed us. it FOLLOWED us. why is it allowed to do that"],
    ["stan", "the drone was obsessed with him and honestly same"],
    ["physics", "it tracks you. that's its whole thing. move sideways"],
    ["ceo", "we suspect the drone was sent by competitors. we have no proof. we have vibes"],
    ["mom", "that drone has been following my son since he was a baby. ok since 4 seconds ago"],
    ["news", "Rogue drone 'just doing its job', says company that owns drone"],
    ["faa", "drones must stay below 120m. this drone had other plans"],
    ["drone", "ROUTE OPTIMISED: THROUGH YOUR ROCKET"],
    ["insurance", "damage from a DRONE? in THIS policy year?? denied"],
    ["rival", "we use the same drones for deliveries. they've never hit anything. weird"],
  ],

  hot_air_balloon: [
    ["balloon", "i was eating brie at {alt}m. i am no longer eating brie"],
    ["intern", "we hit the slowest thing in the sky. it was doing like 2mph. it was a cloud with a basket"],
    ["physics", "it was moving at walking pace and you STILL found it"],
    ["news", "Couple's balloon proposal ruined; she said yes, rocket said no"],
    ["ceo", "who puts a giant ball of fire in the sky. besides us"],
    ["local", "you hit a HOT AIR BALLOON. it was PARKED"],
    ["stan", "the balloon did nothing wrong 🕊️"],
    ["hater", "missing a hot air balloon is like missing the floor"],
    ["insurance", "harold is suing you. harold's lawyer is also in a balloon"],
    ["mom", "it was so colourful i get why he wanted to go say hi"],
    ["balloon", "day 1 of my lawsuit. suing from the basket. i live here now"],
    ["shiftx", "in our defence the balloon was full of hot air. so is our PR team"],
  ],

  prop_plane: [
    ["pilot", "30 years flying and i get t-boned by a rocket at {alt}m. my wife was right. should've taken up golf"],
    ["intern", "we hit a little plane. both pilots are fine physically. emotionally? no"],
    ["news", "Plane and rocket play real-life frogger, both lose"],
    ["physics", "it was going in a straight line. the straightest line"],
    ["ceo", "that plane came out of nowhere. well. from the side. slowly. very visibly. ok fine"],
    ["local", "the plane was just a little guy minding his business 😭"],
    ["stan", "rocket saw a plane and said 'move' and the plane did not move"],
    ["hater", "the plane moves in ONE direction bro 💀"],
    ["insurance", "two vehicles. two claims. one guy (me) about to retire"],
    ["faa", "right of way is not decided by 'who's on fire more'"],
    ["pilot", "dear ShiftX: i accept your apology in the form of a new plane and therapy"],
    ["mom", "the plane should've honked"],
  ],

  airliner: [
    ["airline", "this is your captain speaking. we have been hit by a rocket. drink service is cancelled. sorry"],
    ["intern", "we hit an entire airliner. nobody was hurt because it's a video game. please don't report us"],
    ["news", "Passengers on Flight 404 report 'a bonk', receive free pretzels"],
    ["physics", "it was 84 pixels wide. you hit the middle. honestly impressive"],
    ["ceo", "we're in talks with the airline. by talks i mean they're yelling and i'm nodding"],
    ["local", "my uncle was on that plane. he said the pretzels were stale and the rocket was rude"],
    ["stan", "rocket said 'economy? i don't know her'"],
    ["hater", "the BIGGEST thing in the sky and you hit it. bro thought it was a checkpoint"],
    ["airline", "update: we've landed. the rocket has not. thank you for flying Skyways ✈️"],
    ["insurance", "an AIRLINER?? do you know how many forms that is"],
    ["faa", "we'd like to speak to whoever was holding the shift keys. no rush. actually rush"],
    ["mom", "he always wanted to travel and now part of him is on a flight to Lisbon"],
  ],

  storm_cloud: [
    ["cloud", "⚡ get struck idiot ⚡"],
    ["meteo", "storm at {alt}m just claimed its first rocket of the season. stay indoors. especially rockets"],
    ["intern", "the rocket flew into a lightning storm. we asked the pilot why. he's crispy now. can't answer"],
    ["physics", "metal tube + lightning = 🍳"],
    ["ceo", "technically nature hit us. legally that makes it nature's fault"],
    ["news", "Storm cloud named player of the match"],
    ["stan", "flew into a thunderstorm for the aesthetic. ate. died. ate"],
    ["hater", "you saw the angry cloud with LIGHTNING IN IT and went 'yeah'"],
    ["cloud", "i'm a giant black cloud. i rumble. what more do you want from me"],
    ["local", "the thunder set my car alarm off and also me"],
    ["insurance", "lightning is an act of god. flying into it is an act of you"],
    ["mom", "the weatherman said NOTHING about rockets. writing a letter"],
  ],

  weather_balloon: [
    ["meteo", "we sent that balloon up to measure the weather. it measured one (1) rocket"],
    ["intern", "we hit a weather balloon. the weather is fine. the rocket is weather now"],
    ["physics", "it was going up slowly. you were going up fast. directly under it. come on"],
    ["news", "Rocket destroyed by weather balloon. Conspiracy theorists: 'sure it was'"],
    ["ceo", "we hit a weather balloon. or did we. (we did)"],
    ["local", "every crash they say 'it was a weather balloon'. this time it actually was. growth"],
    ["stan", "the weather balloon was just doing its job 😭"],
    ["hater", "lost to a party balloon with a degree"],
    ["insurance", "balloon incidents are handled by a separate department. it's in the basement. we don't have a basement"],
    ["meteo", "today's forecast: 100% chance of rocket bits"],
    ["mom", "he always loved balloons. he hugged that one too hard"],
    ["shiftx", "we don't think the balloon was hostile. we think it was just in the way. like all balloons"],
  ],

  satellite: [
    ["sat", "i had one job (orbit) and now i have no jobs (dead)"],
    ["intern", "we hit a satellite. half the world's GPS thinks it's in the sea now. sorry everyone"],
    ["news", "Rocket hits satellite; millions can no longer watch videos of rockets hitting satellites"],
    ["physics", "space is 99.99% empty and you found the other bit"],
    ["ceo", "space is massive and we found the ONE satellite. that's actually skill"],
    ["local", "my wifi died the second it exploded. never felt so connected to something"],
    ["stan", "made it to SPACE and immediately started beef. main character"],
    ["hater", "space is infinite and you hit a toaster with wings 💀"],
    ["sat", "shoutout to my satellite homies who saw it coming and simply did not move. real ones"],
    ["insurance", "orbital collisions need the 'up there' policy. you don't have the up there policy"],
    ["faa", "that satellite cost more than our whole building"],
    ["mom", "he made it to space and made a friend!!! the friend exploded too"],
  ],

  asteroid: [
    ["astro", "travelled 4.6 billion years for this moment"],
    ["intern", "an asteroid hit the rocket at {km}km. we're told this is 'very rare'. cool. cool cool cool"],
    ["physics", "it was falling at where you were gonna be. it did the maths. you didn't"],
    ["news", "Asteroid ends ShiftX mission; dinosaurs reportedly 'relate'"],
    ["ceo", "that asteroid had our name on it. literally. someone carved SHIFTX on it"],
    ["local", "an ASTEROID?? in THIS economy??"],
    ["stan", "taken out by an asteroid is so legendary. dinosaur core 🦖"],
    ["hater", "the dinosaurs had an excuse. you had warning triangles"],
    ["astro", "2 for 2. dinosaurs and you. big year for me"],
    ["insurance", "we do have an asteroid clause. it just says 'lol'"],
    ["sat", "it went right past me and straight for the rocket. rocks have favourites"],
    ["mom", "a space rock?? he's allergic to rocks"],
    ["shiftx", "the asteroid is fine btw. it's asked us to stop calling"],
    ["physics", "rock beats rocket. new rule"],
    ["rival", "our rockets have asteroid detection. it's called looking"],
  ],

  space_junk: [
    ["sat", "that was an old ShiftX booster. you got taken out by your own trash 💀"],
    ["intern", "we checked the serial number on the junk. it's ours. it was always ours"],
    ["news", "ShiftX rocket destroyed by older ShiftX rocket in tragic family reunion"],
    ["physics", "littering has consequences and the consequences go 7km/s"],
    ["ceo", "that debris is from a previous mission so technically that mission is still contributing"],
    ["local", "imagine getting hit by your own bin. this is why you take the trash out"],
    ["stan", "rocket got hit by its own ancestor. the lore 😭"],
    ["hater", "the call is coming from inside the orbit"],
    ["insurance", "you can't claim damage from your own junk. that's suing yourself"],
    ["astro", "and they call ME space junk"],
    ["mom", "it was his older brother. they never got along"],
    ["faa", "we've asked you to clean that up for three years"],
  ],

  // crashed after a short flight (peak under EARLY_PEAK_M)
  ground_early: [
    ["gravity", "bro thought he could get away 💀"],
    ["shiftx", "brief flight. mostly downward"],
    ["intern", "it went up for like 3 seconds and we all screamed and then we all screamed differently"],
    ["local", "it went up just high enough for it to hurt"],
    ["hater", "{peak}m. you peaked. the word 'peaked' was invented for this"],
    ["mom", "{peak} metres!!! he's never been that high!!! (please don't make that a joke)"],
    ["physics", "you went up. then you forgot to keep going up"],
    ["ground", "short-distance relationships work 🥰"],
    ["ceo", "{peak}m is a solid start. a solid, flaming start"],
    ["news", "Rocket reaches {peak}m, then reconsiders"],
    ["stan", "he got scared and came home 🥺 valid"],
    ["insurance", "the up part was covered. the down part was not"],
    ["faa", "you're supposed to go up AND STAY UP. the second part is important"],
    ["rival", "do they know rockets are supposed to keep going"],
    ["local", "went up like a firework, came down like a fridge"],
    ["intern", "rocket went up, looked around, got overwhelmed, came home. me at parties"],
    ["gravity", "come back come back come back 🫴"],
    ["hater", "flew like a paper plane in the rain"],
    ["mom", "it was up there for SO long. like 4 seconds. i counted"],
    ["physics", "you let off the thrust mid-air. you know that's how falling works right"],
    ["shiftx", "update: rocket has decided earth is fine actually"],
    ["ground", "i saw you leave and i KNEW you'd come back"],
    ["news", "Rocket launches, achieves '{peak}m and a dream', crashes"],
    ["ceo", "every rocket goes up and comes down. ours just has a shorter commute"],
    ["stan", "{peak}m of aura going up. {peak}m of aura coming down. still aura"],
    ["gulls", "watched it fall from a lamp post. 8/10 descent. no style points"],
    ["insurance", "you let go of both buttons? why would you let go of both buttons"],
    ["local", "it bonked so hard my phone sent an earthquake alert"],
    ["hater", "let go of both shifts like a toddler letting go of a balloon. except this balloon went down"],
    ["intern", "can someone tell the pilot the buttons need to be HELD"],
    ["physics", "momentum carried you up for a bit. then i carried you down. permanently"],
    ["gravity", "this is my house. you live here"],
    ["faa", "we have a word for this. the word is 'nope'"],
    ["mom", "he came back to visit!!! a little fast but it's the thought that counts"],
    ["rival", "we've seen better trajectories from a thrown sandwich"],
    ["news", "Local crater to be named after ShiftX pilot"],
    ["ceo", "we're calling that a suborbital hop. very suborbital. sub-everything"],
    ["shiftx", "there's no shame in coming back down. there's some shame in how"],
    ["stan", "him going up: 😍 him coming down: 😍 i'm biased"],
    ["hater", "rocket took a gap year and came straight back home"],
    ["local", "it went up, wobbled, said 'oh no' and so did i"],
    ["intern", "just watched our rocket lawn dart into a field. there's a cow watching. the cow is judging us"],
    ["ground", "missed you babe 💋"],
    ["physics", "a parabola. a beautiful, deadly parabola"],
    ["gravity", "i let you have that one. no i didn't"],
    ["insurance", "'i thought it would just hover' is not a legal defence"],
    ["mom", "my son is a geologist now. by accident. he's very deep in the ground"],
    ["news", "ShiftX rocket returned to sender, postage unpaid"],
    ["faa", "you had altitude. you had speed. you had a plan? no. no you did not"],
    ["hater", "{peak}m then speedran back down. any% gravity"],
  ],

  // about the game itself / dying over and over (after META_MIN_DEATHS deaths)
  meta: [
    ["dev", "i spent 3 months on the physics for you to do THAT"],
    ["dev", "attempt #{deaths}. i'm not mad. i'm just watching"],
    ["chat", "LMAOOOO RUN IT BACK"],
    ["chat", "chat is this real"],
    ["lshift", "please stop pressing me so hard i have a family"],
    ["rshift", "hello? remember me? i'm also a button"],
    ["speedrun", "new world record for fastest death. please submit your run"],
    ["therapist", "and how did it feel when the rocket exploded. again. attempt #{deaths}"],
    ["reviewer", "3/10 game. i've played it for 4 hours"],
    ["dev", "fun fact: you can hold BOTH shift keys"],
    ["intern", "this is attempt #{deaths}. i've run out of positive things to post"],
    ["stan", "attempt #{deaths} and i still believe in you"],
    ["hater", "attempt #{deaths}. the definition of insanity is right there"],
    ["shiftx", "our social media team has asked us to stop exploding so they can go home"],
    ["chat", "W pilot. L rocket"],
    ["lshift", "{deaths} launches. i've been pressed more times than i can count. i want a union"],
    ["dev", "the rocket isn't broken. i checked. it's you"],
    ["speedrun", "the any% explosion category is getting really competitive"],
    ["therapist", "you keep saying 'one more go'. let's unpack that"],
    ["reviewer", "explosions 10/10. rocket 2/10. posts 11/10"],
    ["local", "i don't even watch the launches anymore. i just come for the posts"],
    ["mom", "my son has died {deaths} times and i've posted about every single one"],
    ["physics", "i've been doing this since 1687 and nobody's ever fought me this hard"],
    ["gravity", "{deaths} for {deaths}. undefeated. ask about me"],
    ["news", "Area pilot vows 'one more go' on attempt #{deaths}"],
    ["dev", "the game is two buttons. TWO. i made it two so this wouldn't happen"],
    ["chat", "bro is NOT getting to space today"],
    ["rshift", "left shift gets all the attention smh"],
    ["intern", "we have a spreadsheet of these posts now. this is attempt #{deaths}. i'm so tired"],
    ["hater", "your best is {best}m and you just did {peak}m. character development in reverse"],
    ["stan", "your best is {best}m. you'll beat it king. maybe. probably not. but maybe"],
    ["speedrun", "the 'die on the pad' route is surprisingly optimised"],
    ["therapist", "you don't have to read every post. you don't have to die to read every post"],
    ["reviewer", "came for the rocket game. stayed for the posts about me dying"],
    ["dev", "i wrote 500 of these posts because i knew you'd be here a while"],
    ["chat", "ratio + L + crashed + attempt #{deaths}"],
    ["lshift", "caps lock is not the same as holding shift. just saying"],
    ["ceo", "pilot has requested a 'rocket that doesn't do that'. request denied"],
    ["shiftx", "reminder: the try again button is right there. you know you want to"],
    ["hater", "i've watched {deaths} attempts and i'm not even mad. it's actually soothing"],
    ["local", "my kid asked to watch rocket man again. that's #{deaths}"],
    ["dev", "if you're reading this you've seen enough posts to know what you did wrong"],
    ["speedrun", "mods reviewed your run. mods are crying laughing. run rejected"],
    ["chat", "no way he clicks try again. oh he clicked it"],
    ["therapist", "you've mentioned the seagull a lot in our sessions"],
    ["reviewer", "one star. would explode again"],
    ["gravity", "go on. click try again. i'll be here"],
    ["intern", "fun for the whole family (the family is crying)"],
    ["rshift", "i'm the right shift key and i'm the only reason you're alive. sometimes"],
    ["dev", "pro tip: hold both buttons to go up. it says this nowhere because i forgot to add a tutorial"],
    ["dev", "this is post 500. there are no more after this. (there are. i lied. keep dying)"],
  ],

  // fits any death
  generic: [
    ["shiftx", "launched ✅ went up ✅ peaked at {peak}m ✅ stayed in one piece ❌"],
    ["intern", "my manager said put a positive spin on it. the rocket put a spin on it. i quit"],
    ["ceo", "every failure is a step closer to success. we're {peak} metres closer. literally"],
    ["hater", "{peak}m. i've thrown my phone higher than that during a breakup"],
    ["stan", "{peak}m and we're still proud of him. he tried his best 🥺"],
    ["physics", "i don't make the rules. ok i do. you broke like four of them"],
    ["mom", "my son reached {peak} metres today and i've told everyone at the bakery"],
    ["news", "ShiftX stock down {peak}%"],
    ["local", "seen better flights from a paper plane made out of a parking ticket"],
    ["insurance", "i've stopped answering ShiftX calls. this post is automated"],
    ["gravity", "still undefeated btw"],
    ["rival", "to the ShiftX team: we've all been there. not literally. we've never been there"],
    ["faa", "added this to our training video under 'please don't'"],
    ["shiftx", "next rocket will have three shift keys. that'll fix it"],
    ["intern", "first week on the job. 9th explosion. there's a tally on the fridge now"],
    ["ceo", "some call it a failure. i call it a tall success that ended early"],
    ["ground", "see you soon 😘"],
    ["hater", "skill issue. big one. biggest one i've ever seen"],
    ["stan", "if you don't love him at {peak}m you don't deserve him in orbit"],
    ["local", "they said stand 3 miles back. i stood 2. i have a new haircut now"],
    ["mom", "people ask how my son's job is going and i just show them this"],
    ["news", "Black box recovered. It's 40 seconds of someone screaming 'SHIFT'"],
    ["physics", "rocket science is hard. rocket balancing is apparently harder"],
    ["insurance", "premium's going up. unlike the rocket"],
    ["shiftx", "next launch is in 5 minutes. we have so many rockets. please stop asking how many"],
  ],
};

const PAD_PEAK_M = 30; // crashes that never got higher than this count as a pad flop
const EARLY_PEAK_M = 300; // crashes that peaked below this use the early-fall pool
const LOST_HIGH_M = 1500; // spin-outs above this use the high pool
const SPACE_M = 30000; // and above this, the space pool
const META_MIN_DEATHS = 2; // meta jokes only once you've died a couple of times
const META_CHANCE = 0.2; // chance of a meta post (once unlocked)
const GENERIC_CHANCE = 0.12; // chance of a post that fits any death
const RECENT_KEY = "shiftx_recent_posts";
const RECENT_MAX = 80; // posts remembered and skipped, so you don't see repeats for a long while

/**
 * death: { cause: "crash" | "lost" | "hit", obstacle?: manifest key, altM, peakM,
 *          deaths: total runs ended (for meta jokes), best: best altitude in m }
 * Returns { author, text } with tokens filled in.
 */
export function pickPost(death) {
  const roll = Math.random();
  let pool;
  if (death.deaths >= META_MIN_DEATHS && roll < META_CHANCE) {
    pool = "meta";
  } else if (roll < META_CHANCE + GENERIC_CHANCE) {
    pool = "generic";
  } else if (death.cause === "hit") {
    pool = death.obstacle.startsWith("asteroid") ? "asteroid" : death.obstacle;
  } else if (death.cause === "lost") {
    pool =
      death.altM >= SPACE_M
        ? "lost_space"
        : death.altM >= LOST_HIGH_M
          ? "lost_high"
          : "lost_low";
  } else {
    pool =
      death.peakM < PAD_PEAK_M
        ? "pad"
        : death.peakM < EARLY_PEAK_M
          ? "ground_early"
          : "ground";
  }
  if (!POSTS[pool]) pool = "generic";

  // pick one not shown recently; if the whole pool is recent, allow anything
  const recent = loadRecent();
  const ids = POSTS[pool].map((_, i) => `${pool}:${i}`);
  const fresh = ids.filter((id) => !recent.includes(id));
  const id = pickRandom(fresh.length > 0 ? fresh : ids);
  saveRecent([...recent.filter((r) => r !== id), id].slice(-RECENT_MAX));
  const [authorKey, text] = POSTS[pool][Number(id.split(":")[1])];

  const fmt = (n) => Math.floor(n || 0).toLocaleString("en-US");
  return {
    author: AUTHORS[authorKey],
    text: text
      .replaceAll("{alt}", fmt(death.altM))
      .replaceAll("{peak}", fmt(death.peakM))
      .replaceAll("{km}", (death.peakM / 1000).toFixed(1))
      .replaceAll("{deaths}", fmt(death.deaths))
      .replaceAll("{best}", fmt(death.best)),
  };
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Recently shown post ids, kept in this browser. Blocked storage just means repeats are possible.
function loadRecent() {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // not remembered; fine
  }
}

/** Total number of posts, for sanity checks. */
export const POST_COUNT = Object.values(POSTS).reduce((n, p) => n + p.length, 0);

// The bitmap fonts are printable ASCII only, so emoji would silently vanish. Swap each for an
// ASCII emoticon in the same spirit, and drop anything else outside the font.
const EMOJI = [
  ["💀", "x_x"], ["😭", "T_T"], ["🥺", "(._.)"], ["🥹", "(;_;)"], ["🫡", "o7"], ["😂", "XD"],
  ["😍", "<3"], ["🥰", "<3"], ["💋", ":*"], ["😘", ";*"], ["😏", ";)"], ["😡", ">:("], ["😔", ":("],
  ["🫂", "*hug*"], ["🫴", "*grabby hands*"], ["🕊️", "*coo*"], ["🕊", "*coo*"], ["✅", "[x]"],
  ["❌", "[ ]"], ["⚡", "*zap*"], ["🍳", "*sizzle*"], ["🔥", "*fire*"], ["🐦", "*caw*"],
  ["🚀", "*whoosh*"], ["🦖", "*rawr*"], ["🍟", "*chips*"], ["✈️", "*vroom*"], ["✈", "*vroom*"],
  ["🌀", "@"], ["🍿", "*munch*"], ["📸", "*click*"], ["🖊️", "_"], ["🖊", "_"], ["💥", "*boom*"],
  ["⭐", "*"], ["👍", "(y)"], ["☕", "*sip*"], ["°", ""],
];

export function toFontSafe(text) {
  let out = text;
  for (const [e, a] of EMOJI) out = out.replaceAll(e, a);
  return out.replace(/[^\x20-\x7e\n]/g, "").replace(/ {2,}/g, " ").trim();
}
