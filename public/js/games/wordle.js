// Word list (words that can be the answer)
const WORDS = [
    'apple', 'beach', 'brain', 'bread', 'brick', 'bring', 'brown', 'build', 'chair', 'check',
    'clean', 'clear', 'climb', 'clock', 'close', 'cloud', 'coach', 'coast', 'could', 'count',
    'cover', 'craft', 'crane', 'crash', 'cream', 'cross', 'crowd', 'dance', 'death', 'depth',
    'doubt', 'draft', 'drain', 'drama', 'drank', 'dream', 'dress', 'drink', 'drive', 'drown',
    'early', 'earth', 'eight', 'elect', 'empty', 'enemy', 'enjoy', 'enter', 'equal', 'error',
    'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fancy', 'fault', 'favor',
    'feast', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'flame', 'flash', 'fleet',
    'floor', 'flour', 'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame', 'frank',
    'fresh', 'front', 'fruit', 'fully', 'giant', 'given', 'glass', 'globe', 'glory', 'going',
    'grace', 'grade', 'grain', 'grand', 'grant', 'grass', 'grave', 'great', 'green', 'grind',
    'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harsh', 'heart',
    'heavy', 'hello', 'hence', 'horse', 'hotel', 'house', 'human', 'ideal', 'image', 'index',
    'inner', 'input', 'issue', 'joint', 'judge', 'juice', 'known', 'labor', 'large',
    'laser', 'later', 'laugh', 'layer', 'learn', 'least', 'leave', 'legal', 'level',
    'light', 'limit', 'links', 'liver', 'local', 'loose', 'lower', 'lucky', 'lunch',
    'magic', 'major', 'maker', 'march', 'match', 'maybe', 'mayor', 'meant', 'media',
    'metal', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor',
    'mount', 'mouse', 'mouth', 'movie', 'music', 'needs', 'nerve', 'never', 'night', 'noise',
    'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other',
    'ought', 'paint', 'panel', 'paper', 'party', 'peace', 'phase', 'phone', 'photo',
    'piano', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point',
    'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof',
    'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'range', 'rapid',
    'ratio', 'reach', 'ready', 'refer', 'right', 'river', 'robin', 'roger', 'roman', 'rough',
    'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve',
    'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shine',
    'shirt', 'shock', 'shoot', 'shore', 'short', 'shown', 'sight', 'since', 'sixth',
    'sixty', 'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke',
    'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend',
    'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam',
    'steel', 'steep', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story',
    'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table',
    'taken', 'taste', 'taxes', 'teach', 'teeth', 'texas', 'thank', 'theft', 'their',
    'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw',
    'throw', 'tight', 'times', 'tired', 'title', 'today', 'token', 'tools', 'total', 'touch',
    'tough', 'tower', 'track', 'trade', 'train', 'trash', 'treat', 'trend', 'trial', 'tribe',
    'trick', 'tried', 'tries', 'truck', 'truly', 'trust', 'truth', 'twice', 'under', 'union',
    'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video',
    'virus', 'visit', 'vital', 'voice', 'waste', 'watch', 'water', 'wheel', 'where', 'which',
    'while', 'white', 'whole', 'whose', 'woman', 'world', 'worry', 'worse', 'worst', 'worth',
    'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'youth', 'zebra', 'zones'
];

