/*! Eretek Online Araçlar #88 — PLC Veri Tamponu Boyutlandırıcı */
ERT.def('88', {
	run: function (v, c) {
		var rec = (v.vb || 0) + (v.tb || 0) + (v.xb || 0), chg = (v.chg === null || v.chg === undefined ? 100 : v.chg) / 100, oh = (v.oh || 0) / 100;
		if (!(rec > 0)) { throw c.fe('vb', 'rec'); }
		var perS = v.tags * v.rate * chg * rec * (1 + oh), need = perS * v.hours * 3600, kv = [[c.t('rec'), rec + ' B'], [c.t('perS'), c.bytes(perS) + '/s'], [c.t('perH'), c.bytes(perS * 3600)], [c.t('need', { h: c.n(v.hours, 1) }), c.bytes(need)]], msgs = [], vv = { needMB: Math.round(need / 1e3) / 1e3 };
		if (v.mem) { var mb = v.mem * 1e6, h = mb / perS / 3600; vv.maxHours = Math.round(h * 100) / 100; kv.push([c.t('max'), c.n(h, 1) + ' ' + c.t('hours')]); msgs.push(need <= mb ? ['ok', c.t('fits')] : ['err', c.t('nofit', { h: c.n(h, 1) })]); }
		if (chg < 1) { msgs.push(['info', c.t('chgNote', { p: c.n(chg * 100, 0) })]); }
		msgs.push(['info', c.t('fifo')]);
		return { big: c.bytes(need), kv: kv, msgs: msgs, x: { copy: kv.map(function (k) { return k[0] + ': ' + k[1]; }).join('\n') }, v: vv };
	}
});
