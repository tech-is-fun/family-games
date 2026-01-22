// Word Salad Game

// Valid 3-7 letter words dictionary (common words)
const VALID_WORDS = new Set([
    // 3-letter words
    'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'ant', 'any', 'ape', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask', 'ate',
    'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee', 'beg', 'bet', 'bid', 'big', 'bin', 'bit', 'bow', 'box', 'boy', 'bud', 'bug', 'bun', 'bus', 'but', 'buy',
    'cab', 'can', 'cap', 'car', 'cat', 'cod', 'cot', 'cow', 'cry', 'cub', 'cup', 'cut',
    'dad', 'dam', 'day', 'den', 'dew', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'dub', 'dud', 'due', 'dug', 'dye',
    'ear', 'eat', 'eel', 'egg', 'ego', 'elm', 'end', 'era', 'eve', 'eye',
    'fad', 'fan', 'far', 'fat', 'fax', 'fed', 'fee', 'few', 'fig', 'fin', 'fir', 'fit', 'fix', 'fly', 'foe', 'fog', 'for', 'fox', 'fry', 'fun', 'fur',
    'gag', 'gap', 'gas', 'gel', 'gem', 'get', 'gin', 'god', 'got', 'gum', 'gun', 'gut', 'guy', 'gym',
    'had', 'ham', 'has', 'hat', 'hay', 'hem', 'hen', 'her', 'hid', 'him', 'hip', 'his', 'hit', 'hob', 'hog', 'hop', 'hot', 'how', 'hub', 'hue', 'hug', 'hum', 'hut',
    'ice', 'icy', 'ill', 'imp', 'ink', 'inn', 'ion', 'ire', 'irk', 'its', 'ivy',
    'jab', 'jag', 'jam', 'jar', 'jaw', 'jay', 'jet', 'jig', 'job', 'jog', 'jot', 'joy', 'jug', 'jut',
    'keg', 'ken', 'key', 'kid', 'kin', 'kit',
    'lab', 'lad', 'lag', 'lap', 'law', 'lay', 'lea', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low', 'lug',
    'mad', 'man', 'map', 'mar', 'mat', 'maw', 'may', 'men', 'met', 'mid', 'mix', 'mob', 'mom', 'mop', 'mud', 'mug', 'mum',
    'nab', 'nag', 'nap', 'net', 'new', 'nil', 'nip', 'nit', 'nod', 'nor', 'not', 'now', 'nub', 'nun', 'nut',
    'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oft', 'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own',
    'pac', 'pad', 'pal', 'pan', 'pap', 'par', 'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'pep', 'per', 'pet', 'pew', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pop', 'pot', 'pow', 'pro', 'pry', 'pub', 'pug', 'pun', 'pup', 'pus', 'put',
    'rad', 'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'ref', 'rep', 'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'roe', 'rot', 'row', 'rub', 'rug', 'rum', 'run', 'rut', 'rye',
    'sac', 'sad', 'sag', 'sap', 'sat', 'saw', 'say', 'sea', 'set', 'sew', 'she', 'shy', 'sin', 'sip', 'sir', 'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop', 'sot', 'sow', 'soy', 'spa', 'spy', 'sty', 'sub', 'sum', 'sun', 'sup',
    'tab', 'tad', 'tag', 'tan', 'tap', 'tar', 'tat', 'tax', 'tea', 'ten', 'the', 'thy', 'tic', 'tie', 'tin', 'tip', 'toe', 'tom', 'ton', 'too', 'top', 'tot', 'tow', 'toy', 'try', 'tub', 'tug', 'two',
    'ugh', 'ump', 'ups', 'urn', 'use',
    'van', 'vat', 'vet', 'via', 'vie', 'vow',
    'wad', 'wag', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wee', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won', 'woo', 'wow',
    'yak', 'yam', 'yap', 'yaw', 'yea', 'yen', 'yes', 'yet', 'yew', 'you', 'yow',
    'zag', 'zap', 'zed', 'zee', 'zen', 'zig', 'zip', 'zit', 'zoo',

    // 4-letter words
    'able', 'ache', 'acid', 'aged', 'aide', 'ally', 'also', 'arch', 'area', 'army', 'aunt', 'auto', 'away', 'baby', 'back', 'bait', 'bake', 'bald', 'ball', 'band', 'bank', 'bare', 'bark', 'barn', 'base', 'bath', 'bead', 'beak', 'beam', 'bean', 'bear', 'beat', 'been', 'beef', 'beer', 'bell', 'belt', 'bend', 'bent', 'best', 'bile', 'bill', 'bind', 'bird', 'bite', 'bled', 'blew', 'blob', 'blow', 'blue', 'blur', 'boar', 'boat', 'body', 'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boom', 'boot', 'bore', 'born', 'boss', 'both', 'bout', 'bowl', 'bred', 'brew', 'brim', 'buck', 'bulb', 'bulk', 'bull', 'bump', 'burn', 'bury', 'bush', 'bust', 'busy', 'buzz',
    'cafe', 'cage', 'cake', 'calf', 'call', 'calm', 'came', 'camp', 'cape', 'card', 'care', 'cart', 'case', 'cash', 'cast', 'cave', 'cell', 'chat', 'chef', 'chew', 'chin', 'chip', 'chop', 'city', 'clad', 'clam', 'clan', 'clap', 'claw', 'clay', 'clip', 'club', 'clue', 'coal', 'coat', 'code', 'coil', 'coin', 'cold', 'come', 'cone', 'cook', 'cool', 'cope', 'copy', 'cord', 'core', 'cork', 'corn', 'cost', 'cozy', 'crab', 'crew', 'crib', 'crop', 'crow', 'cube', 'cure', 'curl', 'cute',
    'dame', 'damp', 'dare', 'dark', 'dart', 'dash', 'data', 'date', 'dawn', 'dead', 'deaf', 'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer', 'demo', 'dent', 'deny', 'desk', 'dial', 'dice', 'died', 'diet', 'dime', 'dine', 'dire', 'dirt', 'dish', 'disk', 'dive', 'dock', 'does', 'doll', 'dome', 'done', 'doom', 'door', 'dose', 'down', 'drag', 'dram', 'draw', 'drew', 'drip', 'drop', 'drum', 'dual', 'duck', 'dude', 'duel', 'duke', 'dull', 'dumb', 'dump', 'dune', 'dunk', 'dusk', 'dust', 'duty',
    'each', 'earn', 'ease', 'east', 'easy', 'eats', 'echo', 'edge', 'else', 'emit', 'envy', 'epic', 'even', 'ever', 'evil', 'exam', 'exit', 'eyes',
    'face', 'fact', 'fade', 'fail', 'fair', 'fake', 'fall', 'fame', 'fang', 'fare', 'farm', 'fast', 'fate', 'fawn', 'fear', 'feat', 'feed', 'feel', 'feet', 'fell', 'felt', 'fern', 'fest', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'fist', 'five', 'flag', 'flak', 'flat', 'flaw', 'flea', 'fled', 'flew', 'flip', 'flit', 'flow', 'foam', 'foil', 'fold', 'folk', 'fond', 'font', 'food', 'fool', 'foot', 'fore', 'fork', 'form', 'fort', 'foul', 'four', 'free', 'frog', 'from', 'fuel', 'full', 'fume', 'fund', 'fuse', 'fuss',
    'gain', 'gale', 'game', 'gang', 'gate', 'gave', 'gaze', 'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'glen', 'glow', 'glue', 'glum', 'goat', 'goes', 'gold', 'golf', 'gone', 'good', 'gosh', 'gown', 'grab', 'gram', 'gray', 'grew', 'grid', 'grim', 'grin', 'grip', 'grit', 'grow', 'gulf', 'guru', 'gust',
    'hack', 'hail', 'hair', 'half', 'hall', 'halt', 'hand', 'hang', 'hard', 'hare', 'harm', 'harp', 'hash', 'hate', 'haul', 'have', 'hawk', 'haze', 'hazy', 'head', 'heal', 'heap', 'hear', 'heat', 'heel', 'held', 'hell', 'helm', 'help', 'hemp', 'herb', 'herd', 'here', 'hero', 'hide', 'high', 'hike', 'hill', 'hint', 'hire', 'hold', 'hole', 'holy', 'home', 'hood', 'hook', 'hoop', 'hope', 'horn', 'hose', 'host', 'hour', 'huge', 'hulk', 'hull', 'hump', 'hung', 'hunt', 'hurt', 'hush',
    'iced', 'icon', 'idea', 'idol', 'inch', 'info', 'into', 'iris', 'iron', 'isle', 'item',
    'jack', 'jade', 'jail', 'jazz', 'jean', 'jerk', 'jest', 'jinx', 'join', 'joke', 'jolt', 'joys', 'judo', 'juke', 'jump', 'june', 'junk', 'jury', 'just',
    'keen', 'keep', 'kelp', 'kept', 'kick', 'kill', 'kind', 'king', 'kiss', 'kite', 'knee', 'knew', 'knit', 'knob', 'knot', 'know',
    'lace', 'lack', 'lake', 'lamb', 'lamp', 'land', 'lane', 'laps', 'lard', 'lark', 'last', 'late', 'lawn', 'lazy', 'lead', 'leaf', 'leak', 'lean', 'leap', 'left', 'lend', 'lens', 'lent', 'less', 'lick', 'lied', 'life', 'lift', 'like', 'limb', 'lime', 'limp', 'line', 'link', 'lint', 'lion', 'lips', 'list', 'live', 'load', 'loaf', 'loan', 'lock', 'loft', 'logo', 'lone', 'long', 'look', 'loop', 'lord', 'lore', 'lose', 'loss', 'lost', 'lots', 'loud', 'love', 'luck', 'lump', 'lung', 'lure', 'lurk', 'lush', 'lust',
    'made', 'maid', 'mail', 'main', 'make', 'male', 'mall', 'malt', 'many', 'mark', 'mars', 'mash', 'mask', 'mass', 'mast', 'mate', 'math', 'maze', 'meal', 'mean', 'meat', 'meet', 'melt', 'memo', 'menu', 'mere', 'mesh', 'mess', 'mice', 'mild', 'mile', 'milk', 'mill', 'mind', 'mine', 'mint', 'miss', 'mist', 'mode', 'mold', 'mole', 'monk', 'mood', 'moon', 'more', 'moss', 'most', 'moth', 'move', 'much', 'mule', 'murk', 'muse', 'mush', 'must', 'mute', 'myth',
    'nail', 'name', 'navy', 'near', 'neat', 'neck', 'need', 'neon', 'nest', 'news', 'next', 'nice', 'nick', 'nine', 'node', 'none', 'noon', 'norm', 'nose', 'note', 'noun', 'nude',
    'oaks', 'oath', 'obey', 'odds', 'odor', 'offs', 'oils', 'oily', 'okay', 'omen', 'once', 'ones', 'only', 'onto', 'ooze', 'open', 'opts', 'oral', 'orca', 'ours', 'oust', 'oven', 'over', 'owed', 'owes', 'owls', 'owns',
    'pace', 'pack', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'palm', 'pals', 'pane', 'pant', 'park', 'part', 'pass', 'past', 'path', 'pave', 'peak', 'pear', 'peas', 'peat', 'peck', 'peel', 'peer', 'pelt', 'pens', 'perk', 'perm', 'pest', 'pick', 'pier', 'pike', 'pile', 'pill', 'pine', 'pink', 'pins', 'pint', 'pipe', 'pita', 'pits', 'pity', 'plan', 'play', 'plea', 'plod', 'plop', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus', 'pods', 'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pond', 'pony', 'pool', 'poor', 'pops', 'pore', 'pork', 'port', 'pose', 'post', 'pots', 'pour', 'pout', 'pray', 'prep', 'prey', 'prim', 'prod', 'prop', 'puff', 'pull', 'pulp', 'pump', 'punk', 'pure', 'push', 'puts',
    'quit', 'quiz',
    'race', 'rack', 'raft', 'rage', 'rags', 'raid', 'rail', 'rain', 'rake', 'ramp', 'rang', 'rank', 'rant', 'rare', 'rash', 'rate', 'rave', 'rays', 'read', 'real', 'ream', 'reap', 'rear', 'reef', 'reel', 'rely', 'rent', 'rest', 'rice', 'rich', 'ride', 'rift', 'rigs', 'rind', 'ring', 'riot', 'ripe', 'rise', 'risk', 'rite', 'road', 'roam', 'roar', 'robe', 'rock', 'rode', 'role', 'roll', 'roof', 'room', 'root', 'rope', 'rose', 'rosy', 'rout', 'rows', 'rude', 'ruin', 'rule', 'rump', 'rung', 'runs', 'runt', 'rush', 'rust',
    'sack', 'safe', 'sage', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'save', 'seal', 'seam', 'seat', 'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'semi', 'send', 'sent', 'shed', 'ship', 'shop', 'shot', 'show', 'shut', 'sick', 'side', 'sift', 'sigh', 'sign', 'silk', 'sing', 'sink', 'site', 'size', 'skin', 'skip', 'slab', 'slam', 'slap', 'slat', 'slaw', 'sled', 'slew', 'slid', 'slim', 'slip', 'slit', 'slob', 'slop', 'slot', 'slow', 'slug', 'slum', 'snap', 'snip', 'snob', 'snow', 'snub', 'snug', 'soak', 'soap', 'soar', 'sobs', 'sock', 'soda', 'sofa', 'soft', 'soil', 'sold', 'sole', 'some', 'song', 'soon', 'soot', 'sore', 'sort', 'soul', 'soup', 'sour', 'span', 'spar', 'spat', 'spec', 'sped', 'spin', 'spit', 'spot', 'spun', 'spur', 'stab', 'stag', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stub', 'stud', 'stun', 'such', 'suck', 'suit', 'sulk', 'sums', 'sung', 'sunk', 'sure', 'surf', 'swam', 'swan', 'swap', 'sway', 'swim', 'swum',
    'tack', 'taco', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tank', 'tape', 'taps', 'tart', 'task', 'taxi', 'teak', 'team', 'tear', 'teas', 'teen', 'tell', 'temp', 'tend', 'tens', 'tent', 'term', 'test', 'text', 'than', 'that', 'thaw', 'them', 'then', 'they', 'thin', 'this', 'thud', 'thus', 'tick', 'tide', 'tidy', 'tied', 'tier', 'ties', 'tile', 'tilt', 'time', 'tint', 'tiny', 'tips', 'tire', 'toad', 'toes', 'toil', 'told', 'toll', 'tomb', 'tone', 'tons', 'took', 'tool', 'tops', 'tore', 'torn', 'toss', 'tote', 'tour', 'town', 'toys', 'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trod', 'trot', 'true', 'tube', 'tuck', 'tuft', 'tulip', 'tuna', 'tune', 'turf', 'turn', 'tusk', 'twin', 'twit', 'type',
    'ugly', 'undo', 'unit', 'unto', 'upon', 'urge', 'used', 'user', 'uses',
    'vain', 'vale', 'vane', 'vary', 'vase', 'vast', 'veal', 'veer', 'vent', 'verb', 'very', 'vest', 'veto', 'vibe', 'vice', 'view', 'vile', 'vine', 'visa', 'void', 'volt', 'vote',
    'wade', 'wage', 'wail', 'wait', 'wake', 'walk', 'wall', 'wand', 'want', 'ward', 'warm', 'warn', 'warp', 'wart', 'wary', 'wash', 'wasp', 'wave', 'wavy', 'waxy', 'ways', 'weak', 'wear', 'weed', 'week', 'weep', 'weld', 'well', 'went', 'wept', 'were', 'west', 'what', 'when', 'whim', 'whip', 'whir', 'wick', 'wide', 'wife', 'wild', 'will', 'wilt', 'wimp', 'wind', 'wine', 'wing', 'wink', 'wins', 'wipe', 'wire', 'wise', 'wish', 'with', 'woke', 'wolf', 'womb', 'wont', 'wood', 'woof', 'wool', 'word', 'wore', 'work', 'worm', 'worn', 'wrap', 'wren',
    'yank', 'yard', 'yarn', 'yawn', 'yeah', 'year', 'yell', 'yelp', 'yoga', 'yoke', 'yolk', 'your', 'yuck',
    'zeal', 'zero', 'zest', 'zinc', 'zone', 'zoom',

    // 5-letter words
    'about', 'above', 'abuse', 'actor', 'adapt', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive', 'alley', 'allow', 'alloy', 'alone', 'along', 'alter', 'among', 'angel', 'anger', 'angle', 'angry', 'ankle', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'armor', 'array', 'arrow', 'aside', 'asset', 'audit', 'avoid', 'awake', 'award', 'aware', 'awful',
    'badge', 'badly', 'baker', 'bases', 'basic', 'basin', 'basis', 'batch', 'beach', 'beard', 'beast', 'began', 'begin', 'begun', 'being', 'belly', 'below', 'bench', 'berry', 'birth', 'black', 'blade', 'blame', 'bland', 'blank', 'blast', 'blaze', 'bleak', 'bleed', 'blend', 'bless', 'blind', 'blink', 'bliss', 'block', 'blond', 'blood', 'bloom', 'blown', 'blues', 'bluff', 'blunt', 'blurt', 'blush', 'board', 'boast', 'bonus', 'boost', 'booth', 'bound', 'brain', 'brake', 'brand', 'brass', 'brave', 'bread', 'break', 'breed', 'brick', 'bride', 'brief', 'bring', 'brink', 'brisk', 'broad', 'broil', 'broke', 'brook', 'broom', 'broth', 'brown', 'brush', 'build', 'built', 'bunch', 'burst', 'buyer',
    'cable', 'cache', 'camel', 'canal', 'candy', 'cargo', 'carry', 'carve', 'catch', 'cause', 'cease', 'chain', 'chair', 'chalk', 'champ', 'chant', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'cheat', 'check', 'cheek', 'cheer', 'chess', 'chest', 'chief', 'child', 'chill', 'china', 'choir', 'choke', 'chord', 'chose', 'chunk', 'civic', 'civil', 'claim', 'clamp', 'clash', 'clasp', 'class', 'clean', 'clear', 'clerk', 'click', 'cliff', 'climb', 'cling', 'clock', 'clone', 'close', 'cloth', 'cloud', 'coach', 'coast', 'coral', 'couch', 'cough', 'could', 'count', 'court', 'cover', 'crack', 'craft', 'cramp', 'crane', 'crash', 'crate', 'crave', 'crawl', 'craze', 'crazy', 'creak', 'cream', 'creed', 'creek', 'creep', 'crest', 'crisp', 'cross', 'crowd', 'crown', 'crude', 'cruel', 'crush', 'crust', 'cubic', 'curve', 'cycle',
    'daily', 'dairy', 'dance', 'dealt', 'death', 'debug', 'decay', 'decor', 'decoy', 'delay', 'delta', 'dense', 'depot', 'depth', 'diary', 'dirty', 'disco', 'ditch', 'diver', 'dizzy', 'doubt', 'dough', 'dozen', 'draft', 'drain', 'drake', 'drama', 'drank', 'drape', 'drawl', 'drawn', 'dread', 'dream', 'dress', 'dried', 'drift', 'drill', 'drink', 'drive', 'droit', 'droll', 'drone', 'drool', 'droop', 'drown', 'drums', 'drunk', 'dryer', 'dully', 'dumps', 'dusty', 'dwarf', 'dwell',
    'eager', 'eagle', 'early', 'earth', 'easel', 'eaten', 'eater', 'eaves', 'ebony', 'edged', 'edges', 'eerie', 'eight', 'elbow', 'elder', 'elect', 'elite', 'elope', 'elude', 'embed', 'ember', 'empty', 'ended', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'equip', 'erase', 'erect', 'erode', 'error', 'erupt', 'essay', 'event', 'every', 'exact', 'exams', 'excel', 'exert', 'exile', 'exist', 'extra',
    'fable', 'faced', 'faces', 'facto', 'facts', 'faint', 'fairy', 'faith', 'false', 'fancy', 'fatal', 'fatty', 'fault', 'fauna', 'favor', 'feast', 'fence', 'ferry', 'fetch', 'fever', 'fiber', 'field', 'fiery', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flair', 'flake', 'flame', 'flank', 'flare', 'flash', 'flask', 'fleet', 'flesh', 'flick', 'fling', 'flint', 'float', 'flock', 'flood', 'floor', 'floss', 'flour', 'fluid', 'flung', 'flunk', 'flush', 'flute', 'focal', 'focus', 'foggy', 'force', 'forge', 'forty', 'forum', 'found', 'frame', 'frank', 'fraud', 'freak', 'freed', 'fresh', 'fried', 'fries', 'frill', 'frisk', 'front', 'frost', 'frown', 'froze', 'fruit', 'fudge', 'fully', 'fungi', 'funky', 'funny', 'fuzzy',
    'gauze', 'gavel', 'gears', 'gecko', 'geese', 'genre', 'ghost', 'giant', 'giddy', 'girly', 'given', 'giver', 'gives', 'gland', 'glare', 'glass', 'gleam', 'glide', 'glint', 'globe', 'gloom', 'glory', 'gloss', 'glove', 'gnome', 'goats', 'godly', 'going', 'golly', 'goose', 'gorge', 'grace', 'grade', 'grain', 'grand', 'grant', 'grape', 'graph', 'grasp', 'grass', 'grate', 'grave', 'gravy', 'graze', 'great', 'greed', 'greek', 'green', 'greet', 'grief', 'grill', 'grind', 'groan', 'groom', 'grope', 'gross', 'group', 'grove', 'growl', 'grown', 'guard', 'guess', 'guest', 'guide', 'guild', 'guilt', 'guise', 'gulch', 'gummy', 'gusts', 'gusty',
    'habit', 'hairy', 'happy', 'harsh', 'haste', 'hasty', 'hatch', 'haunt', 'haven', 'havoc', 'heads', 'heard', 'heart', 'heavy', 'hedge', 'heels', 'hello', 'hence', 'heron', 'hills', 'hilly', 'hinge', 'hippo', 'hitch', 'hobby', 'hoist', 'holly', 'homer', 'honey', 'honor', 'hooks', 'horse', 'hound', 'house', 'hover', 'human', 'humid', 'humor', 'humps', 'hunch', 'hunks', 'hurry', 'husky',
    'ideal', 'ideas', 'idiot', 'image', 'imply', 'inane', 'index', 'indie', 'inner', 'input', 'inter', 'intro', 'ionic', 'irate', 'irony', 'issue', 'itchy', 'items', 'ivory',
    'jeans', 'jelly', 'jerks', 'jerky', 'jewel', 'jiffy', 'jimmy', 'joint', 'joker', 'jokes', 'jolly', 'jolts', 'joust', 'judge', 'juice', 'juicy', 'jumbo', 'jumps', 'jumpy', 'junks', 'juror', 'dusty',
    'kebab', 'keeps', 'ketch', 'kiddo', 'kills', 'kinds', 'kings', 'kiosk', 'kissy', 'kites', 'kitty', 'knack', 'knead', 'kneed', 'kneel', 'knees', 'knelt', 'knife', 'knock', 'knoll', 'knots', 'known', 'knows', 'kudos',
    'label', 'labor', 'laden', 'ladle', 'lager', 'lance', 'lands', 'lanes', 'lapel', 'large', 'larks', 'laser', 'lasso', 'lasts', 'latch', 'later', 'lathe', 'laugh', 'layer', 'leads', 'leafy', 'leaky', 'leaps', 'learn', 'lease', 'leash', 'least', 'leave', 'ledge', 'legal', 'lemon', 'level', 'lever', 'light', 'liked', 'likes', 'limbs', 'limit', 'lined', 'linen', 'liner', 'lines', 'links', 'lions', 'lists', 'liter', 'liver', 'lives', 'llama', 'loads', 'loafs', 'loans', 'lobby', 'local', 'lodge', 'lofty', 'logic', 'login', 'logos', 'looks', 'loops', 'loopy', 'loose', 'lords', 'lorry', 'loser', 'loses', 'lotta', 'lotus', 'louse', 'lousy', 'loved', 'lover', 'loves', 'lower', 'loyal', 'lucid', 'lucky', 'lumen', 'lumps', 'lumpy', 'lunar', 'lunch', 'lunge', 'lungs', 'lurch', 'lusty', 'lyric',
    'macho', 'macro', 'magic', 'major', 'maker', 'makes', 'manga', 'mango', 'manly', 'manor', 'maple', 'march', 'marry', 'marsh', 'match', 'mayor', 'meals', 'mealy', 'means', 'meant', 'meats', 'meaty', 'medal', 'media', 'melon', 'mercy', 'merge', 'merit', 'merry', 'messy', 'metal', 'meter', 'midst', 'might', 'mimic', 'mince', 'minds', 'miner', 'mines', 'minor', 'minus', 'mirth', 'misty', 'mixed', 'mixer', 'mixes', 'mocha', 'model', 'modem', 'moist', 'molar', 'moldy', 'money', 'month', 'moody', 'moose', 'moral', 'moron', 'morph', 'mossy', 'motel', 'motor', 'motto', 'mould', 'mount', 'mourn', 'mouse', 'mouth', 'moved', 'mover', 'moves', 'movie', 'muddy', 'mulch', 'mummy', 'munch', 'murky', 'music', 'musty', 'muted',
    'naive', 'naked', 'named', 'names', 'nanny', 'nasty', 'naval', 'navel', 'needy', 'nerve', 'nervy', 'never', 'newer', 'newly', 'nicer', 'niche', 'night', 'ninja', 'ninth', 'noble', 'nodal', 'noise', 'noisy', 'nomad', 'norms', 'north', 'notch', 'noted', 'notes', 'novel', 'nudge', 'nurse', 'nutty', 'nylon',
    'oasis', 'occur', 'ocean', 'octet', 'oddly', 'offer', 'often', 'olive', 'onset', 'opera', 'opted', 'optic', 'orbit', 'order', 'organ', 'other', 'otter', 'ought', 'ounce', 'outdo', 'outer', 'outgo', 'ovary', 'overt', 'owing', 'owned', 'owner', 'oxide', 'ozone',
    'packs', 'paddy', 'pains', 'paint', 'pairs', 'palms', 'palsy', 'panda', 'panel', 'panic', 'pansy', 'pants', 'paper', 'parks', 'parts', 'party', 'paste', 'pasty', 'patch', 'patio', 'patsy', 'pause', 'peace', 'peach', 'peaks', 'pearl', 'pears', 'pedal', 'penal', 'pence', 'penny', 'perch', 'perks', 'perky', 'pesky', 'petal', 'petty', 'phase', 'phone', 'photo', 'piano', 'picks', 'picky', 'piece', 'piety', 'piggy', 'pilot', 'pinch', 'pinto', 'pious', 'pipes', 'pitch', 'pithy', 'pivot', 'pixel', 'pizza', 'place', 'plaid', 'plain', 'plane', 'plank', 'plans', 'plant', 'plate', 'playa', 'plays', 'plaza', 'plead', 'pleas', 'pleat', 'plier', 'plods', 'plops', 'plots', 'pluck', 'plugs', 'plumb', 'plume', 'plump', 'plums', 'plunk', 'plush', 'poach', 'poems', 'poets', 'point', 'poise', 'poker', 'polar', 'poles', 'polka', 'polls', 'polyp', 'ponds', 'pools', 'porch', 'pores', 'ports', 'posed', 'poser', 'poses', 'posit', 'posts', 'pouch', 'pound', 'pours', 'power', 'prank', 'prawn', 'press', 'price', 'prick', 'pride', 'prime', 'print', 'prior', 'prism', 'privy', 'prize', 'probe', 'promo', 'prone', 'prong', 'proof', 'props', 'prose', 'proud', 'prove', 'prowl', 'proxy', 'prune', 'psalm', 'pubic', 'pulse', 'pumps', 'punch', 'pupil', 'puppy', 'purge', 'purse', 'pushy', 'putty', 'pygmy',
    'quack', 'quail', 'quake', 'qualm', 'quart', 'quasi', 'queen', 'query', 'quest', 'queue', 'quick', 'quiet', 'quilt', 'quirk', 'quota', 'quote',
    'racer', 'races', 'racks', 'radar', 'radio', 'radon', 'rafts', 'rails', 'rainy', 'raise', 'rally', 'ramps', 'ranch', 'range', 'ranks', 'rapid', 'rated', 'rater', 'rates', 'ratio', 'ratty', 'raven', 'rayon', 'razor', 'reach', 'react', 'reads', 'ready', 'realm', 'reams', 'reaps', 'rears', 'rebel', 'recap', 'refer', 'reign', 'relax', 'relay', 'relic', 'remit', 'remix', 'renal', 'renew', 'repay', 'repel', 'reply', 'reset', 'resin', 'retro', 'retry', 'reuse', 'reveal', 'rhino', 'rhyme', 'rider', 'rides', 'ridge', 'rifle', 'right', 'rigid', 'rigor', 'rinds', 'rings', 'rinse', 'riots', 'ripen', 'riper', 'risen', 'riser', 'rises', 'risky', 'rites', 'ritzy', 'rival', 'river', 'roads', 'roams', 'roars', 'roast', 'robes', 'robin', 'robot', 'rocks', 'rocky', 'rodeo', 'rogue', 'roles', 'rolls', 'roman', 'roofs', 'rooms', 'roomy', 'roots', 'ropes', 'roses', 'rotor', 'rouge', 'rough', 'round', 'route', 'rover', 'rowdy', 'royal', 'rugby', 'ruins', 'ruled', 'ruler', 'rules', 'rumor', 'rupee', 'rural', 'rusty',
    'sadly', 'safer', 'safes', 'saint', 'salad', 'sales', 'sally', 'salon', 'salsa', 'salty', 'salve', 'sandy', 'satin', 'sauce', 'saucy', 'sauna', 'saute', 'saved', 'saver', 'saves', 'savor', 'savvy', 'scald', 'scale', 'scalp', 'scaly', 'scamp', 'scams', 'scant', 'scare', 'scarf', 'scary', 'scene', 'scent', 'scone', 'scoop', 'scope', 'score', 'scorn', 'scout', 'scowl', 'scram', 'scrap', 'screw', 'scrub', 'seals', 'seams', 'seats', 'seeds', 'seedy', 'seeks', 'seize', 'sense', 'sepia', 'serve', 'setup', 'seven', 'sever', 'shade', 'shady', 'shaft', 'shake', 'shaky', 'shall', 'shame', 'shank', 'shape', 'shard', 'share', 'shark', 'sharp', 'shave', 'shawl', 'shear', 'sheds', 'sheen', 'sheep', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shiny', 'ships', 'shire', 'shirk', 'shirt', 'shock', 'shoes', 'shone', 'shook', 'shoot', 'shops', 'shore', 'short', 'shout', 'shove', 'shown', 'shows', 'showy', 'shrub', 'shrug', 'shuck', 'shunt', 'sides', 'siege', 'sight', 'sigma', 'signs', 'silky', 'silly', 'since', 'sinew', 'siren', 'sissy', 'sixth', 'sixty', 'sized', 'sizes', 'skate', 'skids', 'skill', 'skimp', 'skims', 'skins', 'skips', 'skirt', 'skulk', 'skull', 'skunk', 'slack', 'slain', 'slang', 'slant', 'slash', 'slate', 'slave', 'sleek', 'sleep', 'sleet', 'slept', 'slice', 'slick', 'slide', 'slime', 'slimy', 'sling', 'slink', 'slips', 'slobs', 'slops', 'slope', 'slosh', 'sloth', 'slots', 'slows', 'slugs', 'slums', 'slurp', 'slush', 'slyly', 'smack', 'small', 'smart', 'smash', 'smear', 'smell', 'smelt', 'smile', 'smirk', 'smite', 'smith', 'smock', 'smoke', 'smoky', 'snack', 'snafu', 'snags', 'snail', 'snake', 'snaky', 'snaps', 'snare', 'snarl', 'sneak', 'sneer', 'snide', 'sniff', 'snips', 'snobs', 'snoop', 'snore', 'snort', 'snout', 'snows', 'snowy', 'snubs', 'snuck', 'snuff', 'soaks', 'soaps', 'soapy', 'soars', 'sober', 'socks', 'sofas', 'soggy', 'soils', 'solar', 'solid', 'solve', 'sonar', 'songs', 'sonic', 'sooty', 'sorry', 'sorts', 'sound', 'soups', 'soupy', 'south', 'space', 'spade', 'spank', 'spans', 'spare', 'spark', 'spasm', 'spawn', 'speak', 'spear', 'specs', 'speed', 'spell', 'spend', 'spent', 'spice', 'spicy', 'spied', 'spies', 'spill', 'spine', 'spiny', 'spite', 'splat', 'split', 'spoil', 'spoke', 'spoof', 'spook', 'spool', 'spoon', 'spore', 'sport', 'spots', 'spout', 'spray', 'spree', 'sprig', 'spunk', 'spurn', 'spurt', 'squad', 'squat', 'squaw', 'squid', 'stack', 'staff', 'stage', 'stain', 'stair', 'stake', 'stale', 'stalk', 'stall', 'stamp', 'stand', 'stank', 'staph', 'stare', 'stark', 'stars', 'start', 'stash', 'state', 'stays', 'steak', 'steal', 'steam', 'steed', 'steel', 'steep', 'steer', 'stems', 'steps', 'stern', 'stews', 'stick', 'stiff', 'still', 'stilts', 'sting', 'stink', 'stint', 'stirs', 'stock', 'stoic', 'stoke', 'stole', 'stomp', 'stone', 'stony', 'stood', 'stool', 'stoop', 'stops', 'store', 'stork', 'storm', 'story', 'stout', 'stove', 'strap', 'straw', 'stray', 'strep', 'strip', 'strut', 'stuck', 'studs', 'study', 'stuff', 'stump', 'stung', 'stunk', 'stunt', 'style', 'suave', 'sugar', 'suite', 'suits', 'sulky', 'sunny', 'super', 'surge', 'surly', 'sushi', 'swamp', 'swaps', 'swarm', 'swear', 'sweat', 'sweep', 'sweet', 'swell', 'swept', 'swift', 'swims', 'swine', 'swing', 'swipe', 'swirl', 'swiss', 'sword', 'swore', 'sworn', 'swung', 'syrup',
    'table', 'taboo', 'tacit', 'tacky', 'taffy', 'taint', 'taken', 'taker', 'takes', 'tales', 'talks', 'tally', 'talon', 'tamed', 'tamer', 'tangy', 'tanks', 'taped', 'taper', 'tapes', 'tardy', 'taste', 'tasty', 'taunt', 'taxed', 'taxes', 'teach', 'teams', 'tears', 'teary', 'tease', 'teddy', 'teens', 'teeny', 'teeth', 'tempo', 'tempt', 'tends', 'tenor', 'tense', 'tenth', 'tents', 'terms', 'terra', 'tests', 'texts', 'thank', 'thaws', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thief', 'thigh', 'thing', 'think', 'third', 'thong', 'thorn', 'those', 'three', 'threw', 'throb', 'throw', 'thumb', 'thump', 'tidal', 'tides', 'tiger', 'tight', 'tiled', 'tiles', 'tilts', 'timed', 'timer', 'times', 'timid', 'tipsy', 'tired', 'titan', 'title', 'toast', 'today', 'toddy', 'token', 'tombs', 'tonal', 'toned', 'toner', 'tones', 'tongs', 'tonic', 'tools', 'tooth', 'topaz', 'topic', 'torch', 'total', 'totem', 'touch', 'tough', 'tours', 'towel', 'tower', 'towns', 'toxic', 'trace', 'track', 'tract', 'trade', 'trail', 'train', 'trait', 'tramp', 'trans', 'traps', 'trash', 'trawl', 'trays', 'tread', 'treat', 'trees', 'trend', 'trial', 'tribe', 'trick', 'tried', 'trier', 'tries', 'trims', 'trios', 'trips', 'trite', 'troll', 'tromp', 'troop', 'trope', 'trots', 'trout', 'truce', 'truck', 'truly', 'trump', 'trunk', 'trust', 'truth', 'tubby', 'tubes', 'tulip', 'tumor', 'tuned', 'tuner', 'tunes', 'tunic', 'turbo', 'turns', 'tutor', 'twang', 'tweak', 'tweed', 'tweet', 'twice', 'twigs', 'twine', 'twirl', 'twist', 'tying', 'typed', 'types',
    'udder', 'ulcer', 'ultra', 'umbra', 'uncle', 'under', 'undue', 'unfed', 'unfit', 'union', 'unite', 'units', 'unity', 'untie', 'until', 'upper', 'upset', 'urban', 'urged', 'urges', 'urine', 'usage', 'usher', 'using', 'usual', 'utter',
    'vague', 'valid', 'valor', 'value', 'valve', 'vapor', 'vault', 'vaunt', 'veins', 'veldt', 'venom', 'venue', 'verbs', 'verge', 'verse', 'vibes', 'video', 'views', 'vigor', 'viper', 'viral', 'virus', 'visor', 'visit', 'vista', 'vital', 'vivid', 'vixen', 'vocal', 'vodka', 'vogue', 'voice', 'voila', 'volts', 'vomit', 'voter', 'votes', 'vouch', 'vowel', 'vying',
    'wacky', 'waded', 'wader', 'wades', 'wager', 'wages', 'wagon', 'waist', 'waits', 'waken', 'wakes', 'walks', 'walls', 'waltz', 'wands', 'wants', 'wards', 'warms', 'warns', 'warps', 'warts', 'warty', 'wasps', 'waste', 'watch', 'water', 'watts', 'waved', 'waver', 'waves', 'weals', 'weans', 'wears', 'weary', 'weave', 'webby', 'wedge', 'weeds', 'weedy', 'weeks', 'weigh', 'weird', 'wells', 'welsh', 'wench', 'wetly', 'whale', 'wharf', 'wheat', 'wheel', 'where', 'which', 'whiff', 'while', 'whine', 'whiny', 'whips', 'whirl', 'whisk', 'white', 'whole', 'whomp', 'whoop', 'whose', 'wicks', 'widen', 'wider', 'widow', 'width', 'wield', 'wifey', 'wilds', 'wills', 'wimpy', 'wince', 'winch', 'winds', 'windy', 'wines', 'wings', 'winks', 'wiped', 'wiper', 'wipes', 'wired', 'wires', 'wised', 'wiser', 'wisps', 'wispy', 'witch', 'witty', 'wives', 'woken', 'wolfs', 'woman', 'women', 'wombs', 'woods', 'woody', 'woozy', 'words', 'wordy', 'works', 'world', 'worms', 'wormy', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'woven', 'wrack', 'wraps', 'wrath', 'wreak', 'wreck', 'wrest', 'wring', 'wrist', 'write', 'wrong', 'wrote', 'wryly',
    'yacht', 'yanks', 'yards', 'yarns', 'yawns', 'yearn', 'years', 'yeast', 'yells', 'yelps', 'yield', 'yolks', 'young', 'yours', 'youth', 'yucky', 'yummy',
    'zappy', 'zesty', 'zilch', 'zincs', 'zingy', 'zippy', 'zonal', 'zones', 'zooms',

    // 6-letter words
    'absorb', 'accent', 'accept', 'access', 'accord', 'across', 'action', 'active', 'actors', 'actual', 'admire', 'admits', 'adopts', 'advice', 'advise', 'affair', 'affect', 'afford', 'afraid', 'agency', 'agenda', 'agents', 'agreed', 'agrees', 'aiming', 'albums', 'alerts', 'aliens', 'allied', 'allies', 'almost', 'always', 'amazed', 'amount', 'anchor', 'angels', 'angler', 'angles', 'animal', 'annual', 'answer', 'anyone', 'anyway', 'appeal', 'appear', 'apples', 'arabic', 'arenas', 'argued', 'argues', 'armour', 'around', 'arrest', 'arrive', 'arrows', 'artist', 'asleep', 'aspect', 'assert', 'assets', 'assign', 'assist', 'assume', 'assure', 'attach', 'attack', 'attend', 'august', 'author', 'autumn', 'avenue', 'awards', 'backed', 'backup', 'baking', 'ballet', 'banana', 'bandit', 'banker', 'barber', 'barely', 'barrel', 'basics', 'basket', 'battle', 'beacon', 'beaker', 'beards', 'bearer', 'beaten', 'beauty', 'became', 'become', 'begins', 'behalf', 'behave', 'behind', 'beings', 'belong', 'beyond', 'bishop', 'bitter', 'blamed', 'blanks', 'blazer', 'blends', 'blocks', 'bloody', 'blouse', 'boards', 'bodies', 'boiler', 'bomber', 'bonnet', 'border', 'boring', 'borrow', 'bottle', 'bottom', 'bought', 'bounce', 'bounds', 'brains', 'branch', 'brands', 'breach', 'breaks', 'breast', 'breath', 'breeds', 'bricks', 'bridge', 'bright', 'brings', 'broken', 'broker', 'bronze', 'bubble', 'bucket', 'budget', 'buffet', 'builds', 'bullet', 'bundle', 'burden', 'bureau', 'burger', 'buried', 'burner', 'button', 'buyers', 'buying', 'cables', 'calmed', 'camera', 'campos', 'campus', 'canada', 'canals', 'cancel', 'cancer', 'candle', 'carbon', 'career', 'caring', 'carpet', 'carrot', 'castle', 'casual', 'caught', 'caused', 'causes', 'cellar', 'cement', 'census', 'center', 'centre', 'chains', 'chairs', 'chance', 'change', 'chapel', 'charge', 'cheese', 'cheque', 'cherry', 'chosen', 'chunks', 'church', 'cinema', 'circle', 'cities', 'claims', 'clergy', 'clerks', 'client', 'climbs', 'clinic', 'clocks', 'closed', 'closer', 'closes', 'cloths', 'clouds', 'cloudy', 'coasts', 'coffee', 'collar', 'colour', 'column', 'combat', 'comedy', 'comics', 'coming', 'commit', 'common', 'comply', 'convey', 'cooked', 'cooker', 'cookie', 'copper', 'corner', 'cotton', 'counts', 'county', 'couple', 'coupon', 'course', 'courts', 'covers', 'create', 'credit', 'crimes', 'crisis', 'crowds', 'cruise', 'crying', 'custom', 'damage', 'danced', 'dancer', 'dances', 'danger', 'deadly', 'dealer', 'deaths', 'debate', 'decade', 'decent', 'decide', 'decked', 'deeply', 'defeat', 'defend', 'define', 'degree', 'delays', 'demand', 'denied', 'denies', 'depend', 'deputy', 'desert', 'design', 'desire', 'detail', 'detect', 'device', 'diesel', 'differ', 'dinner', 'direct', 'dishes', 'divide', 'divine', 'doctor', 'dollar', 'domain', 'donate', 'double', 'doubts', 'dozens', 'dragon', 'drains', 'drawer', 'dreams', 'drinks', 'driven', 'driver', 'drives', 'drying', 'duties', 'earned', 'easier', 'easily', 'easter', 'eating', 'editor', 'effect', 'effort', 'either', 'eleven', 'employ', 'empire', 'enable', 'ending', 'energy', 'engage', 'engine', 'enough', 'ensure', 'enters', 'entire', 'entity', 'equals', 'equity', 'escape', 'essays', 'estate', 'ethics', 'events', 'except', 'excess', 'excuse', 'expand', 'expect', 'expert', 'export', 'extend', 'extent', 'fabric', 'facing', 'factor', 'failed', 'fairly', 'fallen', 'family', 'famous', 'farmer', 'faster', 'father', 'faults', 'favour', 'feared', 'fellow', 'female', 'feudal', 'fiance', 'fierce', 'fights', 'figure', 'filing', 'filled', 'filter', 'finals', 'finder', 'finest', 'finger', 'finish', 'firmly', 'fiscal', 'fisher', 'fitted', 'flight', 'floods', 'floors', 'flower', 'flying', 'folder', 'follow', 'forced', 'forces', 'forest', 'forget', 'forgot', 'format', 'formed', 'former', 'fossil', 'foster', 'fought', 'fourth', 'frames', 'france', 'freeze', 'french', 'fridge', 'friend', 'fright', 'frozen', 'fruits', 'funded', 'future', 'gained', 'gallon', 'gamble', 'gaming', 'garage', 'garden', 'gather', 'gently', 'german', 'giving', 'glance', 'global', 'golden', 'gotten', 'govern', 'grades', 'grants', 'gravel', 'graves', 'greens', 'ground', 'groups', 'growth', 'guards', 'guests', 'guided', 'guides', 'guitar', 'guilty', 'habits', 'handed', 'handle', 'happen', 'hardly', 'hatred', 'headed', 'header', 'health', 'hearts', 'heated', 'heater', 'heaven', 'height', 'helmet', 'helped', 'helper', 'heroes', 'hidden', 'hiding', 'higher', 'highly', 'hockey', 'holder', 'hollow', 'honest', 'hoping', 'horses', 'hosted', 'hotels', 'hourly', 'houses', 'humans', 'hunger', 'hungry', 'hunter', 'ignore', 'images', 'immune', 'impact', 'import', 'impose', 'inches', 'income', 'indeed', 'indoor', 'inform', 'injury', 'insect', 'insert', 'inside', 'insist', 'intend', 'intent', 'invest', 'invite', 'island', 'issued', 'issues', 'itself', 'jacket', 'jersey', 'joined', 'joints', 'joseph', 'judges', 'jumped', 'jumper', 'jungle', 'junior', 'keeper', 'kicked', 'kidney', 'killed', 'killer', 'kindly', 'knight', 'labels', 'labour', 'lacked', 'ladder', 'landed', 'laptop', 'larger', 'lately', 'latest', 'latter', 'launch', 'lawyer', 'layers', 'laying', 'layout', 'leader', 'league', 'leaves', 'legacy', 'lender', 'length', 'lesson', 'letter', 'levels', 'liable', 'lights', 'likely', 'limits', 'linear', 'linked', 'liquid', 'listen', 'litter', 'little', 'lively', 'living', 'loaded', 'locals', 'locate', 'locked', 'locker', 'logged', 'lonely', 'longer', 'looked', 'losing', 'losses', 'lounge', 'lovely', 'lovers', 'loving', 'luxury', 'mainly', 'makers', 'making', 'manage', 'manner', 'manual', 'margin', 'marine', 'marked', 'marker', 'market', 'martin', 'master', 'matrix', 'matter', 'mature', 'medium', 'member', 'memory', 'mental', 'mentor', 'merely', 'merger', 'metals', 'method', 'middle', 'mining', 'minute', 'mirror', 'missed', 'mobile', 'models', 'modern', 'modify', 'moment', 'monkey', 'months', 'morals', 'mosaic', 'mostly', 'mother', 'motion', 'motors', 'mouths', 'moving', 'murder', 'muscle', 'museum', 'mutual', 'namely', 'nation', 'native', 'nature', 'nearby', 'nearly', 'neatly', 'needle', 'nicely', 'nights', 'nobody', 'nodded', 'normal', 'notice', 'notion', 'novels', 'number', 'nurses', 'object', 'obtain', 'occult', 'occupy', 'occurs', 'oceans', 'offers', 'office', 'offset', 'oldest', 'online', 'opened', 'opener', 'openly', 'oppose', 'option', 'orange', 'orders', 'organs', 'origin', 'others', 'outfit', 'output', 'outset', 'owners', 'owning', 'oxygen', 'packed', 'packet', 'palace', 'panels', 'papers', 'parade', 'parcel', 'parent', 'parish', 'parked', 'partly', 'passed', 'passes', 'pastor', 'patent', 'patrol', 'patron', 'paying', 'pencil', 'pension', 'people', 'pepper', 'period', 'permit', 'person', 'petrol', 'phones', 'photos', 'picked', 'picnic', 'pieces', 'pillar', 'pilots', 'places', 'plains', 'planes', 'planet', 'plants', 'plasma', 'plates', 'played', 'player', 'please', 'pledge', 'plenty', 'pocket', 'poetry', 'points', 'poison', 'police', 'policy', 'polish', 'polite', 'pollen', 'poorly', 'porter', 'pounds', 'powder', 'powers', 'praise', 'prayer', 'prefer', 'pretty', 'prices', 'priest', 'prince', 'prints', 'prison', 'prizes', 'profit', 'prompt', 'proper', 'proven', 'public', 'pulled', 'punish', 'pupils', 'purely', 'purple', 'pursue', 'pushed', 'puzzle', 'rabbit', 'racing', 'raised', 'ranges', 'ranked', 'rarely', 'rather', 'rating', 'ratios', 'reader', 'really', 'realms', 'reason', 'rebate', 'rebels', 'recall', 'recipe', 'record', 'reduce', 'reform', 'refuge', 'refuse', 'regard', 'regime', 'region', 'reject', 'relate', 'relief', 'remain', 'remedy', 'remind', 'remote', 'remove', 'rental', 'repair', 'repeat', 'replay', 'report', 'rescue', 'resign', 'resist', 'resort', 'result', 'resume', 'retail', 'retain', 'retire', 'return', 'reveal', 'review', 'revolt', 'reward', 'rhythm', 'ribbon', 'riches', 'riders', 'riding', 'rising', 'ritual', 'rivals', 'rivers', 'robust', 'rocket', 'rolled', 'roller', 'romans', 'rooted', 'rotate', 'rounds', 'routes', 'rubber', 'ruined', 'rulers', 'ruling', 'rumour', 'runner', 'runway', 'rushed', 'sacred', 'saddle', 'safari', 'safely', 'safety', 'saints', 'salads', 'salary', 'salmon', 'sample', 'saving', 'scared', 'scenes', 'scheme', 'school', 'scored', 'scores', 'screen', 'script', 'sealed', 'search', 'season', 'seated', 'second', 'secret', 'sector', 'secure', 'seeing', 'seemed', 'select', 'seller', 'senate', 'senior', 'senses', 'series', 'server', 'serves', 'settle', 'severe', 'shadow', 'shaken', 'shapes', 'shared', 'shares', 'sheets', 'shells', 'shield', 'shifts', 'shorts', 'should', 'showed', 'shower', 'siding', 'signal', 'signed', 'silent', 'silver', 'simple', 'simply', 'singer', 'single', 'sister', 'skills', 'sleeve', 'slight', 'slowly', 'smooth', 'soccer', 'social', 'socket', 'softer', 'solely', 'solved', 'sorted', 'sought', 'sounds', 'source', 'spaces', 'speaks', 'sphere', 'spirit', 'splash', 'spoken', 'sports', 'spouse', 'spread', 'spring', 'square', 'stable', 'staged', 'stages', 'stairs', 'stamps', 'stance', 'stands', 'starts', 'stated', 'states', 'status', 'steady', 'stereo', 'sticky', 'stocks', 'stolen', 'stones', 'stored', 'stores', 'storms', 'strain', 'strand', 'stream', 'street', 'stress', 'strict', 'strike', 'string', 'strips', 'stroke', 'strong', 'struck', 'studio', 'stupid', 'styles', 'submit', 'suburb', 'sudden', 'suffer', 'summer', 'summit', 'sunday', 'sunset', 'superb', 'supply', 'surely', 'survey', 'switch', 'symbol', 'system', 'tables', 'tablet', 'tackle', 'tactic', 'talked', 'tanker', 'target', 'taught', 'taylor', 'teaser', 'temple', 'tenant', 'tender', 'tennis', 'terror', 'tested', 'thanks', 'theory', 'thighs', 'things', 'thinks', 'thirty', 'though', 'thread', 'threat', 'thrill', 'throne', 'thrown', 'throws', 'thrust', 'thumbs', 'ticket', 'tigers', 'timber', 'timing', 'tissue', 'titles', 'toward', 'towers', 'traced', 'tracks', 'trader', 'trades', 'trains', 'traits', 'travel', 'treats', 'trends', 'trials', 'tribes', 'tricks', 'troops', 'trophy', 'trucks', 'trusts', 'truths', 'trying', 'tunnel', 'turkey', 'turned', 'turtle', 'twelve', 'twenty', 'typing', 'unable', 'undone', 'unfair', 'unique', 'united', 'unless', 'unlike', 'unlock', 'unpaid', 'unsafe', 'unseen', 'update', 'uphill', 'uproar', 'upward', 'urgent', 'useful', 'valley', 'valued', 'values', 'varied', 'varies', 'velvet', 'vendor', 'venues', 'verbal', 'versus', 'victim', 'videos', 'viewed', 'viewer', 'viking', 'villas', 'violet', 'violin', 'virtue', 'vision', 'visits', 'visual', 'vocals', 'voices', 'volume', 'voters', 'voting', 'waited', 'waiter', 'walked', 'walker', 'wallet', 'wander', 'wanted', 'warmer', 'warmly', 'warmth', 'warned', 'washed', 'wastes', 'waters', 'wealth', 'weapon', 'weekly', 'weight', 'whilst', 'wholly', 'wicked', 'widely', 'willed', 'window', 'winner', 'winter', 'wiping', 'wisdom', 'wishes', 'within', 'wizard', 'wolves', 'wonder', 'wooden', 'worker', 'worlds', 'worthy', 'wounds', 'wright', 'writer', 'writes', 'yellow', 'yields', 'yogurt', 'youths', 'zigzag', 'zombie', 'zoning',

    // 7-letter words
    'ability', 'absence', 'academy', 'account', 'accused', 'achieve', 'acquire', 'actions', 'actress', 'adapted', 'address', 'adjourn', 'adopted', 'advance', 'adverse', 'advised', 'adviser', 'affairs', 'affects', 'against', 'agendas', 'airport', 'alcohol', 'alleged', 'allowed', 'already', 'altered', 'amazing', 'amongst', 'amounts', 'analyst', 'ancient', 'animals', 'annexed', 'annoyed', 'answers', 'anxiety', 'anxious', 'anybody', 'anytime', 'applied', 'applies', 'appoint', 'approve', 'archive', 'arguing', 'arising', 'arrange', 'arrival', 'arrived', 'arrives', 'article', 'artists', 'artwork', 'aspects', 'assault', 'asserts', 'assumed', 'assured', 'athlete', 'attacks', 'attempt', 'attract', 'auction', 'authors', 'average', 'avoided', 'awarded', 'awesome', 'backing', 'balance', 'banking', 'barrier', 'bearing', 'beating', 'because', 'becomes', 'bedroom', 'believe', 'belongs', 'beneath', 'benefit', 'besides', 'biggest', 'binding', 'bizarre', 'blanket', 'blessed', 'blocked', 'bombing', 'booking', 'borders', 'borough', 'bottles', 'bracket', 'broader', 'broadly', 'brother', 'brought', 'browser', 'buckets', 'budgets', 'builder', 'builds', 'burdens', 'burning', 'cabinet', 'calling', 'cameras', 'camping', 'cancels', 'capable', 'capital', 'captain', 'capture', 'careers', 'careful', 'carried', 'carrier', 'carries', 'castles', 'catalog', 'catches', 'causing', 'ceiling', 'central', 'centres', 'century', 'ceramic', 'certain', 'chamber', 'chances', 'changed', 'changes', 'channel', 'chapter', 'charged', 'charges', 'charity', 'charter', 'cheaper', 'checked', 'chicken', 'choices', 'chronic', 'circles', 'circuit', 'citizen', 'claimed', 'classes', 'classic', 'cleaned', 'cleaner', 'clearly', 'climate', 'climbed', 'closely', 'closing', 'clothes', 'cluster', 'coaches', 'coastal', 'coating', 'cocaine', 'cognitive', 'collect', 'college', 'columns', 'combine', 'comfort', 'command', 'comment', 'commits', 'commons', 'compact', 'company', 'compare', 'compels', 'compete', 'complex', 'compose', 'compute', 'concept', 'concern', 'concise', 'conduct', 'confirm', 'connect', 'consent', 'consist', 'consult', 'contact', 'contain', 'content', 'contest', 'context', 'control', 'convert', 'conveys', 'cooking', 'cooling', 'copying', 'corners', 'correct', 'corrupt', 'costume', 'cottage', 'council', 'counsel', 'counter', 'country', 'coupled', 'couples', 'courage', 'courses', 'covered', 'crashes', 'created', 'creates', 'credits', 'cricket', 'cracked', 'current', 'customs', 'cutting', 'damages', 'dancing', 'dangers', 'dealing', 'decided', 'decides', 'declare', 'decline', 'default', 'defence', 'defined', 'defines', 'degrees', 'delayed', 'deliver', 'demands', 'density', 'depends', 'deposit', 'depicts', 'deputy', 'derived', 'derives', 'deserts', 'deserve', 'designs', 'desired', 'desires', 'desktop', 'despair', 'despite', 'destroy', 'details', 'devoted', 'diamond', 'digital', 'diploma', 'directs', 'disable', 'discuss', 'disease', 'dismiss', 'display', 'dispute', 'distant', 'diverse', 'divided', 'divides', 'divorce', 'doctors', 'doesn', 'dollars', 'domains', 'donated', 'donates', 'doubled', 'doubles', 'drafted', 'drawing', 'dressed', 'drivers', 'driving', 'dropped', 'dubious', 'durable', 'dynamic', 'earlier', 'earning', 'eastern', 'economy', 'editing', 'edition', 'editors', 'educate', 'effects', 'efforts', 'elderly', 'elected', 'elegant', 'element', 'embassy', 'emerged', 'emotion', 'emperor', 'empires', 'employs', 'enabled', 'enables', 'enemies', 'engaged', 'engines', 'english', 'enhance', 'enjoyed', 'enormous', 'enquire', 'ensured', 'ensures', 'entered', 'entries', 'episode', 'equally', 'equates', 'erected', 'escaped', 'escapes', 'essence', 'estates', 'eternal', 'ethical', 'evening', 'evident', 'evolved', 'exactly', 'examine', 'example', 'exclude', 'execute', 'exhibit', 'existed', 'expands', 'expects', 'expense', 'experts', 'explain', 'explore', 'exports', 'exposed', 'express', 'extends', 'extract', 'extreme', 'fabrics', 'factors', 'factory', 'faculty', 'failing', 'failure', 'fairest', 'falling', 'falsely', 'farmers', 'farming', 'fashion', 'fastest', 'fatigue', 'fathers', 'favored', 'feature', 'federal', 'feeding', 'feeling', 'females', 'fiction', 'fifteen', 'fighter', 'figures', 'filling', 'finally', 'finance', 'finding', 'fingers', 'fishing', 'fitness', 'fitting', 'flights', 'florida', 'flowing', 'focuses', 'folders', 'follows', 'footage', 'foreign', 'forests', 'forever', 'formats', 'formula', 'fortune', 'forward', 'founded', 'founder', 'freedom', 'freight', 'friends', 'fulfill', 'funding', 'funeral', 'further', 'futures', 'gaining', 'gallery', 'gardens', 'gateway', 'gathers', 'general', 'genetic', 'genuine', 'getting', 'glasses', 'glimpse', 'goddess', 'granted', 'greatly', 'grounds', 'growing', 'granted', 'guitars', 'handful', 'handler', 'handles', 'hanging', 'happily', 'harbour', 'hardest', 'harmful', 'harmony', 'harvest', 'heading', 'healthy', 'hearing', 'heavily', 'heights', 'helping', 'herself', 'highest', 'highway', 'himself', 'history', 'hitting', 'holders', 'holding', 'holiday', 'honored', 'horizon', 'hormone', 'horrors', 'hostage', 'hostile', 'housing', 'however', 'hundred', 'hunters', 'hunting', 'husband', 'ideally', 'ignored', 'ignores', 'illegal', 'illness', 'imagine', 'imaging', 'impacts', 'implied', 'implies', 'imports', 'imposed', 'imposes', 'improve', 'include', 'indexes', 'indiana', 'indoors', 'induced', 'infants', 'informs', 'initial', 'injured', 'inquiry', 'insects', 'insider', 'insight', 'insists', 'inspect', 'install', 'instant', 'instead', 'insured', 'integer', 'intense', 'interim', 'interns', 'invalid', 'invests', 'invited', 'invites', 'invoice', 'involve', 'ireland', 'islands', 'isolate', 'italian', 'jackets', 'jerseys', 'johnson', 'joining', 'journal', 'journey', 'judging', 'justice', 'justify', 'keeping', 'kernels', 'keyword', 'kicking', 'killing', 'kingdom', 'kitchen', 'knights', 'knocked', 'knowing', 'labored', 'lacking', 'landing', 'largest', 'lasting', 'lateral', 'laughed', 'lawyers', 'layouts', 'leaders', 'leading', 'learned', 'learner', 'leather', 'leaving', 'lecture', 'legends', 'lengths', 'lessons', 'letters', 'liberal', 'liberty', 'library', 'license', 'lifting', 'lighter', 'lightly', 'limited', 'linking', 'liquids', 'listing', 'literal', 'located', 'locates', 'logical', 'longest', 'looking', 'lottery', 'loyalty', 'luggage', 'machine', 'madness', 'magical', 'mailing', 'managed', 'manager', 'manages', 'mandate', 'manners', 'mapping', 'margins', 'markets', 'marking', 'married', 'massive', 'masters', 'matched', 'matches', 'matters', 'maximum', 'meaning', 'measure', 'medical', 'meeting', 'members', 'memoirs', 'mention', 'mercury', 'merging', 'message', 'michael', 'midwest', 'million', 'mineral', 'minimum', 'minutes', 'miracle', 'mirrors', 'missing', 'mission', 'mistake', 'mixture', 'mobiles', 'models', 'modular', 'modules', 'moments', 'monitor', 'monthly', 'morning', 'mothers', 'mounted', 'musical', 'mystery', 'nations', 'natural', 'nearest', 'neither', 'nervous', 'network', 'neutral', 'nominal', 'notable', 'nothing', 'notices', 'notions', 'novelty', 'nowhere', 'nuclear', 'numbers', 'nursing', 'oakland', 'objects', 'obliged', 'obscure', 'observe', 'obtains', 'obvious', 'october', 'offense', 'offered', 'officer', 'offices', 'offline', 'ongoing', 'opening', 'operate', 'opinion', 'optimal', 'options', 'oranges', 'ordered', 'organic', 'origins', 'orleans', 'orphans', 'outcome', 'outdoor', 'outlook', 'outputs', 'outside', 'overall', 'overlap', 'oversee', 'package', 'painful', 'painted', 'painter', 'palette', 'pallets', 'panties', 'partial', 'parties', 'partner', 'passing', 'passion', 'passive', 'patents', 'pathway', 'patient', 'pattern', 'payment', 'penalty', 'pending', 'peoples', 'percent', 'perfect', 'perform', 'perhaps', 'periods', 'permits', 'persian', 'persist', 'persons', 'phoenix', 'phrases', 'picture', 'pioneer', 'placing', 'planned', 'planner', 'planted', 'plastic', 'players', 'playing', 'pleased', 'pleases', 'pledged', 'plotted', 'pointed', 'pointer', 'polices', 'politic', 'polling', 'polygon', 'popular', 'portion', 'possess', 'posting', 'potions', 'pottery', 'poverty', 'powered', 'praised', 'precise', 'predict', 'prefers', 'premier', 'premise', 'premium', 'prepare', 'present', 'pressed', 'prevent', 'priced', 'pricing', 'priests', 'primary', 'primers', 'princes', 'printed', 'printer', 'private', 'probing', 'problem', 'proceed', 'process', 'produce', 'product', 'profile', 'profits', 'program', 'project', 'promise', 'promote', 'prompts', 'propose', 'protect', 'protein', 'protest', 'proudly', 'provide', 'proving', 'publish', 'pulling', 'pumping', 'purpose', 'pursued', 'pursuit', 'pushing', 'putting', 'puzzles', 'qualify', 'quality', 'quantum', 'quarter', 'queries', 'quickly', 'quietly', 'quilted', 'radical', 'railway', 'rainbow', 'raising', 'rapidly', 'readers', 'readily', 'reading', 'reality', 'realize', 'realms', 'reasons', 'receive', 'recover', 'recruit', 'reduced', 'reduces', 'reflect', 'refunds', 'refuses', 'regards', 'regions', 'regular', 'related', 'relates', 'release', 'remains', 'remarks', 'reminds', 'remixed', 'removed', 'removes', 'renewal', 'renewed', 'repairs', 'replace', 'replied', 'replies', 'reports', 'request', 'require', 'rescued', 'rescues', 'reserve', 'resided', 'resolve', 'resorts', 'respect', 'respond', 'restore', 'results', 'resumed', 'retired', 'returns', 'reveals', 'revenge', 'revenue', 'reverse', 'revised', 'revises', 'revival', 'rewards', 'richard', 'rightly', 'roberts', 'rolling', 'romania', 'roughly', 'rounded', 'routine', 'royalty', 'rubbing', 'rulings', 'running', 'runtime', 'rushing', 'russian', 'sadness', 'sailing', 'savings', 'scaling', 'scandal', 'scatter', 'scenery', 'schemes', 'scholar', 'schools', 'science', 'scoring', 'scratch', 'screens', 'scripts', 'seating', 'seconds', 'secrecy', 'secrets', 'section', 'sectors', 'secured', 'seeking', 'segment', 'seizure', 'selects', 'selling', 'seminar', 'seniors', 'sensing', 'serious', 'servant', 'servers', 'service', 'serving', 'session', 'setback', 'setting', 'settled', 'seventh', 'several', 'shadows', 'shallow', 'sharing', 'sharply', 'shelter', 'shifted', 'shipped', 'shocked', 'shorted', 'shortly', 'showing', 'shutout', 'shuttle', 'signals', 'silence', 'silicon', 'similar', 'simpler', 'sincere', 'singing', 'singles', 'sisters', 'sitting', 'sixteen', 'skilled', 'slavery', 'slender', 'sliding', 'slipped', 'smaller', 'smoking', 'society', 'soldier', 'solving', 'somehow', 'someone', 'sorting', 'sources', 'spanish', 'sparked', 'speaker', 'special', 'species', 'specify', 'spirits', 'sponsor', 'spotted', 'springs', 'squared', 'squares', 'stacked', 'stadium', 'staffed', 'stamped', 'staring', 'started', 'starter', 'stating', 'station', 'statues', 'staying', 'steamed', 'stephen', 'stepped', 'stereos', 'stewart', 'sticker', 'stimuli', 'stirred', 'stopped', 'storage', 'stories', 'storing', 'strange', 'strands', 'streams', 'streets', 'stretch', 'strikes', 'strings', 'stripes', 'strives', 'strokes', 'studios', 'studied', 'studies', 'stuffed', 'subject', 'submits', 'succeed', 'success', 'suffers', 'suggest', 'suicide', 'summary', 'summers', 'summons', 'sunrise', 'support', 'suppose', 'supreme', 'surface', 'surgery', 'surplus', 'surpris', 'surveys', 'survive', 'suspect', 'suspend', 'sustain', 'sweater', 'swedish', 'symbols', 'systems', 'tactics', 'talents', 'talking', 'targets', 'teachers', 'teenage', 'telling', 'temples', 'tension', 'terrain', 'testing', 'textual', 'texture', 'theatre', 'therapy', 'thereby', 'therein', 'thereof', 'thicker', 'thirdly', 'thomson', 'thoreau', 'thought', 'threads', 'threats', 'through', 'thunder', 'tickets', 'tightly', 'timothy', 'tissues', 'tobacco', 'tonight', 'toolkit', 'totally', 'touched', 'touches', 'tougher', 'touring', 'tourism', 'tourist', 'towards', 'tracker', 'trading', 'traffic', 'tragedy', 'trailer', 'trained', 'trainer', 'transit', 'travels', 'treated', 'treaties', 'tribune', 'tribute', 'trigger', 'trillion', 'triumph', 'trouble', 'trusted', 'trustee', 'tuition', 'tunnels', 'turning', 'twisted', 'typical', 'ukraine', 'uncanny', 'unclear', 'undergo', 'unhappy', 'uniform', 'unified', 'unknown', 'unlawful', 'unlikely', 'unnamed', 'unusual', 'updated', 'updates', 'upgrade', 'uploads', 'upscale', 'upwards', 'useless', 'usually', 'utility', 'vacated', 'vaccine', 'valleys', 'vampire', 'vanilla', 'variety', 'various', 'vendors', 'venture', 'verdict', 'version', 'vessels', 'veteran', 'victims', 'victory', 'viewing', 'village', 'vintage', 'violent', 'violets', 'virtual', 'visible', 'visited', 'visitor', 'vitamin', 'volcano', 'volumes', 'wanting', 'warning', 'warrant', 'wasting', 'watched', 'watches', 'wealthy', 'weapons', 'wearing', 'weather', 'webcast', 'website', 'wedding', 'weekday', 'weekend', 'weighed', 'welcome', 'welfare', 'western', 'whatever', 'whereas', 'whether', 'whisper', 'whoever', 'widgets', 'william', 'willing', 'windows', 'winning', 'winters', 'wireless', 'witness', 'wonders', 'workers', 'working', 'worried', 'worship', 'wrappers', 'wrapped', 'writers', 'writing', 'written', 'younger', 'yourself', 'zealand', 'zombies'
]);