// Extended valid words list (includes less common words that are valid guesses)
const VALID_WORDS = new Set([
    ...WORDS,
    'aahed', 'aalii', 'abaca', 'abaci', 'aback', 'abaft', 'abamp', 'abase', 'abash', 'abate',
    'abbey', 'abbot', 'abhor', 'abide', 'abler', 'abode', 'abort', 'about', 'above', 'abuse',
    'abuts', 'abyss', 'acorn', 'acres', 'acrid', 'acted', 'actor', 'acute', 'adage', 'adapt',
    'added', 'adder', 'addle', 'adept', 'admin', 'admit', 'adobe', 'adopt', 'adult', 'aegis',
    'aeons', 'affix', 'afire', 'after', 'again', 'agate', 'agent', 'aging', 'aglow', 'agony',
    'agree', 'ahead', 'aided', 'aider', 'aimed', 'aimer', 'aired', 'aisle', 'alarm', 'album',
    'alder', 'alert', 'algae', 'alibi', 'alien', 'align', 'alike', 'alive', 'allay', 'alley',
    'allot', 'allow', 'alloy', 'aloft', 'alone', 'along', 'aloof', 'aloud', 'alpha', 'altar',
    'alter', 'amaze', 'amber', 'ambit', 'amble', 'amend', 'amine', 'amino', 'amiss', 'amity',
    'among', 'ample', 'amply', 'amuse', 'angel', 'anger', 'angle', 'angry', 'angst', 'anime',
    'ankle', 'annex', 'annoy', 'annul', 'anode', 'antic', 'anvil', 'aorta', 'apart', 'aphid',
    'apple', 'apply', 'apron', 'areas', 'arena', 'argue', 'arise', 'armor', 'aroma', 'arose',
    'array', 'arrow', 'arson', 'artsy', 'ascot', 'ashen', 'ashes', 'aside', 'asset', 'atlas',
    'atoll', 'atoms', 'atone', 'attic', 'audio', 'audit', 'augur', 'aunts', 'aural', 'avail',
    'avert', 'avoid', 'await', 'awake', 'award', 'aware', 'awful', 'awoke', 'axial', 'axiom',
    'aztec', 'azure', 'babel', 'bacon', 'badge', 'badly', 'bagel', 'baggy', 'baked', 'baker',
    'balls', 'balmy', 'banal', 'bands', 'banjo', 'banks', 'baron', 'basal', 'based', 'bases',
    'basic', 'basil', 'basin', 'basis', 'batch', 'baton', 'batty', 'bawdy', 'bayou', 'beads',
    'beady', 'beams', 'beans', 'beard', 'bears', 'beast', 'beaut', 'bebop', 'becks', 'beech',
    'beefy', 'beeps', 'beers', 'beets', 'began', 'begat', 'beget', 'begin', 'begun', 'being',
    'bells', 'belly', 'below', 'belts', 'bench', 'bends', 'bent', 'berry', 'berth', 'beset',
    'bible', 'bicep', 'biddy', 'bided', 'bides', 'bidet', 'bigot', 'biked', 'biker', 'bikes',
    'bills', 'billy', 'bingo', 'biome', 'biped', 'birch', 'birds', 'birth', 'bison', 'bites',
    'bitty', 'black', 'blade', 'blame', 'bland', 'blank', 'blare', 'blast', 'blaze', 'bleak',
    'bleat', 'bleed', 'blend', 'bless', 'blimp', 'blind', 'blink', 'bliss', 'blitz', 'bloat',
    'block', 'bloke', 'blond', 'blood', 'bloom', 'blown', 'blows', 'blues', 'bluff', 'blunt',
    'blurb', 'blurs', 'blurt', 'blush', 'board', 'boast', 'boats', 'bobby', 'boded', 'bodes',
    'bogey', 'boggy', 'bogus', 'boils', 'bolts', 'bombs', 'bonds', 'boned', 'bones', 'bongo',
    'bonus', 'books', 'boost', 'booth', 'boots', 'booty', 'booze', 'boozy', 'borax', 'bored',
    'borer', 'bores', 'borne', 'bosom', 'bossy', 'botch', 'bound', 'bouts', 'bowed', 'bowel',
    'bower', 'bowls', 'boxed', 'boxer', 'boxes', 'brace', 'brags', 'braid', 'brake', 'brand',
    'brash', 'brass', 'brave', 'bravo', 'brawl', 'brawn', 'break', 'breed', 'briar', 'bribe',
    'bride', 'brief', 'brier', 'brigs', 'brim', 'brine', 'brink', 'briny', 'brisk', 'broad',
    'broil', 'broke', 'brood', 'brook', 'broom', 'broth', 'brows', 'brunt', 'brush', 'brute',
    'buddy', 'budge', 'buggy', 'bugle', 'built', 'bulbs', 'bulge', 'bulky', 'bulls', 'bully',
    'bumps', 'bumpy', 'bunch', 'bunks', 'bunny', 'buoys', 'burns', 'burnt', 'burps', 'burst',
    'buses', 'bushy', 'busts', 'busty', 'butch', 'butte', 'buyer', 'bylaw', 'byway', 'cabal',
    'cabby', 'cabin', 'cable', 'cacao', 'cache', 'cacti', 'cadet', 'caged', 'cages', 'cagey',
    'cairn', 'caked', 'cakes', 'calls', 'calms', 'camel', 'cameo', 'camps', 'canal', 'candy',
    'canes', 'canoe', 'canon', 'caper', 'capes', 'cards', 'cared', 'carer', 'cares', 'cargo',
    'carol', 'carry', 'carve', 'cases', 'caste', 'catch', 'cater', 'cause', 'caves', 'cease',
    'cedar', 'cells', 'cents', 'chafe', 'chaff', 'chain', 'chalk', 'champ', 'chant', 'chaos',
    'chaps', 'charm', 'chart', 'chase', 'chasm', 'cheap', 'cheat', 'cheek', 'cheer', 'chess',
    'chest', 'chick', 'chide', 'chief', 'child', 'chill', 'chimp', 'china', 'chips', 'chirp',
    'chive', 'choir', 'choke', 'chomp', 'chord', 'chore', 'chose', 'chunk', 'churn', 'cider',
    'cigar', 'cinch', 'circa', 'cited', 'cites', 'civic', 'civil', 'claim', 'clamp', 'clams',
    'clang', 'clank', 'claps', 'clash', 'clasp', 'class', 'claw', 'claws', 'clays', 'clerk',
    'click', 'cliff', 'climb', 'cling', 'clink', 'clips', 'cloak', 'clone', 'cloth', 'clots',
    'clout', 'clove', 'clown', 'clubs', 'cluck', 'clued', 'clues', 'clump', 'clung', 'coals',
    'coarse', 'coats', 'cobra', 'cocoa', 'cocos', 'coded', 'coder', 'codes', 'coils', 'coins',
    'colic', 'colon', 'color', 'colts', 'combo', 'comes', 'comet', 'comic', 'comma', 'conch',
    'condo', 'cones', 'coral', 'cords', 'cores', 'corgi', 'corny', 'costs', 'couch', 'cough',
    'coupe', 'coups', 'court', 'coven', 'covet', 'crack', 'cramp', 'crank', 'crass', 'crate',
    'crave', 'crawl', 'craze', 'crazy', 'creak', 'creep', 'creme', 'crepe', 'crept', 'crest',
    'crews', 'crick', 'cried', 'crier', 'cries', 'crime', 'crimp', 'crisp', 'croak', 'crock',
    'crook', 'crops', 'croup', 'crown', 'crows', 'crude', 'cruel', 'cruet', 'crush', 'crust',
    'crypt', 'cubic', 'cumin', 'cupid', 'curds', 'cured', 'cures', 'curls', 'curly', 'curry',
    'curse', 'curve', 'curvy', 'cushy', 'cycle', 'cynic', 'daddy', 'daily', 'dairy', 'daisy',
    'dames', 'damps', 'dance', 'dandy', 'dared', 'dares', 'darks', 'darts', 'dated', 'dates',
    'datum', 'daunt', 'deals', 'dealt', 'dears', 'deary', 'debit', 'debug', 'debut', 'decal',
    'decay', 'decks', 'decor', 'decoy', 'decry', 'deeds', 'deems', 'deity', 'delay', 'delta',
    'delve', 'demon', 'demur', 'denim', 'dense', 'depot', 'derby', 'desks', 'deter', 'detox',
    'deuce', 'devil', 'diary', 'dicey', 'digit', 'dined', 'diner', 'dines', 'dingy', 'disco',
    'discs', 'disks', 'ditch', 'ditto', 'ditty', 'divan', 'diver', 'dives', 'dizzy', 'docks',
    'dodge', 'dodgy', 'doers', 'doing', 'dolls', 'dolly', 'domed', 'domes', 'donor', 'donut',
    'dooms', 'doors', 'dopes', 'dopey', 'dorks', 'dorky', 'dorms', 'doses', 'doted', 'dotes',
    'dotty', 'dough', 'douse', 'doves', 'dowdy', 'downs', 'downy', 'dowry', 'dozed', 'dozen',
    'dozer', 'dozes', 'drabs', 'drags', 'drake', 'drape', 'drawl', 'drawn', 'draws', 'dread',
    'dress', 'dried', 'drier', 'dries', 'drift', 'drill', 'drily', 'drink', 'drips', 'drive',
    'droit', 'droll', 'drone', 'drool', 'droop', 'drops', 'dross', 'drove', 'druid', 'drums',
    'drunk', 'dryer', 'dryly', 'duals', 'ducal', 'ducks', 'ducky', 'ducts', 'dudes', 'duels',
    'duets', 'dukes', 'dulls', 'dully', 'dummy', 'dumps', 'dumpy', 'dunce', 'dunes', 'dunks',
    'duped', 'dupes', 'durst', 'dusky', 'dusty', 'dutch', 'dwarf', 'dwell', 'dwelt', 'dying',
    'eager', 'eagle', 'eared', 'earls', 'early', 'earns', 'eased', 'easel', 'eases', 'eaten',
    'eater', 'eaves', 'ebbed', 'ebony', 'edged', 'edges', 'edgy', 'edict', 'edify', 'eerie',
    'egged', 'egret', 'eject', 'elbow', 'elder', 'elect', 'elegy', 'elfin', 'elide', 'elite',
    'elope', 'elude', 'elves', 'email', 'embed', 'ember', 'emcee', 'emoji', 'emote', 'ended',
    'endow', 'enema', 'enemy', 'enjoy', 'ennui', 'enrich', 'ensue', 'entry', 'envoy', 'epoch',
    'epoxy', 'equip', 'erase', 'erect', 'erode', 'erred', 'erupt', 'essay', 'ether', 'ethos',
    'evade', 'evens', 'event', 'every', 'evict', 'evoke', 'exact', 'exalt', 'exams', 'excel',
    'exert', 'exile', 'exist', 'exits', 'expat', 'expel', 'extra', 'exude', 'exult', 'eying',
    'fable', 'faced', 'faces', 'facet', 'facts', 'faded', 'fades', 'fails', 'faint', 'fairy',
    'faker', 'fakes', 'falls', 'famed', 'fancy', 'fangs', 'farce', 'fared', 'fares', 'farms',
    'fatal', 'fatty', 'fauna', 'fauns', 'favor', 'feast', 'feats', 'feeds', 'feels', 'feign',
    'feint', 'fella', 'felon', 'femur', 'fence', 'fends', 'feral', 'ferry', 'fetal', 'fetch',
    'fetid', 'fetus', 'feud', 'feuds', 'fever', 'fewer', 'fiber', 'fibre', 'field', 'fiend',
    'fiery', 'fifth', 'fifty', 'fight', 'filch', 'filed', 'files', 'filet', 'fills', 'filly',
    'films', 'filmy', 'filth', 'final', 'finch', 'finds', 'fined', 'finer', 'fines', 'fired',
    'firer', 'fires', 'firms', 'first', 'fishy', 'fitly', 'fits', 'fiver', 'fives', 'fixed',
    'fixer', 'fixes', 'fizzy', 'fjord', 'flack', 'flags', 'flair', 'flake', 'flaky', 'flame',
    'flank', 'flaps', 'flare', 'flash', 'flask', 'flats', 'flaws', 'fleas', 'fleck', 'flesh',
    'flick', 'flied', 'flier', 'flies', 'fling', 'flint', 'flips', 'flirt', 'float', 'flock',
    'flood', 'floor', 'flops', 'flora', 'floss', 'flour', 'flout', 'flows', 'fluid', 'fluke',
    'flung', 'flunk', 'flush', 'flute', 'foams', 'foamy', 'focal', 'focus', 'foggy', 'foils',
    'folds', 'folks', 'folly', 'fonts', 'foods', 'fools', 'foray', 'forgo', 'forks', 'forms',
    'forte', 'forth', 'forty', 'forum', 'fossa', 'fouls', 'found', 'fount', 'fours', 'fowls',
    'foxes', 'foyer', 'frail', 'frame', 'frank', 'fraud', 'frays', 'freak', 'freed', 'freer',
    'fresh', 'friar', 'fried', 'fries', 'frill', 'frisk', 'fritz', 'frizz', 'frock', 'frogs',
    'frond', 'front', 'frost', 'froth', 'frown', 'froze', 'fruit', 'frump', 'fudge', 'fuels',
    'fully', 'fumed', 'fumes', 'funds', 'fungi', 'funky', 'funny', 'furry', 'fused', 'fuses',
    'fussy', 'fusty', 'fuzzy', 'gaffe', 'gaily', 'gains', 'gales', 'games', 'gamma', 'gamut',
    'gangs', 'gaped', 'gapes', 'gases', 'gasps', 'gates', 'gauge', 'gaunt', 'gauze', 'gauzy',
    'gavel', 'gazes', 'gears', 'gecko', 'geeks', 'geeky', 'geese', 'genes', 'genie', 'genre',
    'germs', 'ghost', 'gifts', 'gilds', 'gills', 'gilts', 'girls', 'girly', 'girth', 'gists',
    'given', 'giver', 'gives', 'gizmo', 'glade', 'gland', 'glare', 'glass', 'glaze', 'gleam',
    'glean', 'glebe', 'glees', 'glide', 'glint', 'glitz', 'gloat', 'globe', 'gloom', 'glory',
    'gloss', 'glove', 'glows', 'glued', 'glues', 'gluey', 'gnarl', 'gnash', 'gnats', 'gnaws',
    'gnome', 'goads', 'goals', 'goats', 'godly', 'going', 'golds', 'golfs', 'goner', 'gongs',
    'gonna', 'goods', 'gooey', 'goofs', 'goofy', 'goons', 'goose', 'gored', 'gores', 'gorge',
    'gotta', 'gouge', 'gourd', 'gowns', 'grabs', 'grace', 'grade', 'graft', 'grail', 'grain',
    'grams', 'grand', 'grape', 'graph', 'grasp', 'grass', 'grate', 'grave', 'gravy', 'grays',
    'graze', 'great', 'greed', 'greek', 'green', 'greet', 'greys', 'grief', 'grill', 'grime',
    'grimy', 'grind', 'grins', 'gripe', 'grips', 'grist', 'grits', 'groan', 'groat', 'groin',
    'groom', 'grope', 'gross', 'group', 'grout', 'grove', 'growl', 'grown', 'grows', 'gruel',
    'gruff', 'grump', 'grunt', 'guano', 'guard', 'guava', 'guess', 'guest', 'guide', 'guild',
    'guilt', 'guise', 'gulch', 'gulfs', 'gulls', 'gulps', 'gummy', 'gunky', 'gunny', 'gusts',
    'gusty', 'gutsy', 'gutter', 'guys', 'gypsy', 'gyrate', 'habit', 'hacks', 'haiku', 'hails',
    'hairs', 'hairy', 'halls', 'halts', 'halve', 'hands', 'handy', 'hangs', 'hanks', 'happy',
    'hardy', 'harem', 'hares', 'harks', 'harms', 'harps', 'harsh', 'haste', 'hasty', 'hatch',
    'hated', 'hater', 'hates', 'hauls', 'haunt', 'haven', 'haves', 'havoc', 'hawks', 'hazed',
    'hazel', 'hazes', 'heads', 'heady', 'heals', 'heaps', 'heard', 'hears', 'heart', 'heath',
    'heats', 'heave', 'heavy', 'hedge', 'heeds', 'heels', 'hefty', 'heirs', 'heist', 'helix',
    'hello', 'helps', 'hence', 'herbs', 'herds', 'heron', 'heros', 'hides', 'highs', 'hiked',
    'hiker', 'hikes', 'hills', 'hilly', 'hilts', 'hinds', 'hinge', 'hints', 'hippo', 'hippy',
    'hired', 'hires', 'hitch', 'hives', 'hoard', 'hoary', 'hobby', 'hoist', 'holds', 'holed',
    'holes', 'holly', 'homer', 'homes', 'honey', 'honks', 'honor', 'hoods', 'hoofs', 'hooks',
    'hoops', 'hoots', 'hoped', 'hopes', 'horde', 'horns', 'horny', 'horse', 'hosed', 'hoses',
    'hosts', 'hotel', 'hotly', 'hound', 'hours', 'house', 'hovel', 'hover', 'howdy', 'howls',
    'hubby', 'huffs', 'huffy', 'human', 'humid', 'humps', 'humpy', 'humus', 'hunch', 'hunks',
    'hunky', 'hunts', 'hurls', 'hurry', 'hurts', 'husks', 'husky', 'hussy', 'hutch', 'hydra',
    'hyena', 'hymen', 'hymns', 'hyper', 'icier', 'icily', 'icing', 'ideal', 'ideas', 'idiom',
    'idiot', 'idled', 'idler', 'idles', 'idols', 'igloo', 'image', 'imbed', 'imbue', 'impel',
    'imply', 'inane', 'inbox', 'incur', 'index', 'indie', 'inept', 'inert', 'infer', 'infra',
    'ingot', 'inked', 'inlet', 'inner', 'input', 'intro', 'ionic', 'irate', 'irked', 'irony',
    'isles', 'issue', 'itchy', 'items', 'ivory', 'jab', 'jacks', 'jaded', 'jails', 'jammed',
    'japan', 'jaunt', 'jazzy', 'jeans', 'jeeps', 'jeers', 'jelly', 'jerks', 'jerky', 'jests',
    'jewel', 'jiffy', 'jilts', 'jimmy', 'jinks', 'jived', 'jives', 'joins', 'joint', 'joked',
    'joker', 'jokes', 'jokey', 'jolly', 'jolts', 'joust', 'joyed', 'judge', 'juice', 'juicy',
    'jumbo', 'jumps', 'jumpy', 'junco', 'junks', 'junky', 'juror', 'karma', 'kayak', 'keels',
    'keeps', 'kelps', 'kennel', 'keyed', 'khaki', 'kicks', 'kills', 'kilns', 'kilts', 'kinds',
    'kings', 'kinks', 'kinky', 'kiosk', 'kiss', 'kites', 'kitty', 'knack', 'knead', 'kneed',
    'kneel', 'knees', 'knell', 'knelt', 'knife', 'knits', 'knobs', 'knock', 'knoll', 'knots',
    'known', 'knows', 'koala', 'label', 'labor', 'laced', 'laces', 'lacks', 'laden', 'ladle',
    'lager', 'laggy', 'laird', 'lairs', 'lakes', 'lambs', 'lamps', 'lance', 'lands', 'lanes',
    'lanky', 'lapel', 'lapse', 'large', 'larks', 'larva', 'laser', 'lasso', 'lasts', 'latch',
    'later', 'latex', 'lathe', 'laugh', 'lawns', 'layer', 'leads', 'leafy', 'leaks', 'leaky',
    'leans', 'leaps', 'leapt', 'learn', 'lease', 'leash', 'least', 'leave', 'ledge', 'leech',
    'leeks', 'leers', 'leery', 'lefts', 'lefty', 'legal', 'leggy', 'lemma', 'lemon', 'lemur',
    'lends', 'lens', 'leper', 'level', 'lever', 'libel', 'liege', 'liens', 'lifts', 'light',
    'liked', 'liken', 'likes', 'lilac', 'limbo', 'limbs', 'limit', 'limps', 'lined', 'linen',
    'liner', 'lines', 'lingo', 'links', 'lions', 'lipid', 'lisps', 'lists', 'liter', 'lithe',
    'litre', 'lived', 'liven', 'liver', 'lives', 'livid', 'llama', 'loads', 'loafs', 'loamy',
    'loans', 'loath', 'lobby', 'lobed', 'lobes', 'local', 'lochs', 'locks', 'locus', 'lodge',
    'lofts', 'lofty', 'logic', 'login', 'logos', 'loins', 'loner', 'longs', 'looks', 'looms',
    'loons', 'loony', 'loops', 'loopy', 'loose', 'loots', 'loped', 'lopes', 'lords', 'lorry',
    'loser', 'loses', 'lossy', 'lotto', 'lotus', 'louse', 'lousy', 'louts', 'loved', 'lover',
    'loves', 'lower', 'lowly', 'loyal', 'lucid', 'lucks', 'lucky', 'lucre', 'lulls', 'lumps',
    'lumpy', 'lunar', 'lunch', 'lunge', 'lungs', 'lurch', 'lured', 'lures', 'lurks', 'lusts',
    'lusty', 'lying', 'lymph', 'lynch', 'lyric', 'macho', 'macro', 'madam', 'madly', 'mafia',
    'magic', 'magma', 'maids', 'mails', 'maims', 'mains', 'maize', 'major', 'maker', 'makes',
    'males', 'malls', 'malts', 'malty', 'mamas', 'mambo', 'mamma', 'mammy', 'maned', 'manes',
    'mange', 'mango', 'mangy', 'mania', 'manic', 'manly', 'manor', 'maple', 'march', 'mares',
    'marks', 'marry', 'marsh', 'masks', 'mason', 'match', 'mated', 'mates', 'mauve', 'maxed',
    'maxes', 'maxim', 'maybe', 'mayor', 'mazes', 'meads', 'meals', 'mealy', 'means', 'meant',
    'meats', 'meaty', 'medal', 'media', 'medic', 'meets', 'melee', 'melon', 'melts', 'memo',
    'menus', 'mercy', 'merge', 'merit', 'merry', 'messy', 'metal', 'meter', 'metre', 'metro',
    'micro', 'midst', 'might', 'miked', 'mikes', 'milks', 'milky', 'mills', 'mimed', 'mimes',
    'mimic', 'mince', 'minds', 'mined', 'miner', 'mines', 'minor', 'mints', 'minty', 'minus',
    'mired', 'mires', 'mirth', 'miser', 'misty', 'miter', 'mixed', 'mixer', 'mixes', 'moans',
    'moats', 'mocks', 'model', 'modem', 'modes', 'moist', 'molar', 'molds', 'moldy', 'moles',
    'molls', 'molts', 'momma', 'mommy', 'monks', 'month', 'moods', 'moody', 'mooed', 'moons',
    'moony', 'moors', 'moose', 'moped', 'mopes', 'moral', 'mores', 'morph', 'morse', 'mossy',
    'motel', 'moths', 'motif', 'motor', 'motto', 'mould', 'moult', 'mound', 'mount', 'mourn',
    'mouse', 'mousy', 'mouth', 'moved', 'mover', 'moves', 'movie', 'mowed', 'mower', 'mucus',
    'muddy', 'muffs', 'muffy', 'mulch', 'mules', 'mulls', 'mummy', 'mumps', 'munch', 'mural',
    'murky', 'mused', 'muses', 'mushy', 'music', 'musks', 'musky', 'musts', 'musty', 'muted',
    'muter', 'mutes', 'mutts', 'myrrh', 'myths', 'nails', 'naive', 'naked', 'named', 'names',
    'nanny', 'napes', 'nasal', 'nasty', 'natal', 'naval', 'navel', 'nears', 'necks', 'needs',
    'needy', 'neigh', 'neons', 'nerds', 'nerdy', 'nerve', 'nervy', 'nests', 'never', 'newer',
    'newly', 'newsy', 'newts', 'nicer', 'niche', 'nicks', 'niece', 'nifty', 'night', 'ninja',
    'ninny', 'ninth', 'nippy', 'noble', 'nobly', 'nodal', 'nodes', 'noise', 'noisy', 'nomad',
    'nooks', 'noons', 'noose', 'norms', 'north', 'nosed', 'noses', 'nosey', 'notch', 'noted',
    'notes', 'nouns', 'novel', 'nudge', 'nuked', 'nukes', 'nulls', 'numbs', 'nurse', 'nutty',
    'nylon', 'nymph', 'oaken', 'oases', 'oasis', 'oaths', 'occur', 'ocean', 'octet', 'odder',
    'oddly', 'odors', 'offer', 'often', 'ogled', 'ogles', 'oiled', 'oiler', 'oinks', 'okays',
    'older', 'oldie', 'olive', 'ombre', 'omega', 'omen', 'onion', 'onset', 'oohed', 'oozed',
    'oozes', 'opals', 'opens', 'opera', 'opted', 'optic', 'orals', 'orbit', 'order', 'organ',
    'other', 'otter', 'ought', 'ounce', 'ousts', 'outdo', 'outed', 'outer', 'outgo', 'ovals',
    'ovary', 'ovate', 'ovens', 'overt', 'owing', 'owled', 'owned', 'owner', 'oxide', 'ozone',
    'paced', 'pacer', 'paces', 'packs', 'pacts', 'paddy', 'padre', 'pagan', 'paged', 'pager',
    'pages', 'pails', 'pains', 'paint', 'pairs', 'paled', 'paler', 'pales', 'palms', 'palsy',
    'pandy', 'paned', 'panel', 'panes', 'pangs', 'panic', 'pansy', 'pants', 'papas', 'papal',
    'paper', 'parch', 'pared', 'pares', 'paris', 'parks', 'parry', 'parse', 'parts', 'party',
    'pasta', 'paste', 'pasty', 'patch', 'patio', 'patsy', 'patty', 'pause', 'paved', 'paver',
    'paves', 'pawed', 'pawns', 'peace', 'peach', 'peaks', 'peals', 'pearl', 'pears', 'peats',
    'peaty', 'pecan', 'pecks', 'pedal', 'peeks', 'peels', 'peeps', 'peers', 'penal', 'pence',
    'penny', 'peons', 'perch', 'peril', 'perks', 'perky', 'perms', 'perry', 'pesky', 'pesos',
    'pests', 'petal', 'petty', 'phase', 'phone', 'phony', 'photo', 'piano', 'picks', 'picky',
    'piece', 'piers', 'piggy', 'piked', 'pikes', 'piled', 'piles', 'pills', 'pilot', 'pimps',
    'pinch', 'pined', 'pines', 'pings', 'pinko', 'pinks', 'pinky', 'pints', 'pinup', 'pious',
    'piped', 'piper', 'pipes', 'pitch', 'piths', 'pithy', 'piton', 'pitta', 'pivot', 'pixel',
    'pizza', 'place', 'plaid', 'plain', 'plait', 'plane', 'plank', 'plans', 'plant', 'plate',
    'playa', 'plays', 'plaza', 'plead', 'pleas', 'pleat', 'plebe', 'plied', 'plies', 'plods',
    'plonk', 'plops', 'plots', 'plows', 'ploys', 'pluck', 'plugs', 'plumb', 'plume', 'plump',
    'plums', 'plumy', 'plunk', 'plush', 'poach', 'pocks', 'pods', 'poems', 'poets', 'point',
    'poise', 'poked', 'poker', 'pokes', 'polar', 'poled', 'poles', 'polio', 'polka', 'polls',
    'polyp', 'pomp', 'ponds', 'pony', 'pooch', 'pools', 'poop', 'poops', 'popes', 'poppy',
    'porch', 'pored', 'pores', 'porks', 'porky', 'ports', 'posed', 'poser', 'poses', 'posit',
    'posse', 'posts', 'potty', 'pouch', 'pound', 'pours', 'pouts', 'pouty', 'power', 'prank',
    'prawn', 'prays', 'press', 'preys', 'price', 'prick', 'pride', 'pried', 'pries', 'prime',
    'primp', 'prims', 'print', 'prior', 'prism', 'privy', 'prize', 'probe', 'prods', 'promo',
    'proms', 'prone', 'prong', 'proof', 'props', 'prose', 'proud', 'prove', 'prowl', 'prows',
    'proxy', 'prude', 'prune', 'psalm', 'pubic', 'pucks', 'pudgy', 'puffs', 'puffy', 'puked',
    'pukes', 'pulls', 'pulps', 'pulpy', 'pulse', 'pumps', 'punch', 'punks', 'punky', 'punny',
    'pupil', 'puppy', 'puree', 'purer', 'purge', 'purrs', 'purse', 'pushy', 'putts', 'putty',
    'pygmy', 'quack', 'quaff', 'quail', 'quake', 'qualm', 'quark', 'quart', 'quasi', 'queen',
    'queer', 'quell', 'query', 'quest', 'queue', 'quick', 'quids', 'quiet', 'quiff', 'quill',
    'quilt', 'quirk', 'quite', 'quota', 'quote', 'rabbi', 'rabid', 'raced', 'racer', 'races',
    'racks', 'radar', 'radio', 'radix', 'radon', 'rafts', 'raged', 'rages', 'raids', 'rails',
    'rains', 'rainy', 'raise', 'rajah', 'raked', 'rakes', 'rally', 'ramps', 'ranch', 'randy',
    'range', 'rangy', 'ranks', 'rants', 'rapid', 'rarer', 'rased', 'rasps', 'raspy', 'rated',
    'rates', 'ratio', 'ratty', 'raved', 'raven', 'raves', 'rawer', 'rayon', 'razed', 'razes',
    'razor', 'reach', 'react', 'reads', 'ready', 'realm', 'reams', 'reaps', 'rears', 'rebel',
    'rebut', 'recap', 'recto', 'recur', 'recut', 'redid', 'reeds', 'reedy', 'reefs', 'reeks',
    'reels', 'refer', 'refit', 'regal', 'reign', 'reins', 'relax', 'relay', 'relic', 'remit',
    'renal', 'rends', 'renew', 'rents', 'repay', 'repel', 'reply', 'repos', 'rerun', 'reset',
    'resin', 'rests', 'retch', 'retro', 'retry', 'reuse', 'revel', 'revue', 'rhino', 'rhyme',
    'riced', 'ricer', 'rices', 'rider', 'rides', 'ridge', 'rifle', 'rifts', 'right', 'rigid',
    'rigor', 'riled', 'riles', 'rills', 'rinds', 'rings', 'rinks', 'rinse', 'riots', 'ripen',
    'riper', 'risen', 'riser', 'rises', 'risks', 'risky', 'rites', 'ritzy', 'rival', 'riven',
    'river', 'rivet', 'roach', 'roads', 'roams', 'roars', 'roast', 'robed', 'robes', 'robin',
    'robot', 'rocks', 'rocky', 'rogue', 'roles', 'rolls', 'roman', 'romps', 'roofs', 'rooks',
    'rooms', 'roomy', 'roost', 'roots', 'roped', 'ropes', 'roses', 'rotor', 'rouge', 'rough',
    'round', 'rouse', 'route', 'rover', 'roves', 'rowdy', 'rowed', 'rower', 'royal', 'rucks',
    'ruddy', 'ruder', 'ruffs', 'rugby', 'ruins', 'ruled', 'ruler', 'rules', 'rumba', 'rummy',
    'rumor', 'rumps', 'runes', 'rungs', 'runny', 'runts', 'rupee', 'rural', 'rusts', 'rusty',
    'saber', 'sable', 'sabre', 'sacks', 'sadly', 'safer', 'safes', 'sagas', 'sages', 'sails',
    'saint', 'sakes', 'salad', 'sales', 'salon', 'salsa', 'salts', 'salty', 'salve', 'salvo',
    'samba', 'sands', 'sandy', 'saner', 'sappy', 'sassy', 'sated', 'satin', 'satyr', 'sauce',
    'saucy', 'sauna', 'saute', 'saved', 'saver', 'saves', 'savor', 'savoy', 'savvy', 'sawed',
    'sayer', 'scale', 'scalp', 'scaly', 'scamp', 'scams', 'scans', 'scare', 'scarf', 'scary',
    'scene', 'scent', 'score', 'scorn', 'scout', 'scowl', 'scram', 'scrap', 'screw', 'scrim',
    'scrub', 'scrum', 'seals', 'seams', 'seamy', 'sears', 'seats', 'sects', 'sedan', 'seeds',
    'seedy', 'seeks', 'seems', 'seeps', 'seize', 'sells', 'sends', 'sense', 'sepia', 'serfs',
    'serif', 'serum', 'serve', 'setup', 'seven', 'sever', 'sewed', 'sewer', 'shack', 'shade',
    'shady', 'shaft', 'shake', 'shaky', 'shale', 'shall', 'shame', 'shank', 'shape', 'shard',
    'share', 'shark', 'sharp', 'shave', 'shawl', 'sheaf', 'shear', 'sheds', 'sheen', 'sheep',
    'sheer', 'sheet', 'sheik', 'shelf', 'shell', 'shift', 'shims', 'shine', 'shins', 'shiny',
    'ships', 'shire', 'shirk', 'shirt', 'shock', 'shone', 'shook', 'shoot', 'shops', 'shore',
    'shorn', 'short', 'shout', 'shove', 'shown', 'shows', 'showy', 'shred', 'shrew', 'shrub',
    'shrug', 'shuck', 'shunt', 'shush', 'shuts', 'sided', 'sides', 'siege', 'sieve', 'sighs',
    'sight', 'sigma', 'signs', 'silks', 'silky', 'sills', 'silly', 'silts', 'silty', 'since',
    'sinew', 'singe', 'sings', 'sinks', 'sinus', 'siren', 'sissy', 'sites', 'sixth', 'sixty',
    'sized', 'sizer', 'sizes', 'skate', 'skeet', 'skein', 'skied', 'skier', 'skies', 'skiff',
    'skill', 'skimp', 'skims', 'skins', 'skips', 'skirt', 'skits', 'skulk', 'skull', 'skunk',
    'slabs', 'slack', 'slain', 'slake', 'slams', 'slang', 'slant', 'slaps', 'slash', 'slate',
    'slats', 'slave', 'slays', 'sleds', 'sleek', 'sleep', 'sleet', 'slept', 'slice', 'slick',
    'slide', 'slime', 'slimy', 'sling', 'slink', 'slips', 'slits', 'slobs', 'slogs', 'slope',
    'slops', 'slosh', 'sloth', 'slots', 'slows', 'slubs', 'slugs', 'slums', 'slung', 'slunk',
    'slurp', 'slurs', 'slush', 'slyly', 'smack', 'small', 'smart', 'smash', 'smear', 'smell',
    'smelt', 'smile', 'smirk', 'smite', 'smith', 'smock', 'smoke', 'smoky', 'snack', 'snafu',
    'snags', 'snail', 'snake', 'snaky', 'snaps', 'snare', 'snarl', 'sneak', 'sneer', 'snide',
    'sniff', 'snips', 'snits', 'snobs', 'snoop', 'snore', 'snort', 'snout', 'snows', 'snowy',
    'snubs', 'snuck', 'snuff', 'snugs', 'soaks', 'soaps', 'soapy', 'soars', 'sober', 'socks',
    'sodas', 'sofas', 'softy', 'soggy', 'soils', 'solar', 'soled', 'soles', 'solid', 'solos',
    'solve', 'sonar', 'songs', 'sonic', 'sooth', 'sooty', 'sorry', 'sorts', 'souks', 'souls',
    'sound', 'soups', 'soupy', 'sours', 'south', 'sowed', 'sower', 'space', 'spade', 'spank',
    'spans', 'spare', 'spark', 'spars', 'spasm', 'spawn', 'speak', 'spear', 'speck', 'specs',
    'speed', 'spell', 'spend', 'spent', 'spice', 'spicy', 'spied', 'spiel', 'spies', 'spike',
    'spiky', 'spill', 'spine', 'spins', 'spiny', 'spire', 'spite', 'spits', 'splat', 'split',
    'spoil', 'spoke', 'spoof', 'spook', 'spool', 'spoon', 'spore', 'sport', 'spots', 'spout',
    'spray', 'spree', 'sprig', 'spry', 'spuds', 'spunk', 'spurn', 'spurs', 'spurt', 'squad',
    'squat', 'squaw', 'squib', 'squid', 'stabs', 'stack', 'staff', 'stage', 'stags', 'staid',
    'stain', 'stair', 'stake', 'stale', 'stalk', 'stall', 'stamp', 'stand', 'stank', 'staph',
    'stare', 'stark', 'stars', 'start', 'stash', 'state', 'stave', 'stays', 'stead', 'steak',
    'steal', 'steam', 'steed', 'steel', 'steep', 'steer', 'stems', 'steno', 'steps', 'stern',
    'stews', 'stick', 'stiff', 'still', 'stilt', 'sting', 'stink', 'stint', 'stock', 'stoic',
    'stoke', 'stole', 'stomp', 'stone', 'stony', 'stood', 'stool', 'stoop', 'stops', 'store',
    'stork', 'storm', 'story', 'stout', 'stove', 'strap', 'straw', 'stray', 'strip', 'strut',
    'stubs', 'stuck', 'studs', 'study', 'stuff', 'stump', 'stung', 'stunk', 'stuns', 'stunt',
    'style', 'suave', 'sucks', 'sugar', 'suite', 'suits', 'sulks', 'sulky', 'sully', 'sumac',
    'sumps', 'sunny', 'super', 'surge', 'surly', 'sushi', 'swabs', 'swami', 'swamp', 'swank',
    'swans', 'swaps', 'swarm', 'swath', 'swats', 'sways', 'swear', 'sweat', 'sweep', 'sweet',
    'swell', 'swept', 'swift', 'swigs', 'swill', 'swims', 'swine', 'swing', 'swipe', 'swirl',
    'swish', 'swiss', 'sword', 'swore', 'sworn', 'swung', 'synod', 'syrup', 'tabby', 'table',
    'taboo', 'tacit', 'tacks', 'tacky', 'tacos', 'taint', 'taken', 'taker', 'takes', 'tales',
    'talks', 'tally', 'talon', 'tamed', 'tamer', 'tames', 'tango', 'tangs', 'tangy', 'tanks',
    'taped', 'taper', 'tapes', 'tardy', 'tarps', 'tarry', 'tarts', 'tasks', 'taste', 'tasty',
    'tatty', 'taunt', 'tawny', 'taxed', 'taxes', 'taxis', 'teach', 'teaks', 'teams', 'tears',
    'teary', 'tease', 'teats', 'teddy', 'teens', 'teeny', 'teeth', 'tells', 'tempo', 'tends',
    'tenor', 'tense', 'tenth', 'tents', 'tepee', 'tepid', 'terms', 'terns', 'terra', 'terse',
    'tests', 'texts', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thief',
    'thigh', 'thing', 'think', 'third', 'thong', 'thorn', 'those', 'three', 'threw', 'throb',
    'throw', 'thuds', 'thugs', 'thumb', 'thump', 'thunk', 'tiara', 'tibia', 'ticks', 'tidal',
    'tided', 'tides', 'tiers', 'tiger', 'tight', 'tikes', 'tilde', 'tiled', 'tiler', 'tiles',
    'tilts', 'timed', 'timer', 'times', 'timid', 'tines', 'tinge', 'tints', 'tippy', 'tipsy',
    'tired', 'tires', 'titan', 'title', 'toast', 'today', 'toddy', 'toffs', 'togas', 'toked',
    'token', 'tokes', 'tolls', 'tombs', 'tonal', 'toned', 'toner', 'tones', 'tongs', 'tonic',
    'tools', 'tooth', 'toots', 'topaz', 'topic', 'torch', 'tore', 'torso', 'torts', 'total',
    'totem', 'touch', 'tough', 'tours', 'touts', 'towed', 'towel', 'tower', 'towns', 'toxic',
    'toxin', 'trace', 'track', 'tract', 'trade', 'trail', 'train', 'trait', 'tramp', 'trams',
    'traps', 'trash', 'trawl', 'trays', 'tread', 'treat', 'trees', 'trend', 'tress', 'triad',
    'trial', 'tribe', 'trick', 'tried', 'trier', 'tries', 'trigs', 'trike', 'trill', 'trims',
    'trios', 'trips', 'trite', 'troll', 'tromp', 'troop', 'trots', 'trout', 'truce', 'truck',
    'truer', 'truly', 'trump', 'trunk', 'truss', 'trust', 'truth', 'tryst', 'tubed', 'tubes',
    'tucks', 'tufts', 'tulip', 'tumid', 'tummy', 'tumor', 'tunas', 'tuned', 'tuner', 'tunes',
    'tunic', 'turbo', 'turds', 'turfs', 'turns', 'tutor', 'tutti', 'tutus', 'tuxes', 'twain',
    'twang', 'tweak', 'tweed', 'tweet', 'twerp', 'twice', 'twigs', 'twill', 'twine', 'twins',
    'twirl', 'twist', 'tying', 'tykes', 'typed', 'types', 'udder', 'ulcer', 'ultra', 'umber',
    'umbra', 'umped', 'unarm', 'unbar', 'uncle', 'uncut', 'under', 'undid', 'undue', 'unfed',
    'unfit', 'unify', 'union', 'unite', 'units', 'unity', 'unlit', 'unmet', 'unpin', 'unsay',
    'unset', 'untie', 'until', 'unwed', 'unzip', 'upped', 'upper', 'upset', 'urban', 'ureas',
    'urged', 'urges', 'urine', 'usage', 'users', 'usher', 'using', 'usual', 'utter', 'uvula',
    'vague', 'valet', 'valid', 'valor', 'value', 'valve', 'vamps', 'vanes', 'vapid', 'vapor',
    'vault', 'vaunt', 'veers', 'vegan', 'veils', 'veins', 'veiny', 'venom', 'vents', 'venue',
    'verbs', 'verge', 'verse', 'verso', 'verve', 'vests', 'vexed', 'vexes', 'vials', 'vibes',
    'vicar', 'video', 'views', 'vigil', 'vigor', 'viler', 'villa', 'vines', 'vinyl', 'viola',
    'viols', 'viper', 'viral', 'virus', 'visal', 'visas', 'vised', 'vises', 'visit', 'visor',
    'vista', 'vital', 'vivid', 'vixen', 'vocab', 'vocal', 'vodka', 'vogue', 'voice', 'voids',
    'volts', 'vomit', 'voted', 'voter', 'votes', 'vouch', 'vowed', 'vowel', 'vying', 'wacko',
    'wacky', 'waded', 'wader', 'wades', 'wafer', 'waged', 'wager', 'wages', 'wagon', 'waifs',
    'wails', 'waist', 'waits', 'waive', 'waked', 'waken', 'wakes', 'walks', 'walls', 'waltz',
    'wands', 'waned', 'wanes', 'wants', 'wards', 'wares', 'warms', 'warns', 'warps', 'warts',
    'warty', 'washy', 'wasps', 'waste', 'watch', 'water', 'watts', 'waved', 'waver', 'waves',
    'wavey', 'waxed', 'waxes', 'weald', 'weans', 'wears', 'weary', 'weave', 'wedge', 'weeds',
    'weedy', 'weeks', 'weeny', 'weeps', 'weepy', 'weigh', 'weird', 'weirs', 'wells', 'welsh',
    'welts', 'wench', 'wends', 'wetly', 'whack', 'whale', 'wharf', 'wheat', 'wheel', 'whelk',
    'whelp', 'where', 'which', 'whiff', 'while', 'whims', 'whine', 'whiny', 'whips', 'whirl',
    'whirs', 'whisk', 'white', 'whole', 'whoop', 'whose', 'wicks', 'widen', 'wider', 'widow',
    'width', 'wield', 'wifes', 'wifey', 'wilds', 'wiles', 'wills', 'willy', 'wilts', 'wimps',
    'wimpy', 'wince', 'winch', 'winds', 'windy', 'wined', 'wines', 'wings', 'winks', 'wiped',
    'wiper', 'wipes', 'wired', 'wirer', 'wires', 'wised', 'wiser', 'wisps', 'wispy', 'witch',
    'witty', 'wives', 'wizen', 'woken', 'wolfs', 'woman', 'wombs', 'women', 'woods', 'woody',
    'wooed', 'wooer', 'wools', 'wooly', 'woozy', 'words', 'wordy', 'works', 'world', 'worms',
    'wormy', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'woven', 'wowed', 'wrack',
    'wraps', 'wrath', 'wreak', 'wreck', 'wrest', 'wring', 'wrist', 'write', 'wrong', 'wrote',
    'wrung', 'wryly', 'yacht', 'yahoo', 'yanks', 'yards', 'yarns', 'yawns', 'yeahs', 'yearn',
    'years', 'yeast', 'yells', 'yelps', 'yield', 'yikes', 'yodel', 'yogis', 'yokes', 'yolks',
    'young', 'yours', 'youth', 'yowls', 'yucca', 'yucky', 'yukky', 'yummy', 'zebra', 'zeros',
    'zesty', 'zincs', 'zings', 'zingy', 'zippy', 'zonal', 'zoned', 'zones', 'zooms'
]);

