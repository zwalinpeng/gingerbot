const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
    id: String,
    name: String,
    ss: String,
    pull: String,
    icon: String,
    phrase: String
});

module.exports = {
    cookie: mongoose.model('Cookie', cookieSchema),
    common: ['gbv', 'ang', 'bee', 'mus', 'nin', 'stb', 'wiz'],
    rare: ['adv', 'alc', 'avo', 'bkb', 'crt', 'chr', 'clv', 'cst', 'dvl', 'gmb', 'knt', 'oni', 'pnc', 'prc'],
    epic: ['aff', 'alm', 'brn', 'cpp', 'coa', 'ctn', /*'cpf'*/, 'dch', 'ecl', 'esp', 'fig', 'hrb', 'kmh', 'lat', 'lcr',
            'llc', 'mdl', 'mls', 'mng', 'mlk', 'mch', 'mrb', 'pft', 'pty', 'pmr', 'pgt', 'pkp', 'pym', 'rsb', 'rvt',
            'rye', 'ssg', 'ssk', 'spk', 'sqi', 'scp', 'tkn', 'tly', 'tgm', 'vmp', 'wrw'],
    legend: ['fqn', 'sfy'],
    ancient: ['dcc', 'hby', 'pvn']
};