// Daily puzzle sets - each has 7 letters with many possible words
const PUZZLE_SETS = [
    { letters: ['T', 'R', 'A', 'I', 'N', 'E', 'S'], centerLetter: 'T' },
    { letters: ['P', 'L', 'A', 'Y', 'E', 'R', 'S'], centerLetter: 'A' },
    { letters: ['C', 'H', 'A', 'N', 'G', 'E', 'S'], centerLetter: 'C' },
    { letters: ['M', 'O', 'N', 'S', 'T', 'E', 'R'], centerLetter: 'O' },
    { letters: ['G', 'A', 'R', 'D', 'E', 'N', 'S'], centerLetter: 'G' },
    { letters: ['W', 'I', 'N', 'T', 'E', 'R', 'S'], centerLetter: 'W' },
    { letters: ['S', 'P', 'R', 'I', 'N', 'G', 'S'], centerLetter: 'P' },
    { letters: ['F', 'L', 'O', 'W', 'E', 'R', 'S'], centerLetter: 'F' },
    { letters: ['S', 'U', 'M', 'M', 'E', 'R', 'S'], centerLetter: 'U' },
    { letters: ['A', 'U', 'T', 'U', 'M', 'N', 'S'], centerLetter: 'A' },
    { letters: ['B', 'R', 'I', 'G', 'H', 'T', 'S'], centerLetter: 'B' },
    { letters: ['S', 'T', 'O', 'R', 'I', 'E', 'S'], centerLetter: 'T' },
    { letters: ['D', 'R', 'E', 'A', 'M', 'E', 'R'], centerLetter: 'D' },
    { letters: ['L', 'E', 'A', 'D', 'E', 'R', 'S'], centerLetter: 'L' },
    { letters: ['T', 'E', 'A', 'C', 'H', 'E', 'R'], centerLetter: 'E' },
    { letters: ['S', 'I', 'N', 'G', 'E', 'R', 'S'], centerLetter: 'I' },
    { letters: ['D', 'A', 'N', 'C', 'E', 'R', 'S'], centerLetter: 'N' },
    { letters: ['P', 'A', 'I', 'N', 'T', 'E', 'R'], centerLetter: 'P' },
    { letters: ['W', 'R', 'I', 'T', 'E', 'R', 'S'], centerLetter: 'W' },
    { letters: ['H', 'U', 'N', 'T', 'E', 'R', 'S'], centerLetter: 'H' },
    { letters: ['C', 'R', 'A', 'F', 'T', 'E', 'R'], centerLetter: 'C' },
    { letters: ['M', 'A', 'S', 'T', 'E', 'R', 'S'], centerLetter: 'M' },
    { letters: ['P', 'L', 'A', 'N', 'E', 'T', 'S'], centerLetter: 'L' },
    { letters: ['O', 'C', 'E', 'A', 'N', 'I', 'C'], centerLetter: 'O' },
    { letters: ['C', 'O', 'A', 'S', 'T', 'E', 'R'], centerLetter: 'A' },
    { letters: ['T', 'R', 'A', 'V', 'E', 'L', 'S'], centerLetter: 'T' },
    { letters: ['W', 'O', 'R', 'L', 'D', 'S', 'E'], centerLetter: 'R' },
    { letters: ['F', 'A', 'M', 'I', 'L', 'Y', 'S'], centerLetter: 'F' },
    { letters: ['F', 'R', 'I', 'E', 'N', 'D', 'S'], centerLetter: 'R' },
    { letters: ['H', 'A', 'P', 'P', 'Y', 'I', 'S'], centerLetter: 'H' }
];

