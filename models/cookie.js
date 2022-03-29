const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
    id: String,
    name: String,
    ss: String,
    pull: String,
    icon: String,
    phrase: String,
    card: String,
    rarity: Number
});

module.exports = {
    cookie: mongoose.model('Cookie', cookieSchema),
    common: ['gbv', 'ang', 'bee', 'mus', 'nin', 'stb', 'wiz'], //rarity 1
    rare: ['adv', 'alc', 'avo', 'bkb', 'crt', 'chr', 'clv', 'cst', 'dvl', 'gmb', 'knt', 'oni', 'pnc', 'prc'], //rarity 2
    epic: ['aff', 'alm', 'brn', 'cma', 'cpp', 'coa', 'ctn', /*'cpf'*/, 'dch', 'ecl', 'esp', 'fig', 'hrb', 'kmh', 'lat', 'lcr',
            'llc', 'mdl', 'mls', 'mng', 'mlk', 'mch', 'mrb', 'pft', 'pty', 'pmr', 'pgt', 'pkp', 'pym', 'rsb', 'rvt',
            'rye', 'ssg', 'ssk', 'spk', 'sqi', 'scp', 'tkn', 'tly', 'tgm', 'vmp', 'wrw'], //rarity 3
    legend: ['fqn', 'sfy'], //rarity 4
    ancient: ['dcc', 'hby', 'pvn'] //rarity 5
};