// Game state
let targetWord = '';
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let guesses = [];
let todayCompleted = false;
let todayDate = '';

// Get today's date string (YYYY-MM-DD) - used as fallback
function getTodayDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// Get daily word based on date (deterministic) - used as fallback
function getDailyWordFallback(dateStr) {
    // Simple hash function to get consistent index from date
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % WORDS.length;
    return WORDS[index].toUpperCase();
}

// Fetch daily word from server (ensures consistent word across all users)
async function fetchDailyWord() {
    try {
        const res = await fetch('/api/games/wordle/word');
        if (res.ok) {
            const data = await res.json();
            return { date: data.date, word: data.word };
        }
    } catch (err) {
        console.error('Failed to fetch daily word from server:', err);
    }
    // Fallback to client-side calculation if server fails
    const date = getTodayDate();
    return { date, word: getDailyWordFallback(date) };
}

// DOM elements
const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const modal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const messageEl = document.getElementById('message');

// Show message to user
function showMessage(text, type = '') {
    messageEl.textContent = text;
    messageEl.className = 'wordle-message ' + type;
}

// Check if current word is valid and show feedback
function checkCurrentWord() {
    if (currentCol < 5) {
        showMessage('');
        return;
    }

    let word = '';
    for (let i = 0; i < 5; i++) {
        word += document.getElementById(`cell-${currentRow}-${i}`).textContent;
    }

    if (VALID_WORDS.has(word.toLowerCase())) {
        showMessage('Valid word - press Enter', 'valid');
    } else {
        showMessage('Not a valid word', 'error');
    }
}