// Game state
let currentPuzzle = null;
let selectedLetters = [];
let foundWords = [];
let score = 0;
let todayDate = '';

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

// Get today's date string
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Get daily puzzle based on date
function getDailyPuzzle(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % PUZZLE_SETS.length;
    return PUZZLE_SETS[index];
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Check if word can be made from letters
function canMakeWord(word, availableLetters) {
    const letterPool = [...availableLetters.map(l => l.toLowerCase())];
    for (const char of word.toLowerCase()) {
        const index = letterPool.indexOf(char);
        if (index === -1) return false;
        letterPool.splice(index, 1);
    }
    return true;
}

// Check if word contains center letter
function containsCenterLetter(word, centerLetter) {
    return word.toLowerCase().includes(centerLetter.toLowerCase());
}

// Calculate word score
function calculateWordScore(word) {
    if (word.length === 3) return 1;
    if (word.length === 4) return 1;
    if (word.length === 5) return 2;
    if (word.length === 6) return 3;
    if (word.length === 7) return 5;
    return word.length;
}

// Render letter tiles
function renderLetterTiles() {
    const tilesEl = document.getElementById('letter-tiles');
    tilesEl.innerHTML = '';

    // Shuffle letters for display (but keep center letter in middle)
    const otherLetters = currentPuzzle.letters.filter(l => l !== currentPuzzle.centerLetter);
    const shuffledOthers = shuffleArray(otherLetters);

    // Create hexagonal layout - center letter in middle
    const displayLetters = [
        ...shuffledOthers.slice(0, 3),
        currentPuzzle.centerLetter,
        ...shuffledOthers.slice(3)
    ];

    displayLetters.forEach((letter, index) => {
        const tile = document.createElement('button');
        tile.className = 'letter-tile';
        if (letter === currentPuzzle.centerLetter) {
            tile.classList.add('center');
        }
        tile.textContent = letter;
        tile.dataset.letter = letter;
        tile.dataset.index = index;
        tile.addEventListener('click', () => selectLetter(letter, index));
        tilesEl.appendChild(tile);
    });
}

// Select a letter
function selectLetter(letter, index) {
    selectedLetters.push({ letter, index });
    updateCurrentWord();

    // Highlight selected tile
    const tiles = document.querySelectorAll('.letter-tile');
    tiles[index].classList.add('selected');
}

// Update current word display
function updateCurrentWord() {
    const wordEl = document.getElementById('current-word');
    wordEl.textContent = selectedLetters.map(s => s.letter).join('');
}

// Clear current word
function clearWord() {
    selectedLetters = [];
    updateCurrentWord();
    document.querySelectorAll('.letter-tile').forEach(tile => {
        tile.classList.remove('selected');
    });
    showMessage('', '');
}

// Shuffle displayed letters
function shuffleLetters() {
    renderLetterTiles();
    clearWord();
}

// Show message
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'word-salad-message';
    if (type) {
        messageEl.classList.add(type);
    }
}

