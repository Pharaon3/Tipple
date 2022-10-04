let formatCurrency = function(sign ,n, precision, cc, delimiter, thousands){

	precision = Math.abs(precision);

	let p = 1;
	for (let ii = 0; ii < precision; ii++) {
		p = p*10;
	}

	n = (n/p);

    let c = isNaN(cc = Math.abs(cc)) ? 2 : cc;
    let d = delimiter === undefined ? "." : delimiter;
    let t = thousands === undefined ? "," : thousands; 
    let s = n < 0 ? "-" : "";
    let i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
    let j = i.length; 
    j = j > 3 ? j % 3 : 0;

    return s + sign + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

export default formatCurrency;