// Check authentication
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
            window.location.href = '/';
            return null;
        }
        const data = await res.json();
        return data.user;
    } catch (err) {
        window.location.href = '/';
        return null;
    }
}

// Load stats (stats panel removed for cleaner mobile UI)
function loadStats() {
    // Stats are shown in the arena instead
}

// Save game result
async function saveResult(won, attempts) {
    try {
        await fetch('/api/games/stats/wordle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                won,
                score: won ? attempts : null,
                details: { guesses, targetWord, date: todayDate }
            })
        });
        todayCompleted = true;
        loadStats();
        updateArenaLink();
    } catch (err) {
        console.error('Failed to save result:', err);
    }
}

// Update arena link visibility
function updateArenaLink() {
    const arenaLink = document.getElementById('arena-link');
    if (arenaLink) {
        arenaLink.style.display = todayCompleted ? 'block' : 'none';
    }
}

// Check if user already completed today's puzzle
async function checkTodayStatus() {
    try {
        const res = await fetch(`/api/games/wordle/daily?date=${todayDate}`);
        if (res.ok) {
            const data = await res.json();
            if (data.completed) {
                todayCompleted = true;
                gameOver = true;
                guesses = data.guesses || [];
                // Restore the board state
                restoreBoard(data.guesses, data.won);
                return true;
            }
        }
    } catch (err) {
        console.error('Failed to check today status:', err);
    }
    return false;
}