// Submit word
async function submitWord() {
    const word = selectedLetters.map(s => s.letter).join('').toLowerCase();

    if (word.length < 3) {
        showMessage('Words must be at least 3 letters', 'error');
        return;
    }

    if (!containsCenterLetter(word, currentPuzzle.centerLetter)) {
        showMessage(`Must use center letter (${currentPuzzle.centerLetter})`, 'error');
        return;
    }

    if (foundWords.includes(word)) {
        showMessage('Already found!', 'error');
        clearWord();
        return;
    }

    if (!VALID_WORDS.has(word)) {
        showMessage('Not a valid word', 'error');
        return;
    }

    // Valid word!
    const points = calculateWordScore(word);
    score += points;
    foundWords.push(word);

    showMessage(`+${points} point${points > 1 ? 's' : ''}!`, 'valid');

    // Update displays
    document.getElementById('score').textContent = score;
    document.getElementById('words-count').textContent = foundWords.length;

    // Add to found words list
    renderFoundWords();

    // Save progress
    await saveProgress();

    clearWord();
}

// Render found words
function renderFoundWords() {
    const listEl = document.getElementById('words-list');
    // Sort by length, then alphabetically
    const sorted = [...foundWords].sort((a, b) => {
        if (b.length !== a.length) return b.length - a.length;
        return a.localeCompare(b);
    });
    listEl.innerHTML = sorted.map(word => `<span class="found-word">${word}</span>`).join('');
}

