const colors = require('colors')

const prefixes 	= require('./tools/prefixes.json')
const middles 	= require('./tools/middles.json')
const suffixes 	= require('./tools/suffixes.json')

function getInsult() {

	const getValue 	= (field) 				=> { return field[getRand(0, field.length)] 					}
	const getRand 	= (min, max) 			=> { return Math.floor((Math.random()) * max) + min 			}
	const toUpper 	= (string)				=> { return string.charAt(0).toUpperCase() + string.slice(1)	}

	const hasVowel 	= (string) 				=> { return /[aeiouâéè]/i.test(string[0])						}
	const isFemale 	= (word) 				=> { return word.gender.toLowerCase() == 'female'	 			}

	const $prefixes = prefixes.filter(pre => pre.name !== "")
	const $middles 	= middles.filter(mid => mid.name !== "")
	const $suffixes = suffixes.filter(suf => suf.name !== "")

	let pre = getValue($prefixes)
	let mid = getValue($middles)
	let suf = getValue($suffixes)

	const preEnds = pre.name.split(" ").pop()

	switch(preEnds) {

		case "de":
			if (hasVowel(mid.name)) 	pre.name = pre.name.replace(" de", " d'")
			break;

		case "d'":
			if (!hasVowel(mid.name)) 	pre.name = pre.name.replace(" d'", " de")
			break;

		case "le":
			if (isFemale(mid)) 			pre.name = pre.name.replace(" le", " la")
			if (hasVowel(mid.name)) 	pre.name = pre.name.replace(" le", " l'")
			break;

		case "la":
			if (!isFemale(mid)) 		pre.name = pre.name.replace(" la", " le")
			if (hasVowel(mid.name)) 	pre.name = pre.name.replace(" la", " l'")
			break;

		case "l'":
			if (!isFemale(mid)) 		pre.name = pre.name.replace(" l'", " le")
			if (isFemale(mid)) 			pre.name = pre.name.replace(" l'", " la")
			if (!hasVowel(mid.name)) 	pre.name = pre.name.replace(" l'", " le")
			break;
	}

	const range = getRand(1, 100)
	const insultLength = range < 15
		? 1
		: range > 60
			? 2
			: 3
	
	const $pre = `${pre.name}${pre.name.endsWith('\'') ? '' : ' '}`
	const $mid = mid.name
	const $suf = `${suf.name.endsWith('é') && mid.gender == 'female' ? `${suf.name}e` : suf.name }`

	var insult

	switch (insultLength) {
		case 1:
			insult = $mid
			break

		case 2:
			insult = getRand(0, 10) > 5
				? `${$pre}${$mid}`
				: `${$mid} ${$suf}`
			break

		case 3:
			insult = `${$pre}${$mid} ${$suf}`
			break
	}

	insult =  `${toUpper(insult)}.`
	return insult

}

function main() {
	const insultCount 	= 150

	const sortInsults 	= false
	const stackInsults 	= true
	
	const showInsults 	= true
	const log 			= (data) => { if (showInsults) console.log(data) }

	let insults = []
	for (let i = 0; i < insultCount; i++) {
		const insult = getInsult()

		stackInsults
			? insults.push(insult)
			: log(insult)
	}

	insults = sortInsults
		? insults
			.sort((a, b) => { return a.length - b.length })
			.reverse()
		: insults

	if (stackInsults) log(insults.join('\n'))
}
main()