// Restore board from previous guesses
function restoreBoard(savedGuesses, won) {
    initBoard();

    for (let row = 0; row < savedGuesses.length; row++) {
        const guess = savedGuesses[row];
        const result = checkGuess(guess);

        for (let col = 0; col < 5; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            cell.textContent = guess[col];
            cell.classList.add('filled', result[col]);

            // Update keyboard
            const key = document.querySelector(`[data-key="${guess[col].toLowerCase()}"]`);
            if (key) {
                if (result[col] === 'correct') {
                    key.classList.remove('present', 'absent');
                    key.classList.add('correct');
                } else if (result[col] === 'present' && !key.classList.contains('correct')) {
                    key.classList.remove('absent');
                    key.classList.add('present');
                } else if (result[col] === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
                    key.classList.add('absent');
                }
            }
        }
    }

    if (won) {
        showMessage("You already completed today's Wordle!", 'valid');
    } else {
        showMessage(`Today's word was: ${targetWord}`, 'error');
    }
}

// Initialize board
function initBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'wordle-row';
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'wordle-cell';
            cell.id = `cell-${i}-${j}`;
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

// Starter word modal elements
const starterModal = document.getElementById('starter-modal');
const suggestionButtons = document.getElementById('suggestion-buttons');
const customStarterInput = document.getElementById('custom-starter-input');
const customStarterBtn = document.getElementById('custom-starter-btn');
const starterError = document.getElementById('starter-error');