// Load saved progress
async function loadProgress() {
    try {
        const res = await fetch(`/api/games/word-salad/daily?date=${todayDate}`);
        if (res.ok) {
            const data = await res.json();
            if (data.result) {
                foundWords = data.result.details.words || [];
                score = data.result.details.score || 0;
                document.getElementById('score').textContent = score;
                document.getElementById('words-count').textContent = foundWords.length;
                renderFoundWords();

                // Show arena link
                document.getElementById('arena-link').style.display = 'block';
            }
        }
    } catch (err) {
        console.error('Failed to load progress:', err);
    }
}

// Save progress
async function saveProgress() {
    try {
        await fetch('/api/games/word-salad/result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                score,
                words: foundWords,
                date: todayDate
            })
        });

        // Show arena link after first word
        document.getElementById('arena-link').style.display = 'block';
    } catch (err) {
        console.error('Failed to save progress:', err);
    }
}

// Handle keyboard input
function handleKeyboard(e) {
    const key = e.key.toUpperCase();

    if (key === 'ENTER') {
        submitWord();
        return;
    }

    if (key === 'BACKSPACE') {
        if (selectedLetters.length > 0) {
            const removed = selectedLetters.pop();
            updateCurrentWord();
            const tiles = document.querySelectorAll('.letter-tile');
            tiles[removed.index].classList.remove('selected');
        }
        return;
    }

    // Check if key is one of the available letters
    const tiles = document.querySelectorAll('.letter-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].dataset.letter === key && !tiles[i].classList.contains('selected')) {
            selectLetter(key, i);
            break;
        }
    }
}

// Event listeners
document.getElementById('shuffle-btn').addEventListener('click', shuffleLetters);
document.getElementById('clear-btn').addEventListener('click', clearWord);
document.getElementById('submit-btn').addEventListener('click', submitWord);
document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('game-modal').classList.remove('show');
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
});

document.addEventListener('keydown', handleKeyboard);

// Initialize game
async function init() {
    const user = await checkAuth();
    if (!user) return;

    document.getElementById('username').textContent = user.username;

    todayDate = getTodayDate();
    currentPuzzle = getDailyPuzzle(todayDate);

    renderLetterTiles();
    await loadProgress();
}

init();