// Flag to prevent double submission
let isSelectingStarter = false;

// Check and handle starter word
async function checkStarterWord() {
    try {
        const res = await fetch('/api/games/wordle/starter');
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error('Failed to check starter word:', err);
        return null;
    }
}

// Show starter word selection modal
function showStarterModal(suggestions) {
    isSelectingStarter = false;
    suggestionButtons.innerHTML = '';
    suggestions.forEach(word => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = word;
        btn.addEventListener('click', () => selectStarterWord(word));
        suggestionButtons.appendChild(btn);
    });
    starterModal.classList.add('show');
}

// Select a starter word (from suggestions or custom)
async function selectStarterWord(word) {
    // Prevent double-clicks
    if (isSelectingStarter) return;
    isSelectingStarter = true;

    word = word.toUpperCase().trim();

    if (word.length !== 5) {
        showStarterError('Word must be exactly 5 letters');
        isSelectingStarter = false;
        return;
    }

    if (!VALID_WORDS.has(word.toLowerCase())) {
        showStarterError('Not a valid word');
        isSelectingStarter = false;
        return;
    }

    // Disable all suggestion buttons while processing
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });
    customStarterBtn.disabled = true;

    try {
        const res = await fetch('/api/games/wordle/starter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word })
        });

        const data = await res.json();

        if (data.success || data.alreadySet) {
            starterModal.classList.remove('show');
            // Small delay to ensure modal is hidden and DOM is ready
            setTimeout(() => {
                applyStarterWord(data.word);
            }, 100);
        } else if (data.error) {
            showStarterError(data.error);
            isSelectingStarter = false;
            // Re-enable buttons
            document.querySelectorAll('.suggestion-btn').forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });
            customStarterBtn.disabled = false;
        }
    } catch (err) {
        console.error('Failed to set starter word:', err);
        showStarterError('Failed to set starter word');
        isSelectingStarter = false;
        // Re-enable buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        customStarterBtn.disabled = false;
    }
}

// Show error in starter modal
function showStarterError(message) {
    starterError.textContent = message;
    starterError.style.display = 'block';
    setTimeout(() => {
        starterError.style.display = 'none';
    }, 3000);
}

// Apply starter word as first guess
function applyStarterWord(word) {
    if (!word || word.length !== 5) {
        console.error('Invalid starter word:', word);
        return;
    }

    // Ensure we're at the start of the game
    currentRow = 0;
    currentCol = 0;

    // Fill in the first row with the starter word
    for (let i = 0; i < 5; i++) {
        const cell = document.getElementById(`cell-0-${i}`);
        if (!cell) {
            console.error('Cell not found:', `cell-0-${i}`);
            return;
        }
        cell.textContent = word[i];
        cell.classList.add('filled');
    }
    currentCol = 5;

    // Auto-submit the starter word
    submitGuess();
}

// Start new game (daily)
async function startGame() {
    // Fetch word from server (ensures consistent daily word)
    const dailyData = await fetchDailyWord();
    todayDate = dailyData.date;
    targetWord = dailyData.word;

    currentRow = 0;
    currentCol = 0;
    gameOver = false;
    guesses = [];
    todayCompleted = false;

    // Reset keyboard colors
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });

    // Check if already completed today
    const alreadyDone = await checkTodayStatus();
    if (!alreadyDone) {
        initBoard();
        showMessage('');

        // Check for starter word
        const starterData = await checkStarterWord();
        if (starterData) {
            if (starterData.hasStarter) {
                // Apply existing starter word
                showMessage(`Starter word by ${starterData.chosenBy}: ${starterData.word}`, 'valid');
                setTimeout(() => {
                    applyStarterWord(starterData.word);
                }, 500);
            } else {
                // Show modal to pick starter word
                showStarterModal(starterData.suggestions);
            }
        }
    }

    updateArenaLink();
    modal.classList.remove('show');
}

// Add letter to current row
function addLetter(letter) {
    if (gameOver || currentCol >= 5) return;

    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = letter;
    cell.classList.add('filled');
    currentCol++;

    checkCurrentWord();
}

// Remove last letter
function removeLetter() {
    if (gameOver || currentCol <= 0) return;

    currentCol--;
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = '';
    cell.classList.remove('filled');

    checkCurrentWord();
}

// Submit guess
function submitGuess() {
    if (gameOver || currentCol < 5) return;

    // Get current guess
    let guess = '';
    for (let i = 0; i < 5; i++) {
        guess += document.getElementById(`cell-${currentRow}-${i}`).textContent;
    }

    // Check if word is valid
    if (!VALID_WORDS.has(guess.toLowerCase())) {
        showMessage('Not a valid word', 'error');
        return;
    }

    showMessage('');
    guesses.push(guess);

    // Check each letter
    const result = checkGuess(guess);

    // Update cells with colors
    for (let i = 0; i < 5; i++) {
        const cell = document.getElementById(`cell-${currentRow}-${i}`);
        cell.classList.add(result[i]);

        // Update keyboard
        const key = document.querySelector(`[data-key="${guess[i].toLowerCase()}"]`);
        if (key) {
            // Only upgrade key status (absent < present < correct)
            if (result[i] === 'correct') {
                key.classList.remove('present', 'absent');
                key.classList.add('correct');
            } else if (result[i] === 'present' && !key.classList.contains('correct')) {
                key.classList.remove('absent');
                key.classList.add('present');
            } else if (result[i] === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
                key.classList.add('absent');
            }
        }
    }

    // Check win/lose
    if (guess === targetWord) {
        gameOver = true;
        modalTitle.textContent = 'You Won!';
        modalMessage.textContent = `You guessed the word in ${currentRow + 1} ${currentRow === 0 ? 'try' : 'tries'}!`;
        modal.classList.add('show');
        saveResult(true, currentRow + 1);
    } else if (currentRow >= 5) {
        gameOver = true;
        modalTitle.textContent = 'Game Over';
        modalMessage.textContent = `The word was: ${targetWord}`;
        modal.classList.add('show');
        saveResult(false, 6);
    } else {
        currentRow++;
        currentCol = 0;
    }
}

// Check guess and return result array
function checkGuess(guess) {
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');

    // First pass: mark correct letters
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = 'correct';
            targetLetters[i] = null;
            guessLetters[i] = null;
        }
    }

    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === null) continue;

        const index = targetLetters.indexOf(guessLetters[i]);
        if (index !== -1) {
            result[i] = 'present';
            targetLetters[index] = null;
        }
    }

    return result;
}

// Handle keyboard input
function handleKey(key) {
    if (key === 'Enter') {
        submitGuess();
    } else if (key === 'Backspace') {
        removeLetter();
    } else if (/^[a-zA-Z]$/.test(key)) {
        addLetter(key.toUpperCase());
    }
}

// Event listeners
keyboard.addEventListener('click', (e) => {
    const key = e.target.dataset.key;
    if (key) {
        handleKey(key);
    }
});

document.addEventListener('keydown', (e) => {
    handleKey(e.key);
});

document.getElementById('close-modal-btn').addEventListener('click', () => {
    modal.classList.remove('show');
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
});

// Starter word custom input handlers
customStarterBtn.addEventListener('click', () => {
    selectStarterWord(customStarterInput.value);
});

customStarterInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        selectStarterWord(customStarterInput.value);
    }
});

// Initialize
async function init() {
    const user = await checkAuth();
    if (user) {
        document.getElementById('username').textContent = user.username;
        loadStats();
        startGame();
    }
}

init();
